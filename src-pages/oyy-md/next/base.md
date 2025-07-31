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

## 十一、动态路由-[id]

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

## 十二、并行路由（平行路由）-@folder

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

## 十三、拦截路由-(..)photo

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

## 十四、路由处理程序(也就是后端接口)

路由处理程序允许您使用 Web 请求和响应 API 为给定的路由创建自定义请求处理程序，路由处理程序在应用程序目录中的`route.ts`文件中定义，
路由处理程序可以嵌套在`app`目录内的任何位置，类似于`page.tsx`和`layout.tsx`文件，但是不能有于`page.tsx`和`layout.tsx`文件同级`route.tsx`文件，

### 1.基本路由处理程序示例

```tsx
// app/api/hello/route.ts
export async function GET() {
  return Response.json({ message: "Hello World" });
}

export async function POST() {
  return Response.json({ message: "Created" });
}

export async function PUT() {
  return Response.json({ message: "Updated" });
}

export async function DELETE() {
  return Response.json({ message: "Deleted" });
}
```

### 2.支持的 HTTP 方法

路由处理程序支持以下 HTTP 方法：`GET`、`POST`、`PUT`、`PATCH`、`DELETE`、`HEAD`、`OPTIONS`

```
├── app/
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 首页 (/)
│   │
│   ├── api/users/route.ts        # 用户路由处理程序
│   ├── api/users/[id]/route.ts  # 用户详情路由处理程序
│   │
│   ├── api/posts/route.ts        # 帖子路由处理程序
│   ├── api/posts/[id]/route.ts  # 帖子详情路由处理程序
│   │
│   ├── api/comments/route.ts    # 评论路由处理程序
│   │
│   └── api/auth/route.ts        # 认证路由处理程序
│
```

```tsx
// app/api/users/route.ts
export async function GET() {
  // 获取用户列表
  return Response.json({ users: [] });
}

export async function POST(request: Request) {
  // 创建新用户
  const body = await request.json();
  return Response.json({ user: body }, { status: 201 });
}

export async function PATCH(request: Request) {
  // 更新用户
  const body = await request.json();
  return Response.json({ user: body });
}

export async function DELETE() {
  // 删除用户  /api/users/:id
  return Response.json({ message: "User deleted" });
}
```

### 3.请求对象

```tsx
// app/api/search/route.ts
export async function GET(request: Request) {
  // 获取URL参数
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const page = searchParams.get("page") || "1";

  // 获取请求头
  const userAgent = request.headers.get("user-agent");

  return Response.json({
    query,
    page: parseInt(page),
    userAgent
  });
}

export async function POST(request: Request) {
  // 获取请求体
  const body = await request.json();

  // 获取请求头
  const contentType = request.headers.get("content-type");

  return Response.json({
    received: body,
    contentType
  });
}
```

### 4.动态路由处理程序

```tsx
// app/api/users/[id]/route.ts
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;

  // 模拟获取用户数据
  const user = {
    id,
    name: `User ${id}`,
    email: `user${id}@example.com`
  };

  return Response.json({ user });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const body = await request.json();

  // 模拟更新用户
  const updatedUser = {
    id,
    ...body,
    updatedAt: new Date().toISOString()
  };

  return Response.json({ user: updatedUser });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;

  // 模拟删除用户
  return Response.json({
    message: `User ${id} deleted successfully`
  });
}
```

### 5.嵌套动态路由

```tsx
// app/api/users/[userId]/posts/[postId]/route.ts
export async function GET(request: Request, { params }: { params: { userId: string; postId: string } }) {
  const { userId, postId } = params;

  // 模拟获取特定用户的特定文章
  const post = {
    id: postId,
    userId,
    title: `Post ${postId} by User ${userId}`,
    content: "这是文章内容..."
  };

  return Response.json({ post });
}
```

### 6.错误处理

```tsx
// app/api/users/[id]/route.ts
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    // 验证ID格式
    if (!id || isNaN(parseInt(id))) {
      return Response.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // 模拟数据库查询
    const user = await getUserById(id);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ user });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function getUserById(id: string) {
  // 模拟数据库操作
  if (id === "999") {
    throw new Error("Database connection failed");
  }

  if (parseInt(id) > 100) {
    return null; // 用户不存在
  }

  return {
    id,
    name: `User ${id}`,
    email: `user${id}@example.com`
  };
}
```

