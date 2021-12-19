import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Typography,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  Button,
  TextField,
} from "@mui/material";
import { convertPrice } from "../../utils";
import millify from "millify";
import "./TopCoins.css";
import { getCoinPage } from "../../api/";
import useDocumentTitle from "../../shared/useDocumentTitle";

// Followed pagination tutorial: https://www.youtube.com/watch?v=NZKUirTtxcg&t=1218s

const CardTextItem = (props) => {
  return (
    <Typography
      sx={{ color: "text.primary" }}
      className="card-text-item"
      {...props}
    />
  );
};

const TopCoins = () => {
  const [loading, setLoading] = useState(true);
  const [pageNum, setPageNum] = useState(1);
  const [coinData, setCoinData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const observer = useRef();

  useDocumentTitle("Top Coins - CryptoTracker");

  const lastCoinElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          //console.log("visible" && nextPageStatus);
          setPageNum((prevPageNum) => prevPageNum + 1);
        }
      });
      if (node) {
        observer.current.observe(node);
      }
      //console.log(node);
    },
    [loading]
  );

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        let perPage = 40; // TODO: allow user to change results per page?
        let data;
        try {
          data = await getCoinPage(pageNum, perPage);
        } catch (e) {
          console.error(e);
          return; // TODO: tell user there was a network error
        }
        setCoinData((prevCoins) => [...prevCoins, ...data]);
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, [pageNum]);

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
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {!loading && coinData !== null && (
          <form style={{ width: "100%", margin: "6px" }}>
            <TextField
              placeholder="Filter..."
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              style={{
                width: "100%",
                backgroundColor: "white",
                borderRadius: "6px",
              }}
            />
          </form>
        )}
        <Grid
          container
          justifyContent="center"
          alignContent="center"
          spacing={1}
          padding={1}
        >
          {coinData
            .filter(
              (coin) =>
                coin.id.toLowerCase().includes(searchTerm) ||
                coin.symbol.toLowerCase().includes(searchTerm) ||
                coin.name.toLowerCase().includes(searchTerm)
            )
            .map((coin, index) => {
              let coinSymbol = coin.symbol
                ? coin.symbol.toUpperCase()
                : "No symbol";
              let currentPrice = coin.market_data?.current_price.usd
                ? convertPrice(coin.market_data.current_price.usd, {
                    precision: 4,
                  })
                : "Not available";
              let marketCap = coin.market_data?.market_cap.usd
                ? millify(coin.market_data.market_cap.usd)
                : "Not available";
              let dayHigh = coin.market_data?.high_24h.usd
                ? convertPrice(coin.market_data.high_24h.usd)
                : "Not available";
              let dayLow = coin.market_data?.low_24h.usd
                ? convertPrice(coin.market_data.low_24h.usd)
                : "Not available";
              let priceChange = coin.market_data?.price_change_percentage_24h
                ? millify(coin.market_data.price_change_percentage_24h, {
                    precision: 2,
                  })
                : "Not available";

              return (
                <Grid key={coin.name} item xs={8} sm={6} md={4} lg={3} xl={2}>
                  <Card style={{ height: "100%" }} ref={lastCoinElementRef}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        margin: "10px",
                      }}
                    >
                      <Typography
                        sx={{ color: "text.primary", fontSize: "1.6rem" }}
                      >
                        {index + 1}. {coin.name}
                      </Typography>

                      <img
                        style={{ marginLeft: 6 }}
                        src={coin.image.large}
                        alt={coin.id}
                        height="45"
                      />
                    </div>
                    <Divider />
                    <CardContent>
                      <CardTextItem>Symbol: {coinSymbol}</CardTextItem>
                      <CardTextItem>
                        Current Price: ${currentPrice}
                      </CardTextItem>
                      <CardTextItem>Market Cap: ${marketCap}</CardTextItem>
                      <CardTextItem>24h High: ${dayHigh}</CardTextItem>
                      <CardTextItem>24h Low: ${dayLow}</CardTextItem>
                      <CardTextItem>24h Change: {priceChange}%</CardTextItem>
                    </CardContent>
                    <CardActions style={{ justifyContent: "center" }}>
                      <Button
                        variant="contained"
                        component={Link}
                        to={`/coin/${coin.id}`}
                        sx={{
                          color: "button.color",
                          backgroundColor: "button.backgroundColor",
                        }}
                      >
                        More Info
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
        </Grid>
      </div>
    </>
  );
};

export default TopCoins;
