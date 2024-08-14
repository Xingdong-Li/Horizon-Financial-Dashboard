import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": import.meta.env.VITE_PLAID_CLIENT_ID,
      "PLAID-SECRET": import.meta.env.VITE_PLAID_SECRET,
    },
  },
});

console.log('configuration', configuration);

export const plaidClient = new PlaidApi(configuration);