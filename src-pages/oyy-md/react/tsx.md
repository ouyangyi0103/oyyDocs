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

## TSX

TSX 是 TypeScript 的语法扩展，它允许我们在 JavaScript 中使用类似于 HTML 的语法来描述 UI 结构。

### 1. 语法

#### 1.1 绑定变量 `{}`

```tsx
function App() {
  const num: number = 333;
  const fn = () => "test";
  return (
    <>
      {"11" /** 字符串用法 */}
      {num /** 变量用法 */}
      {fn() /** 函数用法 */}
      {new Date().getTime() /** 日期用法 */}
    </>
  );
}
//绑定class(className) id 属性等等 都是一样的
function App() {
  const value: string = "A";
  return (
    <>
      <div data-index={value} className={value} id={value}>
        {value}
      </div>
    </>
  );
}
//绑定多个class(className)
function App() {
  const a: string = "A";
  return (
    <>
      <div className={`${a} class2`}>{value}</div>
    </>
  );
}
//绑定样式style
function App() {
  const styles = { color: "red" };
  return (
    <>
      <div style={styles}>test</div>
    </>
  );
}
```

#### 1.2 绑定事件 `onClick`

```tsx
function App() {
  return <div onClick={() => console.log("change")}>test</div>;
}
```

#### 1.3 tsx 使用泛型

正常写泛型语法会跟 tsx 语法冲突，他会把泛型理解成是一个元素，解决方案后面加一个,即可

```tsx
function App() {
  const value: string = "小满";
  const clickTap = <T,>(params: T) => console.log(params);
  return (
    <>
      <div onClick={() => clickTap(value)}>{value}</div>
    </>
  );
}
```

#### 1.4 渲染代码片段

dangerouslySetInnerHTML 的值是一个对象，该对象包含一个名为 \_\_html 的属性，且值为你想要插入的 HTML 字符串

```tsx
function App() {
  const value: string = '<section style="color:red">小满</section>';
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: value }}></div>
    </>
  );
}
```

#### 1.5 map 遍历

```tsx
function App() {
  const arr: string[] = ["小满", "中满", "大满"];
  return (
    <>
      {arr.map((item, index) => {
        return <div key={index}>{item}</div>;
      })}
    </>
  );
}
```
