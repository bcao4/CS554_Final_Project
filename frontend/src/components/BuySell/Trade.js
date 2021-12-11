import React,{ useState,useEffect } from "react";
import { useForm } from "react-hook-form";
const GDAX = require("gdax");


export default function Trade() {

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const publicClient = new GDAX.PublicClient();
  const {productidState, setProductidState} = useState([]);
  const apiURI = 'https://api.gdax.com';

  const callback = (error, response, data) => {
    if (error)
        return console.dir(error);

    return console.dir(data);;
  }
  
  const onSubmit = data => 
  {
    console.log(data);

    /* Authenticate user to GDAX(CoinBase Pro)*/
    const authenticatedClient = new GDAX.AuthenticatedClient(data.gdaxKey, data.gdaxSecret, data.passPhrase, apiURI);

    /* Buying */
    function placeBuy(data) {

        const buyParams = {
    
            'price': data.price,
    
            'size': data.size,
    
            'product_id': data.product_id,
    
        };
        this.buyOrderId = authenticatedClient.buy(buyParams, callback);
    
    }

    /* Selling */
    function placeSell(data) {

        const sellParams = {
    
            'price': data.price,
    
            'size': data.size,

            'product_id': data.product_id,
    
        };
        this.sellOrderId = authenticatedClient.sell(sellParams, callback); 
    }

    /* Check if user chose buy or sell */
    if(data.buyOrSell == "buy")
    placeBuy(data);
    else
    placeSell(data)

  }
  /* Get all Product-id like BTC_USD*/
  /*const getProductID = () =>{
    const callback = (error, response, data) => {
      if (error)
          return console.dir(error);
  
      return console.dir(data);;
    }
    publicClient.getProducts(callback);
    }
  */

  return (
    
    <form onSubmit={handleSubmit(onSubmit)}>
        <br/>
        <input defaultValue="Enter GDAX key" {...register("gdaxKey", { required: true })} />
        <br/>
        <input defaultValue="Enter GDAX passphrase" {...register("gdaxSecret", { required: true })} />
        <br/>
        <input defaultValue="Enter GDAX secret" {...register("passPhrase", { required: true })} />
        <br/>
        <select  {...register("buyOrSell")}>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
        </select>
        <br/>
        <input defaultValue="Enter price" {...register("price", { required: true })} />
        <br/>
        <input defaultValue="Enter size" {...register("size", { required: true })} />
        <br/>
        <input defaultValue="Enter Product_ID(BTC_USD)" {...register("product-id", { required: true })} />
        <br/>
        {errors.exampleRequired && <span>Sorry! There was an error</span>}
        <br/>
        <input type="submit" />
    </form>
  );
}