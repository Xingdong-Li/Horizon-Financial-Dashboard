import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Utils/Loader";

const Visualization = () => {
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
  const aggregateData = (transactions) => {
    const categories = {};
    const channels = {};
    const types = { debit: 0, credit: 0 };

    transactions.forEach((transaction) => {
      const { category, paymentChannel, type, amount } = transaction;

      // Aggregate by category
      categories[category] = (categories[category] || 0) + Math.abs(amount);

      // Aggregate by payment channel
      channels[paymentChannel] =
        (channels[paymentChannel] || 0) + Math.abs(amount);

      // Aggregate by transaction type
      types[type] += Math.abs(amount);
    });

    return { categories, channels, types };
  };

  const getChartData = (data) => {
    return {
      labels: Object.keys(data),
      datasets: [
        {
          label: "Amount",
          data: Object.values(data),
          backgroundColor: [
            "#f87171", // Red
            "#60a5fa", // Blue
            "#34d399", // Green
            "#fbbf24", // Yellow
            "#f472b6", // Pink
            "#a78bfa", // Purple
          ],
        },
      ],
    };
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">
      {accounts.length ? accounts.map((account) => {
        const { categories, channels, types } = aggregateData(
          account.transactions
        );

        return (
          <div
            key={account.account_id}
            className="p-6 bg-white shadow rounded-lg"
          >
            <h2 className="text-lg font-semibold mb-4">
              {account.name} ({account.mask})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-center font-semibold mb-2">
                  Expenses by Category
                </h3>
                <Doughnut data={getChartData(categories)} />
              </div>

              <div>
                <h3 className="text-center font-semibold mb-2">
                  Expenses by Payment Channel
                </h3>
                <Doughnut data={getChartData(channels)} />
              </div>

              <div>
                <h3 className="text-center font-semibold mb-2">
                  Expenses by Transaction Type
                </h3>
                <Bar
                  data={getChartData(types)}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        );
      }) : <p className='text-center text-gray-500 mt-3'>No bank accounts found, connect your bank first</p>}
    </div>
  );
};

export default Visualization;
