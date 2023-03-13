<template>
  <h2 class="mb-3 text-2xl font-bold text-left xl:text-3xl enter-x xl:text-left">
    {{ getFormTitle }}
  </h2>
</template>
<script lang="ts" setup>
  import { computed, unref } from 'vue';
  import { LoginStateEnum, useLoginState } from '../config/useLogin';

  const { getLoginState } = useLoginState();

  const getFormTitle = computed(() => {
    const titleObj = {
      [LoginStateEnum.FORGET_PASSWORD]: '忘记密码',
      [LoginStateEnum.LOGIN]: '密码登录',
    };
    return titleObj[unref(getLoginState)];
  });
</script>
