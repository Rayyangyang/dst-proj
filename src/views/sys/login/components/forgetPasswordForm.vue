<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <MyForm class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
      <FormItem name="account" class="enter-x">
        <Input
          v-model:value="formData.account"
          placeholder="请输入手机号码"
          :maxlength="11"
          @input="formData.account = formData.account.replace(/[^\d]/gi, '')"
        />
      </FormItem>

      <FormItem name="code" class="enter-x">
        <CountdownInput
          :sendCodeApi="handleSendCode"
          v-model:value="formData.code"
          placeholder="请输入短信验证码"
          @input="formData.code = formData.code.slice(0, 6)"
          @keydown="checkNumberInput($event)"
        />
      </FormItem>

      <FormItem name="password" class="enter-x">
        <Input v-model:value="formData.password" placeholder="请输入6~20数字或字母" />
      </FormItem>

      <FormItem class="enter-x">
        <footer>
          <Button class="btn-cancel" block @click="handleCancel"> 取消 </Button>
          <Button
            type="primary"
            block
            class="ml-4 btn-confirm"
            :loading="loading"
            @click="handleConfirm"
          >
            确认
          </Button>
        </footer>
      </FormItem>
    </MyForm>
  </template>
</template>
<script lang="ts" setup>
  import { reactive, ref, computed, unref } from 'vue';
  import LoginFormTitle from './loginFormTitle.vue';
  import { Form, Input, Button } from 'ant-design-vue';
  import { CountdownInput } from '/@/components/CountDown';
  import { useLoginState, useFormRules, LoginStateEnum, useFormValid } from '../config/useLogin';
  import { actionSendForgetPwdCaptcha, actionUpdateForgetPwdCaptcha } from '/@/api/sys/user';
  import { setEncrypt } from '/@/utils/jsencrypt';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { checkNumberInput } from '/@/utils/input';

  const FormItem = Form.Item;
  const MyForm = Form;

  const { handleBackLogin, getLoginState, setLoginState } = useLoginState();
  const { getFormRules } = useFormRules();
  const { createMessage } = useMessage();

  const formRef = ref();
  const loading = ref(false);

  const formData = reactive({
    account: '',
    password: '',
    code: '',
  });

  const { validForm } = useFormValid(formRef);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.FORGET_PASSWORD);

  // 确认
  async function handleConfirm() {
    const data = await validForm();

    if (!data) return;
    loading.value = true;
    try {
      const { status } = await actionUpdateForgetPwdCaptcha({
        phone: formData.account,
        captcha: formData.code,
        password: setEncrypt(formData.password),
      });

      if (status) {
        createMessage.success('修改成功');
        setLoginState(LoginStateEnum.LOGIN);
        (formRef.value as any).resetFields();
      }
    } finally {
      loading.value = false;
    }
  }

  // 取消
  const handleCancel = () => {
    handleBackLogin();
    (formRef.value as any).resetFields();
  };

  const handleSendCode = async () => {
    (formRef.value as any).validateFields('account');
    if (!formData.account || !/^1\d{10}$/g.test(formData.account)) {
      return false;
    } else {
      const { status } = await actionSendForgetPwdCaptcha(`phone=${formData.account}`);
      return status;
    }
  };
</script>

<style lang="less" scoped>
  footer {
    display: flex;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }
</style>
