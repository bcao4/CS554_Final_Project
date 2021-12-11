import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  LinearProgress,
  ToggleButtonGroup,
  ToggleButton,
  Link,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  removeHtmlTags,
  convertPrice,
  convertDate,
  getDateDiffString,
  generatePercentString,
} from "../../utils";
import { getCoinInfo, getChartData } from "../../api";
import { socket } from "../../api/socket";
import "./TopCoins.css";

const CoinInfo = () => {
  const [loading, setLoading] = useState(true);
  const [coinData, setCoinData] = useState(null);
  const [days, setDays] = useState("1");
  const [chartData, setChartData] = useState(null);
  const [livePrice, setLivePrice] = useState(null);
  const [earliestPrice, setEarliestPrice] = useState(null);

  const lastPrice = useRef(null);
  const priceUpdateInterval = useRef(null);

  const params = useParams();
  const coinID = params.id;

  useEffect(() => {
    priceUpdateInterval.current = setInterval(
      () => socket.emit("request price", { coin: coinID }),
      5000
    );
    socket.on("price update", (data) => {
      const newPrice = data?.[coinID]?.usd;
      if (newPrice !== undefined) {
        setLivePrice(newPrice);
      }
    });
    return () => {
      socket.removeAllListeners("price update");
      clearInterval(priceUpdateInterval.current);
    };
  }, [coinID, earliestPrice]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [chartData, coinData] = await Promise.all([
          getChartData(coinID, days),
          getCoinInfo(coinID),
        ]);
        setChartData(chartData.prices);
        setCoinData(coinData);
        if (lastPrice.current === null) {
          lastPrice.current = coinData?.market_data?.current_price?.usd ?? 0;
        }
        setEarliestPrice(chartData.prices[0]); // earliest price is array of size 2 of [time, price]
        if (livePrice === null) {
          // if liveprice was already set, don't update to value from chart as the liveprice value should be the most recent!
          setLivePrice(chartData.prices.at(-1)[1]); // init liveprice to last value from chartdata, if none was set so far
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
                ? convertPrice(livePrice)
                : convertPrice(coinPrice)}
            </Typography>
            <Typography>Market Cap Rank: {coinRank}</Typography>
            <Typography>{removeHtmlTags(coinDescription)}</Typography>
            <div className="flex-center" style={{ flexDirection: "row" }}>
              <Typography style={{ marginRight: 4 }}>Website:</Typography>
              <Link
                className="coin-website-link"
                href={coinWebsite}
                style={{ marginBottom: 2 }}
                target="_blank"
                rel="noopener"
              >
                {coinWebsite}
              </Link>
            </div>
          </div>
          {chartData !== null && earliestPrice !== null && livePrice !== null && (
            <div className="chart-container">
              <div className="flex-center">
                <Typography
                  style={{ fontSize: "1.4rem" }}
                  className={
                    livePrice - earliestPrice[1] > 0
                      ? "price-green"
                      : livePrice - earliestPrice[1] < 0
                      ? "price-red"
                      : ""
                  }
                >
                  {livePrice - earliestPrice[1] < 0
                    ? "-"
                    : livePrice - earliestPrice[1] > 0
                    ? "+"
                    : ""}
                  {`$${convertPrice(
                    livePrice - earliestPrice[1]
                  )} ${generatePercentString(
                    earliestPrice[1],
                    livePrice
                  )} ${getDateDiffString(earliestPrice[0])}`}
                </Typography>
              </div>
              <Line
                data={{
                  labels: chartData.map((time) =>
                    convertDate(time[0], earliestPrice[0])
                  ),
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
              <div>
                <ToggleButtonGroup
                  color="primary"
                  size="large"
                  value={days}
                  exclusive
                  onChange={(_, newTimePeriod) => {
                    if (newTimePeriod) {
                      setDays(newTimePeriod);
                    }
                  }}
                  className="flex-center"
                  style={{
                    margin: "10px",
                    marginBottom: "16px",
                  }}
                >
                  <ToggleButton value="1">1 Day</ToggleButton>
                  <ToggleButton value="7">1 Week</ToggleButton>
                  <ToggleButton value="30">1 Month</ToggleButton>
                  <ToggleButton value="90">3 Month</ToggleButton>
                  <ToggleButton value="180">6 Month</ToggleButton>
                  <ToggleButton value="365">1 Year</ToggleButton>
                  <ToggleButton value="max">Max</ToggleButton>
                </ToggleButtonGroup>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CoinInfo;
