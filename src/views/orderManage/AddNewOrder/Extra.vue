<template>
  <MyForm :model="formState" name="basic" autocomplete="off" ref="extraInfoRef" labelAlign="left">
    <Row :gutter="24">
      <Col :span="12">
        <FormItem
          label="指定承运商"
          :labelCol="{ span: 6 }"
          name="caragCompanyId"
          labelAlign="left"
          :rules="[{ required: true, message: '请选择指定承运商' }]"
        >
          <Cascader
            :field-names="{ label: 'name', value: 'id' }"
            v-model:value="formState.caragCompanyId"
            :options="caragTrees"
            @change="selectAAdress"
            :disabled="status != 1 && isEdit"
            placeholder="请选择指定承运商"
          />
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem label="串点数" name="spotNum" labelAlign="left" :labelCol="{ span: 6 }">
          <div style="display: flex; align-items: center; position: relative">
            <InputNumber
              v-model:value="formState.spotNum"
              :maxlength="3"
              placeholder="请输入串点数"
              min="0"
              max="99"
              :precision="0"
              style="width: 100%"
            />
            <Tooltip placement="top" color="#fff">
              <template #title>
                <p style="color: #000"> 卸货点数量。 </p>
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
        <FormItem label="公里数" name="kilometreNum" :labelCol="{ span: 6 }">
          <Input
            v-model:value="formState.kilometreNum"
            :maxlength="6"
            placeholder="请输入公里数"
            min="0"
            max="999"
            style="width: 100%"
            @input="inpKil"
          />
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem
          :labelCol="{ span: 6 }"
          :rules="[{ required: true, validator: validateSendMoney }]"
          label="运费"
          name="freight"
        >
          <InputNumber
            v-model:value="formState.freight"
            :maxlength="8"
            placeholder="请输入运费"
            min="0"
            max="99999"
            style="width: 100%"
            @blur="test"
          />
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="24">
      <Col :span="12">
        <FormItem label="回单要求" name="shopId" :labelCol="{ span: 6 }">
          <CheckboxGroup v-model:value="formState.requirements">
            <Checkbox value="invoiceFlag" name="invoiceFlag">发货单</Checkbox>
            <Checkbox value="consignmentFlag" name="consignmentFlag">货物托运单</Checkbox>
            <Checkbox value="receiptFlag" name="receiptFlag">签收单</Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Col>
    </Row>
  </MyForm>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue';
  import {
    Card,
    CheckboxGroup,
    Checkbox,
    Form,
    Col,
    Input,
    Row,
    FormItem,
    InputNumber,
    Cascader,
    Tooltip,
  } from 'ant-design-vue';
  import { QuestionCircleOutlined } from '@ant-design/icons-vue';

  import { validateSendMoney } from '/@/utils/validtor';
  import { getCaragTreeApi } from '/@/api/orderManage/orderManage';
  import { useRoute } from 'vue-router';

  const MyForm = Form;
  const extraInfoRef = ref();
  const props = defineProps(['orderInfo']);
  let status = ref();
  let route = useRoute();
  let isEdit = ref(false);
  if (route.query?.orderId) {
    isEdit.value = true;
  }

  watch(
    () => props.orderInfo,
    () => {
      console.log(9999, props.orderInfo.value.orderOther);
      formState.value.spotNum = props.orderInfo.value?.orderOther?.spotNum;
      formState.value.kilometreNum = props.orderInfo.value?.orderOther?.kilometreNum;
      formState.value.freight = props.orderInfo.value?.orderOther?.freight;
      formState.value.caragCompanyName = props.orderInfo.value?.orderOther?.caragCompanyName;
      formState.value.branchName = props.orderInfo.value?.orderOther?.branchName;

      formState.value.caragCompanyId = [
        props.orderInfo.value.orderOther?.caragCompanyId,
        props.orderInfo.value.orderOther?.cityCode,
        props.orderInfo.value.orderOther?.branchId,
      ];

      if (props.orderInfo.value?.orderOther?.invoiceFlag == 1) {
        formState.value.requirements.push('invoiceFlag');
      }
      if (props.orderInfo.value?.orderOther?.consignmentFlag == 1) {
        formState.value.requirements.push('consignmentFlag');
      }
      if (props.orderInfo.value?.orderOther?.receiptFlag == 1) {
        formState.value.requirements.push('receiptFlag');
      }

      status.value = props.orderInfo.value.orderBaseInfo?.orderStatus;
    },
    {
      deep: true,
    },
  );

  let test = (e) => {
    let a = new RegExp(/^(([1-9]\d*)|\d)(\.\d{1,2})?$/, 'g'); // 只能输入数字跟小数点 两位小数
    let b = a.test(e.target.value);
    console.log(11, b);
  };

  const formState = ref({
    caragCompanyId: '',
    spotNum: '',
    kilometreNum: '',
    freight: '',
    requirements: [],
    caragCompanyName: '',
    branchName: '',
  });
  let caragTrees = ref();
  onMounted(async () => {
    caragTrees.value = (await getCaragTreeApi()).caragList;

    console.log(1111, caragTrees);
  });

  const selectAAdress = (val, selectedOptions) => {
    console.log(111, selectedOptions);
    formState.value.branchName = selectedOptions[2].name;
    formState.value.caragCompanyName = selectedOptions[0].name;
  };

  const limitNumber = (value) => {
    if (typeof value === 'string') {
      return !isNaN(Number(value)) ? value.replace(/\./g, '') : 0;
    } else if (typeof value === 'number') {
      return !isNaN(value) ? String(value).replace(/\./g, '') : 0;
    } else {
      return 0;
    }
  };

  const visiable = ref<boolean>(false);

  const inpKil = () => {
    if (formState.value.kilometreNum > 999) {
      formState.value.kilometreNum = 999;
    }
    if (/^\d+\.?\d{0,2}$/.test(formState.value.kilometreNum)) {
      formState.value.kilometreNum = formState.value.kilometreNum;
    } else {
      formState.value.kilometreNum = formState.value.kilometreNum.substring(
        0,
        formState.value.kilometreNum.length - 1,
      );
    }
  };

  defineExpose({
    formState,
    extraInfoRef,
  });
</script>

<style scoped></style>
