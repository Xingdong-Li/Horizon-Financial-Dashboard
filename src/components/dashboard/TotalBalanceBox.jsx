import React from "react";
import AnimatedCounter from "./AnimatedCounter";
import DoughnutChart from "./DoughnutChart";
const TotalBalanceBox = ({
  accounts = [],
}) => {
  const totalCurrentBalance = accounts.reduce(
    (acc, account) => acc + account.balances.current,
    0
  );
  return (
    <section className="total-balance">
      <div className="total-balance-chart">
        <DoughnutChart accounts={accounts} />
      </div>
      <div className="flex flex-col gap-6">
        <h2 className="header-2">Bank Accounts: {accounts.length}</h2>
        <div className="flex flex-col gap-2">
          <p className="total-balance-label">Total Current Balance</p>
          <div className="total-balance-amount flex-center gap-2">
            <AnimatedCounter amount={totalCurrentBalance} currency={accounts.length > 0 ? accounts[0].balances.iso_currency_code : 'USD'}/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TotalBalanceBox;
