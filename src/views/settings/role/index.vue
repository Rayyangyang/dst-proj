<template>
  <div class="role-manage">
    <BasicTable @register="registerTable" @change="handleTableChange">
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '编辑',
              onClick: handleEdit.bind(null, record),
              ifShow: () => {
                return hasPermission(RoleManageEnum.ROLE_EDIT);
              },
            },
            {
              label: '删除',
              onClick: handleDelete.bind(null, record),
              ifShow: () => {
                return record.level !== 0 && hasPermission(RoleManageEnum.ROLE_DELETE);
              },
            },
            {
              label: '操作权限',
              onClick: handlePermission.bind(null, record),
              ifShow: () => {
                return record.level !== 0 && hasPermission(RoleManageEnum.ROLE_SAVEPERMISSION);
              },
            },
            {
              label: '添加下级角色',
              onClick: handleAdd.bind(null, record),
              ifShow: () => {
                return record.level < 5 && hasPermission(RoleManageEnum.ROLE_ADD);
              },
            },
          ]"
        />
      </template>
    </BasicTable>

    <AddRole @register="registerRoleModal" @on-refresh="getList" />
    <AuthRole @register="registerAuthModal" @on-refresh="getList" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, createVNode, onMounted } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';

  import { getBasicColumns, getFormConfig } from './data';
  import { Button, Modal } from 'ant-design-vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { actionsRolePage, actionsRoleDelete } from '/@/api/settings/role';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { RoleManageEnum } from '/@/assets/permission/settings';

  import AddRole from './add.vue';
  import AuthRole from './auth.vue';

  import { handleTreeData } from '/@/utils/table';

  export default defineComponent({
    components: { BasicTable, AddRole, AuthRole, TableAction, [Button.name]: Button },
    setup() {
      const modalType = ref<string>('');
      const listData = ref<Array<Recordable>>([]);
      const { createMessage } = useMessage();
      const { hasPermission } = usePermission();

      // 表单查询自定义事件
      const handleSearchSubmit = async () => {
        getList();
      };

      const [registerTable, { getForm, setLoading, expandAll }] = useTable({
        columns: getBasicColumns(),
        formConfig: {
          ...getFormConfig(),
          submitFunc: handleSearchSubmit,
        },
        dataSource: listData,
        isTreeTable: true,
        pagination: false,
        useSearchForm: true,
        showIndexColumn: false,
        rowKey: 'id',
        actionColumn: {
          width: 300,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      });

      const [registerRoleModal, { openModal: handleOpenRole }] = useModal();
      const [registerAuthModal, { openModal: handleOpenAuth }] = useModal();

      // 新增
      function handleAdd(data) {
        console.log('data', data);
        modalType.value = 'add';
        handleOpenRole(true, { ...data, type: 'add' });
      }

      // 编辑
      const handleEdit = (data: any) => {
        console.log('data', data);
        modalType.value = 'edit';
        handleOpenRole(true, { ...data, type: 'edit' });
      };

      // 删除
      const handleDelete = (data: any) => {
        console.log('data', data);
        Modal.confirm({
          title: '您确定要删除该角色吗?',
          icon: createVNode(ExclamationCircleOutlined),
          okText: '确定',
          cancelText: '取消',
          async onOk() {
            const { status } = await actionsRoleDelete(data.id);

            if (status) {
              createMessage.success('删除成功');
              getList();
            }
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      };

      // 权限分配
      const handlePermission = (data: any) => {
        console.log('data', data);
        handleOpenAuth(true, data);
      };

      // 表格改变事件
      const handleTableChange = async () => {
        getList();
      };

      // 获取列表数据
      const getList = async () => {
        try {
          setLoading(true);
          const { status, data } = await actionsRolePage(getForm().getFieldsValue());
          if (status) {
            listData.value = handleTreeData(data);
          }
        } finally {
          setLoading(false);
        }
      };

      onMounted(async () => {
        await getList();
        expandAll();
      });

      return {
        modalType,
        listData,
        registerTable,
        registerRoleModal,

        handleAdd,
        handleEdit,
        handleDelete,
        handlePermission,

        handleOpenRole,
        registerAuthModal,
        handleOpenAuth,
        handleTableChange,
        handleSearchSubmit,
        getList,
        hasPermission,
        RoleManageEnum,
      };
    },
  });
</script>
<style lang="less" scoped>
  :deep(.ant-table-thead) {
    tr th {
      &:first-child {
        .ant-table-selection {
          display: none;
        }
      }
    }
  }
</style>
