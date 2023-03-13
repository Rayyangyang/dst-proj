<template>
  <div class="permission-manage">
    <BasicModal
      title="数据权限"
      okText="确定"
      :minHeight="50"
      :canFullscreen="false"
      @register="register"
      @ok="hanleConfirm"
    >
      <template v-if="loading">
        <div class="empty-tips">加载中……</div>
      </template>
      <template v-if="!loading">
        <a-tree
          v-model:checkedKeys="checkedKeys"
          v-model:expandedKeys="expandedKeys"
          :field-names="fieldNames"
          checkable
          checkStrictly
          :tree-data="permissionData"
        />
      </template>
    </BasicModal>
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive, toRefs, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { actionGetPermissionCity, actionSaveUserDataPermission } from '/@/api/settings/staff';
  import type { TreeProps } from 'ant-design-vue';
  import { Tree } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';

  interface State {
    checkedKeys: any;
    permissionData: any;
    expandedKeys: any;
    userId: string | number;
    loading: boolean;
  }

  export default defineComponent({
    name: 'StaffPermission',
    components: {
      BasicModal,
      [Tree.name]: Tree,
    },
    setup() {
      let checkedIdsArray = ref([]); // 获取选中的id
      const state = reactive<State>({
        checkedKeys: [],
        expandedKeys: [],
        permissionData: [],
        userId: '',
        loading: false,
      });

      const fieldNames: TreeProps['fieldNames'] = {
        children: 'shopList',
        title: 'shopName',
        key: 'id',
      };

      const { createMessage } = useMessage();
      const [register, { closeModal, setModalProps }] = useModalInner(async (data) => {
        InitData();
        state.loading = true;
        setModalProps({ loading: true, confirmLoading: true });

        state.userId = data.id;
        await getPermissionData();

        state.loading = false;
        setModalProps({ loading: false, confirmLoading: false });
      });

      // 获取对应角色权限

      const getPermissionData = async () => {
        const { status, data } = await actionGetPermissionCity({
          userId: state.userId,
        });

        if (status) {
          // 由于后端不愿给一样的字段，导致树形结构数据无法正常展示，所以需要拼接参数
          data.forEach((item) => {
            if (item.hasOwnProperty('cityCode')) {
              item.id = item?.cityCode + ' city';
              item.shopName = item?.cityName;
              item.checkable = false;
            }
          });
          state.permissionData = data;

          checkedIdsArray.value = [];

          getTreeChecked(state.permissionData);

          state.checkedKeys = {
            checked: checkedIdsArray.value,
          };

          console.log('permissionData', state.permissionData);
        }
      };

      // 递归调用根据checked 属性判断tree 节点是否勾中
      const getTreeChecked = (data: any) => {
        data.forEach((item: any) => {
          if (item.checked) {
            // @ts-ignore
            checkedIdsArray.value.push(item?.id);
          }

          if (item.shopList && item.shopList.length) {
            getTreeChecked(item.shopList);
          }
        });
      };

      const hanleConfirm = async () => {
        // 过滤之前拼装的带有城市id
        let filterId = state.checkedKeys.checked.filter((item) => item.indexOf('city') < 0);

        const { status } = await actionSaveUserDataPermission({
          accountId: state.userId,
          shopId: filterId,
        });

        if (status) {
          createMessage.success('操作成功');
          closeModal();
        }
      };

      const InitData = () => {
        state.checkedKeys = [];
        state.expandedKeys = [];
        state.permissionData = [];
        state.userId = '';
      };

      return {
        ...toRefs(state),
        checkedIdsArray,
        fieldNames,
        register,
        InitData,
        closeModal,
        hanleConfirm,
        getTreeChecked,
      };
    },
  });
</script>
