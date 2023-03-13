<template>
  <div class="company-detail-manage">
    <PageWrapper title="企业已认证">
      <Description :data="companyInfo" @register="registerCompany" class="mt-4">
        <template #businessLicense>
          <a-image
            v-if="companyInfo.businessLicenseUrl"
            :src="companyInfo.businessLicenseUrl"
            alt=""
            class="identity-img"
          />
        </template>

        <template #logo>
          <a-image
            v-if="companyInfo.companyLogo"
            :src="companyInfo.companyLogo"
            alt=""
            class="identity-img"
          />
        </template>

        <template #province>
          <span v-if="companyInfo.provinceName">{{ companyInfo.provinceName }}</span>
          <span v-if="companyInfo.cityName">{{ companyInfo.cityName }}</span>
          <span v-if="companyInfo.areaName">{{ companyInfo.areaName }}</span>
        </template>

        <template #businessDeadline>
          {{ companyInfo?.businessLongEffective === 1 ? '长期' : companyInfo?.businessDeadline }}
        </template>
      </Description>

      <Description :data="companyLegalInfo" @register="registerLegalPerson" class="mt-4">
        <template #portraitFace>
          <a-image
            v-if="companyLegalInfo.portraitFaceUrl"
            :src="companyLegalInfo.portraitFaceUrl"
            alt=""
            class="identity-img"
          />
        </template>

        <template #emblemFace>
          <a-image
            v-if="companyLegalInfo.emblemFaceUrl"
            :src="companyLegalInfo.emblemFaceUrl"
            alt=""
            class="identity-img"
          />
        </template>

        <template #identityValidityEndTime>
          {{
            companyLegalInfo?.identityValidityPerpetual
              ? '长期'
              : companyLegalInfo?.identityValidityEndTime
          }}
        </template>
      </Description>
    </PageWrapper>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, toRefs, reactive } from 'vue';
  import { Description, useDescription } from '/@/components/Description/index';
  import { PageWrapper } from '/@/components/Page';
  import { useUserStore } from '/@/store/modules/user';
  import { actionsCompanyFind } from '/@/api/settings/company';
  import { Image } from 'ant-design-vue';

  import { schemaCompany, schemaLegalPerson } from './data';

  interface State {
    companyInfo: any;
    companyLegalInfo: any;
  }

  export default defineComponent({
    components: {
      Description,
      PageWrapper,
      [Image.name]: Image,
    },
    setup() {
      const state: State = reactive({
        companyInfo: {},
        companyLegalInfo: {},
      });

      const userStore = useUserStore();

      const [registerCompany] = useDescription({
        title: '企业信息',
        bordered: false,
        schema: schemaCompany(),
        column: 2,
      });

      const [registerLegalPerson] = useDescription({
        title: '法人信息',
        bordered: false,
        schema: schemaLegalPerson(),
        column: 2,
      });

      // 获取详情
      const getDetail = async () => {
        if (!userStore.userInfo?.companyId) {
          return;
        }

        const { status, data } = await actionsCompanyFind({
          companyId: userStore.userInfo.companyId,
        });

        if (status) {
          state.companyInfo = data.companyInfo;
          state.companyLegalInfo = data.companyLegalInfo;
        }
      };

      onMounted(async () => {
        await getDetail();
      });

      return {
        ...toRefs(state),
        registerCompany,
        registerLegalPerson,
      };
    },
  });
</script>

<style lang="less" scoped>
  .company-detail-manage {
    :deep(.ant-page-header-heading-title) {
      color: @primary-color;
    }

    :deep(.identity-img) {
      max-width: 200px;
    }
  }
</style>