### 7.中间件和认证

```tsx
// app/api/protected/route.ts
import { headers } from "next/headers";

export async function GET() {
  // 获取请求头
  const headersList = headers();
  const authorization = headersList.get("authorization");

  // 检查认证
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authorization.split(" ")[1];

  // 验证token
  if (!isValidToken(token)) {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }

  // 返回受保护的数据
  return Response.json({
    message: "This is protected data",
    user: await getUserFromToken(token)
  });
}

function isValidToken(token: string): boolean {
  // 模拟token验证
  return token === "valid-token-123";
}

async function getUserFromToken(token: string) {
  // 模拟从token获取用户信息
  return {
    id: "1",
    name: "John Doe",
    email: "john@example.com"
  };
}
```

### 8.处理表单数据

```tsx
// app/api/upload/route.ts
export async function POST(request: Request) {
  try {
    // 处理FormData
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const file = formData.get("file") as File;

    // 验证数据
    if (!name || !email) {
      return Response.json({ error: "Name and email are required" }, { status: 400 });
    }

    // 处理文件上传
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // 这里可以保存文件到磁盘或云存储
      console.log(`File uploaded: ${file.name}, Size: ${buffer.length} bytes`);
    }

    // 保存用户数据
    const user = {
      id: Date.now().toString(),
      name,
      email,
      fileName: file?.name || null
    };

    return Response.json(
      {
        message: "User created successfully",
        user
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
```

### 9.设置响应头和 Cookie

```tsx
// app/api/auth/login/route.ts
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 验证用户凭据
    const user = await authenticateUser(email, password);

    if (!user) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 生成JWT token
    const token = generateJWT(user);

    // 创建响应
    const response = Response.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

    // 设置Cookie
    response.headers.set("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=86400`);

    // 设置自定义响应头
    response.headers.set("X-User-ID", user.id);

    return response;
  } catch (error) {
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}

async function authenticateUser(email: string, password: string) {
  // 模拟用户认证
  if (email === "admin@example.com" && password === "password123") {
    return {
      id: "1",
      name: "Admin User",
      email: "admin@example.com"
    };
  }
  return null;
}

function generateJWT(user: any): string {
  // 模拟JWT生成
  return `jwt-token-for-${user.id}`;
}
```

### 10.CORS 处理

```tsx
// app/api/public/route.ts
export async function GET() {
  const response = Response.json({
    message: "This API supports CORS"
  });

  // 设置CORS头
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return response;
}

export async function OPTIONS() {
  // 处理预检请求
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}
```

### 11.流式响应

```tsx
// app/api/stream/route.ts
export async function GET() {
  // 创建可读流
  const stream = new ReadableStream({
    start(controller) {
      let count = 0;

      const interval = setInterval(() => {
        count++;

        // 发送数据块
        controller.enqueue(`data: Message ${count}\n\n`);

        // 5条消息后结束
        if (count >= 5) {
          clearInterval(interval);
          controller.close();
        }
      }, 1000);
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain",
      "Transfer-Encoding": "chunked"
    }
  });
}
```

### 12.完整的 API 示例：用户管理

```tsx
// app/api/users/route.ts
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// 模拟数据库
let users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  }
];

