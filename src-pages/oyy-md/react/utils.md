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

## 一、Babel

Babel 是一个 JavaScript 编译器,提供了 JavaScript 的编译过程，能够将源代码转换为目标代码。

### 1.核心功能

1. 语法转换：将新版本的 JavaScript 语法转换为旧版本的语法
2. Polyfill：通过引入额外的代码，使新功能在旧浏览器中可用
3. JSX: 将 JSX 语法转换成普通的 JavaScript 语法
4. 插件: 为 Babel 提供自定义功能

### 2.案例实现

#### 2.1 安装包

```bash
npm install --save-dev @babel/core @babel/cli @babel/preset-env
```

#### 2.2 测试文件

test.js

```tsx
//语法
const a = (params = 2) => 1 + params;
const b = [1, 2, 3];
const c = [...b, 4, 5];
class Babel {}
new Babel();
//API
const x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(x => x % 2 === 0);
const y = Object.assign({}, { name: 1 });
```

#### 2.3 代码转换

index.js

```tsx
//记得设置package.json的type为module
import Babel from "@babel/core";
import presetEnv from "@babel/preset-env"; // 这个预设，就是实现es6转es5的核心包
import fs from "node:fs";
const file = fs.readFileSync("./test.js", "utf8");
const result = Babel.transform(file, {
  presets: [presetEnv] // 第二个参数需要配置预设，实现es6转es5
});
console.log(result.code);
```

如何去支持新特新，比如 `Promise、Object.assign` 等，需要下载` core-js` 这个包，用它来进行新特性的处理

```tsx
//记得设置package.json的type为module
import Babel from "@babel/core";
import presetEnv from "@babel/preset-env";
import fs from "node:fs";
const file = fs.readFileSync("./test.js", "utf8");
const result = Babel.transform(file, {
  //usage 会根据配置的浏览器兼容，以及你代码中用到的 API 来进行 polyfill，实现了按需添加
  //corejs 3 是corejs的版本
  presets: [[presetEnv, { useBuiltIns: "usage", corejs: 3 }]]
});
console.log(result.code);
```

如何去支持 jsx，需要使用 `@babel/preset-react` 这个预设包，用来处理 `jsx`

```tsx
import Babel from "@babel/core";
import presetEnv from "@babel/preset-env";
import fs from "node:fs";
import react from "@babel/preset-react";
const file = fs.readFileSync("./test.jsx", "utf8");
const result = Babel.transform(file, {
  presets: [[presetEnv, { useBuiltIns: "usage", corejs: 3 }], react]
});
console.log(result.code);
```

转换的结果

```tsx
"use strict";

var _react = _interopRequireDefault(require("react"));
var _client = require("react-dom/client");
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { "default": e };
}
var App = function App() {
  return /*#__PURE__*/ React.createElement("div", null, "\u5C0F\u6EE1\u662F\u8C01\uFF1F\uFF1F\uFF1F\uFF1F\uFF1F");
};
(0, _client.createRoot)(document.getElementById("root")).render(/*#__PURE__*/ React.createElement(App, null));

// 其实也就是调用了React.createElement去创建元素
```

#### 2.4 编写 Babel 插件

```tsx
import Babel from "@babel/core";
import fs from "node:fs";
const file = fs.readFileSync("./test.js", "utf8");
//babel会注入一个types对象里面包含了各种ast节点的方法
const transformFunction = ({ types: t }) => {
  return {
    name: "babel-transform-function",
    //visitor 是一个对象，它包含了一组方法，这些方法对应于 AST 中的不同节点类型。每当 Babel 遇到某种类型的节点时，都会调用 visitor 中对应的方法。
    visitor: {
      //匹配 箭头函数 当然也可以匹配别的东西 这儿只是案例
      ArrowFunctionExpression(path) {
        const node = path.node;
        const arrowFunction = t.functionExpression(
          null, //node.id 是一个 Identifier 节点，表示函数名
          node.params, //node.params 是一个数组，表示函数的参数
          // BlockStatement 是 JavaScript 抽象语法树（AST）中的一种节点类型，表示一个由大括号 {} 包围的语句块。它是函数体、循环体、条件分支（如 if 语句）等代码块的基础结构
          t.blockStatement([t.returnStatement(node.body)]), //node.body 是函数的主体，通常是一个 BlockStatement 节点
          node.async //node.async 是一个布尔值，表示函数是否是异步的 (async 函数)
        );
        path.replaceWith(arrowFunction); //替换当前节点
      }
    }
  };
};
const result = Babel.transform(file, {
  plugins: [transformFunction]
});
console.log(result.code);
```

