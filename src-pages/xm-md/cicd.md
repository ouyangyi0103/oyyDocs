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

## 一、ssh

ssh 的全称是 `Secure Shell`，中文名为`安全外壳协议`，是一种在不安全的网络环境中，为网络服务提供安全远程登录和其他安全网络服务的协议。
简单来说，它的核心作用是加密你和远程服务器之间的通信数据，防止数据被窃听、篡改或伪造，替代了早期不安全的远程登录协议

### 1.ssh 的核心特点

#### 1.1 数据加密

ssh 会对传输的所有数据进行加密处理，包括登录时的用户名、密码，以及后续的命令和返回结果，极大提升了远程操作的安全性。

#### 1.2 身份验证

- 密码验证：输入远程服务器的用户名和密码，验证通过后登录。
- 密钥验证：生成一对公钥和私钥，将公钥存放在服务器，登录时用私钥匹配验证，无需输入密码，安全性更高。

#### 1.3 多功能性

- 远程执行命令：无需登录服务器，直接在本地执行远程服务器的命令。
- 文件传输：通过 scp 或 sftp 工具，安全地在本地和远程服务器之间传输文件。
- 端口转发：也叫 SSH 隧道，可将不安全的网络服务（如 HTTP）通过 SSH 加密通道传输，提升安全性。

#### 1.4 ssh 的使用场景

- 程序员或运维人员远程管理 Linux/UNIX 服务器。
- 开发者通过 SSH 连接代码仓库（如 GitLab、GitHub）进行代码的拉取和推送。
- 在本地和云服务器之间安全传输文件。

### 2.ssh 的基本使用命令

在终端中，使用 ssh 登录远程服务器的基本命令格式为：

```sh
ssh [用户名]@[服务器IP或域名]
```

断开服务连接

```sh
logout || exit
```

指定端口登录
ssh `默认端口是 22`，如果服务器修改了端口，需要用 `-p`选项指定：

```sh
# 登录端口为 2222 的服务器
ssh -p 2222 user@192.168.1.100
```

## 二、linux 命令

### 1.包管理器 yum

比如 npm 是 node.js 的包管理器，yum 是 linux 的包管理器

```sh
yum install git
yum install nginx
yum install nodejs
yum install npm
```

### 2.pwd

显示当前工作目录的绝对路径

```sh
pwd
# /docsProject
```

### 3.ls

列出目录内容

```sh
ls          # 列出当前目录文件
ls -l       # 详细格式（权限、大小、时间）
ls -a       # 显示隐藏文件（以 . 开头）
ls -lh      # 人性化显示文件大小（K/M/G）
ls /home    # 列出指定目录内容
```

### 4.cd

切换工作目录

```sh
cd /home/user   # 切换到指定绝对路径
cd ..           # 回到上级目录
cd ~            # 回到当前用户家目录
cd -            # 回到上一次所在目录
```

### 5.mkdir

创建目录

```sh
mkdir test          # 创建单个目录
mkdir -p a/b/c      # 递归创建多级目录
```

### 6.rm

删除文件 / 目录（慎用，删除后难恢复）

```sh
rm file.txt         # 删除文件
rm -r dir           # 递归删除目录及内容
rm -f file.txt      # 强制删除，不提示
rm -rf dir          # 强制递归删除目录（高危！）
```

### 7.cat

查看文件内容（适合小文件）

```sh
cat file.txt
cat -n file.txt     # 显示行号
```

### 8.vim / vi（功能强大，适合熟练用户）

vi 是 Linux 内置编辑器，vim 是 vi 的增强版，两者用法基本一致，有两种模式：

- **命令模式：** 打开文件默认进入，用于复制、删除、跳转等操作。
- **编辑模式：** 按 `i（插入）`、`a（追加）`进入，才能修改内容。

#### 8.1 打开文件

```sh
vim 文件名
# 示例：编辑 test.txt
vim test.txt
```

#### 8.2 核心操作步骤

- 输入 i 进入编辑模式，开始修改内容。
- 修改完成后，按 Esc 回到命令模式。
- 保存退出：输入 :wq （w= 保存，q= 退出）；放弃修改退出：输入 :q!。

