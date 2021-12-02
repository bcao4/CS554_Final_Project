import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { removeHtmlTags } from "../../utils";
import { getCoinInfo, getChartData } from "../../api/api";
//import TopCoins from "./TopCoins";
import "./TopCoins.css";
import socketIOClient from "socket.io-client";

const WS_ENDPOINT = "http://127.0.0.1:4000";
let priceUpdateInterval;

const CoinInfo = () => {
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [coinData, setCoinData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [price, setPrice] = useState(null);

  //const navigate = useNavigate();
  let params = useParams();
  let coinID = params.id;

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        const data = await getCoinInfo(coinID);
        const socket = socketIOClient(WS_ENDPOINT);
        socket.emit("request price", { coin: coinID }); // request price on init
        priceUpdateInterval = setInterval(
          () => socket.emit("request price", { coin: coinID }),
          5000
        ); // request price update every 5 seconds
        socket.on("price update", (data) => {
          setPrice(data[coinID].usd);
          console.log(data[coinID].usd);
        });
        setCoinData(data);
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    }
    fetchData();
    return () => {
      clearInterval(priceUpdateInterval); // stop interval when leaving component
    };
  }, [coinID]);

  useEffect(() => {
    setChartLoading(true);
    async function fetchChartData() {
      try {
        let days = 7; // TODO: change to useState variable that user can select to change time period
        // TODO: using time = 7 days for testing for now
        const data = await getChartData(coinID, days);
        if (!data) {
          // TODO: handle network error
          return;
        }
        setChartData(data.prices);
        setChartLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    fetchChartData();
  }, [coinID]);

  let coinDescription = coinData.description
    ? coinData.description.en.split(". ")[0]
    : "no description available";
  let coinWebsite = coinData.links
    ? coinData.links.homepage[0]
    : "no website available";
  let coinRank = coinData.market_cap_rank
    ? coinData.market_cap_rank
    : "no rank available";
  let coinPrice = coinData.market_data // using price from websocket that updates real time, but can use this as fallback
    ? coinData.market_data.current_price.usd
    : "no rank available";

  if (loading || chartLoading) {
    return (
      <div className="white-text">
        <h2>Loading....</h2>
      </div>
    );
  } else {
    return (
      <div>
        <br />
        <div className="white-text text-center">
          <img src={coinData.image.small} alt={coinData.id} />
          <h1 className="coin-name">{coinData.id}</h1>
          <br />
          <br />
          <h3>Market Cap Rank: {coinRank}</h3>
          <br />
          <h3>Current Price: ${price !== null ? price : coinPrice}</h3>
          <br />
          <br />
          {removeHtmlTags(coinDescription)}
          <br />
          <br />
          Website: <a href={coinWebsite}> {coinWebsite} </a>
        </div>
        {chartData !== undefined && (
          <div className="chart-container">
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
                    borderColor: " #fb5462",
                  },
                ],
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
        )}
      </div>
    );
  }
};

export default CoinInfo;
