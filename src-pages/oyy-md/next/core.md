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

## 一、为什么使用服务端组件？

服务端组件（Server Components）是 React 18 和 Next.js 13+ 引入的一个重要特性，它们在服务器上渲染，而不是在客户端浏览器中渲染。以下是使用服务端组件的主要原因：

### 1. 性能优势

#### 更快的初始页面加载

- **减少 JavaScript 包大小**：服务端组件的代码不会发送到客户端，显著减少了 JavaScript 束的大小
- **更快的首次内容绘制（FCP）**：HTML 在服务器上预渲染，用户能更快看到页面内容
- **更好的 Core Web Vitals**：改善 LCP（最大内容绘制）和 CLS（累积布局偏移）指标

```tsx
// 服务端组件示例 - 这些代码不会发送到客户端
import { db } from "@/lib/database";

// 默认情况下，app 目录中的组件都是服务端组件
export default async function ProductList() {
  // 直接在服务端获取数据
  const products = await db.products.findMany();

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

### 2. 更好的 SEO

#### 服务端渲染的优势

- **搜索引擎友好**：内容在服务器上渲染，搜索引擎爬虫可以直接抓取完整的 HTML
- **社交媒体分享**：Open Graph 和 Twitter Card 元数据可以被正确解析
- **更快的索引**：不需要等待 JavaScript 执行就能获取页面内容

```tsx
// SEO 友好的服务端组件
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "产品列表",
  description: "查看我们的最新产品",
  openGraph: {
    title: "产品列表",
    description: "查看我们的最新产品"
  }
};

export default async function ProductPage() {
  const products = await fetchProducts();

  return (
    <main>
      <h1>产品列表</h1>
      {/* 内容在服务端渲染，SEO 友好 */}
    </main>
  );
}
```

### 3. 安全性

#### 敏感数据保护

- **API 密钥安全**：数据库连接字符串、API 密钥等敏感信息只在服务端使用
- **直接数据库访问**：可以直接连接数据库，无需创建 API 端点
- **减少攻击面**：敏感逻辑不暴露给客户端

```tsx
// 安全的服务端数据获取
import { db } from "@/lib/database";
import { currentUser } from "@/lib/auth";

export default async function UserDashboard() {
  // 这些敏感操作只在服务端执行
  const user = await currentUser();
  const userData = await db.user.findUnique({
    where: { id: user.id },
    include: {
      orders: true,
      paymentMethods: true // 敏感信息
    }
  });

  return <div>{/* 渲染用户数据 */}</div>;
}
```

### 4. 开发体验改善

#### 简化的数据获取

- **消除瀑布式请求**：可以并行获取多个数据源
- **自动错误处理**：配合 Error Boundaries 提供更好的错误处理
- **简化状态管理**：不需要复杂的客户端状态管理

```tsx
// 并行数据获取
async function getProductData(id: string) {
  // 这些请求会并行执行
  const [product, reviews, recommendations] = await Promise.all([
    fetchProduct(id),
    fetchReviews(id),
    fetchRecommendations(id)
  ]);

  return { product, reviews, recommendations };
}

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const { product, reviews, recommendations } = await getProductData(params.id);

  return (
    <div>
      <ProductInfo product={product} />
      <ReviewsList reviews={reviews} />
      <Recommendations items={recommendations} />
    </div>
  );
}
```

### 5. 成本效益

#### 资源优化

- **减少客户端计算**：将计算密集型任务移到服务端
- **缓存友好**：服务端渲染的内容可以在 CDN 层面缓存
- **带宽节省**：减少需要传输到客户端的 JavaScript 代码

### 6. 何时使用服务端组件

**适合使用服务端组件的场景：**

- 数据获取和展示
- 静态内容渲染
- SEO 重要的页面
- 初始页面加载性能要求高的场景

**需要客户端组件的场景：**

- 用户交互（onClick, onChange 等）
- 使用浏览器 API（localStorage, geolocation 等）
- 使用 React Hooks（useState, useEffect 等）
- 使用 React Context

```tsx
// 混合使用示例
// 服务端组件 - 获取数据
export default async function ShopPage() {
  const products = await fetchProducts();

  return (
    <div>
      <h1>商店</h1>
      {/* 客户端组件 - 处理交互 */}
      <SearchFilters />
      <ProductGrid products={products} />
    </div>
  );
}

// 客户端组件
("use client");
export function SearchFilters() {
  const [filter, setFilter] = useState("");
  // 处理用户交互
  return <input onChange={e => setFilter(e.target.value)} />;
}
```

服务端组件代表了 React 生态系统的一个重大进步，它们让我们能够构建更快、更安全、更 SEO 友好的应用程序，同时保持良好的开发体验。

## 二、不同类型组件交叉使用

在 Next.js 13+ 的 App Router 中，我们可以灵活地混合使用服务端组件和客户端组件，以充分发挥它们各自的优势。理解如何正确地组合这些不同类型的组件是构建高性能 React 应用的关键。

### 1. 组件类型概述

#### 服务端组件（Server Components）

- **默认类型**：App Router 中的组件默认是服务端组件
- **执行环境**：在服务器上渲染
- **特点**：
  - 可以直接访问数据库和 API
  - 不包含在客户端 JavaScript 包中
  - 无法使用浏览器专有 API
  - 无法使用状态和事件处理

#### 客户端组件（Client Components）

- **标识符**：需要 `"use client"` 指令
- **执行环境**：在浏览器中渲染
- **特点**：
  - 可以使用 React Hooks
  - 可以处理用户交互
  - 可以访问浏览器 API
  - 会增加 JavaScript 包大小

### 2. 组件交叉使用模式

#### 模式一：服务端组件包含客户端组件

这是最常见的模式，服务端组件作为容器，包含需要交互的客户端组件。

```tsx
// app/products/page.tsx - 服务端组件
import { Suspense } from "react";
import { db } from "@/lib/database";
import ProductList from "./ProductList";
import SearchBar from "./SearchBar";
import FilterPanel from "./FilterPanel";

export default async function ProductsPage() {
  // 在服务端获取初始数据
  const initialProducts = await db.products.findMany({
    take: 20,
    orderBy: { createdAt: "desc" }
  });

  const categories = await db.categories.findMany();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">产品列表</h1>

      {/* 客户端组件 - 处理搜索交互 */}
      <SearchBar />

      <div className="flex gap-6">
        {/* 客户端组件 - 处理筛选交互 */}
        <FilterPanel categories={categories} />

        {/* 使用 Suspense 处理异步加载 */}
        <Suspense fallback={<ProductListSkeleton />}>
          <ProductList initialProducts={initialProducts} />
        </Suspense>
      </div>
    </div>
  );
}
```

```tsx
// components/SearchBar.tsx - 客户端组件
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="搜索产品..."
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-lg">
          搜索
        </button>
      </div>
    </form>
  );
}
```

#### 模式二：客户端组件包含服务端组件

虽然不常见，但在某些情况下，客户端组件也可以包含服务端组件。

```tsx
// components/DashboardLayout.tsx - 客户端组件
"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarContent: React.ReactNode; // 服务端组件作为 children 传入
}

export default function DashboardLayout({ children, sidebarContent }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* 客户端交互控制侧边栏 */}
      <div className={`transition-all ${sidebarOpen ? "w-64" : "w-16"}`}>
        <Sidebar isOpen={sidebarOpen} onToggle={setSidebarOpen}>
          {sidebarContent} {/* 服务端组件内容 */}
        </Sidebar>
      </div>

      <div className="flex-1 flex flex-col">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto p-6">
          {children} {/* 可能包含服务端或客户端组件 */}
        </main>
      </div>
    </div>
  );
}
```

```tsx
// app/dashboard/page.tsx - 服务端组件
import DashboardLayout from "@/components/DashboardLayout";
import { getUserStats } from "@/lib/api";

export default async function DashboardPage() {
  const stats = await getUserStats();

  // 服务端组件作为侧边栏内容
  const sidebarContent = (
    <nav className="space-y-2">
      <a href="/dashboard" className="block p-2 hover:bg-gray-100">
        概览
      </a>
      <a href="/dashboard/analytics" className="block p-2 hover:bg-gray-100">
        分析
      </a>
      <div className="p-2 text-sm text-gray-500">活跃用户: {stats.activeUsers}</div>
    </nav>
  );

  return (
    <DashboardLayout sidebarContent={sidebarContent}>
      <div>
        <h1 className="text-2xl font-bold mb-4">仪表板</h1>
        <StatsGrid stats={stats} />
      </div>
    </DashboardLayout>
  );
}
```

### 3. 数据传递策略

#### Props 传递

最直接的方式是通过 props 将服务端获取的数据传递给客户端组件。

```tsx
// app/blog/page.tsx - 服务端组件
export default async function BlogPage() {
  const posts = await fetchPosts();

  return (
    <div>
      <h1>博客文章</h1>
      {/* 将服务端数据传递给客户端组件 */}
      <InteractiveBlogList posts={posts} />
    </div>
  );
}

// components/InteractiveBlogList.tsx - 客户端组件
("use client");

interface Post {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

interface Props {
  posts: Post[];
}

export default function InteractiveBlogList({ posts }: Props) {
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [selectedTag, setSelectedTag] = useState<string>("");

  const filterByTag = (tag: string) => {
    setSelectedTag(tag);
    if (tag === "") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.tags.includes(tag)));
    }
  };

  return (
    <div>
      <TagFilter onTagSelect={filterByTag} selectedTag={selectedTag} />
      <PostGrid posts={filteredPosts} />
    </div>
  );
}
```

#### Context 传递

对于需要跨多层组件传递的数据，可以使用 Context。

```tsx
// contexts/ThemeContext.tsx - 客户端 Context
"use client";

import { createContext, useContext, useState } from "react";

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  initialTheme = "light"
}: {
  children: React.ReactNode;
  initialTheme?: "light" | "dark";
}) {
  const [theme, setTheme] = useState<"light" | "dark">(initialTheme);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme === "dark" ? "dark" : ""}>{children}</div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
```

```tsx
// app/layout.tsx - 根布局
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

### 4. 性能优化策略

#### 动态导入

对于大型客户端组件，可以使用动态导入来减少初始包大小。

```tsx
// app/editor/page.tsx - 服务端组件
import dynamic from "next/dynamic";

// 动态导入重型客户端组件
const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false, // 禁用 SSR，仅在客户端渲染
  loading: () => <EditorSkeleton />
});

export default async function EditorPage() {
  const templates = await fetchTemplates();

  return (
    <div>
      <h1>内容编辑器</h1>
      <TemplateSelector templates={templates} />
      <RichTextEditor />
    </div>
  );
}
```

#### 组件边界优化

合理设置客户端组件边界，避免不必要的客户端渲染。

