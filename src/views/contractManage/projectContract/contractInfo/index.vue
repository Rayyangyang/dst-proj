<template>
  <div class="contractInfo">
    <PageWrapper>
      <Description :data="contractInfo" @register="registerBasic" class="mt-4" />

      <Description :data="contractInfo" @register="registerBothSides" class="mt-4" />

      <Description :data="contractSettlementInfo" @register="registerDrawnClause" class="mt-4" />

      <Description :data="contractSettlementInfo" @register="registerBillingInfo" class="mt-4" />

      <Description :data="businessAttachments" @register="registerAccessory" class="mt-4">
        <template #businessAttachments>
          <a-button
            class="mr-2"
            type="link"
            v-for="(item, index) in businessAttachments"
            :key="index"
            @click="handlePreview(item.fileUrl)"
            >{{ item.fileName }}</a-button
          >
        </template>
      </Description>

      <Description title="合同路线" class="route-card" :isReactive="false">
        <template #action>共计 {{ oocRouteInfoList?.length }} 条</template>
        <template #custom-content
          ><Table :columns="TableColumn" :data-source="oocRouteInfoList" :pagination="false" />
        </template>
      </Description>
    </PageWrapper>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, toRefs, reactive } from 'vue';
  import { Description, useDescription } from '/@/components/Description/index';
  import { useRoute } from 'vue-router';
  import { Table, Card } from 'ant-design-vue';
  import { getContractInfoApi } from '/@/api/contractManage/contractManage';
  import { PageWrapper } from '/@/components/Page';
  import {
    schemaBasic,
    schemaBothSides,
    schemaDrawnClause,
    schemaBillingInfo,
    schemaAccessory,
    TableColumn,
  } from './data';

  interface State {
    contractInfo: any;
    businessAttachments: any;
    contractSettlementInfo: any;
    oocRouteInfoList: any[];
  }

  export default defineComponent({
    name: 'ContractInfo',
    components: {
      PageWrapper,
      Description,
      Table,
      [Card.name]: Card,
    },
    setup() {
      let route = useRoute();
      let state: State = reactive({
        contractInfo: null,
        businessAttachments: null,
        contractSettlementInfo: null,
        oocRouteInfoList: [],
      });

      const [registerBasic] = useDescription({
        title: '基本信息',
        bordered: false,
        schema: schemaBasic(),
        column: 2,
      });

      const [registerBothSides] = useDescription({
        title: '甲乙双方',
        bordered: false,
        schema: schemaBothSides(),
        column: 2,
      });

      const [registerDrawnClause] = useDescription({
        title: '发票条款',
        bordered: false,
        schema: schemaDrawnClause(),
        column: 2,
      });

      const [registerBillingInfo] = useDescription({
        title: '结算信息',
        bordered: false,
        schema: schemaBillingInfo(),
        column: 2,
      });

      const [registerAccessory] = useDescription({
        title: '附件',
        bordered: false,
        schema: schemaAccessory(),
        column: 2,
      });

      const [registerContractRoute] = useDescription({
        title: '合同路线',
        bordered: false,
      });

      const handlePreview = (url: string) => {
        url && window.open(url);
      };

      // 获取详情
      const handeGetDetail = async () => {
        const { businessAttachments, contractSettlementInfo, contractInfo, oocRouteInfoList } =
          await getContractInfoApi(route.query?.contractId);

        state.contractInfo = Object.assign(contractInfo, {
          validityDate: `${contractInfo?.validityStartDate} - ${contractInfo?.validityEndDate}`,
          partyAProvincesName: `${contractInfo?.partyAProvinceName || ''}${
            contractInfo?.partyACityName || ''
          }${contractInfo?.partyAAreaName || ''}`,
          partyBProvincesName: `${contractInfo?.partyBProvinceName || ''}${
            contractInfo?.partyBCityName || ''
          }${contractInfo?.partyBAreaName || ''}`,
        });

        state.contractSettlementInfo = Object.assign(contractSettlementInfo, {
          taxRate: (contractSettlementInfo.taxRate || 0) / 100 + '%',
        });

        state.businessAttachments = businessAttachments;
        state.oocRouteInfoList = oocRouteInfoList.map((ele) => {
          return {
            ...ele,
            startName: `${ele.startingCityName}${ele.startingAddress}`,
            endName: `${ele.destinationCityName}${ele.destinationAddress}`,
          };
        });
      };

      onMounted(() => {
        handeGetDetail();
      });

      return {
        ...toRefs(state),
        registerBasic,
        registerBothSides,
        registerDrawnClause,
        registerBillingInfo,
        registerAccessory,
        registerContractRoute,
        TableColumn,
        handlePreview,
      };
    },
  });
</script>
<style lang="less" scoped>
  .contractInfo {
    .route-card {
      margin-top: 1rem;
    }
  }
</style>
