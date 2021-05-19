import logo from './logo.svg';
import './App.css';
import {useState, useEffect, useRef} from 'react';
// const [state, setstate] = useState(initialState)

function App() {

  const [currencies, setCurrencies] = useState([]);
  const [pair, setPair] = useState('');
  const [price, setPrice] = useState('0.00');
  const [pastData, setpastData] = useState({});
  const ws = useRef(null);

  let first = useRef(false);
  const url = "https://api.pro.coinbase.com";

  useEffect()

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