```tsx
// 不好的做法 - 整个组件都是客户端组件
"use client";
export default function ProductPage({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false);

  return (
    <div>
      <h1>{product.title}</h1> {/* 静态内容，不需要客户端渲染 */}
      <p>{product.description}</p>
      <ProductGallery images={product.images} />
      <button onClick={() => setLiked(!liked)}>{liked ? "已收藏" : "收藏"}</button>
    </div>
  );
}

// 好的做法 - 只将交互部分设为客户端组件
export default function ProductPage({ product }: { product: Product }) {
  return (
    <div>
      <h1>{product.title}</h1> {/* 服务端渲染 */}
      <p>{product.description}</p>
      <ProductGallery images={product.images} />
      <LikeButton /> {/* 客户端组件 */}
    </div>
  );
}

// components/LikeButton.tsx
("use client");
export default function LikeButton() {
  const [liked, setLiked] = useState(false);

  return <button onClick={() => setLiked(!liked)}>{liked ? "已收藏" : "收藏"}</button>;
}
```

### 5. 常见陷阱和最佳实践

#### 避免的陷阱

1. **不要在服务端组件中使用浏览器 API**

```tsx
// ❌ 错误：服务端组件中使用 localStorage
export default function ProfilePage() {
  const user = localStorage.getItem("user"); // 报错！
  return <div>{user}</div>;
}

// ✅ 正确：在客户端组件中使用
("use client");
export default function ProfilePage() {
  const [user, setUser] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    setUser(userData || "");
  }, []);

  return <div>{user}</div>;
}
```

2. **不要将函数作为 props 传递给服务端组件**

```tsx
// ❌ 错误：向服务端组件传递函数
export default function Page() {
  const handleClick = () => console.log("clicked");

  return <ServerComponent onClick={handleClick} />; // 报错！
}

// ✅ 正确：包装为客户端组件
("use client");
export default function ClickableWrapper({ children }: { children: React.ReactNode }) {
  const handleClick = () => console.log("clicked");

  return <div onClick={handleClick}>{children}</div>;
}
```

#### 最佳实践

1. **优先使用服务端组件**：除非明确需要客户端功能，否则默认使用服务端组件
2. **精细化客户端边界**：只将需要交互的部分设为客户端组件
3. **合理使用 Suspense**：为异步组件提供加载状态
4. **数据预取**：在服务端组件中预取数据，通过 props 传递给客户端组件
5. **错误边界**：为客户端组件提供错误处理机制

```tsx
// 组合使用示例
export default async function ShoppingCartPage() {
  // 服务端获取数据
  const cartItems = await getCartItems();
  const recommendations = await getRecommendations();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">购物车</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 客户端组件 - 处理购物车交互 */}
        <div className="lg:col-span-2">
          <ErrorBoundary fallback={<CartError />}>
            <Suspense fallback={<CartSkeleton />}>
              <InteractiveCart items={cartItems} />
            </Suspense>
          </ErrorBoundary>
        </div>

        {/* 服务端组件 - 静态推荐内容 */}
        <div>
          <h2 className="text-lg font-semibold mb-4">推荐商品</h2>
          <RecommendationList items={recommendations} />
        </div>
      </div>
    </div>
  );
}
```

通过合理地组合服务端组件和客户端组件，我们可以构建既高性能又交互丰富的现代 Web 应用程序。关键是理解每种组件类型的优势和限制，并根据具体需求选择合适的模式。

## 三、Server-only

Server-only 是 Next.js 提供的一个重要功能，用于确保某些代码只在服务端执行，永远不会被发送到客户端。这对于保护敏感信息、优化性能和确保安全性至关重要。

### 1. 什么是 Server-only

Server-only 是一个 Next.js 包，用于标记某些模块或代码只能在服务端运行。当这些代码意外地被客户端组件导入时，会在构建时抛出错误，帮助开发者及早发现问题。

#### 安装 Server-only

```bash
npm install server-only
```

#### 基本用法

```tsx
// lib/database.ts
import "server-only";

import { MongoClient } from "mongodb";

// 这个模块只能在服务端使用
const client = new MongoClient(process.env.MONGODB_URI!);

export async function connectToDatabase() {
  await client.connect();
  return client.db("myapp");
}

export async function getUsers() {
  const db = await connectToDatabase();
  return db.collection("users").find({}).toArray();
}
```

```tsx
// components/UserList.tsx - 服务端组件
import { getUsers } from "@/lib/database"; // ✅ 在服务端组件中使用

export default async function UserList() {
  const users = await getUsers();

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

```tsx
// components/ClientComponent.tsx - 客户端组件
"use client";

import { getUsers } from "@/lib/database"; // ❌ 构建时会报错！

export default function ClientComponent() {
  // 这里会在构建时失败
  return <div>Client Component</div>;
}
```

### 2. Server-only 的应用场景

#### 数据库连接和查询

```tsx
// lib/db/connection.ts
import "server-only";

import { PrismaClient } from "@prisma/client";

// 确保数据库连接只在服务端创建
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

```tsx
// lib/db/users.ts
import "server-only";

import { prisma } from "./connection";

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true
      // 不包含敏感字段如密码哈希
    }
  });
}

export async function getUserWithSensitiveData(id: string) {
  // 这个函数包含敏感操作，必须只在服务端运行
  return prisma.user.findUnique({
    where: { id },
    include: {
      paymentMethods: true,
      privateNotes: true,
      internalMetadata: true
    }
  });
}
```

#### API 密钥和敏感配置

```tsx
// lib/services/external-api.ts
import "server-only";

// 敏感的 API 配置
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
const ADMIN_API_TOKEN = process.env.ADMIN_API_TOKEN!;

export class PaymentService {
  private stripe = new Stripe(STRIPE_SECRET_KEY);

  async createPaymentIntent(amount: number, currency: string) {
    return this.stripe.paymentIntents.create({
      amount,
      currency
    });
  }

  async refundPayment(paymentIntentId: string) {
    return this.stripe.refunds.create({
      payment_intent: paymentIntentId
    });
  }
}

export class AdminService {
  async getSystemStats() {
    const response = await fetch("https://api.internal.com/stats", {
      headers: {
        "Authorization": `Bearer ${ADMIN_API_TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    return response.json();
  }
}
```

#### 安全验证和授权

```tsx
// lib/auth/server-auth.ts
import "server-only";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get("auth-token");

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token.value, JWT_SECRET);
    return payload as { userId: string; role: string };
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "admin") {
    throw new Error("Admin access required");
  }
  return user;
}
```

#### 数据验证和清理

```tsx
// lib/validation/server-validation.ts
import "server-only";

import { z } from "zod";

// 服务端验证模式，可能包含敏感的业务逻辑
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100),
  // 内部字段，不应该暴露给客户端
  internalReferenceId: z.string().optional(),
  adminNotes: z.string().optional()
});

export async function validateAndCreateUser(data: unknown) {
  // 严格的服务端验证
  const validatedData = createUserSchema.parse(data);

  // 额外的业务逻辑验证
  const existingUser = await checkUserExists(validatedData.email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  // 密码哈希等敏感操作
  const hashedPassword = await hashPassword(validatedData.password);

  return {
    ...validatedData,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

async function checkUserExists(email: string) {
  // 数据库查询逻辑
}

async function hashPassword(password: string) {
  // 密码哈希逻辑
}
```

### 3. Server-only vs Client-only

Next.js 同时提供了 `server-only` 和 `client-only` 包，用于在不同环境中限制代码执行。

#### 使用 Client-only

```bash
npm install client-only
```

```tsx
// lib/browser-utils.ts
import "client-only";

// 只能在客户端使用的工具函数
export function getLocalStorageItem(key: string) {
  return localStorage.getItem(key);
}

export function setLocalStorageItem(key: string, value: string) {
  localStorage.setItem(key, value);
}

export function getCurrentLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

export function playAudio(src: string) {
  const audio = new Audio(src);
  return audio.play();
}
```

#### 组合使用示例

```tsx
// lib/analytics/server.ts
import "server-only";

export async function trackServerEvent(event: string, data: any) {
  // 服务端分析跟踪
  await fetch("https://analytics-api.internal.com/track", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.ANALYTICS_SECRET}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ event, data, timestamp: Date.now() })
  });
}
```

```tsx
// lib/analytics/client.ts
import "client-only";

export function trackClientEvent(event: string, data: any) {
  // 客户端分析跟踪
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", event, data);
  }
}

export function setupClientAnalytics() {
  // 初始化客户端分析工具
  if (typeof window !== "undefined") {
    // Google Analytics, Mixpanel 等的初始化代码
  }
}
```

### 4. 实际应用示例

#### 完整的用户管理系统

```tsx
// lib/user-service.ts
import "server-only";

import { prisma } from "./db/connection";
import { requireAuth, requireAdmin } from "./auth/server-auth";
import { hashPassword, verifyPassword } from "./crypto";

export async function createUser(data: { email: string; password: string; name: string }) {
  await requireAdmin(); // 只有管理员可以创建用户

  const hashedPassword = await hashPassword(data.password);

  return prisma.user.create({
    data: {
      ...data,
      password: hashedPassword
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true
      // 不返回密码
    }
  });
}

export async function updateUserProfile(
  userId: string,
  data: {
    name?: string;
    bio?: string;
  }
) {
  const currentUser = await requireAuth();

  // 确保用户只能更新自己的资料
  if (currentUser.userId !== userId) {
    throw new Error("Forbidden");
  }

  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      bio: true,
      updatedAt: true
    }
  });
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  const currentUser = await requireAuth();

  if (currentUser.userId !== userId) {
    throw new Error("Forbidden");
  }

  // 验证当前密码
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true }
  });

  if (!user || !(await verifyPassword(currentPassword, user.password))) {
    throw new Error("Invalid current password");
  }

  // 更新密码
  const hashedNewPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword }
  });

  return { success: true };
}
```

#### 在组件中使用

```tsx
// app/admin/users/page.tsx - 服务端组件
import { createUser } from "@/lib/user-service";
import { redirect } from "next/navigation";
import CreateUserForm from "./CreateUserForm";

export default async function AdminUsersPage() {
  async function handleCreateUser(formData: FormData) {
    "use server";

    try {
      await createUser({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        name: formData.get("name") as string
      });

      redirect("/admin/users?success=created");
    } catch (error) {
      redirect("/admin/users?error=creation-failed");
    }
  }

  return (
    <div>
      <h1>用户管理</h1>
      <CreateUserForm action={handleCreateUser} />
    </div>
  );
}
```

### 5. 最佳实践

#### 组织代码结构

```
lib/
├── server/           # 服务端专用代码
│   ├── database/
│   ├── auth/
│   ├── services/
│   └── utils/
├── client/           # 客户端专用代码
│   ├── hooks/
│   ├── utils/
│   └── stores/
└── shared/           # 共享代码（类型定义、常量等）
    ├── types/
    ├── constants/
    └── validators/
