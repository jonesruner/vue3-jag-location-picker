import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Vue3 Jag Location Picker',
  description: 'A Vue 3 location picker component supporting both Google Maps and AMap (高德地图)',
  
  // 确保输出到正确的目录
  outDir: '.vitepress/dist',
  
  // GitHub Pages 配置 - 仓库名为 vue3-jag-location-picker
  base: '/vue3-jag-location-picker/',
  
  themeConfig: {
    siteTitle: false,
    
    nav: [
      { text: '首页', link: '/' }
    ],
    
    sidebar: {},
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourusername/vue3-jag-location-picker' }
    ],
    
    footer: {
      message: '基于 MIT 许可证发布',
      copyright: 'Copyright © 2024-present'
    },
    
    search: {
      provider: 'local'
    },
    
    outline: {
      level: [2, 3],
      label: '目录'
    }
  },
  
  vite: {
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  },
  
  locales: {
    root: {
      label: '中文',
      lang: 'zh-CN'
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' }
        ],
        sidebar: {},
        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Copyright © 2024-present'
        },
        outline: {
          level: [2, 3],
          label: 'Table of Contents'
        }
      }
    }
  },
  
  lang: 'zh-CN'
}) 