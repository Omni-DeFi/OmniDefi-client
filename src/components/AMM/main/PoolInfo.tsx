"use client";

import InfoCard from "@/components/ui/InfoCard";
import { formatNumber } from "@/lib/utils";
import { useAmmStore } from "@/store/amm-store";
import { useWeb3Store } from "@/store/signer-provider-store";
import { useTokenStore } from "@/store/token-store";
import { ethers } from "ethers";
import { DollarSignIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type Props = {};

const PoolInfo = (props: Props) => {
  const ammContract = useAmmStore().ammContract;
  const address = useWeb3Store().address;
  const tokenDetails = useTokenStore().tokenDetails;
  const [userLiquidityInTokens, setUserLiquidityInTokens] = useState({
    dtx: "0",
    dusd: "0",
    userLiquidity: "0",
    poolShare: "0",
  });

  const getMyLiquidity = async () => {
    console.log("here...");
    if (!ammContract) return;
    try {
      const info = await ammContract.getUserLiquidity(address);
      const userLiquidity = await ammContract.liquidity(address);
      const totalLiquidity = await ammContract.totalLiquidity();

      const formattedDtx = ethers.formatUnits(info[0]);
      const formattedDusd = ethers.formatUnits(info[1]);
      const formattedUserLiquidity = ethers.formatUnits(userLiquidity);
      const formattedTotalLiquidity = ethers.formatUnits(totalLiquidity);

      const poolShare =
        (parseFloat(formattedUserLiquidity) /
          parseFloat(formattedTotalLiquidity)) *
        100;

      setUserLiquidityInTokens({
        dtx: formattedDtx,
        dusd: formattedDusd,
        userLiquidity: formattedUserLiquidity,
        poolShare: poolShare.toFixed(2),
      });
    } catch (error) {
      console.log("error:", error);
    }
  };

  useEffect(() => {
    if (!address || !ammContract) return;
    getMyLiquidity();
  }, [address, ammContract]);

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 py-4 w-full lg:w-11/12 px-4 lg:px-0">
      <InfoCard
        icon={<Image width={20} height={20} src="/dtx-token.svg" alt="icon" />}
        title="Your Pooled DTX"
        value={`${formatNumber(userLiquidityInTokens.dtx)} ${
          tokenDetails.dtx.symbol
        }`}
        subValue="As of now"
      />
      <InfoCard
        icon={<Image width={20} height={20} src="/dtx-token.svg" alt="icon" />}
        title="Your Pooled dUSD"
        value={`${formatNumber(userLiquidityInTokens.dusd)} ${
          tokenDetails.dusd.symbol
        }`}
        subValue="As of now"
      />
      <InfoCard
        icon={<DollarSignIcon className="h-4 w-4 text-muted-foreground" />}
        title="Your Pool Share"
        value={`${userLiquidityInTokens.poolShare}%`}
        subValue="As of now"
      />
      <InfoCard
        icon={<DollarSignIcon className="h-4 w-4 text-muted-foreground" />}
        title="Your Total Pool tokens"
        value={`${formatNumber(userLiquidityInTokens.userLiquidity)}`}
        subValue="As of now"
      />
    </div>
  );
};

export default PoolInfo;