import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const Dashboard: AppRouteModule = {
  path: '/dashboard',
  name: 'Dashboard',
  component: LAYOUT,
  redirect: '/dashboard/index',
  meta: {
    hideChildrenInMenu: true,
    title: '首页',
    orderNo: 100,
    hideMenu: true,
    permissionValue: '*',
  },
  children: [
    {
      path: 'index',
      name: 'DashboardPage',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: '首页',
        hideMenu: true,
        hideTab: true,
        permissionValue: '*',
      },
    },
  ],
};

export default Dashboard;
