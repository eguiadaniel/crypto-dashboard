import axios from 'axios';

const url = 'https://api.pro.coinbase.com';

// get all products from coinbase
export const getProducts = async() => {
    const response = await axios.get(url + "/products")
    console.log('-----------getProducts')
    console.log(response.data)
    return response.data;
}