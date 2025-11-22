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

## 一、path

:::danger 注意
path 模块在不同的操作系统是有差异的(windows | posix)
:::

`posix` 表示可移植操作系统接口，也就是定义了一套标准，遵守这套标准的操作系统有(unix,like unix,linux,macOs,windows wsl)，为什么要定义这套标准，比如在 Linux 系统启动一个进程需要调用 fork 函数,在 windows 启动一个进程需要调用 creatprocess 函数，这样就会有问题，比如我在 linux 写好了代码，需要移植到 windows 发现函数不统一，posix 标准的出现就是为了解决这个问题。

Windows 并没有完全遵循 POSIX 标准。Windows 在设计上采用了不同于 POSIX 的路径表示方法。

在 Windows 系统中，路径使用反斜杠（`\`）作为路径分隔符。这与 POSIX 系统使用的正斜杠（`/`）是不同的。这是 Windows 系统的历史原因所致，早期的 Windows 操作系统采用了不同的设计选择。

### 1.path.basename()

返回的是给定路径中的最后一部分

注意：在 posix 处理 windows 路径

```js
path.basename(`C:\temp\myfile.html`);
// 返回: 'C:\temp\myfile.html'
```

结果返回的并不对 应该返回 myfile.html，如果要在 posix 系统处理 windows 的路径需要调用对应操作系统的方法应该修改为

```js
path.win32.basename(`C:\temp\myfile.html`);
// 返回: 'myfile.html'
```

### 2.path.dirname()

```js
path.dirname("/aaaa/bbbb/cccc/index.html");
// 返回的是  /aaaa/bbbb/cccc
```

### 3.path.extname()

```js
path.dirname("/aaaa/bbbb/cccc/index.html");
// 返回的是  .html

path.dirname("/aaaa/bbbb/cccc/index.html.txt.js");
// 如果有多个 . 返回最后一个 如果没有扩展名返回空
// 返回的是  .js
```

### 4.path.join()

这个 API 主要是用来拼接路径的

```js
path.join("/foo", "/cxk", "/ikun");
// /foo/cxk/ikun

可以支持 .. ./ ../操作符
path.join('/foo','/cxk','/ikun','../')
// /foo/cxk/
```

### 5.path.resolve()

用于将`相对路径`解析并且返回`绝对路径`

- 如果传入了多个绝对路径 它将返回最右边的绝对路径

```js
const path = path.resolve("/a", "/b", "/c");
console.log(path); // /c
```

- 传入绝对路径 + 相对路径

```js
path.resolve(__dirname, "./index.js");
//  /User/xiaoman/DeskTop/node/index.js
```

- 如果只传入相对路径

```js
path.resolve("./index.js");
// 返回工作目录 + index.js
```

### 6.path.parse()

用于解析文件路径。它接受一个路径字符串作为输入，并返回一个包含路径各个组成部分的对象

```js
path.parse('/home/user/dir/file.txt')

{
  root: '/', // 路径的根目录，即 /。
  dir: '/home/user/dir', // 文件所在的目录，即 /home/user/documents。
  base: 'file.txt', // 文件名，即 file.txt。
  ext: '.txt', // 文件扩展名，即 .txt。
  name: 'file' // 文件名去除扩展名，即 file。
}
```

### 7.path.format()

把对象转回路径字符串

```js
path.format({
  root: "/",
  dir: "/home/user/documents",
  base: "file.txt",
  ext: ".txt",
  name: "file"
});
// /home/user/dir/file.txt
```

## 二、os

os 模块可以跟操作系统进行交互

### 1. os.type()

它在 Linux 上返回 'Linux'，在 macOS 上返回 'Darwin'，在 Windows 上返回 'Windows_NT'

### 2. os.plateform()

返回标识为其编译 Node.js 二进制文件的操作系统平台的字符串。 该值在编译时设置。 可能的值为 'aix'、'darwin'、'freebsd'、'linux'、'openbsd'、'sunos'、以及 'win32'

### 3. os.release()

返回操作系统的版本例如 10.xxxx win10

### 4. os.homedir()

返回用户目录 例如 c:\user\xiaoman 原理就是 windows echo %USERPROFILE% posix $HOME

### 5. os.arch()

返回 cpu 的架构 可能的值为 'arm'、'arm64'、'ia32'、'mips'、'mipsel'、'ppc'、'ppc64'、's390'、's390x'、以及 'x64'

### 6. os.cpus()

获取 CPU 的线程以及详细信息

```js
[
    {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 252020,
      nice: 0,
      sys: 30340,
      idle: 1070356870,
      irq: 0,
    },
  },
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 306960,
      nice: 0,
      sys: 26980,
      idle: 1071569080,
      irq: 0,
    },
  },
  .......
]

