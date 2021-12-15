import { useContext, useEffect, useState } from "react";
import "./accountPage.css";
import { AuthContext } from "../../firebase/Auth";
import axios from "axios";
import { NavLink } from "react-router-dom";
import SignOutButton from "./SignOut";
import { API_URL } from "../../api";

const Account = (props) => {
  const { currentUser } = useContext(AuthContext);
  const [userName, setUserName] = useState(undefined);

  // Buying and selling code start ############################
  const [currBalance, setCurrBalance] = useState(0);
  const [currCoins, setCurrCoins] = useState([]);
// Buying and selling code end ##############################

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
          <br />
          <div>
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
          <b>Current Balance: </b>
          ${parseFloat(currBalance).toFixed(2)}
          <br />
          <br />
          <b>Current coins: </b>
          {currCoins.length?            
            (currCoins).map(i =>( 
          <li> 
          {Object.keys(i)[0]} : {Object.values(i)[0]} 
          </li>
          )): "None"}
          </div>
          {/*// Buying and selling code start ############################*/}         
          <br />
          {changePassword()}
          <SignOutButton />
        </div>
      </div>
    </>
  );
};

export default Account;
