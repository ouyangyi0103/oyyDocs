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

## 一、创建项目

```tsx
npx create-next-app@latest
```

## 二、路由定义

nextjs 使用基于文件系统的路由器，其中文件夹用于定义路由

比如 app 文件夹就是根路由，app 文件夹下的文件夹就是子路由

### 1.文件夹结构示例

```
my-next-app/
├── app/
│   ├── globals.css
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页 (/)
│   ├── about/
│   │   └── page.tsx       # 关于页面 (/about)
│   ├── dashboard/
│   │   ├── layout.tsx     # 仪表板布局
│   │   ├── page.tsx       # 仪表板首页 (/dashboard)
│   │   ├── settings/
│   │   │   └── page.tsx   # 设置页面 (/dashboard/settings)
│   │   └── profile/
│   │       └── page.tsx   # 个人资料页面 (/dashboard/profile)
│   └── api/
│       └── users/
│           └── route.ts   # API路由 (/api/users)
├── components/
│   ├── Header.tsx
│   └── Footer.tsx
├── public/
│   ├── images/
│   └── icons/
├── package.json
└── next.config.js
```

### 2.特殊文件说明

- `page.tsx` - 定义页面组件
- `layout.tsx` - 定义布局组件
- `loading.tsx` - 定义加载状态
- `error.tsx` - 定义错误页面
- `not-found.tsx` - 定义 404 页面
- `route.ts` - 定义 API 路由

## 三、页面布局 Layout

布局是在多个路由之间共享的 UI，在导航时，布局会`保留状态`，保持交互性，并不会重新呈现，布局也可以嵌套

### 1.根布局（必须要有的）

根布局在应用程序目录的顶层定义，并应用于所有路由，这个布局是必须的，并且必须包含`html`和`body`标记，允许你修改从服务器返回的初始 HTML。

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* 所有页面都会在这个children中呈现出来 */}
      <body>{children}</body>
    </html>
  );
}
```

### 2.嵌套布局

```
├── app/
│   ├── globals.css
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页 (/)
│   ├── about/
│   │   ├── layout.tsx     # 关于布局
│   │   └── page.tsx       # 关于页面 (/about)
```

```tsx
// app/layout.tsx 根布局
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <h1>Root Layout</h1>
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// app/about/layout.tsx 关于布局
export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1>About Layout</h1>
      {children}
    </div>
  );
}

// app/about/page.tsx 关于页面
export default function AboutPage() {
  return <div>About Page</div>;
}
```

关于页面的内容会显示在关于布局中，并且会保留状态，不会重新呈现，然后关于布局会显示在根不居中布局中

## 四、页面模板 Template

模板与布局类似，因为他们包装子布局或页面，与在路由之间保留并保持状态的布局不同，模板在导航是为每一个子项创建了一个新的实例，也就是说，当用户在共享模板的路由之间导航时，将挂载子项的新实例，重新创建`DOM`元素，模板在客户端组件中`不保留状态`

```
├── app/
│   ├── globals.css
│   ├── layout.tsx         # 根布局
│   ├── template.tsx       # 根模板
│   ├── page.tsx           # 首页 (/)
│   ├── about/
│   │   ├── layout.tsx     # 关于布局
│   │   └── page.tsx       # 关于页面 (/about)
```

```tsx
export default function Template({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
```

如果同时存在 `layout` 和 `template`，那么 `layout` 会包装 `template`，`template` 会包装页面

## 五、usePathname

由于`usePathname`是一个客户端钩子，因此需要将导航链接提取到客户端组件中，该组件可以导入布局或模板中

```tsx
// 使用客户端的钩子，必须在组件中加上这个
"use client";

import { usePathname } from "next/navigation";

export default function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link href={href} className={isActive ? "active" : ""}>
      {children}
    </Link>
  );
}
```

## 六、页面元数据

可以通过在`layout.tsx`或`page.tsx`文件中导出元数据对象或`generateMetadata`函数来设置页面元数据

### 1.静态元数据

```tsx
// app/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My App",
  description: "This is my app"
};
```

### 2.动态元数据

```tsx
// app/page.tsx
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(props: Props, parent: ResolvingMetadata) {
  const { params, searchParams } = props;
  const id = params.id;
  const name = searchParams.name;

  const title = `My App ${id}`;
  const description = `This is my app ${name}`;
  return {
    title,
    description
  };
}
```

## 七、指定 favicon

### 1.页面中处理

```tsx
// app/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.ico"
  }
};
```

### 2.文件形式处理（推荐）

在根目录 app 文件夹下面放一个`favicon.ico`文件，会自动加载这个文件当作 favicon

## 八、404 页面处理

### 1.全局的 not-found 文件（推荐）

必须放在 app 文件夹下面，只要是访问路由地址不存在，就会展示这个 404 页面

```tsx
// app/not-found.tsx
export default function NotFound() {
  return <div>404 - Page Not Found</div>;
}
```

### 2.局部 not-found 文件

局部的 404 页面，需要使用`notFound函数`主动触发，回去找最近的 not-found 页面，没找到，还是会展示全局的 404 页面

```tsx
// test/not-found.tsx
export default function NotFound() {
  return <div>404 - Page Not Found</div>;
}