model: 表示CPU的型号信息，其中 "Intel(R) Core(TM) i7 CPU 860 @ 2.80GHz" 是一种具体的型号描述。
speed: 表示CPU的时钟速度，以MHz或GHz为单位。在这种情况下，速度为 2926 MHz 或 2.926 GHz。

times: 是一个包含CPU使用时间的对象，其中包含以下属性：
  user: 表示CPU被用户程序使用的时间（以毫秒为单位）。
  nice: 表示CPU被优先级较低的用户程序使用的时间（以毫秒为单位）。
  sys: 表示CPU被系统内核使用的时间（以毫秒为单位）。
  idle: 表示CPU处于空闲状态的时间（以毫秒为单位）。
  irq: 表示CPU被硬件中断处理程序使用的时间（以毫秒为单位）。
```

### 7. os.networkInterfaces()

获取网络信息

```js
{
  lo: [
    {
      address: "127.0.0.1",
      netmask: "255.0.0.0",
      family: "IPv4",
      mac: "00:00:00:00:00:00",
      internal: true,
      cidr: "127.0.0.1/8"
    }
  ];
}

address: 表示本地回环接口的IP地址，这里是 '127.0.0.1'。
netmask: 表示本地回环接口的子网掩码，这里是 '255.0.0.0'。
family: 表示地址族（address family），这里是 'IPv4'，表示IPv4地址。
mac: 表示本地回环接口的MAC地址，这里是 '00:00:00:00:00:00'。请注意，本地回环接口通常不涉及硬件，因此MAC地址通常为全零。
internal: 表示本地回环接口是否是内部接口，这里是 true，表示它是一个内部接口。
cidr: 表示本地回环接口的CIDR表示法，即网络地址和子网掩码的组合，这里是 '127.0.0.1/8'，表示整个 127.0.0.0 网络
```

### 8.案例

```js
const { exec } = require("child_process");
const os = require("os");

function openBrowser(url) {
  if (os.platform() === "darwin") {
    // macOS
    exec(`open ${url}`); //执行shell脚本
  } else if (os.platform() === "win32") {
    // Windows
    exec(`start ${url}`); //执行shell脚本
  } else {
    // Linux, Unix-like
    exec(`xdg-open ${url}`); //执行shell脚本
  }
}

// Example usage
openBrowser("https://www.juejin.cn");
```

## 三、process

`process` 是 Nodejs 操作当前进程和控制当前进程的 API，并且是挂载到 globalThis 下面的全局 API

### 1. process.arch()

返回操作系统 CPU 架构 跟我们之前讲的 os.arch 一样 'arm'、'arm64'、'ia32'、'mips'、'mipsel'、'ppc'、'ppc64'、's390'、's390x'、以及 'x64'

### 2. process.cwd()

返回当前的工作目录 例如在 F:\project\node> `执行的脚本`就返回这个目录 也可以和 path 拼接代替\_\_dirname 使用

### 3. process.argv()

返回是一个数组，获取执行进程后面的参数

```js
比如在终端中输入 node index.js --open --a

[
  'F:\\Nodejs\\node.exe',
  'F:\\Nodejs\\node\\index.js'
  '--open',
  '--a'
]
```

### 4. process.memoryUsage()

用于获取当前进程的内存使用情况。该方法返回一个对象，其中包含了各种内存使用指标，如 rss（Resident Set Size，常驻集大小）、heapTotal（堆区总大小）、heapUsed（已用堆大小）和 external（外部内存使用量）等

```js
{
    rss: 30932992, // 常驻集大小 这是进程当前占用的物理内存量，不包括共享内存和页面缓存。它反映了进程实际占用的物理内存大小
    heapTotal: 6438912, //堆区总大小 这是 V8 引擎为 JavaScript 对象分配的内存量。它包括了已用和未用的堆内存
    heapUsed: 5678624,  //已用堆大小
    external: 423221, //外部内存使用量 这部分内存不是由 Node.js 进程直接分配的，而是由其他 C/C++ 对象或系统分配的
    arrayBuffers: 17606 //是用于处理二进制数据的对象类型，它使用了 JavaScript 中的 ArrayBuffer 接口。这个属性显示了当前进程中 ArrayBuffers 的数量
}
```

### 5. process.exit()

强制退出进程

### 6. process.kill()

与 exit 类似，kill 用来杀死一个进程，接受一个参数进程 id 可以通过 process.pid 获取

```js
process.kill(process.pid);
```

### 7. process.env()

用于读取操作系统所有的环境变量，也可以修改和查询环境变量。

:::tip 注意
修改 注意修改并不会真正影响操作系统的变量，而是只在当前线程生效，线程结束便释放。
:::

#### 区分开发环境和生产环境

```js
npm install cross-env
```

cross-env 是 跨平台设置和使用环境变量 不论是在 Windows 系统还是 POSIX 系统。同时，它提供了一个设置环境变量的脚本，使得您可以在脚本中以 unix 方式设置环境变量，然后在 Windows 上也能兼容运行

- package.json 文件中

```js
"script":{
  "dev": "cross-env NODE_ENV=dev node index.js",
  "build": "cross-env NODE_ENV=pro node index.js"
}
```

他的原理就是如果是 windows 就调用 SET 如果是 posix 就调用 export 设置环境变量

```js
set NODE_ENV=production  #windows
export NODE_ENV=production #posix
```

## 四、child_process

Nodejs 创建子进程共有 7 个 API， Sync 同步 API， 不加是异步 API

### 1. exec

```js
child_process.exec(command, [options], callback);

