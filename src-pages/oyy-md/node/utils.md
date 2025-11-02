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

## 一、ffmpeg

`FFmpeg` 是一个开源的跨平台多媒体处理工具，可以用于处理音频、视频和多媒体流。它提供了一组强大的命令行工具和库，可以进行视频转码、视频剪辑、音频提取、音视频合并、流媒体传输等操作。

### 1. 安装

官网http://ffmpeg.p2hp.com/download.html#google_vignette 选择对应的操作系统进行下载就可以了，下载完成配置一下环境变量就 ok 了，然后在 cmd 中输入 `ffmpeg -version`不报错就行了

### 2.子进程配合 ffmpeg

#### 2.1 视频转 gif

-i 表示输入的意思

```js
const { execSync } = require("child_process");
execSync(`ffmpeg -i test.mp4 test.gif`, { stdio: "inherit" });
```

#### 2.2 添加水印

-vf 就是 video filter

drawtext 添加文字 fontsize 大小 xy 垂直水平方向 fontcolor 颜色 text 水印文案

```js
const { execSync } = require("child_process");

execSync(
  `ffmpeg -i test.mp4 -vf drawtext=text="XMZS":fontsize=30:fontcolor=white:x=10:y=10 test2.mp4`,
  { stdio: "inherit" }
);
```

#### 2.3 视频裁剪 + 控制大小

-ss 起始时间

-to 结束事件

```js
const { execSync } = require("child_process");

execSync(`ffmpeg -ss 10 -to 20 -i test.mp4  test3.mp4`, { stdio: "inherit" });
```

#### 2.4 提取视频的音频

```js
const { execSync } = require("child_process");
execSync(`ffmpeg -i test.mp4 test.mp3`, { stdio: "inherit" });
```

### 2.5 去掉水印

w h 宽高 xy 垂直 水平坐标 delogo 使用的过滤参数删除水印

```js
const { execSync } = require("child_process");

execSync(`ffmpeg -i  test2.mp4 -vf delogo=w=120:h=30:x=10:y=10 test3.mp4`, {
  stdio: "inherit"
});
```

## 二、pngquant

`pngquant` 是一个用于`压缩 PNG 图像文件`的工具。它可以显著减小 PNG 文件的大小，同时保持图像质量和透明度。通过减小文件大小，可以提高网页加载速度，并节省存储空间。pngquant 提供命令行接口和库，可轻松集成到各种应用程序和脚本中。

pngquant 使用修改过的 Median Cut 量化算法以及其他技术来实现压缩 PNG 图像的目的。它的工作原理如下：

- 首先，pngquant 构建一个直方图，用于统计图像中的颜色分布情况。
- 接下来，它选择盒子来代表一组颜色。与传统的 Median Cut 算法不同，pngquant 选择的盒子是为了最小化盒子中颜色与中位数的差异。
- pngquant 使用感知模型给予图像中噪声较大的区域较少的权重，以建立更准确的直方图。
- 为了进一步改善颜色，pngquant 使用类似梯度下降的过程对直方图进行调整。它多次重复 Median Cut 算法，并在较少出现的颜色上增加权重。
- 最后，为了生成最佳的调色板，pngquant 使用 Voronoi 迭代（K-means）对颜色进行校正，以确保局部最优。
- 在重新映射颜色时，pngquant 只在多个相邻像素量化为相同颜色且不是边缘的区域应用误差扩散。这样可以避免在视觉质量较高且不需要抖动的区域添加噪声。

通过这些步骤，pngquant 能够在保持图像质量的同时，将 PNG 图像的文件大小减小到最低限度。

### 1.Nodejs 中 调用 pngquant

```js
import { exec } from "child_process";
exec("pngquant 73kb.png --output test.png");

// quality表示图片质量0-100值越大图片越大效果越好
exec("pngquant 73kb.png --quality=82 --output test.png");

// --speed=1: 最慢的速度，产生最高质量的输出图像。
// --speed=10: 最快的速度，但可能导致输出图像质量稍微降低。
exec("pngquant 73kb.png --speed=1 --quality=82 --output test.png");
```

## 三、脚手架编写

### 1. commander

