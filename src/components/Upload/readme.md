<template>
  <div>
    <BasicUpload :maxSize="20" :maxNumber="2" :accept="['image/*']" v-model:fileValue="file" @change="handleChange" />
  </div>
</template>

<script lang="ts" setup>
  import {
    BasicUpload
  } from '/@/components/Upload';
</script>
