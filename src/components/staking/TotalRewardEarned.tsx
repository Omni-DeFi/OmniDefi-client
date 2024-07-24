import React from "react";
import InfoCard from "../ui/InfoCard";
import { Award } from "lucide-react";
import { GET_REWARDS_AMOUNT } from "@/lib/services/graphql/queries";
import { useQuery } from "@apollo/client";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { ethers } from "ethers";
import { formatNumber } from "@/lib/utils";

type Props = {};

const TotalRewardEarned = (props: Props) => {
  const { address } = useWeb3ModalAccount();
  const { loading, error, data } = useQuery(GET_REWARDS_AMOUNT, {
    variables: { user: address },
  });

  if (loading) {
    return (
      <InfoCard 
        loading={true}
        icon={<Award className="h-4 w-4 text-muted-foreground" />}
        title="Total Rewards earned"
        value="$45,231.89"
        subValue="excluding your current reward cycle"
      />
    );
  }

  const totalAmountInEther = data?.rewardsClaimeds?.reduce(
    (total: number, item: { amount: string }) => {
      const amountInEther = ethers.formatEther(item.amount);
      return total + parseFloat(amountInEther);
    },
    0
  );

  return (
    <div>
      <InfoCard
        icon={<Award className="h-4 w-4 text-muted-foreground" />}
        title="Total Rewards earned"
        value={`${formatNumber(totalAmountInEther) || "0.00"} dUSD`}
        subValue="excluding your current reward cycle"
      />
    </div>
  );
};

export default TotalRewardEarned;
