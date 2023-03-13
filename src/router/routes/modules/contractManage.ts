import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const ContractManage: AppRouteModule = {
  path: '/contractManage',
  name: 'ContractManage',
  component: LAYOUT,
  meta: {
    title: '合同管理',
    orderNo: 500,
    permissionValue: 'ooc:contract',
  },
  children: [
    {
      path: 'projectContract',
      name: 'ProjectContract',
      component: () => import('../../../views/contractManage/projectContract/ProjectContract.vue'),
      meta: {
        title: '项目合同',
        hideChildrenInMenu: true,
        permissionValue: 'ooc:contract:project',
      },
      children: [
        {
          path: 'addNewContract',
          name: 'AddNewContract',
          component: () =>
            import('/@/views/contractManage/projectContract/addNewContract/Index.vue'),
          meta: {
            title: '新建合同',
            hideMenu: true,
          },
        },
        {
          path: 'editNewContract',
          name: 'EditNewContract',
          component: () =>
            import('/@/views/contractManage/projectContract/addNewContract/Index.vue'),
          meta: {
            title: '编辑合同',
            hideMenu: true,
          },
        },
        {
          path: 'renewalContract',
          name: 'RenewalContract',
          component: () =>
            import('/@/views/contractManage/projectContract/addNewContract/Index.vue'),
          meta: {
            title: '续签合同',
            hideMenu: true,
          },
        },
        {
          path: 'contractInfo',
          name: 'ContractInfo',
          component: () => import('/@/views/contractManage/projectContract/contractInfo/index.vue'),
          meta: {
            title: '合同详情',
            hideMenu: true,
          },
        },
      ],
    },
    {
      path: 'lineManagement',
      name: 'LineManagement',
      component: () => import('../../../views/contractManage/lineManagement/LineManagement.vue'),
      meta: {
        title: '线路管理',
        hideChildrenInMenu: true,
        permissionValue: 'ooc:contract:route',
      },
      children: [
        {
          path: 'addNewLine',
          name: 'AddNewLine',
          component: () => import('../../../views/contractManage/lineManagement/AddNewLine.vue'),
          meta: {
            title: '新增线路',
            hideMenu: true,
          },
        },
      ],
    },
  ],
};

export default ContractManage;
