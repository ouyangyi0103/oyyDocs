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

## 一、高级类型

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
