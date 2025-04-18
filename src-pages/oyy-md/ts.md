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

## 六、高级类型

### 1.交叉类型

```ts
const mergeFn = <T, U>(arg1: T, arg2: U): T & U => {
  let res = {} as T & U;
  res = Object.assign(arg1, arg2);
  return res;
};
mergeFn({ a: "a" }, { b: "b" });
```

### 2.联合类型

```ts
const getLengthFn = (content: string | number): number => {
  if (typeof content == "string") {
    return content.length;
  } else {
    return content.toString().length;
  }
};
```

### 3.类型保护

```ts
const list = [1, 'a']
const getValue = () => {
  let number = Math.random() \* 10
  if (number < 5) {
    return list[0]
  } else {
    return list[1]
  }
}

const item = getValue() // 返回的是一个联合类型 number | string
function isString(value: number | string): value is string { // 使用函数类型的类型保护适用于逻辑复杂的
  return typeof value === 'string'
}

if (isString(item)) {
  console.log(item.length);
} else {
  console.log(item.toFixed());
}
// typeof 判断的类型只能是 string/number/boolean/symbol 这四种
if (typeof item === 'string') { // 简单的类型保护直接使用 typeof
  console.log(item.length);
} else {
  console.log(item.toFixed());
}
if ((<string>item).length) { // 可以使用类型断言,(item as string).length 或者 (<string>item).length
    console.log((<string>item).length); // 代码复杂的时候就需要使用很多类型断言，比较麻烦
} else {
  console.log((<number>item).toFixed());
}
class C1 {
  public age = 18;
  constructor() {}
}
class C2 {
  public name = "lison";
  constructor() {}
}
function getItem() {
  return Math.random() < 0.5 ? new C1() : new C2();
}
const item = getItem();
if (item instanceof C1) {
  console.log(item.age);
} else {
  console.log(item.name);
}
```

### 4.类型别名

```ts
type TypeString = string;
let str2: TypeString;
type PositionType<T> = { x: T; y: T };
const position1: PositionType<number> = {
  x: 1,
  y: -1
};
```

#### 【1】引用类型别名自己，只能在属性中使用类型别名自己

```ts
type Childs<T> = {
  current: T;
  child?: Childs<T>;
};
let c: Childs<string> = {
  current: "first",
  child: {
    current: "second",
    child: {
      current: "third"
      // ...还可以继续写，也可以不写
    }
  }
};
```

#### 【2】字符串字面量类型

```ts
type Name = "lison";
const name1: Name = "lison";
const name1: Name = "haha"; // 报错，因为 haha 不能赋值给类型 lison
type Direction = "north" | "east" | "south" | "west";
function getDirection(direction: Direction) {
  return direction.substr(0, 1);
}
getDirection("north");
```

#### 【3】数字字面量类型

```ts
type Age = 18;
interface Info {
  name: string;
  age: Age;
}
const \_info: Info = {
name: 'lison',
age: 18 // 只能是 18
}
```

#### 【4】可辨识联合两要素

具有普通的单例类型属性
一个类型别名包含了哪些类型的联合

```ts
interface Square {
  kind: "square";
  size: number;
}

interface Rectangle {
  kind: "rectangle";
  height: number;
  width: number;
}

interface Circle {
  kind: "circle";
  radius: number;
}

type Shape = Square | Rectangle | Circle;

// 不用完整性检查的话，在进行 s.kind 判断时，少判断一个是不会进行提示的
function assertNever(value: never): never {
  throw new Error("Unexpected object:" + value);
}
function getArea(s: Shape) {
  switch (s.kind) {
    case "square":
      return s.size * s.size;
      break;
    case "rectangle":
      return s.height * s.width;
      break;
    case "circle":
      return Math.PI * s.radius ** 2;
      break;
    default:
      return assertNever(s); // 完整性检查，如果 s.kind 少判断了一种，就会进行提示
      break;
  }
}
```

### 5.this 类型

