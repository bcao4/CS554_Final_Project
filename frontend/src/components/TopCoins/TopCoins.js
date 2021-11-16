import React, { useState, useEffect } from 'react';
import axios from 'axios';
import millify from "millify";
import './TopCoins.css'

let baseUrl = "https://api.coingecko.com/api/v3/coins/markets"

const TopCoins = () => {
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(false);
  const [ pageNum, setPageNum ] = useState(1);
	const [ coinData, setCoinData ] = useState(undefined);
	const [ nextPageStatus, setNextPageStatus ] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(false);
    async function fetchData() {
      try {
        const { data } = await axios({
          method: 'GET',
          url: baseUrl,
          params: {vs_currency: "usd", per_page: "40", sparkline: "true", price_change_percentage: "24h", page: pageNum}
        });
        console.log(data);
        // setCoinData(prevCoins => {
        //   return [prevCoins, data]
        // })
        setCoinData(data);
        if(data.length < 100) {
          setNextPageStatus(false);
        } else {
          setNextPageStatus(true);
        }
        setLoading(false);
      } catch(e) {
        setError(true);
        console.log(e);
      }
    }
    fetchData();
  }, [pageNum]);

  if(loading) {
    return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
  } else {
    return (
      <>
        <div class="container">
          <div class="row">
          {coinData.map((coin, index) => {
            let currentPrice = millify(coin.current_price);
            let marketCap = millify(coin.market_cap);
            let dayHigh = millify(coin.high_24h);
            let dayLow = millify(coin.low_24h);
            let priceChange = millify(coin.price_change_percentage_24h, {
              precision:2
            });

            return (
                <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-xs-12">
                  <div className="card text-center" key={coin.id}>
                    <div class="card-header">
                      {index + 1}. {coin.name} <img src={coin.image} alt={coin.id} height="18" />
                    </div>
                    <div className="card-body">
                      Current Price: ${currentPrice}   
                      <br/>
                      <br/>
                      Market Cap: ${marketCap}
                      <br/>
                      <br/>
                      24h High: ${dayHigh}
                      <br/>
                      <br/>
                      24h Low: ${dayLow}
                      <br/>
                      <br/>
                      24h Change: {priceChange}%
                    </div> 
                  </div>
                </div>
            )
          })}
          </div>
        </div>
      </>
    )
  }
};

export default TopCoins;