### 9.cp

复制文件 / 目录

```sh
cp file.txt /tmp    # 复制文件到指定目录
cp -r dir /tmp      # 递归复制目录
```

### 10.mv

移动 / 重命名文件 / 目录

```sh
mv old.txt new.txt  # 重命名文件
mv file.txt /tmp    # 移动文件到指定目录
```

### 11.more/less

分页查看大文件内容

```sh
more large.txt  # 向下翻页（空格翻页，q退出）
less large.txt  # 上下翻页（↑↓键，q退出，更灵活）
```

### 12.tail

查看文件尾部内容（常用于看日志）

```sh
tail file.txt       # 默认显示最后10行
tail -n 20 file.txt # 显示最后20行
tail -f log.txt     # 实时跟踪文件变化（日志监控常用）
```

## 三、nginx

nginx 是一个 web 服务器，一般可以用来部署网站，还有 Apache 也可以用来部署网站

:::tip
注意：在服务器里面使用 npm 下载的东西一定是放在 etc 文件夹里面
:::
在服务器根目录中，找到 etc，再找到 nginx，在里面找到 nginx.conf 这个配置文件

```sh
    server {
        listen       80;
        listen       [::]:80;
        server_name  _;
        root         /usr/share/nginx/html;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        error_page 404 /404.html;
        location = /404.html {
        }

        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
        }

        # 在这里增加这个配置，记得都在后面加上分号
        location / {
        root /docsProject/oyyDocs/docs;
        index index.html;
        }

    }
```

nginx 如果没有启动，直接输入 `nginx` 启动 nginx，
如果已经启动过 nginx 了，输入 `nginx -s reload` 进行重载

### 1.nginx 命令

#### 1.1 启动

```sh
nginx
```

#### 1.2 快速关闭

比如现在有一个接口还在访问，它就不会管了，会直接关闭服务

```sh
nginx -s stop
```

#### 1.3 平稳关闭

比如现在有一个接口还在访问，它会等接口访问完毕，再去关闭服务

```sh
nginx -s quit
```

#### 1.4 重载配置文件

在 nginx.conf 配置文件修改了，就需要使用这个命令进行重载

```sh
nginx -s reload
```

#### 1.5 检查配置文件是否出错

```sh
nginx -t
```

### 2.nginx.conf 配置文件解析

