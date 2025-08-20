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

## 一、虚拟 DOM(Virtual DOM)

Virtual DOM 就是用 JavaScript 对象去描述一个 DOM 结构，虚拟 DOM 不是直接操作浏览器的真实 DOM，而是首先对 UI 的更新在虚拟 DOM 中进行，再将变更高效地同步到真实 DOM 中。

### 1.使用虚拟 dom 的优点

1. 性能优化：直接操作真实 DOM 是比较昂贵的，尤其是当涉及到大量节点更新时。虚拟 DOM 通过减少不必要的 DOM 操作，主要体现在 diff 算法的复用操作，其实也提升不了多少性能。
2. 跨平台性：虚拟 DOM 是一个与平台无关的概念，它可以映射到不同的渲染目标，比如浏览器的 DOM 或者移动端(React Native)的原生 UI。
   ![vnode](/react/vnode.png)

### 2.实现简易虚拟 DOM

```tsx
const App = () => {
  return (
    <div id="2">
      <span>小满zs</span>
    </div>
  );
};
```

上面这段代码会通过 babel 或者 swc 转换成

```tsx
const App = () => {
  return React.createElement("div", { id: 2 }, React.createElement("span", null, "小满zs"));
};
```

接着我们就来实现 React.createElement

### 3.React.createElement 的简易实现

1. 用于生成虚拟 DOM 树，返回一个包含 type（元素类型）和 props（属性和子元素）的对象。 children 可以是文本或其他虚拟 DOM 对象。 React.createTextElement:
2. 用于处理文本节点，将字符串封装成虚拟 DOM 对象。 React.render:
3. 将虚拟 DOM 转化为实际 DOM 元素。 使用递归的方式渲染所有子元素。 最后将生成的 DOM 节点插入到指定的容器中

```tsx
const React = {
  createElement(type, props = {}, ...children) {
    return {
      type,
      props: {
        ...props,
        children: children.map(
          child =>
            typeof child === "object"
              ? child // 如果子元素是对象（嵌套元素），返回对象
              : this.createTextElement(child) // 否则将字符串转换为文本元素
        )
      }
    };
  },

  createTextElement(text) {
    // 文本是没有props children什么的 这样做只是为了结构统一方便遍历
    return {
      type: "TEXT_ELEMENT",
      props: {
        nodeValue: text,
        children: []
      }
    };
  }
};
```

接下来需要完成虚拟 dom 转 fiber 结构和时间切片

## 二、深入理解任务切片(时间切片)

要先理解切片得先理解浏览器一帧做些什么

### 1.浏览器一帧做些什么

1. 处理事件的回调 click...事件
2. 处理计时器的回调
3. 开始帧
4. 执行 requestAnimationFrame 动画的回调
5. 计算机页面布局计算 合并到主线程
6. 绘制
7. 如果此时还有空闲时间，执行 requestIdleCallback

例如：要更新 10000 条 dom 数据,我们可以分成三个小任务进行更新，并且把每一段任务插入 requestIdleCallback 如图
![foo](/react/time.png)

### 2. requestidlecallback

它提供了一种机制，允许开发者在浏览器空闲时运行低优先级的任务，而不会影响关键任务和动画的性能。
::: danger
注意：React 并不是使用这个原生浏览器的函数实现的，他是使用的这个函数的思想，react 自己实现了这么一个函数
:::

#### 2.1 requestidlecallback 执行阶段

::: tip

1. 处理事件的回调 click...事件
2. 处理计时器的回调
3. 开始帧
4. 执行 requestAnimationFrame 动画的回调
5. 计算机页面布局计算 合并到主线程
6. 绘制
7. 上面 6 个步骤完成后，如果此时还有空闲时间，执行 requestIdleCallback
   :::

#### 2.2 requestidlecallback 基本用法

requestidlecallback 接受一个回调函数 callback 并且在回调函数中会注入参数 deadline

deadline 有两个值:

1. deadline.timeRemaining() 返回是否还有空闲时间(毫秒)

2. deadline.didTimeout 返回是否因为超时被强制执行(布尔值)

options:

{ timeout: 1000 } 指定回调的最大等待时间（以毫秒为单位）。如果在指定的 timeout 时间内没有空闲时间，回调会强制执行，避免任务无限期推迟
这个案例模拟了在浏览器空闲时，渲染 1000 条 dom 元素，非常流畅

