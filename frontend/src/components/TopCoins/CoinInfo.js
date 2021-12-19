import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  LinearProgress,
  ToggleButtonGroup,
  ToggleButton,
  Link,
  Divider,
  Grid,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";
import millify from "millify";
import { Line } from "react-chartjs-2";
import {
  removeHtmlTags,
  convertPrice,
  convertDate,
  getDateDiffString,
  generatePercentString,
  capitalize,
} from "../../utils";
import useDocumentTitle from "../../shared/useDocumentTitle";
import { getCoinInfo, getChartData, getCoinNews } from "../../api";
import { socket } from "../../api/socket";
import TradeBar from "./TradeBar";
import "./TopCoins.css";

const StyledToggleButton = (props) => {
  return (
    <ToggleButton
      {...props}
      sx={{
        // backgroundColor: "button.backgroundColor",
        color: "button.color",
      }}
    />
  );
};

const CoinInfo = () => {
  const [loading, setLoading] = useState(true);
  const [coinData, setCoinData] = useState(null);
  const [days, setDays] = useState("1");
  const [chartData, setChartData] = useState(null);
  const [livePrice, setLivePrice] = useState(null);
  const [coinNews, setCoinNews] = useState(null);

  const lastPrice = useRef(null);
  const priceUpdateInterval = useRef(null);

  const params = useParams();
  const coinID = params.id;

  const getTitleString = useCallback(() => {
    if (livePrice === null) {
      return capitalize(coinID);
    }
    return `${capitalize(coinID)} - $${convertPrice(livePrice)}`;
  }, [livePrice, coinID]);

  useDocumentTitle(getTitleString());

  useEffect(() => {
    priceUpdateInterval.current = setInterval(
      () => socket.emit("request price", { coin: coinID }),
      5000
    );
    socket.removeAllListeners("price update");
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
        //console.log(coinData);
        setChartData(chartData.prices);
        setCoinData(coinData);
        if (lastPrice.current === null) {
          lastPrice.current = coinData?.market_data?.current_price?.usd ?? 0;
          const news = await getCoinNews(coinData.symbol);
          setCoinNews(news?.results?.slice(0, 12));
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
  const coinPrice =
    coinData?.market_data?.current_price?.usd ?? "No price available";

  return (
    <>
      {loading && (
        <>
          <LinearProgress
            sx={{
              position: "sticky",
              top: 0,
              height: 8,
              backgroundColor: "loadingBar.color",
            }}
          />
        </>
      )}
      {coinData !== null && (
        <div style={{ marginTop: 10 }}>
          <div
            style={{
              position: "absolute",
              zIndex: 1,
              marginLeft: 80,
              marginTop: "-40px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  color: "text.secondary",
                  fontSize: "2.6rem",
                  marginRight: "6px",
                }}
              >
                {capitalize(coinData.id)}
              </Typography>
              <img src={coinData.image.large} alt={coinData.id} height={50} />
            </div>
            <Typography
              variant="h2"
              id={"live-price"}
              sx={{
                color: "text.secondary",
                fontSize: "2rem",
              }}
            >
              $
              {livePrice !== null
                ? convertPrice(livePrice)
                : convertPrice(coinPrice)}
            </Typography>
            <Typography
              sx={{
                color:
                  livePrice - chartData[0][1] > 0
                    ? "price.green"
                    : livePrice - chartData[0][1] < 0
                    ? "price.red"
                    : "text.secondary",
              }}
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
                  size="large"
                  value={days}
                  exclusive
                  onChange={(_, newTimePeriod) => {
                    if (newTimePeriod) {
                      setDays(newTimePeriod);
                    }
                  }}
                  className="flex-center"
                  sx={{
                    margin: "10px",
                    marginBottom: "16px",
                  }}
                >
                  <StyledToggleButton value="1">1 Day</StyledToggleButton>
                  <StyledToggleButton value="7">1 Week</StyledToggleButton>
                  <StyledToggleButton value="30">1 Month</StyledToggleButton>
                  <StyledToggleButton value="90">3 Month</StyledToggleButton>
                  <StyledToggleButton value="180">6 Month</StyledToggleButton>
                  <StyledToggleButton value="365">1 Year</StyledToggleButton>
                  <StyledToggleButton value="max">Max</StyledToggleButton>
                </ToggleButtonGroup>
              </div>
            </div>
          )}
          <TradeBar
            coin={coinID}
            coinPrice={livePrice ?? coinPrice}
            setLoading={setLoading}
          />
          <div id="coin-info" style={{ margin: "6px" }}>
            <Typography
              variant="h2"
              sx={{ fontSize: "2rem", color: "text.secondary" }}
            >
              About {capitalize(coinData.id)}
            </Typography>
            <Divider sx={{ backgroundColor: "text.secondary" }} />
            <div>
              <Typography sx={{ color: "text.secondary" }}>
                {removeHtmlTags(coinDescription)}
              </Typography>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{ marginRight: "4px", color: "text.secondary" }}
                >
                  Website:
                </Typography>
                <Link
                  href={coinWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: "link.color" }}
                >
                  {coinWebsite}
                </Link>
              </div>
              <Typography sx={{ color: "text.secondary" }}>
                {`Market Capitalization: ${millify(
                  coinData.market_data.market_cap.usd
                )}`}
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                {`Circulating Supply: ${millify(
                  coinData.market_data.circulating_supply
                )}`}
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                {`Current Market Sentiment: ${
                  coinData.sentiment_votes_up_percentage > 55
                    ? "Bullish"
                    : coinData.sentiment_votes_up_percentage < 45
                    ? "Bearish"
                    : "Neutral"
                }`}
              </Typography>
            </div>
          </div>
          {coinNews !== null && (
            <>
              <div style={{ margin: "6px" }}>
                <Typography
                  variant="h2"
                  sx={{ fontSize: "2rem", color: "text.secondary" }}
                >
                  {capitalize(coinData.id)} News
                </Typography>
                <Divider sx={{ backgroundColor: "text.secondary" }} />
              </div>
              <div id="news">
                <Grid
                  container
                  justifyContent="center"
                  alignContent="center"
                  spacing={1}
                  padding={1}
                >
                  {coinNews.map((item) => {
                    return (
                      <Grid
                        key={item.id}
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={4}
                      >
                        <Card style={{ height: "100%" }}>
                          <CardActionArea
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <CardContent>
                              <Typography>{item.title}</Typography>
                              <Typography variant="caption">
                                {item.source.title} - {item.source.domain}
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default CoinInfo;