```

#### 错误处理

```tsx
// lib/error-handling.ts
import "server-only";

export class ServerError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
    this.name = "ServerError";
  }
}

export function handleServerError(error: unknown) {
  console.error("Server error:", error);

  if (error instanceof ServerError) {
    return {
      error: error.message,
      statusCode: error.statusCode
    };
  }

  return {
    error: "Internal server error",
    statusCode: 500
  };
}
```

#### 类型安全

```tsx
// lib/types/server.ts
import "server-only";

// 服务端专用类型
export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string; // 敏感信息，不应该暴露给客户端
  database: string;
}

export interface InternalUser {
  id: string;
  email: string;
  passwordHash: string; // 敏感字段
  internalNotes: string; // 内部备注
  createdAt: Date;
  updatedAt: Date;
}

// 清理后的用户类型，可以传递给客户端
export interface PublicUser {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export function sanitizeUser(user: InternalUser): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt
  };
}
```

### 6. 调试和测试

#### 开发时检查

```tsx
// lib/dev-utils.ts
import "server-only";

export function logServerOnly(message: string, data?: any) {
  if (process.env.NODE_ENV === "development") {
    console.log("[SERVER ONLY]", message, data);
  }
}

export function assertServerEnvironment() {
  if (typeof window !== "undefined") {
    throw new Error("This code should only run on the server");
  }
}
```

#### 测试 Server-only 代码

```tsx
// __tests__/server-only.test.ts
import { jest } from "@jest/globals";

// 模拟服务端环境
delete (global as any).window;

describe("Server-only functionality", () => {
  beforeEach(() => {
    // 确保测试运行在服务端环境
    delete (global as any).window;
  });

  it("should work in server environment", async () => {
    const { getUserById } = await import("../lib/db/users");

    // 测试服务端专用函数
    const result = await getUserById("test-id");
    expect(result).toBeDefined();
  });

  it("should throw error when imported in client", () => {
    // 模拟客户端环境
    (global as any).window = {};

    expect(() => {
      require("../lib/db/users");
    }).toThrow();
  });
});
```

Server-only 是确保 Next.js 应用安全性和性能的重要工具。通过正确使用它，我们可以：

1. **保护敏感信息**：确保数据库连接、API 密钥等不会泄露到客户端
2. **优化性能**：减少客户端 JavaScript 包大小
3. **提高安全性**：防止敏感业务逻辑暴露
4. **改善开发体验**：在构建时就能发现潜在的安全问题

记住，Server-only 不仅仅是一个技术工具，更是一种安全和架构的最佳实践。

## 四、数据的重新验证

数据的重新验证（Data Revalidation）是 Next.js 中确保数据新鲜度和应用性能的核心机制。它允许我们在保持静态渲染优势的同时，确保用户看到的是最新的数据。

### 1. 什么是数据重新验证

数据重新验证是指在特定条件下重新获取数据并更新缓存的过程。Next.js 提供了多种重新验证策略，让我们能够平衡性能和数据新鲜度。

#### 基本概念

- **静态生成（SSG）**：构建时生成页面，性能最佳但数据可能过时
- **增量静态再生（ISR）**：结合静态生成和服务端渲染的优势
- **按需重新验证**：在特定事件触发时更新数据
- **时间基础重新验证**：定期更新数据

### 2. 时间基础重新验证（Time-based Revalidation）

#### 使用 revalidate 属性

```tsx
// app/blog/page.tsx
import { getPosts } from "@/lib/api";

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div>
      <h1>博客文章</h1>
      <div className="grid gap-4">
        {posts.map(post => (
          <article key={post.id} className="border p-4 rounded">
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-gray-600">{post.excerpt}</p>
            <time className="text-sm text-gray-500">{new Date(post.publishedAt).toLocaleDateString()}</time>
          </article>
        ))}
      </div>
    </div>
  );
}

// 每60秒重新验证一次数据
export const revalidate = 60;
```

#### 在数据获取函数中设置重新验证

```tsx
// lib/api.ts
import { unstable_cache } from "next/cache";

export const getPosts = unstable_cache(
  async () => {
    const response = await fetch("https://api.example.com/posts");
    const posts = await response.json();
    return posts;
  },
  ["posts"], // 缓存键
  {
    revalidate: 3600, // 1小时后重新验证
    tags: ["posts"] // 用于按需重新验证的标签
  }
);

export const getPostById = unstable_cache(
  async (id: string) => {
    const response = await fetch(`https://api.example.com/posts/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch post");
    }
    return response.json();
  },
  ["post"], // 缓存键前缀
  {
    revalidate: 1800, // 30分钟后重新验证
    tags: ["posts", "post"]
  }
);
```

#### 使用 fetch 的 next.revalidate 选项

```tsx
// app/products/page.tsx
async function getProducts() {
  const response = await fetch("https://api.shop.com/products", {
    next: {
      revalidate: 900 // 15分钟后重新验证
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <h1>产品列表</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: any) => (
          <div key={product.id} className="border rounded-lg p-4">
            <h2 className="font-semibold">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <div className="mt-2">
              <span className="text-lg font-bold">¥{product.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 3. 按需重新验证（On-demand Revalidation）

#### 使用 revalidateTag

```tsx
// app/api/revalidate/route.ts
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const tag = request.nextUrl.searchParams.get("tag");

  // 验证密钥
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  if (!tag) {
    return NextResponse.json({ message: "Tag is required" }, { status: 400 });
  }

  try {
    // 重新验证指定标签的缓存
    revalidateTag(tag);
    return NextResponse.json({ revalidated: true, tag });
  } catch (error) {
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
```

#### 使用 revalidatePath

```tsx
// app/api/posts/route.ts
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 创建新文章的逻辑
    const newPost = await createPost(body);

    // 重新验证相关页面
    revalidatePath("/blog");
    revalidatePath("/");
    revalidatePath(`/blog/${newPost.id}`);

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

async function createPost(data: any) {
  // 实际的创建文章逻辑
  return {
    id: Date.now().toString(),
    title: data.title,
    content: data.content,
    createdAt: new Date()
  };
}
```

#### 在 Server Actions 中使用重新验证

```tsx
// app/admin/posts/new/page.tsx
import { revalidateTag, revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function createPost(formData: FormData) {
  "use server";

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  try {
    // 创建文章
    const response = await fetch("https://api.example.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, content })
    });

    if (!response.ok) {
      throw new Error("Failed to create post");
    }

    // 重新验证相关缓存
    revalidateTag("posts");
    revalidatePath("/blog");
    revalidatePath("/admin/posts");
  } catch (error) {
    throw new Error("Failed to create post");
  }

  redirect("/admin/posts");
}

export default function NewPostPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">创建新文章</h1>

      <form action={createPost} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            标题
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            内容
          </label>
          <textarea
            id="content"
            name="content"
            rows={10}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          创建文章
        </button>
      </form>
    </div>
  );
}
```

### 4. 不同重新验证策略的比较

#### 静态渲染 + 时间基础重新验证

```tsx
// app/news/page.tsx - ISR 模式
import { getNews } from "@/lib/api";

export default async function NewsPage() {
  const news = await getNews();

  return (
    <div>
      <h1>新闻资讯</h1>
      <p className="text-sm text-gray-500 mb-4">数据更新时间: {new Date().toLocaleString()}</p>
      {news.map((item: any) => (
        <article key={item.id} className="mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold">{item.title}</h2>
          <p className="text-gray-600 mt-2">{item.summary}</p>
          <time className="text-sm text-gray-500 mt-2 block">{new Date(item.publishedAt).toLocaleString()}</time>
        </article>
      ))}
    </div>
  );
}

// 每5分钟重新验证
export const revalidate = 300;
```

#### 动态渲染（实时数据）

```tsx
// app/dashboard/page.tsx - 动态渲染
import { getCurrentUser } from "@/lib/auth";
import { getUserStats } from "@/lib/api";

export default async function DashboardPage() {
  // 每次请求都重新获取数据
  const user = await getCurrentUser();
  const stats = await getUserStats(user.id);

  return (
    <div>
      <h1>用户仪表板</h1>
      <p>欢迎回来, {user.name}!</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-blue-100 p-4 rounded">
          <h3 className="font-semibold">总订单</h3>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <h3 className="font-semibold">本月销售</h3>
          <p className="text-2xl font-bold">¥{stats.monthlySales}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <h3 className="font-semibold">待处理</h3>
          <p className="text-2xl font-bold">{stats.pendingOrders}</p>
        </div>
      </div>
    </div>
  );
}

// 强制动态渲染
export const dynamic = "force-dynamic";
```

### 5. 缓存和重新验证的高级用法

#### 使用缓存标签进行精细控制

```tsx
// lib/cache-utils.ts
import { unstable_cache } from "next/cache";

// 通用的缓存封装函数
export function createCachedFunction<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  keyPrefix: string,
  options: {
    revalidate?: number;
    tags?: string[];
  } = {}
) {
  return unstable_cache(fn, [keyPrefix], {
    revalidate: options.revalidate || 3600,
    tags: options.tags || []
  });
}

// 使用示例
export const getCachedUserProfile = createCachedFunction(
  async (userId: string) => {
    const response = await fetch(`https://api.example.com/users/${userId}`);
    return response.json();
  },
  "user-profile",
  {
    revalidate: 1800, // 30分钟
    tags: ["user-profile"]
  }
);

export const getCachedProductsByCategory = createCachedFunction(
  async (categoryId: string) => {
    const response = await fetch(`https://api.example.com/categories/${categoryId}/products`);
    return response.json();
  },
  "products-by-category",
  {
    revalidate: 600, // 10分钟
    tags: ["products", `category-${categoryId}`]
  }
);
```

#### 条件重新验证

```tsx
// lib/conditional-revalidation.ts
import { unstable_cache } from "next/cache";

export const getProductsWithConditionalCache = unstable_cache(
  async (userId?: string) => {
    const baseUrl = "https://api.example.com/products";
    const url = userId ? `${baseUrl}?userId=${userId}` : baseUrl;

    const response = await fetch(url);
    const products = await response.json();

    return {
      products,
      timestamp: Date.now(),
      isPersonalized: !!userId
    };
  },
  ["products-conditional"],
  {
    revalidate: data => {
      // 个性化数据缓存时间较短
      return data?.isPersonalized ? 300 : 1800;
    },
    tags: ["products"]
  }
);
```

### 6. 最佳实践和性能优化

#### 智能缓存策略

```tsx
// lib/smart-cache.ts
import { unstable_cache } from "next/cache";

interface CacheConfig {
  key: string;
  revalidate: number;
  tags: string[];
  staleWhileRevalidate?: boolean;
}

export class SmartCache {
  static create<T extends any[], R>(fn: (...args: T) => Promise<R>, config: CacheConfig) {
    return unstable_cache(
      async (...args: T) => {
        try {
          const result = await fn(...args);
          return {
            data: result,
            success: true,
            timestamp: Date.now()
          };
        } catch (error) {
          console.error(`Cache function error for key ${config.key}:`, error);
          throw error;
        }
      },
      [config.key],
      {
        revalidate: config.revalidate,
        tags: config.tags
      }
    );
  }

  static async warmup<T>(cachedFunction: (...args: any[]) => Promise<T>, args: any[] = []) {
    try {
      await cachedFunction(...args);
      console.log("Cache warmed up successfully");
    } catch (error) {
      console.error("Failed to warm up cache:", error);
    }
  }
}

// 使用示例
export const getCachedPopularProducts = SmartCache.create(
  async () => {
    const response = await fetch("https://api.example.com/products/popular");
    return response.json();
  },
  {
    key: "popular-products",
    revalidate: 1800, // 30分钟
    tags: ["products", "popular"]
  }
);
```

#### 缓存预热和后台更新

```tsx
// lib/cache-warming.ts
import { getCachedPopularProducts, getCachedUserProfile } from "./smart-cache";

export async function warmupCriticalCaches() {
  const warmupTasks = [
    // 预热热门产品缓存
    SmartCache.warmup(getCachedPopularProducts),

    // 预热默认用户配置
    SmartCache.warmup(getCachedUserProfile, ["default"])
  ];

  await Promise.allSettled(warmupTasks);
}

// 在应用启动时调用
// middleware.ts 或 app 初始化时
export async function initializeCache() {
  if (process.env.NODE_ENV === "production") {
    await warmupCriticalCaches();
  }
}
```

### 7. 监控和调试

#### 缓存性能监控

```tsx
// lib/cache-monitor.ts
import { unstable_cache } from "next/cache";

interface CacheMetrics {
  hits: number;
  misses: number;
  errors: number;
  totalRequests: number;
  averageResponseTime: number;
}

class CacheMonitor {
  private metrics = new Map<string, CacheMetrics>();

  wrapWithMonitoring<T extends any[], R>(fn: (...args: T) => Promise<R>, key: string, cacheConfig: any) {
    return unstable_cache(
      async (...args: T) => {
        const startTime = Date.now();
        const metric = this.getOrCreateMetric(key);

        try {
          const result = await fn(...args);
          const responseTime = Date.now() - startTime;

          this.updateMetrics(key, {
            hit: true,
            responseTime,
            error: false
          });

          return result;
        } catch (error) {
          this.updateMetrics(key, {
            hit: false,
            responseTime: Date.now() - startTime,
            error: true
          });
          throw error;
        }
      },
      [key],
      cacheConfig
    );
  }

  private getOrCreateMetric(key: string): CacheMetrics {
    if (!this.metrics.has(key)) {
      this.metrics.set(key, {
        hits: 0,
        misses: 0,
        errors: 0,
        totalRequests: 0,
        averageResponseTime: 0
      });
    }
    return this.metrics.get(key)!;
  }

  private updateMetrics(key: string, update: { hit: boolean; responseTime: number; error: boolean }) {
    const metric = this.metrics.get(key)!;

    metric.totalRequests++;

    if (update.error) {
      metric.errors++;
    } else if (update.hit) {
      metric.hits++;
    } else {
      metric.misses++;
    }

    // 更新平均响应时间
    metric.averageResponseTime =
      (metric.averageResponseTime * (metric.totalRequests - 1) + update.responseTime) / metric.totalRequests;
  }

  getMetrics(): Map<string, CacheMetrics> {
    return new Map(this.metrics);
  }

  logMetrics() {
    console.table(
      Array.from(this.metrics.entries()).map(([key, metrics]) => ({
        key,
        ...metrics,
        hitRate: `${((metrics.hits / metrics.totalRequests) * 100).toFixed(2)}%`
      }))
    );
  }
}

export const cacheMonitor = new CacheMonitor();
```

### 8. 实际应用场景

#### 电商网站的缓存策略

```tsx
// app/products/[id]/page.tsx
import { getProduct, getRelatedProducts, getProductReviews } from "@/lib/ecommerce";

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  // 并行获取数据，每个都有不同的缓存策略
  const [product, relatedProducts, reviews] = await Promise.all([
    getProduct(params.id), // 缓存24小时
    getRelatedProducts(params.id), // 缓存1小时
    getProductReviews(params.id) // 缓存30分钟
  ]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 产品信息 */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold text-green-600 mb-4">¥{product.price}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* 客户端交互组件 */}
          <AddToCartButton productId={product.id} />
        </div>

        {/* 产品图片 */}
        <div>
          <ProductImageGallery images={product.images} />
        </div>
      </div>

      {/* 相关产品 */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">相关产品</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {relatedProducts.map((relatedProduct: any) => (
            <ProductCard key={relatedProduct.id} product={relatedProduct} />
          ))}
        </div>
      </section>

      {/* 用户评价 */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">用户评价</h2>
        <ReviewsList reviews={reviews} />
      </section>
    </div>
  );
}

