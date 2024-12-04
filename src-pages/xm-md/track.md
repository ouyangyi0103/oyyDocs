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

# 埋点与监控

:::tip 两个指标
pageView(pv)：用户每次对网站访问的记录，也就是页面访问量

userView(uv)：指的是独立用户的访问量，一个 ip 算一次

作用：

 1.行为数据：收集用户的页面的浏览量 

 2.用户性能评估：收集页面的加载时间，API 调用延迟的时间，错误的日志 
 
 3.设备和环境：收集用户操作设备，操作系统，浏览器版本 
 
 4.属性数据： 用户的 ID，地理位置，用户的角色
总的来讲，就是收集用户的隐私信息
:::

::: tip
npm run dev 底层原理:

  在运行 nom run dev(vite 构建)的时候，会去 node_moduls 的.bin 文件夹下面去找 vite 命令文件(sh 文件是给 mac 运行的，cmd 文件和 ps1 是给 windows 运行的)

npx vite 底层原理:

  会先在本地的.bin 里面去寻找，没有 vite 会去进行安装，再启动，用完之后就删掉了。
  如果发现本地没有，就会去全局的 node_moduls 去找，全局的还找不到，就会去环境变量里面找，还找不到就去对应的 git 仓库下载安装，运行完再删掉
:::

## 一、引入主入口

```html
<body>
  <h1>埋点</h1>
  <script type="module" src="./main.ts"></script>
  /* 增加自定义属性 */
  <button data-tracker="埋点">点击统计</button>
  <button>点击不统计</button>
</body>

如果要使用原生esm，需要在这里加一个type="module"，并且要配合src使用
type="module"的作用： 1.让vite能够进行拦截 2.可以使用import语法
在script里面加type="module"是给浏览器用的，在package.json里面加type="module"是给node用的
```

## 二、项目主入口实例化 Tracker

```js
// main.ts
import { Tracker } from "./lib";

new Tracker();
```

## 三、Tracker 类

```ts
// lib/index.ts
import { getUserInfo } from "./user/index";
import button from "./lib/button";
import error from "./lib/error/window";
import promiseError from "./lib/error/promise";
import request from "./lib/request/ajax";
import pv from "./lib/pv/page";
import onepage from "./lib/onepage/index";

export class Tracker {
  constrctor() {
    events: Record<string, Function>;
    this.events = { button, error, promiseError, request, pv, onepage };
    this.init();
  }

  public sendRequst(params) {
    const userInfo = getUserInfo();
    const body = Object.assign({}, params, userInfo);
    // 这里都不能使用axios,ajsx,fetch,为什么不能使用呢？
    let blob = new Blob([JSON.stringify(body)], { type: "application/json" });
    navigator.sendBeacon("https://www.baidu.com", blob);
  }

  private init() {
    Object.keys(this.events).forEach((key) => {
      this.events[key](this.sendRequst);
    });
  }
}
```

:::tip navigator.sendBeacon()
在进行埋点的时候不能使用 axios,ajsx,fetch 去发送请求，因为有可能在点击的时候，接口正在发送，但是页面被关闭了，那么请求就会终止

但是 navigator.sendBeacon 发送请求，在页面关闭的时候，接口还是在继续发送

注意点：

1. 默认发送的是 post 请求，并且是一个 ping 请求，速度快，不能发送很长的数据，返回的数据要很小
2. 不能传送 json，可以使用 blob 去传递 json，设置 type 为 application/json
3. 使用 json 会跨域
4. 会默认携带 cookies
   :::

## 四、获取用户信息函数

```js
// lib/user/index.ts
export const getUserInfo = (user = {}) => {
  return {
    userId: 1,
    name: "oyy",
    date: new Date().getTime(),
    userAgent: navigator.userAgent
  };
};
```

## 五、埋点上报

```ts
// lib/button/index.ts
export default function button(send) {
  document.addEventListener("click", (event) => {
    const target = event.target as HTMLELement;
    // 读取自定义属性
    const token = target.getAttribute("data-tracker");
    // 获取点击按钮的位置
    let position = target.getBoundingClientRect();
    if (token) {
      // 上报按钮点击
      send({
        type: "event",
        text: token,
        data: {
          x: position.x,
          y: position.y,
          width: position.width,
          height: position.height
        }
      });
    }
  });
}
```

## 六、window 错误上报

```ts
// lib/error/window.ts
export default function error(send) {
  window.addEventListener("error", (event) => {
    send({
      type: event.error,
      text: event.message,
      data: {
        lineno: event.lineno,
        filname: event.filname
      }
    });
  });
}
```

