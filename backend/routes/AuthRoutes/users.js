const express = require('express');
const router = express.Router();
const data = require('../../data');
const userData = data.users;
const checkAuth = require("./checkAuthentication");

//add user
router.post("/addUser", async(req,res)=>{
    let userInfo = req.body;
    if(!userInfo) throw "you must provide user data to create a user";
    if(!userInfo.displayname) throw "you must provide username";
    if(!userInfo.email) throw "you must provide an email"; 

    try{
        const newUser = await userData.createAccount(
            userInfo.email,
            userInfo.displayname
        );
        res.status(200).json(newUser);
    }catch(e){
        res.status(404).json({message: "Error in inserting user data"});
    }
});

// Buying and Selling code start ##################################################
//update balance and coins
router.post("/updateBalanceAndCoins", async(req,res)=>{
    let tradeInfo = req.body;
    console.log(req.body);
    if(!tradeInfo) throw "you must provide transaction info";
    if(!tradeInfo.amount) throw "you must provide amount1";
    if(!tradeInfo.email) throw "you must provide an email"; 
    console.log("hello from update bal")

    try{
        const newTrade = await userData.updateUserBalance(
            tradeInfo.email,
            tradeInfo.amount,
            tradeInfo.buyOrSell
        );
        res.status(200).json(newTrade);
    }catch(e){
        //console.log("in error1")
        res.status(404).json({message: "Error in recording transaction data"});
    }

    try{
        const newTrade2 = await userData.updateUserCoin(
            tradeInfo.email,
            tradeInfo.coin,
            tradeInfo.num,
            tradeInfo.buyOrSell
        );
        res.status(200).json(newTrade2);
    }catch(e){
        //console.log("In error")
        res.status(404) //.json({message: "Error in recording transaction data"});
    }

});
// Buying and Selling code end ###################################################


//getUser by id
router.get("/:id", async(req,res)=>{
    try {
        //let userById = await userData.getUserById(req.params.id);
        let userById = await userData.getUserByEmail(req.params.id);
        res.status(200).json(userById);
      } catch (e) {
        res.status(404).json({ message: "user id not found" });
      }
});

//get all user
router.get('/', async (req, res) => {
    try{
        let userList = await userData.getAllUser();
        res.status(200).json(userList);
    }catch(e){
        res.status(404).json({message : 'Not found!'});
    }
});

module.exports = router;