Commander 是一个用于构建命令行工具的 npm 库。它提供了一种简单而直观的方式来创建命令行接口，并处理命令行参数和选项。使用 Commander，你可以轻松定义命令、子命令、选项和帮助信息。它还可以处理命令行的交互，使用户能够与你的命令行工具进行交互

### 2. inquirer

Inquirer 是一个强大的命令行交互工具，用于与用户进行交互和收集信息。它提供了各种丰富的交互式提示（如输入框、选择列表、确认框等），可以帮助你构建灵活的命令行界面。通过 Inquirer，你可以向用户提出问题，获取用户的输入，并根据用户的回答采取相应的操作。

### 3. ora

Ora 是一个用于在命令行界面显示加载动画的 npm 库。它可以帮助你在执行耗时的任务时提供一个友好的加载状态提示。Ora 提供了一系列自定义的加载动画，如旋转器、进度条等，你可以根据需要选择合适的加载动画效果，并在任务执行期间显示对应的加载状态。

### 4. download-git-repo

Download-git-repo 是一个用于下载 Git 仓库的 npm 库。它提供了一个简单的接口，可以方便地从远程 Git 仓库中下载项目代码。你可以指定要下载的仓库和目标目录，并可选择指定分支或标签。Download-git-repo 支持从各种 Git 托管平台（如 GitHub、GitLab、Bitbucket 等）下载代码。

- index.js

```js
#!/usr/bin/env node

import { program } from "commander";
import inquirer from "inquirer";
import fs from "node:fs";
import { checkPath, downloadTemp } from "./utils.js";
let json = fs.readFileSync("./package.json", "utf-8");
json = JSON.parse(json);

program.version(json.version); //创建版本号
//添加create 命令 和 别名crt 以及描述 以及 执行完成之后的动作
program
  .command("create <project>")
  .alias("ctr")
  .description("create a new project")
  .action(project => {
    //命令行交互工具
    inquirer
      .prompt([
        {
          type: "input",
          name: "projectName",
          message: "project name",
          default: project
        },
        {
          type: "confirm",
          name: "isTs",
          message: "是否支持typeScript"
        }
      ])
      .then(answers => {
        if (checkPath(answers.projectName)) {
          console.log("文件已存在");
          return;
        }

        if (answers.isTs) {
          downloadTemp("ts", answers.projectName);
        } else {
          downloadTemp("js", answers.projectName);
        }
      });
  });

program.parse(process.argv);
```

为什么第一行要写 `#!/usr/bin/env node`，这是一个 特殊的注释 用于告诉操作系统用 node 解释器去执行这个文件，而不是显式地调用 node 命令

- utils.js

```js
import fs from "node:fs";
import download from "download-git-repo";
import ora from "ora";
const spinner = ora("下载中...");
//验证路径
export const checkPath = path => {
  return fs.existsSync(path);
};

//下载
export const downloadTemp = (branch, project) => {
  spinner.start();
  return new Promise((resolve, reject) => {
    download(
      `direct:https://gitee.com/chinafaker/vue-template.git#${branch}`,
      project,
      { clone: true },
      function (err) {
        if (err) {
          reject(err);
          console.log(err);
        }
        resolve();
        spinner.succeed("下载完成");
      }
    );
  });
};
```

用于生成软连接挂载到全局，便可以全局执行 vue-cli 这个命令，配置完成之后 需要执行

## 四、Markdown 转 html

我们需要用到三个库实现

- **EJS：** 一款强大的 JavaScript 模板引擎，它可以帮助我们在 HTML 中嵌入动态内容。使用 EJS，您可以轻松地将 Markdown 转换为美观的 HTML 页面。
- **Marked：** 一个流行的 Markdown 解析器和编译器，它可以将 Markdown 语法转换为 HTML 标记。Marked 是一个功能强大且易于使用的库，它为您提供了丰富的选项和扩展功能，以满足各种转换需求。
- **BrowserSync：** 一个强大的开发工具，它可以帮助您实时预览和同步您的网页更改。当您对 Markdown 文件进行编辑并将其转换为 HTML 时，BrowserSync 可以自动刷新您的浏览器，使您能够即时查看转换后的结果。

### 1.ejs 语法

#### 1.1 纯脚本标签

```js
<% alert('hello world') %> // 会执行弹框
```

#### 1.2 输出经过 HTML 转义的内容

```js
const text = '<p>你好你好</p>'
<h2><%= text %></h2> // 输出 &lt;p&gt;你好你好&lt;/p&gt; 插入 <h2> 标签中
```

#### 1.3 输出非转义的内容(原始内容)

`<%- 富文本数据 %>` 通常用于输出富文本，即 HTML 内容
上面说到`<%=`会转义 HTML 字符，那如果我们就是想输出一段 HTML 怎么办呢？
`<%-`不会解析 HTML 标签，也不会将字符转义后输出。像下例，就会直接把 `<p>我来啦</p>` 插入

```js
const content = '<p>标签</p>'
<h2><%- content %></h2>
```

- template.ejs

```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %></title>
    <link rel="stylesheet" href="./index.css">