// test/page.tsx
import { notFound } from "next/navigation";
export default function Page() {
  notFound();
  return <div>Test Page</div>;
}
```

## 九、路由组

对于 404 页面的展示，会导致一个情况，如果根 layout 使用的定位的话，那么在展示 404 的时候，根 layout 也会被展示出来，所以需要使用路由组来解决这个问题

在应用程序的目录中，嵌套文件夹通常映射到 URL 路径，但是，如果文件夹名称以`()`包围，则该文件夹中的所有路由都将被视为一个组，并且该组将共享相同的布局，不会映射到 URL 路径

### 1.路由组文件目录示例

```
my-next-app/
├── app/
│   ├── globals.css
│   ├── layout.tsx              # 根布局
│   ├── not-found.tsx           # 全局404页面
│   ├── page.tsx                # 首页 (/)
│   │
│   ├── (marketing)/            # 营销页面组 不会映射到URL路径
│   │   ├── layout.tsx          # 营销页面共享布局
│   │   ├── about/
│   │   │   └── page.tsx        # 关于页面 (/about)
│   │   ├── contact/
│   │   │   └── page.tsx        # 联系页面 (/contact)
│   │   └── pricing/
│   │       └── page.tsx        # 价格页面 (/pricing)
│   │
│   ├── (dashboard)/            # 仪表板页面组 不会映射到URL路径
│   │   ├── layout.tsx          # 仪表板共享布局
│   │   ├── loading.tsx         # 仪表板加载页面
│   │   ├── error.tsx           # 仪表板错误页面
│   │   ├── dashboard/
│   │   │   └── page.tsx        # 仪表板首页 (/dashboard)
│   │   ├── settings/
│   │   │   ├── page.tsx        # 设置页面 (/settings)
│   │   │   └── profile/
│   │   │       └── page.tsx    # 个人资料 (/settings/profile)
│   │   └── analytics/
│   │       └── page.tsx        # 分析页面 (/analytics)
│   │
```

### 2.路由组的特点

1. **URL 路径不变**: 路由组不会影响 URL 结构，`(marketing)/about/page.tsx` 的 URL 仍然是 `/about`
2. **共享布局**: 同一组内的页面可以共享相同的布局文件
3. **独立配置**: 每个组可以有自己的 `loading.tsx`、`error.tsx`、`not-found.tsx` 等特殊文件
4. **组织代码**: 帮助开发者更好地组织和管理相关的页面

### 3.各组布局示例

```tsx
// app/(marketing)/layout.tsx - 营销页面布局
import MarketingHeader from "@/components/marketing/Header";
import MarketingFooter from "@/components/marketing/Footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="marketing-layout">
      <MarketingHeader />
      <main className="min-h-screen">{children}</main>
      <MarketingFooter />
    </div>
  );
}
```

```tsx
// app/(dashboard)/layout.tsx - 仪表板布局
import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-layout flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
```

```tsx
// app/(auth)/layout.tsx - 认证页面布局
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-layout min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">{children}</div>
    </div>
  );
}
```

## 十、字体优化

可以优化整个字体优化

```tsx
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap" // 这个表示先加载默认字体，然后加载自定义字体
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

