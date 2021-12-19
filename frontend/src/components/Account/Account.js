import { useContext, useEffect, useState } from "react";
import "./accountPage.css";
import { AuthContext } from "../../firebase/Auth";
import axios from "axios";
import { NavLink } from "react-router-dom";
import SignOutButton from "./SignOut";
import { API_URL } from "../../api";
//import { getCoinInfo } from "../../api";
//img
import UploadImage from "./UploadImage";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import 'firebase/firestore';
import app from 'firebase/app'
const db = app.firestore();

const Account = (props) => {
  const { currentUser } = useContext(AuthContext);
  const [userName, setUserName] = useState(undefined);

  // Buying and selling code start ############################
  const [currBalance, setCurrBalance] = useState(0);
  const [currCoins, setCurrCoins] = useState([]);
  //const [accBalance, setAccBalance] = useState(0);
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
    async function fetchData() {
      try {
        let token = await currentUser.getIdToken();
        let config = {
          method: "get",
          url: `${API_URL}/users/` + currentUser.email,   //removedhttp for API call
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
        let coinListDisplay=[];
        for(let i of data.coins )
        {
          if((Object.values(i)[0])>0)
          coinListDisplay.push(i)
        }
        setCurrCoins(coinListDisplay)
      // Buying and selling code end ############################

      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [currentUser.email, userName, currentUser]);

  useEffect(() => {
    async function fetchData() {
      var docRef = db.collection('profilePics').doc(uid);
      docRef
        .get()
        .then(function (doc) {
          if (doc.exists) {
            setUserData(doc.data());
          } else {
            console.log('No file found!');
          }
        })
        .catch(function (e) {
          console.log(e);
        });
    }
    fetchData();
  }, [isImageDialogOpen, uid]);

  // Buying and selling code start ############################


  // Buying and selling code end ############################

  const changePassword = () => {
    if (currentUser.providerData[0].providerId === "password") {
      return (
        <button className="btn-reset-pswd">
          <NavLink exact to="/changepassword" activeclassname="active">
            Reset password
          </NavLink>
        </button>
      );
    } else {
      return null;
    }
  };

  return (
    <>
      <div>
        <div className="form-body">
          <h2>Account Details</h2>
          <div>
          <p><img
              width={150}
              height={150}
              src={userData.imageUrl ? userData.imageUrl : 
                'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png'
              }
              alt="Profile icon"
            /></p>
            <b>Name: </b>
            {userName}
            <br />
            <br />
            <b>Email: </b>
            {currentUser.email}
          </div>
          {/*// Buying and selling code start ############################*/}
          <div>
          <br />
          <b>Cash Balance: </b>
          ${parseFloat(currBalance).toFixed(2)}
          <br />
          <br />
          <b>Current coins: </b>
          {currCoins.length?            
            (currCoins).map(i =>( 
          <li> 
          <NavLink exact to={`/coin/${Object.keys(i)[0]}`} >{Object.keys(i)[0]} </NavLink>: {Object.values(i)[0]} 
          </li>
          )): "None"}

          </div>
          {/*// Buying and selling code end ############################*/}         
          <br />
           {/* Image Upload Button */}
           <button className="btn-image-upload" onClick={openImageDialog}>
            Upload Image
          </button>
          {changePassword()}
          <SignOutButton />

          {/* Image dialog box */}
          <Dialog
            open={isImageDialogOpen}
            onClose={handleClickCancel}
            PaperProps={{
              style: {
                height: 350,
                width: 500
              },
            }}
          >
            <DialogTitle>Upload Profile Picture
              <IconButton onClick={handleClickCancel} className="close-icon">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <UploadImage />
            <DialogActions>
              <Button onClick={handleClickCancel}>Cancel</Button>
              <Button onClick={handleClickOk}>Ok</Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default Account;