// 获取所有用户
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    // 过滤用户
    let filteredUsers = users;
    if (search) {
      filteredUsers = users.filter(
        user =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return Response.json({
      users: paginatedUsers,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit)
      }
    });
  } catch (error) {
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// 创建新用户
export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();

    // 验证输入
    if (!name || !email) {
      return Response.json({ error: "Name and email are required" }, { status: 400 });
    }

    // 检查邮箱是否已存在
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return Response.json({ error: "Email already exists" }, { status: 409 });
    }

    // 创建新用户
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);

    return Response.json({ user: newUser }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Failed to create user" }, { status: 500 });
  }
}
```

### 13.路由处理程序的特点

1. **文件约定**: 必须命名为 `route.ts` 或 `route.js`
2. **HTTP 方法**: 支持所有标准 HTTP 方法
3. **类型安全**: 支持 TypeScript 类型定义
4. **中间件**: 可以集成 Next.js 中间件
5. **静态生成**: GET 请求默认为静态生成，可以配置为动态
6. **边缘运行时**: 支持 Edge Runtime

### 14.路由处理程序 vs API Routes

- **位置**: 路由处理程序在 `app` 目录中，API Routes 在 `pages/api` 目录中
- **文件名**: 路由处理程序使用 `route.ts`，API Routes 使用任意文件名
- **请求处理**: 路由处理程序使用标准 Web API，API Routes 使用 Next.js 特定 API
- **性能**: 路由处理程序性能更好，支持流式响应

### 15.最佳实践

1. **错误处理**: 始终包含适当的错误处理
2. **输入验证**: 验证所有输入数据
3. **状态码**: 使用正确的 HTTP 状态码
4. **安全性**: 实现认证和授权
5. **日志记录**: 记录重要操作和错误
6. **响应格式**: 保持一致的 API 响应格式
7. **性能优化**: 使用适当的缓存策略

## 十五、GET 缓存问题及解决

在 Next.js App Router 中，GET 请求默认会被缓存，这可能会导致一些意外的行为。了解缓存机制并知道如何控制它对于构建动态应用程序至关重要。

### 1.默认缓存行为

```tsx
// app/api/time/route.ts
export async function GET() {
  return Response.json({
    time: new Date().toISOString(),
    timestamp: Date.now()
  });
}
```

上述代码在生产环境中会被缓存，每次请求返回的时间都是相同的。

### 2.缓存问题示例

```tsx
// app/api/user-count/route.ts - 有缓存问题的版本
export async function GET() {
  // 模拟获取用户数量
  const userCount = await getUserCount();

  return Response.json({
    count: userCount,
    timestamp: new Date().toISOString()
  });
}

async function getUserCount() {
  // 模拟数据库查询
  return Math.floor(Math.random() * 1000) + 1;
}
```

### 3.禁用缓存的方法

#### 3.1 使用 dynamic 配置

```tsx
// app/api/current-time/route.ts
export const dynamic = "force-dynamic"; // 强制动态渲染

export async function GET() {
  return Response.json({
    time: new Date().toISOString(),
    timestamp: Date.now(),
    message: "这个API永远不会被缓存"
  });
}
```

#### 3.2 使用 revalidate 配置

```tsx
// app/api/news/route.ts
export const revalidate = 60; // 每60秒重新验证缓存

export async function GET() {
  // 模拟获取新闻数据
  const news = await fetchLatestNews();

  return Response.json({
    news,
    fetchTime: new Date().toISOString()
  });
}

async function fetchLatestNews() {
  return [
    { id: 1, title: "最新新闻1", time: new Date().toISOString() },
    { id: 2, title: "最新新闻2", time: new Date().toISOString() }
  ];
}
```

#### 3.3 使用请求对象访问动态数据

就是将 Request 对象与 GET 方法一起使用，这样每次请求都会重新获取数据，不会缓存

```tsx
// app/api/user-info/route.ts
export async function GET(request: NextRequest) {
  // 访问URL参数会自动禁用缓存
  const { searchParams } = request.nextUrl;
  const userId = searchParams.get("id");

  // 访问请求头也会禁用缓存
  const userAgent = request.headers.get("user-agent");

  return NextResponse.json({
    userId,
    userAgent,
    timestamp: new Date().toISOString(),
    message: "由于访问了动态数据，此API不会被缓存"
  });
}
```

#### 3.4 使用 headers() 或 cookies() 函数

```tsx
// app/api/auth-status/route.ts
import { headers, cookies } from "next/headers";

export async function GET() {
  // 访问headers会自动禁用缓存
  const headersList = headers();
  const authorization = headersList.get("authorization");

  // 访问cookies也会自动禁用缓存
  const cookieStore = cookies();
  const sessionId = cookieStore.get("sessionId");

  return Response.json({
    isAuthenticated: !!authorization,
    sessionId: sessionId?.value,
    timestamp: new Date().toISOString()
  });
}
```

### 4.缓存配置选项

```tsx
// app/api/products/route.ts

