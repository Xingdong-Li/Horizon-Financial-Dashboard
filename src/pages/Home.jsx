import React, { useState, useEffect } from 'react';
import HeaderBox from "../components/dashboard/HeaderBox";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import RightSidebar from "../components/dashboard/RightSideBar";
import TotalBalanceBox from "../components/dashboard/TotalBalanceBox";
import useAuth from "../hooks/useAuth";
import Loader from '../components/Utils/Loader';
import axios from 'axios';
import { useLocation } from "react-router-dom";
const Home = () => {
  const { attributes: loggedIn, loading } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [account, setAccount] = useState(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentAccount = searchParams.get('id') || accounts[0]?.account_id;
  const [currentPage, setCurrentPage] = useState(1);
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${import.meta.env.VITE_BANK_ACCOUNT_OPERATION_URL}/retrieve?userId=${loggedIn?.email}`);
      console.log('response', response);
      if (response.data.accounts) {
        console.log('accounts', response.data.accounts);
        setAccounts(response.data.accounts);
        setAccount(response.data.accounts[0]);
      }
    };

    fetchData();
  }, [loggedIn]);

  useEffect(() => {
    if (!accounts.length) return;
    const account = accounts.find((account) => account.account_id === currentAccount);
    setAccount(account);
  }, [currentAccount]);


  if (loading) return <Loader />;

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.name || "Guest"}
            subtext="Access and manage your account and transactions efficiently."
          />

          <TotalBalanceBox
            accounts={accounts}
          />
        </header>

        <RecentTransactions
          accounts={accounts}
          transactions={account?.transactions}
          currentAccount={currentAccount}
          page={currentPage}
        />
      </div>

      <RightSidebar
        user={loggedIn}
        transactions={account?.transactions}
        banks={accounts?.slice(0, 2)}
      />
    </section>
  );
};

export default Home;
