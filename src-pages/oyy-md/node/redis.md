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

## 一、redis

`Redis`（Remote Dictionary Server）是一个开源的`内存数据结构存储系统`，它提供了一个高效的键值存储解决方案，并支持多种数据结构，如字符串（Strings）、哈希（Hashes）、列表（Lists）、集合（Sets）和有序集合（Sorted Sets）等。它被广泛应用于`缓存`、`消息队列`、`实时统计`等场景。

以下是一些关键特性和用途介绍：

- **内存存储：**Redis 主要将数据存储在内存中，因此具有`快速的读写性能`。它可以`持久化数据到磁盘`，以便在重新启动后恢复数据。
- **多种数据结构：**Redis 不仅仅是一个简单的键值存储，它支持多种数据结构，如字符串、哈希、列表、集合和有序集合。这些数据结构使得 Redis 能够更灵活地存储和操作数据。
- **发布/订阅：**Redis 支持发布/订阅模式，允许多个客户端订阅一个或多个频道，以接收实时发布的消息。这使得 Redis 可以用作实时消息系统。
- **事务支持：**Redis 支持事务，可以将多个命令打包成一个原子操作执行，确保这些命令要么全部执行成功，要么全部失败。
- **持久化：**Redis 提供了两种持久化数据的方式：RDB（Redis Database）和 AOF（Append Only File）。RDB 是将数据以`快照形式保存到磁盘`，而 AOF 是将每个`写操作追加到文件中`。这些机制可以确保数据在意外宕机或重启后的持久性。
- **高可用性：**Redis 支持主从复制和 Sentinel 哨兵机制。通过主从复制，可以创建多个 Redis 实例的副本，以提高读取性能和容错能力。Sentinel 是一个用于监控和自动故障转移的系统，它可以在主节点宕机时自动将从节点提升为主节点。
- **缓存：**由于 Redis 具有快速的读写性能和灵活的数据结构，它被`广泛用作缓存层`。它可以将常用的数据存储在内存中，以加快数据访问速度，减轻后端数据库的负载。
- **实时统计：**Redis 的计数器和有序集合等数据结构使其非常适合实时统计场景。它可以存储和更新计数器，并对有序集合进行排名和范围查询，用于统计和排行榜功能

### 1. redis 安装

#### 1.1 安装包的形式

解压安装，然后配置环境变量，再添加到 windows 服务(cmd 管理员模式)

#### 1.2 wsl 安装

地址 https://juejin.cn/post/7338717224436449330

### 2. 可视化工具

打开 Vscode 扩展 搜索 `Database Client`

### 3. 基本操作

#### 3.1 字符串操作

```js
SET key value [NX|XX] [EX seconds] [PX milliseconds] [GET]

key：要设置的键名。
value：要设置的值。
NX：可选参数，表示只在键不存在时才设置值。
XX：可选参数，表示只在键已经存在时才设置值。
EX seconds：可选参数，将键的过期时间设置为指定的秒数。
PX milliseconds：可选参数，将键的过期时间设置为指定的毫秒数。
GET：可选参数，返回键的旧值。
```

### 4. ioredis

ioredis 是一个强大且流行的 Node.js 库，用于与 Redis 进行交互。Redis 是一个开源的内存数据结构存储系统。ioredis 提供了一个简单高效的 API，供 Node.js 应用程序与 Redis 服务器进行通信。

#### 4.1 安装

```js
npm i ioredis
```

#### 4.2 连接 redis

```js
import Ioredis from "ioredis";

const ioredis = new Ioredis({
  host: "127.0.0.1", //ip
  port: 6379 //端口
});
```

#### 4.3 字符串操作

```js
//存储字符串并且设置过期时间
ioredis.setex("key", 10, "value");
//普通存储
ioredis.set("key", "value");
//读取
ioredis.get("key");
```

#### 4.4 集合操作

```js
// 添加元素到集合
redis.sadd("myset", "element1", "element2", "element3");

// 从集合中移除元素
redis.srem("myset", "element2");

// 检查元素是否存在于集合中
redis.sismember("myset", "element1").then(result => {
  console.log("Is member:", result); // true
});

// 获取集合中的所有元素
redis.smembers("myset").then(members => {
  console.log("Members:", members);
});
```

#### 4.5 hash 操作

```js
// 设置哈希字段的值
redis.hset("myhash", "field1", "value1");
redis.hset("myhash", "field2", "value2");

// 获取哈希字段的值
redis.hget("myhash", "field1").then(value => {
  console.log("Value:", value); // "value1"
});

// 删除哈希字段
redis.hdel("myhash", "field2");

// 获取整个哈希对象
redis.hgetall("myhash").then(hash => {
  console.log("Hash:", hash); // { field1: 'value1' }
});
```

