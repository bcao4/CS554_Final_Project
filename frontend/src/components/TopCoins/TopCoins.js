import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Typography,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Divider,
} from "@mui/material";
import millify from "millify";
import "./TopCoins.css";
import { getCoinPage } from "../../api/";

// Followed pagination tutorial: https://www.youtube.com/watch?v=NZKUirTtxcg&t=1218s

const TopCoins = () => {
  const [loading, setLoading] = useState(true);
  const [pageNum, setPageNum] = useState(1);
  const [coinData, setCoinData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // const [nextPageStatus, setNextPageStatus] = useState(true);

  const observer = useRef();
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
        // if (data.length < 40) {
        //   setNextPageStatus(false);
        // } else {
        //   setNextPageStatus(true);
        // }
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, [pageNum]);
  console.log(coinData)

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
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <form style={{ width: "100%", margin: "6px" }}>
          <input
            className="form-control"
            type="search"
            placeholder="Search for a Coin..."
            aria-label="Search"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
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
                ? millify(coin.market_data.current_price.usd, {
                    precision: 4,
                  })
                : "Not available";
              let marketCap = coin.market_data?.market_cap.usd
                ? millify(coin.market_data.market_cap.usd)
                : "Not available";
              let dayHigh = coin.market_data?.high_24h.usd
                ? millify(coin.market_data.high_24h.usd)
                : "Not available";
              let dayLow = coin.market_data?.low_24h.usd
                ? millify(coin.market_data.low_24h.usd)
                : "Not available";
              let priceChange = coin.market_data?.price_change_percentage_24h
                ? millify(coin.market_data.price_change_percentage_24h, {
                    precision: 2,
                  })
                : "Not available";

              return (
                <Grid key={coin.name} item xs={8} sm={6} md={4} lg={3} xl={2}>
                  <Card>
                    <div ref={lastCoinElementRef} />
                    <CardHeader
                      title={
                        <>
                          {index + 1}. {coin.name}
                          <img
                            style={{ marginLeft: 6 }}
                            src={coin.image.large}
                            alt={coin.id}
                            height="45"
                          />
                        </>
                      }
                    />
                    <Divider />
                    <CardContent>
                      <Typography className="card-text-item">
                        Symbol: {coinSymbol}
                      </Typography>
                      <Typography className="card-text-item">
                        Current Price: ${currentPrice}
                      </Typography>
                      <Typography className="card-text-item">
                        Market Cap: ${marketCap}
                      </Typography>
                      <Typography className="card-text-item">
                        24h High: ${dayHigh}
                      </Typography>
                      <Typography className="card-text-item">
                        24h Low: ${dayLow}
                      </Typography>
                      <Typography className="card-text-item">
                        24h Change: {priceChange}%
                      </Typography>
                    </CardContent>
                    <CardActions style={{ justifyContent: "center" }}>
                      <Link to={`/coin/${coin.id}`} className="btn btn-primary">
                        More Info
                      </Link>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
        </Grid>
      </div>
      )
    </>
  );
};

export default TopCoins;
