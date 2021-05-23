import logo from './logo.svg';
import './App.css';
import {useState, useEffect, useRef} from 'react';
import {getProducts} from './services/api-coinbase'
import axios from 'axios';
// const [state, setstate] = useState(initialState)

function App() {

  const [currencies, setCurrencies] = useState([]);
  const [pair, setPair] = useState('');
  const [price, setPrice] = useState('0.00');
  const [pastData, setpastData] = useState({});
  const ws = useRef(null);

  let first = useRef(false);
  const url = "https://api.pro.coinbase.com";

  useEffect( async() => {
    ws.current = new WebSocket("wss://ws-feed.pro.coinbase.com");

    let pairs = [];    

    const products = await getProducts();
    let filteredProducts = products.filter((product) => {
      if (product.quote_currency  === "EUR") {
        return product;
      }
    });

    filteredProducts = filteredProducts.sort((a, b) => {
      if (a.base_currency < b.base_currency) {
        return -1;
      }
      if (a.base_currency > b.base_currency) {
        return 1;
      }
      return 0;
    });

    setCurrencies(filteredProducts)
    first.current = true;

    console.log(filteredProducts)
  }, []);


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
