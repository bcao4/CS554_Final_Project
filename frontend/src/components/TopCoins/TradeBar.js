import {
  Drawer,
  IconButton,
  Divider,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  FormLabel,
  Input,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./TradeBar.css";
import { useState, useContext, useCallback, useEffect } from "react";
import { capitalize, convertPrice } from "../../utils";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../firebase/Auth";
import { Link } from "react-router-dom";
import { API_URL } from "../../api";
import axios from "axios";

const StyledTypography = (props) => {
  return <Typography {...props} sx={{ color: "text.secondary" }} />;
};

const StyledToggleButton = (props) => {
  return (
    <ToggleButton
      {...props}
      sx={{
        color: "button.color",
      }}
    />
  );
};

const TradeBar = (props) => {
  const { coin, coinPrice, setLoading } = props;
  const { handleSubmit, reset } = useForm();

  const [tradeBarOpen, setTradeBarOpen] = useState(false);
  const [currBalance, setCurrBalance] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [tradeType, setTradeType] = useState("buy");
  const [numOfCoins, setNumOfCoins] = useState(0);
  const [amountOwned, setAmountOwned] = useState(0);

  const { currentUser } = useContext(AuthContext);

  const decimalCount = (num) => {
    // Convert to String
    const numStr = String(num);
    // String Contains Decimal
    if (numStr.includes(".")) {
      return numStr.split(".")[1].length;
    }
    // String Does Not Contain Decimal
    return 0;
  };

  const onSubmit = useCallback(
    async (data) => {
      setErrorMsg("");
      reset();

      if (
        parseInt(numOfCoins) < 0 ||
        Number.isNaN(parseInt(numOfCoins)) ||
        Number.isNaN(parseFloat(numOfCoins * coinPrice)) ||
        decimalCount(numOfCoins) > 6
      )
        return setErrorMsg("Input is invalid!!");

      let token = await currentUser.getIdToken();
      let amount1 = parseFloat(numOfCoins * coinPrice).toFixed(2);
      let num1 = parseFloat(numOfCoins);

      if (tradeType === "buy" && parseFloat(amount1) > parseFloat(currBalance))
        return setErrorMsg("You don't have enough balance!");
      else if (tradeType === "sell" && amountOwned < numOfCoins) {
        return setErrorMsg("You don't have enough coins for this sale!");
      }
      // else if(currCoins)*/
      setLoading(true);
      await axios.post(
        `${API_URL}/users/updateBalanceAndCoins`,
        {
          email: currentUser.email,
          amount: parseFloat(numOfCoins * coinPrice).toFixed(2),
          coin: coin,
          num: num1,
          buyOrSell: tradeType,
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
      await new Promise((r) => setTimeout(r, 1000));
      const getUser = await axios.get(`${API_URL}/users/${currentUser.email}`);
      setCurrBalance(getUser.data.balance);
      for (let i of getUser.data.coins) {
        if (coin === Object.keys(i)[0]) {
          setAmountOwned(Object.values(i)[0]);
        }
      }
      setTradeType("buy");
      setLoading(false);
    },
    [
      coin,
      currBalance,
      currentUser,
      reset,
      coinPrice,
      setLoading,
      numOfCoins,
      tradeType,
      amountOwned,
    ]
  );

  useEffect(() => {
    (async () => {
      try {
        const getUser = await axios.get(
          `${API_URL}/users/${currentUser.email}`
        );

        for (let i of getUser.data.coins) {
          if (coin === Object.keys(i)[0]) {
            setAmountOwned(Object.values(i)[0]);
          }
        }

        setCurrBalance(getUser.data.balance);
      } catch (e) {}
    })();

    return () => {
      //unsubscribeOrRemoveEventHandler()
    };
  }, [currentUser, coin]);

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
              Trading: {capitalize(coin)}
            </StyledTypography>
            <StyledTypography>
              {capitalize(coin)} owned: {amountOwned}
            </StyledTypography>
            <StyledTypography>
              Current Balance: ${convertPrice(currBalance)}
            </StyledTypography>
            <StyledTypography>
              {capitalize(coin)} Price: ${convertPrice(coinPrice)}
            </StyledTypography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  marginTop: "16px",
                }}
              >
                <FormLabel
                  className="input_label"
                  htmlFor="numCoins"
                  style={{ marginRight: "4px" }}
                >
                  Amount to trade
                </FormLabel>
                <Input
                  size="small"
                  type="number"
                  inputProps={{ step: "0.00001", min: "0" }}
                  style={{ backgroundColor: "white" }}
                  onChange={(e) => {
                    setNumOfCoins(e.target.value);
                  }}
                  required
                  id="numCoins"
                />
              </div>
              {numOfCoins > 0 && (
                <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                  <StyledTypography>
                    {tradeType === "buy"
                      ? "Estimated cost: $"
                      : "Estimated gain: $"}
                    {convertPrice(numOfCoins * coinPrice)}
                  </StyledTypography>
                </div>
              )}
              <ToggleButtonGroup
                size="large"
                value={tradeType}
                fullWidth
                variant="contained"
                exclusive
                onChange={(_, newType) => {
                  if (newType) {
                    setTradeType(newType);
                  }
                }}
                className="flex-center"
                sx={{ backgroundColor: "background.color", marginTop: "20px" }}
              >
                <StyledToggleButton value="buy">Buy</StyledToggleButton>
                <StyledToggleButton value="sell" disabled={amountOwned <= 0}>
                  Sell
                </StyledToggleButton>
              </ToggleButtonGroup>
              <div className="flex-center" style={{ marginTop: "20px" }}>
                <Button variant="contained" type="submit" size="large">
                  Submit
                </Button>
              </div>
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