</head>
<body>
    <%- content %>
</body>
</html>
```

```js
const ejs = require("ejs"); // 导入ejs库，用于渲染模板
const fs = require("node:fs"); // 导入fs模块，用于文件系统操作
const marked = require("marked"); // 导入marked库，用于将Markdown转换为HTML
const readme = fs.readFileSync("README.md"); // 读取README.md文件的内容
const browserSync = require("browser-sync"); // 导入browser-sync库，用于实时预览和同步浏览器
const openBrowser = () => {
  const browser = browserSync.create();
  browser.init({
    server: {
      baseDir: "./",
      index: "index.html"
    }
  });
  return browser;
};
ejs.renderFile(
  "template.ejs",
  {
    content: marked.parse(readme.toString()),
    title: "markdown to html"
  },
  (err, data) => {
    if (err) {
      console.log(err);
    }
    let writeStream = fs.createWriteStream("index.html");
    writeStream.write(data);
    writeStream.close();
    writeStream.on("finish", () => {
      openBrowser();
    });
  }
);
```

## 五、反向代理

`反向代理`（Reverse Proxy）是一种网络通信模式，它充当服务器和客户端之间的中介，将客户端的请求转发到一个或多个后端服务器，并将后端服务器的响应返回给客户端。

- **负载均衡：** 反向代理可以根据预先定义的算法将请求分发到多个后端服务器，以实现负载均衡。这样可以避免某个后端服务器过载，提高整体性能和可用性。
- **高可用性：** 通过反向代理，可以将请求转发到多个后端服务器，以提供冗余和故障转移。如果一个后端服务器出现故障，代理服务器可以将请求转发到其他可用的服务器，从而实现高可用性。
- **缓存和性能优化：** 反向代理可以缓存静态资源或经常访问的动态内容，以减轻后端服务器的负载并提高响应速度。它还可以通过压缩、合并和优化资源等技术来优化网络性能。
- **安全性：** 反向代理可以作为防火墙，保护后端服务器免受恶意请求和攻击。它可以过滤恶意请求、检测和阻止攻击，并提供安全认证和访问控制。
- **域名和路径重写：** 反向代理可以根据特定的规则重写请求的域名和路径，以实现 URL 路由和重定向。这对于系统架构的灵活性和可维护性非常有用。

```js
npm install http-proxy-middleware
```

- xm.config.js 根目录自定义配置文件

```js
module.exports = {
  server: {
    proxy: {
      //代理的路径
      "/api": {
        target: "http://localhost:3000", //转发的地址
        changeOrigin: true //是否有跨域
      }
    }
  }
};
```

- index.html

```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

</head>
<body>
    <script>
          fetch('/api').then(res=>res.text()).then(res=>{
            console.log(res);
          })
    </script>
</body>
</html>
```

- index.js 实现层

```js
const http = require("node:http");
const fs = require("node:fs");
const url = require("node:url");
const html = fs.readFileSync("./index.html"); //给html文件起个服务
const { createProxyMiddleware } = require("http-proxy-middleware");
const config = require("./xm.config.js");

const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url);
  const proxyList = Object.keys(config.server.proxy); //获取代理的路径
  if (proxyList.includes(pathname)) {
    //如果请求的路径在里面匹配到 就进行代理
    const proxy = createProxyMiddleware(config.server.proxy[pathname]); //代理
    proxy(req, res);
    return;
  }
  console.log(proxyList);
  res.writeHead(200, {
    "Content-Type": "text/html"
  });
  res.end(html); //返回html
});

