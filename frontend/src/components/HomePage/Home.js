import home_image from "../../images/home_image.jpg";
import { Typography } from "@mui/material";

const Home = () => {
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
        <Typography variant="h1" color="white">
          Cryptocurrency Exchange
        </Typography>
        <Typography variant="h2" align="center" color={"white"}>
          Explore the cryptocurrency trends and trade coins and much more !
        </Typography>
      </div>
    </div>
  );
};

export default Home;