```sh
# For more information on configuration, see:
#   * Official English Documentation: http://nginx.org/en/docs/
#   * Official Russian Documentation: http://nginx.org/ru/docs/

user nginx;

# 启动的进程 根据CPU核心来的  可以用来做高并发
worker_processes auto;

error_log /var/log/nginx/error.log notice;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    # 最大并发连接数 比如worker_processes配置为64， 64*1024就是能承受多少并发，也就是每秒钟可以承受65536个并发
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    # nginx特性 开启的话，用于处理大的静态文件，效率很高，因为他会通过进程池去进行分布式加载
    sendfile            on;
    tcp_nopush          on;
    # 超时时间
    keepalive_timeout   65;
    # 压缩
    gzip on;
    types_hash_max_size 4096;

    # 重要—————— 负载均衡
    # 默认是轮询的方式  就是在接口请求的时候，第一接口会打到9001，第二个9002，第三个9003
    # 负载均衡就是 后端会将接口部署到多个服务器上
    # weight 权重 数值越高 受到的流量越大 可以进行权重区分，服务器越好 配置权重高一点
    upstream oyy {
      server 127.0.0.1:9001 weight = 3;
      server 127.0.0.2:9002 weight = 2;
      server 127.0.0.3:9003 weight = 1;
      server 127.0.0.3:9004 backup; # 容灾技术 配置了backup 就将这个服务器作为备份服务器了，如果前面的服务器都挂了，就会走这个服务器，前面的不挂，不会走这个服务器
    }

    # 限速技术 也就是控制一分钟之内允许多少次请求
    # nginx内置变量 $binary_remote_addr：远程客户端ip
    # rate_limit 可以自定义，随便取啥名都行 现在就是写的rate_limit
    # 缓存空间的大小 写10m，可以改
    # rate=5r/s 限制一秒钟发5个请求 rate=10r/m 限制一分钟发10个请求
    limit_req_zone $binary_remote_addr zone=rate_limit:10m rate=5r/s;

    # 缓存 path必须是绝对路径 | levels缓存目录结构 1:2代表两层 | keys_zone=缓存名:大小 最大缓存量 时间  inactive说明一个缓存在60分钟内没有被使用，就会被删掉
    proxy_cache_path /etc/nginx/cache levels=1:2 keys_zone=ncache:100m max_size=1g inactive=60m;


    # 这个mime.types文件里面写的是Content-Type类型，nginx帮我们把类型全部写好在这里了
    include             /etc/nginx/mime.types;
    # 默认的Content-Type是二进制流，把所有文件都下载
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;

    # http服务器管理 可以配置多个server
    server {
        # 端口号
        listen       80;
        listen       [::]:80;
        # 配置ip地址或者域名
        server_name  _;
        root         /usr/share/nginx/html;
        index index.html index.htm;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        error_page 404 /404.html;
        location = /404.html {
        }

        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
        }

        # 代理 / 是代理的路径，说明代理根路径
        location / {
          root /usr/share/nginx/html; # 代表的是 html这个文件夹里面的根目录
          index index.html; # 根目录对应下面的文件
        }

        # 反向代理并处理跨域
        location /api {
          limit_req zone=rate_limit burst=5 nodelay;
          proxy_pass http://localhost:9001;
          rewrite ^/api/(.*) /$1 break; # 将/api在真实请求中去掉，不然会带到http://localhost:9001/api里面去
        }

        # 负载均衡处理
        location /api {
          proxy_pass http://oyy;
          rewrite ^/api/(.*) /$1 break; # 将/api在真实请求中去掉，不然会带到http://localhost:9001/api里面去
        }

        # 图片防盗链处理 核心原理  就是验证referer
        location ~*.*\.(jpg|jpeg|gif|png|ico)$ {
          # 配置缓存
          proxy_cache ncache;
          proxy_cache_methods GET;
          proxy_cache_key $host$uri$is_args$args;
          proxy_cache_valid 200 304 1d;

          root html/static;
          # 配置图片防盗链 none 允许referer为空  blocked 允许referer没有 localhost 允许来源是localhost
          valid_referers none blocked localhost;
          if ($invalid_referer) {
            return 403;
          }
        }
    }

# Settings for a TLS enabled server.
#
#    server {
#        listen       443 ssl http2;
#        listen       [::]:443 ssl http2;
#        server_name  _;
#        root         /usr/share/nginx/html;
#
#        ssl_certificate "/etc/pki/nginx/server.crt";
#        ssl_certificate_key "/etc/pki/nginx/private/server.key";
#        ssl_session_cache shared:SSL:1m;
#        ssl_session_timeout  10m;
#        ssl_ciphers PROFILE=SYSTEM;
#        ssl_prefer_server_ciphers on;
#
#        # Load configuration files for the default server block.
#        include /etc/nginx/default.d/*.conf;
#
#        error_page 404 /404.html;
#        location = /404.html {
#        }
#
#        error_page 500 502 503 504 /50x.html;
#        location = /50x.html {
#        }
#    }
}
```

## 四、cicd

### 1.cicd项目

#### 1.1 config.js

```js
// 配置文件
// 集群部署配置 ： 集群部署就是可以往多台服务器上进行部署  这就是为什么配置项为一个数组
const config = [
  {
    name: "项目-A",
    value: "项目-A",
    ssh: {
      // 配置ssh
      host: "47.98.138.258", // 服务器ip
      port: 22, // 端口
      username: "root", // 用户名
      password: "asd123456", // 密码
      passphrase: "" // 密钥密码
    },
    targetDir: "D:/code/project-A/dist", // 本地打包文件路径，也就是要上传的目录
    targetFile: "dist.zip", // 压缩之后的文件名
    deployDir: "/home/cicd/", // 上传到服务器目录
    releaseDir: "web" // 发布目录
  },
  {
    name: "项目-B",
    value: "项目-B",
    ssh: {
      // 配置ssh
      host: "8.140.249.88", // 服务器ip
      port: 22, // 端口
      username: "root", // 用户名
      password: "aaa88888888", // 密码
      passphrase: "" // 密钥密码
    },
    targetDir: "D:/code/project-B/dist", // 本地打包文件路径，也就是要上传的目录
    targetFile: "dist.zip", // 压缩之后的文件名
    deployDir: "/home/cicd2/", // 上传到服务器目录
    releaseDir: "web" // 发布目录
  }
];

export default config;
```

