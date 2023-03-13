<template>
  <div class="modify-password" v-if="getShow">
    <MyFrom
      class="p-4 enter-x form-body"
      :model="formData"
      :rules="getFormRules"
      :label-col="labelCol"
      key="modify-password"
      ref="formRef"
    >
      <FormItem label="原密码" name="oldPassword" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.oldPassword"
          :maxlength="20"
          placeholder="请输入原密码"
        />
      </FormItem>

      <FormItem label="新密码" name="newPassword" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.newPassword"
          :maxlength="20"
          placeholder="请输入新密码"
        />
      </FormItem>

      <FormItem label="确认密码" name="confirmPassword" class="enter-x">
        <Input
          size="large"
          :maxlength="20"
          v-model:value="formData.confirmPassword"
          placeholder="请输入确认新密码"
        />
      </FormItem>

      <FormItem label="备注" class="enter-x">
        <div>6~20位数字+字母组合密码</div>
      </FormItem>
    </MyFrom>

    <FormItem class="enter-x">
      <footer>
        <Button size="large" class="btn-cancel" @click="handleCancel">取消 </Button>

        <Button
          type="primary"
          size="large"
          :loading="isLoading"
          class="ml-4 btn-confirm"
          @click="handleConfirm"
        >
          确认
        </Button>
      </footer>
    </FormItem>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref, computed, unref } from 'vue';
  import { Form, Input, Button } from 'ant-design-vue';
  import { useFormRules, ModifyStateEnum, useFormValid, useModifyState } from '../config/useModify';
  import { actionUpdatePwdByOldPwd } from '/@/api/sys/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { setEncrypt } from '/@/utils/jsencrypt';

  const formRef = ref(null);
  const FormItem = Form.Item;
  const MyFrom = Form;
  const formData = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const labelCol = { style: { width: '80px' } };
  const emit = defineEmits(['close']);

  let isLoading = false;

  const { getModifyState } = useModifyState();
  const { getFormRules } = useFormRules(formData);
  const { validForm } = useFormValid(formRef);
  const { createMessage } = useMessage();
  const userStore = useUserStore();

  const getShow = computed(() => unref(getModifyState) === ModifyStateEnum.PASSWORD);

  async function handleConfirm() {
    const data = await validForm();
    if (!data) return;

    isLoading = true;

    try {
      const { status } = await actionUpdatePwdByOldPwd({
        oldPassword: setEncrypt(formData.oldPassword),
        newPassword: setEncrypt(formData.newPassword),
      });

      if (status) {
        createMessage.success('修改成功');

        userStore.logout(true);
      }
    } finally {
      isLoading = false;
    }
  }

  const handleCancel = () => {
    emit('close');
  };

  const resetForm = () => {
    (formRef.value as any).resetFields();
  };

  defineExpose({
    resetForm,
  });
</script>
<style lang="less" scoped>
  footer {
    display: flex;
    padding: 10px 16px;
    text-align: right;
    background: transparent;
    border-top: 1px solid #f0f0f0;
    border-radius: 0 0 2px 2px;
    justify-content: flex-end;
  }

  .form-body {
    padding: 24px;
  }
</style>
