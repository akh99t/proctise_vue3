import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

// 样式初始化
import 'normalize.css/normalize.css'
import './assets/index.less'
// 引入elementUI
import * as ElementUI from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 引入路由
import router from './router/index';
//  引入lodash工具包
// import lodash from 'lodash'
// 全局挂载lodash
// app.provide('_', lodash)

// Vue.js 状态管理库-pinia
import { createPinia } from 'pinia'
const pinia = createPinia()

let appUseFun = (list:any[] = []) => {
  list.forEach(item => {
    app.use(item)
  });
  app.mount('#app')
}
appUseFun([ElementUI, router, pinia])
