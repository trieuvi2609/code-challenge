import React, { useMemo } from "react";
import { usePrices, useWalletBalances } from './hooks';
import WalletRow from './WalletRow';

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface BlockchainPriorities {
  Osmosis: number;
  Ethereum: number;
  Arbitrum: number;
  Zilliqa: number;
  Neo: number;
  default: number;
}

interface Props extends React.HTMLAttributes<HTMLDivElement>  {
  classes: {
    row: string;
  };
}

const BLOCKCHAIN_PRIORITIES: BlockchainPriorities = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
  default: -99,
};

const getPriority = (blockchain: string): number => {
  return (
    BLOCKCHAIN_PRIORITIES[blockchain as keyof BlockchainPriorities] ||
    BLOCKCHAIN_PRIORITIES.default
  );
};

export const WalletPage: React.FC<Props> = (props: Props) => {
  const { classes, ...rest } = props; // children prop is unused
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedBalances = useMemo(() => {
    const isBalanceRelevant = (balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      return balancePriority > -99 && balance.amount > 0;
    };
  
    const compareByPriorityDescending = (lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      return rightPriority - leftPriority;
    };
  
    return balances
      .filter(isBalanceRelevant)
      .sort(compareByPriorityDescending);
  }, [balances, getPriority]);

  const row = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance) =>  {
      const usdValue = prices[balance.currency] * balance.amount;
      const formattedBalance = balance.amount.toFixed(); 
      return <WalletRow
      className={classes.row}
      key={balance.currency} 
      amount={balance.amount}
      usdValue={usdValue}
      formattedAmount={formattedBalance}
    />
    })
  }, [sortedBalances]);

  return <div {...rest}>
    {row}</div>;
};

export default WalletPage;
