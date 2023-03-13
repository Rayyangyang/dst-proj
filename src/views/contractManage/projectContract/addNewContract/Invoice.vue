<template>
  <MyForm :model="formState" name="basic" autocomplete="off" ref="invoiceRef" labelAlign="left">
    <Row :gutter="24">
      <Col :span="12">
        <FormItem
          label="发票类型"
          :labelCol="{ span: 6 }"
          name="invoiceType"
          labelAlign="left"
          :rules="[{ required: true, message: '请选择发票类型' }]"
        >
          <Select
            :options="invoiceTypes"
            v-model:value="formState.invoiceType"
            :field-names="{ label: 'name', value: 'value' }"
            placeholder="请选择发票类型"
          />
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem
          label="税率"
          name="taxRate"
          labelAlign="left"
          :labelCol="{ span: 6 }"
          :rules="[{ required: true, validator: invoiceValidator }]"
        >
          <InputNumber
            v-model:value="formState.taxRate"
            :min="0"
            :max="100"
            :step="0.01"
            string-mode
          />
        </FormItem>
      </Col>
    </Row>
  </MyForm>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted, watch } from 'vue';
  import { Card, Form, FormItem, Row, Col, Select, InputNumber } from 'ant-design-vue';
  import { getDictWithType } from '/@/api/common/dicts';

  import type { Rule } from 'ant-design-vue/es/form';
  import {
    validatorIdCard,
    validatorUploadImg,
    validatorChineseWord,
    validatorNumberAndEng,
    validatorUploadImgOnlyPng,
  } from '/@/utils/validtor';
  interface FormState {
    invoiceType: string | undefined;
    taxRate: number | string;
  }

  export default defineComponent({
    name: 'Invoice',
    components: {
      [Card.name]: Card,
      MyForm: Form,
      FormItem,
      Row,
      Col,
      Select,
      InputNumber,
    },
    props: {
      contractInfo: {
        default: () => {},
        type: Object,
      },
    },
    emits: ['changeRegisterArea'],
    setup(props) {
      let formState = ref<FormState>({
        invoiceType: undefined,
        taxRate: '',
      });

      let invoiceTypes = ref([]);
      onMounted(async () => {
        invoiceTypes.value = await getDictWithType('invoice_type');
      });

      const invoiceValidator = (_rule: Rule, val: any) => {
        console.log('val', val);
        const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
        if (!val) {
          return Promise.reject('请输入税率');
        }
        if (!reg.test(val)) {
          return Promise.reject('格式不符合要求');
        }
        return Promise.resolve();
      };
      const invoiceRef = ref();

      watch(
        () => props.contractInfo,
        async () => {
          formState.value.invoiceType = `${props.contractInfo.value?.contractSettlementInfo?.invoiceType}`;
          formState.value.taxRate = props.contractInfo.value?.contractSettlementInfo?.taxRate / 100;
        },
        {
          deep: true,
        },
      );

      return {
        formState,
        validatorIdCard,
        validatorUploadImg,
        validatorChineseWord,
        validatorNumberAndEng,
        validatorUploadImgOnlyPng,
        invoiceTypes,
        invoiceValidator,
        invoiceRef,
      };
    },
  });
</script>

<style scoped></style>