// 获取nodejs 版本号
exec("node -v", (err, stdout, stderr) => {
  if (err) {
    return err;
  }
  console.log(stdout.toString());
});
```

```js
cwd <string> 子进程的当前工作目录。
env <Object> 环境变量键值对。
encoding <string> 默认为 'utf8'。
shell <string> 用于执行命令的 shell。 在 UNIX 上默认为 '/bin/sh'，在 Windows 上默认为 process.env.ComSpec。 详见 Shell Requirements 与 Default Windows Shell。
timeout <number> 默认为 0。
maxBuffer <number> stdout 或 stderr 允许的最大字节数。 默认为 200*1024。 如果超过限制，则子进程会被终止。 查看警告： maxBuffer and Unicode。
killSignal <string> | <integer> 默认为 'SIGTERM'。
uid <number> 设置该进程的用户标识。
gid <number> 设置该进程的组标识。
```

### 2. execSync

获取 node 版本号 如果要执行单次 shell 命令 execSync 方便一些 options 同上

```js
const nodeVersion = execSync("node -v");
console.log(nodeVersion.toString("utf-8"));

// 打开谷歌浏览器
execSync("start chrome http://www.baidu.com --incognito");
```

### 3. execFile

execFile 适合执行可执行文件，例如执行一个 node 脚本，或者 shell 文件，windows 可以编写 cmd 脚本，posix 可以编写 sh 脚本

- bat.cmd 文件

```js
echo '开始'

mkdir test

cd ./test

echo console.log("test1232131") >test.js

echo '结束'

node test.js
```

- 使用 execFile 执行 bat.cmd 文件

```js
execFile(path.resolve(process.cwd(), "./bat.cmd"), null, (err, stdout) => {
  console.log(stdout.toString());
});
```

### 4. spawn

- spawn 用于执行一些`实时`获取的信息，因为 spawn 返回的是流，边执行边返回
- exec 是返回一个完整的 buffer，buffer 的大小是 200k，如果超出会报错，而 spawn 是无上限的。
- spawn 在执行完成后会抛出 close 事件监听，并返回状态码，通过状态码可以知道子进程是否顺利执行。
- exec 只能通过返回的 buffer 去识别完成状态，识别起来较为麻烦

```js
const { stdout } = spawn("netstat", ["-an"], {});

//返回的数据用data事件接受
stdout.on("data", steram => {
  console.log(steram.toString());
});
stdout.on("close", steram => {
  console.log("结束了");
});
```

### 5. fork

适合大量的计算，或者容易阻塞主进程操作的一些代码，可以将一些复杂的逻辑写进子进程里面去，这样就不会阻塞主进程的代码

- index.js

```js
const { fork } = require("child_process");

const testProcess = fork("./test.js");

testProcess.send("我是主进程");

testProcess.on("message", data => {
  console.log("我是主进程接受消息111：", data);
});
```

- test.js

```js
process.on("message", data => {
  console.log("子进程接受消息：", data);
});

process.send("我是子进程");
```

fork 底层使用的是 IPC 通道进行通讯的，
![npm](/node/process.png)

## 五、events

Node.js 核心 API 都是采用异步事件驱动架构，简单来说就是通过有效的方法来监听事件状态的变化，并在变化的时候做出相应的动作。并且事件模型采用了`发布订阅设计模式`

```js
const EventEmitter = require("events");

const event = new EventEmitter();
//监听test
event.on("test", data => {
  console.log(data);
});

