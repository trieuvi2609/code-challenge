import React, { useMemo } from "react";

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // blockchain property was not defined in WalledBalance. So add this.
}

// use extends typescript
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}
interface BlockchainPriorities {
  Osmosis: number;
  Ethereum: number;
  Arbitrum: number;
  Zilliqa: number;
  Neo: number;
  default: number;
}

// Add classes prop
interface Props extends BoxProps {
  classes: {
    row: string;
  };
}

// Add export for component 
export const WalletPage: React.FC<Props> = (props: Props) => {
  const { classes, ...rest } = props; // children prop is unused
  const balances = useWalletBalances();
  const prices = usePrices();

  // Use a configuration object for priorities

  const blockchainPriorities: BlockchainPriorities = {
    Osmosis: 100,
    Ethereum: 50,
    Arbitrum: 30,
    Zilliqa: 20,
    Neo: 20,
    default: -99,
  };

  // Optimize getPriority func instead of using switch-case
  const getPriority = (blockchain: string): number => {
    return (
      blockchainPriorities[blockchain as keyof BlockchainPriorities] ||
      blockchainPriorities.default
    );
  };

  // Add getPriority into deps of useMemo to avoid bugs
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        return balancePriority > -99 && balance.amount > 0; // Fixed filtering logic
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        return rightPriority - leftPriority; // Simplified sorting logic
      });
  }, [balances, getPriority]);

  // formattedBalances should be memoized to avoid unnecessary recalculating.
  const formattedBalances = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance) => ({
      ...balance,
      formatted: balance.amount.toFixed(),
    }));
  }, [sortedBalances]);

  const rows = formattedBalances.map((balance: FormattedWalletBalance) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        className={classes.row}
        key={balance.currency} // Use a unique key instead of using index because the order of items may change. It can impact negatively performance and may cause issues with component state
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  return <div {...rest}>{rows}</div>;
};

export default WalletPage;
