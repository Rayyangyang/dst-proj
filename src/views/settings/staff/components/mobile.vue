<template>
  <div class="password-reset-manage">
    <BasicModal
      title="修改登录手机号"
      okText="确认"
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
        <a-form-item label="授权手机号" class="enter-x"> {{ userInfo.phone }} </a-form-item>

        <a-form-item label="验证码" name="captcha" class="enter-x">
          <CountdownInput
            :sendCodeApi="handleSendCode"
            v-model:value="formState.captcha"
            placeholder="请输入验证码"
            @input="formState.captcha = formState.captcha.slice(0, 6)"
            @keydown="checkNumberInput($event)"
          />
        </a-form-item>

        <a-form-item label="被修改手机号" class="enter-x"> {{ formState.oldphone }} </a-form-item>

        <a-form-item label="新手机号" name="newPhone" class="enter-x">
          <a-input
            v-model:value="formState.newPhone"
            placeholder="请输入手机号"
            @input="formState.newPhone = formState.newPhone.slice(0, 11)"
            @keydown="checkNumberInput($event)"
          />
        </a-form-item>
      </a-form>
    </BasicModal>
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, toRefs } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import type { Rule } from 'ant-design-vue/es/form';
  import type { FormInstance } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { CountdownInput } from '/@/components/CountDown';

  import { actionUpdatePhoneByCode } from '/@/api/settings/staff';
  import { actionSendPhoneCode } from '/@/api/sys/user';
  import { checkNumberInput } from '/@/utils/input';
  import { useUserStore } from '/@/store/modules/user';

  interface State {
    formState: {
      captcha: string;
      newPhone: string;
      oldphone: string;
      accountId: string | number;
    };
  }

  export default defineComponent({
    name: 'StaffPasswordReset',
    components: {
      BasicModal,
      CountdownInput,
    },
    setup() {
      let userInfo = ref<any>({});

      const formRef = ref<FormInstance>();

      const state: State = reactive({
        formState: {
          captcha: '',
          newPhone: '',
          oldphone: '',
          accountId: '',
        },
      });

      const { createMessage } = useMessage();
      const [register, { closeModal, changeLoading }] = useModalInner((data) => {
        console.log(data);
        (formRef.value as any).resetFields();
        state.formState.accountId = data?.id || '';
        state.formState.oldphone = data?.phone || '';
      });

      const formRules: Record<string, Rule[]> = {
        newPhone: [
          {
            min: 11,
            max: 11,
            required: true,
            whitespace: true,
            message: '请输入正确的手机号',
            trigger: 'blur',
          },
        ],
        captcha: [{ min: 6, max: 6, message: '验证码错误', trigger: 'blur', required: true }],
      };

      const userStore = useUserStore();
      userInfo.value = userStore.userInfo;

      const hanleConfirm = async () => {
        (formRef.value as any).validate().then(async (res) => {
          console.log(res);

          if (res.captcha || res.newPhone) {
            const { oldphone, newPhone, captcha, accountId } = state.formState;
            try {
              changeLoading(true);

              const { status } = await actionUpdatePhoneByCode({
                modifiedPhone: oldphone,
                newPhone,
                captcha,
                accountId,
              });

              if (status) {
                closeModal();
                createMessage.success('操作成功');
              }
            } finally {
              changeLoading(false);
            }
          }
        });
      };

      // 发送验证码
      const handleSendCode = async () => {
        console.log('发送验证码');
        if (!state.formState.accountId) {
          return false;
        }
        try {
          await actionSendPhoneCode(`accountId=${state.formState.accountId}`);
          return true;
        } catch (error) {
          return false;
        }
      };

      return {
        formRef,
        ...toRefs(state),
        userInfo,
        formRules,
        register,
        closeModal,
        hanleConfirm,
        checkNumberInput,
        handleSendCode,
      };
    },
  });
</script>
