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

## 一、MVC 架构

之前学习了 express 框架去编写接口，prisma ORM 框架去进行 mysql 数据库进行数据的读写操作，现在我们可以将它们整合到一起，并且实现一个类似于`NestJS`或者`SpringBoot`的架构去进行 node 项目开发

MVC（Model-View-Controller）是一种常用的软件架构模式，用于设计和组织应用程序的代码。它将应用程序分为三个主要组件：模型（Model）、视图（View）和控制器（Controller），各自负责不同的职责。

- **模型（Model）：** 模型表示应用程序的数据和业务逻辑。它负责处理数据的存储、检索、验证和更新等操作。模型通常包含与数据库、文件系统或外部服务进行交互的代码。
- **视图（View）：** 视图负责将模型的数据以可视化的形式呈现给用户。它负责用户界面的展示，包括各种图形元素、页面布局和用户交互组件等。视图通常是根据模型的状态来动态生成和更新的。
- **控制器（Controller）：** 控制器充当模型和视图之间的中间人，负责协调两者之间的交互。它接收用户输入（例如按钮点击、表单提交等），并根据输入更新模型的状态或调用相应的模型方法。控制器还可以根据模型的变化来更新视图的显示。

MVC 的主要目标是将应用程序的逻辑、数据和界面分离，以提高代码的可维护性、可扩展性和可重用性。通过将不同的职责分配给不同的组件，MVC 提供了一种清晰的结构，使开发人员能够更好地管理和修改应用程序的各个部分。

### 1. IOC 控制反转和 DI 依赖注入

控制反转（Inversion of Control，IoC）和依赖注入（Dependency Injection，DI）是软件开发中常用的设计模式和技术，用于解耦和管理组件之间的依赖关系。虽然它们经常一起使用，但它们是不同的概念。

- **控制反转（IoC）** 是一种设计原则，它将组件的控制权从组件自身转移到外部容器。传统上，组件负责自己的创建和管理，而控制反转则将这个责任转给了一个外部的容器或框架。容器负责创建组件实例并管理它们的生命周期，组件只需声明自己所需的依赖关系，并通过容器获取这些依赖。这种反转的控制权使得组件更加松耦合、可测试和可维护。

- **依赖注入（DI）** 是实现控制反转的一种具体技术。它通过将组件的依赖关系从组件内部移动到外部容器来实现松耦合。组件不再负责创建或管理它所依赖的其他组件，而是通过构造函数、属性或方法参数等方式将依赖关系注入到组件中。依赖注入可以通过构造函数注入（Constructor Injection）、属性注入（Property Injection）或方法注入（Method Injection）等方式实现。

### 2. 安装依赖

1. inversify + reflect-metadata 实现依赖注入
2. 接口编写 express
3. 连接工具 inversify-express-utils
4. orm 框架 prisma
5. dto class-validator + class-transformer

### 3.项目架构

#### 3.1 项目构建

```js
prisma init --datasource-provider mysql
```

- main.ts

```ts
import "reflect-metadata";
import { InversifyExpressServer } from "inversify-express-utils";
import { Container } from "inversify";
import { UserController } from "./src/user/controller";
import { UserService } from "./src/user/service";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaDB } from "./src/db";
const container = new Container(); //Ioc容器
/**
 * prisma依赖注入
 */
//注入工厂封装db
container.bind<PrismaClient>("PrismaClient").toFactory(() => {
  return () => {
    return new PrismaClient();
  };
});
container.bind(PrismaDB).toSelf();
/**
 * user模块
 */
container.bind(UserService).to(UserService); //添加到容器
container.bind(UserController).to(UserController); //添加到容器
/**
 * post模块
 */
const server = new InversifyExpressServer(container); //返回server
//中间件编写在这儿
server.setConfig(app => {
  app.use(express.json()); //接受json
});
const app = server.build(); //app就是express

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
```

- src/user/controller.ts

