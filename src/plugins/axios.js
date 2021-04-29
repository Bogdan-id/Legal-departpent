import axios from 'axios';
/* eslint-disable no-unused-vars */
import {AxiosResponse, AxiosError} from 'axios'
/* eslint-enable no-unused-vars */

/** 
 * @typedef {{config: {clientDate?: string}}} ExtendedAxiosResponse */

/** @param {AxiosResponse & ExtendedAxiosResponse} res */
function setClientDate(res) {
  const date = new Date().toString()
  res.config.clientDate = date
  return res
}

function setInterceptor() {
  axios.interceptors.request.use(
    // before request is sent
    req => req,
    // request err 
    err => Promise.reject(err)
  );

  axios.interceptors.response.use(
    // any status in range 200 trigger res
    /** @param {AxiosResponse} res */
    res => setClientDate(res),
    // any status outside range 200 trigger res error
    /** @param {AxiosError} err */
    err => Promise.reject(err)
  );
  return axios;
}

export default setInterceptor();