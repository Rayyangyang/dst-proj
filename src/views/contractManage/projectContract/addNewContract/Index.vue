<template>
  <div class="add-contract">
    <PageWrapper class="high-form">
      <Spin :spinning="spinning">
        <PageCard title="基本信息">
          <BasicInfo ref="basicInfoRef" :contractInfo="contractInfo" />
        </PageCard>

        <PageCard title="甲乙双方">
          <FirAndSec ref="firAndSecRef" :contractInfo="contractInfo" />
        </PageCard>

        <PageCard title="发票条款">
          <Invoice ref="invoiceRef" :contractInfo="contractInfo" />
        </PageCard>

        <PageCard title="结算信息">
          <SettlementInfo ref="settlementInfoRef" :contractInfo="contractInfo" />
        </PageCard>

        <PageCard title="附件">
          <Enclosure ref="enclosureRef" :contractInfo="contractInfo" />
        </PageCard>

        <ContractLineInfo ref="contractLineInfoRef" :contractInfo="contractInfo" />

        <div class="sub-btn full">
          <Button type="primary" @click="submitAll"> 提交 </Button>
        </div>
      </Spin>
    </PageWrapper>
  </div>
</template>

<script lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { defineComponent, ref, onMounted, computed } from 'vue';
  import BasicInfo from './BasicInfo.vue';
  import FirAndSec from './FirAndSec.vue';
  import Invoice from './Invoice.vue';
  import SettlementInfo from './SettlementInfo.vue';
  import Enclosure from './Enclosure.vue';
  import ContractLineInfo from './ContractLineInfo.vue';
  import { Button, message, Spin } from 'ant-design-vue';
  import { useRoute, useRouter } from 'vue-router';

  import {
    addNewContractApi,
    getContractInfoApi,
    uploadContractApi,
  } from '/@/api/contractManage/contractManage';
  import dayjs from 'dayjs';
  import { useMultipleTabStore } from '/@/store/modules/multipleTab';
  import { useReloadPage } from '/@/store/modules/reloadPage';
  export default defineComponent({
    name: 'AddNewContract',
    components: {
      PageWrapper,
      BasicInfo,
      FirAndSec,
      Invoice,
      SettlementInfo,
      Enclosure,
      ContractLineInfo,
      Button,
      Spin,
    },
    setup() {
      const router = useRouter();
      const spinning = ref(false);
      const basicInfoRef = ref();
      const firAndSecRef = ref();
      const invoiceRef = ref();
      const settlementInfoRef = ref();
      const enclosureRef = ref();
      const contractLineInfoRef = ref();
      const reloadPage = useReloadPage();
      const submitAll = async () => {
        Promise.all([
          basicInfoRef.value?.basicInfoRef?.validate(),
          firAndSecRef.value?.firAndSecRef?.validate(),
          invoiceRef.value?.invoiceRef?.validate(),
          settlementInfoRef.value?.settlementInfoRef?.validate(),
          enclosureRef.value?.enclosureRef?.validate(),
        ]).then(async () => {
          let basicInfoData = {
            contractName: basicInfoRef.value?.formState.contractName,
            externalContractCode: basicInfoRef.value?.formState.externalContractCode,
            shopId: basicInfoRef.value?.formState.shopId.value,
            shopName: basicInfoRef.value?.formState.shopId.label,
            signDate: dayjs(basicInfoRef.value?.formState.signDate).format('YYYY-MM-DD'),
            validityStartDate: dayjs(basicInfoRef.value?.formState.validityDate[0]).format(
              'YYYY-MM-DD',
            ),
            validityEndDate: dayjs(basicInfoRef.value?.formState.validityDate[1]).format(
              'YYYY-MM-DD',
            ),
          };

          // 甲乙方省市区还没处理
          const {
            partyAName,
            partyAContact,
            partyAMobile,
            partyAPhone,
            partyAAddress,
            partyAProvince,
            partyACity,
            partyAArea,
            partyBName,
            partyBContact,
            partyBMobile,
            partyBPhone,
            partyBAddress,
            partyBProvince,
            partyBCity,
            partyBArea,
          } = firAndSecRef.value.formState;

          const { invoiceType, taxRate } = invoiceRef.value.formState;
          const { billingCycle, billingCycleType, billingDate, invoiceDate, receiptDate } =
            settlementInfoRef.value.formState;

          const businessAttachments = enclosureRef.value.formState.fileList.map((ele) => {
            return {
              fileUrl: ele.fileUrl,
              fileName: ele.name,
            };
          });

          const routeIds = contractLineInfoRef.value.tableData.map((ele) => {
            return ele.id;
          });

          let subParams = {
            contractInfo: {
              ...basicInfoData,
              partyAName,
              partyAContact,
              partyAMobile,
              partyAPhone,
              partyAAddress,
              partyAProvince,
              partyACity,
              partyAArea,
              partyBName,
              partyBContact,
              partyBMobile,
              partyBPhone,
              partyBAddress,
              partyBProvince,
              partyBCity,
              partyBArea,
              routeIds,
            },
            contractSettlementInfo: {
              invoiceType,
              taxRate: taxRate * 100,
              billingCycle,
              billingCycleType: billingCycleType == 'month' ? 0 : 1,
              clearingForm: 0,
              billingDate,
              invoiceDate,
              receiptDate,
            },
            businessAttachments,
          };

          console.log('subParams', subParams);
          spinning.value = true;
          if (renewal && !edit) {
            // 续签
            subParams.contractInfo.oldContractCode = contractCode;
            subParams.contractInfo.type = 1;

            try {
              await addNewContractApi(subParams);
              message.success('续签成功');
            } catch (error) {}
          } else if (edit) {
            subParams.contractInfo.id = contractId;
            try {
              await uploadContractApi(subParams);
              message.success('更新成功');
            } catch (error) {
              console.log(18888800000, error);
            }
          } else {
            try {
              await addNewContractApi(subParams);
              message.success('提交成功');
              spinning.value = false;
            } catch (error) {}
          }

          router.push({
            name: 'ProjectContract',
          });

          tabStore.closeTabByKey(router.currentRoute.value.fullPath, router);
          reloadPage.setContractPageReload();
        });
      };

      const tabStore = useMultipleTabStore();
      let route = useRoute();
      let contractInfoRes = ref();
      let contractId = route.query?.contractId;
      let contractCode = route.query?.contractCode;
      let renewal = route.query?.renewal;
      let edit = route.query?.edit;
      onMounted(async () => {
        if (route.query?.contractId) {
          contractInfoRes.value = await getContractInfoApi(route.query?.contractId);
        }
      });

      let contractInfo = computed(() => {
        return contractInfoRes;
      });

      return {
        submitAll,
        basicInfoRef,
        firAndSecRef,
        invoiceRef,
        settlementInfoRef,
        enclosureRef,
        contractLineInfoRef,
        contractInfo,
        spinning,
      };
    },
  });
</script>

<style scoped>
  .sub-btn {
    background-color: #fff;
    padding: 16px;
  }

  :deep(.ant-spin-dot) {
    position: fixed !important;
  }
</style>
