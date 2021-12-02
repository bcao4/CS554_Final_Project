import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Line } from "react-chartjs-2";
import ReactHtmlParser from 'react-html-parser';
import TopCoins from './TopCoins';
import './TopCoins.css'

// https://www.coingecko.com/en/api/documentation?
// https://developers.coinranking.com/api/documentation
// https://docs.cryptowat.ch/websocket-api
// https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&developer_data=false
// https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1

const CoinInfo = () => {
  const [ loading, setLoading ] = useState(true);
  const [ chartLoading, setChartLoading ] = useState(true);
  const [ coinData, setCoinData ] = useState([]);
  const [ chartData, setChartData ] = useState();
  const navigate = useNavigate();
  let params = useParams();
  let coinID = params.id;

  let coinInfoBaseUrl = "https://api.coingecko.com/api/v3/coins/";

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        const { data } = await axios({
          method: 'GET',
          url: coinInfoBaseUrl + coinID,
          params: {localization: "false", tickers: "false", developer_data: "false", sparkline: "true"}
        });
        setCoinData(data);
        setLoading(false);
      } catch(e) {
        console.log(e);
      }
    }
    fetchData();
  }, [coinID]);

  useEffect(() => {
    setChartLoading(true);
    async function fetchChartData() {
      try {
        let chartDataUrl = coinInfoBaseUrl + coinID + "/market_chart?vs_currency=usd&" + "days=7";
        console.log(chartDataUrl);
        const { data } = await axios.get(chartDataUrl);
        setChartData(data.prices);
        setChartLoading(false);
      } catch(e) {
        console.log(e);
      }
    }
    fetchChartData();
  }, [coinID]);

  let coinDescription = coinData.description ? coinData.description.en.split(". ")[0] : "no description available";
  let coinWebsite = coinData.links ? coinData.links.homepage[0] : "no website available";
  let coinRank = coinData.market_cap_rank ? coinData.market_cap_rank : "no rank available";
  let coinPrice = coinData.market_data ? coinData.market_data.current_price.usd : "no rank available";

  if(loading || chartLoading) {
    return (
      <div className="white-text">
        <h2>Loading....</h2>
      </div>
    );
  } else {
    return (
      <div>
        <br/>
        <div className="white-text text-center">
          <img src={coinData.image.small} alt={coinData.id} />
          <h1 className="coin-name">
            {coinData.id}
          </h1>
          <br/>
          <br/>
          <h3>
            Market Cap Rank: {coinRank}
          </h3>
          <br/>
          <h3>
            Current Price: ${coinPrice}
          </h3>
          <br/>
          <br/>
          {ReactHtmlParser(coinDescription)}
          <br/>
          <br/>
          Website: <a href={coinWebsite}> {coinWebsite} </a>
        </div>
        <div class="chart-container">
            <Line
              data={{
                labels: chartData.map((time) => {
                  let hourlyData = new Date(time[0]).toLocaleString();
                  return hourlyData;
                }),
                datasets: [
                  {
                    data: chartData.map((price) => price[1]),
                    label: "Price in USD",
                    borderColor:" #fb5462"
                  }
                ]
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
              }}
            />
          </div>
      </div>
    )
  }
};

export default CoinInfo;