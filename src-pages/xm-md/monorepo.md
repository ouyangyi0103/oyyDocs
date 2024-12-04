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

# monorepo
monorepo项目只能是pnpm或者yarn去构建，npm是构建不了的，但是主流的还是用pnpm去构建

## 一、npm

### 1.嵌套的 node_modules 结构
:::tip npm进化史
  npm 在早期采用的是嵌套的 node_modules 结构，直接依赖会平铺在 node_modules 下，子依赖嵌套在直接依赖的 node_modules 中。

  比如项目依赖了A 和 C，而 A 和 C 依赖了不同版本的 B@1.0 和 B@2.0，node_modules 结构如下：

  ```js
  node_modules
  ├── A@1.0.0
  │   └── node_modules
  │       └── B@1.0.0
  └── C@1.0.0
      └── node_modules
          └── B@2.0.0
  ```

  如果 D 也依赖 B@1.0，会生成如下的嵌套结构：
  ```js
  node_modules
  ├── A@1.0.0
  │   └── node_modules
  │       └── B@1.0.0
  ├── C@1.0.0
  │   └── node_modules
  │       └── B@2.0.0
  └── D@1.0.0
      └── node_modules
          └── B@1.0.0
  ```
  可以看到同版本的 B 分别被 A 和 D 安装了两次。
:::

### 2.扁平的 node_modules 结构
:::tip
  为了将嵌套的依赖尽量打平，避免过深的依赖树和包冗余，npm v3 将子依赖「提升」(hoist)，采用扁平的 node_modules 结构，子依赖会尽量平铺安装在主依赖项所在的目录中。

  ```js
  node_modules
  ├── A@1.0.0
  ├── B@1.0.0
  └── C@1.0.0
      └── node_modules
          └── B@2.0.0
  ```
  可以看到 A 的子依赖的 B@1.0 不再放在 A 的 node_modules 下了，而是与 A 同层级。而 C 依赖的 B@2.0 因为版本号原因还是嵌套在 C 的 node_modules 下。

  这样不会造成大量包的重复安装，依赖的层级也不会太深，解决了依赖地狱问题，但也形成了新的问题。
:::

### 3.幽灵依赖
::: tip
  幽灵依赖是指在 package.json 中未定义的依赖，但项目中依然可以正确地被引用到。

  比如上方的示例其实我们只安装了 A 和 C：
  ```js
  {
    "dependencies": {
      "A": "^1.0.0",
      "C": "^1.0.0"
    }
  }
  ```
  由于 B 在安装时被提升到了和 A 同样的层级，所以在项目中引用 B 还是能正常工作的。

  幽灵依赖是由依赖的声明丢失造成的，如果某天某个版本的 A 依赖不再依赖 B 或者 B 的版本发生了变化，那么就会造成依赖缺失或兼容性问题。
:::

### 4.不确定性
:::tip
  不确定性是指：同样的 package.json 文件，install 依赖后可能不会得到同样的 node_modules 目录结构。

  还是之前的例子，A 依赖 B@1.0，C 依赖 B@2.0，依赖安装后究竟应该提升 B 的 1.0 还是 2.0。
  ```js
  node_modules
  ├── A@1.0.0
  ├── B@1.0.0
  └── C@1.0.0
      └── node_modules
          └── B@2.0.0
  ```
  ```js
  node_modules
  ├── A@1.0.0
  │   └── node_modules
  │       └── B@1.0.0
  ├── B@2.0.0
  └── C@1.0.0
  ```
  取决于用户的安装顺序。

  如果有 package.json 变更，本地需要删除 node_modules 重新 install，否则可能会导致生产环境与开发环境 node_modules 结构不同，代码无法正常运行。
  :::

### 5.依赖分身
:::tip
  假设继续再安装依赖 B@1.0 的 D 模块和依赖 @B2.0 的 E 模块，此时：

  A 和 D 依赖 B@1.0
  C 和 E 依赖 B@2.0
  以下是提升 B@1.0 的 node_modules 结构：
  ```js
  node_modules
  ├── A@1.0.0
  ├── B@1.0.0
  ├── D@1.0.0
  ├── C@1.0.0
  │   └── node_modules
  │       └── B@2.0.0
  └── E@1.0.0
      └── node_modules
          └── B@2.0.0
  ```
  可以看到 B@2.0 会被安装两次，实际上无论提升 B@1.0 还是 B@2.0，都会存在重复版本的 B 被安装，这两个重复安装的 B 就叫 doppelgangers。

  而且虽然看起来模块 C 和 E 都依赖 B@2.0，但其实引用的不是同一个 B，假设 B 在导出之前做了一些缓存或者副作用，那么使用者的项目就会因此而出错。
:::

