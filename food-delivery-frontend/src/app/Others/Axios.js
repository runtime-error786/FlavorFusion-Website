import axios from 'axios';

const axio = axios.create({
  baseURL: 'http://localhost:8001',  // Ensure this matches your Django backend URL
  timeout: 5000,  // Adjust timeout as needed
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axio;
