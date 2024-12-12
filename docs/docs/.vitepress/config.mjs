import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "HR-Manager",
  description: "A VitePress Site",
  themeConfig: {
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