server.listen(80); //监听端口
```

- test.js

```js
const http = require("node:http");
const url = require("node:url");

http
  .createServer((req, res) => {
    const { pathname } = url.parse(req.url);

    if (pathname === "/api") {
      res.end("success proxy");
    }
  })
  .listen(3000);
```

## 六、动静分离

`动静分离`是一种在 Web 服务器架构中常用的优化技术，旨在提高网站的性能和可伸缩性。它基于一个简单的原则：将动态生成的内容（如动态网页、API 请求）与静态资源（如 HTML、CSS、JavaScript、图像文件）分开处理和分发。

通过将动态内容和静态资源存储在不同的服务器或服务上，并使用不同的处理机制，可以提高网站的处理效率和响应速度。这种分离的好处包括：

- **性能优化：** 将静态资源与动态内容分离可以提高网站的加载速度。由于静态资源往往是不变的，可以使用缓存机制将其存储在 CDN（内容分发网络）或浏览器缓存中，从而减少网络请求和数据传输的开销。
- **负载均衡：** 通过将动态请求分发到不同的服务器或服务上，可以平衡服务器的负载，提高整个系统的可伸缩性和容错性。
- **安全性：** 将动态请求与静态资源分开处理可以提高系统的安全性。静态资源通常是公开可访问的，而动态请求可能涉及敏感数据或需要特定的身份验证和授权。通过将静态资源与动态内容分离，可以更好地管理访问控制和安全策略。

### 1. 实现动静分离的方法

- 使用反向代理服务器（如 Nginx、Apache）将静态请求和动态请求转发到不同的后端服务器或服务。
- 将静态资源部署到 CDN 上，通过 CDN 分发静态资源，减轻源服务器的负载。
- 使用专门的静态文件服务器（如 Amazon S3、Google Cloud Storage）存储和提供静态资源，而将动态请求交给应用服务器处理。

### 2. node 处理动静分离请求示例

```js
import http from "node:http"; // 导入http模块
import fs from "node:fs"; // 导入文件系统模块
import path from "node:path"; // 导入路径处理模块
import mime from "mime"; // 导入mime模块

const server = http.createServer((req, res) => {
  const { url, method } = req;

  // 处理静态资源
  if (method === "GET" && url.startsWith("/static")) {
    const filePath = path.join(process.cwd(), url); // 获取文件路径
    const mimeType = mime.getType(filePath); // 获取文件的MIME类型
    console.log(mimeType); // 打印MIME类型

    fs.readFile(filePath, (err, data) => {
      // 读取文件内容
      if (err) {
        res.writeHead(404, {
          "Content-Type": "text/plain" // 设置响应头为纯文本类型
        });
        res.end("not found"); // 返回404 Not Found
      } else {
        res.writeHead(200, {
          "Content-Type": mimeType, // 设置响应头为对应的MIME类型
          "Cache-Control": "public, max-age=3600" // 设置缓存控制头
        });
        res.end(data); // 返回文件内容
      }
    });
  }

  // 处理动态资源
  if ((method === "GET" || method === "POST") && url.startsWith("/api")) {
    // ...处理动态资源的逻辑
  }
});

server.listen(80); // 监听端口80
```

因为每个文件所对应的 mime 类型都不一样，如果手写的话有很多，不过强大的 nodejs 社区提供了 mime 库，可以帮我们通过后缀直接分析出 所对应的 mime 类型，然后我们通过强缓存让浏览器缓存静态资源

### 3. 常见的 mime 类型展示

```txt
-   文本文件：

    -   text/plain：纯文本文件
    -   text/html：HTML 文件
    -   text/css：CSS 样式表文件
    -   text/javascript：JavaScript 文件
    -   application/json：JSON 数据

-   图像文件：

    -   image/jpeg：JPEG 图像
    -   image/png：PNG 图像
    -   image/gif：GIF 图像
    -   image/svg+xml：SVG 图像

-   音频文件：

    -   audio/mpeg：MPEG 音频
    -   audio/wav：WAV 音频
    -   audio/midi：MIDI 音频