// 强制动态渲染（不缓存）
export const dynamic = "force-dynamic";

// 或者设置重新验证时间（以秒为单位）
export const revalidate = 300; // 5分钟后重新验证

// 或者强制静态渲染（强制缓存）
export const dynamic = "force-static";

export async function GET() {
  const products = await getProducts();

  return Response.json({
    products,
    fetchTime: new Date().toISOString()
  });
}

async function getProducts() {
  // 模拟数据库查询
  return [
    { id: 1, name: "产品A", price: 99.99 },
    { id: 2, name: "产品B", price: 149.99 }
  ];
}
```

### 5.根据条件控制缓存

```tsx
// app/api/data/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fresh = searchParams.get("fresh");

  // 如果请求包含 fresh 参数，返回动态数据
  if (fresh === "true") {
    return Response.json({
      data: await getDynamicData(),
      cached: false,
      timestamp: new Date().toISOString()
    });
  }

  // 否则返回可缓存的数据
  return Response.json(
    {
      data: await getStaticData(),
      cached: true,
      timestamp: new Date().toISOString()
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600" // 1小时缓存
      }
    }
  );
}

async function getDynamicData() {
  return {
    value: Math.random(),
    type: "dynamic"
  };
}

async function getStaticData() {
  return {
    value: "static-value",
    type: "static"
  };
}
```

### 6.使用缓存标签进行细粒度控制

```tsx
// app/api/posts/route.ts
import { unstable_cache } from "next/cache";

// 使用缓存标签
const getCachedPosts = unstable_cache(
  async () => {
    return await fetchPostsFromDB();
  },
  ["posts"], // 缓存键
  {
    tags: ["posts"], // 缓存标签
    revalidate: 3600 // 1小时
  }
);

export async function GET() {
  const posts = await getCachedPosts();

  return Response.json({
    posts,
    cachedAt: new Date().toISOString()
  });
}

// 在其他地方可以通过标签清除缓存
// revalidateTag('posts');

async function fetchPostsFromDB() {
  // 模拟数据库查询
  return [
    { id: 1, title: "文章1", content: "内容1" },
    { id: 2, title: "文章2", content: "内容2" }
  ];
}
```

### 7.客户端缓存控制

```tsx
// app/api/volatile-data/route.ts
export async function GET() {
  const data = await getVolatileData();

  return Response.json(data, {
    headers: {
      // 禁用所有缓存
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0"
    }
  });
}

// 或者设置特定的缓存策略
export async function GET() {
  const data = await getData();

  return Response.json(data, {
    headers: {
      // 缓存5分钟，但允许陈旧内容
      "Cache-Control": "public, max-age=300, stale-while-revalidate=60"
    }
  });
}

async function getVolatileData() {
  return {
    value: Math.random(),
    timestamp: Date.now()
  };
}

async function getData() {
  return {
    value: "some data",
    timestamp: Date.now()
  };
}
```

### 8.实际应用示例：用户统计 API

```tsx
// app/api/stats/route.ts
import { headers } from "next/headers";

// 根据是否为管理员决定缓存策略
export async function GET() {
  const headersList = headers();
  const authorization = headersList.get("authorization");
  const isAdmin = checkIfAdmin(authorization);

  if (isAdmin) {
    // 管理员总是获取最新数据
    return Response.json(
      {
        stats: await getRealTimeStats(),
        realTime: true,
        timestamp: new Date().toISOString()
      },
      {
        headers: {
          "Cache-Control": "no-cache"
        }
      }
    );
  } else {
    // 普通用户获取缓存数据
    return Response.json(
      {
        stats: await getCachedStats(),
        realTime: false,
        timestamp: new Date().toISOString()
      },
      {
        headers: {
          "Cache-Control": "public, max-age=300" // 5分钟缓存
        }
      }
    );
  }
}

function checkIfAdmin(authorization: string | null): boolean {
  // 模拟管理员检查
  return authorization === "Bearer admin-token";
}