```ts
import {
  controller,
  httpGet as GetMapping,
  httpPost as PostMapping
} from "inversify-express-utils";
import { inject } from "inversify";
import { UserService } from "./service";
import type { Request, Response } from "express";

@controller("/user") //路由
export class UserController {
  constructor(
    @inject(UserService) private readonly userService: UserService //依赖注入
  ) {}

  @GetMapping("/index") //get请求
  public async getIndex(req: Request, res: Response) {
    console.log(req?.user.id);
    const info = await this.userService.getUserInfo();
    res.send(info);
  }

  @PostMapping("/create") //post请求
  public async createUser(req: Request, res: Response) {
    const user = await this.userService.createUser(req.body);
    res.send(user);
  }
}
```

- src/user/service.ts

```ts
import { injectable, inject } from "inversify";
import { UserDto } from "./user.dto";
import { plainToClass } from "class-transformer"; //dto验证
import { validate } from "class-validator"; //dto验证
import { PrismaDB } from "../db";

@injectable()
export class UserService {
  constructor(
    @inject(PrismaDB) private readonly PrismaDB: PrismaDB //依赖注入
  ) {}

  public async getUserInfo() {
    return await this.PrismaDB.prisma.user.findMany();
  }

  public async createUser(data: UserDto) {
    const user = plainToClass(UserDto, data);
    const errors = await validate(user);
    const dto = [];
    if (errors.length) {
      errors.forEach(error => {
        Object.keys(error.constraints).forEach(key => {
          dto.push({
            [error.property]: error.constraints[key]
          });
        });
      });
      return dto;
    } else {
      const userInfo = await this.PrismaDB.prisma.user.create({ data: user });
      return userInfo;
    }
  }
}
```

- src/user/user.dto.ts

```ts
import { IsNotEmpty, IsEmail } from "class-validator";
import { Transform } from "class-transformer";
export class UserDto {
  @IsNotEmpty({ message: "用户名必填" })
  @Transform(user => user.value.trim())
  name: string;

  @IsNotEmpty({ message: "邮箱必填" })
  @IsEmail({}, { message: "邮箱格式不正确" })
  @Transform(user => user.value.trim())
  email: string;
}
```

- src/db/index.ts

```ts
import { injectable, inject } from "inversify";
import { PrismaClient } from "@prisma/client";

@injectable()
export class PrismaDB {
  prisma: PrismaClient;
  constructor(@inject("PrismaClient") PrismaClient: () => PrismaClient) {
    this.prisma = PrismaClient();
  }
}
```

## 二、jwt

JWT（JSON Web Token）是一种开放的标准（RFC 7519），用于在网络应用间传递信息的一种方式。它是一种基于 JSON 的安全令牌，用于在客户端和服务器之间传输信息

JWT 由三部分组成，它们通过点（.）进行分隔：

**Header（头部）：**包含了令牌的类型和使用的加密算法等信息。通常采用 Base64 编码表示。
**Payload（负载）：**包含了身份验证和授权等信息，如用户 ID、角色、权限等。也可以自定义其他相关信息。同样采用 Base64 编码表示。
**Signature（签名）：**使用指定的密钥对头部和负载进行签名，以确保令牌的完整性和真实性。

JWT 的工作流程如下：

1. 用户通过提供有效的凭证（例如用户名和密码）进行身份验证。
2. 服务器验证凭证，并生成一个 JWT 作为响应。JWT 包含了用户的身份信息和其他必要的数据。
3. 服务器将 JWT 发送给客户端。
4. 客户端在后续的请求中，将 JWT 放入请求的头部或其他适当的位置。
5. 服务器在接收到请求时，验证 JWT 的签名以确保其完整性和真实性。如果验证通过，服务器使用 JWT 中的信息进行授权和身份验证。

### 1. 使用到的依赖

1. `passport` 是一个流行的用于身份验证和授权的 Node.js 库
2. `passport-jwt` 是 Passport 库的一个插件，用于支持使用 JSON Web Token (JWT) 进行身份验证和授权
3. `jsonwebtoken` 生成 token 的库

### 2. 代码实现

- src/jwt/index.ts