```ts
class Counters {
  constructor(public count: number = 0) {}
  public add(value: number) {
    this.count += value;
    return this; // 返回实例，该方法可以进行链式调用
  }
  public subtract(value: number) {
    this.count -= value;
    return this;
  }
}

let counters1 = new Counters(10);
console.log(counters1.add(8).add(10));
class PowCounter extends Counters {
  constructor(public count: number = 0) {
    super(count);
  }
  public pow(value: number) {
    this.count = this.count ** value;
    return this;
  }
}

let powCounter = new PowCounter(2);
console.log(powCounter.pow(3).add(1).subtract(3));
```

### 6.索引类型--索引类型查询 & 索引访问

#### 【1】索引类型查询

keyof--连接一个类型，然后返回一个由这个类型的所有属性名组成的联合类型

```ts
interface Info {
  name: string;
  age: number;
}
let infoProp: keyof Info; // name | age
let infoProp = "name";
let infoProp = "age";
let infoProp = "sex"; // 报错，只能是 name | age
function getValue<T, K extends keyof T>(obj: T, names: K[]): T[K][] {
  return names.map(n => obj[n]);
}
const infoObj = {
  name: "lison",
  age: 18
};
let infoValue: (string | number)[] = getValue(infoObj, ["name", "age"]);
console.log(infoValue);
```

#### 【2】索引访问操作符[]

```ts
interface infos {
  name: string;
  age: number;
}
type NameTypes = infos["name"]; // string
function getPropty<T, K extends keyof T>(param: T, name: K): T[K] {
  return param[name];
}
const infoObj = {
  name: "lison",
  age: 18
};
let props1 = getPropty(infoObj, "name");
console.log(props1); // 'lison'
interface Objs<T> {
  [key: string]: T;
}
const objs1: Objs<number> = {
  age: 18
};
let keys: keyof Objs<number>;
interface Type {
  a: never;
  b: never;
  c: string;
  d: number;
  e: undefined;
  f: null;
  g: object;
}
// 在索引访问操作符里面使用 keyof，never & undefined & null 不会被获取到
type Test = Type[keyof Type]; // string | number | object 7.映射类型
interface Info {
  age: number;
  name: string;
  sex: string;
}
type ReadonlyType<T> = {
  readonly [P in keyof T]?: T[P]; // 可以将接口 Info 映射成只读属性和可选属性
};
type Info1 = ReadonlyType<Info>;
let info1: Info1 = {
  age: 18,
  name: "lison",
  sex: "man"
};
info1.age = 19; // 无法分配到 age,因为是只读属性
```

### 7.内置在 typeScript 中的映射类型

Readonly & Required & Partial & Pick & Omit & Record
Readonly & Partial & Pick 是同态的，Record 不是同态的，因为 Record 并不需要输入类型来拷贝属性，所以它不属于同态：

#### 【1】Readonly 源码

```ts
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
interface Info {
  age: number;
  name: string;
  sex: string;
}
type Info1 = Readonly<Info>; // 将接口里面的属性全部变为**只读属性
let info1: Info1 = {
  age: 18,
  name: "lison",
  sex: "man"
};
info1.age = 19; // 无法分配到 age,因为是只读属性
```

#### 【2】Required 源码

```ts
type Reauired<T> = {
  [P in keyof T]-?: T[P];
};
type Info2 = Required<Info>; // 将接口里面的属性全部变为**必选属性
let info2: Info2 = {
  age: 18,
  name: "lison" // 少写了 sex，就会报错，因为 Info2 里面的属性是必选属性
};
```

#### 【3】Partial 源码

```ts
type Partial<T> = {
  [P in keyof T]?: T[P];
};
type Info3 = Partial<Info>; // 将接口里面的属性全部变为可选属性
let info3: Info3 = {
  age: 18,
  name: "lison"
};
```

#### 【4】Pick 源码

```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
interface Info2 {
  name: string;
  age: number;
  address: string;
}
type Info3 = Pick<Info2, "age">; // Pick 选取类型中指定类型
const info6: Info3 = {
  age: 19
};
interface Info2 {
  name: string;
  age: number;
  address: string;
}
const info5: Info2 = {
  name: "oyy",
  age: 18,
  address: "changsha"
};
function getPickValue<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const res: any = {};
  keys.map(item => {
    res[item] = obj[item];
  });
  return res;
}
const nameAddress = getPickValue(info5, ["name", "age"]);
console.log(nameAddress); // {name: 'oyy', age: 18}
```

