import home_image from "../../images/home_image.jpg";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getDailyChange } from "../../api";

const Home = () => {
  const [dailyChange, setDailyChange] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const { data } = await getDailyChange();
      setDailyChange(
        parseFloat(data.market_cap_change_percentage_24h_usd).toFixed(2)
      );
    };
    getData();
  }, []);

  return (
    <div
      className="container"
      style={{
        background: `url(${home_image}) no-repeat center center fixed`,
        height: "100vh",
        width: "100%",
      }}
    >
      <div className="flex-center" style={{ flexDirection: "column" }}>
        <Typography variant="h1" style={{ marginTop: "10%", color: "orange" }}>
          CryptoTracker Exchange
        </Typography>
        <Typography variant="h2" align="center" style={{ color: "white" }}>
          Explore and trade Cryptocurrencies and much more!
        </Typography>
        <div style={{ width: "80%", textAlign: "center" }}>
          {dailyChange !== null && dailyChange > 0 ? (
            <Typography color="price.green" variant="h3">
              The Global Cryptocurrency Market is up {dailyChange}% in the past
              24 hours!
            </Typography>
          ) : dailyChange < 0 ? (
            <Typography color="price.red" variant="h3">
              The Global Crypto Market is down {dailyChange}% in the past 24
              hours!
            </Typography>
          ) : undefined}
        </div>
      </div>
    </div>
  );
};

export default Home;