```ts
import { injectable } from "inversify";
import jsonwebtoken from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";

@injectable()
export class JWT {
  private secret = "xiaoman$%^&*()asdsd";
  private jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: this.secret
  };

  constructor() {
    this.strategy();
  }

  /**
   * 初始化jwt
   */
  public strategy() {
    const strategy = new Strategy(this.jwtOptions, (payload, done) => {
      done(null, payload);
    });
    passport.use(strategy);
  }

  /**
   *
   * @returns 中间件
   */
  public middleware() {
    return passport.authenticate("jwt", { session: false });
  }

  /**
   * 创建token
   * @param data Object
   */
  public createToken(data: object) {
    //有效期为7天
    return jsonwebtoken.sign(data, this.secret, { expiresIn: "7d" });
  }

  /**
   *
   * @returns 集成到express
   */
  public init() {
    return passport.initialize();
  }
}
```

- main.ts

```ts
import "reflect-metadata";
import { InversifyExpressServer } from "inversify-express-utils";
import { Container } from "inversify";
import { User } from "./src/user/controller";
import { UserService } from "./src/user/services";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaDB } from "./src/db";
import { JWT } from "./src/jwt";
const container = new Container();
/**
 * user模块
 */
container.bind(User).to(User);
container.bind(UserService).to(UserService);
/**
 *  封装PrismaClient
 */
container.bind<PrismaClient>("PrismaClient").toFactory(() => {
  return () => {
    return new PrismaClient();
  };
});
container.bind(PrismaDB).to(PrismaDB);
/**
 * jwt模块
 */
container.bind(JWT).to(JWT); //主要代码

const server = new InversifyExpressServer(container);
server.setConfig(app => {
  app.use(express.json());
  app.use(container.get(JWT).init()); //主要代码
});
const app = server.build();

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
```

- src/user/controller.ts

```ts
import {
  controller,
  httpGet as GetMapping,
  httpPost as PostMapping
} from "inversify-express-utils";
import { UserService } from "./services";
import { inject } from "inversify";
import type { Request, Response } from "express";
import { JWT } from "../jwt";
const { middleware } = new JWT();

@controller("/user")
export class User {
  constructor(@inject(UserService) private readonly UserService: UserService) {}
  @GetMapping("/index", middleware()) //主要代码
  public async getIndex(req: Request, res: Response) {
    let result = await this.UserService.getList();
    res.send(result);
  }

  @PostMapping("/create")
  public async createUser(req: Request, res: Response) {
    let result = await this.UserService.createUser(req.body);
    res.send(result);
  }
}
```

- src/user/services.ts

```ts
import { injectable, inject } from "inversify";
import { PrismaDB } from "../db";
import { UserDto } from "./user.dto";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { JWT } from "../jwt";

@injectable()
export class UserService {
  constructor(
    @inject(PrismaDB) private readonly PrismaDB: PrismaDB,
    @inject(JWT) private readonly jwt: JWT //依赖注入
  ) {}
  public async getList() {
    return await this.PrismaDB.prisma.user.findMany();
  }

  public async createUser(user: UserDto) {
    let userDto = plainToClass(UserDto, user);
    const errors = await validate(userDto);
    if (errors.length) {
      return errors;
    } else {
      const result = await this.PrismaDB.prisma.user.create({
        data: user
      });
      return {
        ...result,
        token: this.jwt.createToken(result) //生成token
      };
    }
  }
}
```

前端可以在请求头中携带 token

```js
header: {
  "Authorization": "Bearer sahsfhsdfhsifsfsfsdf4sf4sdf8sdf8sdf4s5df2sd1f"
}
```

## 三、定时任务

定时任务是指在预定的时间点或时间间隔内执行的任务或操作。它们是自动化执行特定逻辑的一种方式，可用于执行重复性的、周期性的或计划性的任务。

定时任务通常用于以下情况：

1. 执行后台任务：定时任务可用于自动执行后台任务，如数据备份、日志清理、缓存刷新等。通过设定适当的时间点或时间间隔，可以确保这些任务按计划进行，而无需手动干预。
2. 执行定期操作：定时任务可用于执行定期操作，如发送电子邮件提醒、生成报告、更新数据等。通过设定适当的时间点，可以自动触发这些操作，提高效率并减少人工操作的需求。
3. 调度任务和工作流：定时任务可以用于调度和协调复杂的任务和工作流程。通过设置任务之间的依赖关系和执

### 1. 依赖安装

```js
npm install node-schedule
```

### 2. cron 表达式

