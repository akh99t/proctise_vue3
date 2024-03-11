import { createRouter, createWebHistory } from 'vue-router';

import batchProcess from '@/views/batchProcess/index.vue';
import configureChair from '@/views/configureChair/index.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: '批量处理文件',
      path: '/batchProcess',
      component: batchProcess,
    },
    {
      name: '配置图表',
      path: '/configureChair',
      component: configureChair,
    },
    {
      // 重定向
      path: '/',
      redirect: '/configureChair'
    }
  ]
})