async function getRealTimeStats() {
  return {
    users: Math.floor(Math.random() * 1000),
    posts: Math.floor(Math.random() * 5000),
    comments: Math.floor(Math.random() * 10000)
  };
}

async function getCachedStats() {
  // 返回相对稳定的统计数据
  return {
    users: 500,
    posts: 2500,
    comments: 5000
  };
}
```

### 9.测试缓存行为

```tsx
// app/api/cache-test/route.ts
export const dynamic = "force-dynamic"; // 为了测试，禁用缓存

let requestCount = 0;

export async function GET(request: Request) {
  requestCount++;

  const { searchParams } = new URL(request.url);
  const testType = searchParams.get("type") || "default";

  const response = {
    requestCount,
    testType,
    timestamp: new Date().toISOString(),
    randomValue: Math.random()
  };

  switch (testType) {
    case "no-cache":
      return Response.json(response, {
        headers: {
          "Cache-Control": "no-cache"
        }
      });

    case "short-cache":
      return Response.json(response, {
        headers: {
          "Cache-Control": "public, max-age=10" // 10秒缓存
        }
      });

    case "long-cache":
      return Response.json(response, {
        headers: {
          "Cache-Control": "public, max-age=3600" // 1小时缓存
        }
      });

    default:
      return Response.json(response);
  }
}
```

### 10.缓存最佳实践

#### 10.1 选择合适的缓存策略

```tsx
// app/api/best-practices/route.ts

// 对于静态内容（配置、常量等）
export const revalidate = 3600; // 1小时重新验证

// 对于半动态内容（用户资料、文章等）
export const revalidate = 300; // 5分钟重新验证

// 对于动态内容（实时数据、用户特定数据）
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dataType = searchParams.get("type");

  switch (dataType) {
    case "config":
      // 配置数据，很少变化
      return Response.json(await getConfig(), {
        headers: {
          "Cache-Control": "public, max-age=86400" // 24小时
        }
      });

    case "user-content":
      // 用户内容，定期更新
      return Response.json(await getUserContent(), {
        headers: {
          "Cache-Control": "public, max-age=300, stale-while-revalidate=60"
        }
      });

    case "real-time":
      // 实时数据，不缓存
      return Response.json(await getRealTimeData(), {
        headers: {
          "Cache-Control": "no-cache"
        }
      });

    default:
      return Response.json({ error: "Invalid data type" }, { status: 400 });
  }
}

async function getConfig() {
  return { theme: "dark", version: "1.0.0" };
}

async function getUserContent() {
  return { posts: [], lastUpdate: new Date().toISOString() };
}

async function getRealTimeData() {
  return { active_users: Math.floor(Math.random() * 100) };
}
```

### 11.缓存问题排查

```tsx
// app/api/debug-cache/route.ts
export async function GET(request: Request) {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    url: request.url,
    headers: Object.fromEntries(request.headers),
    cacheInfo: {
      dynamic: process.env.NODE_ENV === "development" ? "dev-mode" : "production",
      hasSearchParams: new URL(request.url).searchParams.toString() !== "",
      hasCookies: request.headers.get("cookie") !== null,
      hasAuthorization: request.headers.get("authorization") !== null
    }
  };

  return Response.json(debugInfo, {
    headers: {
      "Cache-Control": "no-cache",
      "X-Debug-Timestamp": Date.now().toString()
    }
  });
}
```

### 12.总结

- **默认行为**: GET 请求在生产环境中默认被缓存
- **禁用缓存**: 使用 `dynamic = 'force-dynamic'` 或访问动态数据
- **控制缓存**: 使用 `revalidate` 设置重新验证时间
- **细粒度控制**: 使用 `Cache-Control` 头部控制客户端缓存
- **最佳实践**: 根据数据特性选择合适的缓存策略
- **调试**: 使用调试端点和响应头来排查缓存问题

通过合理使用这些缓存控制机制，可以在保证性能的同时确保数据的实时性和准确性。

## 十六、中间件 Middleware

Next.js 中间件允许你在请求完成之前运行代码。基于传入的请求，你可以修改响应，通过重写、重定向、修改请求或响应头，或直接响应。

### 1. 基本概念

中间件在缓存内容和路由匹配之前运行。适用于需要在每个路由渲染之前执行逻辑的场景。

#### 创建中间件文件

在项目根目录创建 `middleware.ts` (或 `.js`)：

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 中间件逻辑
  return NextResponse.next();
}

// 配置匹配路径
export const config = {
  matcher: "/about/:path*"
};
```