#### 1.2 app.js

```js
import path from "path";
import commandLine from "./src/helper.js";
import compressFile from "./src/compressFile.js";
import connectServer, { nodessh } from "./src/ssh.js";
import uploadFile from "./src/uploadFile.js";
import runCommand from "./src/handleCommand.js";
import buildProject from "./src/build.js";

async function main() {
  // 使用 inquirer 进行命令行操作，选择要部署的项目
  let project = await commandLine();

  // 项目打包
  await buildProject(project.targetDir);

  // 采用 archiver 压缩dist文件
  let zipPath = path.join(process.cwd(), project.targetFile);
  await compressFile(project.targetDir, zipPath);

  // 用 node-ssh 连接服务器
  await connectServer(project.ssh);

  // 用 nodessh.execCommand 运行linux命令，删除web目录，因为如果服务器里面如果有web这个目录了，上传同名的目录会进行报错
  await runCommand(nodessh, `rm -rf ${project.releaseDir}`, project.deployDir);

  // 用 nodessh.putFile 上传压缩文件到服务器
  let remotePath = `${project.deployDir}${project.releaseDir}`;
  await uploadFile(nodessh, zipPath, remotePath);

  // 用 nodessh.execCommand 运行linux命令，解压文件，移动文件等操作
  // 注意：unzip这个包需要在服务器里面进行安装 yum install unzip
  await runCommand(nodessh, `unzip ${project.releaseDir}`, project.deployDir);

  // 这个操作，是将web这个目录删除，因为解压出来了dist目录，我们再需要将dist目录重命名为web目录
  await runCommand(nodessh, `rm -rf ${project.releaseDir}`, project.deployDir);

  // 这个操作只是为了语义化更加好理解一些，将dist目录重命名为web目录，你也可以命名为 h5
  await runCommand(nodessh, `mv dist ${project.releaseDir}`, project.deployDir);

  // 断开与服务器的连接
  nodessh.dispose();
  console.log("部署完成，断开与服务器的连接");
}

main();
```

#### 1.3 src/helper.js

```js
// 命令行工具
import inquirer from "inquirer";
import config from "../config.js";

export default async function commandLine() {
  if (process.argv[2]) {
    // 说明是通过打包项目的命令行传参进来的
    return config.find(item => item.value === process.argv[2]);
  }

  // 说明是手动执行cicd项目的app.js文件进来的
  const res = await inquirer.prompt([
    {
      type: "list", // rawlist | list | input | confirm | checkbox
      name: "project",
      message: "请选择您要部署的项目吧~",
      choices: config
    }
  ]);
  return config.find(item => item.value === res.project);
}
```

#### 1.4 src/build.js

```js
// 打包项目
import { execSync } from "child_process";

/**
 * exec 适合执行单次命令
 * spawn 适合执行流命令
 */

export default function buildProject(buildPath) {
  return new Promise(resolve => {
    execSync("npm run build", {
      cwd: buildPath, // 指定目录执行
      stdio: "inherit" // 输出日志，也就是打包的日志
    });
    resolve();
  });
}
```

#### 1.5 src/compressFile.js

