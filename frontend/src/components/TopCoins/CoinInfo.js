import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, LinearProgress } from "@mui/material";
import { Line } from "react-chartjs-2";
import { removeHtmlTags, timeToDaysAndHours } from "../../utils";
import { getCoinInfo, getChartData } from "../../api";
//import TopCoins from "./TopCoins";
import "./TopCoins.css";
import socketIOClient from "socket.io-client";

const WS_ENDPOINT = "http://127.0.0.1:4000";
let priceUpdateInterval;

const CoinInfo = () => {
  const [loading, setLoading] = useState(true);
  const [coinData, setCoinData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [livePrice, setLivePrice] = useState(null);

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
          3000 // request price update every 5 seconds
        );
        socket.on("price update", (data) => {
          const newPrice = data[coinID].usd;
          const element = document.getElementById("live-price");
          if (element) {
            if (newPrice < livePrice) {
              element.classList.remove("live-price-decrease");
              element.classList.add("live-price-increase");
            } else if (newPrice > livePrice) {
              element.classList.remove("live-price-increase");
              element.classList.add("live-price-decrease");
            }
          }
          setLivePrice(newPrice);
        });
        let days = 7; // TODO: change to useState variable that user can select to change time period?
        let chartData;
        try {
          chartData = await getChartData(coinID, days);
        } catch (e) {
          console.error(e);
          return;
        }
        setChartData(chartData.prices);
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

  let coinDescription = coinData.description
    ? coinData.description.en.split(". ")[0]
    : "No description available";
  let coinWebsite = coinData.links
    ? coinData.links.homepage[0]
    : "No website available";
  let coinRank = coinData.market_cap_rank ?? "No rank available";
  let coinPrice =
    coinData.market_data?.current_price?.usd ?? "No price available";

  return (
    <>
      {loading ? (
        <>
          <LinearProgress />
        </>
      ) : (
        <div>
          <div className="white-text text-center">
            <img src={coinData.image.large} alt={coinData.id} height={100} />
            <Typography variant="h1" className="coin-name">
              {coinData.id}
            </Typography>
            <Typography key={livePrice} id={"live-price"}>
              Current Price: ${livePrice !== null ? livePrice : coinPrice}
            </Typography>
            <Typography>Market Cap Rank: {coinRank}</Typography>
            <Typography>{removeHtmlTags(coinDescription)}</Typography>
            <Typography>
              Website: <a href={coinWebsite}> {coinWebsite}</a>
            </Typography>
          </div>
          {chartData !== null && (
            <div className="chart-container">
              <Line
                data={{
                  labels: chartData.map((time) => {
                    return timeToDaysAndHours(time[0]);
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
      )}
    </>
  );
};
export default CoinInfo;