## 十一、动态路由

### 1.[id]方式

在创建文件夹的时候需要使用`[id]`去创建

```tsx
// app/blob/[id]/page.tsx

export default function Page({ params }: { params: { id: string } }) {
  return <div>this is page `${params.id}`</div>;
}
```

比如访问

- router 为`app/blob/[id]/page.tsx` , url 为`/blob/1` , params 为 `{id: 1}`
- router 为`app/blob/[id]/page.tsx` , url 为`/blob/2` , params 为 `{id: 2}`
- router 为`app/blob/[id]/page.tsx` , url 为`/blob/3` , params 为 `{id: 3}`

### 2.[...id]方式

比如访问

- router 为`app/blob/[...id]/page.tsx` , url 为`/blob/a` , params 为 `{id: ['a']}`
- router 为`app/blob/[...id]/page.tsx` , url 为`/blob/a/b` , params 为 `{id: ['a','b']}`
- router 为`app/blob/[...id]/page.tsx` , url 为`/blob/a/b/c` , params 为 `{id: ['a','b','c']}`

### 3.[[...id]]方式

比如访问

- router 为`app/blob/[...id]/page.tsx` , url 为`/blob` , params 为 `{}`
- router 为`app/blob/[...id]/page.tsx` , url 为`/blob/a` , params 为 `{id: ['a']}`
- router 为`app/blob/[...id]/page.tsx` , url 为`/blob/a/b` , params 为 `{id: ['a','b']}`
- router 为`app/blob/[...id]/page.tsx` , url 为`/blob/a/b/c` , params 为 `{id: ['a','b','c']}`

### 4.获取参数

动态路由参数会作为`params`属性传递给 `layout` `page` `route` 和 `generateMetadata函数`

```tsx
interface Params {
  params: {
    id: string;
  };
}

export default function Page({ params }: Params) {
  let { id } = params;
  return <Card id={id}></Card>;
}
```

## 十二、并行路由（平行路由）

`并行路由`允许同时或有条件的呈现同一布局中的一个或多个页面，它们对于应用程序的高度动态部分非常有用

### 1.并行路由目录结构示例

并行路由使用命名插槽创建，插槽用`@folder`约定定义，并作为 props 传递给同一级别的布局

在`app/page.tsx`中，相当于是`app/@children/page.tsx`，这就是为什么可以在`app/page.tsx`中使用`@children`插槽`<div>{children}</div>`

```
my-next-app/
├── app/
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 首页 (/)
│   │
│   ├── dashboard/              # 仪表板路由
│   │   ├── layout.tsx          # 仪表板布局 (接收并行路由插槽)
│   │   ├── page.tsx            # 仪表板首页 (/dashboard)
│   │   │
│   │   ├── @analytics/         # 分析数据插槽
│   │   │   ├── page.tsx        # 默认分析页面
│   │   │   ├── revenue/
│   │   │   │   └── page.tsx    # 收入分析 (/dashboard/revenue)
│   │   │   └── users/
│   │   │       └── page.tsx    # 用户分析 (/dashboard/users)
│   │   │
│   │   ├── @team/              # 团队信息插槽
│   │   │   ├── page.tsx        # 默认团队页面
│   │   │   ├── members/
│   │   │   │   └── page.tsx    # 团队成员 (/dashboard/members)
│   │   │   └── settings/
│   │   │       └── page.tsx    # 团队设置 (/dashboard/settings)
│   │   │
│   │   └── @notifications/     # 通知插槽
│   │       ├── page.tsx        # 默认通知页面
│   │       ├── alerts/
│   │       │   └── page.tsx    # 警报通知 (/dashboard/alerts)
│   │       └── messages/
│   │           └── page.tsx    # 消息通知 (/dashboard/messages)
│   │
│   ├── admin/                  # 管理员路由
│   │   ├── layout.tsx          # 管理员布局
│   │   ├── page.tsx            # 管理员首页 (/admin)
│   │   │
│   │   ├── @sidebar/           # 侧边栏插槽
│   │   │   ├── default.tsx     # 默认侧边栏
│   │   │   ├── navigation/
│   │   │   │   └── page.tsx    # 导航侧边栏
│   │   │   └── tools/
│   │   │       └── page.tsx    # 工具侧边栏
│   │   │
│   │   └── @content/           # 内容插槽
│   │       ├── default.tsx     # 默认内容
│   │       ├── users/
│   │       │   ├── page.tsx    # 用户管理 (/admin/users)
│   │       │   └── [id]/
│   │       │       └── page.tsx # 用户详情 (/admin/users/[id])
│   │       └── products/
│   │           └── page.tsx    # 产品管理 (/admin/products)
```