```tsx
const total = 1000; // 定义需要生成的函数数量，即1000个任务
const arr = []; // 存储任务函数的数组

// 生成1000个函数并将其添加到数组中
function generateArr() {
  for (let i = 0; i < total; i++) {
    // 每个函数的作用是将一个 <div> 元素插入到页面的 body 中
    arr.push(function () {
      document.body.innerHTML += `<div>${i + 1}</div>`; // 将当前索引 + 1 作为内容
    });
  }
}
generateArr(); // 调用函数生成任务数组

// 用于调度和执行任务的函数
function workLoop(deadline) {
  // 检查当前空闲时间是否大于1毫秒，并且任务数组中还有任务未执行
  if (deadline.timeRemaining() > 1 && arr.length > 0) {
    const fn = arr.shift(); // 从任务数组中取出第一个函数
    fn(); // 执行该函数，即插入对应的 <div> 元素到页面中
  }
  // 再次使用 requestIdleCallback 调度下一个空闲时间执行任务
  requestIdleCallback(workLoop);
}

// 开始调度任务，在浏览器空闲时执行 workLoop
requestIdleCallback(workLoop, { timeout: 1000 });
```

### 3.提问

#### 3.1 为什么 React 不用原生 requestIdleCallback 实现呢？

1. 兼容性差 Safari 并不支持
2. 控制精细度 React 要根据组件优先级、更新的紧急程度等信息，更精确地安排渲染的工作
3. 执行时机 requestIdleCallback(callback) 回调函数的执行间隔是 50ms（W3C 规定），也就是 20FPS，1 秒内执行 20 次，间隔较长。
4. 差异性 每个浏览器实现该 API 的方式不同，导致执行时机有差异有的快有的慢

#### 3.2 requestIdleCallback 替代方案是什么？

选择 MessageChannel 的原因，是首先异步得是个宏任务，因为宏任务中会在下次事件循环中执行，不会阻塞当前页面的更新。MessageChannel 是一个宏任务。
没选常见的 setTimeout，是因为 MessageChannel 能较快执行，在 0 ～ 1ms 内触发，像 setTimeout 即便设置 timeout 为 0 还是需要 4 ～ 5ms。相同时间下，MessageChannel 能够完成更多的任务。
若浏览器不支持 MessageChannel，还是得降级为 setTimeout。

#### 3.3 MessageChannel 基本用法

MessageChanne 设计初衷是为了方便 我们在不同的上下文之间进行通讯，例如 web Worker,iframe 它提供了两个端口（port1 和 port2），通过这些端口，消息可以在两个独立的线程之间双向传递

```tsx
// 创建 MessageChannel
const channel = new MessageChannel();
const port1 = channel.port1;
const port2 = channel.port2;

// 设置 port1 的消息处理函数
port1.onmessage = event => {
  console.log("Received by port1:", event.data);
  port1.postMessage("Reply from port1"); // 向 port2 发送回复消息
};

// 设置 port2 的消息处理函数
port2.onmessage = event => {
  console.log("Received by port2:", event.data);
};

// 通过 port2 发送消息给 port1
port2.postMessage("Message from port2");
```

## 三、实现 react 简易版调度器(也就是模拟 requestIdleCallback)

React 调度器给每一个任务分配了优先级

::: tip

1. ImmediatePriority : 立即执行的优先级，级别最高
2. UserBlockingPriority : 用户阻塞级别的优先级
3. NormalPriority : 正常的优先级
4. LowPriority : 低优先级
5. IdlePriority : 最低阶的优先级
   :::

同时还给每个任务设置了过期时间，过期时间越短，优先级越高

声明 taskQueue 为数组，存储每个任务的信息，包括优先级，过期时间，回调函数

声明 isPerformingWork 为布尔值，表示当前是否在执行任务

声明 port 为 MessageChannel，用于发送和接收消息

然后将任务添加到队列里面，并且添加进去的时候还需要根据优先级进行排序，然后调用 workLoop 执行任务