-   视频文件：

    -   video/mp4：MP4 视频
    -   video/mpeg：MPEG 视频
    -   video/quicktime：QuickTime 视频

-   应用程序文件：

    -   application/pdf：PDF 文件
    -   application/zip：ZIP 压缩文件
    -   application/x-www-form-urlencoded：表单提交数据
    -   multipart/form-data：多部分表单数据
```

## 七、邮件服务

邮件服务在我们工作中充当着一个重要的角色

- 任务分配与跟踪：邮件服务可以用于分配任务、指派工作和跟踪项目进展。通过邮件，可以发送任务清单、工作说明和进度更新，确保团队成员了解其责任和任务要求，并监控工作的完成情况。
- 错误报告和故障排除：当程序出现错误或异常时，程序员可以通过邮件将错误报告发送给团队成员或相关方。这样可以帮助团队了解问题的性质、复现步骤和相关环境，从而更好地进行故障排除和修复。邮件中可以提供详细的错误消息、堆栈跟踪和其他相关信息，以便其他团队成员能够更好地理解问题并提供解决方案。
- 自动化构建和持续集成：在持续集成和自动化构建过程中，邮件服务可以用于通知团队成员构建状态、单元测试结果和代码覆盖率等信息。如果构建失败或出现警告，系统可以自动发送邮件通知相关人员，以便及时采取相应措施。

### 1. 代码编写

需要下载两个库

```js
npm install js-yaml
npm install nodemailer
```

我们邮件的账号（密码| 授权码）不可能明文写到代码里面一般存放在 yaml 文件或者环境变量里面

```yaml
pass: 授权码 | 密码
user: xxxxx@qq.com 邮箱账号
```

```js
import nodemailder from "nodemailer";
import yaml from "js-yaml";
import fs from "node:fs";
import http from "node:http";
import url from "node:url";

const mailConfig = yaml.load(fs.readFileSync("./mail.yaml", "utf8"));
const transPort = nodemailder.createTransport({
  service: "qq",
  port: 587,
  host: "smtp.qq.com",
  secure: true,
  auth: {
    pass: mailConfig.pass,
    user: mailConfig.user
  }
});

http
  .createServer((req, res) => {
    const { pathname } = url.parse(req.url);
    if (req.method === "POST" && pathname == "/send/mail") {
      let mailInfo = "";
      req.on("data", chunk => {
        mailInfo += chunk.toString();
      });
      req.on("end", () => {
        const body = JSON.parse(mailInfo);
        transPort.sendMail({
          to: body.to,
          from: mailConfig.user,
          subject: body.subject,
          text: body.text
        });
        res.end("ok");
      });
    }
  })
  .listen(3000);
```

## 八、express

`express`是一个流行的 Node.js Web 应用程序框架，用于构建灵活且可扩展的 Web 应用程序和 API。它是基于 Node.js 的 HTTP 模块而创建的，简化了处理 HTTP 请求、响应和中间件的过程。

- **简洁而灵活：** Express 提供了简单而直观的 API，使得构建 Web 应用程序变得简单快捷。它提供了一组灵活的路由和中间件机制，使开发人员可以根据需求定制和组织应用程序的行为。
- **路由和中间件：** Express 使用路由和中间件来处理 HTTP 请求和响应。开发人员可以定义路由规则，将特定的 URL 路径映射到相应的处理函数。同时，中间件允许开发人员在请求到达路由处理函数之前或之后执行逻辑，例如身份验证、日志记录和错误处理。
- **路由模块化：** Express 支持将路由模块化，使得应用程序可以根据不同的功能或模块进行分组。这样可以提高代码的组织性和可维护性，使得多人协作开发更加便捷。
- **视图引擎支持：** Express 可以与各种模板引擎集成，例如 EJS、Pug（以前称为 Jade）、Handlebars 等。这使得开发人员可以方便地生成动态的 HTML 页面，并将数据动态渲染到模板中。
- **中间件生态系统：** Express 有一个庞大的中间件生态系统，开发人员可以使用各种中间件来扩展和增强应用程序的功能，例如身份验证、会话管理、日志记录、静态文件服务等。

```js
import express from "express";