#### 4.6 队列操作

```js
// 在队列的头部添加元素
redis.lpush("myqueue", "element1");
redis.lpush("myqueue", "element2");

// 获取队列中所有元素
redis.lrange("myqueue", 0, -1).then(elements => {
  console.log("Queue elements:", elements);
});
//获取长度
redis.llen("myqueue").then(length => {
  console.log("Queue length:", length);
});
```

#### 4.7 发布订阅

```js
// 引入 ioredis 库
import Ioredis from "ioredis";

// 创建与 Redis 服务器的连接
const ioredis = new Ioredis({
  host: "127.0.0.1",
  port: 6379
});

// 创建另一个 Redis 连接实例
const redis2 = new Ioredis();

// 订阅频道 'channel'
ioredis.subscribe("channel");

// 监听消息事件
ioredis.on("message", (channel, message) => {
  console.log(`Received a message from channel ${channel}: ${message}`);
});

// 发布消息到频道 'channel'
redis2.publish("channel", "hello world");
```

## 二、SSO 单点登录

单点登录（Single Sign-On，简称 SSO）是一种身份认证和访问控制的机制，允许用户使用一组凭据（如用户名和密码）登录到多个应用程序或系统，而无需为每个应用程序单独提供凭据

SSO 的主要优点包括：

- **用户友好性：**用户只需登录一次，即可访问多个应用程序，提供了更好的用户体验和便利性。
- **提高安全性：**通过集中的身份验证，可以减少密码泄露和密码管理问题。此外，SSO 还可以与其他身份验证机制（如多因素身份验证）结合使用，提供更强的安全性。
- **简化管理：**SSO 可以减少管理员的工作量，因为他们不需要为每个应用程序单独管理用户凭据和权限。

比如，我有 XX 教育，XX 陪玩这两个软件，正常的话，两个软件的登录系统是独立的，就得做两套登录系统。但是如果使用 SSO 单点登录，`只需要在任意一个应用登录过，其他的应用就是一个免登录的状态，如果过期了，再去重新登录`

但是每个应用是不同的，登录用的是一套，这时候可以模仿一下微信小程序的生成一个 AppId 作为应用 ID，并且还可以创建一个 secret，因为每个应用的权限可以不一样，所以最后生成的 token 也不一样，还需要一个 url，登录之后重定向到该应用的地址，正规做法需要有一个后台管理系统用来控制这些，注册应用，删除应用，这里节约时间就写死了。

- server/index.js

```js
import express from "express";
import session from "express-session";
import fs from "node:fs";
import cors from "cors";
import jwt from "jsonwebtoken";

const appToMapUrl = {
  // 这里应该使用后台管理项目去管理应用
  "Rs6s2aHi": {
    url: "http://localhost:5173",
    name: "vue",
    secretKey: "%Y&*VGHJKLsjkas",
    token: ""
  },
  "9LQ8Y3mB": {
    url: "http://localhost:5174",
    secretKey: "%Y&*FRTYGUHJIOKL",
    name: "react",
    token: ""
  }
};

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: "$%^&*()_+DFGHJKL",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 //过期时间
    }
  })
);

const genToken = appId => {
  return jwt.sign({ appId }, appToMapUrl[appId].secretKey);
};

app.get("/login", (req, res) => {
  //注意看逻辑 如果登陆过 就走if 没有登录过就走下面的
  if (req.session.username) {
    //登录过
    const appId = req.query.appId;
    const url = appToMapUrl[appId].url;
    let token;
    //登录过如果存过token就直接取 没有存过就生成一个 因为可能有多个引用A登录过读取Token   B没有登录过生成Token 存入映射表
    if (appToMapUrl[appId].token) {
      token = appToMapUrl[appId].token;
    } else {
      token = genToken(appId);
      appToMapUrl[appId].token = token;
    }
    res.redirect(url + "?token=" + token);
    return;
  }
  //没有登录 返回一个登录页面html
  const html = fs.readFileSync(`../sso.html`, "utf-8");
  //返回登录页面
  res.send(html);
});

//提供protectd get接口 重定向到目标地址
app.get("/protectd", (req, res) => {
  const { appId, username, password } = req.query; //获取应用标识
  const url = appToMapUrl[appId].url; //读取要跳转的地址
  const token = genToken(appId); //生成token
  req.session.username = username; //存储用户名称 表示这个账号已经登录过了 下次无需登录
  appToMapUrl[appId].token = token; //根据应用存入对应的token
  res.redirect(url + "?token=" + token); //定向到目标页面
});

//启动3000端口
app.listen(3000, () => {
  console.log("http://localhost:3000");
});
```

