import BankCard from '../components/dashboard/BankCard';
import HeaderBox from '../components/dashboard/HeaderBox'
import React from 'react'
import useAuth from '../hooks/useAuth';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../components/Utils/Loader';

const MyBanks = () => {
  const { attributes: loggedIn, loading } = useAuth();
  const [accounts, setAccounts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${import.meta.env.VITE_BANK_ACCOUNT_OPERATION_URL}/retrieve?userId=${loggedIn?.email}`);
      if (response.data.accounts) {
        setAccounts(response.data.accounts);
      }
    };

    fetchData();
  }, [loggedIn]);
  if (loading) return <Loader />;
  return (
    <section className='flex'>
      <div className="my-banks">
        <HeaderBox 
          title="My Bank Accounts"
          subtext="Effortlessly manage your banking activites."
        />

        <div className="space-y-4">
          <h2 className="header-2">
            Your cards
          </h2>
          <div className="flex flex-wrap gap-6">
            {accounts.length ? accounts.map((a) => (
              <BankCard 
                key={a.account_id}
                account={a}
                userName={loggedIn?.name}
              />
            )) : <p className='text-center text-gray-500'>No bank accounts found, connect your bank first</p>}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MyBanks