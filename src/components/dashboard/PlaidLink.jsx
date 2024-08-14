import React, { useCallback, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useNavigate } from "react-router-dom"; // Use React Router's useNavigate
import { parseStringify } from "../../tools/helpers";
import axios from "axios";

const createLinkToken = async (user) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_PLAID_LINK_TOKEN_URL}/create-link-token`,
      user,
      { headers: { "Content-Type": "application/json" } }
    );

    return parseStringify({ linkToken: response.data.link_token });
  } catch (error) {
    console.error("Error creating link token:", error);
  }
};

export const exchangePublicToken = async ({ public_token, user }) => {
  try {
    
    let response = await axios.post(
      `${import.meta.env.VITE_PLAID_LINK_TOKEN_URL}/exchange-public-token`,
      { public_token },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log('response data: ', response.data);

    response = await axios.post(`${import.meta.env.VITE_BANK_ACCOUNT_OPERATION_URL}/save`, {
      userId: user.email,
      accounts: response.data.accounts,
    });

    console.log('response data2: ', response.data);
    // Return a success message
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    console.error("An error occurred while creating exchanging token:", error);
  }
};

const PlaidLink = ({ user, variant }) => {
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!user) return;
    const getLinkToken = async () => {
      const data = await createLinkToken(user);
      console.log("data", data);
      setToken(data?.linkToken);
    };

    getLinkToken();
  }, [user]);

  const onSuccess = useCallback(
    async (public_token) => {
      await exchangePublicToken({
        public_token,
        user,
      });

      window.location.reload();
    },
    [user]
  );

  const config = {
    token,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <>
      {variant === "primary" ? (
        <button
          onClick={() => open()}
          disabled={!ready}
          className="plaidlink-primary"
        >
          Connect bank
        </button>
      ) : variant === "ghost" ? (
        <button
          onClick={() => open()}
          variant="ghost"
          className="plaidlink-ghost"
        >
          <img
            src="/icons/bank-card-svgrepo-com.svg"
            alt="connect bank"
            width={24}
            height={24}
          />
          <p className="hidden text-[16px] font-semibold text-black-2 xl:block">
            Connect bank
          </p>
        </button>
      ) : (
        <button
          onClick={() => open()}
          className="w-full text-gray-700 hover:text-white hover:bg-co-dark-blue group flex gap-x-3 rounded-md p-2 text-xl leading-6"
        >
          <img
            src="/icons/bank-card-svgrepo-com.svg"
            className="text-gray-400 group-hover:text-white h-7 w-7 shrink-0"
            alt="connect bank"
          />
          <p>Connect bank</p>
        </button>
      )}
    </>
  );
};

export default PlaidLink;
