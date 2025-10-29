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