const app = express(); //express 是个函数

app.use(express.json()); //如果前端使用的是post并且传递json 需要注册此中间件 不然是undefined

app.get("/", (req, res) => {
  console.log(req.query); //get 用query 获取前端传过来的参数
  res.send("get");
});

app.post("/create", (req, res) => {
  console.log(req.body); //post用body
  res.send("post");
});

//如果是动态参数用 params
app.get("/:id", (req, res) => {
  console.log(req.params);
  res.send("get id");
});

app.listen(3000, () => console.log("Listening on port 3000"));
```

### 1. 模块化

- src/user.js

```js
import express from "express";

const router = express.Router(); //路由模块

router.post("/login", (req, res) => {
  res.send("login");
});

router.post("/register", (req, res) => {
  res.send("register");
});

export default router;
```

- app.js

```js
import express from "express";
import User from "./src/user.js";

const app = express();
app.use(express.json());
app.use("/user", User);
app.get("/", (req, res) => {
  console.log(req.query);
  res.send("get");
});

app.get("/:id", (req, res) => {
  console.log(req.params);
  res.send("get id");
});

app.post("/create", (req, res) => {
  console.log(req.body);
  res.send("post");
});

app.listen(3000, () => console.log("Listening on port 3000"));
```

### 2.中间件

中间件是一个关键概念。中间件是处理 HTTP 请求和响应的函数，它位于请求和最终路由处理函数之间，可以对请求和响应进行修改、执行额外的逻辑或者执行其他任务。

中间件函数接收三个参数：req（请求对象）、res（响应对象）和 next（下一个中间件函数）。通过调用 next()方法，中间件可以将控制权传递给下一个中间件函数。如果中间件不调用 next()方法，请求将被中止，不会继续传递给下一个中间件或路由处理函数

#### 2.1 实现日志中间件

log4js 是一个用于 Node.js 应用程序的流行的日志记录库，它提供了灵活且可配置的日志记录功能。log4js 允许你在应用程序中记录不同级别的日志消息，并可以将日志消息输出到多个目标，如控制台、文件、数据库等

```js
npm install log4js
```

- express\middleware\logger.js

```js
import log4js from "log4js";

// 配置 log4js
log4js.configure({
  appenders: {
    out: {
      type: "stdout", // 输出到控制台
      layout: {
        type: "colored" // 使用带颜色的布局
      }
    },
    file: {
      type: "file", // 输出到文件
      filename: "./logs/server.log" // 指定日志文件路径和名称
    }
  },
  categories: {
    default: {
      appenders: ["out", "file"], // 使用 out 和 file 输出器
      level: "debug" // 设置日志级别为 debug
    }
  }
});

// 获取 logger
const logger = log4js.getLogger("default");

// 日志中间件
const loggerMiddleware = (req, res, next) => {
  logger.debug(`${req.method} ${req.url}`); // 记录请求方法和URL
  next();
};

export default loggerMiddleware;
```

- app.js

```js
import express from "express";
import User from "./src/user.js";
import loggerMiddleware from "./middleware/logger.js";
const app = express();
app.use(loggerMiddleware);
```

## 九、防盗链

防盗链（Hotlinking）是指在网页或其他网络资源中，通过直接链接到其他网站上的图片、视频或其他媒体文件，从而显示在自己的网页上。这种行为通常会给被链接的网站带来额外的带宽消耗和资源浪费，而且可能侵犯了原始网站的版权。

为了防止盗链，网站管理员可以采取一些措施：

- **通过 HTTP 引用检查：** 网站可以检查 HTTP 请求的来源，如果来源网址与合法的来源不匹配，就拒绝提供资源。这可以通过服务器配置文件或特定的脚本实现。
- **使用 Referrer 检查：** 网站可以检查 HTTP 请求中的 Referrer 字段，该字段指示了请求资源的来源页面。如果 Referrer 字段不符合预期，就拒绝提供资源。这种方法可以在服务器配置文件或脚本中实现。
- **使用访问控制列表（ACL）：** 网站管理员可以配置服务器的访问控制列表，只允许特定的域名或 IP 地址访问资源，其他来源的请求将被拒绝。
- **使用防盗链插件或脚本：** 一些网站平台和内容管理系统提供了专门的插件或脚本来防止盗链。这些工具可以根据需要配置，阻止来自未经授权的网站的盗链请求。
- **使用水印技术：** 在图片或视频上添加水印可以帮助识别盗链行为，并提醒用户资源的来源。

### 1. 初始化静态资源目录 express.static

```js
import express from "express";

