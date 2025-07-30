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
