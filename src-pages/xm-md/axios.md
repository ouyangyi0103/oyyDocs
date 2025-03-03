---
outline: deep
head:
  - - meta
    - name: title
      content: 自我学习
  - - meta
    - name: description
      content: 自我学习，努力上进
---

# Axios
  Axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中。

## 一、特性
  ::: tip axios的特性
  1. 从浏览器中创建 XMLHttpRequests
  2. 从 node.js 创建 http 请求
  3. 支持 Promise API
  4. 拦截请求和响应
  5. 转换请求数据和响应数据
  6. 取消请求
  7. 自动转换 JSON 数据
  8. 客户端支持防御 XSRF
  :::

## 二、API
  可以通过向 axios 传递相关配置来创建请求

  ```js
    // 发送 POST 请求
    axios({
      url: '/user/12345',
      method: 'post',
      data: {
        firstName: 'Fred',
        lastName: 'Flintstone'
      }
    });
  ```

  ### 1. 请求方法别名
  #### 【1】 axios.request(config)
  #### 【2】 axios.get(url[, config])
  #### 【3】 axios.delete(url[, config])
  #### 【4】 axios.head(url[, config])
  #### 【5】 axios.options(url[, config])
  #### 【6】 axios.post(url[, data[, config]])
  #### 【7】 axios.put(url[, data[, config]])
  #### 【8】 axios.patch(url[, data[, config]])


## 三、参数处理
  url中已经有参数a=1了，但是params中还传了参数，所以需要进行参数的序列化，比如将b要序列化拼接到url中，变成?a=1&b=2
  ```js
    // 发送 POST 请求
    axios({
      url: '/user#?a=1', // a参数是需要保留的，还要将hash符号去除
      method: 'get',
      params: {
        b: 2, // 序列化参数
        foo: ['3','4'], // 序列化数组
        obj: {
          c: 5 // 序列化对象
        },
        name: null // 有传入null，需要将null去除掉
      }
    });
  ```
  ## 四、代码片段
  ```js
  // url.ts中
  export function buildURL(url: string, params: any){

  }
  ```

  ```js
  ```

  ```js
  ```

  ```js
  // 在index.ts中
  import type { AxiosRequestConfig } from './types'
  import type { buildURL } from './helpers/url'

  function axios(config: AxiosRequestConfig){
    processConfig(config);
  }

  function processConfig(config: AxiosRequestConfig){
    config.url = transformURL(config);
  }

  function transformURL(config: AxiosRequestConfig): string{
    const { url, params } = config;
    return buildURL(url, params);
  }

  export default axios;
  ```