### 2.并行路由布局文件示例

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  analytics,
  team,
  notifications
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  team: React.ReactNode;
  notifications: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      <h1>仪表板</h1>

      {/* 主要内容区域 */}
      <div className="main-content">{children}</div>

      {/* 并行显示的三个区域 */}
      <div className="parallel-sections">
        <div className="analytics-section">
          <h2>数据分析</h2>
          {analytics}
        </div>

        <div className="team-section">
          <h2>团队信息</h2>
          {team}
        </div>

        <div className="notifications-section">
          <h2>通知中心</h2>
          {notifications}
        </div>
      </div>
    </div>
  );
}
```

```tsx
// app/admin/layout.tsx
export default function AdminLayout({
  children,
  sidebar,
  content
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <div className="admin-layout flex">
      {/* 侧边栏插槽 */}
      <aside className="w-64 bg-gray-800 text-white">{sidebar}</aside>

      {/* 主要内容区域 */}
      <div className="flex-1">
        <header>
          {children} {/* 页面特定的头部内容 */}
        </header>

        <main className="p-6">
          {content} {/* 主要内容插槽 */}
        </main>
      </div>
    </div>
  );
}
```

### 3.default.tsx 文件

`Link`标签跳转的成为`软导航`，在 url 中直接写路径跳转的成为`硬导航`，如果是软导航跳转过来的，是会复用页面之前的效果，如果是硬导航跳转过来的，在刷新页面的时候，它不仅仅是在`app/dashboard/@analytics/visitors/page.tsx`的`@analytics`平行路由里面找 visitors，还会去另外的平行路由中找 visitors，还会去 app 下找 visitors，所以需要 default.tsx 文件

当 Next.js 无法恢复插槽的活动状态时，可以定义一个`default.tsx`文件作为后备方案，比如切换到了`app/dashboard/@analytics/page.tsx`，然后去刷新页面，就会展示`app/dashboard/@analytics/default.tsx`文件

```tsx
// app/dashboard/@analytics/default.tsx
export default function Default() {
  return <div>默认分析视图</div>;
}

// app/dashboard/@team/default.tsx
export default function Default() {
  return <div>默认团队视图</div>;
}