### 2. 常用功能

#### 2.1 请求重定向

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 重定向到登录页
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 条件重定向
  if (request.nextUrl.pathname === "/old-page") {
    return NextResponse.redirect(new URL("/new-page", request.url));
  }

  return NextResponse.next();
}
```

#### 2.2 请求重写

```typescript
export function middleware(request: NextRequest) {
  // URL 重写
  if (request.nextUrl.pathname.startsWith("/api/old")) {
    return NextResponse.rewrite(new URL("/api/new", request.url));
  }

  // 基于条件的重写
  if (request.nextUrl.pathname === "/") {
    const country = request.geo?.country || "US";
    return NextResponse.rewrite(new URL(`/${country}`, request.url));
  }

  return NextResponse.next();
}
```

#### 2.3 修改请求和响应头

```typescript
export function middleware(request: NextRequest) {
  // 修改请求头
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  // 创建响应并修改响应头
  const response = NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });

  // 设置响应头
  response.headers.set("x-middleware-executed", "true");
  response.headers.set("x-timestamp", Date.now().toString());

  return response;
}
```

#### 2.4 Cookie 操作

```typescript
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // 读取 Cookie
  const theme = request.cookies.get("theme");

  if (!theme) {
    // 设置默认主题
    response.cookies.set("theme", "light");
  }

  // 设置多个 Cookie
  response.cookies.set({
    name: "session-id",
    value: "abc123",
    httpOnly: true,
    secure: true,
    maxAge: 3600
  });

  return response;
}
```

### 3. 高级用法

#### 3.1 身份验证中间件

```typescript
import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

const protectedRoutes = ["/dashboard", "/profile", "/admin"];
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // 检查是否为保护路由
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // 检查是否为认证路由
  const isAuthRoute = authRoutes.includes(pathname);

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      // 验证 JWT token
      verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 如果已登录用户访问认证页面，重定向到仪表板
  if (isAuthRoute && token) {
    try {
      verify(token, process.env.JWT_SECRET!);
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch (error) {
      // Token 无效，允许访问认证页面
    }
  }

  return NextResponse.next();
}
```

#### 3.2 API 限流中间件

```typescript
// 简单的内存限流（生产环境建议使用 Redis）
const rateLimitMap = new Map();

