import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  LinearProgress,
  ToggleButtonGroup,
  ToggleButton,
  Link,
  Divider,
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
  }, [coinID]);

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
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [coinID, days]);

  useEffect(() => {
    // init livePrice if needed when chartData comes in
    if (livePrice === null && chartData !== null) {
      // if liveprice was already set, don't update to value from chart as the liveprice value should be the most recent!
      setLivePrice(chartData.at(-1)[1]); // init liveprice to last value from chartdata, if none was set so far
    }
  }, [chartData, livePrice]);

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

  const coinDescription =
    coinData?.description?.en.split(". ")[0] ?? "No description available";
  const coinWebsite = coinData?.links?.homepage[0] ?? "No website available";
  const coinRank = coinData?.market_cap_rank ?? "No rank available";
  const coinPrice =
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
        <div style={{ marginTop: 10 }}>
          <div className="white-text coin-price" style={{ marginLeft: 60 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Typography
                variant="h1"
                className="coin-name"
                style={{ fontSize: "2.6rem", marginRight: 4 }}
              >
                {coinData.id}
              </Typography>
              <img src={coinData.image.large} alt={coinData.id} height={50} />
            </div>
            <Typography
              variant="h2"
              id={"live-price"}
              style={{ fontSize: "2rem" }}
            >
              $
              {livePrice !== null
                ? convertPrice(livePrice)
                : convertPrice(coinPrice)}
            </Typography>
            <Typography
              className={
                livePrice - chartData[0][1] > 0
                  ? "price-green"
                  : livePrice - chartData[0][1] < 0
                  ? "price-red"
                  : ""
              }
            >
              {livePrice - chartData[0][1] < 0
                ? "-"
                : livePrice - chartData[0][1] > 0
                ? "+"
                : ""}
              {`$${convertPrice(
                livePrice - chartData[0][1]
              )} ${generatePercentString(
                chartData[0][1],
                livePrice
              )} ${getDateDiffString(chartData[0][0])}`}
            </Typography>
          </div>
          {chartData !== null && livePrice !== null && (
            <div className="chart-container">
              <Line
                data={{
                  labels: chartData.map((time) =>
                    convertDate(time[0], chartData[0][0])
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
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  elements: {
                    point: {
                      radius: 1,
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false,
                      },
                      ticks: {
                        color: "white",
                      },
                    },
                    y: {
                      grid: {
                        display: false,
                      },
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
          <div id="coin-info" className="white-text">
            <Typography
              variant="h2"
              className="coin-name"
              style={{ fontSize: "2rem" }}
            >
              About {coinData.id}
            </Typography>
            <Divider sx={{ backgroundColor: "white" }} />
            <Typography>{removeHtmlTags(coinDescription)}</Typography>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Typography style={{ marginRight: 4 }}>Website:</Typography>
              <Link
                className="coin-website-link"
                href={coinWebsite}
                target="_blank"
                rel="noopener"
              >
                {coinWebsite}
              </Link>
            </div>
            <Typography>Market Cap Rank: {coinRank}</Typography>
          </div>
        </div>
      )}
    </>
  );
};

export default CoinInfo;