```js
// 压缩文件
import archiver from "archiver";
import fs from "fs";

/**
 * @param {*} localPath 压缩的目录 本地项目打包后dist文件的目录 D:/code/project-A/dist
 * @param {*} zipPath 输出的压缩文件目录 放到这个cicd的node项目里  S:/vsCode工作区/cicd/dist.zip
 * @returns
 */
export default function compressFile(localPath, zipPath) {
  return new Promise(resolve => {
    let outZipPath = fs.createWriteStream(zipPath); // 通过 fs.createWriteStream() 创建的文件写入流（数据目标）
    let zipFile = archiver("zip", {
      zlib: { level: 9 } // 设置压缩等级，等级越高，压缩的越小
    }); // archiver 创建的压缩对象（数据源）

    zipFile.pipe(outZipPath); // 将数据存档到文件中，也就是压缩完了写入这个目录
    zipFile.directory(localPath, "dist"); //压缩到哪里，也就是将 localPath 目录下的所有文件和子目录递归地添加到压缩文件中，并在压缩包内部以 "dist" 为文件夹名称存在。
    zipFile.finalize(); // 完成压缩

    outZipPath.on("close", () => {
      console.log(
        `压缩完成，文件输出到：${zipPath}，总大小：${zipFile.pointer() / 1024 / 1024}MB`
      );
      resolve();
    });
  });
}
```

#### 1.6 src/ssh.js

```js
// 连接ssh
import { NodeSSH } from "node-ssh";
export const nodessh = new NodeSSH();

export default function connectServer(sshConfig) {
  return new Promise(resolve => {
    nodessh.connect(sshConfig).then(res => {
      console.log("ssh连接成功~");
      resolve(res);
    });
  });
}
```

#### 1.7 src/uploadFile.js

```js
// 上传文件到服务器

/**
 *
 * @param {*} nodessh
 * @param {*} localPath S:/vsCode工作区/cicd/dist.zip
 * @param {*} remotePath /home/cicd/web
 * @returns
 */
export default function uploadFile(nodessh, localPath, remotePath) {
  return new Promise(resolve => {
    nodessh.putFile(localPath, remotePath).then(() => {
      console.log(`文件上传成功：${localPath} --> ${remotePath}`);
      resolve();
    });
  });
}
```

#### 1.8 src/handleCommand.js

```js
// 操作 node-ssh 运行linux命令

/**
 *
 * @param {*} nodessh
 * @param {*} command linux命令
 * @param {*} path 服务器执行命令的路径
 * @returns
 */

export default function runCommand(nodessh, command, path) {
  return new Promise(resolve => {
    nodessh
      .execCommand(command, {
        cwd: path // 指定目录执行
      })
      .then(res => {
        console.log(`命令执行成功：${command}`);
        resolve(res);
      });
  });
}
```

### 2.打包的项目(vue项目|React项目)

#### 2.1 husky

husky是什么？

它是git的钩子工具，可以在git的某些操作之前或者之后，执行一些脚本操作

钩子如下：
**pre-commit：** 就是在git commit 之前执行的脚本
**作用：** 在你每次`git commit之前`，帮你先进行代码的`格式化操作`，比如说 `eslint --fix`，帮你把代码格式化一下，再进行commit提交

**post-commit:** 就是在git commit 之后执行的脚本
**作用：** 在你每次`git commit之后`，帮你进行一些操作，比如说`自动部署代码`到服务器上

**pre-push:** 就是在git push 之前执行的脚本
**作用：** 在你每次git push之前，帮你进行一些操作，比如说先进行单元测试，测试通过了再进行push操作

**post-push:** 就是在git push 之后执行的脚本
**作用：** 在你每次git push之后，帮你进行一些操作，比如说发送通知到钉钉或者企业微信，告诉大家代码已经push到远程仓库了

**pre-merge:** 就是在git merge 之前执行的脚本

**post-merge:** 就是在git merge 之后执行的脚本

#### 2.2 .husky/pre-commit

这里可以实现cicd到测试环境，完毕之后再可以在post-push钩子中部署到正式服务器去

```sh
#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"

echo "Starting deployment process..."

# 切到cicd目录下执行脚本
cd S:/vsCode工作区/cicd

# 这里如果直接执行node app.js有问题，inquirer这个命令行交互会失效，是一串字符串，无法选择项目
# node app.js 项目-A 通过进程传进去，然后在cicd这个项目通过process.argv[2]去接
node app.js 项目-A
```