const app = express();
//自定义前缀   初始化目录
app.use("/assets", express.static("static"));

app.listen(3000, () => {
  console.log("listening on port 3000");
});
```

### 2. 增加防盗链

防盗链一般主要就是验证`host`或者`referer`

```js
import express from "express";

const app = express();

const whitelist = ["localhost"];

// 防止热链中间件
const preventHotLinking = (req, res, next) => {
  const referer = req.get("referer"); // 获取请求头部中的 referer 字段
  if (referer) {
    const { hostname } = new URL(referer); // 从 referer 中解析主机名
    if (!whitelist.includes(hostname)) {
      // 检查主机名是否在白名单中
      res.status(403).send("Forbidden"); // 如果不在白名单中，返回 403 Forbidden
      return;
    }
  }
  next(); // 如果在白名单中，继续处理下一个中间件或路由
};

app.use(preventHotLinking); // 应用防止热链中间件
app.use("/assets", express.static("static")); // 处理静态资源请求

app.listen(3000, () => {
  console.log("Listening on port 3000"); // 启动服务器，监听端口3000
});
```

## 十、响应头和请求头

### 1. 响应头

`HTTP响应头`（HTTP response headers）是在 HTTP 响应中发送的元数据信息，用于描述响应的特性、内容和行为。它们以键值对的形式出现，每个键值对由一个标头字段（header field）和一个相应的值组成。

```txt
Access-Control-Allow-Origin:*
Cache-Control:public, max-age=0, must-revalidate
Content-Type:text/html; charset=utf-8
Server:nginx
Date:Mon, 08 Jan 2024 18:32:47 GMT
```

#### 1.1 响应头和跨域之间的关系

跨域资源共享（Cross-Origin Resource Sharing，CORS）是一种机制，用于在浏览器中实现跨域请求访问资源的权限控制。当一个网页通过 XMLHttpRequest 或 Fetch API 发起跨域请求时，浏览器会根据同源策略（Same-Origin Policy）进行限制。`同源策略`要求请求的源（`协议、域名和端口`）必须与资源的源相同，否则请求会被浏览器拒绝

- 发起一个请求

```js
fetch("http://localhost:3000/info")
  .then(res => {
    return res.json();
  })
  .then(res => {
    console.log(res);
  });
```

- express 编写一个 get 接口

```js
import express from "express";
const app = express();
app.get("/info", (req, res) => {
  res.json({
    code: 200
  });
});
app.listen(3000, () => {
  console.log("http://localhost:3000");
});
```

发现是有报错的 根据同源策略我们看到协议一样，域名一样，但是端口不一致，这时候我们就需要后端支持一下，跨域请求资源放行

```js
Access-Control-Allow-Origin: * | Origin

// 或者增加一个允许5000的端口去访问
app.use('*',(req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','http://localhost:5500') //允许localhost 5500 访问
    next()
})
```

### 2. 请求头

默认情况下 cors 仅支持`客户端`向`服务器`发送如下九个请求头
:::danger 注意
Content-Type 是没有 application-json
:::

- 1. Accept：指定客户端能够处理的内容类型。
- 2. Accept-Language：指定客户端偏好的自然语言。
- 3. Content-Language：指定请求或响应实体的自然语言。
- 4. Content-Type：指定请求或响应实体的媒体类型。
- 5. DNT (Do Not Track)：指示客户端不希望被跟踪。
- 6. Origin：指示请求的源（协议、域名和端口）。
- 7. User-Agent：包含发起请求的用户代理的信息。
- 8. Referer：指示当前请求的源 URL。
- 9. Content-type: `application/x-www-form-urlencoded` | `multipart/form-data` | `text/plain`

如果客户端需要支持额外的请求那么我们需要在客户端支持

```js
"Access-Control-Allow-Headers", "Content-Type"; //支持application/json
```

### 3. 请求方法支持

服务端默认只支持 GET POST HEAD OPTIONS 这些请求，如果我们遵循 restFul 风格，要支持 PATCH 或者其它请求呢

增加 patch

```js
app.patch("/info", (req, res) => {
  res.json({
    code: 200
  });
});
```

发送 patch

```js
fetch("http://localhost:3000/info", {
  method: "PATCH"
})
  .then(res => {
    return res.json();
  })
  .then(res => {
    console.log(res);
  });
