<template>
  <div class="add-role-manage">
    <BasicModal
      @register="register"
      :title="modalTitle"
      :canFullscreen="false"
      :minHeight="100"
      @ok="handleConfirm"
      okText="提交"
      cancelText="取消"
    >
      <a-form
        :model="formState"
        name="basic"
        ref="formRef"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        :rules="rules"
        autocomplete="off"
      >
        <a-form-item label="角色名称" name="name">
          <a-input
            v-model:value="formState.name"
            placeholder="请输入角色名称"
            allowClear
            :maxlength="50"
          />
        </a-form-item>

        <a-form-item label="角色描述">
          <a-textarea
            v-model:value="formState.remarks"
            placeholder="请输入描述(50字以内)"
            allowClear
            auto-size
            :maxlength="50"
          />
        </a-form-item>
      </a-form>
    </BasicModal>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, reactive, unref, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Form, Input } from 'ant-design-vue';
  import type { FormInstance } from 'ant-design-vue';
  import type { Rule } from 'ant-design-vue/es/form';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { actionsRoleAddOrEdit } from '/@/api/settings/role';

  interface FormState {
    name: string;
    remarks: string;
    id?: string | number;
    pid?: string | number;
  }

  export default defineComponent({
    name: 'AddRoleManage',
    components: {
      BasicModal,
      [Form.name]: Form,
      [Form.Item.name]: Form.Item,
      [Input.name]: Input,
      [Input.TextArea.name]: Input.TextArea,
    },
    emits: ['on-refresh'],
    setup(props, { emit }) {
      const isPageAdd = ref<boolean>(true);

      const { createMessage } = useMessage();

      const [register, { setModalProps, closeModal, changeOkLoading }] = useModalInner(
        async (data) => {
          console.log('data', data);
          isPageAdd.value = data.type === 'add'; // 判断页面类型
          (unref(formRef) as any)?.resetFields();
          formState.name = '';
          formState.remarks = '';

          const { name, remarks, id } = data;

          if (!unref(isPageAdd)) {
            formState.name = name || '';
            formState.remarks = remarks || '';
          }

          formState.id = id || '';

          setModalProps({ confirmLoading: false });
        },
      );
      const formRef = ref<FormInstance>();
      const modalTitle = computed(() => (unref(isPageAdd) ? '新增角色' : '编辑角色'));

      const rules: Record<string, Rule[]> = {
        name: [{ required: true, whitespace: true, message: '请输入角色名称' }],
      };

      let formState = reactive<FormState>({
        name: '',
        remarks: '',
        id: '',
      });

      // 表单校验
      const handleValidateForm = (): Boolean => {
        (unref(formRef) as any).validate();

        if (!formState.name.replace(/^\s*|\s*$/g, '')) {
          return false;
        }

        return true;
      };

      // 弹框确认
      const handleConfirm = async () => {
        if (!handleValidateForm()) {
          return;
        }
        changeOkLoading(true);

        try {
          let dataVo = { ...formState };

          // 新增无 id，编辑无 pid
          if (unref(isPageAdd)) {
            dataVo.pid = Number(dataVo.id);
            delete dataVo.id;
          } else {
            dataVo.id = Number(dataVo.id);
          }

          await actionsRoleAddOrEdit(dataVo, unref(isPageAdd) ? 'add' : 'edit');

          let message = '';
          if (unref(isPageAdd)) {
            message = '新增成功';
          } else {
            message = '修改成功';
          }

          createMessage.success(message);
          emit('on-refresh');
          closeModal();
        } finally {
          changeOkLoading(false);
        }
      };

      return {
        formRef,
        formState,
        rules,
        register,
        closeModal,
        modalTitle,
        isPageAdd,
        handleValidateForm,
        handleConfirm,
      };
    },
  });
</script>