一般定时任务都是用 cron 表达式去表示时间的，Cron 表达式是一种用于指定定时任务执行时间的字符串表示形式。它由 6 个或 7 个字段组成，每个字段表示任务执行的时间单位和范围。

```js
  *    *    *    *    *    *
  ┬    ┬    ┬    ┬    ┬    ┬
  │    │    │    │    │    │
  │    │    │    │    │    └── 星期（0 - 6，0表示星期日）
  │    │    │    │    └───── 月份（1 - 12）
  │    │    │    └────────── 日（1 - 31）
  │    │    └─────────────── 小时（0 - 23）
  │    └──────────────────── 分钟（0 - 59）
  └───────────────────────── 秒（0 - 59）
```

以下是一些常见的 Cron 表达式示例：

`* * * * * *：`每秒执行一次任务。
`0 * * * * *：`每分钟的整点执行一次任务。
`0 0 * * * *：`每小时的整点执行一次任务。
`0 0 * * 1 *：`每周一的午夜执行一次任务。
`0 0 1 * * *：`每月的 1 号午夜执行一次任务。
`0 0 1 1 * *：`每年的 1 月 1 日午夜执行一次任务。

### 3. 掘金自动签到

- config.js

```js
export default {
  cookie: "sessionid=你的cookie",
  url: "https://juejin.cn/",
  check_url: "https://api.juejin.cn/growth_api/v1/check_in?aid=你的aid&uid=你的uid"
};
```

```js
import schedule from "node-schedule";
import request from "request";
import config from "./config.js";

schedule.scheduleJob("0 30 0 * * *", () => {
  request(
    config.check_url,
    {
      method: "post",
      headers: {
        Referer: config.url,
        Cookie: config.cookie
      }
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
      }
    }
  );
});
```

## 四、socket.io

传统的 HTTP 是一种单向请求-响应协议，客户端发送请求后，服务器才会响应并返回相应的数据。在传统的 HTTP 中，客户端需要主动发送请求才能获取服务器上的资源，而且每次请求都需要重新建立连接，这种方式在实时通信和持续获取资源的场景下效率较低。

Socket 提供了实时的双向通信能力，可以实时地传输数据。客户端和服务器之间的通信是即时的，数据的传输和响应几乎是实时完成的，不需要轮询或定时发送请求

Socket.IO 是一个基于事件驱动的实时通信框架，用于构建实时应用程序。它提供了双向、低延迟的通信能力，使得服务器和客户端可以实时地发送和接收数据。

Socket.IO 的主要特点包括：

- **实时性:** Socket.IO 构建在 WebSocket 协议之上，使用了 WebSocket 连接来实现实时通信。WebSocket 是一种双向通信协议，相比传统的 HTTP 请求-响应模型，它可以实现更快速、低延迟的数据传输。
- **事件驱动:**Socket.IO 使用事件驱动的编程模型。服务器和客户端可以通过触发事件来发送和接收数据。这种基于事件的通信模式使得开发者可以轻松地构建实时的应用程序，例如聊天应用、实时协作工具等。
- **跨平台支持:** Socket.IO 可以在多个平台上使用，包括浏览器、服务器和移动设备等。它提供了对多种编程语言和框架的支持，如 JavaScript、Node.js、Python、Java 等，使得开发者可以在不同的环境中构建实时应用程序。
- **容错性:** Socket.IO 具有容错能力，当 WebSocket 连接不可用时，它可以自动降级到其他传输机制，如 HTTP 长轮询。这意味着即使在不支持 WebSocket 的环境中，Socket.IO 仍然可以实现实时通信。
- **扩展性:** Socket.IO 支持水平扩展，可以将应用程序扩展到多个服务器，并实现事件的广播和传递。这使得应用程序可以处理大规模的并发连接，并实现高可用性和高性能

### 1. 依赖安装

在正常开发中，我们会使用成熟的第三方库，原生 websocket，用的较少，一些简单的项目，或者一些普通的业务可以使用，不过大部分还是使用第三方库。

```js
npm install socket.io
```

浏览器使用 esm

```html
<script type="module">
  import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";
  const socket = io("ws://localhost:3000"); //ws的地址
</script>
```

### 2. 聊天室案例

