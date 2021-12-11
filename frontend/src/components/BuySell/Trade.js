import React from "react";
import { useForm } from "react-hook-form";
const GDAX = require("gdax");
const publicClient = new GDAX.PublicClient();

const getProductID = () => {

    let list;
    const callback = (error, response, data) => {
    if (error)
        return console.dir(error);
    list =data
    console.log(list)
    //return console.dir(data);
    return data;
    }
    publicClient.getProducts(callback);
    console.log(list)
    return list;

}

export default function Trade() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = data => console.log(data);

  let list = getProductID();
  console.log(list)
  //console.log(watch("example")); // watch input value by passing the name of it

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
        <select  {...register("product-id")}>
            <option value="BTC_USD">BTC_USD</option>
            {(getProductID()).map(i =>
                <option value={i.id}>{i.id}</option>
            )}
        </select>



        {errors.exampleRequired && <span>Sorry! There was an error</span>}
        <br/>
        <input type="submit" />
    </form>
  );
}