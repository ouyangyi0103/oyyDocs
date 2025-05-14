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

## 一、模块化解析

### 1.CommonJS 模块

CommonJS 是 Node.js 的模块系统，它使用 require 和 module.exports 来导入和导出模块。

```ts
// 导出模块
exports.name = "oyy";
exports.age = 18;

module.exports = {
  name: "oyy",
  age: 18
};

// 导入模块
const { name, age } = require("./module");
console.log(name, age);
```

### 2.AMD 模块

AMD 是 Asynchronous Module Definition 的缩写，它是一种异步模块定义的模块系统。

```ts
// 导出模块
define("module", ["jquery"], function ($) {
  return {
    name: "oyy",
    age: 18
  };
});

// 导入模块
require(["module"], function (module) {
  console.log(module);
});
```

### 3.CMD 模块

CMD 是 Common Module Definition 的缩写，它是一种同步模块定义的模块系统。

```ts
// 导出模块
define(function (require, exports, module) {
  let a = require("./a");
  exports.name = "oyy";
  exports.age = 18;
});

// 导入模块
require(["module"], function (module) {
  console.log(module);
});
```

### 4.UMD 模块

UMD 是 Universal Module Definition 的缩写，它是一种通用的模块定义的模块系统。是 AMD 和 CommonJS 的结合体。

```ts
// 导出模块
(function (window, factory) {
  // 检测是不是 Nodejs 环境
  if (typeof module === "object" && typeof module.exports === "objects") {
    module.exports = factory();
  }
  // 检测是不是 AMD 规范
  else if (typeof define === "function" && define.amd) {
    define(factory);
  }
  // 使用浏览器环境
  else {
    window.eventUtil = factory();
  }
})(this, function () {
  //module ...
});
```

### 5.ES6 模块

ES6 模块是 ES6 的模块系统，它使用 import 和 export 来导入和导出模块。

#### 【1】默认导出

```ts
// 导出模块
export default {
  name: "oyy",
  age: 18
};

// 导入模块
import module from "./module";
console.log(module);
```

#### 【2】具名导出

```ts
// 导出模块
export const name = "oyy";
export const age = 18;

// 导入模块
import { name, age } from "./module";
console.log(name, age);
```

#### 【3】混合导出

```ts
// 导出模块
export default {
  name: "oyy",
  age: 18
};

export const name = "oyy";
export const age = 18;

// 导入模块
import module, { name, age } from "./module";
console.log(module, name, age);
```

#### 【4】重命名

```ts
// 导出模块
export const name = "oyy";
export const age = 18;

// 导入模块
import { name as name1, age as age1 } from "./module";
console.log(name1, age1);
```

#### 【5】全部导入

```ts
// 导出模块
export default {
  name: "oyy",
  age: 18
};

export const name = "oyy";
export const age = 18;
export const fn = () => {
  console.log("fn");
};

// 导入模块
import * as module from "./module";
console.log(module);
```

#### 【6】动态导入

```ts
// 导出模块
export const name = "oyy";
export const age = 18;

// 导入模块
const module = await import("./module");
console.log(module);

import("./module").then(module => {
  console.log(module);
});
```

## 二、声明文件(axios.d.ts)

### 1.什么是声明文件

声明文件是 TypeScript 提供的一种机制，用于描述 JavaScript 库的类型信息。它可以让 TypeScript 编译器理解库的类型，从而在编译时提供更好的类型检查和代码提示。 当使用第三方库时，我们需要为该库提供类型信息，这就是声明文件。这样才能获得对应的代码补全，接口提示等。

### 2.声明文件的语法

```ts
declare module "module" {
  export function name(params: type): returnType;
}
```

### 3.案例手写声明文件

```ts
// index.ts
import express from "express";

const app = express();

const router = express.Router();

app.use("/api", router);

router.get("/list", (req, res) => {
  res.json({
    code: 200
  });
});

app.listen(9001, () => {
  console.log(9001);
});
```

```ts
// express.d.ts
declare module "express" {
  interface Router {
    get(path: string, cb: (req: any, res: any) => void): void;
  }
  interface App {
    use(path: string, router: any): void;
    listen(port: number, cb?: () => void): void;
  }
  interface Express {
    (): App;
    Router(): Router;
  }
  const express: Express;
  export default express;
}
```

## 三、对象和类的合并

### 1.对象的合并

#### 【1】扩展运算符 浅拷贝

它是一个浅拷贝，如果对象的属性是对象，那么合并后的对象的属性是引用类型，修改合并后的对象的属性，会影响到原对象的属性。

```ts
interface A {
  name: string;
}

interface B {
  age: number;
}

let a: A = {
  name: "oyy"
};

let b: B = {
  age: 18
};

let c = { ...a, ...b };
console.log(c); // { name: 'oyy', age: 18 }
```

#### 【2】Object.assign 浅拷贝

```ts
interface A {
  name: string;
}

interface B {
  age: number;
}

let a: A = {
  name: "oyy"
};

let b: B = {
  age: 18
};

let c = Object.assign({}, a, b);
console.log(c); // { name: 'oyy', age: 18 }
```

#### 【3】structuredClone 深拷贝

全局方法，该方法还支持把原始值中的可转移对象转移到新对象，而不是把属性引用拷贝过去，可转移对象与原始对象分离并附加到新对象，它们不可以在原始对象中访问被访问到。
需要在 node 高版本 18 以上使用，以及谷歌浏览器 90 多以上使用，可以直接调用这个方法

```ts
let a = {
  name: "oyy"
};

let c = structuredClone(a);
console.log(c); // { name: 'oyy' }
```

### 2.类的合并

```ts
class Logger {
  log(msg: string) {
    console.log(msg);
  }
}

class Html {
  render() {
    console.log("render");
  }
}

class App {
  run() {
    console.log("run");
  }
}

type Constructor<T> = new (...args: any[]) => T;

function pluginMixins<T extends Constructor<App>>(Base: T) {
  return class extends Base {
    private Logger = new Logger();
    private Html = new Html();

    constructor(...args: any[]) {
      super(...args);
      this.Logger = new Logger();
      this.Html = new Html();
    }

    run() {
      this.Logger.log("oyy");
    }

    render() {
      this.Logger.log("oyy");
      this.Html.render();
    }
  };
}

const mixins = pluginMixins(App);

const app = new mixins();
app.run();
app.render();
```
