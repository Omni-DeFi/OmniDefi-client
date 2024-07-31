"use client";

import Swap from "@/components/AMM/Swap";
import { Button, buttonVariants } from "@/components/ui/button";
import { TabsNav } from "@/components/ui/TabsNav";
import { Heading } from "@/components/ui/Typography";
import { cn, formatNumber, formatNumberSmall } from "@/lib/utils";
import { useAmmStore } from "@/store/amm-store";
import { useTokenStore } from "@/store/token-store";
import {
  ArrowLeft,
  GitCommitVertical,
  SettingsIcon,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import InfoCard from "@/components/ui/InfoCard";
import { Badge } from "@/components/ui/badge";
import ProvideLiquidity from "@/components/AMM/Liquidity";
import Link from "next/link";
import RemoveLiquidity from "@/components/AMM/Liquidity/RemoveLiquidity";

type Props = {};

const Page = (props: Props) => {
  const [toggle, setToggle] = useState(false);
  const tokenDetails = useTokenStore().tokenDetails;
  const { priceToken1InToken2, priceToken2InToken1 } = useAmmStore();
  const tabItems = [
    {
      title: "Swap",
      href: "/amm/swap",
    },
  ];

  return (
    <div className="w-5/12 space-y-2 md:mt-8">
      {/* <div className="mb-4">
        <div className="space-y-1 mb-2">
          <Heading variant="h3">Withdraw your liquidity with ease.</Heading>
          <p className="text-muted-foreground text-sm">
            Removing liquidity allows you to reclaim your funds along with any
            earned fees. It&apos;s a straightforward process, giving you the
            flexibility to manage your investments as you see fit!
          </p>
        </div>
      </div> */}

      <div className="border rounded-lg p-2">
        <div className="flex justify-between items-center py-2">
          <div>
            <Link
              className={cn(buttonVariants({ size: "icon", variant: "ghost" }))}
              href={"/amm"}
            >
              <ArrowLeft className="text-muted-foreground w-6 h-6" />
            </Link>
          </div>
          <div>
            <Heading variant="h4">Remove liquidity</Heading>
          </div>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"ghost"} size={"icon"}>
                  <SettingsIcon className="text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Settings</h4>
                    <p className="text-sm text-muted-foreground">
                      Adjust to your personal preferences.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <InfoCard
                      title="Slippage"
                      icon={<GitCommitVertical />}
                      value={
                        <p className="flex items-center gap-x-2">
                          5%
                          <Badge variant="secondary">Auto</Badge>
                        </p>
                      }
                      subValue="of the amount"
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="pt-4"><RemoveLiquidity /></div>
      </div>
    </div>
  );
};

export default Page;