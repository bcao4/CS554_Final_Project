import { Drawer, IconButton, Divider, Typography, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./TradeBar.css";
import { useState, useContext, useCallback, useEffect } from "react";
import { capitalize } from "../../utils";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../firebase/Auth";
import { Link } from "react-router-dom";
import { API_URL } from "../../api";
import axios from "axios";

const StyledTypography = (props) => {
  return <Typography {...props} sx={{ color: "text.secondary" }} />;
};

const TradeBar = (props) => {
  const { coin, coinPrice, setLoading } = props;
  //console.log(props);
  const {
    register,
    handleSubmit,
    reset,
  } = useForm();

  const [tradeBarOpen, setTradeBarOpen] = useState(false);
  const [currBalance, setCurrBalance] = useState(0);
  const [currCoins, setCurrCoins] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [haveCoin, setHaveCoin] = useState(0);
  
  const { currentUser } = useContext(AuthContext);

  const decimalCount = num => {
    // Convert to String
    const numStr = String(num);
    // String Contains Decimal
    if (numStr.includes('.')) {
       return numStr.split('.')[1].length;
    };
    // String Does Not Contain Decimal
    return 0;
 }

  const onSubmit = useCallback(
    async (data) => {
      console.log(currCoins);
      console.log(currBalance);
      setErrorMsg("");
      reset();

      if (
        parseInt(data.numOfCoins) < 0 ||
        Number.isNaN(parseInt(data.numOfCoins)) ||
        Number.isNaN(parseFloat(data.numOfCoins * coinPrice)) ||
        decimalCount(data.numOfCoins)>6
      )
        return setErrorMsg("Input is invalid!!");

      let token = await currentUser.getIdToken();
      let amount1 = parseFloat(data.numOfCoins * coinPrice).toFixed(2);
      let num1 = parseFloat(data.numOfCoins);
      console.log(typeof data.numOfCoins);
      let indicator = 0;

      for (let i of currCoins) {
        console.log(Object.keys(i)[0]);
        console.log(coin);
        console.log(Object.values(i)[0]);
        if (
          coin === Object.keys(i)[0] &&
          Object.values(i)[0] >= data.numOfCoins
        ) {
          indicator = indicator + 1;
        }
      }

      if (data.trade_type === "buy" && parseFloat(amount1) > parseFloat(currBalance))
        return setErrorMsg("You don't have enough balance!");
      else if (indicator === 0 && data.trade_type === "sell") {
        return setErrorMsg("You don't have enough coins for this sale!");
      }
      // else if(currCoins)*/
      setLoading(true);
      await axios.post(
        `${API_URL}/users/updateBalanceAndCoins`,
        {
          email: currentUser.email,
          amount: parseFloat(data.numOfCoins * coinPrice).toFixed(2),
          coin: coin,
          num: num1,
          buyOrSell: data.trade_type,
        },
        {
          headers: {
            accept: "application/json",
            "Accept-Language": "en-US,en;q=0.8",
            "Content-Type": "application/json",
            authtoken: token,
          },
        }
      );
      const getUser = await axios.get(`${API_URL}/users/${currentUser.email}`);
      setCurrBalance(getUser.data.balance);
      setLoading(false);
    },
    [coin, currBalance, currCoins, currentUser, reset, coinPrice, setLoading]
  );

  useEffect(() => {
    (async () => {
      try {
        const getUser = await axios.get(
          `${API_URL}/users/${currentUser.email}`
        );

        //console.log(getUser);

        setCurrBalance(getUser.data.balance);
      } catch (e) {}
    })();

    return () => {
      //unsubscribeOrRemoveEventHandler()
    };
  }, [currentUser, onSubmit]);

  useEffect(() => {
    (async () => {
      try {
        const getUser = await axios.get(
          `${API_URL}/users/${currentUser.email}`
        );

        //console.log(getUser);

      for(let i of getUser.data.coins)
      {
        console.log(Object.keys(i)[0]);
        if(coin==Object.keys(i)[0])
        {
        //indicator=indicator + 1;
        setHaveCoin(Object.values(i)[0])
        }

      }

        setCurrCoins(getUser.data.coins);
      } catch (e) {}
    })();

    return () => {
      //unsubscribeOrRemoveEventHandler()
    };
  }, [currentUser, currBalance]);

  return (
    <>
      <Button
        variant="contained"
        sx={{
          position: "fixed",
          right: 10,
          top: 10,
          zIndex: 2,
          backgroundColor: "button.backgroundColor",
          color: "button.color",
        }}
        onClick={() => setTradeBarOpen(true)}
        size="large"
      >
        Trade
      </Button>
      <Drawer
        sx={{
          width: 400,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 400,
            boxSizing: "border-box",
            backgroundColor: "black",
          },
        }}
        variant="persistent"
        anchor="right"
        open={tradeBarOpen}
      >
        <IconButton
          size="large"
          onClick={() => setTradeBarOpen(false)}
          sx={{ color: "button.color" }}
        >
          <CloseIcon />
        </IconButton>
        <Divider sx={{ backgroundColor: "white" }} />
        {!currentUser ? (
          <>
            <StyledTypography sx={{ textAlign: "center", marginTop: 10 }}>
              Please sign in to trade {capitalize(coin)}!
            </StyledTypography>
            <div className="flex-center" style={{ marginTop: 10 }}>
              <Button
                variant="contained"
                component={Link}
                to="/login"
                sx={{
                  marginRight: 6,
                  color: "button.color",
                  backgroundColor: "button.backgroundColor",
                }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                component={Link}
                to="/signup"
                sx={{
                  color: "button.color",
                  backgroundColor: "button.backgroundColor",
                }}
              >
                Sign Up
              </Button>
            </div>
          </>
        ) : (
          <>
            <StyledTypography sx={{ textAlign: "center", marginTop: 10 }}>
              Welcome to trading in {capitalize(coin)}
            </StyledTypography>
            <StyledTypography>
              Your Current balance = {parseFloat(currBalance).toFixed(2)}
            </StyledTypography>
            <StyledTypography> Price = ${coinPrice}</StyledTypography>
            {parseFloat(haveCoin)>0?
            <StyledTypography> No. of coin owned = {haveCoin}</StyledTypography> : ""
            }
            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              <br />
              <label className="input_label">
                Num of coins to trade :
                <input {...register("numOfCoins", { required: true })} />
              </label>
              <br />
              <select className="input" {...register("trade_type")}>
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
              <br />
              <br />
              <input type="submit" />
            </form>
            {errorMsg}
            <p className="mesg">{errorMsg}</p>
          </>
        )}
      </Drawer>
    </>
  );
};

export default TradeBar;