// 静态参数生成
export async function generateStaticParams() {
  const popularProducts = await getPopularProductIds();

  return popularProducts.map((id: string) => ({
    id: id
  }));
}

// 产品页面每2小时重新验证
export const revalidate = 7200;
```

#### 内容管理系统的缓存策略

```tsx
// app/cms/posts/[slug]/page.tsx
import { getPost, getRelatedPosts } from "@/lib/cms";
import { notFound } from "next/navigation";

interface PostPageProps {
  params: { slug: string };
}

export default async function PostPage({ params }: PostPageProps) {
  try {
    const [post, relatedPosts] = await Promise.all([getPost(params.slug), getRelatedPosts(params.slug, 3)]);

    if (!post) {
      notFound();
    }

    return (
      <article className="max-w-4xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <span>作者: {post.author.name}</span>
            <span>发布时间: {new Date(post.publishedAt).toLocaleDateString()}</span>
            <span>阅读时间: {post.readingTime} 分钟</span>
          </div>
        </header>

        <div className="prose max-w-none mb-12">
          {/* 渲染文章内容 */}
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* 相关文章 */}
        {relatedPosts.length > 0 && (
          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">相关文章</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost: any) => (
                <PostCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </section>
        )}
      </article>
    );
  } catch (error) {
    console.error("Error loading post:", error);
    notFound();
  }
}

// 内容页面每1小时重新验证
export const revalidate = 3600;
```

数据重新验证是 Next.js 中平衡性能和数据新鲜度的核心机制。通过合理使用时间基础重新验证、按需重新验证和智能缓存策略，我们可以构建既快速又始终保持数据最新的现代 Web 应用程序。

关键要点：

1. **选择合适的重新验证策略**：根据数据的更新频率和重要性
2. **使用缓存标签**：实现精细的缓存控制
3. **监控缓存性能**：确保缓存策略的有效性
4. **优化缓存边界**：避免过度缓存或缓存不足
5. **提供降级方案**：处理缓存失效的情况

## 五、缓存类型

Next.js 提供了多种缓存机制来优化应用性能。理解这些不同类型的缓存以及它们的使用场景对于构建高性能的 Web 应用至关重要。

### 1. 缓存层次结构

Next.js 的缓存系统是分层的，从最接近用户的缓存到服务端缓存：

```
用户浏览器
    ↓
CDN/边缘缓存
    ↓
Next.js 路由缓存
    ↓
Next.js 数据缓存
    ↓
数据库/API
```

### 2. 请求记忆化（Request Memoization）

`React`拓展了`fetch API`以自动记住具有相同`URL`和选项的请求，这意味着你可以在 React 组件树中的多个位置为相同的数据调用`fetch`函数，而只执行一次请求。
比如你需要在一条路由中使用相同的数据，就不需要在树的顶部获取数据，并在组件之间转发 props，相反，可以在需要获取数据的组件中直接使用`fetch`请求去获取数据，而不需要担心
通过网络请求对相同数据发出多个请求会对性能有影响。

**注意:**`请求记忆`是 React 的一个功能，并不是 nextjs 的功能，并且记忆化仅使用于`fetch`请求中的`GET`方法

#### 工作原理

```tsx
// lib/api.ts
async function fetchUser(id: string) {
  console.log(`Fetching user ${id}`); // 在单个请求中只会打印一次

  const response = await fetch(`https://api.example.com/users/${id}`);
  return response.json();
}

// app/profile/[id]/page.tsx
export default async function ProfilePage({ params }: { params: { id: string } }) {
  // 这些调用会被记忆化，实际只发送一次请求
  const user1 = await fetchUser(params.id);
  const user2 = await fetchUser(params.id);
  const user3 = await fetchUser(params.id);

  return (
    <div>
      <h1>{user1.name}</h1>
      <p>Email: {user2.email}</p>
      <p>Role: {user3.role}</p>
    </div>
  );
}
```

#### 手动记忆化控制

```tsx
// lib/memoization.ts
import { cache } from "react";

// 使用 React cache 手动控制记忆化
export const getUser = cache(async (id: string) => {
  console.log(`Fetching user ${id}`);

  const response = await fetch(`https://api.example.com/users/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json();
});

export const getUserPosts = cache(async (userId: string) => {
  console.log(`Fetching posts for user ${userId}`);

  const response = await fetch(`https://api.example.com/users/${userId}/posts`);
  return response.json();
});
```

#### 记忆化的作用域

```tsx
// components/UserProfile.tsx
import { getUser } from "@/lib/memoization";

export async function UserProfile({ userId }: { userId: string }) {
  const user = await getUser(userId); // 第一次调用

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold">{user.name}</h2>
      <UserStats userId={userId} />
      <UserActivity userId={userId} />
    </div>
  );
}

async function UserStats({ userId }: { userId: string }) {
  const user = await getUser(userId); // 复用记忆化结果

  return (
    <div className="mt-4">
      <p>Posts: {user.postsCount}</p>
      <p>Followers: {user.followersCount}</p>
    </div>
  );
}

async function UserActivity({ userId }: { userId: string }) {
  const user = await getUser(userId); // 复用记忆化结果

  return (
    <div className="mt-4">
      <p>Last active: {user.lastActiveAt}</p>
      <p>Join date: {user.createdAt}</p>
    </div>
  );
}
```

#### 退出缓存记忆

有时候我们需要退出请求记忆化，确保每次都发起新的请求。Next.js 和 React 提供了几种方式来实现这一点。

##### 使用 AbortController 退出记忆化

```tsx
// lib/api-no-memo.ts
// 每次调用都会发起新的请求
export async function fetchUserWithoutMemo(id: string) {
  // 创建新的 AbortController 确保每次请求都是独立的
  const controller = new AbortController();

  const response = await fetch(`https://api.example.com/users/${id}`, {
    signal: controller.signal,
    // 添加随机参数确保 URL 不同
    cache: "no-store"
  });

  return response.json();
}