```html
<body>
  <script type="module">
    const sendMessage = message => {
      const div = document.createElement("div");
      div.className = "main-chat";
      div.innerText = `${message.user}:${message.text}`;
      main.appendChild(div);
    };
    const groupEl = document.querySelector(".groupList");
    const main = document.querySelector(".main");
    import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";
    const name = prompt("请输入你的名字");
    const room = prompt("请输入房间号");
    const socket = io("ws://localhost:3000");
    //键盘按下发送消息
    document.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        const ipt = document.querySelector(".ipt");
        socket.emit("message", {
          text: ipt.innerText,
          room: room,
          user: name
        });
        sendMessage({
          text: ipt.innerText,
          user: name
        });
        ipt.innerText = "";
      }
    });
    //连接成功socket
    socket.on("connect", () => {
      socket.emit("join", { name, room }); //加入一个房间
      socket.on("message", message => {
        sendMessage(message);
      });
      socket.on("groupList", groupList => {
        console.log(groupList);
        groupEl.innerHTML = "";
        Object.keys(groupList).forEach(key => {
          const item = document.createElement("div");
          item.className = "groupList-items";
          item.innerText = `房间名称:${key} 房间人数:${groupList[key].length}`;
          groupEl.appendChild(item);
        });
      });
    });
  </script>
</body>
```

- nodejs 端

```js
import http from "http";
import { Server } from "socket.io";
import express from "express";

const app = express();
app.use("*", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  next();
});
const server = http.createServer(app);
const io = new Server(server, {
  cors: true //允许跨域
});
const groupList = {};
/**
 * [{1008:[{name,room,id}]}]
 */
io.on("connection", socket => {
  //加入房间
  socket.on("join", ({ name, room }) => {
    socket.join(room);
    if (groupList[room]) {
      groupList[room].push({ name, room, id: socket.id });
    } else {
      groupList[room] = [{ name, room, id: socket.id }];
    }
    socket.emit("message", { user: "管理员", text: `${name}进入了房间` });
    socket.emit("groupList", groupList);
    socket.broadcast.emit("groupList", groupList);
  });
  //发送消息
  socket.on("message", ({ text, room, user }) => {
    socket.broadcast.to(room).emit("message", {
      text,
      user
    });
  });
  //断开链接内置事件
  socket.on("disconnect", () => {
    Object.keys(groupList).forEach(key => {
      let leval = groupList[key].find(item => item.id === socket.id);
      if (leval) {
        socket.broadcast
          .to(leval.room)
          .emit("message", { user: "管理员", text: `${leval.name}离开了房间` });
      }
      groupList[key] = groupList[key].filter(item => item.id !== socket.id);
    });
    socket.broadcast.emit("groupList", groupList);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
```

## 五、http 缓存

HTTP 缓存主要分为两大类：`强缓存`和`协商缓存`。这两种缓存都通过 `HTTP 响应头`来控制，目的是提高网站性能。

### 1. 强缓存

`强缓存`之后则`不需要向服务器发送请求`，而是从`浏览器缓存读取`，而浏览器缓存又分为`内存缓存`| `硬盘缓存`

- 1. `内存缓存（memory cache）`存储在浏览器内存当中，一般刷新网页的时候会发现很多内存缓存
- 2. `硬盘缓存（disk cache）`是存储在计算机硬盘中，空间大，但是读取效率比内存缓存慢

#### 1.1 Expires 字段

Expires: 该字段指定响应的到期时间，即资源不再被视为有效的日期和时间。它是一个 HTTP 1.0 的头部字段，但仍然被一些客户端和服务器使用。

Expires 的判断机制是：当客户端请求资源时，会获取本地时间戳，然后拿本地时间戳与 Expires 设置的时间做对比，如果时间没有超过设置的时间，走强缓存，时间超过了，则对服务器发起请求。

如下代码

- node 端

```js
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

// 静态资源缓存
app.use(
  express.static("./static", {
    maxAge: 1000 * 60 * 5 // 强缓存
    // lastModified: true // 开启协商缓存
  })
);

// 动态资源缓存
app.get("/", (req, res) => {
  res.setHeader("Expires", new Date("2024-3-30 23:17:00").toUTCString()); //设置过期时间 要是UTC格式的时间
  res.send({
    name: "cache",
    version: "1.0.0"
  });
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
```

