<template>
  <ConfigProvider :locale="locale">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { ConfigProvider } from 'ant-design-vue';
  import { AppProvider } from '/@/components/Application';
  import { useTitle } from '/@/hooks/web/useTitle';
  import zhCN from 'ant-design-vue/es/locale/zh_CN';
  import 'dayjs/locale/zh-cn';
  import dayjs from 'dayjs';
  dayjs.locale('zh-cn');

  const locale = zhCN;
  useTitle();
</script>
