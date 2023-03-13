<template>
  <div class="contractInfo">
    <PageWrapper>
      <Description :data="orderBaseInfo" @register="registerBasic" class="mt-4" />

      <Description :data="orderAddress" @register="registerAddress" class="mt-4" />

      <Description title="货物信息" class="mt-4" :isReactive="false">
        <template #action>共计 {{ orderCargoList?.length }} 条</template>
        <template #custom-content>
          <Table :columns="TableColumn" :data-source="orderCargoList" :pagination="false">
            <template #summary>
              <SummaryRow>
                <SummaryCell> 合计 </SummaryCell>
                <SummaryCell> {{ null }}</SummaryCell>
                <SummaryCell> {{ totals.totalCargoNum }}</SummaryCell>
                <SummaryCell> {{ totals.totalCargoWeight }}</SummaryCell>
                <SummaryCell> {{ totals.totalCargoVolume }}</SummaryCell>
                <SummaryCell> {{ totals.totalCargoMoney }}</SummaryCell>
                <SummaryCell> {{ totals.totalCargoTaxMoney }}</SummaryCell>
                <SummaryCell> {{ totals.totalCargoNotTaxMoney }}</SummaryCell>
                <SummaryCell> {{ totals.totalTaxMoney }}</SummaryCell>
              </SummaryRow>
            </template>
          </Table>
        </template>
      </Description>

      <Description :data="orderOther" @register="registerExtra" class="mt-4">
        <template #customReceipt>
          <p v-if="orderOther.invoiceFlag == 1">发货单&nbsp;</p>
          <p v-if="orderOther.consignmentFlag == 1">货物托运单&nbsp;</p>
          <p v-if="orderOther.receiptFlag == 1">签收单&nbsp;</p>
        </template>
      </Description>

      <Description :data="orderLogistic" @register="registerLogistic" class="mt-4" />
    </PageWrapper>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, toRefs, reactive, computed } from 'vue';
  import { Description, useDescription } from '/@/components/Description/index';
  import { useRoute } from 'vue-router';
  import { Table, Card } from 'ant-design-vue';
  import { getOrderInfoApi } from '/@/api/orderManage/orderManage';
  import { PageWrapper } from '/@/components/Page';
  import { schemaBasic, schemaAddress, schemaExtra, schemaLogistic, TableColumn } from './data';
  import { toNumber } from 'lodash-es';

  interface State {
    orderOther: any;

    orderCargoList: any[];
    orderBaseInfo: any;
    orderAddress: any;
    orderLogistic: any;
  }

  export default defineComponent({
    name: 'ContractInfo',
    components: {
      PageWrapper,
      Description,
      Table,
      SummaryCell: Table.Summary.Cell,
      SummaryRow: Table.Summary.Row,
      [Card.name]: Card,
    },
    setup() {
      let route = useRoute();
      let state: State = reactive({
        orderOther: null,

        orderCargoList: [],
        orderBaseInfo: null,
        orderAddress: null,
        orderLogistic: null,
      });

      const [registerBasic] = useDescription({
        title: '基本信息',
        bordered: false,
        schema: schemaBasic(),
        column: 2,
      });

      const [registerAddress] = useDescription({
        title: '地址信息',
        bordered: false,
        schema: schemaAddress(),
        column: 2,
      });

      const [registerExtra] = useDescription({
        title: '额外需求',
        bordered: false,
        schema: schemaExtra(),
        column: 2,
      });

      const [registerLogistic] = useDescription({
        title: '配送/安装信息',
        bordered: false,
        schema: schemaLogistic(),
        column: 2,
      });

      // 获取详情
      const handeGetDetail = async () => {
        const {
          orderOther,
          orderCode,
          orderCargoList,
          orderBaseInfo,
          orderAddress,
          orderLogistic,
        } = await getOrderInfoApi(route.query?.orderId);
        state.orderOther = orderOther;

        state.orderCargoList = orderCargoList;
        state.orderBaseInfo = Object.assign(orderBaseInfo, {
          orderCode: orderCode,
        });
        state.orderAddress = orderAddress;
        state.orderLogistic = orderLogistic;
      };

      const totals = computed(() => {
        let totalCargoWeight = 0;
        let totalCargoNum = 0;
        let totalCargoVolume = 0;
        let totalCargoMoney = 0;
        let totalCargoTaxMoney = 0;
        let totalCargoNotTaxMoney = 0;
        let totalTaxMoney = 0;
        state.orderCargoList?.forEach(
          ({
            cargoWeight,
            cargoNum,
            cargoVolume,
            cargoMoney,
            cargoTaxMoney,
            cargoNotTaxMoney,
            taxMoney,
          }) => {
            totalCargoWeight += cargoWeight ? toNumber(cargoWeight) : 0;
            totalCargoNum += cargoNum ? toNumber(cargoNum) : 0;
            totalCargoVolume += cargoVolume ? toNumber(cargoVolume) : 0;
            totalCargoMoney += cargoMoney ? toNumber(cargoMoney) : 0;
            totalCargoTaxMoney += cargoNotTaxMoney ? toNumber(cargoTaxMoney) : 0;
            totalCargoNotTaxMoney += cargoNotTaxMoney ? toNumber(cargoNotTaxMoney) : 0;
            totalTaxMoney += taxMoney ? toNumber(taxMoney) : 0;
          },
        );
        return {
          totalCargoWeight,
          totalCargoNum,
          totalCargoVolume,
          totalCargoMoney,
          totalCargoTaxMoney,
          totalCargoNotTaxMoney,
          totalTaxMoney,
        };
      });

      onMounted(() => {
        handeGetDetail();
      });

      return {
        ...toRefs(state),
        registerBasic,
        registerAddress,
        registerExtra,
        registerLogistic,

        TableColumn,
        totals,
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
