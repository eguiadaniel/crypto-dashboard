import axios from 'axios';

const url = 'https://api.pro.coinbase.com';

// get all products from coinbase
export const getProducts = async () => {
  const response = await axios.get(url + '/products');
  console.log('Axios getProducts here -----------');
  console.log(response.data);
  return response.data;
};

// get historical data
export const getHistoricalData = async (pair) => {
  const response = await axios.get(
    url + `/products/${pair}/candles?granularity=86400`
  );
  console.log('Axios historicalData here -----------');
  // console.log(response.data)
  return response.data;
};