event.emit("test", "xmxmxmxmx"); //派发事件
```

监听消息数量默认是 10 个，如何解除限制 调用 setMaxListeners 传入数量

```js
event.setMaxListeners(20);
```

只想监听一次 once 即使 emit 派发多次也只触发一次 once

```js
const EventEmitter = require("events");

const event = new EventEmitter();
event.setMaxListeners(20);
event.once("test", data => {
  console.log(data);
});

event.emit("test", "xmxmxmxmx1");
event.emit("test", "xmxmxmxmx2");
```

如何取消侦听 off

```js
const EventEmitter = require("events");

const event = new EventEmitter();

const fn = msg => {
  console.log(msg);
};
event.on("test", fn);
event.off("test", fn);

event.emit("test", "xmxmxmxmx1");
event.emit("test", "xmxmxmxmx2");
```

## 六、util

util 是 Node.js 内部提供的很多实用或者工具类型的 API，方便我们快速开发。

之前讲过 Node.js 大部分 API 都是遵循 回调函数的模式去编写的。

```js
import { exec } from "node:child_process";
exec("node -v", (err, stdout) => {
  if (err) {
    return err;
  }
  console.log(stdout);
});
```

### 1. util.promisify

我们使用 util 的 promisify 改为 promise 风格 Promiseify 接受 original 一个函数体

```js
import { exec } from "node:child_process";
import util from "node:util";

const execPromise = util.promisify(exec);

execPromise("node -v")
  .then(res => {
    console.log(res, "res");
  })
  .catch(err => {
    console.log(err, "err");
  });
```

promisify 源码

```js
const promiseify = original => {
  return (...args) => {
    return new Promise((resolve, reject) => {
      original(...args, (err, ...values) => {
        if (err) {
          return reject(err);
        }
        if (values && values.length > 1) {
          let obj = {};
          console.log(values);
          for (let key in values) {
            obj[key] = values[key];
          }
          resolve(obj);
        } else {
          resolve(values[0]);
        }
      });
    });
  };
};
```

这样可以大致实现但是拿不到 values 的 key 因为 nodejs 内部 没有对我们开放 这个 Symbol kCustomPromisifyArgsSymbol

### 2. util.callbackify

这个 API 正好是 反过来的，将 promise 类型的 API 变成 回调函数。

```js
import util from "node:util";

const fn = type => {
  if (type == 1) {
    return Promise.resolve("test");
  }
  return Promise.reject("error");
};

const callback = util.callbackify(fn);

callback(1222, (err, val) => {
  console.log(err, val);
});
```

callbackify 源码

```js
const callbackify = fn => {
  return (...args) => {
    let callback = args.pop();
    fn(...args)
      .then(res => {
        callback(null, res);
      })
      .catch(err => {
        callback(err);
      });
  };
};
```

## 七、fs

在 Node.js 中，`fs` 模块是文件系统模块（File System module）的缩写，它提供了与文件系统进行交互的各种功能。通过 `fs` 模块，你可以执行诸如读取文件、写入文件、更改文件权限、创建目录等操作，`Node.js 核心 API 之一`。

### 1.fs 的多种策略

```js
import fs from "node:fs";
import fs2 from "node:fs/promises";
//读取文件
fs2.readFile("./index.txt").then(result => {
  console.log(result.toString());
});

fs.readFile("./index.txt", (err, data) => {
  if (err) {
    return err;
  }
  console.log(data.toString());
});

let txt = fs.readFileSync("./index.txt");
console.log(txt.toString());
```

### 2.常用 API 介绍

```js
import fs2 from "node:fs/promises";

fs2
  .readFile("./index.txt", {
    encoding: "utf8",
    flag: ""
  })
  .then(result => {
    console.log(result.toString());
  });
```

读取文件 readFile 第一个参数 读取的路径， 第二个参数是个配置项
encoding 支持各种编码 utf-8 之类的
flag 就很多了

- 'a': 打开文件进行追加。 如果文件不存在，则创建该文件。

- 'ax': 类似于  'a'  但如果路径存在则失败。

- 'a+': 打开文件进行读取和追加。 如果文件不存在，则创建该文件。

- 'ax+': 类似于  'a+'  但如果路径存在则失败。

- 'as': 以同步模式打开文件进行追加。 如果文件不存在，则创建该文件。

- 'as+': 以同步模式打开文件进行读取和追加。 如果文件不存在，则创建该文件。

- 'r': 打开文件进行读取。 如果文件不存在，则会发生异常。

- 'r+': 打开文件进行读写。 如果文件不存在，则会发生异常。

- 'rs+': 以同步模式打开文件进行读写。 指示操作系统绕过本地文件系统缓存。
  这主要用于在 NFS 挂载上打开文件，因为它允许跳过可能过时的本地缓存。 它对 I/O 性能有非常实际的影响，因此除非需要，否则不建议使用此标志。
  这不会将  fs.open()  或  fsPromises.open()  变成同步阻塞调用。 如果需要同步操作，应该使用类似  fs.openSync()  的东西。

- 'w': 打开文件进行写入。 创建（如果它不存在）或截断（如果它存在）该文件。

- 'wx': 类似于  'w'  但如果路径存在则失败。

- 'w+': 打开文件进行读写。 创建（如果它不存在）或截断（如果它存在）该文件。

- 'wx+': 类似于  'w+'  但如果路径存在则失败。

### 3.可读流

使用场景适合读取`大文件`

```js
const readStream = fs.createReadStream("./index.txt", {
  encoding: "utf8"
});