// app/user/[id]/page.tsx
export default async function UserPage({ params }: { params: { id: string } }) {
  // 这些调用不会被记忆化，每次都会发起新请求
  const user1 = await fetchUserWithoutMemo(params.id);
  const user2 = await fetchUserWithoutMemo(params.id);

  console.log("两次请求的时间戳是否相同:", user1.timestamp === user2.timestamp); // false

  return (
    <div>
      <h1>用户信息</h1>
      <p>第一次请求时间: {user1.timestamp}</p>
      <p>第二次请求时间: {user2.timestamp}</p>
    </div>
  );
}
```

##### 使用 cache: 'no-store' 选项

```tsx
// lib/real-time-data.ts
// 实时数据获取，不使用缓存记忆
export async function getCurrentPrice(symbol: string) {
  const response = await fetch(`https://api.stock.com/price/${symbol}`, {
    cache: "no-store", // 禁用所有缓存包括记忆化
    headers: {
      "Cache-Control": "no-cache"
    }
  });

  return response.json();
}

export async function getServerTime() {
  const response = await fetch("https://api.time.com/now", {
    cache: "no-store"
  });

  return response.json();
}

// app/trading/page.tsx
export default async function TradingPage() {
  // 每次调用都获取最新数据
  const [price1, price2, time1, time2] = await Promise.all([
    getCurrentPrice("AAPL"),
    getCurrentPrice("AAPL"), // 不会复用第一次的结果
    getServerTime(),
    getServerTime() // 不会复用第一次的结果
  ]);

  return (
    <div>
      <h1>实时交易数据</h1>
      <p>
        第一次价格查询: ${price1.price} (时间: {price1.timestamp})
      </p>
      <p>
        第二次价格查询: ${price2.price} (时间: {price2.timestamp})
      </p>
      <p>第一次服务器时间: {time1.time}</p>
      <p>第二次服务器时间: {time2.time}</p>
    </div>
  );
}
```

##### 添加唯一参数退出记忆化

```tsx
// lib/dynamic-fetch.ts
// 通过添加时间戳或随机数确保 URL 唯一
export async function fetchWithTimestamp(url: string) {
  const timestampedUrl = `${url}?_t=${Date.now()}`;

  const response = await fetch(timestampedUrl);
  return response.json();
}

export async function fetchWithRandom(url: string) {
  const randomUrl = `${url}?_r=${Math.random()}`;

  const response = await fetch(randomUrl);
  return response.json();
}

// 使用示例
export default async function DynamicDataPage() {
  // 这些请求不会被记忆化，因为 URL 每次都不同
  const data1 = await fetchWithTimestamp("https://api.example.com/data");
  const data2 = await fetchWithTimestamp("https://api.example.com/data");

  const random1 = await fetchWithRandom("https://api.example.com/random");
  const random2 = await fetchWithRandom("https://api.example.com/random");

  return (
    <div>
      <h1>动态数据</h1>
      <p>时间戳数据1: {JSON.stringify(data1)}</p>
      <p>时间戳数据2: {JSON.stringify(data2)}</p>
      <p>随机数据1: {JSON.stringify(random1)}</p>
      <p>随机数据2: {JSON.stringify(random2)}</p>
    </div>
  );
}
```

##### 使用不同的请求选项

```tsx
// lib/varied-requests.ts
// 通过改变请求选项来避免记忆化
export async function fetchUserWithDifferentHeaders(id: string, requestId: string) {
  const response = await fetch(`https://api.example.com/users/${id}`, {
    headers: {
      "X-Request-ID": requestId, // 每次使用不同的请求ID
      "Content-Type": "application/json"
    }
  });

  return response.json();
}

export async function fetchWithDifferentMethods(url: string) {
  // GET 请求（会被记忆化）
  const getResponse = await fetch(url, { method: "GET" });

  // POST 请求（不会被记忆化，因为记忆化只适用于 GET）
  const postResponse = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ timestamp: Date.now() })
  });

  return {
    getData: await getResponse.json(),
    postData: await postResponse.json()
  };
}

// app/varied-requests/page.tsx
export default async function VariedRequestsPage() {
  // 使用不同的请求ID，避免记忆化
  const user1 = await fetchUserWithDifferentHeaders("123", "req-001");
  const user2 = await fetchUserWithDifferentHeaders("123", "req-002");

  // GET 会被记忆化，POST 不会
  const methodData = await fetchWithDifferentMethods("https://api.example.com/test");

  return (
    <div>
      <h1>不同请求选项</h1>
      <p>用户数据1: {JSON.stringify(user1)}</p>
      <p>用户数据2: {JSON.stringify(user2)}</p>
      <p>方法测试: {JSON.stringify(methodData)}</p>
    </div>
  );
}
```

##### 在客户端组件中退出记忆化

```tsx
// components/ClientFetch.tsx
"use client";

import { useState, useEffect } from "react";

export default function ClientFetch() {
  const [data, setData] = useState(null);
  const [requestCount, setRequestCount] = useState(0);

  // 客户端 fetch 不受服务端记忆化影响
  const fetchData = async () => {
    const response = await fetch("/api/current-time", {
      cache: "no-store" // 确保不使用浏览器缓存
    });
    const result = await response.json();
    setData(result);
    setRequestCount(prev => prev + 1);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4 border rounded">
      <h3>客户端数据获取</h3>
      <p>请求次数: {requestCount}</p>
      <p>当前时间: {data?.time}</p>
      <button onClick={fetchData} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        重新获取数据
      </button>
    </div>
  );
}
```

##### 条件性退出记忆化

```tsx
// lib/conditional-memo.ts
export async function fetchUserConditionally(id: string, forceRefresh: boolean = false) {
  const url = "https://api.example.com/users/" + id;

  if (forceRefresh) {
    // 强制刷新时退出记忆化
    return fetch(url, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache"
      }
    }).then(res => res.json());
  } else {
    // 正常情况使用记忆化
    return fetch(url).then(res => res.json());
  }
}

// app/conditional/page.tsx
export default async function ConditionalPage({ searchParams }: { searchParams: { refresh?: string } }) {
  const forceRefresh = searchParams.refresh === "true";

  // 根据查询参数决定是否使用记忆化
  const user = await fetchUserConditionally("123", forceRefresh);

  return (
    <div>
      <h1>条件性记忆化</h1>
      <p>强制刷新: {forceRefresh ? "是" : "否"}</p>
      <p>用户数据: {JSON.stringify(user)}</p>
      <div className="mt-4 space-x-2">
        <a href="/conditional" className="px-4 py-2 bg-blue-500 text-white rounded">
          使用缓存
        </a>
        <a href="/conditional?refresh=true" className="px-4 py-2 bg-red-500 text-white rounded">
          强制刷新
        </a>
      </div>
    </div>
  );
}
```

##### 使用自定义缓存键避免记忆化冲突

```tsx
// lib/custom-cache-keys.ts
// 为不同的业务场景创建不同的请求
export async function fetchUserForProfile(id: string) {
  const response = await fetch(`https://api.example.com/users/${id}`, {
    headers: {
      "X-Context": "profile" // 上下文标识
    }
  });
  return response.json();
}

export async function fetchUserForAdmin(id: string) {
  const response = await fetch(`https://api.example.com/users/${id}`, {
    headers: {
      "X-Context": "admin" // 不同的上下文
    }
  });
  return response.json();
}

// 使用环境变量或配置来区分请求
export async function fetchWithEnvironment(endpoint: string) {
  const response = await fetch(endpoint, {
    headers: {
      "X-Environment": process.env.NODE_ENV,
      "X-Build-ID": process.env.BUILD_ID || "unknown"
    }
  });
  return response.json();
}
```

##### 记忆化调试和监控

```tsx
// lib/memo-debug.ts
export function createTrackedFetch(name: string) {
  const requestLog = new Map<string, number>();

  return async function trackedFetch(url: string, options?: RequestInit) {
    const key = `${url}-${JSON.stringify(options)}`;
    const count = requestLog.get(key) || 0;
    requestLog.set(key, count + 1);

    console.log(`[${name}] Request #${count + 1} to: ${url}`);

    if (count > 0) {
      console.log(`[${name}] This request was memoized!`);
    }

    const response = await fetch(url, options);

    console.log(`[${name}] Response received for: ${url}`);

    return response;
  };
}

// 使用示例
const debugFetch = createTrackedFetch("UserService");

export async function fetchUserWithTracking(id: string) {
  const response = await debugFetch(`https://api.example.com/users/${id}`);
  return response.json();
}
```

##### 最佳实践总结

```tsx
// lib/memo-best-practices.ts
export const MemoizationBestPractices = {
  // 1. 明确什么时候需要退出记忆化
  scenarios: {
    realTimeData: "stock prices, live chat, current time",
    userSpecificData: "personalized content that changes frequently",
    debugging: "when testing or debugging cache behavior",
    dataValidation: "when verifying data consistency"
  },

  // 2. 选择合适的退出方法
  methods: {
    noStore: 'cache: "no-store" - 完全禁用缓存',
    uniqueUrl: "Add timestamp/random - URL 唯一化",
    differentHeaders: "Different headers - 改变请求头",
    postRequest: "POST method - 使用非 GET 方法"
  },

  // 3. 性能考虑
  performanceNotes: [
    "退出记忆化会增加网络请求数量",
    "谨慎在性能敏感的路径中使用",
    "考虑使用客户端状态管理作为替代",
    "监控网络请求的数量和频率"
  ],

  // 4. 调试技巧
  debugTips: [
    "使用 console.log 追踪请求次数",
    "检查 Network 面板确认请求行为",
    "使用请求ID或时间戳标识不同请求",
    "在开发环境启用详细日志"
  ]
};
```

通过这些方法，您可以根据具体需求灵活地控制请求记忆化的行为。选择合适的方法取决于您的具体用例：

- **实时数据**：使用 `cache: 'no-store'`
- **调试测试**：使用时间戳或随机参数
- **不同上下文**：使用不同的请求头
- **条件性控制**：根据参数动态决定是否使用记忆化

记住，退出记忆化会增加网络请求的数量，因此要谨慎使用，确保在真正需要最新数据的场景中才禁用记忆化。

### 3. 数据缓存（Data Cache）

数据缓存是 Next.js 的持久化缓存层，用于缓存数据获取的结果。

#### 使用 fetch 的数据缓存

```tsx
// app/products/page.tsx
async function getProducts() {
  // 默认情况下，fetch 请求会被缓存
  const response = await fetch("https://api.example.com/products", {
    next: {
      revalidate: 3600, // 1小时后重新验证
      tags: ["products"] // 缓存标签
    }
  });

  return response.json();
}

