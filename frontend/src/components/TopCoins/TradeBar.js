import { Drawer, IconButton, Divider, Typography, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useContext, useCallback, useEffect } from "react";
import { AuthContext } from "../../firebase/Auth";
import { Link } from "react-router-dom";
import axios from "axios";

const TradeBar = (props) => {
  const { coin, livePrice, coinPrice } = props;
  console.log(props)

  const [tradeBarOpen, setTradeBarOpen] = useState(false);

  const [currBalance, setCurrBalance] = useState(0);

  const { currentUser } = useContext(AuthContext);

  console.log(currentUser)
  
  const getBalance1 =  () =>{

    /*
    let getUser = await axios.get(
      "http://localhost:4000/users/"+ currentUser.email
    )

    if(getUser)   
    return await getUser.balance; */
    return "hi"
  }

  const getBalance = async () =>{

    /*
    let getUser = await axios.get(
      "http://localhost:4000/users/"+ currentUser.email
    )

    if(getUser)   
    return await getUser.balance; */
    return "hi"
  }

  useEffect(() => {
    (async () => {
      const getUser = await axios.get(
        "http://localhost:4000/users/"+ currentUser.email);

      console.log(getUser)
      
      setCurrBalance(getUser.data.balance)
    })()

    return () => {
      //unsubscribeOrRemoveEventHandler()  
    }
  }, [currentUser])

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
              <p>Your Current balance = {currBalance}</p>
              <p> Price = {livePrice !== null
                ? livePrice : coinPrice}</p>
            </Typography>
            <div >
              <p>The coin is : {capitalize(coin)}</p>
            </div>
          </>  
        )}
      </Drawer>
    </>
  );
};

export default TradeBar;
