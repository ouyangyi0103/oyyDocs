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

## 一、node 概述

- 1. node 并不是 js 应用，也不是一个编程语言，它是一个开源、跨平台的运行时环境
- 2. node 是构建在 V8 引擎之上的，V8 引擎是由 C/C++编写的，因此我们的 JavaSCript 代码需要由 C/C++转化后再执行。
- 3. node 使用`异步 I/O 和事件驱动`的设计理念，可以高效地处理大量并发请求，提供了非阻塞式 I/O 接口和事件循环机制，使得开发人员可以编写高性能、可扩展的应用程序,异步 I/O 最终都是由 libuv 事件循环库去实现的。
- 4. node 适合干一些`IO密集型应用`，不适合 `CPU密集型应用`，node 的 IO 依靠 libuv 有很强的处理能力，而 CPU 因为 nodejs 单线程原因，容易造成 CPU 占用率高，如果非要做 CPU 密集型应用，可以使用 C++插件编写 或者 nodejs 提供的 cluster。(CPU 密集型指的是图像的处理 或者音频处理需要大量数据结构 + 算法)

## 二、npm 包管理器

npm（全称 Node Package Manager）是 Node.js 的包管理工具，它是一个基于命令行的工具，用于帮助开发者在自己的项目中安装、升级、移除和管理依赖项。

### npm 命令

```sh
npm ls -g 查看全局安装的包

npm init：初始化一个新的 npm 项目，创建 package.json 文件。
npm install <package-name>：安装指定的包。
npm install <package-name> -s：安装指定的包，并将其添加到 package.json 文件中的依赖列表中。
npm install <package-name> -D：安装指定的包，并将其添加到 package.json 文件中的开发依赖列表中。
npm install -g <package-name>：全局安装指定的包。
npm link: 将本地模块链接到全局的 node_modules 目录下

npm config list: 用于列出所有的 npm 配置信息。执行该命令可以查看当前系统和用户级别的所有 npm 配置信息，以及当前项目的配置信息（如果在项目目录下执行该命令）
npm get registry: 用于获取当前 npm 配置中的 registry 配置项的值。registry 配置项用于指定 npm 包的下载地址，如果未指定，则默认使用 npm 官方的包注册表地址
npm config set registry <registry-url>: 命令，将 registry 配置项的值修改为指定的 <registry-url> 地址
```

:::tip
package.json 中的 version 解释：
三段式版本号一般是这种 1.0.0，代表大版本号 次版本号 修订号， 大版本号一般是有重大变化才会升级， 次版本号一般是增加功能进行升级， 修订号一般是修改 bug 进行升级
:::

:::tip
npm install 安装模块的时候一般是扁平化安装的，但是有时候出现嵌套的情况是因为版本不同
A 依赖 C1.0,
B 依赖 C1.0,
D 依赖 C2.0,
此时 C 1.0 就会被放到 A B 的 node_moduels,
C2.0 会被放入 D 模块下面的 node_moduels
:::

## 三、npm install 原理

### 执行 npm install 的时候发生了什么?

:::tip
首先安装的依赖都会存放在根目录的 node_modules,默认采用扁平化的方式安装，并且进行排序，规则是.bin 第一个然后@系列，再然后按照首字母排序 abcd 等，并且使用的算法是广度优先遍历，在遍历依赖树时，npm 会首先处理项目根目录下的依赖，然后逐层处理每个依赖包的依赖，直到所有依赖都被处理完毕。在处理每个依赖时，npm 会检查该依赖的版本号是否符合依赖树中其他依赖的版本要求，如果不符合，则会尝试安装适合的版本
:::

### 执行 npm install 的后续流程

![npm](/node/npm.png)

### package-lock.json 的作用

它不仅仅可以锁定版本记录依赖树详细信息，还可以做缓存

- name 包名
- version 该参数指定了当前包的版本号
- resolved 该参数指定了当前包的下载地址
- integrity 用于验证包的完整性
- dev 该参数指定了当前包是一个开发依赖包
- bin 该参数指定了当前包中可执行文件的路径和名称
- engines 该参数指定了当前包所依赖的 Node.js 版本范围

