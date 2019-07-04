import axios from 'axios'
import {
  getToken
} from '@/utils/auth'
import store from '@/store'

const baseURL = process.env.VUE_APP_BASE_API

export const ax = axios.create({
  baseURL,
  responseType: 'json',
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  timeout: 5000
})

ax.interceptors.request.use(
  (config) => {
    if (getToken()) {
      // 让每个请求都带上token
      // Authorization 以及 'Bearer token' 是自定义格式
      // 根据实际情况来更改它们
      config.headers.Authorization = `Bearer ${getToken()}` // 将token设置成请求头
    }
    return config
  },
  err => Promise.reject(err),
)

ax.interceptors.response.use(response => response, error => Promise.reject(error))

/**
 * 请求接口传参处理
 * @param params 请求接口的传参
 */
export function handleData(params) {
  const data = Object.create(null)
  // 过滤掉空传参 (undefined || '' || null)
  Object.keys(params).forEach((k) => {
    if (params[k] !== undefined || params[k] !== null || String(params[k]) !== '') {
      data[k] = params[k]
    }
  })
  return data
}

/**
 * 请求接口错误处理
 * @param error
 */
export function handleError(error) {
  // 错误码根据实际情况定义 401未授权（token过期或失效）
  if (error.response.status === 401) {
    store.dispatch('user/resetToken').then(() => {
      window.location.href = '#/login'
    })
  } else {
    // Something happened in setting up the request that triggered an Error
  }
}

/**
 * GET请求
 *
 * @export
 * @param {*} url
 * @param {*} [params = {}, config = {}] params为参数，config为自定义headers等axios配置
 * @returns
 */
export function apiGet(
  url,
  { params = {}, config = {}} = {}
) {
  return ax
    .get(url, {
      params: handleData({
        ...params
      })
    }, config)
    .then(res => res)
    .catch((err) => {
      handleError(err)
      throw err
    })
}

/**
 * POST请求
 *
 * @export
 * @param {*} url
 * @param {*} [params = {}, config = {}] params为参数，config为自定义headers等axios配置
 * @returns
 */
export function apiPost(
  url,
  { params = {}, config = {}} = {}
) {
  const param = handleData(params)
  return ax
    .post(url, param, config)
    .then(res => res)
    .catch((err) => {
      handleError(err)
      throw err
    })
}

/**
 * PUT请求
 *
 * @export
 * @param {*} url
 * @param {*} [params = {}, config = {}] params为参数，config为自定义headers等axios配置
 * @returns
 */
export function apiPut(
  url,
  { params = {}, config = {}} = {}
) {
  const param = handleData(params)
  return ax
    .put(url, param, config)
    .then(res => res)
    .catch((err) => {
      handleError(err)
      throw err
    })
}

/**
 * DELETE 请求
 *
 * @export
 * @param {*} url
 * @param {*} [params={}]
 * @param {*} [params = {}, config = {}] params为参数，config为自定义headers等axios配置
 * @returns
 */
export function apiDelete(
  url,
  { params = {}, config = {}} = {}
) {
  const param = handleData(params)
  return ax
    .delete(url, param, config)
    .then(res => res)
    .catch((err) => {
      handleError(err)
      throw err
    })
}