```tsx
const ImmediatePriority = 1; // 立即执行的优先级, 级别最高 [点击事件，输入框，]
const UserBlockingPriority = 2; // 用户阻塞级别的优先级, [滚动，拖拽这些]
const NormalPriority = 3; // 正常的优先级 [redner 列表 动画 网络请求]
const LowPriority = 4; // 低优先级  [分析统计]
const IdlePriority = 5; // 最低阶的优先级, 可以被闲置的那种 [console.log]

// 获取当前时间
function getCurrentTime() {
  return performance.now();
}

class SimpleScheduler {
  constructor() {
    this.taskQueue = []; // 任务队列
    this.isPerformingWork = false; // 当前是否在执行任务

    // 使用 MessageChannel 处理任务调度
    const channel = new MessageChannel();
    this.port = channel.port2;
    channel.port1.onmessage = this.performWorkUntilDeadline.bind(this);
  }

  // 调度任务
  scheduleCallback(priorityLevel, callback) {
    const curTime = getCurrentTime();
    let timeout;
    // 根据优先级设置超时时间
    switch (priorityLevel) {
      case ImmediatePriority:
        timeout = -1;
        break;
      case UserBlockingPriority:
        timeout = 250;
        break;
      case LowPriority:
        timeout = 10000;
        break;
      case IdlePriority:
        timeout = 1073741823;
        break;
      case NormalPriority:
      default:
        timeout = 5000;
        break;
    }

    const task = {
      callback,
      priorityLevel,
      expirationTime: curTime + timeout // 直接根据当前时间加上超时时间
    };

    this.push(this.taskQueue, task); // 将任务加入队列
    this.schedulePerformWorkUntilDeadline();
  }

  // 通过 MessageChannel 调度执行任务
  schedulePerformWorkUntilDeadline() {
    if (!this.isPerformingWork) {
      this.isPerformingWork = true;
      this.port.postMessage(null); // 触发 MessageChannel 调度
    }
  }

  // 执行任务
  performWorkUntilDeadline() {
    this.isPerformingWork = true;
    this.workLoop();
    this.isPerformingWork = false;
  }

  // 任务循环
  workLoop() {
    let curTask = this.peek(this.taskQueue);
    while (curTask) {
      const callback = curTask.callback;
      if (typeof callback === "function") {
        callback(); // 执行任务
      }
      this.pop(this.taskQueue); // 移除已完成任务
      curTask = this.peek(this.taskQueue); // 获取下一个任务
    }
  }

  // 获取队列中的任务
  peek(queue) {
    return queue[0] || null;
  }

  // 向队列中添加任务
  push(queue, task) {
    queue.push(task);
    queue.sort((a, b) => a.expirationTime - b.expirationTime); // 根据优先级排序，优先级高的在前 从小到大
  }

  // 从队列中移除任务
  pop(queue) {
    return queue.shift();
  }
}

// 测试
const scheduler = new SimpleScheduler();

scheduler.scheduleCallback(LowPriority, () => {
  console.log("Task 1: Low Priority");
});

scheduler.scheduleCallback(ImmediatePriority, () => {
  console.log("Task 2: Immediate Priority");
});

scheduler.scheduleCallback(IdlePriority, () => {
  console.log("Task 3: Idle Priority");
});

scheduler.scheduleCallback(UserBlockingPriority, () => {
  console.log("Task 4: User Blocking Priority");
});

scheduler.scheduleCallback(NormalPriority, () => {
  console.log("Task 5: Normal Priority");
});
```

执行顺序为 2 4 5 1 3

## 四、React Fiber

Fiber 是 React 16 引入的一种新的协调引擎，用于解决和优化 React 应对复杂 UI 渲染时的性能问题

### 1.作用

为了解决 React15 在大组件更新时产生的卡顿现象，React 团队提出了 Fiber 架构，并在 React16 发布，将`同步递归无法中断的更新`重构为`异步的可中断更新`

它实现了 4 个具体目标

1. 可中断的渲染：Fiber 允许将大的渲染任务拆分成多个小的工作单元（Unit of Work），使得 React 可以在空闲时间执行这些小任务。当浏览器需要处理更高优先级的任务时（如用户输入、动画），可以暂停渲染，先处理这些任务，然后再恢复未完成的渲染工作。

2. 优先级调度：在 Fiber 架构下，React 可以根据不同任务的优先级决定何时更新哪些部分。React 会优先更新用户可感知的部分（如动画、用户输入），而低优先级的任务（如数据加载后的界面更新）可以延后执行。

3. 双缓存树（Fiber Tree）：Fiber 架构中有两棵 Fiber 树——`currentFiberTree（当前正在渲染的 Fiber 树）`和 `workInProgressFiberTree（正在处理的 Fiber 树）`。React 使用这两棵树来保存更新前后的状态，从而更高效地进行比较和更新。

4. 任务切片：在浏览器的空闲时间内（利用 requestIdleCallback 思想），React 可以将渲染任务拆分成多个小片段，逐步完成 Fiber 树的构建，避免一次性完成所有渲染任务导致的阻塞。

### 2.fiber 的双缓存架构

react 内部有两颗树维护着两个状态：一个是 `fiber tree`，一个是 `work in progress fiber tree`