## 二、yarn
  2016 年，yarn 发布，yarn 也采用扁平化 node_modules 结构。它的出现是为了解决 npm v3 几个最为迫在眉睫的问题：依赖安装速度慢，不确定性。

  ### 1.提升安装速度
  :::tip
  在 npm 中安装依赖时，安装任务是串行的，会按包顺序逐个执行安装，这意味着它会等待一个包完全安装，然后再继续下一个。

  为了加快包安装速度，yarn 采用了并行操作，在性能上有显著的提高。而且在缓存机制上，yarn 会将每个包缓存在磁盘上，在下一次安装这个包时，可以脱离网络实现从磁盘离线安装。
  :::

  ### 2.解决不确定性
  :::tip
  yarn 更大的贡献是发明了 yarn.lock。

  在依赖安装时，会根据 package.josn 生成一份 yarn.lock 文件。

  lockfile 里记录了依赖，以及依赖的子依赖，依赖的版本，获取地址与验证模块完整性的 hash。

  即使是不同的安装顺序，相同的依赖关系在任何的环境和容器中，都能得到稳定的 node_modules 目录结构，保证了依赖安装的确定性。

  所以 yarn 在出现时被定义为快速、安全、可靠的依赖管理。而 npm 在一年后的 v5 才发布了 package-lock.json。
  :::

  ### 3.与 npm 一样的弊端
  yarn 依然和 npm 一样是扁平化的 node_modules 结构，没有解决幽灵依赖和依赖分身问题。

  ## 三、pnpm
  pnpm - performant npm，在 2017 年正式发布，定义为快速的，节省磁盘空间的包管理工具，开创了一套新的依赖管理机制。

  ### 1.内容寻址存储
  :::tip 非扁平化结构
   与依赖提升和扁平化的 node_modules 不同，pnpm 引入了另一套依赖管理策略：内容寻址存储。

  该策略会将包安装在系统的全局 store 中，依赖的每个版本只会在系统中安装一次。

  在引用项目 node_modules 的依赖时，会通过硬链接与符号链接在全局 store 中找到这个文件。为了实现此过程，node_modules 下会多出 .pnpm 目录，而且是非扁平化结构。
  :::

  ### 2.底层原理

  #### 硬链接
  :::tip 硬链接
  硬链接可以理解为源文件的副本，项目里安装的其实是副本，它使得用户可以通过路径引用查找到全局 store 中的源文件，而且这个副本根本不占任何空间。同时，pnpm 会在全局 store 里存储硬链接，不同的项目可以从全局 store 寻找到同一个依赖，大大地节省了磁盘空间。

  简单一点的说，硬链接就像个对象一样，内存是共享的，比如a.js,b.js都硬链接了，那么改了a的硬链接内容，b的也改了
  :::

  #### 软链接
  :::tip 软链接
  可以理解为快捷方式，pnpm 可以通过它找到对应磁盘目录下的依赖地址。

  a.js与b.js 相当于复制了一份，比如a.js删除了，那么b.js就用不了了
  :::

  有共用的模块，就通过软链接复制一份过来

  没有共用的模块，就会去 .pnpm store 仓库里面使用硬链接获取

  ```js
  node_modules
  ├── .pnpm
  │   ├── A@1.0.0
  │   │   └── node_modules
  │   │       ├── A => <store>/A@1.0.0
  │   │       └── B => ../../B@1.0.0
  │   ├── B@1.0.0
  │   │   └── node_modules
  │   │       └── B => <store>/B@1.0.0
  │   ├── B@2.0.0
  │   │   └── node_modules
  │   │       └── B => <store>/B@2.0.0
  │   └── C@1.0.0
  │       └── node_modules
  │           ├── C => <store>/C@1.0.0
  │           └── B => ../../B@2.0.0
  │
  ├── A => .pnpm/A@1.0.0/node_modules/A
  └── C => .pnpm/C@1.0.0/node_modules/C

  <store>/xxx 开头的路径是硬链接，指向全局 store 中安装的依赖。

  其余的是软链接，指向依赖的快捷方式。
  ```

## 四、monorepo
多项目使用同一个仓库，可以共享同样的依赖，多项目可以使用公共的模块

项目结构

```js
monorepoDemo
  ├── common
  ├── react
  ├── vue
  ├── package.json
  └── pnpm-workspace.yaml
```
首先在项目根目录，pnpm init生成package.json文件

必须要配置pnpm-workspace.yaml文件，才能是monorepo项目
```js
// pnpm-workspace.yaml文件
packages:
  - 'common'
  - 'vue3'
  - 'react'
```
然后再 pnpm i 下载所有依赖，复用的会全部提升到最外层的node_moduls，不能复用的会安装在各自的node_moduls中

再配置各自的package.json文件，name必须要用@开头
```js
// common的package.json
{
  "name":"@common/web"
  ......
}
// vue3的package.json
{
  "name":"@vue3/web"
  ......
}
// react的package.json
{
  "name":"@react/web"
  ......
}
```

添加公共模块依赖到需要用到的项目中
```js
pnpm add 当前要添加模块 --filter 目标模块

pnpm add @common/web --filter @vue3/web

// vue3项目的package.json中就会有
{
  "dependencies":{
    "@common/web": "workspace:^"
  }
}

// vue3项目的main.js
import {token} from "@common/web"
```


