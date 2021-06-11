import logo from './logo.svg';
import './App.css';
import {useState, useEffect, useRef} from 'react';
import {getProducts} from './services/api-coinbase'
import { formatData } from "./utils";
import axios from 'axios';

function App() {
  
  // const [state, setstate] = useState(initialState)
  const [currencies, setCurrencies] = useState([]);
  const [pair, setPair] = useState('ADA-EUR');
  const [price, setPrice] = useState('0.00');
  const [pastData, setpastData] = useState({});

  // let ws = {};
  let ws = useRef(null);
  let first = useRef(false);

  const url = "https://api.pro.coinbase.com";

  useEffect( () => {
    //connect to websocket API
    ws.current = new WebSocket("wss://ws-feed.pro.coinbase.com");  

    // let pairs = []

    //inside useEffect we need to make API with async function  
    async function fetchData() {
        
      const products = await getProducts();

      //coinbase returns over 120 currencies, this will filter to only EUR based pairs
      let filteredProducts = products.filter((product) => {
        if (product.quote_currency  === "EUR") {
          return product;
        }
      });

      //sort filtered currency pairs alphabetically
      let sortedProducts = filteredProducts.sort((a, b) => {
        if (a.base_currency < b.base_currency) {
          return -1;
        }
        if (a.base_currency > b.base_currency) {
          return 1;
        }
        return 0;
      });
  
      setCurrencies(sortedProducts)
      first.current = true;
  
      console.log("filtered & sorted products here ---------", sortedProducts)
    }
    //call async function
    fetchData()

    //Empty Array = Dependency array.  Effect hook only runs on the initial render.
    //If no argument is passed it will run every time state changes.
  }, []);

  // useEffect(() => {
  //    //prevents this hook from running on initial render
  //   if (!first.current) {
  //     console.log("first.current = false. Prevents Real-Time data API running on first render")
  //   }
  //   console.log("first.current = true. Real-Time data API running on pair change")
  // },[])

  useEffect(() => {
    //prevents this hook from running on initial render
    if (!first.current) {
      return;
    }

    
    let msg = {
      type: "subscribe",
      product_ids: [pair],
      channels: ["ticker"]
    };
  
    let jsonMsg = JSON.stringify(msg);
    ws.current.onopen = () => {
      ws.current.send(jsonMsg);
    }

    let historicalDataURL = `${url}/products/${pair}/candles?granularity=86400`;
    const fetchHistoricalData = async () => {
      let dataArr = [];
      await fetch(historicalDataURL)
        .then((res) => res.json())
        .then((data) => (dataArr = data));
      
      //helper function to format data that will be implemented later
      let formattedData = formatData(dataArr);
      setpastData(formattedData);
    };
    //run async function to get historical data
    fetchHistoricalData();
    //need to update event listener for the websocket object so that it is listening for the newly updated currency pair
    ws.current.onmessage = (e) => {
      let data = JSON.parse(e.data);
      if (data.type !== "ticker") {
        return;
      }
      //every time we receive an even from the websocket for our currency pair, update the price in state
      if (data.product_id === pair) {
        setPrice(data.price);
        console.log(data.price)
      }
    };
  //dependency array is passed pair state, will run on any pair state change
  }, [pair]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