1. **fiber tree**: 表示当前正在渲染的 fiber 树
2. **work in progress fiber tree**: 表示更新过程中新生成的 fiber 树，也就是渲染的下一次 UI 状态

举个例子:
当我们用 canvas 绘制动画时，每一帧绘制前都会调用 ctx.clearRect 清除上一帧的画面，如果当前帧画面计算量比较大，导致清除上一帧画面到绘制当前帧画面之间有较长间隙，就会出现白屏。
为了解决这个问题，我们可以在内存中绘制当前帧动画，绘制完毕后直接用当前帧替换上一帧画面，由于省去了两帧替换间的计算时间，不会出现从白屏到出现画面的闪烁情况。

## 五、diff 算法

比如有 A B C D 四个节点

那么首先 react 会把这个节点变成链表结构也就是

```tsx
root
  |
child
  ↓
A -> B -> C -> D
```

然后我们更新了节点 A C B E

那么 diff 算法

{A B C D} 他会从 map 里面去找能够复用的节点也就是 A C B 进行复用
如果{A B C D} 这个结构没有出现 E 那么说明是新增了创建新的 fiber 结构
如果{A B C D} 旧节点存在 { A C B E} 新节点没有存在那么说明是删除了
![foo](/react/diff.png)

### 1.VDom Fiber Diff 完整版