readStream.on("data", chunk => {
  console.log(chunk);
});

readStream.on("end", () => {
  console.log("close");
});
```

### 4.创建、删除、重命名文件夹

创建文件夹 如果开启 recursive 可以递归创建多个文件夹

```js
fs.mkdir("path/test/ccc", { recursive: true }, err => {});
```

删除文件夹 如果开启 recursive 递归删除全部文件夹

```js
fs.rm("path", { recursive: true }, err => {});
```

重命名文件 第一个参数原始名称 第二个参数新的名称

```js
fs.renameSync("./test.txt", "./test2.txt");
```

### 5. 监听文件变化

监听文件的变化 返回监听的事件如 change,和监听的内容 filename

```js
fs.watch("./test2.txt", (event, filename) => {
  console.log(event, filename);
});
```

### 6. 注意事项

```js
const fs = require("node:fs");

fs.readFile(
  "./index.txt",
  {
    encoding: "utf-8",
    flag: "r"
  },
  (err, dataStr) => {
    if (err) throw err;
    console.log("fs");
  }
);

setImmediate(() => {
  console.log("setImmediate");
});
```

为什么先走 setImmediate 呢，而不是 fs?

因为 Node.js 读取文件的时候是使用 `libuv` 进行调度的，而 `setImmediate 是由 V8` 进行调度的，文件读取完成后 `libuv 才会将 fs 的结果 推入 V8 的队列`

### 7.写入内容

```js
const fs = require("node:fs");

fs.writeFileSync("index.txt", "javascript+++++");
```

第一个参数写入的文件，第二个参数写入的内容，第三个是 options 可选项 encoding 编码 mode 权限 flag 的参数与 readFile 中的一样

### 8.追加内容

- 第一种方式 设置 flag 为 a 也可以追内容

```js
fs.writeFileSync("index.txt", "\nvue之父\n鱿鱼须", {
  flag: "a"
});
```

- 第二种方式 使用 appendFileSync

```js
const fs = require("node:fs");

fs.appendFileSync("index.txt", "\n unshift创始人\n麒麟哥");
```

### 9.可写流

我们可以创建一个可写流 打开一个通道，可以一直写入数据，用于处理大量的数据写入，写入完成之后调用 end 关闭可写流，监听 finish 事件 写入完成

```js
const fs = require("node:fs");

let verse = ["待到秋来九月八", "我花开后百花杀", "冲天香阵透长安", "满城尽带黄金甲"];

let writeStream = fs.createWriteStream("index.txt");

verse.forEach(item => {
  writeStream.write(item + "\n");
});

writeStream.end();

writeStream.on("finish", () => {
  console.log("写入完成");
});
```

### 10. 硬链接 和 软连接

```js
fs.linkSync("./index.txt", "./index2.txt"); //硬链接

