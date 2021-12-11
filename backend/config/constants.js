const { CRYPTOPANIC_KEY, NEWS_API_KEY } = process.env;

if (CRYPTOPANIC_KEY === undefined || NEWS_API_KEY === undefined) {
  throw new Error("Missing API keys, check .env file");
}

const COIN_GECKO_URL = "https://api.coingecko.com/api/v3";
const CRYPTOPANIC_URL = "https://cryptopanic.com/api/v1";
const NEWS_API_URL = "https://newsapi.org/v2";

module.exports = {
  CRYPTOPANIC_KEY,
  NEWS_API_KEY,
  COIN_GECKO_URL,
  CRYPTOPANIC_URL,
  NEWS_API_URL,
};
