import logo from './logo.svg';
import './App.css';
import {useState, useEffect, useRef} from 'react';
import {getProducts, getHistoricalData} from './services/api-coinbase'
import { formatData } from "./utils";
import axios from 'axios';

function App() {
  
  // const [state, setstate] = useState(initialState)
  const [currencies, setCurrencies] = useState([]);
  const [pair, setPair] = useState('');
  const [price, setPrice] = useState('0.00');
  const [pastData, setpastData] = useState({});
  
  // Whats the effect of this? 
  //Reference for webSocket, to keep a persistent webSocket Object, so it doesnt get recreated on every render.
  // If we use useRef -> ws.current -> ws variable is a reference already. We do not need: let ws = {};
  const ws = useRef(null); 

  // Prevents api Call on our first render?? Don´t understand it... At he end of first hooks changes to first.current = true;
  let first = useRef(false);

  const url = "https://api.pro.coinbase.com";

  useEffect( () => {
    async function fetchData() {
      ws.current = new WebSocket("wss://ws-feed.pro.coinbase.com");
  
      let pairs = [];    
      
      // Filter products with EUR only
      const products = await getProducts();
      let filteredProducts = products.filter((product) => {
        if (product.quote_currency  === "EUR") {
          return product;
        }
      });
      
      // Sort products alphabetically
      filteredProducts = filteredProducts.sort((a, b) => {
        if (a.base_currency < b.base_currency) {
          return -1;
        }
        if (a.base_currency > b.base_currency) {
          return 1;
        }
        return 0;
      });
  
      //This way our second hook also works
      setCurrencies(filteredProducts)
      first.current = true;
  
      console.log("filtered products here ---------", filteredProducts)
    }

    fetchData()

    // The empty array makes the hook not to rerender on an infinte loop. 
    // Otherwise, everytime the stake is updated it will be redrawn. 
  }, []);

  // useEffect(() => {
  //   if (!first.current) {
  //     console.log("returning on first render")
  //     return
  //   }
  //   console.log("running pair change")

  //   let msg = {
  //     type: "subscribe",
  //     product_ids: [pair],
  //     channels: ["ticker"]
  //   };

  //   let msgJson = JSON.stringify(msg);
  //   ws.current.send(msgJson);

  //   // let historicalDataURL = `${url}/products/${pair}/candles?granularity=86400`;
    
  //   async function fetchHistoricalData() {
  //     const historicalData = await getHistoricalData(pair);
  //     console.log(historicalData)

  //   // let historicalDataURL = `${url}/products/${pair}/candles?granularity=86400`;
  //   // const fetchHistoricalData = async () => {
  //   //   let dataArr = [];
  //   //   await fetch(historicalDataURL)
  //   //     .then((res) => res.json())
  //   //     .then((data) => (dataArr = data));
      
  //     let formattedData = formatData(historicalData);
  //     setpastData(formattedData);
  //   };

  //   fetchHistoricalData();

  //   ws.current.onmessage = e => {
  //     let data = JSON.parse(e.data);
  //     if (data.type !== "ticker") {
  //       console.log("non ticker event", e);
  //       return
  //     }
  //     if (data.product._id === pair) {
  //       console.log(data.price)
  //       setPrice(data.price)
  //     }
  //   }

  // },[pair])

  useEffect(() => {
    if (!first.current) {      
      return;
    }

    
    let msg = {
      type: "subscribe",
      product_ids: [pair],
      // product_ids: ["BTC-EUR"],
      channels: ["ticker"]
    };
    let jsonMsg = JSON.stringify(msg);
    ws.current.send(jsonMsg);

    let historicalDataURL = `${url}/products/${pair}/candles?granularity=86400`;
    const fetchHistoricalData = async () => {
      let dataArr = [];
      await fetch(historicalDataURL)
        .then((res) => res.json())
        .then((data) => (dataArr = data));
      
      let formattedData = formatData(dataArr);
      setpastData(formattedData);
    };

    fetchHistoricalData();

    ws.current.onmessage = (e) => {
      let data = JSON.parse(e.data);
      if (data.type !== "ticker") {
        return;
      }

      if (data.product_id === pair) {
        setPrice(data.price);
      }
    };
  }, [pair]);

  const handleSelect = (e) => {
    let unsubMsg = {
      type: "unsubscribe",
      product_ids: [pair],
      channels: ["ticker"]
    };
    let unsub = JSON.stringify(unsubMsg);

    ws.current.send(unsub);

    setPair(e.target.value);
    console.log(pair)
  };

  return ( <div className="container">
  {
    <select name="currency" value={pair} onChange={handleSelect}>
      {currencies.map((cur, idx) => {
        return (
          <option key={idx} value={cur.id}>
            {cur.display_name}
          </option>
        );
      })}
    </select>
  }
  {/* <Dashboard price={price} data={pastData} /> */}
</div>
  );
}

export default App;