#### 【5】Omit 源码

```ts
interface Info2 {
  name: string;
  age: number;
  address: string;
}
type Info3 = Omit<Info2, "age">; // 去除类型中某些项
const info6: Info3 = {
  name: "oyy",
  address: "yunji"
};
```

#### 【6】Record 源码

```ts
// 适用于将对象中的每一个属性转换为其它值的一个场景
type Record<K extends keyof any, T> = {
  [P in K]: T;
};
type person = {
  prop1: string;
  prop2: string;
  prop3: string;
};
type someProps = Record<keyof person, number>;
let newPerson: someProps = {
  prop1: 111,
  prop2: 222,
  prop3: 444
};
interface CatInfo {
  age: number;
  breed: string;
}
type CatName = "miffy" | "boris" | "mordred"; // 字符串字面量类型
const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  boris: { age: 5, breed: "Maine Coon" },
  mordred: { age: 16, breed: "British Shorthair" }
};
console.log(cats.boris);
function mapObject<K extends string | number, T, U>(obj: Record<K, T>, f: (x: T) => U): Record<K, U> {
  let ret = <Record<K, U>>{};
  Object.keys(obj).map(key => {
    ret[key] = f(obj[key]);
  });
  return ret;
}
function mapObject<K extends string | number, T, U>(obj: Record<K, T>, f: (x: T) => U): Record<K, U> {
  let res: any = {};
  for (let key in obj) {
    res[key] = f(obj[key]);
  }
  return res;
}
let names = { 0: "hello", 1: "world", 2: "bey" };
let lengths = mapObject(names, el => el.length);
console.log(lengths); // {0: 5, 1: 5, 2: 3}
```

### 8.由映射类型进行推断

#### 【1】包装操作

```ts
type Proxy<T> = {
  get(): T;
  set(value: T): void;
};
type Proxify<T> = {
  [P in keyof T]: Proxy<T[P]>;
};
function proxify<T>(obj: T): Proxify<T> {
  let res = {} as Proxify<T>;
  for (let key in obj) {
    res[key] = {
      get: () => obj[key],
      set: value => (obj[key] = value)
    };
  }
  return res;
}
let prpos = {
  name: "lison",
  age: 18
};
let proxyProps = proxify(prpos);
proxyProps.name.set("oyy");
console.log(proxyProps.name.get()); // oyy
```

#### 【2】拆包操作

```ts
function unproxify<T>(t: Proxify<T>): T {
  const res = {} as T;
  for (let k in t) {
    res[k] = t[k].get();
  }
  return res;
}
let prx = unproxify(proxyProps);
console.log(prx); // {name: "oyy", age: 18}
```

#### 【3】增加和移除特定修饰符

```ts
type ReadonlyType<T> = {
  +readonly [P in keyof T]+?: T[P];
};
type Info1 = ReadonlyType<Info>;
//interface Info {
// readonly age?: number
// readonly name?: string
// readonly sex?: string
//}
type RemoveReadonlyType2<T> = {
  -readonly [P in keyof T]-?: T[P];
};
type Info2 = RemoveReadonlyType2<Info>;
//interface Info {
// age: number
// name: string
// sex: string
//}
```

#### 【4】元组和数组的映射类型

```ts
// 在元组和数组的映射类型会生成新的元组和数组，并不会创建一个新的类型
type MapToPromise<T> = {
  [K in keyof T]: Promise<T[K]>;
};
type Tuple = [number, string, boolean];
type PromiseTuple = MapToPromise<Tuple>;
let tuple1: PromiseTuple = [new Promise((resolve, reject) => resolve(1)), new Promise((resolve, reject) => resolve("a")), new Promise((resolve, reject) => resolve(true))];
```

### 9.unknown

#### 【1】任何类型都可以赋值给 unknown 类型

```ts
let value1: unknown;
value1 = "a";
value1 = 123;
```

#### 【2】如果没有类型断言或基于控制流的类型细化时，unknown 不可以赋值给其它类型，此时它只能赋值给 unknown 和 any 类型

```ts
let value2: unknown;
// let value3: string = value2 报错
value1 = value2;
```

