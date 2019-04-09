import mt from 'moment'
import {baseUrl} from './config'

mt.locale('zh-cn')
export const moment = mt

export const request = (url, data = {}, fn, method = 'get') => new Promise((resolve, reject) => {
  if (typeof fn === 'function') fn(true)
  mpvue.request({
    url,
    data,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method,
    success(res) {
      if (typeof fn === 'function') fn(false)
      resolve(res.data)
    },
    fail(err) {
      if (typeof fn === 'function') fn(false)
      modal.toast(err.message)
      reject(err)
    }
  })
})

export const post = (url, data = {}, fn) => {
  return request(`${baseUrl}/transmit/${encodeURIComponent(url)}`, data, fn, 'post')
}

export const post2 = (url, data = {}, fn) => {
  return request(url, data, fn, 'post')
}

export const get = (url, data = {}, fn) => {
  return request(`${baseUrl}/transmit/${encodeURIComponent(url)}`, data, fn, 'get')
}

export const get2 = (url, data = {}, fn) => {
  return request(url, data, fn, 'get')
}

export const modal = {
  toast(title) {
    mpvue.showToast({
      title,
      icon: 'none',
      duration: 1500
    })
  },
  loading: {
    show() {
      mpvue.showLoading({
        title: 'loading',
        mask: true
      })
    },
    hide() {
      mpvue.hideLoading()
    }
  },
  confirm(content) {
    return new Promise((resolve, reject) => {
      mpvue.showModal({
        title: '提示',
        content,
        showCancel: true,
        success(res) {
          if (res.confirm) {
            resolve()
          } else if (res.cancel) {
            reject(new Error('取消'))
          }
        }
      })
    })
  },
  alert(content) {
    return new Promise((resolve, reject) => {
      mpvue.showModal({
        title: '提示',
        content,
        showCancel: false,
        success() {
          resolve()
        }
      })
    })
  }
}

export const systemInfo = mpvue.getSystemInfoSync()

export function debounce(func, delay = 300) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func(...args)
    }, delay)
  }
}
