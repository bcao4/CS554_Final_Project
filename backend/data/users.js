const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const ObjectId = require('mongodb').ObjectId;

async function createAccount(email, displayname) {
    if (!email || !displayname) throw "String cannot be emapty, you must provide all values";
    if (typeof email != "string") throw "Email must be of type string";
    if (typeof displayname !== "string") throw "Username must be of type string";

    //console.log("Hello")
    let newUser = {
        email: email,
        displayName: displayname,
        balance: 1000,
        coins: []
    };

    let userCollection = await users();
    let insertUser = await userCollection.insertOne(newUser);
    if (insertUser.insertedCount === 0) throw 'User was not inserted!';
    let newId = insertUser.insertedId;
    newId = newId.toString();
    return await getUserById(newId);
}

async function getUserById(id) {
    if (id === undefined) throw 'You must provide an id!';
    const userCollection = await users();
    let parsedId = ObjectId(id);
    let getUser = await userCollection.findOne({ _id: parsedId });
    if (!getUser) throw 'User not found';
    getUser._id = id.toString();
    return getUser;
}

async function getUserByEmail(email) {
    if (email === undefined) throw 'You must provide an email!';
    if (typeof email != "string") throw "Email must be of type string";
    const userCollection = await users();
    let getUser = await userCollection.findOne({ email: email });
    if (!getUser) throw 'User not found';
    getUser._id = getUser._id.toString();
    return getUser;
}

async function updateUserBalance(email,amount,buyOrSell) {
    console.log("hello from data")
    if (email === undefined) throw 'You must provide an email!';
    if (typeof(email) != "string") throw "Email must be of type string";

    if(buyOrSell=='buy')
    amount= amount*(-1);

    const userCollection = await users();
    let getUserOld = await userCollection.findOne({ email: email });
    let newbalance = getUserOld.balance + amount;
    let getUser = await userCollection.updateOne({ email: email }, {$set: {balance: newbalance}});

    if (!getUser) throw 'User not found';
    getUser._id = getUser._id.toString();
    return getUser;
}

async function updateUserCoin(email,coin,number,buyOrSell) {
    if (email === undefined) throw 'You must provide an email!';
    if (typeof(email) != "string") throw "Email must be of type string";

    if(buyOrSell=='sell')
    number = number * (-1);

    const userCollection = await users();
    let getUserOld = await userCollection.findOne({ email: email });
    let indicator =0;
    let newCoin={};
    let getUser={};
    for (let i of getUserOld.coins)
    {
        console.log(i)
        key = Object.keys(i);
        value = Object.values(i);
        console.log(newCoin);
        if(key[0]==coin)
        {
            console.log("if")
            newCoin[coin] = value[0]+ number;
            console.log(key[0])
            console.log(newCoin);
            getUser = await userCollection.updateOne({ email: email }, { $pull: {coins: {[key[0]]: value[0]}}} );
            getUser = await userCollection.updateOne({ email: email },  {$push: {coins: newCoin}});
            indicator= indicator+1;
            break;
        }
    }
    if(indicator==0)
    {
        console.log("else if")
        let newCoin2={}
        newCoin2[coin]=number;
        console.log(newCoin2);
        getUser = await userCollection.updateOne({ email: email }, {$push: {coins: newCoin2}});
    }

    //console.log(getUser)

    if (!getUser) throw 'User not found';
    getUser._id = getUser._id.toString();
    return getUser;
}


async function getAllUser() {
    const userCollection = await users();
    let allUser = await userCollection.find({}).toArray();
    if(allUser <= 0) return "No user in the database";
    return allUser;
}

module.exports = {
    createAccount,
    getUserById,
    getUserByEmail,
    getAllUser,
    updateUserBalance,
    updateUserCoin
};