// app/dashboard/@notifications/default.tsx
export default function Default() {
  return <div>默认通知视图</div>;
}
```

### 4.并行路由的特点

1. **同时渲染**: 多个插槽可以同时在同一个布局中渲染
2. **独立导航**: 每个插槽都有自己的加载状态和错误处理
3. **条件渲染**: 可以根据特定条件显示不同的插槽内容
4. **URL 路由**: 平行路由不会解析为 URL 路径，每个插槽的页面都对应相应的 URL 路径，比如`app/dashboard/@analytics/page.tsx` 的 URL 路径为`/dashboard/analytics`
5. **状态保持**: 在导航时，插槽的状态可以保持独立

### 5.使用场景

- **仪表板**: 同时显示多个数据视图
- **社交媒体**: 同时显示动态、侧边栏、聊天等
- **电商网站**: 同时显示产品列表、筛选器、购物车等
- **管理后台**: 同时显示菜单、内容区、操作面板等

## 十三、拦截路由

`拦截路由`允许您在当前布局内加载来自应用程序另一部分的路由，当您想要显示路由的内容而不让用户切换到不同的上下文时，这种路由范式非常有用。

### 1.拦截路由目录结构示例

拦截路由使用`(..)`约定定义，这类似于相对路径约定`../`，但用于段（文件夹）

```
my-next-app/
├── app/
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 首页 (/)
│   │
│   ├── feed/                   # 动态流页面
│   │   ├── page.tsx            # 动态流首页 (/feed)
│   │   └── (..)photo/          # 拦截 /photo 路由
│   │       └── [id]/
│   │           └── page.tsx    # 在动态流中显示照片模态框
│   │
│   ├── photo/                  # 照片详情页面
│   │   ├── [id]/
│   │   │   └── page.tsx        # 照片详情完整页面 (/photo/[id])
│   │   └── layout.tsx          # 照片布局
│   │
│   ├── dashboard/              # 仪表板
│   │   ├── page.tsx            # 仪表板首页 (/dashboard)
│   │   ├── settings/
│   │   │   ├── page.tsx        # 设置页面 (/dashboard/settings)
│   │   │   └── (.)profile/     # 拦截同级 profile 路由
│   │   │       └── page.tsx    # 在设置页面中显示个人资料模态框
│   │   └── profile/
│   │       └── page.tsx        # 个人资料完整页面 (/dashboard/profile)
│   │
│   ├── shop/                   # 商店
│   │   ├── page.tsx            # 商店首页 (/shop)
│   │   ├── products/
│   │   │   ├── page.tsx        # 产品列表 (/shop/products)
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx    # 产品详情 (/shop/products/[id])
│   │   │   └── (.)cart/        # 拦截同级购物车路由
│   │   │       └── page.tsx    # 在产品页面中显示购物车模态框
│   │   └── cart/
│   │       └── page.tsx        # 购物车完整页面 (/shop/cart)
│   │
│   └── modal/                  # 全局模态框
│       └── (..)login/          # 拦截登录路由
│           └── page.tsx        # 在任何页面显示登录模态框
```

### 2.拦截路由约定

- `(.)` - 匹配**同级**段
- `(..)` - 匹配**上一级**段
- `(..)(..)` - 匹配**上两级**段
- `(...)` - 匹配**根 app 目录**的段

### 3.拦截路由示例代码

#### 3.1 动态流中的照片模态框

```tsx
// app/feed/page.tsx - 动态流页面
import Link from "next/link";