#### 1.2 Cache-Control:max-age

Cache-Control 的值如下：

- **max-age：** 浏览器资源缓存的时长(秒)。
- **no-cache：** 不走强缓存，走协商缓存。
- **no-store：** 禁止任何缓存策略。
- **public：** 资源即可以被浏览器缓存也可以被代理服务器缓存(CDN)。
- **private：** 资源只能被客户端缓存，不包括代理服务器。

:::tip 注意
如果 max-age 和 Expires 同时出现 max-age 优先级高
:::

- node 端

```js
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=20"); //20秒
  res.json({
    name: "cache",
    version: "1.0.0"
  });
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
```

:::tip 注意
如果强缓存和协商缓存同时存在，浏览器是优先于强缓存
那么如何解决这个问题？
res.setHeader('Cache-Control', 'no-cache') // 告诉浏览器不走强缓存，走协商缓存
:::

### 2.协商缓存

当涉及到缓存机制时，强缓存优先于协商缓存。当资源的强缓存生效时，客户端可以直接从本地缓存中获取资源，而无需与服务器进行通信。强缓存的判断是通过缓存头部字段来完成的，例如设置了合适的 Cache-Control 和 Expires 字段。

如果强缓存未命中（例如 max-age 过期），或者服务器响应中设置了 Cache-Control: no-cache，则客户端会发起协商缓存的请求。在协商缓存中，客户端会发送带有缓存数据标识的请求头部字段，以向服务器验证资源的有效性。

服务器会根据客户端发送的协商缓存字段（如 If-Modified-Since 和 If-None-Match）来判断资源是否发生变化。如果资源未发生修改，服务器会返回状态码 304（Not Modified），通知客户端可以使用缓存的版本。如果资源已经发生变化，服务器将返回最新的资源，状态码为 200。

#### 2.1 Last-Modified 和 If-Modified-Since

服务器通过 `Last-Modified` 响应头告知客户端资源的最后修改时间。客户端在后续请求中会自动带上 `If-Modified-Since`这个字段， 这个字段的值也就是`Last-Modified`的值，然后将这种两个时间进行对比。如果没有更新，返回 304 状态码。

```js
import express from "express";
import cors from "cors";
import fs from "node:fs";

const app = express();
app.use(cors());

const getModifyTime = () => {
  return fs.statSync("./index.js").mtime.toISOString(); //获取文件最后修改时间
};

app.get("/api", (req, res) => {
  res.setHeader("Cache-Control", "no-cache, max-age=2592000"); //表示走协商缓存

  const ifModifiedSince = req.headers["if-modified-since"]; //获取浏览器上次修改时间

  res.setHeader("Last-Modified", getModifyTime());

  if (ifModifiedSince && ifModifiedSince === getModifyTime()) {
    console.log("304");
    res.statusCode = 304;
    res.end();
    return;
  } else {
    console.log("200");
    res.end("value");
  }
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
```

#### 2.2 ETag 和 If-None-Match

服务器通过 ETag 响应头给资源生成一个唯一标识符。客户端在后续请求中通过 If-None-Match 请求头携带该标识符，服务器根据标识符判断资源是否有更新。如果没有更新，返回 304 状态码。

:::tip
ETag 优先级比 Last-Modified 高
:::

```js
import express from "express";
import cors from "cors";
import fs from "node:fs";
import crypto from "node:crypto";
const getFileHash = () => {
  return crypto.createHash("sha256").update(fs.readFileSync("index.js")).digest("hex");
};
const app = express();
app.use(cors());
app.get("/api", (req, res) => {
  res.setHeader("Cache-Control", "no-cache, max-age=2592000"); //表示走协商缓存
  const etag = getFileHash();
  const ifNoneMatch = req.headers["if-none-match"];
  if (ifNoneMatch === etag) {
    res.sendStatus(304);
    return;
  }
  res.setHeader("ETag", etag);
  res.send("Etag");
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
```

## 六、http2

