<template>
  <PageWrapper class="high-form">
    <PageCard title="卡片1" />
    <PageCard title="卡片2" />
    <template #rightFooter>
      <a-button class="mr-4"> 取消 </a-button>
      <a-button type="primary"> 提交 </a-button>
    </template>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '/@/components/Page';
</script>
