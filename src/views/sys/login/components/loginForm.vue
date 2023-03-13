<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
  <MyForm
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    v-show="getShow"
    @keypress.enter="handleLogin"
  >
    <FormItem name="account" class="enter-x">
      <Input
        v-model:value="formData.account"
        placeholder="请输入手机号码"
        class="fix-auto-fill"
        :maxlength="11"
        @input="formData.account = formData.account.replace(/[^\d]/gi, '')"
      />
    </FormItem>

    <FormItem name="password" class="enter-x">
      <InputPassword
        :maxlength="20"
        visibilityToggle
        v-model:value="formData.password"
        placeholder="请输入密码"
      />
    </FormItem>

    <ARow class="enter-x" justify="end">
      <ACol :span="12">
        <FormItem :style="{ 'text-align': 'right' }">
          <Button type="link" size="small" @click="setLoginState(LoginStateEnum.FORGET_PASSWORD)">
            忘记密码?
          </Button>
        </FormItem>
      </ACol>
    </ARow>

    <FormItem class="enter-x">
      <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
        登录
      </Button>
    </FormItem>
  </MyForm>
</template>
<script lang="ts" setup>
  import { reactive, ref, unref, computed } from 'vue';

  import { Form, Input, Row, Col, Button } from 'ant-design-vue';

  import { useMessage } from '/@/hooks/web/useMessage';

  import { useUserStore } from '/@/store/modules/user';
  import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from '../config/useLogin';
  import LoginFormTitle from './loginFormTitle.vue';
  import { setEncrypt } from '/@/utils/jsencrypt';

  const ACol = Col;
  const ARow = Row;
  const FormItem = Form.Item;
  const MyForm = Form;
  const InputPassword = Input.Password;
  const { notification } = useMessage();
  const userStore = useUserStore();

  const { setLoginState, getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  const formRef = ref();
  const loading = ref(false);

  const formData = reactive({
    account: '',
    password: '',
  });

  const { validForm } = useFormValid(formRef);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

  async function handleLogin() {
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      const userInfo = await userStore.login({
        sysCode: 3,
        password: setEncrypt(data.password),
        phone: data.account,
      });

      if (userInfo) {
        notification.success({
          message: '登录成功',
          description: `欢迎回来: ${userInfo.accountName || userInfo.userName}`,
          duration: 3,
        });
      }
    } finally {
      loading.value = false;
    }
  }
</script>
<style lang="less" scoped>
  :deep(.fix-auto-fill) {
    width: 100%;
  }
</style>