## 二、SWC

SWC 既可用于编译，也可用于打包。对于编译，它使用现代 JavaScript 功能获取 JavaScript / TypeScript 文件并输出所有主流浏览器支持的有效代码。

SWC 在单线程上比 Babel 快 20 倍，在四核上快 70 倍。

简单点来说 swc 实现了和 babel 一样的功能，但是它比 babel 快。

::: tip 为什么快?

1. 编译型 Rust 是一种编译型语言，在编译时将代码转化为机器码（底层的 CPU 指令）。这种机器码在执行时非常高效，几乎不需要额外的开销。

2. 解释型 JavaScript 是一种解释型语言，通常在浏览器或 Node.js 环境中通过解释器运行。尽管现代的 JavaScript 引擎（如 V8 引擎）使用了 JIT（即时编译）技术来提高性能，但解释型语言本质上还是需要更多的运行时开销。
   :::

### 1.核心功能

1. JavaScript/TypeScript 转换 可以将现代 JavaScript（ES6+）和 TypeScript 代码转换为兼容旧版 JavaScript 环境的代码。这包括语法转换（如箭头函数、解构赋值等）以及一些 polyfill 的处理模块打包 SWC 提供了基础的打包功能，可以将多个模块捆绑成一个单独的文件
2. SWC 支持代码压缩和优化功能，类似于 Terser。它可以对 JavaScript 代码进行压缩，去除不必要的空白、注释，并对代码进行优化以减小文件大小，提高加载速度
3. SWC 原生支持 TypeScript，可以将 TypeScript 编译为 JavaScript
4. SWC 支持 React 和 JSX 语法，可以将 JSX 转换为标准的 JavaScript 代码。它还支持一些现代的 React 特性

### 2.案例实现

#### 2.1 语法转换

转换前

```tsx
//语法
const a = (params = 2) => 1 + params;
const b = [1, 2, 3];
const c = [...b, 4, 5];
class Babel {}
new Babel();
//API
const x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(x => x % 2 === 0);
const y = Object.assign({}, { name: 1 });
```

SCW 转换代码

```tsx
import swc from "@swc/core";

const result = swc.transformFileSync("./test.js", {
  jsc: {
    target: "es5", //代码转换es5
    parser: {
      syntax: "ecmascript"
    }
  }
});
console.log(result.code);
```

转换后

```tsx
// es5的代码
```

#### 2.2 swc 转换 react jsx 语法

```tsx
import swc from "@swc/core";
console.time();
const result = swc.transformFileSync("./test.jsx", {
  jsc: {
    target: "es5", //代码转换es5
    parser: {
      syntax: "ecmascript",
      jsx: true // 只需配置为true即可
    },
    transform: {
      react: {
        runtime: "automatic"
      }
    }
  }
});
console.log(result.code);
console.timeEnd();
```

#### 2.3swc 简易打包

目前 swc 打包只能支持 cjs 未来才能支持 esm 比较鸡肋 其次就是参数只能 entry output 暂无其他参数
创建配置文件 spack.config.js
编写以下代码执行 npx spack 打包

```tsx
const { config } = require("@swc/core/spack");
const path = require("path");
module.exports = config({
  entry: {
    web: path.join(__dirname, "./test.js") //入口
  },
  output: {
    path: path.join(__dirname, "./dist"), //出口
    name: "test.js"
  }
});
```