## 七、promise 错误上报

unhandledrejection 可以捕获全局的 promise 错误

```ts
// lib/error/promise.ts
export default function promiseError(send) {
  window.addEventListener("unhandledrejection", (event) => {
    send({
      type: event.type,
      text: event.reason,
      data: {
        reason: event.reason,
        path: location.href
      }
    });
  });
}
```

## 八、请求错误上报

```ts
// lib/request/ajax.ts
export default function request(send) {
  // axios有请求拦截和响应拦截，ajax没有请求拦截与响应拦截，该如何处理
  // 拦截原生api就是去 重写它的方法
  const OriginOpen = XMLHttpRequest.prototype.open;
  const OriginSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method, url, async = true) {
    send({
      type: "ajax",
      text: "request",
      data: {
        method,
        url
      }
    });
    OriginOpen.call(this, method, url, async);
  };

  XMLHttpRequest.prototype.send = function (body) {
    send({
      type: "ajax",
      text: "request",
      data: {
        body
      }
    });
    OriginSend.call(this, body);
  };

  //发送fetch请求
  const OriginFetch = window.fetch;
  window.fetch = function (...args) {
    send({
      type: "fetch",
      text: "request",
      data: {
        args
      }
    });
    return OriginFetch.call(this, ...args);
  };
}
```

## 九、路由监听

```js
export default function pv(send) {
  // hash监听
  window.addEventListener("hashchange", (e) => {
    send({
      type: "pv-hash",
      text: location.href,
      data: {
        path: location.href,
        newURL: e.newURL,
        newURL: e.oldURL
      }
    });
  });

  // history监听
  window.addEventListener("popstate", (e) => {
    send({
      type: "pv-history",
      text: e.type,
      data: {
        state: e.state,
        url: location.href
      }
    });
  });

  // 重写pushState
  const pushState = history.pushState;
  window.history.pushState = function (state, title, url) {
    const res = pushState.call(this, state, title, url);

    // 定义自定义事件，万一在别处也需要进行监听
    const e = new Event("pushState"); // 发布订阅
    window.dispatchEvent(e);

    return res;
  };
  window.addEventListener("pushState", (e) => {
    send({
      type: "pv-pushState",
      text: e.type,
      data: {
        url: location.href
      }
    });
  });
}
```

## 十、首屏加载

```js
export default function onepage(send) {
  let firstScreenTime = 0;
  const ob = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      firstScreenTime = performance.now();
    });
    if (firstScreenTime > 0) {
      send({
        type: "onepage",
        text: "首屏加载时间",
        data: {
          firstScreenTime
        }
      });
      // 断开监听
      ob.disconnect();
    }
  });

  // 是vue项目，将document节点换成app节点
  // childList为true 是子节点发生变化了(增删改查)，就会监听到
  // subtree为true 是监听整个子节点，包括子节点的后代
  ob.observer(document, { childList: true, subtree: true });
}
```

:::tip MutationObserver
MutationObserver 接口提供了监视对 DOM 树所做更改的能力.

方法

1. disconnect()
   阻止 MutationObserver 实例继续接收的通知，直到再次调用其 observe() 方法，该观察者对象包含的回调函数都不会再被调用。
2. observe()
   配置 MutationObserver 在 DOM 更改匹配给定选项时，通过其回调函数开始接收通知。
3. takeRecords()
   从 MutationObserver 的通知队列中删除所有待处理的通知，并将它们返回到 MutationRecord 对象的新 Array 中。

:::

## 七、邮件发送