#### 【3】如果没有类型断言或基于控制流的类型细化时，不能在它上面进行任何操作

```ts
let value4: unknown;
// value4 += 1 报错
```

#### 【4】unknown 与任何其它类型组成的交叉类型，最后都等于其它类型

```ts
type type1 = string & unknown; // type1 = string
type type2 = number & unknown; // type2 = number
type type3 = unknown & unknown; // type3 = unknown
type type4 = unknown & string[]; // type4 = string[]
```

#### 【5】unknown 与任何其它类型（除了 any）组成的联合类型，都等于 unknown 类型

```ts
type type5 = string | unknown; // type5 = unknown
type type6 = any | unknown; // type6 = any
type type7 = unknown | string[]; // type7 = unknown
```

#### 【7】never 类型是 unknown 的子类型

```ts
type type8 = never extends unknown ? true : false; // true
```

#### 【8】.keyof unknown 等于类型 never

```ts
type type9 = keyof unknown; // never
```

#### 【9】只能对 unknown 进行等或不等操作，不能进行其它操作

```ts
value1 === value2;
value1 !== value2;
// value1 += value2 报错
```

#### 【10】unknown 类型的值，不能访问它的属性，作为函数调用，作为类创建实例

```ts
let value9: unknown;
// 以下都会报错
// value9.age
// value9()
// new value9()
```

#### 【11】.使用映射类型时如果遍历的是 unknown 类型，则不会映射任何属性

```ts
type Types1<T> = {
  [P in keyof T]: number;
};
type type10 = Types1<any>; // type type10 = {[x: string]: number}
type type11 = Types1<unknown>; // type type11 = {}
```

#### 【12】条件类型

```ts
    T extends U ? X : Y
    type Type2<T> = T extends string ? string : number
    let index: Type2<'a'>
```

#### 【13】分布式条件类型

```ts
type TypeName<T> = T extends any ? T : never;
type Type3 = TypeName<string | number>; // type Type3 = string | number
type Diff<T, U> = T extends U ? never : T; // 相当于 Exclude
type Test = Diff<string | number | boolean, undefined | number>; // type Test = string | boolean
type Type7<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T]; // [keyof T]会获取类型不为 never 的属性名
interface Part {
  id: number;
  name: string;
  subparts: Part[];
  undatePart(newName: string): void;
}
type Test1 = Type7<Part>; // type Test1 = 'undatePart'
```

#### 【14】条件类型的类型推断 - infer 关键字

```ts
type Type8<T> = T extends any[] ? T[number] : T; // T[number]获取到的是值的类型
type Test3 = Type8<boolean[]>; // type Test3 = boolean
type Test4 = Type8<number>; // type Test4 = number
type Type9<T> = T extends Array<infer U> ? U : T;
type Test5 = Type9<string[]>;
```

#### 【15】预定义的有条件类型

```ts
// Exclude < T, U > --从 T 中剔除可以赋值给 U 的类型。选出 T 不在 U 类型中的类型
// Extract < T, U > --提取 T 中可以赋值给 U 的类型。
// NonNullable < T > --从 T 中剔除 null 和 undefined。
// ReturnType < T > --获取函数返回值类型。
// InstanceType < T > --获取构造函数类型的实例类型。
type T00 = Exclude<"a" | "b" | "c" | "d", "a" | "c" | "f">; // "b" | "d"
type T02 = Exclude<string | number | (() => void), Function>; // string | number
type T01 = Extract<"a" | "b" | "c" | "d", "a" | "c" | "f">; // "a" | "c"
type T03 = Extract<string | number | (() => void), Function>; // () => void
type T04 = NonNullable<string | number | undefined>; // string | number
type T05 = NonNullable<(() => string) | string[] | null | undefined>; // (() => string) | string[]
type T10 = ReturnType<() => string>; // string
type T11 = ReturnType<(s: string) => void>; // void
type T12 = ReturnType<<T>() => T>; // {}
type T13 = ReturnType<<T extends U, U extends number[]>() => T>; // number[]
class C {
  x = 0;
  y = 0;
}
type T20 = InstanceType<typeof C>; // C
type T21 = InstanceType<any>; // any
type T22 = InstanceType<never>; // any
```

