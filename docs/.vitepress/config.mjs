import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "HR-Manager",
  description: "A VitePress Site",
  server: {
    port: 5173,
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Главная', link: '/' },
      { text: 'Обзор', link: '/overview' }
    ],

    sidebar: [
      {
        text: 'Обзор',
        items: [
          { text: 'Начало работы', link: '/getting-started' },
          { text: 'Описание проекта', link: '/overview' },
          { text: 'Функционал проекта', link: '/project-functionality' },
        ]
      }
    ],
  }
})
