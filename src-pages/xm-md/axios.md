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
      │     └── interceptorManager.ts
      │     └── dispatchRequest.ts
      │     └── Axios.ts
      │     └── xhr.ts
      └── types
      │    └── index.ts
      └── helpers
      │    └── url.ts
      │    └── utils.ts
      │    └── data.ts
      │    └── headers.ts
      ├── axios.ts
      ├── index.ts
  ├── index.html
  ├── main.ts
  ├── package-lock.json
  ├── package.json
  ├── tsconfig.json
```

### 1. 在 main.ts 中

```js
import axios, { AxiosRequestConfig } from "./src/index";

const btnGet = document.getElementById("btnGet");
const btnPost = document.getElementById("btnPost");

btnGet.addEventListener("click", () => {
  axios({
    url: "/user/12345",
    method: "get",
    params: {
      a: 1,
      b: 2
    }
  });
});

btnPost.addEventListener("click", () => {
  axios({
    url: "/user/12345",
    method: "post",
    // responseType: "json", // 这个一般是不写的，所以要处理下默认值
    data: {
      a: 1,
      b: 2
    }
  });
});
```

### 2.helpers 文件夹的 utils.ts 中

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

export const extend = <T,U>(to:T,from:U): T & U => {
  const keys = Object.getOwnPropertyNames(from);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if(key != 'constructor'){
      // @ts-ignore
      to[key] = from[key]
    }
  }
  return to as T & U;
}
```

### 3.在 src 的 axios.ts 中

```js
import Axios from "./core/Axios";
import type {AxiosInstance} from './types';
import {extend} from './helpers/utils';

function createInstance(): AxiosInstance {
  const context = new Axios();
  const instance = Axios.prototype.request.bind(context);
  extend(instance, Axios.prototype);
  extend(instance, context);
  return instance as AxiosInstance;
}

const axios = createInstance();

export default axios;
```

### 4.在 src 的 index.ts 中

```js
import axios from "./axios";

/**
 * 为什么不直接引入axios这个文件，主要是要在这里导出类型，可以在matin.ts中使用类型
 */
export * from "./types";

export default axios;
```

### 5.在 types 文件夹 的中 index.ts

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
  responseType?: XMLHttpRequestResponseType; // 响应类型
}

export interface AxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: AxiosRequestConfig;
  request: XMLHttpRequest;
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

export interface Axios {
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>,
    response: AxiosInterceptorManager<AxiosResponse>
  }
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>;
  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
  head<T = any>(url: string, config?: AxiosRequestConfig): <T>;
  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>;
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>;
}

export interface AxiosInterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number
  eject(id: number): viod
}

export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise;
}

export interface ResovedFn<T = any> {
  (val: T): T | Promise<T>
}

export interface RejectedFn<T = any> {
  (error: any): any
}
```

### 6. 在 core 文件夹中的 interceptorManager.ts

```js
import type { ResovedFn, RejectedFn } from "../types";

interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}

export default class InterceptorManager<T> {
  private interceptors: Array<Interceptor<T> | null>
  constructor() {
    this.interceptors = [];
  }

  // axios.interceptors.request.use((config) => {
  //   config.headers.xxx = 'xxxxxx'
  //   return config;
  // },(err)=>{
  //   return Promise.reject(err)
  // })

  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number{
    this.interceptors.push({
      resolved,
      rejected
    })

    // [
    //   {
    //     resolved: (config) => {......},
    //     rejected: (err) => {......}
    //   },
    //   {
    //     resolved: (config) => {......},
    //     rejected: (err) => {......}
    //   }
    // ]

    return this.interceptors.length - 1;
  }

  // 这里为什么不直接将后面的数据删除，而是设置为null，因为这样是不会影响数组的长度的
  eject(id: number): void {
    // [
    //   {
    //     resolved: (config) => {......},
    //     rejected: (err) => {......}
    //   },
    // null
    // ]
    if(this.interceptors[id]){
      this.interceptors[id] = null
    }
  }

  forEach(fn: (interceptor: Interceptors<T>) => void): void {
    this.intercepotors.forEach(interceptor => {
      if(interceptor !== null){
        fn(interceptor);
      }
    })
  }
}
```

### 7. 在 core 文件夹中的 Axios.ts

```js
import { AxiosRequestConfig, AxiosPromise, Method, AxiosResponse, ResolvedFn, RejectedFn} from "../types";
import dispatchRequest from "./dispatchRequest";
import InterceptorManager from './interceptorManager'

interface Interceptors {
  requset: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

interface PromiseChain<T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn
}

export default class Axios {
  public interceptors: Interceptors

  constructor(){
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
  }

  // 中间件
  public request(config: AxiosRequestConfig): AxiosPromise {
    //chain = [Promise.resolve, Promise.resolve, 请求, response, response, result]
    const chain: PromiseChain<any>[] = [{
      resolved: dispatchRequest,
      rejected: undefined
    }]

    // requset后添加的先执行
    this.interceptor.requset.forEach(interceptor => {
      chain.unshift(interceptor)
    })

    // response先添加的先执行
    this.interceptor.response.forEach(interceptor => {
      chain.push(interceptor)
    })

    let promise = Promise.resolve(config);
    //chain =  [Promise.resolve, Promise.resolve, 请求, response, response, result]
    while(chain.length){
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }

    return promise as unknown as AxiosPromise;
  }