export function middleware(request: NextRequest) {
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";
  const limit = 10; // 每分钟最多 10 次请求
  const windowMs = 60 * 1000; // 1 分钟

  if (request.nextUrl.pathname.startsWith("/api/")) {
    const now = Date.now();
    const userRequests = rateLimitMap.get(ip) || [];

    // 清理过期请求记录
    const validRequests = userRequests.filter((timestamp: number) => now - timestamp < windowMs);

    if (validRequests.length >= limit) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }

    // 记录当前请求
    validRequests.push(now);
    rateLimitMap.set(ip, validRequests);
  }

  return NextResponse.next();
}
```

#### 3.3 国际化中间件

```typescript
const locales = ["en", "zh", "ja"];
const defaultLocale = "en";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 检查路径是否已包含语言前缀
  const pathnameHasLocale = locales.some(locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

  if (!pathnameHasLocale) {
    // 从 Accept-Language 头或 Cookie 中获取语言偏好
    const acceptLanguage = request.headers.get("accept-language");
    const cookieLocale = request.cookies.get("locale")?.value;

    let locale = defaultLocale;

    if (cookieLocale && locales.includes(cookieLocale)) {
      locale = cookieLocale;
    } else if (acceptLanguage) {
      locale = acceptLanguage.split(",")[0].split("-")[0];

      if (!locales.includes(locale)) {
        locale = defaultLocale;
      }
    }

    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  return NextResponse.next();
}
```

### 4. 匹配器配置

#### 4.1 基本匹配

```typescript
export const config = {
  // 匹配特定路径
  matcher: "/dashboard/:path*"
};

export const config = {
  // 匹配多个路径
  matcher: ["/dashboard/:path*", "/admin/:path*"]
};
```

#### 4.2 高级匹配

```typescript
export const config = {
  matcher: [
    // 匹配所有路径除了静态文件和 API 路由
    "/((?!api|_next/static|_next/image|favicon.ico).*)",

    // 只匹配 API 路由
    "/api/:path*",

    // 条件匹配
    {
      source: "/dashboard/:path*",
      has: [
        {
          type: "header",
          key: "x-middleware-preflight"
        }
      ]
    }
  ]
};
```

### 5. 错误处理

```typescript
export function middleware(request: NextRequest) {
  try {
    // 中间件逻辑
    const token = request.cookies.get("token")?.value;

    if (request.nextUrl.pathname.startsWith("/api/protected")) {
      if (!token) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      // 验证 token
      const payload = verify(token, process.env.JWT_SECRET!);

      // 将用户信息添加到请求头
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", payload.sub as string);

      return NextResponse.next({
        request: { headers: requestHeaders }
      });
    }
  } catch (error) {
    console.error("Middleware error:", error);

    // 对于 API 路由返回错误响应
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    // 对于页面路由重定向到错误页
    return NextResponse.redirect(new URL("/error", request.url));
  }

  return NextResponse.next();
}
```

### 6. 性能优化

#### 6.1 条件执行

```typescript
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 跳过静态资源
  if (pathname.startsWith("/_next/") || pathname.startsWith("/api/") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // 只对特定路径执行中间件逻辑
  if (pathname.startsWith("/dashboard")) {
    return authMiddleware(request);
  }

  return NextResponse.next();
}
```

#### 6.2 缓存优化

```typescript
// 使用简单缓存避免重复计算
const cache = new Map();

export function middleware(request: NextRequest) {
  const key = `${request.ip}-${request.nextUrl.pathname}`;

  if (cache.has(key)) {
    const cached = cache.get(key);
    if (Date.now() - cached.timestamp < 60000) {
      // 1分钟缓存
      return cached.response;
    }
  }

  const response = NextResponse.next();

  // 缓存结果
  cache.set(key, {
    response: response.clone(),
    timestamp: Date.now()
  });

  return response;
}
```

### 7. 调试和监控

```typescript
export function middleware(request: NextRequest) {
  const startTime = Date.now();

  console.log(`[Middleware] ${request.method} ${request.nextUrl.pathname}`);

  const response = NextResponse.next();

  // 添加执行时间头
  response.headers.set("x-middleware-duration", `${Date.now() - startTime}ms`);

  // 记录响应状态
  console.log(`[Middleware] Response: ${response.status}`);

  return response;
}
```

### 8. 最佳实践

1. **保持轻量**: 中间件会在每个请求上运行，避免重型操作
2. **早期返回**: 对不需要处理的路径尽早返回
3. **错误处理**: 始终包含适当的错误处理逻辑
4. **匹配器优化**: 使用精确的匹配器避免不必要的执行
5. **环境变量**: 敏感配置使用环境变量
6. **测试**: 编写测试确保中间件逻辑正确

### 9. 与其他功能集成

#### 9.1 与 App Router 集成

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // 为 App Router 添加自定义头
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  return NextResponse.next({
    request: { headers: requestHeaders }
  });
}

// app/dashboard/page.tsx
import { headers } from "next/headers";

export default function Dashboard() {
  const headersList = headers();
  const pathname = headersList.get("x-pathname");

  return <div>Current path: {pathname}</div>;
}
```

#### 9.2 与 API Routes 集成

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const response = NextResponse.next();
    response.headers.set("x-api-version", "1.0");
    return response;
  }

  return NextResponse.next();
}

// app/api/users/route.ts
import { headers } from "next/headers";

export async function GET() {
  const headersList = headers();
  const apiVersion = headersList.get("x-api-version");

  return Response.json({ version: apiVersion });
}
```

中间件是 Next.js 中强大的功能，合理使用可以实现认证、国际化、限流等多种功能，提升应用的安全性和用户体验。