他会通过 `name + version + integrity` 信息生成一个唯一的 key，这个 key 能找到对应的 npm cache 文件夹下的 index-v5 下的缓存记录，如果发现有缓存记录，就会找到 tar 包的 hash 值，然后将对应的二进制文件解压到 node_modules

## 四、npm run 原理

![npm](/node/ps1.png)
读取 package json 的 scripts 对应的脚本命令(dev:vite),vite 是个可执行脚本，他的查找规则是：

- 先从当前项目的 node_modules/.bin 去查找可执行命令 vite
- 如果没找到就去全局的 node_modules 去找可执行命令 vite
- 如果还没找到就去环境变量查找
- 再找不到就进行报错

如果成功找到会发现有三个文件，如下图
![npm](/node/ps2.png)

- .sh 文件是给 Linux unix Macos 使用
- .cmd 给 windows 的 cmd 使用
- .ps1 给 windows 的 powerShell 使用

### npm 生命周期

```js
"predev": "node prev.js",
"dev": "node index.js",
"postdev": "node post.js"
```

执行 npm run dev 命令的时候 predev 会自动执行，他的生命周期是在 dev 之前执行，然后执行 dev 命令，再然后执行 postdev，也就是 dev 之后执行

- 运用场景：
  例如 npm run build 可以在打包之后删除 dist 目录等等
  post 例如你编写完一个工具发布 npm，那就可以在之后写一个 ci 脚本顺便帮你推送到 git 等等

![npm](/node/ps3.png)

## 五、npx

npx 是一个命令行工具，它是`npm 5.2.0`版本中新增的功能。它允许用户在`不安装全局包`的情况下，运行已安装在本地项目中的包或者远程仓库中的包。

npx 的作用是在命令行中运行 node 包中的可执行文件，而不需要全局安装这些包。这可以使开发人员更轻松地管理包的依赖关系，并且可以避免全局污染的问题。它还可以帮助开发人员在项目中使用不同版本的包，而不会出现版本冲突的问题。

### npx 的优势

- `避免全局安装`：npx 允许你执行 npm package，而不需要你先全局安装它。
- `总是使用最新版本`：如果你没有在本地安装相应的 npm package，npx 会从 npm 的 package 仓库中下载并使用最新版。
- `执行任意npm包`：npx 不仅可以执行在 package.json 的 scripts 部分定义的命令，还可以执行任何 npm package。
- `执行GitHub gist`：npx 甚至可以执行 GitHub gist 或者其他公开的 JavaScript 文件。

### npm 和 npx 区别

- `npx` 侧重于执行命令的，执行某个模块命令。虽然会自动安装模块，但是重在执行某个命令。
- `npm` 侧重于安装或者卸载某个模块的。重在安装，并不具备执行某个模块的功能。

npx 的运行规则和 npm 是一样的 本地目录查找.bin 看有没有 如果没有就去全局的 node_moduels 查找，如果还没有就去下载这个包然后运行命令，然后删除这个包

## 六、发布 npm 包

- 1. 首先先检查一下是否是 npm 源然后创建一个 npm 账号

```sh
npm adduser
```

- 2. 创建完成之后使用 npm login 登录账号

```sh
npm login
```

- 3. 登录完成之后使用 npm publish 发布 npm 包

```sh
npm publish
```

## 七、npm 私服搭建

### 构建私服有什么好处？

- 可以离线使用，你可以将 npm 私服部署到内网集群，这样离线也可以访问私有的包。
- 提高包的安全性，使用私有的 npm 仓库可以更好的管理你的包，避免在使用公共的 npm 包的时候出现漏洞。
- 提高包的下载速度，使用私有 npm 仓库，你可以将经常使用的 npm 包缓存到本地，从而显著提高包的下载速度，减少依赖包的下载时间。这对于团队内部开发和持续集成、部署等场景非常有用

### 使用 Verdaccio 搭建

```sh
npm install verdaccio -g
```

命令步骤如下

```sh
#创建账号  # 账号 密码 邮箱
npm adduser --registry http://localhost:4873/

# 发布npm
npm publish --registry http://localhost:4873/

#指定开启端口 默认 4873
verdaccio --listen 9999

# 指定安装源
npm install --registry http://localhost:4873

# 从本地仓库删除包
npm unpublish <package-name> --registry http://localhost:4873
```
