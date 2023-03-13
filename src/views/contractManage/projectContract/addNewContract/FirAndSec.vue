<template>
  <MyForm :model="formState" name="basic" autocomplete="off" ref="firAndSecRef" labelAlign="left">
    <Row :gutter="24">
      <Col :span="12">
        <FormItem label="甲方" :labelCol="{ span: 6 }" name="partyAName" labelAlign="left">
          <Input v-model:value="formState.partyAName" placeholder="请输入姓名" disabled />
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem
          label="乙方"
          name="partyBName"
          labelAlign="left"
          :labelCol="{ span: 6 }"
          :rules="[{ required: true, message: '请选择乙方' }]"
        >
          <Select
            v-model:value="formState.partyBName"
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
            @select="selectCompany"
            :disabled="isEdit"
          >
            <template v-if="fetching" #notFoundContent>
              <Spin size="small" />
            </template>
          </Select>
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="24">
      <Col :span="12">
        <FormItem
          label="电话"
          name="partyAPhone"
          :labelCol="{ span: 6 }"
          :rules="[{ required: true, validator: validatorPhoneNum1 }]"
        >
          <Input v-model:value="formState.partyAPhone" placeholder="请输入电话" :maxlength="12" />
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem
          label="电话"
          name="partyBPhone"
          :labelCol="{ span: 6 }"
          :rules="[{ required: true, validator: validatorPhoneNum1 }]"
        >
          <Input v-model:value="formState.partyBPhone" placeholder="请输入电话" :maxlength="12" />
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="24">
      <Col :span="12">
        <FormItem
          label="省市"
          name="partyAAreaInfo"
          :labelCol="{ span: 6 }"
          :rules="[{ required: true, message: '请选择省市区' }]"
        >
          <Cascader
            :field-names="{ label: 'name', value: 'code' }"
            v-model:value="formState.partyAAreaInfo"
            :options="areas"
            @change="selectAAdress"
            placeholder="请选择省市区"
          />
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem
          label="省市"
          name="partyBAreaInfo"
          :labelCol="{ span: 6 }"
          :rules="[{ required: true, message: '请选择省市区' }]"
        >
          <Cascader
            :field-names="{ label: 'name', value: 'code' }"
            v-model:value="formState.partyBAreaInfo"
            :options="areas"
            @change="selectBAdress"
            placeholder="请选择省市区"
          />
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="24">
      <Col :span="12">
        <FormItem
          label="详细地址"
          name="partyAAddress"
          :labelCol="{ span: 6 }"
          :rules="[{ required: true, message: '请输入详细地址' }]"
        >
          <Input
            v-model:value="formState.partyAAddress"
            placeholder="请输入详细地址"
            :maxlength="11"
          />
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem
          label="详细地址"
          name="partyBAddress"
          :labelCol="{ span: 6 }"
          :rules="[{ required: true, message: '请输入详细地址' }]"
        >
          <Input
            v-model:value="formState.partyBAddress"
            placeholder="请输入详细地址"
            :maxlength="11"
          />
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="24">
      <Col :span="12">
        <FormItem
          label="经办人"
          name="partyAContact"
          :labelCol="{ span: 6 }"
          :rules="[{ required: true, message: '请输入经办人' }]"
        >
          <Input
            v-model:value="formState.partyAContact"
            placeholder="请输入经办人"
            :maxlength="100"
          />
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem
          label="经办人"
          name="partyBContact"
          :labelCol="{ span: 6 }"
          :rules="[{ required: true, message: '请输入经办人' }]"
        >
          <Input
            v-model:value="formState.partyBContact"
            placeholder="请输入经办人"
            :maxlength="100"
          />
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="24">
      <Col :span="12">
        <FormItem
          label="手机号"
          name="partyAMobile"
          :labelCol="{ span: 6 }"
          :rules="[{ required: true, validator: validatorPhoneNum }]"
        >
          <Input
            v-model:value="formState.partyAMobile"
            placeholder="请输入手机号"
            :maxlength="11"
          />
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem
          label="手机号"
          name="partyBMobile"
          :labelCol="{ span: 6 }"
          :rules="[{ required: true, validator: validatorPhoneNum }]"
        >
          <Input
            v-model:value="formState.partyBMobile"
            placeholder="请输入手机号"
            :maxlength="11"
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
  } from 'ant-design-vue';
  import { getBusinessInfoApi, findBusinessApi } from '/@/api/contractManage/contractManage';

  import { getAreaApi } from '/@/api/common/dicts';
  import { useRoute } from 'vue-router';
  import { useUserStore } from '/@/store/modules/user';

  import { debounce } from 'lodash-es';
  import {
    validatorIdCard,
    validatorUploadImg,
    validatorChineseWord,
    validatorNumberAndEng,
    validatorUploadImgOnlyPng,
    validatorPhoneNum,
    validatorPhoneNum1,
  } from '/@/utils/validtor';

  export default defineComponent({
    name: 'FirAndSec',
    components: {
      [Card.name]: Card,
      MyForm: Form,
      FormItem,
      Row,
      Col,
      Select,
      Cascader,
      Input,
      Spin,
    },
    props: {
      contractInfo: {
        default: () => {},
        type: Object,
      },
    },
    emits: ['changeRegisterArea'],
    setup(props) {
      let formState = ref({
        partyAName: '',
        partyBName: undefined,
        partyAMobile: '',
        partyBMobile: '',
        partyAAddress: '',
        partyBAddress: '',
        partyAContact: '',
        partyBContact: '',
        partyAPhone: '',
        partyBPhone: '',
        partyAProvince: '',
        partyACity: '',
        partyAArea: '',
        partyBProvince: '',
        partyBCity: '',
        partyBArea: '',
        partyAAreaInfo: [],
        partyBAreaInfo: [],
      });
      const userStore = useUserStore();

      const firAndSecRef = ref();
      let route = useRoute();

      let areas = ref();
      let isEdit = ref(false);
      onMounted(async () => {
        let companyId = userStore.userInfo.companyId;
        let firCompanyInfo = await getBusinessInfoApi(companyId);
        initFormState(firCompanyInfo, 'A');
        // 获取省市区
        areas.value = (await getAreaApi())[0].children;

        if (route.query?.edit) {
          isEdit.value = true;
        }
      });
      watch(
        () => props.contractInfo,
        () => {
          console.log(19993333, props.contractInfo.value);
          // formState.value.contractName = props.contractInfo.value?.contractInfo?.contractName;
          formState.value = {
            partyAName: props.contractInfo.value?.contractInfo?.partyAName,
            partyBName: props.contractInfo.value?.contractInfo?.partyBName,
            partyAMobile: props.contractInfo.value?.contractInfo?.partyAMobile,
            partyBMobile: props.contractInfo.value?.contractInfo?.partyBMobile,
            partyAAddress: props.contractInfo.value?.contractInfo?.partyAAddress,
            partyBAddress: props.contractInfo.value?.contractInfo?.partyBAddress,
            partyAContact: props.contractInfo.value?.contractInfo?.partyAContact,
            partyBContact: props.contractInfo.value?.contractInfo?.partyBContact,
            partyAPhone: props.contractInfo.value?.contractInfo?.partyAPhone,
            partyBPhone: props.contractInfo.value?.contractInfo?.partyBPhone,
            partyAProvince: props.contractInfo.value?.contractInfo?.partyAProvince,
            partyACity: props.contractInfo.value?.contractInfo?.partyACity,
            partyAArea: props.contractInfo.value?.contractInfo?.partyAArea,
            partyBProvince: props.contractInfo.value?.contractInfo?.partyBProvince,
            partyBCity: props.contractInfo.value?.contractInfo?.partyBCity,
            partyBArea: props.contractInfo.value?.contractInfo?.partyBArea,
            partyAAreaInfo: [
              props.contractInfo.value?.contractInfo?.partyAProvince,
              props.contractInfo.value?.contractInfo?.partyACity,
              props.contractInfo.value?.contractInfo?.partyAArea,
            ],
            partyBAreaInfo: [
              props.contractInfo.value?.contractInfo?.partyBProvince,
              props.contractInfo.value?.contractInfo?.partyBCity,
              props.contractInfo.value?.contractInfo?.partyBArea,
            ],
          };
        },
        {
          deep: true,
        },
      );

      const initFormState = (
        { companyInfo, companyInvoiceInfo, companyLegalInfo },
        companyName,
      ) => {
        formState.value[`party${companyName}Name`] = companyInfo.name;
        formState.value[`party${companyName}Phone`] = companyInfo.phone;
        formState.value[`party${companyName}Area`] = companyInfo.area;
        formState.value[`party${companyName}Province`] = companyInfo.province;
        formState.value[`party${companyName}City`] = companyInfo.city;
        formState.value[`party${companyName}Area`] = companyInfo.area;
        formState.value[`party${companyName}Address`] = companyInfo.detailedAddress;
        formState.value[`party${companyName}Contact`] = companyInfo.linkman;
        formState.value[`party${companyName}Mobile`] = companyInfo.phone;
        if (companyName == 'A') {
          if (companyInfo.province != '') {
            formState.value.partyAAreaInfo = [
              companyInfo.province,
              companyInfo.city,
              companyInfo.area,
            ];
          }
        }
        if (companyName == 'B') {
          if (companyInfo.province != '') {
            formState.value.partyBAreaInfo = [
              companyInfo.province,
              companyInfo.city,
              companyInfo.area,
            ];
          }
        }
      };

      const searchData = reactive({
        data: [],
        value: [],
        fetching: false,
      });
      const onSearch = debounce(async (value) => {
        searchData.data = [];
        searchData.fetching = true;
        if (value != '') {
          let data = await findBusinessApi(value);
          searchData.data = data.map((ele) => {
            return { value: ele.id, label: ele.name };
          });
          searchData.fetching = false;
        }
      }, 500);

      const selectCompany = async (val) => {
        console.log(18888, val);

        let secCompanyInfo = await getBusinessInfoApi(val.key);
        initFormState(secCompanyInfo, 'B');
      };

      const selectAAdress = (val, selectedOptions) => {
        console.log(111, selectedOptions);
        formState.value.partyAProvince = selectedOptions[0].code;
        formState.value.partyACity = selectedOptions[1].code;
        formState.value.partyAArea = selectedOptions[2].code;
      };
      const selectBAdress = (val, selectedOptions) => {
        console.log(111, selectedOptions);
        formState.value.partyBProvince = selectedOptions[0].code;
        formState.value.partyBCity = selectedOptions[1].code;
        formState.value.partyBArea = selectedOptions[2].code;
      };

      return {
        formState,
        validatorIdCard,
        validatorUploadImg,
        validatorChineseWord,
        validatorNumberAndEng,
        validatorUploadImgOnlyPng,
        validatorPhoneNum,
        validatorPhoneNum1,
        firAndSecRef,
        onSearch,
        ...toRefs(searchData),
        selectCompany,
        areas,
        selectAAdress,
        selectBAdress,
        isEdit,
      };
    },
  });
</script>

<style scoped></style>
