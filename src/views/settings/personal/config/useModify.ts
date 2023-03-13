/* eslint-disable vue/return-in-computed-property */
import { ref, computed, unref, Ref } from 'vue';
import type { RuleObject } from 'ant-design-vue/lib/form/interface';
import type { ValidationRule } from 'ant-design-vue/lib/form/Form';

export enum ModifyStateEnum {
  PASSWORD,
  MOBILE,
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

const currentState = ref(ModifyStateEnum.PASSWORD);

export function useModifyState() {
  function setModifyState(state: ModifyStateEnum) {
    currentState.value = state;
  }

  const getModifyState = computed(() => currentState.value);

  return { setModifyState, getModifyState };
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

export function useFormRules(formData?: Recordable) {
  const validateConfirmPassword = (password: string) => {
    return async (_: RuleObject, value: string) => {
      if (value !== password) {
        return Promise.reject('两次输入密码不一致');
      }
      return Promise.resolve();
    };
  };

  const getCodeFormRule = computed(() => createRule('请输入短信验证码', TriggerEnum.BLUR));

  const validateMobile = async (_rule: any, value: string) => {
    if (!value) {
      return Promise.reject('请输入手机号码');
    }
    if (!/^1\d{10}$/.test(value) || value.length != 11) {
      return Promise.reject('请输入正确的手机号');
    } else {
      return Promise.resolve();
    }
  };

  const getFormRules = computed((): { [k: string]: ValidationRule | ValidationRule[] } => {
    const codeFormRule = [
      ...unref(getCodeFormRule),
      { min: 6, max: 6, message: '验证码错误', trigger: 'blur' },
    ];
    switch (unref(currentState)) {
      // modify password form rules
      case ModifyStateEnum.PASSWORD:
        return {
          oldPassword: [
            ...createRule('请输入原密码', TriggerEnum.BLUR),
            ...createPasswordCommonRule('原密码'),
          ],
          newPassword: [
            ...createRule('请输入新密码', TriggerEnum.BLUR),
            ...createPasswordCommonRule('新密码'),
          ],
          confirmPassword: [
            ...createRule('请输入确认密码'),
            ...createPasswordCommonRule('确认密码'),
            { validator: validateConfirmPassword(formData?.newPassword), trigger: 'blur' },
          ],
        };

      // modify mobile form rules
      case ModifyStateEnum.MOBILE:
        return {
          code: codeFormRule,
          newPhone: [{ validator: validateMobile, trigger: 'change' }],
        };
    }
  });

  return { getFormRules };
}

export function createPasswordCommonRule(msg: string): any[] {
  return [
    {
      min: 6,
      max: 20,
      pattern: /^[a-zA-Z0-9]{6,20}$/gi,
      message: `请填写正确的${msg}，只能数字，字母6~20位`,
      trigger: 'blur',
    },
  ];
}

export function createRule(message: string, type?: string | string[]): any[] {
  const rule: Rule = {
    required: true,
    message,
    trigger: type || 'change',
  };

  type === TriggerEnum.BLUR && (rule.whitespace = true);
  return [rule];
}
