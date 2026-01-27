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

# TS

## 一、基础类型

基础类型：Boolean、Number、String、null、undefined 以及 ES6 的 Symbol 和 ES10 的 BigInt

### 1. 布尔类型

```ts
let isDone: boolean = false;
```

### 2. 数字类型

```ts
let notANumber: number = NaN; //NaN 属于 number 类型
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d; //十六进制
let binaryLiteral: number = 0b1010; //二进制
let octalLiteral: number = 0o744; //八进制
```

### 3. 字符串类型

```ts
let name: string = "oyy";
let name2: string = `oyy`;
```

### 4.空值类型

JavaScript 没有空值（Void）的概念，在 TypeScript 中，可以用 void 表示没有任何返回值的函数
void 类型的用法，主要是用在我们不希望调用者关心函数返回值的情况下，比如通常的异步回调函数

```ts
function voidFn(): void {
  console.log("test void");
}
```

void 也可以定义 undefined 和 null 类型

```ts
let u: void = undefined;
let n: void = null;
```

### 5. null 和 undefined

```ts
let u: undefined = undefined; //定义undefined
let n: null = null; //定义null
```

void 和 undefined 和 null 最大的区别
与 void 的区别是，undefined 和 null 是所有类型的子类型。也就是说 undefined 类型的变量，可以赋值给 string 类型的变量：

```ts
//这样写会报错 void类型不可以分给其他类型
let test: void = undefined;
let num2: string = "1";

num2 = test;

//这样是没问题的
let test: null = null;
let num2: string = "1";

num2 = test;

//或者这样的
let test: undefined = undefined;
let num2: string = "1";

num2 = test;
```

:::tip
如果你配置了 tsconfig.json 开启了严格模式

```js
{
  "compilerOptions": {
    "strict": true
  }
}
```

// 这样会有警告
let n:viod = null

:::

### 6. 任意类型

```ts
nodejs 环境执行ts
npm i @types/node --save-dev （node环境支持的依赖必装）
npm i ts-node --g
```

没有强制限定哪种类型，随时切换类型都可以 我们可以对 any 进行任何操作，不需要检查类型

```ts
let anys: any = 123;
anys = "123";
anys = true;
```

声明变量的时候没有指定任意类型默认为 any

```ts
let anys;
anys = 123;
anys = "123";
anys = true;
```

### 7. unknown 类型

unknown 类型表示未知类型，与 any 类型类似，但更安全。

```ts
//unknown 可以定义任何类型的值
let value: unknown;

value = true; // OK
value = 42; // OK
value = "Hello World"; // OK
value = []; // OK
value = {}; // OK
value = null; // OK
value = undefined; // OK
value = Symbol("type"); // OK

//这样写会报错unknow类型不能作为子类型只能作为父类型 any可以作为父类型和子类型
//unknown类型不能赋值给其他类型
let names: unknown = "123";
let names2: string = names;

//这样就没问题 any类型是可以的
let names: any = "123";
let names2: string = names;

//unknown可赋值对象只有unknown 和 any
let bbb: unknown = "123";
let aaa: any = "456";

aaa = bbb;

// 如果是any类型在对象没有这个属性的时候还在获取是不会报错的
let obj: any = { b: 1 };
obj.a;

// 如果是unknow 是不能调用属性和方法
let obj: unknown = { b: 1, ccc: (): number => 213 };
obj.b;
obj.ccc();
```

## 二、object、Object 以及{} 这三个类型

### 1.Object

:::tip
Object 类型是所有 Object 类的实例的类型。 由以下两个接口来定义：

1. Object 接口定义了 Object.prototype 原型对象上的属性；
2. ObjectConstructor 接口定义了 Object 类的属性， 如上面提到的 Object.create()。

这个类型是跟原型链有关的原型链顶层就是 Object，所以值类型和引用类型最终都指向 Object，所以他包含所有类型。
:::

### 2.object

object 代表所有非值类型的类型，例如 数组 对象 函数等，常用于泛型约束

```ts
let o: object = {}; //正确
let o1: object = []; //正确
let o2: object = () => 123; //正确
let b: object = "123"; //错误
let c: object = 123; //错误
```

### 3.{}

看起来很别扭的一个东西 你可以把他理解成 new Object 就和我们的第一个 Object 基本一样 包含所有类型

:::tip
注意：字面量模式是不能修改值的
:::

```ts
let o: object = {}; //正确
let o1: object = []; //正确
let o2: object = () => 123; //正确
let b: object = "123"; //错误
let c: object = 123; //错误
```

## 三、接口 interface

### 1. 接口定义

在 typescript 中，我们定义对象的方式要用关键字 interface（接口），我的理解是使用 interface 来定义一种约束，让数据的结构满足约束的格式。定义方式如下：

```ts
//这样写是会报错的 因为我们在person定义了a，b但是对象里面缺少b属性
//使用接口约束的时候不能多一个属性也不能少一个属性
//必须与接口保持一致
interface Person {
  b: string;
  a: string;
}

const person: Person = {
  a: "213"
};
```

### 2. 接口的继承

接口可以继承多个接口，用逗号分隔，也可以继承多个接口，用逗号分隔。

