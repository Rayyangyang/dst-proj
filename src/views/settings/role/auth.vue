<template>
  <div class="auth-role-manage">
    <BasicModal
      @register="register"
      :canFullscreen="false"
      :minHeight="100"
      title="操作权限"
      :loading="isLoading"
      @ok="handleSubmit"
      okText="确定"
      cancelText="取消"
    >
      <a-tree
        v-model:checkedKeys="checkedKeys"
        :field-names="fieldNames"
        checkable
        checkStrictly
        defaultExpandAll
        :tree-data="treeData"
        @check="handleCheck"
        v-if="treeData.length"
      />
    </BasicModal>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive, toRefs, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import type { TreeProps } from 'ant-design-vue';
  import { Tree } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { actionsGetRolePermissionAll, actionsRolePermissionSave } from '/@/api/settings/role';

  interface StateType {
    isLoading: boolean;
    roleId: number | string;
    treeData: any[];
  }

  export default defineComponent({
    name: 'AuthRoleManage',
    components: {
      BasicModal,
      [Tree.name]: Tree,
    },
    emits: ['on-refresh'],
    setup(props, { emit }) {
      const state: StateType = reactive({
        isLoading: false,
        roleId: '',
        treeData: [],
      });

      let checkedKeys = ref<any>();
      let checkedIdsArray = ref([]); // 获取选中的id
      let halfCheckedKeys = ref([]); // 半选中，相当于父级未全选中

      const { createMessage } = useMessage();
      const [register, { closeModal, changeOkLoading }] = useModalInner(async (roleData) => {
        changeOkLoading(false);
        state.roleId = roleData.id;
        state.isLoading = true;

        const { status, data } = await actionsGetRolePermissionAll(roleData.id);
        state.isLoading = false;
        if (status) {
          state.treeData = data;

          checkedIdsArray.value = [];

          getTreeChecked(state.treeData);

          checkedKeys.value = {
            checked: checkedIdsArray.value,
          };
        }
      });

      const fieldNames: TreeProps['fieldNames'] = {
        children: 'children',
        title: 'name',
        key: 'id',
      };

      // 确定事件 回调
      const handleSubmit = async () => {
        if (unref(checkedKeys).length === 0) {
          createMessage.warning('请选择权限');
          return;
        }

        changeOkLoading(true);
        try {
          const { status } = await actionsRolePermissionSave({
            roleId: state.roleId,
            permissionIds: unref(checkedKeys).checked,
          });

          if (status) {
            createMessage.success('操作成功');
            closeModal();
            emit('on-refresh');
          }
        } finally {
          changeOkLoading(false);
        }
      };

      // 递归调用根据checked 属性判断tree 节点是否勾中
      const getTreeChecked = (data: any) => {
        data.forEach((item: any) => {
          if (item.checked) {
            // @ts-ignore
            checkedIdsArray.value.push(item?.id);
          }

          if (item.children && item.children.length) {
            getTreeChecked(item.children);
          }
        });
      };

      // 点击复选框触发,回调。查找所有上级（后端要求，新增编辑，不仅要给勾选的，上级都要一起给）
      const handleCheck = (checkedKeys, e) => {
        halfCheckedKeys.value = e.halfCheckedKeys || [];
      };

      return {
        ...toRefs(state),
        register,
        closeModal,
        fieldNames,
        checkedKeys,
        halfCheckedKeys,
        checkedIdsArray,
        handleSubmit,
        getTreeChecked,
        handleCheck,
      };
    },
  });
</script>
