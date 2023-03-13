<template>
  <MyForm
    :model="formState"
    name="basic"
    autocomplete="off"
    ref="settlementInfoRef"
    labelAlign="left"
  >
    <Row :gutter="24">
      <Col :span="12">
        <FormItem
          label="周期类型"
          :labelCol="{ span: 6 }"
          name="billingCycleType"
          labelAlign="left"
          :rules="[{ required: true, message: '请选择周期类型' }]"
        >
          <div style="display: flex; align-items: center; position: relative">
            <Select
              :options="cycleTypes"
              :field-names="{ label: 'label', value: 'value' }"
              v-model:value="formState.billingCycleType"
              placeholder="请选择周期类型"
            />
            <Tooltip placement="top" color="#fff">
              <template #title>
                <p style="color: #000">
                  1、对账单生成的周期，可以按自然月，也可以按天计算，首次对账周期从合同生效日期开始计算。
                </p>
                <p style="color: #000"> 2、按自然月账单周期范围：1~12； </p>
                <p style="color: #000">3、按天账单周期范围：1~365天；</p>
              </template>
              <QuestionCircleOutlined
                style="margin-left: 10px; color: #19c280; position: absolute; right: -20px"
              />
            </Tooltip>
          </div>
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem
          label="账单周期"
          :labelCol="{ span: 4 }"
          name="billingCycle"
          labelAlign="left"
          :rules="[{ required: true, message: '请输入账单周期' }]"
        >
          <InputNumber
            id="inputNumber"
            v-model:value="formState.billingCycle"
            :min="1"
            :max="formState.billingCycleType == 'month' ? 12 : 366"
            :precision="0"
            style="width: 100%"
            placeholder="请输入"
            @input="tirrgerInvoiceDate"
          />
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="24">
      <Col :span="12">
        <FormItem
          label="账单出具日"
          :labelCol="{ span: 6 }"
          name="billingDate"
          labelAlign="left"
          :rules="[{ required: true, validator: calcTime1 }]"
        >
          <div style="display: flex; align-items: center; position: relative; width: 100%">
            <InputNumber
              id="inputNumber"
              v-model:value="formState.billingDate"
              :min="1"
              :max="28"
              :precision="0"
              style="width: 100%"
              placeholder="请输入"
              @input="tirrgerInvoiceDate"
            />
            <Tooltip placement="top" color="#fff">
              <template #title>
                <p style="color: #000"> 1、账单周期最后一天开始计算，几天后出具账单; </p>
                <p style="color: #000"> 2、账单出具日范围：1~28天； </p>
              </template>
              <QuestionCircleOutlined
                style="margin-left: 10px; color: #19c280; position: absolute; right: -20px"
              />
            </Tooltip>
          </div>
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem
          label="账单开票日"
          name="invoiceDate"
          labelAlign="left"
          :labelCol="{ span: 4 }"
          :rules="[{ validator: calcTime2 }]"
        >
          <div style="display: flex; align-items: center; position: relative">
            <InputNumber
              id="inputNumber"
              v-model:value="formState.invoiceDate"
              :min="1"
              :max="28"
              :precision="0"
              style="width: 100%"
              placeholder="请输入"
              @input="tirrgerBillingDate"
            />
            <Tooltip placement="top" color="#fff">
              <template #title>
                <p style="color: #000"> 1、账单周期最后一天开始计算，几天后开具发票； </p>
                <p style="color: #000"> 2、账单出具日范围：1~28天； </p>
                <p style="color: #000"> 3、账单出具日要小于账单开票日; </p>
              </template>
              <QuestionCircleOutlined
                style="margin-left: 10px; color: #19c280; position: absolute; right: -20px"
              />
            </Tooltip>
          </div>
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="24">
      <Col :span="12">
        <FormItem
          label="最迟收款日"
          :labelCol="{ span: 6 }"
          name="receiptDate"
          labelAlign="left"
          :rules="[{ required: true, message: '请选择最迟收款日' }]"
        >
          <Select
            :field-names="{ label: 'name', value: 'value' }"
            :options="receiptDates"
            v-model:value="formState.receiptDate"
            placeholder="请选择"
          />
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem label="结算方式" name="clearingForm" labelAlign="left" :labelCol="{ span: 4 }">
          <Input value="银行卡汇款" disabled />
        </FormItem>
      </Col>
    </Row>
  </MyForm>
  <p class="remark"
    >备注：T表示：账款周期最后一天，单月结（T+30）表示：次月的这一天为最迟收款日。</p
  >
</template>

