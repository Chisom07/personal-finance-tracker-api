import axios from "axios";

export const convertToNGN = async (amount, currency) => {
  try {
    const res = await axios.get(
      `https://openexchangerates.org/api/latest.json?app_id=${process.env.OPEN_EXCHANGE_API_KEY}`
    );

    const rate = res.data.rates[currency];
    const ngnRate = res.data.rates["NGN"];

    return (amount / rate) * ngnRate;
  } catch {
    return amount;
  }
};