```tsx
//vdom
const React = {
  createElement(type, props = {}, ...children) {
    return {
      type,
      props: {
        ...props,
        children: children.map(child => (typeof child === "object" ? child : React.createTextElement(child)))
      }
    };
  },

  createTextElement(text) {
    return {
      type: "TEXT_ELEMENT",
      props: {
        nodeValue: text,
        children: []
      }
    };
  }
};

// const vdom = React.createElement('div', { id: 1 }, React.createElement('span', null, '小满zs'));

// console.log(vdom)

//Fiber 是 React 16 引入的一种新的协调引擎
let nextUnitOfWork = null; // 下一个工作单元
let currentRoot = null; // 当前 Fiber 树的根
let wipRoot = null; // 正在工作的 Fiber 树
let deletions = null; // 存储需要删除的 Fiber

// Fiber 渲染入口
function render(element, container) {
  //wipRoot 表示“正在进行的工作根”，它是 Fiber 架构中渲染任务的起点
  wipRoot = {
    dom: container, //渲染目标的 DOM 容器
    props: {
      children: [element] //要渲染的元素（例如 React 元素）
    },
    alternate: currentRoot
    //alternate 是 React Fiber 树中的一个关键概念，用于双缓存机制（双缓存树 Fiber Tree）。currentRoot 是之前已经渲染过的 Fiber 树的根，wipRoot 是新一轮更新的根 Fiber 节点。
    //它们通过 alternate 属性相互关联
    //旧的fiber树
  };
  nextUnitOfWork = wipRoot;
  //nextUnitOfWork 是下一个要执行的工作单元（即 Fiber 节点）。在这里，将其设置为 wipRoot，表示渲染工作从根节点开始
  deletions = [];
  //专门用于存放在更新过程中需要删除的节点。在 Fiber 更新机制中，如果某些节点不再需要，就会将它们放入 deletions，
  //最后在 commitRoot 阶段将它们从 DOM 中删除
}

// 创建 Fiber 节点
function createFiber(element, parent) {
  return {
    type: element.type,
    props: element.props,
    parent,
    dom: null, // 关联的 DOM 节点
    child: null, // 子节点
    sibling: null, // 兄弟节点
    alternate: null, // 对应的前一次 Fiber 节点
    effectTag: null // 'PLACEMENT', 'UPDATE', 'DELETION'
  };
}

// 创建 DOM 节点
function createDom(fiber) {
  const dom = fiber.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(fiber.type);
  updateDom(dom, {}, fiber.props);
  return dom;
}

// 更新 DOM节点的属性
function updateDom(dom, prevProps, nextProps) {
  // 移除旧属性
  Object.keys(prevProps)
    .filter(name => name !== "children")
    .forEach(name => {
      dom[name] = "";
    });

  // 添加新属性
  Object.keys(nextProps)
    .filter(name => name !== "children")
    .filter(name => prevProps[name] !== nextProps[name])
    .forEach(name => {
      dom[name] = nextProps[name];
    });
}

// Fiber 调度器
// 实现将耗时任务拆分成多个小的工作单元
function workLoop(deadline) {
  //deadline 表示浏览器空闲时间
  let shouldYield = false;
  //是一个标志，用来指示是否需要让出控制权给浏览器。如果时间快用完了，则设为 true，以便及时暂停任务，避免阻塞主线程

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    //performUnitOfWork 是一个函数，它处理当前的工作单元，并返回下一个要执行的工作单元。每次循环会更新 nextUnitOfWork 为下一个工作单元
    shouldYield = deadline.timeRemaining() < 1;
    //使用 deadline.timeRemaining() 来检查剩余的空闲时间。如果时间少于 1 毫秒，就设置 shouldYield 为 true，表示没有空闲时间了，就让出控制权
  }

  if (!nextUnitOfWork && wipRoot) {
    //当没有下一个工作单元时（nextUnitOfWork 为 null），并且有一个待提交的“工作根”（wipRoot），就会调用 commitRoot() 将最终的结果应用到 DOM 中
    commitRoot();
  }

  requestIdleCallback(workLoop);
  //使用 requestIdleCallback 来安排下一个空闲时间段继续执行 workLoop，让任务在浏览器空闲时继续进行
}
//requestIdleCallback 浏览器绘制一帧16ms 空闲的时间去执行的函数 浏览器自动执行
//浏览器一帧做些什么
//1.处理时间的回调click...事件
//2.处理计时器的回调
//3.开始帧
//4.执行requestAnimationFrame 动画的回调
//5.计算机页面布局计算 合并到主线程
//6.绘制
//7.如果此时还有空闲时间，执行requestIdleCallback
requestIdleCallback(workLoop);

// 执行一个工作单元
function performUnitOfWork(fiber) {
  // 如果没有 DOM 节点，为当前 Fiber 创建 DOM 节点
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  //确保每个 Fiber 节点都在内存中有一个对应的 DOM 节点准备好，以便后续在提交阶段更新到实际的 DOM 树中

  // 创建子节点的 Fiber
  // const vdom = React.createElement('div', { id: 1 }, React.createElement('span', null, '小满zs'));
  // 子节点在children中
  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);

  // 返回下一个工作单元（child, sibling, or parent）
  if (fiber.child) {
    return fiber.child;
  }

  // 如果A遍历完成，就要返回兄弟节点
  let nextFiber = fiber; // 此时的fiber就是A
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling; // 返回兄弟节点
    }
    nextFiber = nextFiber.parent; // 如果没有兄弟节点，就返回父级节点，向上查找
  }
  // 如果上面的全部查找完毕了，没有了，就返回null，代表所有节点遍历完毕
  return null;
}

// 这个函数的作用是  1.形成fiber树  2.diff算法
// Diff 算法: 将子节点与之前的 Fiber 树进行比较
function reconcileChildren(wipFiber, elements) {
  let index = 0; //
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child; // 旧的 Fiber 树
  let prevSibling = null;

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;

    // 比较旧 Fiber 和新元素
    const sameType = oldFiber && element && element.type === oldFiber.type;

    //1.复用fiber节点 如果是同类型的节点
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE"
      };
    }

    //2.新增fiber节点 如果新节点存在，但类型不同
    if (element && !sameType) {
      newFiber = createFiber(element, wipFiber);
      newFiber.effectTag = "PLACEMENT";
    }

    //3.删除旧fiber节点 如果旧节点存在，但新节点不存在
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber);
    }

    //移动旧fiber指针到下一个兄弟节点
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    // 将新fiber节点插入到DOM树中
    if (index === 0) {
      //将第一个子节点设置为父节点的子节点
      wipFiber.child = newFiber;
    } else if (element) {
      //将后续子节点作为前一个兄弟节点的兄弟
      prevSibling.sibling = newFiber;
    }

    //更新兄弟节点
    prevSibling = newFiber;
    index++;
  }
}

// 提交更新到 DOM
function commitRoot() {
  deletions.forEach(commitWork); // 删除需要删除的 Fiber 节点
  commitWork(wipRoot.child);
  currentRoot = wipRoot; // 存储旧的fiber树
  wipRoot = null; // 在这个阶段，所有的变化操作都完成了，就需要回归原始，置为null
}

// 提交单个 Fiber 节点
function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  const domParent = fiber.parent.dom;

  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    domParent.removeChild(fiber.dom);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

//测试

// render(React.createElement('h1', null, 'hello world'), document.getElementById('root'));

// 测试用例diff

render(
  React.createElement("div", { id: 1 }, React.createElement("span", null, "hello 11")),
  document.getElementById("root")
);

render(
  React.createElement("div", { id: 1 }, React.createElement("span", null, "hello 22")),
  document.getElementById("root")
);
```
