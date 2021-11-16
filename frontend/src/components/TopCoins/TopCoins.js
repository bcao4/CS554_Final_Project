import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import millify from "millify";
import './TopCoins.css'


// Followed pagination tutorial: https://www.youtube.com/watch?v=NZKUirTtxcg&t=1218s

let baseUrl = "https://api.coingecko.com/api/v3/coins/markets"

const TopCoins = () => {
  const [ loading, setLoading ] = useState(true);
  const [ pageNum, setPageNum ] = useState(1);
	const [ coinData, setCoinData ] = useState([]);
	const [ nextPageStatus, setNextPageStatus ] = useState(true);

  const observer = useRef();
  const lastCoinElementRef = useCallback(node => {
    if(loading) return;
    if(observer.current) {
      observer.current.disconnect();
    }
    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting) {
        console.log('visible' && nextPageStatus);
        setPageNum(prevPageNum => prevPageNum + 1);
      }
    });
    if(node) {
      observer.current.observe(node);
    }
    console.log(node);
  }, [loading, nextPageStatus]);

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        const { data } = await axios({
          method: 'GET',
          url: baseUrl,
          params: {vs_currency: "usd", per_page: "40", sparkline: "true", price_change_percentage: "24h", page: pageNum}
        });
        console.log(data);
        setCoinData((prevCoins) => [...prevCoins, ...data]);
        //setCoinData(data);
        if(data.length < 40) {
          setNextPageStatus(false);
        } else {
          setNextPageStatus(true);
        }
        setLoading(false);
      } catch(e) {
        console.log(e);
      }
    }
    fetchData();
  }, [pageNum]);

  // if(loading) {
  //   return (
	// 		<div>
	// 			<h2>Loading....</h2>
	// 		</div>
	// 	);
  // } else {
    return (
      <>
        <div className="container">
          <div className="row">
            {coinData.map((coin, index) => {
              let currentPrice = millify(coin.current_price);
              let marketCap = millify(coin.market_cap);
              let dayHigh = millify(coin.high_24h);
              let dayLow = millify(coin.low_24h);
              let priceChange = millify(coin.price_change_percentage_24h, {
                precision:2
              });
              
              if(coinData.length === index + 1) {
                return (
                  <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-xs-12" key={coin.name}>
                    <div className="card text-center" ref={lastCoinElementRef}>
                      <div className="card-header">
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
                        <br/>
                        <br/>
                        <Link to={`/coin/${coin.id}`}className="btn btn-primary">More Info</Link>
                      </div> 
                    </div>
                  </div>
                )
              } else {
                return (
                  <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-xs-12" key={coin.name}>
                    <div className="card text-center h-100">
                      <div className="card-header h-100">
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
                        <br/>
                        <br/>
                        <Link to={`/coin/${coin.id}`}className="btn btn-primary">More Info</Link>
                      </div> 
                    </div>
                  </div>
                )
              }
            })}
          </div>
        </div>
      </>
    )
  };
//};

export default TopCoins;