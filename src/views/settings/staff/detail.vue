<template>
  <div class="staff-detail-manage">
    <PageWrapper ref="wrapEl">
      <header>
        <a-row justify="space-between">
          <a-col :span="12" class="flexRow user-info">
            <a-image :src="DefaultAvatar" class="user-info-left avatar" />

            <div class="user-info-right">
              <div class="user-info">
                <span class="name mr-4" v-if="companyInfo && companyInfo.accountName">{{
                  companyInfo.accountName
                }}</span>
                <a-tag
                  class="status"
                  v-if="companyInfo && companyInfo.positionStatus == 1"
                  color="processing"
                >
                  在职</a-tag
                >
                <a-tag class="status" v-else> 离职</a-tag>
              </div>

              <div class="mobile" v-if="companyInfo && companyInfo.phone"
                >登录手机号：{{ companyInfo.phone }}</div
              >
            </div>
          </a-col>
        </a-row>
      </header>

      <Description
        title="基本信息"
        :bordered="false"
        :column="2"
        :data="companyInfo"
        :schema="basicSchema"
        class="mb-4"
      />

      <Description
        title="身份信息"
        :bordered="false"
        :column="2"
        :data="companyInfo"
        :schema="identitySchema"
        class="mb-4"
      >
        <template #identityFront>
          <a-image
            v-if="companyInfo && companyInfo.portraitFaceUrl"
            :src="companyInfo.portraitFaceUrl"
            alt="身份证正面"
            class="identity-img"
          />
        </template>

        <template #identityBack>
          <a-image
            v-if="companyInfo && companyInfo.emblemFaceUrl"
            :src="companyInfo.emblemFaceUrl"
            alt="身份证反面"
            class="identity-img"
          />
        </template>
      </Description>

      <Description
        title="权限信息"
        :bordered="false"
        :column="2"
        :data="companyInfo"
        :schema="permissionSchema"
      />
    </PageWrapper>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, toRefs, reactive, ref } from 'vue';
  import { Description } from '/@/components/Description/index';
  import { PageWrapper } from '/@/components/Page';
  import { Divider, Row, Col, Image, Tag } from 'ant-design-vue';
  import { useRoute } from 'vue-router';

  import { basicSchema, identitySchema, permissionSchema } from './data/detail';
  import DefaultAvatar from '/@/assets/images/login/avatar.png';
  import { actionGetOocUserInfo } from '/@/api/settings/staff';
  import { useLoading } from '/@/components/Loading';

  interface State {
    currentId: string | number;
    companyInfo: any;
  }

  export default defineComponent({
    name: 'StaffDetailManage',
    components: {
      Description,
      PageWrapper,
      [Divider.name]: Divider,
      [Row.name]: Row,
      [Col.name]: Col,
      [Image.name]: Image,
      [Tag.name]: Tag,
    },
    setup() {
      const route = useRoute();
      const wrapEl = ref<ElRef>(null);

      const state: State = reactive({
        currentId: '',
        companyInfo: null,
      });

      const [openWrapLoading, closeWrapLoading] = useLoading({
        target: wrapEl,
        props: {
          tip: '加载中...',
          absolute: true,
        },
      });

      // 获取详情信息
      const handleQueryDetail = async () => {
        state.currentId = (route as any)?.query?.id;
        state.companyInfo = null;
        if (state.currentId) {
          openWrapLoading();

          const { status, data } = await actionGetOocUserInfo({
            accountId: state.currentId,
          });

          closeWrapLoading();

          if (status) {
            data.emblemFaceUrl = data?.emblemFaceUrl || '';
            data.portraitFaceUrl = data?.portraitFaceUrl || '';
            data.creatorName = data?.creatorName || '';
            data.createTime = data?.createTime || '';

            if (data.hasOwnProperty('sex') && data.sex != null && data.sex !== '') {
              data.sexName = data.sex === 0 ? '男' : data.sex === 1 ? '女' : '';
            } else {
              data.sexName = '';
            }

            state.companyInfo = data;
            console.log('state.companyInfo', state.companyInfo);
          }
        }
      };

      onMounted(() => {
        handleQueryDetail();
      });

      return {
        ...toRefs(state),
        basicSchema,
        identitySchema,
        permissionSchema,
        DefaultAvatar,
        wrapEl,
        openWrapLoading,
        closeWrapLoading,
      };
    },
  });
</script>
<style lang="less" scoped>
  .desc-wrap {
    padding: 16px;
    background-color: @component-background;
  }

  header {
    :deep(.ant-row) {
      margin-bottom: 1rem;
      background-color: #fff;

      padding: 1rem;
    }

    .user-info {
      display: flex;
      :deep(.avatar) {
        width: 98px;
        border-radius: 50%;
        margin-right: 12px;
      }

      &-right {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
      }
    }

    .user-operate {
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
    }
  }

  :deep(.identity-img) {
    max-width: 120px;
  }
</style>