## 七、class 类

### 1. interface 进行类型约束

```ts
interface Options {
  el: string | HTMLElement;
  init(): viod;
}

interface VueCls {
  options: Options;
}

class Vue implements VueCls {
  options: Options;
  constructor(options: Options) {
    this.options = options;
  }
  init(): void {
    console.log("init");
  }
}

new Vue({
  el: "#app",
  data: {
    msg: "hello"
  }
});
```

### 2. 类的继承

```ts
interface ManX {
  sex: string;
  height: number;
}

class Person {
  name: string;
  age: number;
}

class Man extends Person implements ManX {
  sex: string;
  height: number;
  constructor(name: string, age: number, sex: string, height: number) {
    super(name, age);
    this.sex = sex;
    this.height = height;
  }
}

const man = new Man();
man.name = "张三";
man.age = 18;
man.sex = "男";
```

### 3. 类的修饰符

#### 【1】public

修饰的属性或方法是公有的，可以在任何地方被访问到，默认所有的属性和方法都是 public 的

```ts
class Person {
  public name: string;
  public age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

class Man extends Person {
  constructor(name: string, age: number) {
    super(name, age);
  }
}

const man = new Man("张三", 18);
```

#### 【2】private

private 修饰的属性或方法是私有的，不能在声明它的类的外部（实例）访问，子类中也不可以访问

```ts
class Parent {
  constructor(private age: number) {
    this.age = age;
  }
}
const p = new Parent(18);
console.log(p.age); // 报错

class Child extends Parent {
  constructor(age: number) {
    super(age);
  }
}
const c = new Child(18);
console.log(c.age); // 报错
```

#### 【3】protected

修饰的属性或方法是受保护的，类里面，子类里面都可以访问，不能在声明它的类的外部（实例）访问

```ts
class UserInfo {
  constructor(public readonly name: string) {
    this.name = name;
  }
}
const userinfo = new UserInfo("lison");
userinfo.name = "888"; // 报错，只读属性不能被修改
```

#### 【4】readonly

只读属性关键字，只允许出现在属性声明或索引签名或构造函数中。注意如果 readonly 和其他访问修饰符同时存在的话，需要写在其后面。

```ts
class UserInfo {
  constructor(public readonly name: string) {
    this.name = name;
  }
}
const userinfo = new UserInfo("lison");
userinfo.name = "888"; // 报错，只读属性不能被修改
```

#### 【5】static

修饰的属性或方法是静态的，不能通过实例访问，只能通过类访问

```ts
class Parent {
  public static age: number;
  constructor() {}
  public static getAge() {
    return Parent.age;
  }
}
const p = new Parent();
console.log(p.age); // 报错，因为age是静态属性，不需要实例化，实例上面不存在静态方法
```

#### 【6】可选属性

可选属性是指在类中可以存在也可以不存在的属性。

```ts
class UserInfo {
  constructor(public readonly name: string) {
    this.name = name;
  }
}
const userinfo = new UserInfo("lison");
userinfo.name = "888"; // 报错，只读属性不能被修改
```

#### 【7】属性的封装

```ts
class Person {
  private _name: string;
  private _age: number;

  constructor(name: string, age: number) {
    this._name = name;
    this._age = age;
  }

  // 存取器---TS中设置getter方法的方式
  get name() {
    console.log("get name()执行了");
    return this._name;
  }

  set name(newValue: string) {
    console.log("set name()执行了");
    this._name = newVlaue;
  }

  get age() {
    return this._age;
  }

  set age(newValue: number) {
    if (newVlaue > 0) {
      this._age = newVlaue;
    }
  }
}

const person = new Person("oyy", 18);
console.log(person.name); // oyy
person.name = "pq";
console.log(person.name); // pq
```

#### 【8】接口和类的结合

