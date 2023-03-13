<template>
  <MyForm :model="formState" name="basic" autocomplete="off" ref="basicInfoRef" labelAlign="left">
    <Row :gutter="24">
      <Col :span="12">
        <FormItem
          label="合同名称"
          :labelCol="{ span: 6 }"
          name="contractName"
          labelAlign="left"
          :rules="[{ required: true, message: '请输入合同名称' }]"
        >
          <Input v-model:value="formState.contractName" placeholder="请输入" :maxlength="100" />
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem
          label="外部合同编码"
          name="externalContractCode"
          labelAlign="left"
          :labelCol="{ span: 6 }"
        >
          <div style="display: flex; align-items: center; position: relative">
            <Input
              v-model:value="formState.externalContractCode"
              :maxlength="100"
              placeholder="请输入合同编码"
            />
            <Tooltip placement="top" color="#fff">
              <template #title>
                <p style="color: #000; margin: 0"> 与乙方签署纸质合同编码。 </p>
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
          label="签订日期"
          name="signDate"
          :labelCol="{ span: 6 }"
          :rules="[{ required: true, message: '请选择注册时间' }]"
        >
          <DatePicker v-model:value="formState.signDate" style="width: 100%" />
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem
          :labelCol="{ span: 6 }"
          :rules="[{ required: true, message: '请选择合同有效期' }]"
          label="合同有效期"
          name="validityDate"
        >
          <RangePicker v-model:value="formState.validityDate" style="width: 100%" />
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="24">
      <Col :span="12">
        <FormItem
          label="归属门店"
          name="shopId"
          :labelCol="{ span: 6 }"
          :rules="[{ required: true, message: '请选择归属门店' }]"
        >
          <Select
            v-model:value="formState.shopId"
            showSearch
            label-in-value
            placeholder="请选择"
            style="width: 100%"
            :filter-option="false"
            :not-found-content="fetching ? undefined : null"
            :options="data"
            allowClear
            :maxlength="10"
            @search="onSearch"
          >
            <template v-if="fetching" #notFoundContent>
              <Spin size="small" />
            </template>
          </Select>
        </FormItem>
      </Col>
      <Col :span="12" v-if="isRenewal">
        <FormItem
          label="源合同编码"
          name="oldContractCode"
          labelAlign="left"
          :labelCol="{ span: 6 }"
        >
          <Input
            v-model:value="formState.oldContractCode"
            :maxlength="100"
            disabled
            placeholder="请输入合同编码"
          />
        </FormItem>
      </Col>
    </Row>
  </MyForm>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive, onMounted, toRefs, watch } from 'vue';
  import type { Dayjs } from 'dayjs';
  import {
    Card,
    Form,
    FormItem,
    Row,
    Col,
    Select,
    DatePicker,
    Cascader,
    Input,
    RangePicker,
    Spin,
    Tooltip,
  } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import type { SelectProps, FormInstance } from 'ant-design-vue';
  import { getShopInfo } from '/@/api/contractManage/contractManage';
  import {
    validatorIdCard,
    validatorUploadImg,
    validatorChineseWord,
    validatorNumberAndEng,
    validatorUploadImgOnlyPng,
  } from '/@/utils/validtor';
  import { QuestionCircleOutlined } from '@ant-design/icons-vue';
  import { debounce } from 'lodash-es';
  import { useRoute } from 'vue-router';

  interface FormState {
    contractName: string;
    externalContractCode: string;
    signDate: Dayjs | '';
    validityDate: RangeValue | [];
    shopId: string | undefined;
    oldContractCode: stirng;
  }

  type RangeValue = [Dayjs, Dayjs];

  export default defineComponent({
    name: 'FormHightPage',
    components: {
      [Card.name]: Card,
      MyForm: Form,
      FormItem,
      Row,
      Col,
      Select,
      DatePicker,
      Cascader,
      Input,
      RangePicker,
      Spin,
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
        contractName: '',
        externalContractCode: '',
        signDate: '',
        validityDate: [],
        shopId: undefined,
        oldContractCode: '',
      });

      const shopsList = ref<SelectProps['options']>([]);
      const basicInfoRef = ref<FormInstance>();
      let route = useRoute();

      let isEdit = ref(false);
      let isRenewal = ref(false);
      onMounted(async () => {
        if (route.query?.edit) {
          isEdit.value = true;
        }
        if (route.query?.renewal) {
          isRenewal.value = true;
        }
      });

      watch(
        () => props.contractInfo,
        () => {
          formState.value.contractName = props.contractInfo.value?.contractInfo?.contractName;
          formState.value.externalContractCode =
            props.contractInfo.value?.contractInfo?.externalContractCode;
          formState.value.signDate = dayjs(props.contractInfo.value?.contractInfo?.signDate);
          formState.value.validityDate = [
            dayjs(props.contractInfo.value?.contractInfo?.validityStartDate),
            dayjs(props.contractInfo.value?.contractInfo?.validityEndDate),
          ];
          formState.value.shopId = {
            key: props.contractInfo.value?.contractInfo?.shopId,
            value: props.contractInfo.value?.contractInfo?.shopId,
            label: props.contractInfo.value?.contractInfo?.shopName,
          };

          if (route.query?.renewal && route.query?.edit) {
            formState.value.oldContractCode =
              props.contractInfo.value?.contractInfo.oldContractCode;
          }
          if (route.query?.renewal && !route.query?.edit) {
            formState.value.signDate = '';
            formState.value.validityDate = [];
            formState.value.oldContractCode = props.contractInfo.value?.contractInfo.contractCode;
          }
        },
        {
          deep: true,
        },
      );

      const searchData = reactive({
        data: [],
        value: [],
        fetching: false,
      });
      const onSearch = debounce(async (value) => {
        searchData.data = [];
        searchData.fetching = true;
        if (value != '') {
          let data = await getShopInfo(value);
          searchData.data = data.map((ele) => {
            return { value: ele.id, label: ele.shopName };
          });
          searchData.fetching = false;
        }
      }, 500);

      return {
        formState,
        shopsList,
        validatorIdCard,
        validatorUploadImg,
        validatorChineseWord,
        validatorNumberAndEng,
        validatorUploadImgOnlyPng,
        basicInfoRef,
        ...toRefs(searchData),
        onSearch,
        isRenewal,
      };
    },
  });
</script>

<style scoped></style>
