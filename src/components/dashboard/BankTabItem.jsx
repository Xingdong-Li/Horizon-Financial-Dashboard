import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn, formUrlQuery } from "../../tools/helpers";

export const BankTabItem = ({ account, currentAccount }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const isActive = currentAccount === account?.account_id;

  const handleBankChange = () => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: account?.account_id,
    });
    navigate(newUrl, { replace: true });
  };

  return (
    <div
      onClick={handleBankChange}
      className={cn(`banktab-item`, {
        "border-blue-600": isActive,
      })}
    >
      <p
        className={cn(`text-16 line-clamp-1 flex-1 font-medium text-gray-500`, {
          "text-blue-600": isActive,
        })}
      >
        {account.official_name}
      </p>
    </div>
  );
};