fs.symlinkSync("./index.txt", "./index3.txt", "file"); //软连接
```

`硬链接`的作用和用途如下：

- 文件共享：硬链接允许多个文件名指向同一个文件，这样可以在不同的位置使用不同的文件名引用相同的内容。这样的共享文件可以节省存储空间，并且在多个位置对文件的修改会反映在所有引用文件上。
- 文件备份：通过创建硬链接，可以在不复制文件的情况下创建文件的备份。如果原始文件发生更改，备份文件也会自动更新。这样可以节省磁盘空间，并确保备份文件与原始文件保持同步。
- 文件重命名：通过创建硬链接，可以为文件创建一个新的文件名，而无需复制或移动文件。这对于需要更改文件名但保持相同内容和属性的场景非常有用。

`软链接`的一些特点和用途如下：

- 软链接可以创建指向文件或目录的引用。这使得你可以在不复制或移动文件的情况下引用它们，并在不同位置使用不同的文件名访问相同的内容。
- 软链接可以用于创建快捷方式或别名，使得你可以通过一个简短或易记的路径来访问复杂或深层次的目录结构。
- 软链接可以用于解决文件或目录的位置变化问题。如果目标文件或目录被移动或重命名，只需更新软链接的目标路径即可，而不需要修改引用该文件或目录的其他代码。

## 八、crypto

`crypto` 模块的目的是为了提供通用的`加密和哈希算法`。用纯 JavaScript 代码实现这些功能不是不可能，但速度会非常慢。nodejs 用 C/C++实现这些算法后，通过 crypto 这个模块暴露为 JavaScript 接口，这样用起来方便，运行速度也快。

### 1.对称加密

`对称加密`是一种`简单而快速`的加密方式，它使用`相同的密钥`（称为对称密钥）来进行加密和解密。这意味着发送者和接收者在加密和解密过程中都使用相同的密钥。对称加密算法的加密速度很快，适合对大量数据进行加密和解密操作。然而，对称密钥的安全性是一个挑战，因为需要确保发送者和接收者都安全地共享密钥，否则有风险被未授权的人获取密钥并解密数据。

```js
const crypto = require("node:crypto");

// 生成一个随机的 16 字节的初始化向量 (IV)
const iv = Buffer.from(crypto.randomBytes(16));

// 生成一个随机的 32 字节的密钥
const key = crypto.randomBytes(32);

// 创建加密实例，使用 AES-256-CBC 算法，提供密钥和初始化向量
const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

// 对输入数据进行加密，并输出加密结果的十六进制表示
cipher.update("小满zs", "utf-8", "hex");
const result = cipher.final("hex");

// 解密
const de = crypto.createDecipheriv("aes-256-cbc", key, iv);
de.update(result, "hex");
const decrypted = de.final("utf-8");

console.log("Decrypted:", decrypted);
```

### 2.非对称加密

`非对称加密`使用一对密钥，分别是`公钥`和`私钥`。发送者使用接收者的`公钥进行加密`，而接收者使用自己的`私钥进行解密`。公钥可以自由分享给任何人，而私钥必须保密。非对称加密算法提供了更高的安全性，因为即使公钥泄露，只有持有私钥的接收者才能解密数据。然而，非对称加密算法的加密速度相对较慢，不适合加密大量数据。因此，在实际应用中，通常使用非对称加密来交换对称密钥，然后使用对称加密算法来加密实际的数据。

```js
const crypto = require("node:crypto");
// 生成 RSA 密钥对
const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048 // 加密长度
});

// 要加密的数据
const text = "小满zs";

// 使用公钥进行加密
const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(text, "utf-8"));

// 使用私钥进行解密
const decrypted = crypto.privateDecrypt(privateKey, encrypted);

console.log(decrypted.toString());
```

### 3.哈希函数

哈希函数具有以下特点：

- **固定长度输出：** 不论输入数据的大小，哈希函数的输出长度是固定的。例如，常见的哈希函数如 `MD5` 和 `SHA-256` 生成的哈希值长度分别为 128 位和 256 位。
- **不可逆性：** 哈希函数是单向的，意味着从哈希值推导出原始输入数据是非常困难的，几乎不可能。即使输入数据发生微小的变化，其哈希值也会完全不同。
- **唯一性：** 哈希函数应该具有较低的碰撞概率，即不同的输入数据生成相同的哈希值的可能性应该非常小。这有助于确保哈希值能够唯一地标识输入数据。

```js
const crypto = require("node:crypto");

// 要计算哈希的数据
let text = "123456";

// 创建哈希对象，并使用 MD5 算法
const hash = crypto.createHash("md5");

// 更新哈希对象的数据
hash.update(text);

// 计算哈希值，并以十六进制字符串形式输出
const hashValue = hash.digest("hex");

console.log("Text:", text);
console.log("Hash:", hashValue); // e10adc3949ba59abbe56e057f20f883e
```

#### 3.1 使用场景

- 1. 我们可以避免密码明文传输 使用 md5 加密或者 sha256
- 2. 验证文件完整性，读取文件内容生成 md5 如果前端上传的 md5 和后端的读取文件内部的 md5 匹配说明文件是完整的

## 九、zlib

在 Node.js 中，`zlib` 模块提供了对`数据压缩`和`解压缩`的功能，以便在应用程序中减少数据的传输大小和提高性能。该模块支持多种压缩算法，包括 `Deflate`、`Gzip` 和 `Raw Deflate`。

zlib  模块的主要作用如下：

- **数据压缩：** zlib  模块可以将数据以无损压缩算法（如 Deflate、Gzip）进行压缩，减少数据的大小。这在网络传输和磁盘存储中特别有用，可以节省带宽和存储空间。
- **数据解压缩：** zlib  模块还提供了对压缩数据的解压缩功能，可以还原压缩前的原始数据。
- **流压缩：** zlib 模块支持使用流（Stream）的方式进行数据的压缩和解压缩。这种方式使得可以对大型文件或网络数据流进行逐步处理，而不需要将整个数据加载到内存中。
- **压缩格式支持：** zlib  模块支持多种常见的压缩格式，如 Gzip 和 Deflate。这些格式在各种应用场景中广泛使用，例如 HTTP 响应的内容编码、文件压缩和解压缩等。

- gzip 压缩

```js
// 引入所需的模块
const zlib = require("zlib"); // zlib 模块提供数据压缩和解压缩功能
const fs = require("node:fs"); // 引入 Node.js 的 fs 模块用于文件操作