async function getFeaturedProducts() {
  // 永久缓存（直到手动重新验证）
  const response = await fetch("https://api.example.com/products/featured", {
    next: { tags: ["products", "featured"] }
  });

  return response.json();
}

async function getFlashSale() {
  // 不缓存实时数据
  const response = await fetch("https://api.example.com/flash-sale", {
    cache: "no-store"
  });

  return response.json();
}

export default async function ProductsPage() {
  const [products, featuredProducts, flashSale] = await Promise.all([
    getProducts(),
    getFeaturedProducts(),
    getFlashSale()
  ]);

  return (
    <div>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">限时抢购</h2>
        <FlashSaleComponent data={flashSale} />
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">精选产品</h2>
        <ProductGrid products={featuredProducts} />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">全部产品</h2>
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
```

#### 使用 unstable_cache 进行更精细的控制

```tsx
// lib/cache.ts
import { unstable_cache } from "next/cache";

// 缓存数据库查询
export const getCachedUser = unstable_cache(
  async (id: string) => {
    const user = await db.user.findUnique({
      where: { id },
      include: {
        profile: true,
        posts: {
          take: 5,
          orderBy: { createdAt: "desc" }
        }
      }
    });
    return user;
  },
  ["user"], // 缓存键前缀
  {
    revalidate: 300, // 5分钟
    tags: ["user-data"]
  }
);

// 缓存复杂计算
export const getCachedAnalytics = unstable_cache(
  async (userId: string, startDate: Date, endDate: Date) => {
    // 模拟复杂的分析计算
    const analytics = await performComplexAnalytics(userId, startDate, endDate);

    return {
      ...analytics,
      generatedAt: new Date(),
      cacheKey: `${userId}-${startDate.toISOString()}-${endDate.toISOString()}`
    };
  },
  ["analytics"],
  {
    revalidate: 1800, // 30分钟
    tags: ["analytics", "user-analytics"]
  }
);

// 条件缓存
export const getCachedContent = unstable_cache(
  async (slug: string, preview = false) => {
    if (preview) {
      // 预览模式不使用缓存
      return await getContentFromCMS(slug, true);
    }

    return await getContentFromCMS(slug, false);
  },
  ["content"],
  {
    revalidate: preview => (preview ? 0 : 3600), // 预览模式不缓存
    tags: ["cms-content"]
  }
);
```

### 4. 完整路由缓存（Full Route Cache）

完整路由缓存用于缓存整个路由的渲染结果。

#### 静态路由缓存

```tsx
// app/about/page.tsx - 静态路由，构建时缓存
export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">关于我们</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">公司简介</h2>
        <p className="text-gray-700 leading-relaxed">我们是一家专注于创新技术的公司，致力于为客户提供最优质的服务...</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">我们的使命</h2>
        <p className="text-gray-700 leading-relaxed">通过技术创新，让世界变得更美好...</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">联系方式</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p>邮箱: contact@example.com</p>
          <p>电话: +86 123-4567-8900</p>
          <p>地址: 北京市朝阳区科技园区</p>
        </div>
      </section>
    </div>
  );
}

// 这个页面在构建时生成，并被永久缓存
```

#### 动态路由的静态生成

```tsx
// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";

interface BlogPostProps {
  params: { slug: string };
}

export default async function BlogPost({ params }: BlogPostProps) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-gray-600">
          <span>作者: {post.author}</span>
          <time>{new Date(post.publishedAt).toLocaleDateString()}</time>
        </div>
      </header>

      <div className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </article>
  );
}

// 生成静态参数
export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map(post => ({
    slug: post.slug
  }));
}

// 每24小时重新验证
export const revalidate = 86400;
```

#### 动态路由缓存控制

```tsx
// app/dashboard/page.tsx - 动态路由
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const stats = await getUserStats(user.id);

  return (
    <div>
      <h1>欢迎回来, {user.name}!</h1>
      <DashboardStats stats={stats} />
      <RecentActivity userId={user.id} />
    </div>
  );
}

