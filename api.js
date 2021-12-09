const axios = require("axios");
const COIN_GECKO_ENDPOINT = "https://api.coingecko.com/api/v3";
const NEWS_API_ENDPOINT = "https://newsapi.org/v2";
const NEWS_API_KEY = "1569464d633f4da2a0b6663b14266b84";

const getPrice = async (coin) => {
  /* 
    Returns the last price for a specified coin.
    Currently gives price in USD only,
    but can be changed by modifiying vs_currencies param
  */
  if (coin == null || typeof coin !== "string") {
    throw new TypeError("Coin param must be a string");
  }
  const { data } = await axios.get(`${COIN_GECKO_ENDPOINT}/simple/price`, {
    params: {
      ids: coin,
      vs_currencies: "usd",
    },
  });
  return data;
};

const getCoinInfo = async (coin) => {
  /*
    Returns general info for a coin
  */
  const { data } = await axios.get(`${COIN_GECKO_ENDPOINT}/coins/${coin}`, {
    params: {
      localization: "false",
      tickers: "false",
      developer_data: "false",
      sparkline: "true",
    },
  });
  return data;
};

const getChartData = async (coin, days) => {
  /*
    Data for creating a chart for a given coin over a time period of given days
  */
  const { data } = await axios.get(
    `${COIN_GECKO_ENDPOINT}/coins/${coin}/market_chart`,
    {
      params: {
        vs_currency: "usd",
        days,
      },
    }
  );
  return data;
};

const getCoinPage = async (page, perPage) => {
  /*
    Returns a paginated list of coins available
  */
  const { data } = await axios.get(`${COIN_GECKO_ENDPOINT}/coins`, {
    params: {
      vs_currency: "usd",
      per_page: perPage,
      sparkline: "true",
      price_change_percentage: "24h",
      page,
    },
  });
  return data;
};

const getCryptoNews = async (page, perPage) => {
  /*
    Returns list of crypto news articles
  */
  const { data } = await axios.get(`${NEWS_API_ENDPOINT}/everything`, {
    params: {
      q: "cryptocurrency",
      apiKey: NEWS_API_KEY,
      pageSize: perPage,
      page: page,
    },
  });
  return data;
}
module.exports = { getPrice, getCoinInfo, getChartData, getCoinPage, getCryptoNews };

// https://www.coingecko.com/en/api/documentation?
// https://developers.coinranking.com/api/documentation
// https://docs.cryptowat.ch/websocket-api
// https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&developer_data=false
// https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1
// https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=100&page=1&sparkline=true&price_change_percentage=24h
// https://newsapi.org/v2/everything?q=cryptocurrency&apiKey=1569464d633f4da2a0b6663b14266b84