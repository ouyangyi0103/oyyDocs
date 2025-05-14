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

## 一、泛型

泛型是 ts 中非常重要的一个特性，它允许我们在定义函数、接口或类的时候，不预先指定具体的类型，而是在使用的时候再指定类型。

```ts
function Add<T>(a: T, b: T): Array<T> {
  return [a, b];
}

Add<number>(1, 2);
Add<string>("1", "2");
```

我们也可以使用不同的泛型参数名，只要在数量上和使用方式上能对应上就可以。

```ts
function Sub<T, U>(a: T, b: U): Array<T | U> {
  const params: Array<T | U> = [a, b];
  return params;
}

Sub<Boolean, number>(false, 1);
```

```ts
const axios = {
  get<T>(url: string): Promise<T> {
    return new Promise((resolve, reject) => {
      let xhr: XMLHttpRequest = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status == 200) {
          resolve(JSON.parse(xhr.responeseText));
        }
      };
      xhr.send(null);
    });
  }
};

interface Data {
  message: string;
  code: number;
}

axios.get<Data>("./data.json").then(res => {
  console.log(res.code);
});
```

### 1.定义泛型接口

```ts
interface MyInter<T> {
  (arg: T): T;
}

function fn<T>(arg: T): T {
  return arg;
}

let result: MyInter<number> = fn;

result(123);
```

### 2.泛型约束 extends 进行约束

泛型约束 extends 进行约束，可以约束泛型参数必须满足某个条件，比如必须是某个类型或者必须具有某个属性。

```ts
function add<T extends number>(a: T, b: T) {
  return a + b;
}

add(1, 2);
```

```ts
interface Len {
  length: number;
}

function fn<T extends Len>(arg: T)(
   arg.length
);

fn('123')
fn([1,2,3,4])
```

```ts
let obj = {
  name: "oyy",
  sex: "man"
};

// 先使用typeof 获取类型，再使用keyof 将对象身上的key推断成联合类型了
type Key = keyof typeof obj; // type Key = "name" | "sex"

function obFn<T extends object, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

obFn(obj, "name");
```

```ts
interface Data {
  name: string;
  age: number;
  sex: string;
}

type Options<T extends object> = {
  [Key in keyof T]?: T[Key];
};

type B = Options<Data>;
```

## 二、tsconfig.json