```

如果后端不处理，就会进行报错，需要解决的话，如下处理：

```js
"Access-Control-Allow-Methods", "POST,GET,OPTIONS,DELETE,PATCH";
```

### 4. 预检请求 options

`预检请求`的主要目的是`确保跨域请求的安全性` 它需要满足一定条件才会触发

- 1. **自定义请求方法：** 当使用非简单请求方法（Simple Request Methods）时，例如 PUT、DELETE、CONNECT、OPTIONS、TRACE、PATCH 等，浏览器会发送预检请求。
- 2. **自定义请求头部字段：** 当请求包含自定义的头部字段时，浏览器会发送预检请求。自定义头部字段是指不属于简单请求头部字段列表的字段，例如 Content-Type 为 application/json、Authorization 等。
- 3. **带凭证的请求：** 当请求需要在跨域环境下发送和接收凭证（例如包含 cookies、HTTP 认证等凭证信息）时，浏览器会发送预检请求。

- 发送预检请求

```js
fetch("http://localhost:3000/info", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ name: "xmzs" })
})
  .then(res => {
    return res.json();
  })
  .then(res => {
    console.log(res);
  });
```

- express

```js
app.post("/info", (req, res) => {
  res.json({
    code: 200
  });
});
```

这样会出现报错，因为`cors`的`Content-Type`默认仅支持`application/x-www-form-urlencoded` | `multipart/form-data` | `text/plain`，并且`application-json`是不属于 cors 范畴之内，需要手动支持，如下所示：

```js
"Access-Control-Allow-Headers":"Content-Type";
```

### 5. 自定义响应头

我们在做需求的时候肯定会碰到后端自定义响应头

```js
app.get("/info", (req, res) => {
  res.set("xmzs", "1");
  res.json({
    code: 200
  });
});

// 响应头中
Xmzs: 1;
```

那么前端该如何读取自定义响应头呢？如下所示

```js
fetch("http://localhost:3000/info")
  .then(res => {
    const headers = res.headers;
    console.log(headers.get("xmzs")); //读取自定义响应头
    return res.json();
  })
  .then(res => {
    console.log(res);
  });
```

这个时候获取的结果是 null，因为后端没有抛出该响应头，所以后端需要抛出这个响应头

```js
app.get("/info", (req, res) => {
  // 设置自定义响应头
  res.set("xmzs", "1");
  // 抛出响应头
  res.setHeader("Access-Control-Expose-Headers", "xmzs");
  res.json({
    code: 200
  });
});
```

### 6.SSE 技术

`Server-Sent Events（SSE）`是一种在`客户端和服务器`之间实现`单向事件流`的机制，允许`服务器主动向客户端`发送事件数据。在 SSE 中，可以使用自定义事件（Custom Events）来发送具有特定类型的事件数据。
:::danger 注意
`webSocket` 属于`全双工通讯`，也就是前端可以给后端实时发送，后端也可以给前端实时发送，`SSE`属于`单工通讯`，后端可以给前端实时发送
:::

- express 增加该响应头`text/event-stream`就变成了 sse event 事件名称 data 发送的数据

```js
app.get("/sse", (req, res) => {
  // 响应头设置Content-Type为text/event-stream
  res.setHeader("Content-Type", "text/event-stream");
  res.status(200);
  setInterval(() => {
    res.write("event: test\n");
    res.write("data: " + new Date().getTime() + "\n\n");
  }, 1000);
});
```

- 前端接收数据

```js
const sse = new EventSource("http://localhost:3000/sse");
sse.addEventListener("test", event => {
  console.log(event.data);
});
```

### 7.new URL()解析

去 CSDN 中看`https://blog.csdn.net/weixin_58540586/article/details/144258400`