<script lang="ts">
  import { defineComponent, ref, watch, onMounted } from 'vue';
  import {
    Card,
    Form,
    FormItem,
    Row,
    Col,
    Select,
    Input,
    InputNumber,
    Tooltip,
  } from 'ant-design-vue';
  import { toNumber } from 'lodash';
  import {
    validatorIdCard,
    validatorUploadImg,
    validatorChineseWord,
    validatorNumberAndEng,
    validatorUploadImgOnlyPng,
  } from '/@/utils/validtor';
  import { getDictWithType } from '/@/api/common/dicts';
  import { QuestionCircleOutlined } from '@ant-design/icons-vue';
  interface FormState {
    billingCycle: string | undefined;
    clearingForm: string;
    billingDate: string;
    invoiceDate: string;
    billingCycleType: string | undefined;
    receiptDate: string | undefined;
  }

  export default defineComponent({
    name: 'SettlementInfo',
    components: {
      [Card.name]: Card,
      MyForm: Form,
      FormItem,
      Row,
      Col,
      Select,
      Input,
      InputNumber,
      Tooltip,
      QuestionCircleOutlined,
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
        billingCycle: undefined,
        clearingForm: '',
        billingDate: '',
        invoiceDate: '',
        billingCycleType: undefined,
        receiptDate: undefined,
      });

      let billingCycles = ref();

      let receiptDates = ref([]);

      onMounted(async () => {
        billingCycles.value = await getDictWithType('payment_cycle');
        receiptDates.value = await getDictWithType('receipt_date');
      });

      watch(
        () => props.contractInfo,
        () => {
          formState.value = {
            billingCycle: `${props.contractInfo.value?.contractSettlementInfo?.billingCycle}`,
            billingCycleType:
              props.contractInfo.value?.contractSettlementInfo?.billingCycleType == 0
                ? 'month'
                : 'day',
            clearingForm: `${props.contractInfo.value?.contractSettlementInfo?.clearingForm}`,
            billingDate: props.contractInfo.value?.contractSettlementInfo?.billingDate
              ? `${props.contractInfo.value?.contractSettlementInfo?.billingDate}`
              : '',
            invoiceDate: props.contractInfo.value?.contractSettlementInfo?.invoiceDate
              ? `${props.contractInfo.value?.contractSettlementInfo?.invoiceDate}`
              : '',
            receiptDate: props.contractInfo.value?.contractSettlementInfo?.receiptDate
              ? `${props.contractInfo.value?.contractSettlementInfo?.receiptDate}`
              : undefined,
          };
        },
        {
          deep: true,
        },
      );

      const tirrgerBillingDate = () => {
        settlementInfoRef.value.validateFields(['billingDate']);
      };
      const tirrgerInvoiceDate = () => {
        settlementInfoRef.value.validateFields(['billingDate']);
      };

      // 次月开票日 不能 小于 次月账单出具日
      const calcTime1 = () => {
        if (!formState.value.billingDate) {
          return Promise.reject('不能为空');
        }
        if (formState.value.billingDate && formState.value.invoiceDate) {
          if (toNumber(formState.value.billingDate) > toNumber(formState.value.invoiceDate)) {
            return Promise.reject('次月开票日在次月账单出具日期之后');
          }
          if (toNumber(formState.value.billingDate) == toNumber(formState.value.invoiceDate)) {
            return Promise.reject('次月开票日在次月账单出具日期之后');
          }
        }
        return Promise.resolve();
      };
      const calcTime2 = () => {
        if (!formState.value.invoiceDate) {
          return Promise.reject('不能为空');
        }
        if (formState.value.billingDate && formState.value.invoiceDate) {
          if (toNumber(formState.value.billingDate) > toNumber(formState.value.invoiceDate)) {
            return Promise.reject('次月开票日在次月账单出具日期之后');
          }
          if (toNumber(formState.value.billingDate) == toNumber(formState.value.invoiceDate)) {
            return Promise.reject('次月开票日在次月账单出具日期之后');
          }
        }
        return Promise.resolve();
      };
      const settlementInfoRef = ref();

      const cycleTypes = [
        {
          label: '按自然月计算',
          value: 'month',
        },
        {
          label: '按天计算',
          value: 'day',
        },
      ];

      let maxNum = ref();
      watch(
        () => formState.value.billingCycleType,
        () => {
          console.log(formState.value.billingCycleType);
        },
      );

      return {
        formState,
        receiptDates,
        calcTime1,
        calcTime2,
        validatorIdCard,
        validatorUploadImg,
        validatorChineseWord,
        validatorNumberAndEng,
        validatorUploadImgOnlyPng,
        billingCycles,
        settlementInfoRef,
        tirrgerBillingDate,
        tirrgerInvoiceDate,
        cycleTypes,
      };
    },
  });
</script>

<style scoped>
  .remark {
    margin-bottom: 0;
    color: #888;
  }
</style>
