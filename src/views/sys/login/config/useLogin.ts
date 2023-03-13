import type { ValidationRule } from 'ant-design-vue/lib/form/Form';
import { ref, computed, unref, Ref } from 'vue';

export enum LoginStateEnum {
  LOGIN,
  FORGET_PASSWORD,
}

export const TriggerEnum = {
  CHANGE: 'change',
  BLUR: 'blur',
  ALL: ['change', 'blur'],
};

interface Rule {
  required: boolean;
  message: string;
  trigger: string | string[];
  whitespace?: boolean;
}

const currentState = ref(LoginStateEnum.LOGIN);

export function useLoginState() {
  function setLoginState(state: LoginStateEnum) {
    currentState.value = state;
  }

  const getLoginState = computed(() => currentState.value);

  function handleBackLogin() {
    setLoginState(LoginStateEnum.LOGIN);
  }

  return { setLoginState, getLoginState, handleBackLogin };
}

export function useFormValid<T extends Object = any>(formRef: Ref<any>) {
  async function validForm() {
    const form = unref(formRef);
    if (!form) return;
    const data = await form.validate();
    return data as T;
  }

  return { validForm };
}

export function useFormRules() {
  const getAccountFormRule = computed(() => createRule('请输入手机号码', TriggerEnum.BLUR));
  const getPasswordFormRule = computed(() => createRule('请输入密码', TriggerEnum.BLUR));
  const getCodeFormRule = computed(() => createRule('请输入手机验证码', TriggerEnum.BLUR));

  const getFormRules = computed((): { [k: string]: ValidationRule | ValidationRule[] } => {
    const accountFormRule = [
      ...unref(getAccountFormRule),
      { pattern: /^1\d{10}$/g, message: '请填写正确的手机号码', trigger: 'blur' },
    ];

    const codeFormRule = [
      ...unref(getCodeFormRule),
      { min: 6, max: 6, message: '手机验证码错误', trigger: 'blur' },
    ];

    const passwordFormRule = [
      ...unref(getPasswordFormRule),
      {
        min: 6,
        max: 20,
        pattern: /^[a-zA-Z0-9]{6,20}$/gi,
        message: '请填写正确的密码，只能数字，字母6~20位',
        trigger: 'blur',
      },
    ];

    switch (unref(currentState)) {
      // forget password form rules
      case LoginStateEnum.FORGET_PASSWORD:
        return {
          account: accountFormRule,
          code: codeFormRule,
          password: passwordFormRule,
        };

      // login form rules
      default:
        return {
          account: accountFormRule,
          password: passwordFormRule,
        };
    }
  });
  return { getFormRules };
}

function createRule(message: string, type?: string | string[]): any[] {
  const rule: Rule = {
    required: true,
    message,
    trigger: type || 'change',
  };

  type === TriggerEnum.BLUR && (rule.whitespace = true);
  return [rule];
}
