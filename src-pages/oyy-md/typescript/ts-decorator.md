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

## 一、装饰器(Decorator)

装饰器是一种特殊类型的声明，它能够被附加到类声明、方法、属性或参数上，可以修改类的行为。

:::tip
如果没有 tsconfig.json 文件，使用 tsc --init 生成

在 tsconfig.json 文件中，需要配置 "experimentalDecorators": true, "emitDecoratorMetadata": true，这样才能使用装饰器
:::

### 1.装饰器工厂

装饰器工厂是一个函数，它返回一个装饰器函数。

```ts
const Base = (url: string) => {
  const decorator: ClassDecorator = (target: any) => {
    target.prototype.baseUrl = url;
    target.prototype.get = function () {
      console.log("get");
    };
    target.prototype.post = function () {
      console.log("post");
    };
  };
  return decorator;
};

@Base("http://localhost:3000")
class Http {
  // ......
}
```

### 2.类装饰器(ClassDecorator)

类装饰器在类声明之前被声明，用于修改类的行为。

```ts
const Base: ClassDecorator = (target: any) => {
  // target 是Http这个类的构造函数
  // 优势，有了target这个类的构造函数，就可以不去破坏Http里面原有的结构，可以在prototype上去直接挂东西
  target.prototype.baseUrl = "http://localhost:3000";
  target.prototype.get = function () {
    console.log("get");
  };
  target.prototype.post = function () {
    console.log("post");
  };
};

@Base
class Http {
  // ......
}

const http = new Http();
console.log(http.baseUrl);
http.get();
http.post();
```

### 3.方法装饰器(MethodDecorator)

方法装饰器在方法声明之前被声明，用于修改方法的行为。

```ts
const Get = (url: string) => {
  const decorator: MethodDecorator = (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    // target 读取的是getList的原型对象
    console.log(target, propertyKey, descriptor); // {} getList函数名 {value: [Function:getList],writable:true,enumerable:true,configurable:true}

    axios.get(url).then(res => {
      // descriptor这个参数中的value就是getList这个函数，这样就可以把结果传递给getList函数了
      descriptor.value(res.data); // 执行getList方法，并传入res.data
    });
  };
  return decorator;
};

class Http {
  @Get("http://localhost:3000/list")
  getList(data: any) {
    console.log(data);
  }
}
```

### 4.参数装饰器(ParameterDecorator)

参数装饰器在参数声明之前被声明，用于修改参数的行为。

```ts
import "reflect-metadata";

const Get = (url: string) => {
  const decorator: MethodDecorator = (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    // target 读取的是getList的原型对象

    // 获取反射元数据
    const resKey = Reflect.getMetadata("resKey", target, propertyKey);

    axios.get(url).then(res => {
      descriptor.value(resKey ? res.data[resKey] : res.data); // 执行getList方法，并传入res.data
    });
  };
  return decorator;
};

const Result = () => {
  const decorator: ParameterDecorator = (
    target: any,
    propertyKey: string,
    parameterIndex: number
  ) => {
    // target 是getList的原型对象  propertyKey 是getList的方法名 parameterIndex 是getList的参数索引
    console.log(target, propertyKey, parameterIndex); // {} getList 0

    // 使用反射元数据。进行数据存储 第一个参数为key的名字 第二个参数为value
    Reflect.defineMetadata("resKey", "result", target, propertyKey);
  };
  return decorator;
};

class Http {
  @Get("http://localhost:3000/list")
  getList(@Result() data: any) {
    // console.log(data.result.list);
    console.log(data);
  }
}
```

### 5.属性装饰器(PropertyDecorator)

属性装饰器在属性声明之前被声明，用于修改属性的行为。

```ts
const Name: PropertyDecorator = (target: any, propertyKey: string) => {
  console.log(target, propertyKey); // {} name
};

class Http {
  @Name
  name: string;
  age: number;

  constructor() {
    this.name = "oyy";
    this.age = 18;
  }

  @Get("http://localhost:3000/list")
  getList(@Result() data: any) {
    // console.log(data.result.list);
    console.log(data.result.list);
  }
}
```

### 6.装饰器执行顺序

装饰器执行顺序：

1. 类装饰器
2. 方法装饰器
3. 属性装饰器

```ts
class Http {
  @Name
  name: string;

  constructor() {
    this.name = "oyy";
  }

  @Get("http://localhost:3000/list")
  getList(@Result() data: any) {
    // console.log(data.result.list);
    console.log(data.result.list);
  }
}
```

## 二、webpack 构建 ts+vue3 项目

### 1.项目目录

```bash
├── index.html
├── package.json
├── tsconfig.json
├── webpack.config.js
├── src
│   ├── App.vue
│   ├── main.ts
│   └── shim.d.ts
```

### 2.安装依赖

```bash
npm install webpack -D
npm install webpack-dev-server -D
npm install webpack-cli -D
npm install vue-loader -D
npm install vue-template-compiler -D
npm install html-webpack-plugin -D
npm install ts-loader -D
npm install vue-router -D
npm install vuex -D
```

### 3.添加打包命令和 启动服务的命令

package.json

```js
{
  "scripts": {
    "build": "webpack",
    "dev": "webpack-dev-server"
  }
}
```

### 4.配置 tsconfig.json

```js
{
  "compilerOptions": {
    "target": "ES5",
    "module": "ESNext",
    "strict": true
  },
  "include": ["src/**/*"]
}
```

### 5.支持 TypeScript

增加依赖

```ts
npm install ts-loader -D
npm install typescript -D
```

支持 Vue

```ts
npm install vue-laoder -D
npm install html-webpack-plugin -D
```

### 6.配置 main.ts

```ts
import { createApp } from "vue";
import App from "./App.vue";

createApp(App).mount("#app");
```

### 7.配置 shim.d.ts

让 ts 识别.vue 后缀

```ts
declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
```

### 8.配置 index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

### 9.支持 css + less

```ts
npm install css-loader style-loader less less-loader -D
```

### 10.代码分包

性能优化 默认把所有代码打包到一个 js 文件体积太大了我们可以进行代码分包减少体积

### 11. 单独提取 css

目前是通过 js 动态插入 style 标签的方式进行的，但是我们希望通过 link 标签引入

```ts
npm install mini-css-extract-plugin -D
```

### 8.配置 webpack.config.js

```js
const { Configuration } = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWepackPlugin = require("html-webpack-plugin");
const MimiCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
/**
 * @type {Configuration}
 */
const config = {
  mode: "development",
  entry: "./src/main.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[chunkhash].js",
    clean: true
  },
  stats: "errors-only",
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWepackPlugin({
      template: "./index.html"
    }),
    new MimiCssExtractPlugin()
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        moment: {
          name: "moment",
          test: /[\\/]node_modules[\\/]moment[\\/]/,
          chunks: "all"
        },
        common: {
          name: "common",
          chunks: "all",
          minChunks: 2
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
          options: {
            appendTsSuffixTo: [/\.vue$/]
          }
        }
      },
      {
        test: /\.vue$/,
        use: "vue-loader"
      },
      {
        test: /\.css$/,
        use: [MimiCssExtractPlugin.loader, "css-loader"] //从右向左解析
      },
      {
        test: /\.less$/,
        use: [MimiCssExtractPlugin.loader, "css-loader", "less-loader"]
      }
    ]
  }
};

module.exports = config;
```
