import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Typography, LinearProgress } from "@mui/material";
import { Line } from "react-chartjs-2";
import { removeHtmlTags, timeToDaysAndHours } from "../../utils";
import { getCoinInfo, getChartData } from "../../api";
import { socket } from "../../api/socket";
import "./TopCoins.css";

const CoinInfo = () => {
  const [loading, setLoading] = useState(true);
  const [coinData, setCoinData] = useState(null);
  const [days, setDays] = useState(1);
  const [chartData, setChartData] = useState(null);
  const [livePrice, setLivePrice] = useState(null);

  const lastPrice = useRef(null);
  const priceUpdateInterval = useRef(null);

  const params = useParams();
  const coinID = params.id;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let coinData, chartData;
      try {
        chartData = await getChartData(coinID, days);
        coinData = await getCoinInfo(coinID);
      } catch (e) {
        console.error(e);
        return;
      }
      priceUpdateInterval.current = setInterval(
        () => socket.emit("request price", { coin: coinID }),
        5000 // request price update every 5 seconds, could be more often but coin gecko api doesnt update the price that often
      );
      socket.on("price update", (data) => {
        const newPrice = data?.[coinID]?.usd;
        if (newPrice !== undefined) {
          setLivePrice(newPrice);
        }
      });
      setChartData(chartData.prices);
      setCoinData(coinData);
      if (lastPrice.current === null) {
        lastPrice.current = coinData.market_data?.current_price?.usd ?? 0;
      }
      setLoading(false);
    };
    fetchData();
    return () => {
      socket.removeAllListeners("price update");
      clearInterval(priceUpdateInterval.current);
    };
  }, [coinID, days]);

  useEffect(() => {
    const livePriceElement = document.getElementById("live-price");
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
    coinData?.market_data?.current_price?.usd ?? "No price available";

  return (
    <>
      {loading && (
        <>
          <LinearProgress
            color="secondary"
            style={{ position: "sticky", top: 0, height: 8 }}
          />
        </>
      )}
      {coinData !== null && (
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
              $
              {livePrice !== null
                ? livePrice.toLocaleString()
                : coinPrice.toLocaleString()}
            </Typography>
            <Typography>Market Cap Rank: {coinRank}</Typography>
            <Typography>{removeHtmlTags(coinDescription)}</Typography>
            <Typography>
              Website: <a href={coinWebsite}> {coinWebsite}</a>
            </Typography>
          </div>
          <br />
          {chartData !== null && (
            <div className="chart-container">
              <Line
                data={{
                  labels: chartData.map((time) => timeToDaysAndHours(time[0])),
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
                  plugins: {
                    title: {
                      display: true,
                      text: `${days} Day Chart`,
                      color: "#FFFFFF",
                      font: {
                        size: 25,
                      },
                    },
                  },
                  scales: {
                    x: {
                      ticks: {
                        color: "white",
                      },
                    },
                    y: {
                      ticks: {
                        color: "white",
                      },
                    },
                  },
                }}
              />
              <br />
              <div className="text-center ">
                <div className="btn-group">
                  <button
                    className="btn btn-outline-light"
                    onClick={() => setDays(1)}
                  >
                    1 Day
                  </button>
                  <button
                    className="btn btn-outline-light"
                    onClick={() => setDays(7)}
                  >
                    1 Week
                  </button>
                  <button
                    className="btn btn-outline-light"
                    onClick={() => setDays(30)}
                  >
                    1 Month
                  </button>
                  <button
                    className="btn btn-outline-light"
                    onClick={() => setDays(90)}
                  >
                    3 Month
                  </button>
                  <button
                    className="btn btn-outline-light"
                    onClick={() => setDays(180)}
                  >
                    6 Month
                  </button>
                  <button
                    className="btn btn-outline-light"
                    onClick={() => setDays(365)}
                  >
                    1 Year
                  </button>
                  <button
                    className="btn btn-outline-light"
                    onClick={() => setDays("max")}
                  >
                    Max
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CoinInfo;
