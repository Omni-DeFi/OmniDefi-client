"use client";

import React, { useState } from "react";
import PairDropdown from "./PairDropdown";
import { TOKEN_TYPE } from "@/lib/types";
import { LabelValueRow } from "@/components/ui/label";
import { SwapInput } from "../SwapInput";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { swapSchema } from "@/lib/zod-validation";
import { useDebounceCallback } from "usehooks-ts";
import { useTokenStore } from "@/store/token-store";
import { useWeb3Store } from "@/store/signer-provider-store";
import { useAmmStore } from "@/store/amm-store";
import {
  REWARD_TOKEN_ADDRESS,
  STAKING_TOKEN_CONTRACT_ADDRESS,
} from "@/lib/constants";
import { ethers } from "ethers";
import { formatNumber } from "@/lib/utils";

type Props = {};

const ProvideLiquidity = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fromToken, setFromToken] = useState<TOKEN_TYPE>("DTX");
  const [toToken, setToToken] = useState<TOKEN_TYPE>("dUSD");
  const {
    availableStakingTokenBalance,
    availableRewardTokenBalance,
    tokenDetails,
    stakingTokenContract,
    rewardTokenContract,
    setAvailableStakingTokenBalance,
  } = useTokenStore();

  const {
    ammContract,
    priceToken1InToken2,
    priceToken2InToken1,
    setCurrentTokenPrices,
  } = useAmmStore();

  const {
    handleSubmit,
    setValue,
    register,
    getValues,
    setError,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<z.infer<typeof swapSchema>>({
    resolver: zodResolver(swapSchema),
    defaultValues: {
      fromAmount: "",
      toAmount: "",
    },
  });

  const handleTokenChange = (
    field: "fromToken" | "toToken",
    value: TOKEN_TYPE
  ) => {
    if (field === "fromToken") {
      setFromToken(value);
      setToToken(value === "DTX" ? "dUSD" : "DTX");
    } else {
      setToToken(value);
      setFromToken(value === "DTX" ? "dUSD" : "DTX");
    }
  };

  const getRequiredTokenAmountContract = async (
    fromOrTo: "fromAmount" | "toAmount",
    token: TOKEN_TYPE,
    amount: string
  ) => {
    if (token !== "DTX" && token !== "dUSD") return;
    if (!amount) {
      setValue(fromOrTo === "fromAmount" ? "toAmount" : "fromAmount", "");
      return;
    }

    try {
      if (!ammContract) return;
      let tokenAddress =
        token === "DTX" ? STAKING_TOKEN_CONTRACT_ADDRESS : REWARD_TOKEN_ADDRESS;

      const parsedAmount = ethers.parseUnits(amount, 18).toString();

      const details = await ammContract.getRequiredTokenAmount(
        tokenAddress,
        parsedAmount
      );

      const amountOut = ethers.formatUnits(details);
      setValue(
        fromOrTo === "fromAmount" ? "toAmount" : "fromAmount",
        formatNumber(amountOut, false)
      );
    } catch (error) {
      console.log("error in swap details..", error);
    }
  };

  const debouncedGetSwapDetails = useDebounceCallback(
    (
      fromOrTo: "fromAmount" | "toAmount",
      token: TOKEN_TYPE,
      amount: string
    ) => {
      getRequiredTokenAmountContract(fromOrTo, token, amount);
    },
    500
  );

  const getRequiredTokenAmount = async (
    fromOrTo: "fromAmount" | "toAmount",
    token: TOKEN_TYPE,
    amount: string
  ) => {
    if (!token || !amount) {
      if (fromOrTo === "fromAmount") {
        setValue("toAmount", "");
      } else {
        setValue("fromAmount", "");
      }
    }
    clearErrors();
    debouncedGetSwapDetails(fromOrTo, token, amount);
  };

  const onSubmit = handleSubmit(async (data) => {
    if (parseFloat(data.fromAmount) <= 0) {
      setError("fromAmount", {
        message: "Amount must be greater then zero ",
      });
      return;
    }

    if (fromToken === "DTX") {
      if (
        parseFloat(data.fromAmount) > parseFloat(availableStakingTokenBalance)
      ) {
        setError("fromAmount", {
          message: "Amount cannot be greater then the available DTX tokens",
        });
        return;
      }
    } else if (fromToken === "dUSD") {
      if (
        parseFloat(data.fromAmount) > parseFloat(availableRewardTokenBalance)
      ) {
        setError("fromAmount", {
          message: "Amount cannot be greater then the available dUSD tokens",
        });

        return;
      }
    }
    
    if (!ammContract || !stakingTokenContract || !rewardTokenContract) return;

    try {
      setIsLoading(true);
      console.log("data:", data);
    } catch (error) {}

    setIsLoading(false);
  });

  return (
    <div>
      <div className="py-2 space-y-2">
        <LabelValueRow
          className="ml-1"
          label="Select pair"
          tooltip="Which token pair would you like to add liquidity to."
        />
        <div className="grid lg:grid-cols-2 gap-4 items-center w-full">
          <PairDropdown
            defaultValue="DTX"
            onValueChange={(value: any) =>
              handleTokenChange("fromToken", value)
            }
            value={fromToken}
          />
          <PairDropdown
            defaultValue="dUSD"
            onValueChange={(value: any) => handleTokenChange("toToken", value)}
            value={toToken}
          />
        </div>
      </div>

      <form onSubmit={onSubmit} className="">
        <div className="space-y-2 py-2">
          <LabelValueRow
            className="ml-1"
            label="Deposit amounts"
            tooltip="Depending on your range, the supplied tokens for this position will not always be a 50:50 ratio."
          />

          <div>
            <SwapInput
              defaultValue={fromToken || "DTX"}
              selectValue={fromToken}
              disabled={isLoading}
              error={errors.fromAmount}
              isSelectDisabled={true}
              onSelectChange={(value: any) =>
                handleTokenChange("fromToken", value)
              }
              {...register("fromAmount")}
              onChange={(e) =>
                getRequiredTokenAmount("fromAmount", fromToken, e.target.value)
              }
              balance={`${formatNumber(availableStakingTokenBalance)} ${
                tokenDetails.dtx.symbol
              }`}
            />
            <div className="flex justify-center items-center !-mt-2 !-mb-2 relative z-50">
              <Button
                type="button"
                variant={"outline"}
                size={"icon"}
                className="text-muted-foreground rounded-full p-1 w-6 h-6"
              >
                <PlusIcon className="w-3 h-3" />
              </Button>
            </div>
            <SwapInput
              defaultValue={toToken || "DTX"}
              selectValue={toToken}
              isSelectDisabled={true}
              disabled={isLoading}
              error={errors.toAmount}
              onSelectChange={(value: any) =>
                handleTokenChange("toToken", value)
              }
              {...register("toAmount")}
              onChange={(e) =>
                getRequiredTokenAmount("toAmount", toToken, e.target.value)
              }
              balance={`${formatNumber(availableRewardTokenBalance)} ${
                tokenDetails.dusd.symbol
              }`}
            />
          </div>
        </div>
        <Button
          type="submit"
          loading={isLoading}
          size={"lg"}
          className="w-full mt-2"
        >
          Provide liquidity
        </Button>
      </form>
    </div>
  );
};

export default ProvideLiquidity;
