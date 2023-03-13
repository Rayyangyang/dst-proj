<template>
  <div class="modify-mobile" v-if="getShow">
    <MyForm
      class="p-4 enter-x form-body"
      :model="formData"
      :label-col="labelCol"
      :rules="getFormRules"
      key="modify-mobile"
      ref="formRef"
    >
      <FormItem label="旧手机号" class="enter-x"> {{ userInfo.phone }} </FormItem>

      <FormItem label="验证码" name="code" class="enter-x">
        <CountdownInput
          size="large"
          :sendCodeApi="handleSendCode"
          v-model:value="formData.code"
          placeholder="请输入验证码"
          @input="formData.code = formData.code.slice(0, 6)"
          @keydown="checkNumberInput($event)"
        />
      </FormItem>

      <FormItem label="新手机号" name="newPhone" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.newPhone"
          placeholder="请输入新手机号"
          @input="formData.newPhone = formData.newPhone.slice(0, 11)"
          @keydown="checkNumberInput($event)"
        />
      </FormItem>
    </MyForm>

    <FormItem class="enter-x">
      <footer>
        <Button size="large" class="btn-cancel" @click="handleCancel"> 取消 </Button>
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
  import { CountdownInput } from '/@/components/CountDown';
  import { useFormRules, ModifyStateEnum, useFormValid, useModifyState } from '../config/useModify';
  import { actionSendPhoneCode, actionUpdatePhoneByCaptcha } from '/@/api/sys/user';
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { checkNumberInput } from '/@/utils/input';

  const FormItem = Form.Item;

  const MyForm = Form;

  const formRef = ref(null);
  const { getModifyState } = useModifyState();
  const { getFormRules } = useFormRules();
  const { createMessage } = useMessage();
  const formData = reactive({
    newPhone: '',
    code: '',
  });

  let userInfo = ref<any>({});
  const userStore = useUserStore();
  userInfo.value = userStore.userInfo;

  const emit = defineEmits(['close']);

  let isLoading = false;
  const labelCol = { style: { width: '80px' } };

  const { validForm } = useFormValid(formRef);

  const getShow = computed(() => unref(getModifyState) === ModifyStateEnum.MOBILE);

  // 弹框确认
  async function handleConfirm() {
    const data = await validForm();

    if (!data) return;
    isLoading = true;

    try {
      const { status } = await actionUpdatePhoneByCaptcha({
        captcha: formData.code,
        newPhone: formData.newPhone,
      });

      if (status) {
        createMessage.success('手机号修改成功');

        setTimeout(() => {
          userStore.logout(true);
        }, 1000);
      }
    } finally {
      isLoading = false;
    }
  }

  // 发送验证码
  async function handleSendCode() {
    if (!userInfo.value.id) {
      return false;
    }
    try {
      await actionSendPhoneCode(`accountId=${userInfo.value.id}`);
      return true;
    } catch (error) {
      return false;
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

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }
</style>
