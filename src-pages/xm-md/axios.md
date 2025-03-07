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

::: tip axios 的特性

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
  url: "/user/12345",
  method: "post",
  data: {
    firstName: "Fred",
    lastName: "Flintstone"
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

url 中已经有参数 a=1 了，但是 params 中还传了参数，所以需要进行参数的序列化，比如将 b 要序列化拼接到 url 中，变成?a=1&b=2

```js
// 发送 POST 请求
axios({
  url: "/user#?a=1", // a参数是需要保留的，还要将hash符号去除
  method: "get",
  params: {
    b: 2, // 序列化参数
    foo: ["a", "b"], // 序列化数组
    obj: {
      c: 5 // 序列化对象
    },
    date: new Date(),
    name: null // 有传入null，需要将null去除掉
  }
});
```

## 四、代码片段

```js
  ├── node_moduls
  ├── src
      └── core
      │     └── index.ts
      └── types
      │    └── index.ts
      └── helpers
      │    └── url.ts
      │    └── utils.ts
      │    └── data.ts
      │    └── headers.ts
  ├── index.ts
  ├── xhr.ts
  ├── index.html
  ├── main.ts
  ├── package-lock.json
  ├── package.json
  ├── tsconfig.json
```

### 1.在 index.ts 中

```js
import type { AxiosRequestConfig } from "./types";
import type { buildURL } from "./helpers/url";
import xhr from "./xhr";
import { transformRequest } from "./helpers/data";
import { processHeaders } from "./helpers/headers";

function axios(config: AxiosRequestConfig) {
  processConfig(config);
  return xhr(config);
}

function processConfig(config: AxiosRequestConfig) {
  config.url = transformURL(config);
  // 处理请求头 这个必须放在data处理之前，因为transformRequest会处理data为字符串，如果先处理data，那么headers中的isObejct就会变成false
  config.headers = processHeaders(config);
  // 处理post请求数据，转为字符串
  config.data = transformRequest(config.data);
}

function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config;
  return buildURL(url, params);
}

export default axios;
```

### 2.xhr.ts 文件

```js
import type { AxiosRequestConfig } from "./types";

export default function xhr(config: AxiosRequestConfig) {
  const {
    url,
    method = "GET",
    data = null,
    headers,
    responseType,
    timeout
  } = config;

  const xhr = new XMLHttpRequest();

  // method.toUpperCase() 将方法转换为大写
  xhr.open(method.toUpperCase(), url, true);

  // 设置请求头
  if (headers) {
    Object.keys(headers).forEach((name) => {
      xhr.setRequestHeader(name, headers[name]);
    });
  }

  xhr.send(data);
}
```

### 3.在 types 文件夹 的中 index.ts

```js
export type Method =
  | "get"
  | "GET"
  | "delete"
  | "DELETE"
  | "head"
  | "HEAD"
  | "options"
  | "OPTIONS"
  | "post"
  | "POST"
  | "put"
  | "PUT"
  | "patch"
  | "PATCH";

export interface AxiosRequestConfig {
  url: string; // 请求的url
  method?: Method; // 请求的方法
  data?: any; // post请求的数据
  params?: any; // get请求的参数
  headers?: any; // 请求头
  timeout?: number; // 超时时间
  withCredentials?: boolean; // 是否携带cookie
}
```

### 4.helpers 文件夹的 data.ts 中

```js
import { isObject } from "./utils";
export function transformRequest(data: any) {
  if (isObject(data)) {
    return JSON.stringify(data);
  }
  return data;
}
```

### 5.helpers 文件夹的 headers.ts 中

```js
import { isObject } from "./utils";
export function processHeaders(config: AxiosRequestConfig) {
  const { headers = {}, data } = config;
  if (isObject(data)) {
    if (headers && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json;charset=utf-8";
    }
  }
  return headers;
}
```

### 6.helpers 文件夹的 url.ts 中

```js
import { isDate, isObject } from "./utils";

function encodeFn(val: string) {
  return encodeURIComponent(val)
    .replace(/%40/g, "@")
    .replace(/%3A/g, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/g, ",")
    .replace(/%20/g, "+")
    .replace(/%5B/g, "[")
    .replace(/%5D/g, "]");
}

export function buildURL(url: string, params?: any) {
  // 如果参数为空，直接返回url
  if (!params) {
    return url;
  }

  const parts: string[] = []; // 存放结果
  Object.keys(params).forEach((key) => {
    const val = params[key];
    if (val === null || typeof val === "undefined") return; // 去除空值

    // 处理值是数组
    let values = [];
    if (Array.isArray(val)) {
      values = val;
      key += "[]";
      // 这里为什么需要+='[]'，因为在get请求的时候，传递数组的话，
      /**
       * 要解析成这样子
       * 'foo[] = a'
       * '&foo[] = b'
       */
    } else {
      values = [val];
    }
    values.forEach((val) => {
      if (isDate(val)) {
        val = val.toISOString(); // 将日期转换为UTC格式，世界统一时间 2025-03-06T07:50:00.000Z
      } else if (isObject(val)) {
        val = JSON.stringify(val); // 将对象转换为JSON字符串
      }
      // encode函数用于对URL参数进行编码，防止特殊字符导致的问题
      // 例如空格会被编码为%20，中文会被编码为%E4%B8%AD%E6%96%87
      // key和value都需要编码，最后拼接成 key=value 的形式

      // encodeURIComponent 用于对 URL 中的参数进行编码
      // 它会将一些特殊字符(如空格、中文等)转换为 %XX 的形式
      // 例如:
      // 空格 -> %20
      // 中文 -> %E4%B8%AD%E6%96%87

      // encodeURI 用于编码完整的 URI,它不会编码 URL 中的特殊字符,比如 :/?=&
      // 而 encodeURIComponent 会编码所有特殊字符
      // 这里 key 作为参数名使用 encodeURI 更合适,因为参数名通常不包含特殊字符
      // value 作为参数值使用 encodeURIComponent 更安全,因为参数值可能包含任何字符
      parts.push(`${encodeFn(key)}=${encodeFn(val)}`);
    });
  });

  let serializedParams = parts.join("&");
  // 如果序列化参数不为空，则进行处理
  if (serializedParams) {
    // 如果url中存在hash，则将hash去除
    const markIndex = url.indexOf("#");
    if (markIndex !== -1) {
      url = url.slice(0, markIndex);
    }
    // 如果url中不存在问号，说明没有参数。则直接拼接，否则就是已经有参数了，就在问号后面拼接
    url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }
  return url;
}
```

### 7.helpers 文件夹的 utils.ts 中

```js
const toSting = Object.prototype.toString; // 优化，做一个缓存，不要频繁调用，这里只读一次

export const isDate = (val: any): val is Date => {
  // val is Date 是一个类型守卫，有类型守卫那么在调用的时候就有提示，如果返回值为true，那么val就是Date类型，如果返回值为false，那么val就是其他类型
  // 判断是不是日期
  return toSting.call(val) === "[object Date]";
};

export const isObject = (val: any): val is Object => {
  // 判断是不是对象
  // return val !== null && typeof val === "object";

  // 判断是不是纯对象
  return toSting.call(val) === "[object Object]";
};
```