  public get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithOutData("get", url, config);
  }

  public delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithOutData("delete", url, config);
  }

  public head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithOutData("head", url, config);
  }

  public options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithOutData("options", url, config);
  }

  public post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData("post", url, data, config);
  }

  public put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData("post", url, data, config);
  }

  public patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData("post", url, data, config);
  }

  private _requestMethodWithOutData(
    method: Method,
    url: string,
    config: AxiosRequestConfig
  ): AxiosPromise {
    return this.request({ ...config, method, url });
  }

  private _requestMethodWithData(
    method: Method,
    url: string,
    data?: any,
    config: AxiosRequestConfig
  ): AxiosPromise {
    return this.request({ ...config, method, url, data });
  }
}
```

### 8. 在 core 文件夹中的 dispatchRequest.ts

```js
import type { AxiosRequestConfig } from "../types";
import type { buildURL } from "../helpers/url";
import xhr from "./xhr";
import { transformRequest, transformResponse } from "../helpers/data";
import { processHeaders } from "../helpers/headers";

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config);
  return xhr(config).then((res) => {
    return transformResponseData(res);
  });
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

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transformResponse(res.data);
  return res;
}

export default axios;
```

### 9.在 core 文件夹中 的 xhr.ts 文件

```js
import type { AxiosRequestConfig } from "../types";
import { parseHeaders } from "../helpers/headers";

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      url,
      method = "GET",
      data = null,
      headers,
      timeout,
      withCredentials,
      responseType
    } = config;

    const xhr = new XMLHttpRequest();

    // method.toUpperCase() 将方法转换为大写
    xhr.open(method.toUpperCase(), url, true);

    // 传递了响应类型，设置响应类型
    if (responseType) {
      xhr.responseType = responseType;
    }

    // 传递了超时时间，设置超时时间
    if (timeout) {
      xhr.timeout = timeout;
    }

    // 传递了cookie，设置cookie
    if (withCredentials) {
      xhr.withCredentials = withCredentials;
    }

    // 设置请求头
    if (headers) {
      Object.keys(headers).forEach((name) => {
        xhr.setRequestHeader(name, headers[name]);
      });
    }

    xhr.onerror = () => {
      reject(new Error("Network Error"));
    };

    xhr.ontimeout = () => {
      reject(new Error(`Timeout of ${timeout} ms exceeded`));
    };

    // 监听请求状态
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) {
        return;
      }

      // 超时和报错 状态也是0
      if (xhr.status === 0) {
        return;
      }

      // 获取响应头
      const responseHeaders = parseHeaders(xhr.getAllResponseHeaders());

      // 获取响应数据
      const responseData =
        responseType === "text" ? xhr.responseText : xhr.response;

      const response: AxiosResponse = {
        data: responseData,
        status: xhr.status,
        statusText: xhr.statusText,
        headers: responseHeaders,
        config,
        request: xhr
      };

      handlerResponse(response);
    };

    // 发送请求
    xhr.send(data);

    const handlerResponse = (response: AxiosResponse) => {
      if (response.status >= 200 && response.status < 304) {
        resolve(response);
      } else {
        reject(new Error(`Request failed with status code ${response.status}`));
      }
    };
  });
}
```

### 10.helpers 文件夹的 data.ts 中

```js
import { isObject } from "./utils";

export function transformRequest(data: any) {
  if (isObject(data)) {
    return JSON.stringify(data);
  }
  return data;
}

export function transformResponse(data: any) {
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (error) {
      // do nothing
    }
  }
  return data;
```

### 11.helpers 文件夹的 headers.ts 中

```js
import { isObject } from "./utils";

function normalizeHeaderName(headers: any, normalizeName: string) {
  if (!headers) {
    return;
  }
  Object.keys(headers).forEach((name) => {
    if (
      name !== normalizeName &&
      name.toUpperCase() === normalizeName.toUpperCase()
    ) {
      headers[normalizeName] = headers[name];
      delete headers[name];
    }
  });
}

export function processHeaders(config: AxiosRequestConfig) {
  const { headers = {}, data } = config;
  // 处理Content-Type 比如传入的对象是{content-type: 'application/json'}，需要转换为{Content-Type: 'application/json'}
  normalizeHeaderName(headers, "Content-Type");
  if (isObject(data)) {
    if (headers && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json;charset=utf-8";
    }
  }
  return headers;
}

export function parseHeaders(headers: string): any {
  let parsed = Object.create(null);
  if (!headers) {
    return parsed;
  }
  // 将响应头转换为对象
  // headers: "content-length: 8\r\ncontent-type: application/json;charset=utf-8\r\n"
  headers.split("\r\n").forEach((line) => {
    let [key, val] = line.split(": ");
    key = key.trim().toLowerCase();
    if (!key) {
      return;
    }
    if (val) {
      val = val.trim();
    }
    parsed[key] = val;
  });
  return parsed;
}
```

### 12.helpers 文件夹的 url.ts 中

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
