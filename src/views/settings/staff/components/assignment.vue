<template>
  <div class="assignment-role-manage">
    <BasicModal
      title="角色分配"
      okText="提交"
      :minHeight="50"
      :canFullscreen="false"
      @register="register"
      @ok="hanleConfirm"
    >
      <a-form
        ref="formRef"
        :model="formState"
        name="basic"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        :rules="formRules"
      >
        <a-form-item label="角色名称" name="treeId">
          <a-tree-select
            v-model:value="formState.treeId"
            placeholder="请选择"
            :field-names="{ children: 'children', label: 'name', value: 'id' }"
            :show-checked-strategy="SHOW_ALL"
            multiple
            allow-clear
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeData"
          >
            <template #tagRender="{ label, value, closable, onClose, option }">
              <div v-if="value">
                <template v-if="!currentRoleAllIds.includes(value)">
                  <a-tag color="default" style="margin-right: 3px" disabled>
                    {{ translateRole(value) }}
                  </a-tag>
                </template>
                <template v-else>
                  <a-tag
                    color="default"
                    style="margin-right: 3px"
                    :closable="closable"
                    @close="onClose"
                  >
                    {{ label || option.name }}
                  </a-tag>
                </template>
              </div>
            </template>
          </a-tree-select>
          <div class="tip">只允许删除当前用户的下级或者同级角色</div>
        </a-form-item>
      </a-form>
    </BasicModal>
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, toRefs } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Form, TreeSelect, Tag } from 'ant-design-vue';
  import type { Rule } from 'ant-design-vue/es/form';
  import type { FormInstance } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { actionQueryUserRoleTree, actionSaveUserRolee } from '/@/api/settings/staff';

  interface State {
    formState: {
      treeId: any;
      userId: string | number;
    };
    treeData: any[];
    currentRoleAllIds: any[];
    currentRoleIds: any[];
    currentRoleList: any[];
  }

  export default defineComponent({
    name: 'StaffAssignmentRole',
    components: {
      [Form.name]: Form,
      [Form.Item.name]: Form.Item,
      [TreeSelect.name]: TreeSelect,
      [Tag.name]: Tag,
      BasicModal,
    },
    emits: ['on-refresh'],
    setup(props, { emit }) {
      let checkedIdsArray = ref<any[]>([]); // 获取选中的id

      const formRef = ref<FormInstance>();
      const SHOW_ALL = TreeSelect.SHOW_ALL;
      const state: State = reactive({
        formState: {
          treeId: [],
          userId: '',
        },
        treeData: [],
        currentRoleAllIds: [], // 当前角色及以下的角色id
        currentRoleIds: [], // 当前角色id
        currentRoleList: [],
      });

      const { createMessage } = useMessage();
      const [register, { closeModal }] = useModalInner(async (data) => {
        console.log(data.id, data.rowData);
        (formRef.value as any).resetFields();
        state.formState.userId = data.id;
        state.currentRoleIds = data?.rowData?.roleId ? data?.rowData?.roleId.split(',') : [];
        state.currentRoleList = data?.rowData?.roleList || [];

        await getRoleTree();

        checkedIdsArray.value = [];
        state.currentRoleAllIds = [];
        getTreeChecked(state.treeData);

        state.formState.treeId = Array.from(
          new Set(checkedIdsArray.value.concat(state.currentRoleIds)),
        );
      });

      const formRules: Record<string, Rule[]> = {
        treeId: [{ required: true, message: '请选择角色名称', trigger: 'change' }],
      };

      // 提交数据
      const hanleConfirm = async () => {
        if (state.formState.treeId && state.formState.treeId.length > 0) {
          const { status } = await actionSaveUserRolee({
            roleId: state.formState.treeId,
            accountId: state.formState.userId,
          });
          if (status) {
            createMessage.success('操作成功');
            closeModal();
            emit('on-refresh');
          }
        } else {
          createMessage.warning('请选择角色');
          (formRef.value as any).validate();
        }
      };

      // 递归调用根据checked 属性判断tree 节点是否勾中
      const getTreeChecked = (data: any) => {
        data.forEach((item: any) => {
          if (item.checked) {
            // @ts-ignore
            checkedIdsArray.value.push(item?.id);
          }

          // 当前角色同级及一下
          state.currentRoleAllIds.push(item?.id);

          if (item.children && item.children.length) {
            getTreeChecked(item.children);
          }
        });
      };

      const getRoleTree = async () => {
        console.log('state.formState.userId', state.formState.userId);
        const { status, data } = await actionQueryUserRoleTree(state.formState.userId);

        if (status) {
          state.treeData = data;
        }
      };

      // 翻译角色
      const translateRole = (type: string | number) => {
        if (type) {
          let findItem = state.currentRoleList.filter((item) => item.roleId == type) || [];
          console.log('findItem', findItem, state.currentRoleList, type);
          return findItem.length > 0 ? findItem[0].roleName : '';
        } else {
          return '';
        }
      };

      return {
        formRef,
        ...toRefs(state),
        checkedIdsArray,
        formRules,
        register,
        closeModal,
        hanleConfirm,
        getRoleTree,
        SHOW_ALL,

        translateRole,
      };
    },
  });
</script>

<style lang="less" scoped>
  .tip {
    font-size: 12px;
    color: #b5b5b5;
    margin-top: 0.4rem;
  }
</style>
