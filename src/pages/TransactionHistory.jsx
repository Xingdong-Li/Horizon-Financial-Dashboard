import HeaderBox from "../components/dashboard/HeaderBox";
import { Pagination } from "../components/dashboard/Pagination";
import TransactionsTable from "../components/dashboard/TransactionsTable";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Utils/Loader";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { formatAmount } from "../tools/helpers";
import React from "react";
import { useEffect, useState } from "react";

const TransactionHistory = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentPage = Number(searchParams.get("page")) || 1;
  const id = searchParams.get("id");
  const [accounts, setAccounts] = useState([]);
  const [account, setAccount] = useState(null);
  const { attributes: loggedIn, loading } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BANK_ACCOUNT_OPERATION_URL}/retrieve?userId=${
          loggedIn?.email
        }`
      );
      if (response.data.accounts) {
        const accounts = response.data.accounts;
        setAccounts(accounts);
        setAccount(
          id ? accounts.find((a) => a.account_id === id) : accounts[0]
        );
      }
    };

    fetchData();
  }, [loggedIn]);

  const [isOpen, setIsOpen] = useState(false);
  if (loading) return <Loader />;

  const rowsPerPage = 10;
  const totalPages = Math.ceil(account?.transactions.length / rowsPerPage);

  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = account?.transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  return (
    <div className="transactions">
      <div className="transactions-header">
        <HeaderBox
          title="Transaction History"
          subtext="See your bank details and transactions."
        />
        {/* Add a dropdown button here to switch account */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={accounts.length < 2}
          >
            Switch Account
            <svg
              className="w-5 h-5 inline-block ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <ul className="py-1 text-gray-700">
                {accounts.map((a) => (
                  <li key={a.account_id}>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        setAccount(a);
                        setIsOpen(false);
                      }}
                    >
                      {a.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {currentTransactions ? (
        <div className="space-y-6">
          <div className="transactions-account">
            <div className="flex flex-col gap-2">
              <h2 className="text-18 font-bold text-white">{account?.name}</h2>
              <p className="text-14 text-blue-25">{account?.officialName}</p>
              <p className="text-14 font-semibold tracking-[1.1px] text-white">
                ●●●● ●●●● ●●●● {account?.mask}
              </p>
            </div>

            <div className="transactions-account-balance">
              <p className="text-14">Current balance</p>
              <p className="text-24 text-center font-bold">
                {formatAmount(account?.balances.current)}
              </p>
            </div>
          </div>

          <section className="flex w-full flex-col gap-6">
            <TransactionsTable transactions={currentTransactions} />
            {totalPages > 1 && (
              <div className="my-4 w-full">
                <Pagination totalPages={totalPages} page={currentPage} />
              </div>
            )}
          </section>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No transactions found. Please connect your banks first.
        </p>
      )}
    </div>
  );
};

export default TransactionHistory;