// 创建可读流和可写流
const readStream = fs.createReadStream("index.txt"); // 创建可读流，读取名为 index.txt 的文件
const writeStream = fs.createWriteStream("index.txt.gz"); // 创建可写流，将压缩后的数据写入 index.txt.gz 文件

// 使用管道将可读流中的数据通过 Gzip 压缩，再通过管道传输到可写流中进行写入
readStream.pipe(zlib.createGzip()).pipe(writeStream);
```

- gzip 解压

```js
const readStream = fs.createReadStream("index.txt.gz");
const writeStream = fs.createWriteStream("index2.txt");
readStream.pipe(zlib.createGunzip()).pipe(writeStream);
```

- deflate 压缩

```js
const readStream = fs.createReadStream("index.txt"); // 创建可读流，读取名为 index.txt 的文件
const writeStream = fs.createWriteStream("index.txt.deflate"); // 创建可写流，将压缩后的数据写入 index.txt.deflate 文件
readStream.pipe(zlib.createDeflate()).pipe(writeStream);
```

- deflate 解压

```js
const readStream = fs.createReadStream("index.txt.deflate");
const writeStream = fs.createWriteStream("index3.txt");
readStream.pipe(zlib.createInflate()).pipe(writeStream);
```

### 1. gzip 和 deflate 区别

- **压缩算法：** Gzip 使用的是 LZ77 算法和哈夫曼编码。LZ77 算法用于数据的重复字符串的替换和引用，而哈夫曼编码用于进一步压缩数据。
- **压缩效率：** Gzip 压缩通常具有更高的压缩率，因为它使用了哈夫曼编码来进一步压缩数据。哈夫曼编码根据字符的出现频率，将较常见的字符用较短的编码表示，从而减小数据的大小。
- **压缩速度：** 相比于仅使用 Deflate 的方式，Gzip 压缩需要更多的计算和处理时间，因为它还要进行哈夫曼编码的步骤。因此，在压缩速度方面，Deflate 可能比 Gzip 更快。
- **应用场景：** Gzip 压缩常用于文件压缩， Deflate 用于网络传输和 HTTP 响应的内容编码。它广泛应用于 Web 服务器和浏览器之间的数据传输，以减小文件大小和提高网络传输效率。

### 2. http 请求压缩

- deflate 压缩 压缩前 8.2kb 压缩后 236b

```js
const zlib = require("zlib");
const http = require("node:http");
const server = http.createServer((req, res) => {
  const txt = "小满zs".repeat(1000);

  res.setHeader("Content-Encoding", "deflate");
  res.setHeader("Content-type", "text/plan;charset=utf-8");

  const result = zlib.deflateSync(txt);
  res.end(result);
});

server.listen(3000);
```

- gzip 压缩 压缩前 8.2kb 压缩后 245b

```js
const zlib = require("zlib");
const http = require("node:http");
const server = http.createServer((req, res) => {
  const txt = "小满zs".repeat(1000);

  res.setHeader("Content-Encoding", "gzip");
  res.setHeader("Content-type", "text/plan;charset=utf-8");

  const result = zlib.gzipSync(txt);
  res.end(result);
});

server.listen(3000);
```

## 十、http

### 1. 创建 http 服务器

```js
const http = require("node:http");
const url = require("node:url");

http
  .createServer((req, res) => {})
  .listen(98, () => {
    console.log("server is running on port 98");
  });
```

我们前端发起请求 常用的就是 GET POST，那 nodejs 如何分清 GET 和 POST 呢?

```js
http
  .createServer((req, res) => {
    //通过method 就可以了
    if (req.method === "POST") {
    } else if (req.method === "GET") {
    }
  })
  .listen(98, () => {
    console.log("server is running on port 98");
  });
