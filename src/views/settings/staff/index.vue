<template>
  <div class="staff-manage">
    <BasicTable :showIndexColumn="false" @register="registerTable" @change="handleTableChange">
      <template #form-customType="{ model, field }">
        <a-select
          ref="select"
          v-model:value="model[field]"
          allowClear
          placeholder="请选择"
          :options="typeData"
        />
      </template>

      <template #form-remoteSearch="{ model, field }">
        <a-select
          v-model:value="model[field]"
          label-in-value
          placeholder="请输入门店名称"
          style="width: 100%"
          :filter-option="false"
          allowClear
          show-search
          :fieldNames="{ label: 'shopName', value: 'id' }"
          :not-found-content="fetching ? undefined : null"
          :options="companyData"
          @search="handleSearch"
        >
          <template v-if="fetching" #notFoundContent>
            <a-spin size="small" />
          </template>
        </a-select>
      </template>

      <template #form-customMobile="{ model, field }">
        <a-input
          v-model:value="model[field]"
          placeholder="请输入手机号"
          maxlength="11"
          @keydown="checkNumberInput($event)"
        />
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'id'">
          <a-button type="link" @click="handleDetail(record)">{{ record.accountId }}</a-button>
        </template>
      </template>

      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '编辑',
              onClick: handleEdit.bind(null, record),
              ifShow: () => {
                return hasPermission(StaffManageEnum.Staff_EDIT);
              },
            },
            {
              label: '角色分配',
              onClick: handleRole.bind(null, record),
              ifShow: () => {
                return hasPermission(StaffManageEnum.Staff_ROLE) && !record.isSuperUser;
              },
            },
            {
              label: '数据权限',
              onClick: hanlePermission.bind(null, record),
              ifShow: () => {
                return hasPermission(StaffManageEnum.Staff_PERMISSION) && !record.isSuperUser;
              },
            },
            {
              label: '修改手机号',
              onClick: handleResetMobile.bind(null, record),
              ifShow: () => {
                return hasPermission(StaffManageEnum.Staff_RESETMOBILE) && !record.isSuperUser;
              },
            },
          ]"
        />
      </template>

      <template #tableTitle v-if="hasPermission(StaffManageEnum.Staff_ADD)">
        <a-button type="primary" @click="handleAdd">新增</a-button>
      </template>
    </BasicTable>

    <!-- 角色分配 -->
    <AssignmentRole @register="registerAssignmentRole" @on-refresh="getList" />

    <!-- 数据权限 -->
    <Permission @register="registerPermission" />

    <!-- 重置密码 -->
    <MobileReset @register="registerMobile" />
  </div>
</template>

<script lang="ts">
  import { onMounted, defineComponent, reactive, toRefs } from 'vue';
  import { useRouter } from 'vue-router';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';

  import { actionUserPage } from '/@/api/settings/staff';
  import { Select } from 'ant-design-vue';

  import { getTableColumns, getFormConfig, basicColumnsAction } from './data/table';
  import { useDebounceFn } from '@vueuse/core';

  import AssignmentRole from './components/assignment.vue';
  import Permission from './components/permission.vue';
  import MobileReset from './components/mobile.vue';

  import { checkNumberInput } from '/@/utils/input';
  import { actionQueryShopList } from '/@/api/settings/staff';
  import { StaffManageEnum } from '/@/assets/permission/settings';
  import { usePermission } from '/@/hooks/web/usePermission';

  export default defineComponent({
    components: {
      BasicTable,
      TableAction,
      [Select.name]: Select,
      [Select.Option.name]: Select.Option,
      AssignmentRole,
      Permission,
      MobileReset,
    },
    setup() {
      const state = reactive({
        typeData: [],
        statusData: [],
        listData: [],
        companyData: [],
        fetching: false,
      });

      const { push } = useRouter();
      const { hasPermission } = usePermission();

      const [
        registerTable,
        { getForm, setTableData, setLoading, getPaginationRef, setPagination },
      ] = useTable({
        dataSource: state.listData,
        useSearchForm: true,
        showIndexColumn: true,
        columns: getTableColumns(),
        actionColumn: basicColumnsAction,
        formConfig: {
          ...getFormConfig(),
          submitFunc: customSubmitFunc,
        },
      });

      const [registerAssignmentRole, { openModal: handleOpenAssignment }] = useModal();
      const [registerPermission, { openModal: handleOpenPermission }] = useModal();
      const [registerMobile, { openModal: handleModifyMobile }] = useModal();

      const handleSearch = (value: string) => {
        actionQueryShopList({
          shopName: value,
        }).then((res) => {
          state.companyData = res;
        });
      };

      async function getList() {
        try {
          // @ts-ignore
          const { current, pageSize } = getPaginationRef();
          const formVo = getForm().getFieldsValue();
          const paramsVo: any = {
            pageNum: current,
            pageSize,
            ...formVo,
          };

          if (formVo.shopName?.value) {
            paramsVo.shopId = formVo.shopName?.value || '';
          }
          delete paramsVo.shopName;

          setLoading(true);
          const { data, status } = await actionUserPage(paramsVo);
          if (status) {
            state.listData = data.list;

            setPagination({
              total: data.totalNum,
            });

            setTableData(state.listData as any);
          }
        } finally {
          setLoading(false);
        }
      }

      async function customSubmitFunc() {
        setPagination({
          current: 1,
          pageSize: 10,
        });

        getList();
      }

      // 表格改变事件
      async function handleTableChange() {
        getList();
      }

      // 新增
      const handleAdd = () => {
        push('/settings/staff/add');
      };

      // 编辑
      const handleEdit = (data: any) => {
        push({
          path: '/settings/staff/add',
          query: {
            pageType: 'edit',
            id: data.accountId,
          },
        });
      };

      // 详情
      const handleDetail = (data: any) => {
        push({
          path: '/settings/staff/detail',
          query: {
            id: data.accountId,
            pageType: 'detail',
          },
        });
      };

      // 角色分配
      const handleRole = (data: any) => {
        handleOpenAssignment(true, {
          id: data.accountId,
          rowData: data,
        });
      };

      // 修改手机号
      const handleResetMobile = (data: any) => {
        handleModifyMobile(true, {
          id: data.accountId,
          phone: data.phone,
        });
      };

      // 数据权限
      const hanlePermission = (data: any) => {
        handleOpenPermission(true, {
          id: data.accountId,
        });
      };

      onMounted(() => {
        getList();
      });

      return {
        ...toRefs(state),
        registerTable,
        registerAssignmentRole,
        registerPermission,
        registerMobile,
        getList,
        customSubmitFunc,
        handleTableChange,
        handleSearch: useDebounceFn(handleSearch, 300),
        checkNumberInput,

        handleAdd,
        handleEdit,
        handleDetail,
        handleRole,
        handleResetMobile,
        hanlePermission,

        handleOpenAssignment,
        handleOpenPermission,
        handleModifyMobile,

        hasPermission,
        StaffManageEnum,
      };
    },
  });
</script>

<style lang="less" scoped>
  .staff-manage {
    :deep(.ant-btn-link) {
      span {
        text-decoration: underline;
      }
    }
  }
</style>
