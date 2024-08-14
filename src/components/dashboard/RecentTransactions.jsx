import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { BankTabItem } from "./BankTabItem";
import BankInfo from "./BankInfo";
import TransactionsTable from "./TransactionsTable";
import { Pagination } from "./Pagination";
import React from "react";

const RecentTransactions = ({
  accounts,
  transactions = [],
  currentAccount,
  page = 1,
}) => {
  const rowsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  console.log("currentTransactions", currentTransactions);

  return (
    <section className="recent-transactions">
      <header className="flex items-center justify-between">
        <h2 className="recent-transactions-label">Recent transactions</h2>
        <Link
          to={`/transaction-history/?id=${currentAccount}`}
          className={`view-all-btn ${!currentTransactions.length ? 'hidden' : ''}`}
        >
          View all
        </Link>
      </header>

      {currentTransactions.length ? (
        <Tabs defaultValue={currentAccount} className="w-full">
          <TabsList className="recent-transactions-tablist">
            {accounts.map((account) => (
              <TabsTrigger key={account.account_id} value={account.account_id}>
                <BankTabItem
                  key={account.account_id}
                  account={account}
                  currentAccount={currentAccount}
                />
              </TabsTrigger>
            ))}
          </TabsList>

          {accounts.map((account) => (
            <TabsContent
              value={account.account_id}
              key={account.account_id}
              className="space-y-4"
            >
              <BankInfo
                account={account}
                currentAccount={currentAccount}
                type="full"
              />

              <TransactionsTable transactions={currentTransactions} />

              {totalPages > 1 && (
                <div className="my-4 w-full">
                  <Pagination totalPages={totalPages} page={page} />
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <p className="text-center text-gray-500">No transactions found. Please connect your banks first.</p>
      )}
    </section>
  );
};

export default RecentTransactions;
