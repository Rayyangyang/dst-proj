<template>
  <div class="add-order">
    <PageWrapper class="high-form">
      <Spin :spinning="spinning">
        <PageCard title="基本信息">
          <Basic ref="basicInfoRef" :orderInfo="orderInfo" />
        </PageCard>

        <PageCard title="地址信息">
          <AddressInfo ref="addressInfoRef" :orderInfo="orderInfo" />
        </PageCard>

        <PageCard title="货物信息" :isReactive="false">
          <GoodsInfo ref="goodsInfoRef" :orderInfo="orderInfo" />
        </PageCard>

        <PageCard title="额外需求">
          <Extra ref="extraInfoRef" :orderInfo="orderInfo" />

          <div class="sub-btn full">
            <Button type="primary" @click="submitAll" style="margin-right: 20px"> 提交 </Button>
            <Checkbox v-model:checked="isSubAgagin" v-if="!edit"> 提交继续新增 </Checkbox>
            <p style="margin-left: 20px" v-if="!edit">
              <span style="color: red">*</span>批量新增
              <InputNumber min="1" v-model:value="number" :parser="limitNumber" max="999" />
              个</p
            >
          </div>
        </PageCard>
      </Spin>
    </PageWrapper>
  </div>
</template>

<script lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { defineComponent, ref, onMounted, computed } from 'vue';
  import Basic from './Basic.vue';
  import AddressInfo from './AddressInfo.vue';
  import GoodsInfo from './GoodsInfo.vue';
  import Extra from './Extra.vue';

  import { Button, message, Spin, Checkbox, InputNumber } from 'ant-design-vue';
  import { useRoute, useRouter } from 'vue-router';
  import { addNewOrderApi, getOrderInfoApi, editOrderApi } from '/@/api/orderManage/orderManage';
  import dayjs from 'dayjs';
  import { useMultipleTabStore } from '/@/store/modules/multipleTab';
  import { useReloadPage } from '/@/store/modules/reloadPage';

  export default defineComponent({
    components: {
      PageWrapper,
      Basic,
      AddressInfo,
      GoodsInfo,
      Extra,
      Button,
      Spin,
      Checkbox,
      InputNumber,
      PageWrapper,
    },
    setup() {
      const router = useRouter();
      const spinning = ref(false);

      const basicInfoRef = ref();
      const addressInfoRef = ref();
      const goodsInfoRef = ref(null);
      const extraInfoRef = ref();

      const number = ref(1);
      const reloadPage = useReloadPage();

      let isSubAgagin = ref(false);

      const submitAll = async () => {
        console.log(8777, basicInfoRef.value?.formState);

        // 验证货物信息
        goodsInfoRef.value?.calcGoodsInfo();
        Promise.all([
          basicInfoRef.value?.basicInfoRef?.validate(),
          addressInfoRef.value?.addressInfoRef?.validate(),
          extraInfoRef.value?.extraInfoRef?.validate(),
        ]).then(async () => {
          let goodsData = goodsInfoRef?.value?.data;

          console.log(1111, basicInfoRef.value.formState);
          let extraFormState = extraInfoRef.value.formState;
          let basicInfoState = basicInfoRef.value?.formState;
          let addressInfoState = addressInfoRef.value.formState;

          // 判断货物是否为空
          if (goodsData.length == 0) {
            message.error('货物不能为空');
            return;
          }
          let orderBaseInfo = {
            shopId: basicInfoState.shopId?.value,
            shopName: basicInfoState.shopId?.label,
            contractId: basicInfoState?.contractId?.value,
            contractName: basicInfoState?.contractId?.option?.showLabel,
            routeId: basicInfoState?.routeId?.value,
            routeName: basicInfoState?.routeId?.option?.info?.name,
            serviceType: basicInfoState.serviceType,
            serviceCategoryId: basicInfoState.serviceCategoryId,
            serviceCategoryName: basicInfoState.serviceCategoryName,
            startTime: dayjs(basicInfoState.startTime).format('YYYY-MM-DD HH:mm'),
            endTime: dayjs(basicInfoState.endTime).format('YYYY-MM-DD HH:mm'),
            externalOrderCode: basicInfoState.externalOrderCode,
            externalBarcode: basicInfoState.externalBarcode,
          };

          let orderAddress = {
            sendAddress: addressInfoState.sendAddress.label,
            sendName: addressInfoState.sendName,
            sendPhone: addressInfoState.sendPhone,
            sendCityCode: addressInfoState.sendAddress.sendCityCode,
            receiveCityCode: addressInfoState.receiveAddress.receiveCityCode,
            receiveAddress: addressInfoState.receiveAddress.label,
            receiveName: addressInfoState.receiveName,
            receivePhone: addressInfoState.receivePhone,
            sendSaveFlag: addressInfoState.sendChecked ? 1 : 0,
            receiveSaveFlag: addressInfoState.receiveChecked ? 1 : 0,
          };

          let orderCargoList = goodsData;

          let orderOther = {
            caragCompanyId: extraFormState.caragCompanyId[0],
            caragCompanyName: extraFormState.caragCompanyName,
            branchId: extraFormState.caragCompanyId[2],
            branchName: extraFormState.branchName,
            cityCode: extraFormState.caragCompanyId[1],
            spotNum: extraFormState.spotNum,
            kilometreNum: extraFormState.kilometreNum,
            freight: extraFormState.freight,
            invoiceFlag: extraFormState.requirements.indexOf('invoiceFlag') == -1 ? 0 : 1,
            consignmentFlag: extraFormState.requirements.indexOf('consignmentFlag') == -1 ? 0 : 1,
            receiptFlag: extraFormState.requirements.indexOf('receiptFlag') == -1 ? 0 : 1,
          };

          let subObj = {
            orderBaseInfo,
            orderAddress,
            orderCargoList,
            orderOther,
            addTotal: number.value,
          };

          console.log(1999, subObj);
          if (edit.value) {
            subObj.id = route.query.orderId;
            await editOrderApi(subObj);
            message.success('编辑成功');
          } else {
            await addNewOrderApi(subObj);

            message.success('提交成功');
          }

          if (!isSubAgagin.value) {
            tabStore.closeTabByKey(router.currentRoute.value.fullPath, router);
            router.push({
              name: 'OrderList',
            });
          }
          reloadPage.setOrderListPageReload();
        });
      };

      const tabStore = useMultipleTabStore();
      let route = useRoute();
      let orderInfoRes = ref();
      let edit = ref(false);
      onMounted(async () => {
        if (route.query?.orderId) {
          orderInfoRes.value = await getOrderInfoApi(route.query?.orderId);
          edit.value = true;
        }
      });

      let orderInfo = computed(() => {
        return orderInfoRes;
      });
      const limitNumber = (value) => {
        if (typeof value === 'string') {
          return !isNaN(Number(value)) ? value.replace(/\./g, '') : 0;
        } else if (typeof value === 'number') {
          return !isNaN(value) ? String(value).replace(/\./g, '') : 0;
        } else {
          return 0;
        }
      };
      return {
        submitAll,
        basicInfoRef,
        addressInfoRef,
        goodsInfoRef,
        extraInfoRef,
        orderInfo,
        spinning,
        number,
        isSubAgagin,
        edit,
        limitNumber,
      };
    },
  });
</script>

<style scoped lang="less">
  .sub-btn {
    background-color: #fff;
    padding: 16px;
    display: flex;
    align-items: center;
    p {
      margin: 0px;
    }
  }

  :deep(.ant-spin-dot) {
    position: fixed !important;
  }
</style>