```

```js
const http = require("node:http"); // 引入 http 模块
const url = require("node:url"); // 引入 url 模块

// 创建 HTTP 服务器，并传入回调函数用于处理请求和生成响应
http
  .createServer((req, res) => {
    const { pathname, query } = url.parse(req.url, true); // 解析请求的 URL，获取路径和查询参数

    if (req.method === "POST") {
      // 检查请求方法是否为 POST
      if (pathname === "/post") {
        // 检查路径是否为 '/post'
        let data = "";
        req.on("data", chunk => {
          data += chunk; // 获取 POST 请求的数据
          console.log(data);
        });
        req.on("end", () => {
          res.setHeader("Content-Type", "application/json"); // 设置响应头的 Content-Type 为 'application/json'
          res.statusCode = 200; // 设置响应状态码为 200
          res.end(data); // 将获取到的数据作为响应体返回
        });
      } else {
        res.setHeader("Content-Type", "application/json"); // 设置响应头的 Content-Type 为 'application/json'
        res.statusCode = 404; // 设置响应状态码为 404
        res.end("Not Found"); // 返回 'Not Found' 作为响应体
      }
    } else if (req.method === "GET") {
      // 检查请求方法是否为 GET
      if (pathname === "/get") {
        // 检查路径是否为 '/get'
        console.log(query.a); // 打印查询参数中的键名为 'a' 的值
        res.end("get success"); // 返回 'get success' 作为响应体
      }
    }
  })
  .listen(98, () => {
    console.log("server is running on port 98"); // 打印服务器启动的信息
  });
```

## 十一、net

net 模块是 Node.js 的核心模块之一，它提供了用于创建基于网络的应用程序的 API。net 模块主要用于创建 TCP 服务器和 TCP 客户端，以及处理网络通信。
![npm](/node/net.png)

TCP（Transmission Control Protocol）是一种面向连接的、可靠的传输协议，用于在计算机网络上进行数据传输。它是互联网协议套件（TCP/IP）的一部分，是应用层和网络层之间的传输层协议。

TCP 的主要特点包括：

- **可靠性：**TCP 通过使用确认机制、序列号和重传策略来确保数据的可靠传输。它可以检测并纠正数据丢失、重复、损坏或失序的问题。
- **面向连接：**在进行数据传输之前，TCP 需要在发送方和接收方之间建立一个连接。连接的建立是通过三次握手来完成的，确保双方都准备好进行通信。
- **全双工通信：**TCP 支持双方同时进行双向通信，即发送方和接收方可以在同一时间发送和接收数据。
- **流式传输：**TCP 将数据视为连续的字节流进行传输，而不是离散的数据包。发送方将数据划分为较小的数据块，但 TCP 在传输过程中将其作为连续的字节流处理。
- **拥塞控制：**TCP 具备拥塞控制机制，用于避免网络拥塞和数据丢失。它通过动态调整发送速率、使用拥塞窗口和慢启动算法等方式来控制数据的发送速度。

### 1. 场景

#### 1.1 服务端之间的通讯

服务端之间的通讯可以直接使用 TCP 通讯，而不需要上升到 http 层

- server.js
  创建一个 TCP 服务，监听端口号 3000

```js
import net from "net";

const server = net.createServer(socket => {
  setInterval(() => {
    socket.write("XiaoMan");
  }, 1000);
});
server.listen(3000, () => {
  console.log("listening on 3000");
});
```

- client.js
  连接 server 端，并且监听返回的数据

```js
import net from "net";

const client = net.createConnection({
  host: "127.0.0.1",
  port: 3000
});

client.on("data", data => {
  console.log(data.toString());
});
```

#### 1.2 从传输层实现 http 协议

创建一个 TCP 服务

```js
import net from "net";

const http = net.createServer(socket => {
  socket.on("data", data => {
    console.log(data.toString());
  });
});
http.listen(3000, () => {
  console.log("listening on 3000");
});
```

通过 node http.js 启动之后我们使用浏览器访问一下,可以看到浏览器发送了一个 http get 请求 我们可以通过关键字 get 返回相关的内容例如 html

```js
import net from "net";

const html = `<h1>TCP Server</h1>`;

const reposneHeader = [
  "HTTP/1.1 200 OK",
  "Content-Type: text/html",
  "Content-Length: " + html.length,
  "Server: Nodejs",
  "\r\n",
  html
];

const http = net.createServer(socket => {
  socket.on("data", data => {
    if (/GET/.test(data.toString())) {
      socket.write(reposneHeader.join("\r\n"));
      socket.end();
    }
  });
});
http.listen(3000, () => {
  console.log("listening on 3000");
});
```
