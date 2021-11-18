import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import millify from "millify";
import './TopCoins.css'


// Followed pagination tutorial: https://www.youtube.com/watch?v=NZKUirTtxcg&t=1218s
// https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=100&page=1&sparkline=true&price_change_percentage=24h

let baseUrl = "https://api.coingecko.com/api/v3/coins/markets";
let coinListUrl = "https://api.coingecko.com/api/v3/coins/list";

const TopCoins = () => {
  const [ loading, setLoading ] = useState(true);
  const [ pageNum, setPageNum ] = useState(1);
	const [ coinData, setCoinData ] = useState([]);
  const [ searchTerm, setSearchTerm ] = useState("");
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

  const searchFunc = () => {
    return coinData.filter((coin) => 
      coin.id.toLowerCase().includes(searchTerm) ||
      coin.symbol.toLowerCase().includes(searchTerm) ||
      coin.name.toLowerCase().includes(searchTerm)
    );
  };

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        const { data } = await axios({
          method: 'GET',
          url: baseUrl,
          params: {vs_currency: "usd", per_page: "40", sparkline: "true", price_change_percentage: "24h", page: pageNum}
        });
        setCoinData((prevCoins) => [...prevCoins, ...data]);
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
        <div className="container-fluid">
          <div className="row">
            <form>
              <input 
                className="form-control" 
                type="search" 
                placeholder="Search for a Coin..." 
                aria-label="Search"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
            {searchFunc().map((coin, index) => {
              let coinSymbol = coin.symbol ? coin.symbol : "No symbol";
              let currentPrice = coin.current_price ? millify(coin.current_price) : "Not available";
              let marketCap = coin.market_cap ? millify(coin.market_cap) : "Not available";
              let dayHigh = coin.high_24h ? millify(coin.high_24h) : "Not available";
              let dayLow = coin.low_24h ? millify(coin.low_24h) : "Not available";
              let priceChange = coin.price_change_percentage_24h ? 
                millify(coin.price_change_percentage_24h, { precision:2}) : "Not available";
              
              if(searchFunc().length === index + 1) {
                return (
                  <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-xs-12" key={coin.name}>
                    <div className="card text-center" ref={lastCoinElementRef}>
                      <div className="card-header">
                          {index + 1}. {coin.name} <img src={coin.image} alt={coin.id} height="45" />
                      </div>
                      <div className="card-body">
                        Symbol: {coinSymbol}
                        <br/>
                        <br/>
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
                  <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-xs-12 mb-3" key={coin.name}>
                    <div className="card text-center border-0 h-100">
                      <div className="card-header h-100">
                        {index + 1}. {coin.name} <img id="top-coin-img" src={coin.image} alt={coin.id} height="45" />
                      </div>
                      <div className="card-body">
                        Symbol: {coinSymbol}
                        <br/>
                        <br/>
                        Current Price: ${coin.current_price}   
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