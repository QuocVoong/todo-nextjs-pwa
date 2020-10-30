import axios from 'axios';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:4000/api';
const COMMAND      = 'command';
const QUERY        = 'query';

axios.interceptors.request.use(request => {
  return request;
}, error => Promise.reject(error));

axios.interceptors.response.use(response => {
  return response;
}, error => Promise.reject(error));

export const command = ({
                          data,
                          headers = {
                            'Content-Type': 'application/json',
                          }
                        }) => {
  return axios({
    method: 'post',
    url:    `${API_ENDPOINT}/${COMMAND}`,
    data,
    headers,
  });
};

export const query = ({
                        data,
                        headers = {
                          'Content-Type': 'application/json',
                        },
                        cancelToken
                      }) => {
  return axios({
    method: 'post',
    url:    `${API_ENDPOINT}/${QUERY}`,
    data,
    headers,
    cancelToken
  });
};

export default axios;
