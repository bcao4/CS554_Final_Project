import { Drawer, IconButton, Divider, Typography, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import './tradeBar.css';
import { useState, useContext, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../firebase/Auth";
import { Link } from "react-router-dom";
import axios from "axios";

const TradeBar = (props) => {
  const { coin, livePrice, coinPrice } = props;
  //console.log(props)
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const [tradeBarOpen, setTradeBarOpen] = useState(false);

  const [currBalance, setCurrBalance] = useState(0);

  const [currCoins, setCurrCoins] = useState(0);

  const [errorMsg, setErrorMsg] = useState("");

  const { currentUser } = useContext(AuthContext);

  
  const onSubmit = async(data) =>{

    console.log(currCoins);
    console.log(currBalance);
    setErrorMsg('');
    reset();

    if(parseInt(data.numOfCoins)<0 || Number.isNaN(parseInt(data.numOfCoins)) || ((data.numOfCoins)%1)!==0)
    return setErrorMsg("Input is invalid!!");

    let token = await currentUser.getIdToken();
    let amount1 = (parseInt(data.numOfCoins))*(parseFloat((livePrice!=null?livePrice:coinPrice).replace(/,/, '')));
    let num1= parseInt(data.numOfCoins)
    console.log(amount1);
    let indicator=0;

    for(let i of currCoins)
      {
        console.log(Object.keys(i)[0]);
        console.log(coin)
        console.log(Object.values(i)[0]);
        if(coin==Object.keys(i)[0] && Object.values(i)[0]>=data.numOfCoins)
        {
          indicator=indicator + 1;

        }
      }

    if(data.trade_type=='buy' && amount1>currBalance)
    return setErrorMsg("You don't have enough balance!");

    else if(indicator === 0 && data.trade_type=='sell')
    {
        return setErrorMsg("You don't have enough coins for this sale!");
    }
   // else if(currCoins)*/

    else
    return await axios.post(
      "http://localhost:4000/users/updateBalanceAndCoins",
      { email: currentUser.email, amount: (parseInt(data.numOfCoins))*(parseFloat((livePrice!=null?livePrice:coinPrice).replace(/,/, ''))), coin: coin, num: num1, buyOrSell: data.trade_type   },
      {
        headers: {
          accept: "application/json",
          "Accept-Language": "en-US,en;q=0.8",
          "Content-Type": "application/json",
          authtoken: token,
        }
      }
    )
    }

  useEffect(() => {
    (async () => {
      const getUser = await axios.get(
        "http://localhost:4000/users/"+ currentUser.email);

      console.log(getUser);
      
      setCurrBalance(getUser.data.balance);

    })()

    return () => {
      //unsubscribeOrRemoveEventHandler()  
    }
  }, [currentUser, onSubmit])


  useEffect(() => {
    (async () => {
      const getUser = await axios.get(
        "http://localhost:4000/users/"+ currentUser.email);

      console.log(getUser);
      
      /*for(let i of getUser.data.coins)
      {
        console.log(Object.keys(i)[0]);
        if(coin==Object.keys(i)[0])
        indicator=indicator + 1;
      }*/

      setCurrCoins(getUser.data.coins);
     
    })()

    return () => {
      //unsubscribeOrRemoveEventHandler()  
    }
  }, [currentUser, currBalance])


  const capitalize = useCallback(
    (string) => string.charAt(0).toUpperCase() + string.slice(1),
    []
  );

  return (
    <>
      <Button
        variant="contained"
        style={{ position: "fixed", right: 10, top: 10, zIndex: 2 }}
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
          style={{ color: "white" }}
        >
          <CloseIcon />
        </IconButton>
        <Divider style={{ backgroundColor: "white" }} />
        {!currentUser ? (
          <>
            <Typography
              style={{ color: "white", textAlign: "center", marginTop: 10 }}
            >
              Please sign in to trade {capitalize(coin)}!
            </Typography>
            <div className="flex-center" style={{ marginTop: 10 }}>
              <Button
                variant="contained"
                component={Link}
                to="/login"
                style={{ marginRight: 6 }}
              >
                Sign In
              </Button>
              <Button variant="contained" component={Link} to="/signup">
                Sign Up
              </Button>
            </div>
          </>
        ) : (
          <>
            <Typography
              style={{ color: "white", textAlign: "center", marginTop: 10 }}
            >
              Welcome to trading in {capitalize(coin)}
              <p>Your Current balance = {parseFloat(currBalance).toFixed(2) }</p>
              <p> Price = {livePrice !== null
                ? livePrice : coinPrice}</p>
            </Typography>
              <form className="form" onSubmit={handleSubmit(onSubmit)}>
                <br/>
                <label className="input_label">
                Num of coins to trade : 
                <input {...register("numOfCoins", { required: true })} />
                </label>
                <br/>
                <select className="input" {...register("trade_type")}>
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                </select>
                <br/>
                <br/>
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