- sso.html

```js
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
<!--这里会调用protectd接口 并且会传入 账号 密码 和 appId appId会从地址栏读取-->
    <form action="/protectd" method="get">
        <label for="username">
            账号：<input name="username" id="username" type="text">
        </label>
        <label for="password">密码：<input name="password" id="password" type="password"></label>
        <label for="appId"><input name="appId" value="" id="appId" type="hidden"></label>
        <button type="submit" id="button">登录</button>
    </form>
    <script>
       //读取AppId
        const appId = location.search.split('=')[1]
        document.getElementById('appId').value = appId
    </script>
</body>

</html>
```

- A 应用这里用 Vue 展示 App.vue

```html
<template>
  <h1>vue3</h1>
</template>

<script setup lang="ts">
  //如果有token代表登录过了 如果没有跳转到 登录页面也就是SSO 那个页面，并且地址栏携带AppID
  const token = location.search.split("=")[1];
  if (!token) {
    fetch("http://localhost:3000/login?appId=Rs6s2aHi").then(res => {
      location.href = res.url;
    });
  }
</script>

<style></style>
```

- B 应用使用 React 演示 App.tsx

```tsx
import { useState } from "react";
function App() {
  const [count, setCount] = useState(0);
  //逻辑其实一样的只是区分了不用应用的AppId
  const token = location.search.split("=")[1];
  if (!token) {
    fetch("http://localhost:3000/login?appId=9LQ8Y3mB").then(res => {
      location.href = res.url;
    });
  }
  return (
    <>
      <h1>react</h1>
    </>
  );
}
export default App;
```

## 三、SDL 单设备登录

SDL（Single Device Login）是一种单设备登录的机制，它允许用户在同一时间只能在一个设备上登录，当用户在其他设备上登录时，之前登录的设备会被挤下线。

### 1. 数据结构设计

```js
{
  id: {
    socket: ws实例,
    fingerprint: 浏览器指纹
  }
}
```

- 1. 第一次登录的时候记录用户 id，并且记录 socket 信息，和浏览器指纹
- 2. 当有别的设备登录的时候发现之前已经连接过了，便使用旧的 socket 发送下线通知，并且关闭旧的 socket，更新 socket 替换成当前新设备的 ws 连接

### 2. 浏览器指纹

指纹技术有很多种，这里采用 canvas 指纹技术

- node 端

```js
import express from "express";
import { WebSocketServer } from "ws";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
//存放数据结构
const connection = {};

const server = app.listen(3000);
const wss = new WebSocketServer({ server });

wss.on("connection", ws => {
  ws.on("message", message => {
    const data = JSON.parse(message);
    if (data.action === "login") {
      if (connection[data.id] && connection[data.id].fingerprint) {
        console.log("账号在别处登录");
        //提示旧设备
        connection[data.id].socket.send(
          JSON.stringify({
            action: "logout",
            message: `你于${new Date().toLocaleString()}账号在别处登录`
          })
        );
        connection[data.id].socket.close(); //断开旧设备连接
        connection[data.id].socket = ws; //更新ws
      } else {
        console.log("首次登录");
        connection[data.id] = {
          socket: ws, //记录ws
          fingerprint: data.fingerprint //记录指纹
        };
      }
    }
  });
});
```

- 浏览器端

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <h1>SDL</h1>
    <script src="./md5.js"></script>
    <script>
      //浏览器指纹
      const createBrowserFingerprint = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, 1, 1);
        return md5(canvas.toDataURL());
      };
      //谷歌abf12f62e03d160f7f24144ef1778396
      //火狐80bea69bfc7cad5832d12e41714cf677
      //Edge abf12f62e03d160f7f24144ef1778396

      const ws = new WebSocket("ws://192.168.120.145:3000"); //socket本地IP+端口
      ws.addEventListener("open", () => {
        ws.send(
          JSON.stringify({
            action: "login", //动作登录
            id: 1, //用户ID
            fingerprint: createBrowserFingerprint() //浏览器指纹
          })
        );
      });
      ws.addEventListener("message", message => {
        const data = JSON.parse(message.data);
        if (data.action === "logout") {
          alert(data.message); //监听到挤下线操作提示弹框
        }
      });
    </script>
  </body>
</html>
```

## 四、SCL 扫码登录

SCL (Scan Code Login) 是一种扫码登录的技术，它允许用户通过扫描二维码来进行登录操作。这种登录方式在许多应用和网站中得到广泛应用，因为它简单、方便且安全。

- index.js

```js
import express from "express";
import qrcode from "qrcode";
import jwt from "jsonwebtoken";

