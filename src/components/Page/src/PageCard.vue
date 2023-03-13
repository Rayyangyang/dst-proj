<template>
  <div class="card-manage">
    <Card :title="title" :bordered="bordered">
      <div :class="[isReactive ? '2xl:w-8/12 xl:w-9/12' : '']">
        <slot></slot>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
  import { Card } from 'ant-design-vue';
  const props = defineProps({
    /**
     * Arrow expand state
     */
    isReactive: { type: Boolean, default: true },
    title: { type: String, default: '' },
    bordered: { type: Boolean, default: false },
  });
</script>

<style scoped>
  .card-manage {
    margin-bottom: 1rem;
    box-sizing: border-box;
    outline: none !important;
    background-color: #fff;
  }
</style>
