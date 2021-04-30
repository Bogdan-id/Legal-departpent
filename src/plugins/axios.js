import axios from 'axios'
/* eslint-disable no-unused-vars */
import {Store} from 'vuex'
import {AxiosResponse, AxiosError, AxiosRequestConfig} from 'axios'
/* eslint-enable no-unused-vars */

/** 
 * Helper Functions */
/** @typedef {{config: {clientDate?: string}}} ExtendedAxiosResponse */
/** @param {AxiosResponse & ExtendedAxiosResponse} res */
function setClientDate (res) {
  const date = new Date().toString()
  res.config.clientDate = date
  return Promise.resolve(res)
}
/** @param {AxiosResponse} res @param {Store} store */
function cacheResponse (res, store) {
  if (res.data.code === "InvalidParameters") return Promise.resolve(res)
  const key = getRequestKey(res.config)
  store.commit('assignObject', {key: key, data: res})
  return Promise.resolve(res)
}
/** @param {AxiosRequestConfig} req @param {Store} store */
function saveKey (req, store) {
  store.commit('createKey', getRequestKey(req))
  return Promise.resolve(req)
}
/** @param {AxiosRequestConfig} req @param {Store} store */
function checkRequest (req, store) {
  const key = getRequestKey(req)
  if (store.state[key] && Object.keys(store.state[key]).length) {
    return Promise.reject(new axios.Cancel(key))
  } else return Promise.resolve(req)
}
/** @template T @param {T} reqErr @returns {Promise<T>} */
function handleRequestErr (reqErr) {
  // ...handle request error
  return Promise.reject(reqErr)
}
/** @template T @param {T} resErr @returns {Promise<T>} */
function handleResponseErr (resErr) {
  // ...handle response error
  return Promise.reject(resErr)
}
/** @param {AxiosRequestConfig} config */
function getRequestKey (config) {
  if (! config) throw new Error("'getRequestKey': Config parameter required")
  const data = config.data
  let configData = typeof data === "object" ? JSON.stringify(data) : data

  return `url:[${config.url}]-method:[${config.method}]-data:[${configData}]`
}

/** 
 * Functions to modify Axios requests/repsonse */
/** @param {AxiosRequestConfig} req @param {Store} store */
function handleRequest (req, store) {
  return checkRequest(req, store)
    .then(req => saveKey(req, store))
    .catch(err => handleRequestErr(err))
}
/** @param {AxiosResponse} res @param {Store} store */
function handleResponse (res, store) {
  return setClientDate(res)
    .then(res => cacheResponse(res, store))
    .catch(err => handleResponseErr(err))
}
/**
 * Main interceptor Function */
/** @param {Store} store */
function setInterceptor (store) {
  axios.interceptors.request.use(
    // before request is sent
    req => handleRequest(req, store),
    // request err 
    err => Promise.reject(err)
  );

  axios.interceptors.response.use(
    // any status in range 200 trigger res
    /** @param {AxiosResponse} res */
    res => handleResponse(res, store),
    // any status outside range 200 trigger res error
    /** @param {AxiosError} err */
    err => Promise.reject(err)
  );
  return axios;
}

export default setInterceptor