let user = {};
let userId = 1; //模拟一个用户
const app = express();
app.use(express.json());
app.use("/static", express.static("public")); //初始化静态目录
//初始化数据结构 记录用户和创建二维码的时间
//并且生成二维码的时候使用的是授权的那个页面并且把用户id带过去
app.get("/qrcode", async (req, res) => {
  user[userId] = {
    token: null,
    time: Date.now()
  };
  const code = await qrcode.toDataURL(
    `http://192.168.120.145:3000/static/mandate.html?userId=${userId}`
  );
  res.json({
    code,
    userId
  });
});
//授权确认接口 陈功授权之后生成token
app.post("/login/:userId", (req, res) => {
  const token = jwt.sign(req.params.userId, "secret");
  user[req.params.userId].token = token;
  user[req.params.userId].time = Date.now();
  res.json({
    token
  });
});
//检查接口 这个接口要被轮询调用检查状态，0未授权 1已授权 2超时
app.get("/check/:userId", (req, res) => {
  //判断超时时间
  if (Date.now() - user[userId].time > 1000 * 60 * 1) {
    return res.json({
      status: 2
    });
  }
  //如果有token那就是验证成功
  else if (user[1].token) {
    return res.json({
      status: 1
    });
  } else {
    return res.json({
      status: 0
    });
  }
});

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
```

- qrcode.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <img id="qrcode" src="" alt="" />
    <div id="status-div"></div>
    <script>
      const status = {
        0: "未授权",
        1: "已授权",
        2: "超时"
      };
      const qrcode = document.getElementById("qrcode");
      const statusDiv = document.getElementById("status-div");
      let userId = null;
      statusDiv.innerText = status[0];
      fetch("/qrcode")
        .then(res => res.json())
        .then(res => {
          qrcode.src = res.code; //获取二维码
          userId = res.userId; //获取用户id
          let timer = setInterval(() => {
            //轮询调用检查接口
            fetch(`/check/${userId}`)
              .then(res => res.json())
              .then(res => {
                statusDiv.innerText = status[res.status];
                //如果返回的状态是 超时 或者是已授权 就停止轮训
                if (res.status != 0) {
                  clearInterval(timer);
                }
              });
          }, 1000);
        });
    </script>
  </body>
</html>
```

- mandate.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <div><button id="btn" style="width: 100%;height: 50px;">同意授权</button></div>
    <div><button style="width: 100%;height: 50px;margin-top: 20px;">拒绝授权</button></div>
    <script>
      const btn = document.getElementById("btn");
      let userId = location.search.slice(1).split("=")[1];
      btn.onclick = () => {
        //点击授权按钮
        fetch(`/login/${userId}`, {
          method: "POST"
        })
          .then(res => res.json())
          .then(res => {
            alert(`授权成功`);
          })
          .catch(err => {
            alert(err);
          });
      };
    </script>
  </body>
</html>
```

## 五、OSS 云存储

OSS（Object Storage Service）是一种云存储服务，提供了一种高度可扩展的、安全可靠的对象存储解决方案
OSS 对象存储以对象为基本存储单元，每个对象都有唯一的标识符（称为对象键）和数据。这些对象可以是任意类型的文件，如文档、图片、视频等。OSS 提供了高可用性、高扩展性和高安全性的存储服务，适用于各种应用场景，包括数据备份与归档、静态网站托管、大规模数据处理、移动应用程序存储等。

### 1. node 上传

先在阿里云的 OSS 中创建密钥，后续要使用

```js
npm install ali-oss
```

```js
import OSS from "ali-oss";
import express from "express";
import path from "node:path";
import cors from "cors";

const app = express();

app.use(cors());

const config = {
  region: "oss-cn-beijing", //区域
  accessKeyId: "XXXXXXXX",
  accessKeySecret: "XXXXXXXX",
  bucket: "nodejs-oss"
};
const client = new OSS(config);

