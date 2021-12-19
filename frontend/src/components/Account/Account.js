import { useContext, useEffect, useState, useRef } from "react";
import "./accountPage.css";
import { AuthContext } from "../../firebase/Auth";
import axios from "axios";
import { Link } from "react-router-dom";
import SignOutButton from "./SignOut";
import { API_URL, getCoinInfo } from "../../api";
import { capitalize, convertPrice } from "../../utils";
import UploadImage from "./UploadImage";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  ListItem,
  Typography,
  List,
} from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "firebase/firestore";
import app from "firebase/app";
const db = app.firestore();

const Account = (props) => {
  const { currentUser } = useContext(AuthContext);
  const [userName, setUserName] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const interval = useRef(null);

  const [symbols, setSymbols] = useState({});

  // Buying and selling code start ############################
  const [currBalance, setCurrBalance] = useState(0);
  const [currCoins, setCurrCoins] = useState([]);
  const [accBalance, setAccBalance] = useState(0);
  const [defVal, setdefVal] = useState(0);
  // Buying and selling code end ##############################

  //img upload
  const [isImageDialogOpen, setImageDialog] = useState(false);
  const [userData, setUserData] = useState({});
  let uid = currentUser.uid;

  const openImageDialog = () => {
    setImageDialog(true);
  };

  const handleClickOk = () => {
    setImageDialog(false);
  };

  const handleClickCancel = () => {
    setImageDialog(false);
  };

  useEffect(() => {
    console.log("render");
    console.log("main useEffect fired");
    async function fetchData() {
      try {
        let token = await currentUser.getIdToken();
        let config = {
          method: "get",
          url: `${API_URL}/users/${currentUser.email}`,
          headers: {
            accept: "application/json",
            "Accept-Language": "en-US,en;q=0.8",
            "Content-Type": "application/json",
            authtoken: token,
          },
        };
        const { data } = await axios(config);
        setUserName(data.displayName);

        // Buying and selling code start ############################
        setCurrBalance(data.balance);
        let coinListDisplay = [];
        for (let i of data.coins) {
          if (Object.values(i)[0] > 0) coinListDisplay.push(i);
        }
        console.log(data);
        setCurrCoins(coinListDisplay);
        // Buying and selling code end ############################
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [currentUser.email, userName, currentUser]);

  useEffect(() => {
    async function fetchData() {
      var docRef = db.collection("profilePics").doc(uid);
      docRef
        .get()
        .then(function (doc) {
          if (doc.exists) {
            setUserData(doc.data());
          } else {
            console.log("No file found!");
          }
        })
        .catch(function (e) {
          console.log(e);
        });
    }
    fetchData();
  }, [isImageDialogOpen, uid]);

  // Buying and selling code start ############################
  // useEffect with setInterval 10 sec to update price
  useEffect(async () => {
    console.log("buying useEffect fired");

    const fetchData = async (coin, num) => {
      try {
        setLoading(true);
        const [coinData] = await Promise.all([getCoinInfo(coin)]);
        console.log(
          coin + " " + num + " " + coinData.market_data.current_price.usd
        );
        console.log(coinData.market_data.current_price.usd * num);
        //setAccBalance(parseFloat(accBalance) + (coinData.market_data.current_price.usd * num))
        //console.log(accBalance)
        return coinData.market_data.current_price.usd * num;
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const updateAccVal = async () => {
      let val = 0;
      for (let i of currCoins) {
        val = val + (await fetchData(Object.keys(i)[0], Object.values(i)[0]));
      }
      //console.log(count);
      setAccBalance(val);
    };

    updateAccVal();
    interval.current = setInterval(updateAccVal, 7000);

    return () => {
      console.log("cleanup");
      clearInterval(interval.current);
    };
  }, [currCoins]);

  // useEffect without setInterval to fire when accBalane changes to prevent delay
  useEffect(async () => {
    const fetchData = async (coin, num) => {
      try {
        setLoading(true);
        const [coinData] = await Promise.all([getCoinInfo(coin)]);
        console.log(
          coin + " " + num + " " + coinData.market_data.current_price.usd
        );
        console.log(coinData.market_data.current_price.usd * num);
        setSymbols((old) => {
          return {
            ...old,
            [coinData.id]: `${coinData.symbol.toUpperCase()} - $${convertPrice(
              coinData.market_data.current_price.usd * num
            )}`,
          };
        });
        //setAccBalance(parseFloat(accBalance) + (coinData.market_data.current_price.usd * num))
        //console.log(accBalance)
        return coinData.market_data.current_price.usd * num;
      } catch (e) {
        console.error(e);
      }
    };
    let defVal = 0;
    for (let i of currCoins) {
      defVal =
        defVal + (await fetchData(Object.keys(i)[0], Object.values(i)[0]));
    }
    if (!accBalance)
      setdefVal((parseFloat(defVal) + parseFloat(currBalance)).toFixed(2));
  }, [accBalance]);

  // Buying and selling code end ##############################

  const changePassword = () => {
    if (currentUser.providerData[0].providerId === "password") {
      return (
        <Button variant="contained" component={Link} to="/changepassword">
          Reset password
        </Button>
      );
    } else {
      return null;
    }
  };

  return (
    <>
      <div>
        <div className="form-body">
          <Typography variant="h1" style={{ fontSize: "2rem" }}>
            Account Details
          </Typography>
          <div>
            <img
              className="profile-pic"
              src={
                userData.imageUrl
                  ? userData.imageUrl
                  : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
              }
              alt="Profile icon"
            />
            <Typography fontWeight={600} style={{ marginTop: "10px" }}>
              Name
            </Typography>
            <Typography>{userName}</Typography>
            <Typography fontWeight={600} style={{ marginTop: "10px" }}>
              Email
            </Typography>
            <Typography>{currentUser.email}</Typography>
          </div>
          {/*// Buying and selling code start ############################*/}
          <div>
            <Typography fontWeight={600} style={{ marginTop: "10px" }}>
              Cash Balance
            </Typography>
            ${convertPrice(currBalance)}
            <Typography fontWeight={600} style={{ marginTop: "10px" }}>
              Current Coins
            </Typography>
            <List>
              {currCoins.length
                ? currCoins.map((i) => (
                    <ListItem key={Object.keys(i)[0]}>
                      <Link to={`/coin/${Object.keys(i)[0]}`}>
                        {capitalize(Object.keys(i)[0])}
                      </Link>
                      : {Object.values(i)[0]} {symbols[Object.keys(i)[0]]}
                    </ListItem>
                  ))
                : "None"}
            </List>
            <b>Total Account value: $ </b>
            {parseInt(accBalance)
              ? (parseFloat(accBalance) + parseFloat(currBalance)).toFixed(2)
              : parseInt(defVal)
              ? defVal
              : "loading..."}
          </div>
          {/*// Buying and selling code end ############################*/}
          {/* Image Upload Button */}
          <div style={{ marginTop: "10px" }}>
            <Button
              variant="contained"
              onClick={openImageDialog}
              style={{ marginRight: "6px" }}
            >
              Upload Image
            </Button>
            {changePassword()}
            <SignOutButton style={{ marginLeft: "6px" }} />
          </div>

          {/* Image dialog box */}
          <Dialog
            open={isImageDialogOpen}
            onClose={handleClickCancel}
            PaperProps={{
              style: {
                height: 500,
                width: 600,
              },
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <DialogTitle>
                Upload Profile Picture
                <IconButton onClick={handleClickCancel} className="close-icon">
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <UploadImage />
              <DialogActions>
                <Button variant="contained" onClick={handleClickCancel}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleClickOk}>
                  Ok
                </Button>
              </DialogActions>
            </div>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default Account;