// 强制动态渲染（不缓存）
export const dynamic = "force-dynamic";
```

### 5. 路由器缓存（Router Cache）

路由器缓存是客户端缓存，用于缓存路由段的结果。

#### 预取和缓存行为

```tsx
// components/Navigation.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navigation() {
  const router = useRouter();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          我的网站
        </Link>

        <div className="space-x-4">
          {/* 静态路由会被预取和缓存 */}
          <Link href="/about" className="hover:text-gray-300">
            关于我们
          </Link>

          {/* 动态路由默认预取但不缓存服务端组件 */}
          <Link href="/blog" className="hover:text-gray-300">
            博客
          </Link>

          {/* 禁用预取 */}
          <Link href="/admin" prefetch={false} className="hover:text-gray-300">
            管理后台
          </Link>

          {/* 程序化导航 */}
          <button onClick={() => router.push("/dashboard")} className="hover:text-gray-300">
            仪表板
          </button>
        </div>
      </div>
    </nav>
  );
}
```

#### 手动预取控制

```tsx
// components/ProductCard.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  // 鼠标悬停时预取
  const handleMouseEnter = () => {
    setIsHovered(true);
    router.prefetch(`/products/${product.id}`);
  };

  return (
    <div
      className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded mb-4" />

      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
      <p className="text-2xl font-bold text-green-600 mb-4">¥{product.price}</p>

      <Link
        href={`/products/${product.id}`}
        className={`block w-full bg-blue-500 text-white text-center py-2 rounded transition-colors ${
          isHovered ? "bg-blue-600" : ""
        }`}
      >
        查看详情
      </Link>
    </div>
  );
}
```

### 6. 缓存失效和清除

#### revalidateTag 使用缓存标签进行精确失效

```tsx
// app/api/products/route.ts
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();

    // 创建新产品
    const newProduct = await createProduct(productData);

    // 清除相关缓存
    revalidateTag("products");
    revalidateTag("featured-products");
    revalidateTag(`category-${newProduct.categoryId}`);

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json();

    // 更新产品
    const updatedProduct = await updateProduct(id, updateData);

    // 清除特定产品和相关缓存
    revalidateTag("products");
    revalidateTag(`product-${id}`);

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
```

#### revalidatePath 使用路径重新验证

```tsx
// app/api/cms/posts/route.ts
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const postData = await request.json();

    // 创建新文章
    const newPost = await createPost(postData);

    // 重新验证相关路径
    revalidatePath("/blog");
    revalidatePath("/");
    revalidatePath(`/blog/${newPost.slug}`);

    // 如果文章属于特定分类，也重新验证分类页面
    if (newPost.category) {
      revalidatePath(`/blog/category/${newPost.category}`);
    }

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("id");

    if (!postId) {
      return NextResponse.json({ error: "Post ID required" }, { status: 400 });
    }

    // 获取文章信息（用于清除特定缓存）
    const post = await getPost(postId);

    // 删除文章
    await deletePost(postId);

    // 清除相关缓存
    revalidatePath("/blog");
    revalidatePath("/");

    if (post) {
      revalidatePath(`/blog/${post.slug}`);
      if (post.category) {
        revalidatePath(`/blog/category/${post.category}`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
```

#### cookies.set 或者 cookies.delete 清除缓存

#### router.refresh 刷新当前页面

#### 路由器事件

通过编写其他的 Client Component 钩子（如 usePathname 和 useSearchParams），可以监听页面的更改。

- app/components/navigation.tsx

```tsx
"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [pathname, searchParams]);

  return null;
}
```

-app/layout.tsx

```tsx
import { Suspense } from "react";
import Navigation from "./components/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* fallback={<div>Loading...</div>} */}
        <Suspense fallback={null}>
          <Navigation />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
```

- 为什需要使用 Suspense 包裹 Navigation 组件？
  因为 useSearchParams() 会导致客户端渲染到最近的 Suspense 边界，导致页面闪烁。

```tsx
"use client";
import { useRouter } from "next/navigation";
export default function Page() {
  const router = useRouter();

  const goAbout = () => {
    router.push("/about");
    router.refresh();
  };

  return (
    <div>
      <h1>Page</h1>
      <button onClick={goAbout}>Refresh</button>
    </div>
  );
}
```

### 7. 缓存配置和优化

#### 全局缓存配置

```tsx
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // 启用部分预渲染
    ppr: true
  },

  // 缓存配置
  cacheHandler: require.resolve("./cache-handler.js"),
  cacheMaxMemorySize: 0, // 禁用默认内存缓存

  // 自定义缓存头
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=300, stale-while-revalidate=60"
          }
        ]
      },
      {
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
```

#### 自定义缓存处理器

```tsx
// cache-handler.js
const { CacheHandler } = require("@neshca/cache-handler");
const createRedisHandler = require("@neshca/cache-handler/redis-strings").default;
const createLruHandler = require("@neshca/cache-handler/local-lru").default;

CacheHandler.onCreation(async () => {
  let redisHandler;

  if (process.env.REDIS_URL) {
    redisHandler = await createRedisHandler({
      url: process.env.REDIS_URL,
      timeoutMs: 1000
    });
  }

  const lruHandler = createLruHandler({
    maxItems: 1000,
    maxItemSizeBytes: 1024 * 1024 * 500 // 500MB
  });

  return {
    handlers: [
      // 优先使用 Redis，回退到 LRU
      redisHandler,
      lruHandler
    ].filter(Boolean)
  };
});

module.exports = CacheHandler;
```

### 8. 缓存监控和调试

#### 缓存性能监控

```tsx
// lib/cache-monitor.ts
interface CacheMetrics {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
}

class CacheMonitor {
  private metrics: Map<string, CacheMetrics> = new Map();

  recordHit(key: string) {
    const metric = this.getOrCreateMetric(key);
    metric.hits++;
    this.updateHitRate(key);
  }

  recordMiss(key: string) {
    const metric = this.getOrCreateMetric(key);
    metric.misses++;
    this.updateHitRate(key);
  }

  recordSize(key: string, size: number) {
    const metric = this.getOrCreateMetric(key);
    metric.size = size;
  }

  private getOrCreateMetric(key: string): CacheMetrics {
    if (!this.metrics.has(key)) {
      this.metrics.set(key, {
        hits: 0,
        misses: 0,
        size: 0,
        hitRate: 0
      });
    }
    return this.metrics.get(key)!;
  }

  private updateHitRate(key: string) {
    const metric = this.metrics.get(key)!;
    const total = metric.hits + metric.misses;
    metric.hitRate = total > 0 ? metric.hits / total : 0;
  }

  getMetrics(): Map<string, CacheMetrics> {
    return new Map(this.metrics);
  }

  getReport(): string {
    const entries = Array.from(this.metrics.entries());

    let report = "Cache Performance Report\n";
    report += "========================\n\n";

    entries.forEach(([key, metrics]) => {
      report += `${key}:\n`;
      report += `  Hits: ${metrics.hits}\n`;
      report += `  Misses: ${metrics.misses}\n`;
      report += `  Hit Rate: ${(metrics.hitRate * 100).toFixed(2)}%\n`;
      report += `  Size: ${metrics.size} bytes\n\n`;
    });

    return report;
  }
}

export const cacheMonitor = new CacheMonitor();
```

#### 缓存调试工具

```tsx
// lib/cache-debug.ts
export class CacheDebugger {
  private static isEnabled = process.env.NODE_ENV === "development";

  static log(operation: string, key: string, data?: any) {
    if (!this.isEnabled) return;

    console.group(`🔄 Cache ${operation}`);
    console.log(`Key: ${key}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);

    if (data) {
      console.log("Data:", data);
    }

    console.groupEnd();
  }

  static logHit(key: string) {
    this.log("HIT", key);
  }

  static logMiss(key: string) {
    this.log("MISS", key);
  }

  static logSet(key: string, data: any) {
    this.log("SET", key, { size: JSON.stringify(data).length });
  }

  static logInvalidate(key: string) {
    this.log("INVALIDATE", key);
  }

  static async measureCachePerformance<T>(operation: string, fn: () => Promise<T>): Promise<T> {
    if (!this.isEnabled) return fn();

    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;

    console.log(`⏱️ Cache ${operation} took ${duration.toFixed(2)}ms`);

    return result;
  }
}
```

### 9. 最佳实践总结

#### 缓存策略选择指南

```tsx
// 缓存策略决策树
export const CacheStrategy = {
  // 静态内容 - 长期缓存
  static: {
    revalidate: 86400, // 24小时
    tags: ["static-content"],
    example: "关于我们页面、条款和条件"
  },

  // 半静态内容 - 中期缓存
  semiStatic: {
    revalidate: 3600, // 1小时
    tags: ["semi-static"],
    example: "产品列表、博客文章"
  },

  // 动态内容 - 短期缓存
  dynamic: {
    revalidate: 300, // 5分钟
    tags: ["dynamic"],
    example: "用户生成内容、评论"
  },

  // 实时内容 - 不缓存
  realtime: {
    cache: "no-store",
    tags: [],
    example: "库存状态、实时聊天"
  },

  // 用户特定 - 按用户缓存
  userSpecific: {
    revalidate: 600, // 10分钟
    tags: ["user-data"],
    example: "用户仪表板、个人设置"
  }
};
```

#### 缓存最佳实践

```tsx
// lib/cache-best-practices.ts
export const CacheBestPractices = {
  // 1. 使用有意义的缓存键
  generateCacheKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join("|");

    return `${prefix}:${sortedParams}`;
  },

  // 2. 实现缓存降级策略
  async withFallback<T>(cacheOperation: () => Promise<T>, fallbackOperation: () => Promise<T>): Promise<T> {
    try {
      return await cacheOperation();
    } catch (error) {
      console.warn("Cache operation failed, using fallback:", error);
      return await fallbackOperation();
    }
  },

  // 3. 批量缓存操作
  async batchInvalidate(tags: string[]): Promise<void> {
    const promises = tags.map(tag =>
      // 模拟批量失效操作
      this.invalidateTag(tag)
    );

    await Promise.all(promises);
  },

  // 4. 缓存预热
  async warmupCache(keys: string[]): Promise<void> {
    const warmupPromises = keys.map(async key => {
      try {
        await this.preloadCacheKey(key);
      } catch (error) {
        console.warn(`Failed to warm up cache for key: ${key}`, error);
      }
    });

    await Promise.allSettled(warmupPromises);
  },

  // 模拟方法
  async invalidateTag(tag: string): Promise<void> {
    // 实际实现会调用 revalidateTag
  },

  async preloadCacheKey(key: string): Promise<void> {
    // 实际实现会预加载特定缓存键
  }
};
```

Next.js 的缓存系统是一个强大且复杂的性能优化工具。通过理解不同类型的缓存及其适用场景，我们可以：

1. **提高应用性能** - 减少不必要的计算和网络请求
2. **改善用户体验** - 更快的页面加载和导航
3. **降低服务器负载** - 减少对后端服务的压力
4. **优化成本** - 减少计算资源和带宽使用

关键是要根据数据的特性和业务需求选择合适的缓存策略，并建立有效的缓存失效机制来保证数据的准确性。

## 六、Server Action 概述

Server Actions 是 Next.js 13.4+ 引入的一项强大功能，它允许我们在服务器端直接处理表单提交和数据变更操作，无需创建单独的 API 路由。这是一种全新的处理服务器端逻辑的方式，极大地简化了全栈应用的开发流程。

### 1. 什么是 Server Actions？

Server Actions 是运行在服务器端的异步函数，可以在 Server Components 或 Client Components 中调用。它们为表单处理、数据变更和其他服务器端操作提供了一种类型安全、渐进增强的解决方案。

**核心特点：**

- **服务器端执行**：代码在服务器上运行，具有完整的服务器环境访问权限
- **类型安全**：完全支持 TypeScript，提供端到端的类型安全
- **渐进增强**：即使在 JavaScript 禁用的情况下也能正常工作
- **无需 API 路由**：直接在组件中定义和使用，简化了代码结构

### 2. 基本语法和使用

#### 2.1 定义 Server Action

```typescript
// 在文件顶部添加 'use server' 指令
"use server";

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  // 服务器端逻辑：数据库操作、验证等
  const post = await db.post.create({
    data: {
      title,
      content
    }
  });

  // 重新验证缓存
  revalidatePath("/posts");

  // 重定向到新页面
  redirect(`/posts/${post.id}`);
}
```

#### 2.2 在 Server Component 中使用

```typescript
// app/posts/create/page.tsx
import { createPost } from "./actions";

export default function CreatePostPage() {
  return (
    <form action={createPost}>
      <input type="text" name="title" placeholder="文章标题" required />
      <textarea name="content" placeholder="文章内容" required />
      <button type="submit">创建文章</button>
    </form>
  );
}
```

#### 2.3 在 Client Component 中使用

```typescript
"use client";

import { createPost } from "./actions";
import { useTransition } from "react";

export default function CreatePostForm() {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={formData => {
        startTransition(() => {
          createPost(formData);
        });
      }}
    >
      <input type="text" name="title" placeholder="文章标题" disabled={isPending} required />
      <textarea name="content" placeholder="文章内容" disabled={isPending} required />
      <button type="submit" disabled={isPending}>
        {isPending ? "创建中..." : "创建文章"}
      </button>
    </form>
  );
}
```

### 3. Server Actions 的优势

#### 3.1 简化的开发流程

```typescript
// 传统方式：需要创建 API 路由
// app/api/posts/route.ts
export async function POST(request: Request) {
  const formData = await request.formData();
  // 处理逻辑...
}

// 客户端代码
const handleSubmit = async (formData: FormData) => {
  const response = await fetch("/api/posts", {
    method: "POST",
    body: formData
  });
  // 处理响应...
};

// 使用 Server Actions：一步到位
("use server");
export async function createPost(formData: FormData) {
  // 直接处理逻辑，无需额外的 API 路由
}
```

#### 3.2 类型安全

```typescript
"use server";

interface CreatePostData {
  title: string;
  content: string;
  categoryId: number;
}

export async function createPost(data: CreatePostData) {
  // TypeScript 会在编译时检查类型
  const post = await db.post.create({
    data: {
      title: data.title, // ✅ 类型安全
      content: data.content, // ✅ 类型安全
      categoryId: data.categoryId // ✅ 类型安全
    }
  });

  return post;
}

// 客户端使用时也有类型提示
async function handleSubmit() {
  await createPost({
    title: "标题",
    content: "内容",
    categoryId: 1 // ✅ TypeScript 会验证类型
  });
}
```

#### 3.3 渐进增强

```typescript
// 即使禁用 JavaScript，表单仍然可以正常提交
export default function ContactForm() {
  return (
    <form action={submitContact}>
      <input type="email" name="email" required />
      <textarea name="message" required />
      {/* 即使没有 JavaScript，点击按钮仍会提交表单 */}
      <button type="submit">发送消息</button>
    </form>
  );
}

("use server");
async function submitContact(formData: FormData) {
  const email = formData.get("email");
  const message = formData.get("message");

  // 发送邮件逻辑
  await sendEmail({
    to: "contact@example.com",
    from: email,
    subject: "新的联系消息",
    text: message
  });

  // 重定向到感谢页面
  redirect("/thank-you");
}
```

### 4. 高级特性和模式

#### 4.1 表单验证

```typescript
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

const createPostSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(100, "标题不能超过100字符"),
  content: z.string().min(10, "内容至少需要10个字符"),
  categoryId: z.number().positive("请选择有效的分类")
});

export async function createPost(formData: FormData) {
  // 数据验证
  const validatedFields = createPostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    categoryId: Number(formData.get("categoryId"))
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "表单验证失败"
    };
  }

  try {
    // 创建文章
    const post = await db.post.create({
      data: validatedFields.data
    });

    revalidatePath("/posts");
    return { success: true, postId: post.id };
  } catch (error) {
    return {
      message: "创建文章失败，请重试"
    };
  }
}
```

#### 4.2 乐观更新

```typescript
"use client";

import { useOptimistic } from "react";
import { addTodo } from "./actions";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function TodoList({ todos }: { todos: Todo[] }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(todos, (state, newTodo: string) => [
    ...state,
    { id: Date.now().toString(), text: newTodo, completed: false }
  ]);

  return (
    <div>
      {optimisticTodos.map(todo => (
        <div key={todo.id}>{todo.text}</div>
      ))}

      <form
        action={async formData => {
          const text = formData.get("text") as string;

          // 乐观更新：立即显示新项目
          addOptimisticTodo(text);

          // 实际的服务器操作
          await addTodo(formData);
        }}
      >
        <input type="text" name="text" required />
        <button type="submit">添加</button>
      </form>
    </div>
  );
}
```

#### 4.3 文件上传

```typescript
"use server";

import { writeFile } from "fs/promises";
import { join } from "path";

export async function uploadFile(formData: FormData) {
  const file = formData.get("file") as File;

  if (!file) {
    throw new Error("没有选择文件");
  }

  // 验证文件类型和大小
  if (!file.type.startsWith("image/")) {
    throw new Error("只允许上传图片文件");
  }

  if (file.size > 5 * 1024 * 1024) {
    // 5MB
    throw new Error("文件大小不能超过 5MB");
  }

  // 保存文件
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${Date.now()}-${file.name}`;
  const path = join(process.cwd(), "public/uploads", filename);

  await writeFile(path, buffer);

  return {
    success: true,
    filename,
    url: `/uploads/${filename}`
  };
}

// 客户端组件
("use client");

export default function FileUploadForm() {
  const [uploading, setUploading] = useState(false);

  return (
    <form
      action={async formData => {
        setUploading(true);
        try {
          const result = await uploadFile(formData);
          console.log("上传成功:", result);
        } catch (error) {
          console.error("上传失败:", error);
        } finally {
          setUploading(false);
        }
      }}
    >
      <input type="file" name="file" accept="image/*" disabled={uploading} required />
      <button type="submit" disabled={uploading}>
        {uploading ? "上传中..." : "上传文件"}
      </button>
    </form>
  );
}
```

### 5. 错误处理和状态管理

#### 5.1 错误边界处理

```typescript
"use server";

export async function createUser(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;

    // 检查邮箱是否已存在
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return {
        error: "EMAIL_EXISTS",
        message: "该邮箱已被注册"
      };
    }

    // 创建用户
    const user = await db.user.create({
      data: { email, name }
    });

    revalidatePath("/users");
    return {
      success: true,
      user
    };
  } catch (error) {
    console.error("创建用户失败:", error);

    return {
      error: "INTERNAL_ERROR",
      message: "服务器内部错误，请稍后重试"
    };
  }
}

// 客户端使用
("use client");

export default function CreateUserForm() {
  const [result, setResult] = useState<any>(null);

  return (
    <div>
      {result?.error && <div className="error">{result.message}</div>}

      {result?.success && <div className="success">用户创建成功！</div>}

      <form
        action={async formData => {
          const result = await createUser(formData);
          setResult(result);
        }}
      >
        <input type="email" name="email" required />
        <input type="text" name="name" required />
        <button type="submit">创建用户</button>
      </form>
    </div>
  );
}
```

#### 5.2 使用 useFormState

```typescript
"use client";

import { useFormState } from "react-dom";
import { createPost } from "./actions";

const initialState = {
  message: null,
  errors: {}
};

export default function CreatePostForm() {
  const [state, formAction] = useFormState(createPost, initialState);

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="title">标题</label>
        <input id="title" name="title" type="text" placeholder="输入文章标题" />
        {state.errors?.title && (
          <div className="error">
            {state.errors.title.map((error: string) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="content">内容</label>
        <textarea id="content" name="content" placeholder="输入文章内容" />
        {state.errors?.content && (
          <div className="error">
            {state.errors.content.map((error: string) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>

      {state.message && <div className="message">{state.message}</div>}

      <button type="submit">创建文章</button>
    </form>
  );
}

// Server Action 需要返回状态
("use server");

export async function createPost(prevState: any, formData: FormData) {
  // 验证逻辑...

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "表单验证失败"
    };
  }

  // 创建逻辑...

  return {
    message: "文章创建成功！",
    errors: {}
  };
}
```

### 6. 性能优化和最佳实践

#### 6.1 缓存策略

```typescript
"use server";

import { unstable_cache } from "next/cache";

// 缓存数据库查询结果
const getCachedPosts = unstable_cache(
  async () => {
    return await db.post.findMany({
      orderBy: { createdAt: "desc" }
    });
  },
  ["posts-list"],
  {
    tags: ["posts"],
    revalidate: 3600 // 1小时后重新验证
  }
);

export async function getPosts() {
  return await getCachedPosts();
}

export async function createPost(formData: FormData) {
  // 创建文章逻辑...

  // 清除相关缓存
  revalidateTag("posts");
  revalidatePath("/posts");
}
```

#### 6.2 批量操作

```typescript
"use server";

export async function bulkDeletePosts(postIds: string[]) {
  try {
    // 使用事务确保数据一致性
    const result = await db.$transaction(async tx => {
      // 删除相关评论
      await tx.comment.deleteMany({
        where: {
          postId: { in: postIds }
        }
      });

      // 删除文章
      await tx.post.deleteMany({
        where: {
          id: { in: postIds }
        }
      });

      return { deletedCount: postIds.length };
    });

    // 重新验证缓存
    revalidateTag("posts");
    revalidatePath("/posts");

    return {
      success: true,
      message: `成功删除 ${result.deletedCount} 篇文章`
    };
  } catch (error) {
    console.error("批量删除失败:", error);
    return {
      success: false,
      message: "删除失败，请重试"
    };
  }
}
```

#### 6.3 防抖和节流

```typescript
"use client";

import { useDebouncedCallback } from "use-debounce";
import { searchPosts } from "./actions";

export default function SearchForm() {
  const [results, setResults] = useState([]);

  const debouncedSearch = useDebouncedCallback(
    async (searchTerm: string) => {
      if (searchTerm.length > 2) {
        const results = await searchPosts(searchTerm);
        setResults(results);
      }
    },
    300 // 300ms 防抖
  );

  return (
    <div>
      <input type="text" placeholder="搜索文章..." onChange={e => debouncedSearch(e.target.value)} />

      <div>
        {results.map(post => (
          <div key={post.id}>{post.title}</div>
        ))}
      </div>
    </div>
  );
}

("use server");

export async function searchPosts(query: string) {
  return await db.post.findMany({
    where: {
      OR: [{ title: { contains: query, mode: "insensitive" } }, { content: { contains: query, mode: "insensitive" } }]
    },
    take: 10
  });
}
```

### 7. 安全性考虑

#### 7.1 权限验证

```typescript
"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function deletePost(postId: string) {
  // 验证用户身份
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // 检查用户权限
  const post = await db.post.findUnique({
    where: { id: postId },
    select: { authorId: true }
  });

  if (!post) {
    throw new Error("文章不存在");
  }

  if (post.authorId !== session.user.id) {
    throw new Error("没有权限删除此文章");
  }

  // 执行删除
  await db.post.delete({
    where: { id: postId }
  });

  revalidatePath("/posts");
  redirect("/posts");
}
```

#### 7.2 输入验证和清理

```typescript
"use server";

import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";

const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "评论不能为空")
    .max(1000, "评论不能超过1000字符")
    .refine(content => content.trim().length > 0, "评论不能只包含空格"),
  postId: z.string().uuid("无效的文章ID")
});

export async function createComment(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("请先登录");
  }

  // 验证输入
  const validatedFields = createCommentSchema.safeParse({
    content: formData.get("content"),
    postId: formData.get("postId")
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors
    };
  }

  // 清理 HTML 内容
  const sanitizedContent = DOMPurify.sanitize(validatedFields.data.content);

  // 创建评论
  const comment = await db.comment.create({
    data: {
      content: sanitizedContent,
      postId: validatedFields.data.postId,
      authorId: session.user.id
    }
  });

  revalidatePath(`/posts/${validatedFields.data.postId}`);

  return {
    success: true,
    comment
  };
}
```

### 8. 测试策略

#### 8.1 单元测试

```typescript
// __tests__/actions.test.ts
import { createPost } from "@/app/actions";
import { prismaMock } from "@/lib/prisma-mock";

jest.mock("@/lib/prisma", () => ({
  db: prismaMock
}));

describe("createPost Server Action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("应该成功创建文章", async () => {
    const mockPost = {
      id: "1",
      title: "测试文章",
      content: "测试内容",
      createdAt: new Date()
    };

    prismaMock.post.create.mockResolvedValue(mockPost);

    const formData = new FormData();
    formData.append("title", "测试文章");
    formData.append("content", "测试内容");

    const result = await createPost(formData);

    expect(prismaMock.post.create).toHaveBeenCalledWith({
      data: {
        title: "测试文章",
        content: "测试内容"
      }
    });

    expect(result.success).toBe(true);
    expect(result.post).toEqual(mockPost);
  });

  it("应该处理验证错误", async () => {
    const formData = new FormData();
    formData.append("title", ""); // 空标题
    formData.append("content", "测试内容");

    const result = await createPost(formData);

    expect(result.errors).toBeDefined();
    expect(result.errors.title).toContain("标题不能为空");
  });
});
```

#### 8.2 集成测试

```typescript
// __tests__/integration/post-creation.test.ts
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreatePostForm from "@/components/CreatePostForm";

