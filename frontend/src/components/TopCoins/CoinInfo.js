import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, LinearProgress } from "@mui/material";
import { Line } from "react-chartjs-2";
import { removeHtmlTags, timeToDaysAndHours } from "../../utils";
import { getCoinInfo, getChartData } from "../../api";
import { socket } from "../../api/socket";
//import TopCoins from "./TopCoins";
import "./TopCoins.css";
const CoinInfo = () => {
  const [loading, setLoading] = useState(true);
  const [coinData, setCoinData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [livePrice, setLivePrice] = useState(null);

  const lastPrice = useRef(0);
  const priceUpdateInterval = useRef(null);
  //const navigate = useNavigate();
  const params = useParams();
  const coinID = params.id;

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      let coinData, chartData;
      let days = 7; // TODO: change to useState variable that user can select to change time period?
      try {
        chartData = await getChartData(coinID, days);
        coinData = await getCoinInfo(coinID);
      } catch (e) {
        console.error(e);
        return;
      }
      priceUpdateInterval.current = setInterval(
        () => socket.emit("request price", { coin: coinID }),
        3000 // request price update every 3 seconds
      );
      socket.on("price update", (data) => {
        const newPrice = data?.[coinID]?.usd;
        if (newPrice !== undefined) {
          setLivePrice(newPrice);
        }
      });
      setChartData(chartData.prices);
      setCoinData(coinData);
      setLoading(false);
    }
    fetchData();
    return () => {
      socket.close();
      clearInterval(priceUpdateInterval.current);
    };
  }, [coinID]);

  useEffect(() => {
    const livePriceElement = document.getElementById("live-price");
    console.log(livePrice);
    console.log(lastPrice.current);
    if (livePriceElement) {
      if (lastPrice.current < livePrice) {
        livePriceElement.classList.remove("live-price-decrease");
        livePriceElement.classList.add("live-price-increase");
      } else if (lastPrice.current > livePrice) {
        livePriceElement.classList.remove("live-price-increase");
        livePriceElement.classList.add("live-price-decrease");
      } else {
        livePriceElement.classList.remove("live-price-increase");
        livePriceElement.classList.remove("live-price-decrease");
      }
    }
    lastPrice.current = livePrice;
  }, [livePrice]);

  let coinDescription =
    coinData?.description?.en.split(". ")[0] ?? "No description available";
  let coinWebsite = coinData?.links?.homepage[0] ?? "No website available";
  let coinRank = coinData?.market_cap_rank ?? "No rank available";
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
            <img
              src={coinData.image.large}
              alt={coinData.id}
              height={100}
              style={{ marginTop: "8px" }}
            />
            <Typography variant="h1" className="coin-name">
              {coinData.id}
            </Typography>
            <Typography variant="h2" key={livePrice} id={"live-price"}>
              ${livePrice !== null ? livePrice : coinPrice}
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