```ts
// 写一个接口给类去使用
interface PerItf {
  name: string;
  age: number;
  getName: () => void;
}

class Mperson implements PerItf {
  name: string = "";
  age: number = 18;
  getName() {}
}

let m = new Mperson();

--------------------------------

interface foodInterface {
  type: string;
}
class foodClass implements foodInterface {
  public type: string;
  // public static type: string 不能使用static修饰，因为type是类的静态属性，那么访问的时候只能通过foodClass类
  // 本身访问，在实例上是没有type属性，接口检测的是使用该接口定义的类创建的实例，所以实例上没有type属性
}
class A {
  protected name: string;
}
interface I extends A {}
class B extends A implements I {
  // 对于protected受保护的属性，必须先要继承，再将类与接口结合
  public name: string;
}
```

#### 【9】抽象类

以 abstract 开头的类是抽象类，抽象类和其它类区别不大，只是不能用来创建对象（不允许被实例化），抽象类就是专门用来被继承的类，抽象类是不允许被实例化的。

```ts
abstract class People {
  constructor(public name: string) {}
  // 抽象方法只能定义在抽象类中，子类必须对抽象方法进行重写（即必须被子类实现）
  public abstract printName(): void;
}

let p = new People(); // 报错，抽象类不能被实例化

// 抽象类中的抽象方法必须被子类实现
class Man extends People {
  constructor(name: string) {
    super(name);
    this.name = name;
  }
  public printName() {
    console.log(this.name); // lison
  }
}
const man = new Man("lison");
man.printName();

// abstract还能标记class里面的属性的存取器
abstract class People {
  public abstract _name: string;
  abstract get insideName(): string;
  abstract set insideName(newValue: string);
}
class Man extends People {
  public _name: string;
  public insideName: string;
}
```

## 八、元组

元组是另一种数据结构，它允许我们定义一个已知元素数量和类型的数组，各元素的类型不必相同。

```ts
let tupleArr: [string, number];
tupleArr = ["hello", 10]; // OK 必须按照定义好的顺序赋值
tupleArr = [10, "hello", 9]; // Error 定义的tupleArr长度为2，长度不能大于2
```

## 九、枚举

枚举不是用来定义类型的，是用来列举数据用的

```ts
enum Gender {
  /** 男 */
  Male = 0,
  /** 女 */
  Female = 1
}
let i: { name: string; gender: Gender };
i = { name: "oyy", gender: Gender.Male };
console.log(i.gender === Gender.Male);

enum actionType {
  /** 跑 */
  Run = "run",
  /** 吃 */
  Eat = "eat"
}
const a = actionType.Run;

// 可以这样去使用枚举
enum StatusCode {
  success = 200,
  paramsErr = 400,
  serveErr = 500
}

let code: string | number = 200;
if (code == StatusCode.success) {
  console.log("请求成功");
} else if (StatusCode.paramsErr) {
  console.log("请求失败");
} else if (StatusCode.serveErr) {
  console.log("请求失败,服务器错误");
}

// 注意 增长枚举的值会自动增长

enum StatusCode {
  success,
  paramsErr,
  serveErr
}
console.log(StatusCode.success, StatusCode.paramsErr, StatusCode.serveErr); // 0 1 2
```

### 1.数字枚举

例如 红绿蓝 Red = 0 Green = 1 Blue= 2 分别代表红色 0 绿色为 1 蓝色为 2

```ts
enum Color {
  Red,
  Green,
  Blue
}

//也可以这样写
enum Color {
  Red = 0,
  Green = 1,
  Blue = 2
}
```

### 2. 增长枚举

```ts
enum StatusCode {
  success,
  paramsErr = 400,
  serveErr
}
console.log(StatusCode.success, StatusCode.paramsErr, StatusCode.serveErr); // 0 400 401
```

### 3. 字符串枚举

字符串枚举的概念很简单。 在一个字符串枚举里，每个成员都必须用字符串字面量，或另外一个字符串枚举成员进行初始化。

```ts
enum StatusCode {
  success = "success",
  paramsErr = "paramsErr",
  serveErr = "serveErr"
}
```

### 4. 异构枚举

枚举可以混合字符串和数字成员

```ts
enum StatusCode {
  success = "success",
  paramsErr = 400,
  serveErr = 500
}
```

### 5. 接口枚举

枚举类型可以和接口结合使用，来约束枚举的值

```ts
enum Types {
  yyds,
  dddd
}
interface A {
  red: Types.yyds;
}

let obj: A = {
  red: Types.yyds
};
```