// Mock Server Action
jest.mock("@/app/actions", () => ({
  createPost: jest.fn()
}));

describe("文章创建集成测试", () => {
  it("应该处理完整的表单提交流程", async () => {
    const mockCreatePost = require("@/app/actions").createPost;
    mockCreatePost.mockResolvedValue({ success: true });

    render(<CreatePostForm />);

    // 填写表单
    fireEvent.change(screen.getByLabelText("标题"), {
      target: { value: "新文章标题" }
    });

    fireEvent.change(screen.getByLabelText("内容"), {
      target: { value: "新文章内容" }
    });

    // 提交表单
    fireEvent.click(screen.getByText("创建文章"));

    // 验证 Server Action 被调用
    await waitFor(() => {
      expect(mockCreatePost).toHaveBeenCalled();
    });

    // 验证成功消息
    expect(screen.getByText("文章创建成功！")).toBeInTheDocument();
  });
});
```

### 9. 调试和监控

#### 9.1 日志记录

```typescript
"use server";

import { logger } from "@/lib/logger";

export async function createPost(formData: FormData) {
  const startTime = Date.now();
  const title = formData.get("title") as string;

  try {
    logger.info("开始创建文章", { title });

    const post = await db.post.create({
      data: {
        title,
        content: formData.get("content") as string
      }
    });

    const duration = Date.now() - startTime;
    logger.info("文章创建成功", {
      postId: post.id,
      title,
      duration
    });

    return { success: true, post };
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error("文章创建失败", {
      title,
      duration,
      error: error.message,
      stack: error.stack
    });

    throw error;
  }
}
```

#### 9.2 性能监控

```typescript
"use server";

import { performance } from "perf_hooks";

export async function searchPosts(query: string) {
  const startTime = performance.now();

  try {
    const results = await db.post.findMany({
      where: {
        title: { contains: query, mode: "insensitive" }
      },
      take: 20
    });

    const endTime = performance.now();
    const duration = endTime - startTime;

    // 记录性能指标
    console.log(`搜索查询耗时: ${duration.toFixed(2)}ms`);

    if (duration > 1000) {
      console.warn(`慢查询警告: 搜索"${query}"耗时 ${duration.toFixed(2)}ms`);
    }

    return results;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;

    console.error(`搜索失败，耗时: ${duration.toFixed(2)}ms`, error);
    throw error;
  }
}
```

Server Actions 代表了 Next.js 全栈开发的一个重大进步，它简化了服务器端逻辑的处理，提供了更好的开发体验和用户体验。通过合理使用 Server Actions，我们可以构建更加高效、安全和易维护的现代 Web 应用。