```ts
"compilerOptions": {
  "incremental": true, // TS编译器在第一次编译之后会生成一个存储编译信息的文件，第二次编译会在第一次的基础上进行增量编译，可以提高编译的速度
  "tsBuildInfoFile": "./buildFile", // 增量编译文件的存储位置
  "diagnostics": true, // 打印诊断信息
  "target": "ES5", // 目标语言的版本
  "module": "CommonJS", // 生成代码的模板标准
  "outFile": "./app.js", // 将多个相互依赖的文件生成一个文件，可以用在AMD模块中，即开启时应设置"module": "AMD",
  "lib": ["DOM", "ES2015", "ScriptHost", "ES2019.Array"], // TS需要引用的库，即声明文件，es5 默认引用dom、es5、scripthost,如需要使用es的高级版本特性，通常都需要配置，如es8的数组新特性需要引入"ES2019.Array",
  "allowJS": true, // 允许编译器编译JS，JSX文件
  "checkJs": true, // 允许在JS文件中报错，通常与allowJS一起使用
  "outDir": "./dist", // 指定输出目录
  "rootDir": "./", // 指定输出文件目录(用于输出)，用于控制输出目录结构
  "declaration": true, // 生成声明文件，开启后会自动生成声明文件
  "declarationDir": "./file", // 指定生成声明文件存放目录
  "emitDeclarationOnly": true, // 只生成声明文件，而不会生成js文件
  "sourceMap": true, // 生成目标文件的sourceMap文件
  "inlineSourceMap": true, // 生成目标文件的inline SourceMap，inline SourceMap会包含在生成的js文件中
  "declarationMap": true, // 为声明文件生成sourceMap
  "typeRoots": [], // 声明文件目录，默认时node_modules/@types
  "types": [], // 加载的声明文件包
  "removeComments":true, // 删除注释
  "noEmit": true, // 不输出文件,即编译后不会生成任何js文件
  "noEmitOnError": true, // 发送错误时不输出任何文件
  "noEmitHelpers": true, // 不生成helper函数，减小体积，需要额外安装，常配合importHelpers一起使用
  "importHelpers": true, // 通过tslib引入helper函数，文件必须是模块
  "downlevelIteration": true, // 降级遍历器实现，如果目标源是es3/5，那么遍历器会有降级的实现
  "strict": true, // 开启所有严格的类型检查
  "alwaysStrict": true, // 在代码中注入'use strict'
  "noImplicitAny": true, // 不允许隐式的any类型
  "strictNullChecks": true, // 不允许把null、undefined赋值给其他类型的变量
  "strictFunctionTypes": true, // 不允许函数参数双向协变
  "strictPropertyInitialization": true, // 类的实例属性必须初始化
  "strictBindCallApply": true, // 严格的bind/call/apply检查
  "noImplicitThis": true, // 不允许this有隐式的any类型
  "noUnusedLocals": true, // 检查只声明、未使用的局部变量(只提示不报错)
  "noUnusedParameters": true, // 检查未使用的函数参数(只提示不报错)
  "noFallthroughCasesInSwitch": true, // 防止switch语句贯穿(即如果没有break语句后面不会执行)
  "noImplicitReturns": true, //每个分支都会有返回值
  "esModuleInterop": true, // 允许export=导出，由import from 导入
  "allowUmdGlobalAccess": true, // 允许在模块中全局变量的方式访问umd模块
  "moduleResolution": "node", // 模块解析策略，ts默认用node的解析策略，即相对的方式导入
  "baseUrl": "./", // 解析非相对模块的基地址，默认是当前目录
  "paths": { // 路径映射，相对于baseUrl
    // 如使用jq时不想使用默认版本，而需要手动指定版本，可进行如下配置
    "jquery": ["node_modules/jquery/dist/jquery.min.js"]
  },
  "rootDirs": ["src","out"], // 将多个目录放在一个虚拟目录下，用于运行时，即编译后引入文件的位置可能发生变化，这也设置可以虚拟src和out在同一个目录下，不用再去改变路径也不会报错
  "listEmittedFiles": true, // 打印输出文件
  "listFiles": true// 打印编译的文件(包括引用的声明文件)
}

// 指定一个匹配列表（属于自动指定该路径下的所有ts相关文件）
"include": [
   "src/**/*"
],
// 指定一个排除列表（include的反向操作）
 "exclude": [
   "demo.ts"
],
// 指定哪些文件使用该配置（属于手动一个个指定文件）
 "files": [
   "demo.ts"
]
```

## 三、namespace 命名空间

命名空间中通过 export 将想要暴露的部分导出，如果不用 export 导出是无法读取其值的，命名空间可以进行合并

```ts
namespace a {
  export const Time: number = 1000;
  export const fn = <T>(arg: T): T => {
    return arg;
  };
  fn(Time);
}

namespace b {
  export const Time: number = 1000;
  export const fn = <T>(arg: T): T => {
    return arg;
  };
  fn(Time);
}

a.Time;
b.Time;
```

### 1.嵌套命名空间

```ts
namespace a {
  export namespace b {
    export class Vue {
      parameters: string;
      constructor(parameters: string) {
        this.parameters = parameters;
      }
    }
  }
}

let v = a.b.Vue;

new v("1");
```

### 2.抽离命名空间

#### 【1】a.ts

```ts
export namespace V {
  export const a = 1;
}
```

#### 【2】b.ts

```ts
import { V } from "../observer/index";

console.log(V);
```

### 3.应用案例

比如做跨端项目 h5 ios android 小程序等

