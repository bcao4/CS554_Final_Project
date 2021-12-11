import home_image from "../../images/home_image.jpg";
import "./homePage.css";

const Home = () => {
  return (
    <div
      className="container"
      style={{ backgroundImage: `url(${home_image})` }}
    >
      <div className="text">
        <br />
        <h1 className="firstHeader">Cryptocurrency Exchange</h1>
        <br />
        <h2 className="secondHeader">
          Explore the cryptocurrency trends and trade coins and much more !!
        </h2>
      </div>
    </div>
  );
};

export default Home;
