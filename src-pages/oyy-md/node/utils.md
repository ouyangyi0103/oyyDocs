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