HTTP/2（HTTP2）是超文本传输协议（HTTP）的下一个主要版本，它是对 HTTP/1.1 协议的重大改进。HTTP/2 的目标是改善性能、效率和安全性，以提供更快、更高效的网络通信

如何分辨是 http/1.1 还是 http2?
浏览器控制台的 network 中看协议 http/1.1 为 http/1.1 ，http2 为 h2

http2 的优点：

- 1. **多路复用（Multiplexing）：**HTTP/2 支持在单个 TCP 连接上同时发送多个请求和响应。这意味着可以避免建立多个连接，减少网络延迟，提高效率。
- 2. **二进制分帧（Binary Framing）：**在应用层（HTTP2）和传输层（TCP or UDP）之间增加了二进制分帧层，将请求和响应拆分为多个帧（frames）。这种二进制格式的设计使得协议更加高效，并且容易解析和处理。
- 3. **头部压缩（Header Compression）：**HTTP/2 使用首部表（Header Table）和动态压缩算法来减少头部的大小。这减少了每个请求和响应的开销，提高了传输效率。

请求一发送了所有的头部字段，第二个请求则只需要发送差异数据，这样可以减少冗余数据，降低开销
![npm](/node/http2.png)

### 1. node 实现 http2

截止 2024-4-2 日 目前没有浏览器支持 http 请求访问 http2,所以要用 https
可以使用 openssl 生成 tls 证书

- 生成私钥

```js
openssl genrsa -out server.key 1024
```

- 生成证书请求文件(用完可以删掉也可以保留)

```js
openssl req -new -key server.key -out server.csr
```

- 生成证书

```js
openssl x509 -req -in server.csr -out server.crt -signkey server.key -days 3650
```

```js
import http2 from "node:http2";
import fs from "node:fs";

const server = http2.createSecureServer({
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.crt")
});

server.on("stream", (stream, headers) => {
  stream.respond({
    "content-type": "text/html; charset=utf-8",
    ":status": 200
  });
  stream.on("error", err => {
    console.log(err);
  });
  stream.end(`
      <h1>http2</h1>
    `);
});

server.listen(80, () => {
  console.log("server is running on port 80");
});
```

## 七、短链接

短链接是一种缩短长网址的方法，将原始的长网址转换为更短的形式。它通常由一系列的字母、数字和特殊字符组成，比起原始的长网址，短链接更加简洁、易于记忆和分享。

短链接的主要用途之一是在社交媒体平台进行链接分享。由于这些平台对字符数量有限制，长网址可能会占用大量的空间，因此使用短链接可以节省字符数，并且更方便在推特、短信等限制字数的场景下使用。

另外，短链接还可以用于跟踪和统计链接的点击量。通过在短链接中嵌入跟踪代码，网站管理员可以获得关于点击链接的详细统计数据，包括访问量、来源、地理位置等信息。这对于营销活动、广告推广或分析链接的效果非常有用。

比如：http://zzjsms.com/iLnq7j8lo

实现原理大致就是生成一个唯一的短码，利用重定向，定到原来的长连接地址。

### 1. 所需依赖

- epxress 启动服务提供接口
- mysql2 knex 依赖连接数据库
- knex orm 框架操作 mysql
- shortid 生成唯一短码

### 2. 数据库设计

```sql
CREATE TABLE `short` (
    `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
    `short_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '短码',
    `url` varchar(255) NOT NULL COMMENT '网址',
    PRIMARY KEY (`id`)
)
```

### 3. node 后台代码

```js
import knex from "knex";
import express from "express";
import shortid from "shortid";
const app = express();
app.use(express.json());
const db = knex({
  client: "mysql2",
  connection: {
    host: "localhost",
    user: "root",
    password: "123456",
    database: "short_link"
  }
});
//生成短码 存入数据库
app.post("/create_url", async (req, res) => {
  const { url } = req.body;
  const short_id = shortid.generate();
  const result = await db("short").insert({ short_id, url });
  res.send(`http://localhost:3000/${short_id}`);
});
//重定向
app.get("/:shortUrl", async (req, res) => {
  const short_id = req.params.shortUrl;
  const result = await db("short").select("url").where("short_id", short_id);
  if (result && result[0]) {
    res.redirect(result[0].url);
  } else {
    res.send("Url not found");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```