export default function FeedPage() {
  const photos = [
    { id: "1", title: "美丽的日落", url: "/images/sunset.jpg" },
    { id: "2", title: "城市夜景", url: "/images/city.jpg" },
    { id: "3", title: "森林小径", url: "/images/forest.jpg" }
  ];

  return (
    <div className="feed-container">
      <h1>动态流</h1>
      <div className="photo-grid">
        {photos.map(photo => (
          <Link key={photo.id} href={`/photo/${photo.id}`}>
            <div className="photo-card">
              <img src={photo.url} alt={photo.title} />
              <h3>{photo.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

```tsx
// app/feed/(..)photo/[id]/page.tsx - 拦截的照片模态框
"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";

export default function PhotoModal({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  // 模拟获取照片数据
  const photo = {
    id,
    title: `照片 ${id}`,
    url: `/images/photo-${id}.jpg`,
    description: `这是照片 ${id} 的描述`
  };

  return (
    <Modal onClose={() => router.back()}>
      <div className="photo-modal">
        <img src={photo.url} alt={photo.title} className="w-full max-w-2xl mx-auto" />
        <div className="mt-4">
          <h2 className="text-2xl font-bold">{photo.title}</h2>
          <p className="text-gray-600 mt-2">{photo.description}</p>
        </div>
      </div>
    </Modal>
  );
}
```

```tsx
// app/photo/[id]/page.tsx - 完整的照片详情页面
export default function PhotoPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const photo = {
    id,
    title: `照片 ${id}`,
    url: `/images/photo-${id}.jpg`,
    description: `这是照片 ${id} 的详细描述，包含更多信息...`,
    metadata: {
      camera: "Canon EOS R5",
      lens: "24-70mm f/2.8",
      settings: "ISO 100, f/8, 1/125s"
    }
  };

  return (
    <div className="photo-page">
      <div className="max-w-4xl mx-auto p-6">
        <img src={photo.url} alt={photo.title} className="w-full rounded-lg shadow-lg" />

        <div className="mt-6">
          <h1 className="text-3xl font-bold">{photo.title}</h1>
          <p className="text-gray-700 mt-4 text-lg">{photo.description}</p>

          <div className="mt-6 bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">拍摄信息</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <strong>相机:</strong> {photo.metadata.camera}
              </li>
              <li>
                <strong>镜头:</strong> {photo.metadata.lens}
              </li>
              <li>
                <strong>参数:</strong> {photo.metadata.settings}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### 3.2 模态框组件

```tsx
// components/Modal.tsx
"use client";

import { useEffect } from "react";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  useEffect(() => {
    // 按 ESC 键关闭模态框
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    // 防止背景滚动
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* 模态框内容 */}
      <div className="relative bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-auto">
        {/* 关闭按钮 */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {children}
      </div>
    </div>
  );
}
```

#### 3.3 购物车拦截示例

```tsx
// app/shop/products/(.)cart/page.tsx - 拦截的购物车模态框
"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";

export default function CartModal() {
  const router = useRouter();

  const cartItems = [
    { id: 1, name: "商品A", price: 99.99, quantity: 2 },
    { id: 2, name: "商品B", price: 149.99, quantity: 1 }
  ];

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Modal onClose={() => router.back()}>
      <div className="cart-modal">
        <h2 className="text-2xl font-bold mb-4">购物车</h2>

        <div className="space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between items-center p-3 border rounded">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">数量: {item.quantity}</p>
              </div>
              <p className="font-bold">${item.price}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center text-xl font-bold">
            <span>总计:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">去结账</button>
        </div>
      </div>
    </Modal>
  );
}
```

```tsx
// app/shop/cart/page.tsx - 完整的购物车页面
export default function CartPage() {
  return (
    <div className="cart-page max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">购物车</h1>

      {/* 完整的购物车功能 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* 商品列表 */}
          <div className="space-y-4">{/* 商品项 */}</div>
        </div>

        <div className="lg:col-span-1">
          {/* 订单摘要 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">订单摘要</h3>
            {/* 价格明细 */}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 4.拦截路由的特点

1. **软导航触发**: 只有通过客户端导航（如 `Link` 组件或 `router.push()`）才会触发拦截
2. **硬导航绕过**: 直接在浏览器地址栏输入 URL 或刷新页面会绕过拦截，显示原始页面
3. **保持 URL**: 拦截时 URL 会更新为目标路由，但显示的是拦截的内容
4. **历史记录**: 拦截的路由会正常加入浏览器历史记录
5. **回退功能**: 可以使用 `router.back()` 返回到之前的页面

### 5.使用场景

- **图片/视频查看器**: 在列表页面中以模态框形式预览媒体内容
- **快速编辑表单**: 在列表页面中快速编辑项目，无需跳转到完整页面
- **购物车/收藏夹**: 在商品页面中快速查看购物车或收藏夹
- **用户资料卡片**: 在社交媒体中快速查看用户资料
- **通知详情**: 在应用中快速查看通知详情

### 6.注意事项

1. **可访问性**: 确保拦截的内容对键盘用户和屏幕阅读器用户友好
2. **移动端适配**: 在移动设备上考虑使用全屏模态框或底部抽屉
3. **SEO 考虑**: 拦截路由不会影响 SEO，因为原始页面仍然存在
4. **错误处理**: 为拦截的内容提供适当的错误边界和加载状态
5. **性能优化**: 考虑对拦截的内容进行预加载以提升用户体验
