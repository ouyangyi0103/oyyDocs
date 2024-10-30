import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Awesome Project",
  description: "A VitePress Site",
  // 打包输出目录
  outDir: "docs",
  // 根路径
  base: "/oyyDocs/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // 右上角导航
    nav: [
      { text: "Home导航", link: "/" },
      { text: "Examples导航", link: "/markdown-examples" }
    ],
    // 全局搜索
    search: {
      provider: "local"
    },
    // 左侧导航
    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" }
        ]
      }
    ],
    // 右上角图标
    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" }
    ],
    // 底部页脚
    docFooter: {
      prev: "上一页",
      next: "下一页"
    },
    // 最后修改时间-必须配合git才有效，git提交时间，它就会被列为最后修改时间
    lastUpdated: {
      text: "最后修改时间",
      formatOptions: {
        dateStyle: "full",
        timeStyle: "short"
      }
    }
  }
});