```ts
namespace ios {
  export const pushNotification = (msg: string, type: number) => {
    // ......
  };
}

namespace android {
  export const pushNotification = (msg: string) => {
    // ......
  };

  export const callPhone = (phone: number) => {
    // ......
  };
}
```

## 四、泛型工具

### 1.Partial

Partial 用于将类型中的属性变为可选

```ts
interface User {
  name: string;
  age: number;
}

type test = Partial<User>;

//转换完成之后的结果

type test = {
  name?: string | undefined;
  age?: number | undefined;
};

//原理 通过keyof 获取到User的属性，然后遍历这个属性，然后给这个属性添加一个可选的问号
type CoustomPratial<T> = {
  [key in keyof T]?: T[key];
};
```

### 2.Required

Required 用于将类型中的属性变为必选

```ts
interface User {
  name?: string;
  age?: number;
}
//原理 通过keyof 获取到User的属性，然后遍历这个属性，然后去掉问号 -?
type CustomRequired<T> = {
  [key in keyof T]-?: T[key];
};

type test = Required<User>;
type test2 = CustomRequired<User>;

//结果
interface User {
  name: string;
  age: number;
}
```

### 3.Pick

Pick 用于从类型中选择一些属性

```ts
interface User {
  name?: string;
  age?: number;
}

//原理 keyof T => name | age 获取到T的属性，是一个联合类型，然后遍历这个属性，然后返回一个新类型
// 然后通过extends 约束K 必须是keyof T的子集
// 然后通过in 遍历K 然后返回一个新类型
type CoustomPick<T, K extends keyof T> = {
  [key in K]: T[key];
};

type test = Pick<User, "age">;

//结果
type test = {
  age?: number | undefined;
};
```

### 4.Exclude

Exclude 用于从类型中排除一些属性

```ts
//原理 为什么要搞never？ 因为never在联合类型中会被忽略
type CustomExclude<T, K> = T extends K ? never : T;

type test = Exclude<"a" | "b" | "c", "a" | "b">;

//结果
type test = "c";
```

### 5.Omit

Omit 用于从类型中排除一些属性

```ts
interface User {
  address?: string;
  name?: string;
  age?: number;
}

//原理
type CoustomOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type test = Omit<User, "age">;

//结果
type test = {
  address?: string | undefined;
  name?: string | undefined;
};
```

### 6.Record

Record 用于将类型中的属性变为必选，用来约束对象的 key 和 value

```ts
//record 约束对象的key和value

type Key = "c" | "x" | "k";

type Value = "唱" | "跳" | "rap" | "篮球";

// key不能少，value可以少，也可以全是rap，比较随意
let obj: Record<Key, Value> = {
  "c": "唱",
  "x": "跳",
  "k": "rap"
};

// 原理
/**
 * 对象的key只能是 string | number | symbol
 * 对象的value可以是任意类型
 *
 * K extends string | number | symbol
 *
 * 可以简写为 K extends keyof any
 * 因为 keyof any 为 string | number | symbol
 */

type ObjKey = keyof any;
type CustomRecord<K extends ObjKey, T> = {
  [key in K]: T;
};

// 支持嵌套约束
let obj: CustomRecord<Key, Record<Key, Value>> = {
  "c": {
    "c": "唱",
    "x": "跳",
    "k": "rap"
  },
  "x": {
    "c": "唱",
    "x": "跳",
    "k": "rap"
  },
  "k": {
    "c": "唱",
    "x": "跳",
    "k": "rap"
  }
};
```

### 7.ReturnType

ReturnType 用于获取函数返回值的类型

```ts
const fn = () => {
  return [1, 2, 3, "one", "two", "three"];
};

type resType = ReturnType<typeof fn>;

// 原理
// 获取动态的返回值 需要使用 infer 关键字去进行推断，infer可以给类型定义一个变量 如下 infer Res
// 然后通过T extends (...args: any[]) => infer Res ? Res : never; 去进行推断
type CustomReturnType<T extends Function> = T extends (...args: any[]) => infer Res ? Res : never;
```