app.get("/", async (req, res) => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const policy = {
    expiration: date.toISOString(), //设置签名日期
    conditions: [
      ["content-length-range", 0, 1048576000] //设置文件大小限制
    ]
  };
  const formData = await client.calculatePostSignature(policy);
  const { location } = await client.getBucketLocation();
  const host = `http://${config.bucket}.${location}.aliyuncs.com`;

  res.json({
    host, //返回上传的url
    policy: formData.policy, //返回政策
    OSSAccessKeyId: formData.OSSAccessKeyId, //返回秘钥
    signature: formData.Signature //返回签名
  });
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
```

## 六、fastify

Fastify 是一个 web 框架，高度专注于以最少的开销和强大的插件架构提供最佳的开发体验。它的灵感来自于 Hapi 和 Express，它是运行在 Node.js 上的最快的 Web 框架之一。Fastify 可以被视为 Node.js 中的一个高效、现代化的 web 框架，是构建快速 web 应用的一个优秀选择。

### 1. 与其他框架比较

- Fastify 每秒处理 46242 个请求
- Koa 每秒处理 36606 个请求
- Express 每秒处理 10605 个请求

### 2. 使用

fastify 的使用基本个 express 一样

```js
import fastify from "fastify";

const app = fastify({
  logger: true // 配置日志开启
});

//天然支持post接口
// 给前端返回值 第一种方式 reply.send(字符串|对象|数组) 第二种方式 直接return返回值
app.post("/", async (request, reply) => {
  const { name, version } = request.body;
  //返回json  支持直接return
  return {
    name,
    version
  };
});

//get接口
app.get("/", async (request, reply) => {
  reply.send(`${request.query.name}`);
});

app.listen({ port: 3000 }).then(() => console.log("server is running"));
```

### 3. 路由

1. method 定义请求方式 例如 get post put 等
2. url 匹配接口路径
3. schema 含请求和响应模式的对象。它们需要采用 JSON 架构格式
4. handler 请求处理函数

- **post 接口** 使用 req.body 接收前端传来的参数
- **get 接口** 使用 req.query 接收前端传来的参数
- **动态参数接口 /:id** 使用 req.params 接收前端传来的参数

```js
app.route({
  url: "/list", // 匹配路径
  method: "GET", // 请求方式
  schema: {
    //序列化入参
    querystring: {
      // 这个是配置get请求的  要是post请求 就是 body 动态参数 就是params
      type: "object", // 要求前端传入一个对象 {name,age}
      properties: {
        name: { type: "string" },
        age: { type: "number" }
      },
      required: ["name", "age"] //必填项
    },
    //序列化出参 返回给前端的
    response: {
      200: {
        type: "object", //返回一个对象
        properties: {
          //返回的数属性描述
          data: {
            //返回data
            type: "array", //是个数组类型
            items: {
              //子集
              type: "object", //是个对象
              properties: {
                //子集的属性
                name: { type: "string" },
                version: { type: "string" }
              }
            }
          }
        }
      }
    }
  },
  handler: (request, reply) => {
    return {
      message: "ok",
      data: [{ name: "fastify", version: "4.27.0" }]
    };
  }
});

// 前端请求路径
// http://localhost:3000/list 传入name,age 获取数据为handler里面的返回值
```

### 4. 插件编写

fastify 允许用户通过插件扩展其功能。插件可以是一组路由、服务器装饰器或其他任何东西。您需要使用一个或多个插件的 API 是 `register`.

1. ins 就是 fastify 实例
2. opts 就是传递过来的传参数
3. done 控制流程 跟 express next 一样

```js
import fastify from "fastify";

const app = fastify();

// 注册插件
app.register(
  function (ins, opts, done) {
    // ins.decorate("add", (a, b) => a + b); 也可以直接定义名字
    ins.decorate(opts.name, (a, b) => a + b);
    done();
  },
  {
    name: "add" //options
  }
);

app.get("/", (req, res) => {
  app.add(1, 2);
});
```

### 5. 连接数据库

fastify 的生态系统提供了一些用于连接各种数据库引擎的插件。
生态地址：fastify.dev/ecosystem/

#### 5.1 安装包

```js
npm i @fastify/mysql
```

#### 5.2 连接

```js
server.register(import("@fastify/mysql"), {
  connectionString: "mysql://root:123456@localhost:3306/xiaoman" //账号,密码,IP,端口,库名
});
```

```js
import fastify from "fastify";

const server = fastify({
  logger: false
});

server.register(import("@fastify/mysql"), {
  connectionString: "mysql://root:123456@localhost:3306/xiaoma"
});

//添加
server.post("/add", (request, reply) => {
  server.mysql.query(
    "insert into user(create_time,name,hobby) values(?,?,?)",
    [new Date(), request.body.name, request.body.hobby],
    (err, results) => {
      if (err) {
        console.log(err);
        return reply.send(err);
      }
      reply.send({ results });
    }
  );
});
//查询
server.get("/list", (request, reply) => {
  server.mysql.query("select * from user", (err, result) => {
    reply.send({ result });
  });
});

server.listen({ port: 3000 }).then(() => console.log("server is running"));
```
