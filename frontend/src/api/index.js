import axios from "axios";
const API_URL = "http://localhost:4000";

export const getCoinInfo = async (coin) => {
  // Gets general info for a coin
  const { data } = await axios.get(`${API_URL}/coin-info`, {
    params: { coin },
  });
  return data;
};

export const getChartData = async (coin, days) => {
  // Gets data needed for creating chart for a coin
  const { data } = await axios.get(`${API_URL}/coin-chart`, {
    params: { coin, days },
  });
  return data;
};

export const getCoinPage = async (page, perPage) => {
  // Gets list of coins
  const { data } = await axios.get(`${API_URL}/coin-list`, {
    params: { page, perPage },
  });
  return data;
};

export const getCryptoNews = async(page, perPage) => {
  // Get crypto news
  const { data } = await axios.get(`${API_URL}/crypto-news`, {
    params: { page, perPage },
  });
  return data;
}