```ts
interface Person {
  name: string;
  age: number;
}

interface Person2 {
  sex: string;
}

interface Person3 extends Person, Person2 {
  high: number;
}

const person3: Person3 = {
  name: "123",
  age: 123,
  sex: "123",
  high: 170
};
```

### 3. 接口的合并

接口可以合并，用逗号分隔，也可以合并，用逗号分隔。接口合并的时候，如果两个接口有相同的属性，那么合并后的属性会以最后一个接口的属性为准。

```ts
interface A {
  name: string;
}
interface A {
  age: number;
}
var x: A = { name: "xx", age: 20 };
```

### 4. 属性修饰符

#### 【1】. 可选属性

可选属性是指在对象中可以存在也可以不存在的属性。

```ts
interface Person {
  name: string;
  age?: number;
}
```

#### 【2】. 只读属性

只读属性是指在对象中只能存在不能修改的属性。

```ts
interface Person {
  readonly name: string;
}

const person: Person = {
  name: "123"
};

person.name = "789"; //错误
```

#### 【3】. 索引签名

索引签名是指在对象中可以存在多个属性，并且这些属性的类型可以不同。

```ts
interface Person {
  name: string;
  age: number;
  [key: string]: string;
}

const person: Person = {
  name: "123",
  age: 18,
  sex: "男"
};
```

#### 【4】. interface 定义函数类型

函数类型定义是指在函数中可以存在多个参数，并且这些参数的类型可以不同。

```ts
interface Fn {
  (a: number, b: number): number;
}

const fn: Fn = (a, b) => {
  return a + b;
};

fn(1, 2);
```

## 四、数组类型

### 1. 数组类型定义

数组类型定义是指在数组中可以存在多个元素，并且这些元素的类型可以不同。

```ts
let arr: number[] = [1, 2, 3];
// 数组泛型
let arr2: Array<number> = [1, 2, 3];
```

### 2. 接口表示数组

一般用来描述类数组

```ts
interface Arr {
  [index: number]: number;
}

let arr: Arr = [1, 2, 3];
```

### 3. 多维数组

```ts
let arr: number[][] = [
  [1, 2, 3],
  [4, 5, 6]
];
let arr2: Array<Array<number>> = [
  [1, 2, 3],
  [4, 5, 6]
];
```

### 4. arguments 类数组

arguments 是一个类数组对象，它包含了函数调用时传递的参数。

```ts
function Arr(...args: any): void {
  console.log(arguments);
  //错误的arguments 是类数组不能这样定义
  let arr: number[] = arguments;
}
Arr(111, 222, 333);

function Arr(...args: any): void {
  console.log(arguments);
  //ts内置对象IArguments 定义
  let arr: IArguments = arguments;
}
Arr(111, 222, 333);

//其中 IArguments 是 TypeScript 中定义好了的类型，它实际上就是：
interface IArguments {
  [index: number]: any;
  length: number;
  callee: Function;
}
```

## 五、函数类型

### 1. 函数类型定义

```ts
//注意，参数不能多传，也不能少传 必须按照约定的类型来
const fn = (name: string, age: number): string => {
  return name + age;
};
fn("张三", 18);
```

### 2. 可选参数

```ts
//通过?表示该参数为可选参数
const fn = (name: string, age?: number): string => {
  return name + age;
};
fn("张三");
```

### 3. 默认参数

```ts
//通过=表示该参数为默认参数
const fn = (name: string, age: number = 18): string => {
  return name + age;
};
```

### 4. 剩余参数

```ts
//通过...表示该参数为剩余参数
const fn = (name: string, ...args: number[]): string => {
  return name + args;
};

fn("张三", 1, 2, 3, 4, 5);
```

### 5. 接口定义函数类型

```ts
//定义参数 num 和 num2  ：后面定义返回值的类型
interface Add {
  (num: number, num2: number): number;
}

const fn: Add = (num: number, num2: number): number => {
  return num + num2;
};
fn(5, 5);

interface User {
  name: string;
  age: number;
}
function getUserInfo(user: User): User {
  return user;
}
```

### 6.函数中的 this 类型

ts 中可以定义 this 的类型，在 js 中无法使用，必须是第一个参数定义 this 的类型

```ts
interface Obj {
  user: number[];
  add: (this: Obj, num: number) => void;
}

const obj: Obj = {
  user: [1, 2, 3],
  add(this: Obj, num: number) {
    this.user.push(num);
  }
};

obj.add(4);
console.log(obj.user);
```

### 7. 函数重载

重载是方法名字相同，而参数不同，返回类型可以相同也可以不同。

如果参数类型不同，则参数类型应设置为 any。

参数数量不同你可以将不同的参数设置为可选。

```ts
//重载
let user: number[] = [1, 2, 3];

function findNum(ids: number[]): number[]; // 如果传入一个数组，就做添加
function findNum(id: number): number[]; // 如果传入一个数字，就是查询一个
function findNum(): number[]; // 如果没有传入参数，就是查询全部
function findNum(ids?: number | number[]): number[] {
  if (typeof ids === "number") {
    return user.filter(item => item === ids);
  } else if (Array.isArray(ids)) {
    return user.push(...ids);
  } else {
    return user;
  }
}
```
