import axios from "axios";

export const callAPI = async (endpoint, method, headers = {}, params = {}, data = {}) => {
  const baseURL = 'https://restcountries.com/v3.1';
  const options = {
    baseURL,
    url: endpoint,
    method,
    headers,
    params,
    data
  }

  const response = await axios(options);
  return response?.data;
}