```ts
npm i nodemailer

// server/index.ts
import express from "express";
// import Redis from "ioredis";
import nodemailer from "nodemailer";

// const redis = new Redis({
//   host: "127.0.0.1",
//   port: 6379
// });

// 将报错信息发送邮件告知前端
const transporter = nodemailer.createTransport({
  service: "qq",
  port: 465,
  // 发送的协议
  host: "smtp.qq.com",
  auth: {
    user: "178819633@qq.com",
    pass: "ytocbsxxbxbtbhaj"
  }
});

const app = express();

// 在请求是会进行跨域
app.use("*", (req, res, next) => {
  // 面试题
  // 后端丢失了session的原因是什么？
  // 原因是设置了 * 号

  // 在解决时，不能设置星号，因为 * 是不允许上传cookie的
  /*
    Access to resource at 'http://localhost:3000/tracker' from origin 'http://localhost:5173'
    has been blocked by CORS policy: Response to preflight request doesn't pass access control
    check: The value of the 'Access-Control-Allow-Origin' header in the response
    must not be the wildcard '*' when the request's credentials mode is 'include'.
  */
  // res.setHeader("Access-Control-Allow-Origin", "*");

  /* 这个报错是说明不允许上传cookie
    Access to resource at 'http://localhost:3000/tracker' from origin 'http://localhost:5173'
    has been blocked by CORS policy: Response to preflight request doesn't pass access control
    check: The value of the 'Access-Control-Allow-Credentials' header in the response is ''
    which must be 'true' when the request's credentials mode is 'include'.
   */
  // 指定ip是可以允许上报cookie的，前段的cookie就是后端的session
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");

  // 所以要设置一下，支持cookie的上传，因为cookie在请求时，会自动携带上传到后端
  // 在谷歌浏览器95版本之后，不允许cookie跨域
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // 还是进行报错
  /*
    Access to resource at 'http://localhost:3000/tracker' from origin 'http://localhost:5173'
    has been blocked by CORS policy: Request header field content-type is not allowed by
    Access-Control-Allow-Headers in preflight response.
  */
  // 因为cors只能允许我们发送普通的请求
  // 普通的请求：1.URLSearchParams ?a=2&b=3 2.text/plain 3.formData 只允许这三种形式
  // 而我们发送的是一个json对象，所以不支持
  // Content-Type: application/json 它是不存在的，是一个自定义的type
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  next();
});

// express 是不支持post请求的，需要使用中间件
// use中间件支持一下post
app.use(express.json());

// req request接收前端传过来的信息
// res responese给前端返回信息
app.post("/tracker", (req, res) => {
  // get请求 是query
  // post请求 是body
  // 动态参数 是params
  console.log(req.body);
  if (req.body.type === "error" || req.body.type === "unhandledrejection") {
    transporter.sendMail({
      from: "178819633@qq.com",
      to: "178819633@qq.com",
      subject: "前端error",
      text: JSON.stringify(req.body)
    });
  }

  // redis.lpush("tracker", JSON.stringify(req.body));
  // 埋点，后端一定返回较少的数据给前端
  res.send("ok");
});

const port = 3000;

app.listen(port, () => {
  console.log("port 3000 is runing......");
});
```

## 八、跨域

请求分为 普通请求 和 复杂请求
:::tip 普通请求
默认支持的请求头部

1. Content-Type: application/x-www-form-urlencoded
2. Content-Type: multipart/form-data
3. Content-Type: text/plain

默认支持的请求类型

1. get
2. post
3. head
4. options

默认支持请求头的字段

1. Accept
2. Accept-Language
3. Content-Language
4. Content-Type
5. Origin
6. Referer
7. User-Agent
   :::

:::tip 复杂请求
Content-type: application/json
:::

:::tip 跨域解决
浏览器报错
Responese to preflight request dosen't pass access control check:No'Access-Control-Allow-Origin'head is present on the requested resource;

后台设置
// 设置 \* 或者指定 IP
res.setHeader('Access-Control-Allow-Origin','http//localhost:8080')

设置完之后，又报错
// 后台没有设置允许上传 cookie
The value of the 'Access-Control-Allow-Credentials' head in the response is '' which must be 'true' when the request's credentials mode is 'include';

后台设置
// 设置 \* 或者指定 IP
res.setHeader('Access-Control-Allow-Origin','http//localhost:8080')
// 允许携带 cookie
res.setHeader('Access-Control-Allow-Credentials','true')

又报错
// application/json 不包含在普通请求的 Content-Type 中
Request header field content-type is not allowed by Access-Control-Allow-Headers in preflight response;

后台设置
// 设置 \* 或者指定 IP
res.setHeader('Access-Control-Allow-Origin','http//localhost:8080')
// 允许携带 cookie
res.setHeader('Access-Control-Allow-Credentials','true')
// 允许 application/json
res.setHeader('Access-Control-Allow-Headers','Content-Type')
:::

:::tip 发送两次请求(预检请求)
触发条件

1. 排除普通请求
2. 自定义请求头
3. 必须是 post 并且为 application/json，触发条件达到，就会发送预检请求(options 请求)，浏览器自己发送的
   :::

## 九、关于数据的存储

:::tip 存储
一般是存入 Redis，不存在 mysql，因为 Redis 是内存存储（速度快），而 mysql 是硬盘存储
但是内存存储可能会丢失，比如重启或者宕机了，所以需要做 redis 持久化(RDB,AOF 两种)
在 redis.conf 文件里将 appendonly 设置为 yes，就开启了 AOF 持久化（常用）
还有一种是 RDB，配置为 save 3600 5
:::
