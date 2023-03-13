<template>
  <div class="personal-manage">
    <PageWrapper>
      <header>
        <a-row justify="space-between">
          <a-col :span="12" class="flexRow user-info">
            <a-image :src="userInfo?.avatar || DefaultAvatar" class="user-info-left avatar" />

            <div class="user-info-right">
              <div class="user-info">
                <span class="name mr-4">{{ userInfo.accountName }}</span>
                <a-tag class="status" v-if="userInfo.positionStatus === 1" color="processing">
                  在职</a-tag
                >
                <a-tag class="status" v-else> 离职</a-tag>
              </div>

              <div class="mobile">手机号：{{ userInfo.phone }}</div>
            </div>
          </a-col>

          <a-col :span="6" class="user-operate">
            <a-button class="mr-4" type="primary" @click="handleOperate(ModifyStateEnum.MOBILE)"
              >修改手机号</a-button
            >
            <a-button @click="handleOperate(ModifyStateEnum.PASSWORD)">修改密码</a-button>
          </a-col>
        </a-row>
      </header>

      <Description :data="basicInfo" @register="registerBasic" class="mt-4" />

      <Description :data="permissionInfo" @register="registerPermission" class="mt-4" />

      <a-modal
        v-model:visible="isShowModal"
        :title="modalTitle"
        :footer="null"
        :bodyStyle="{ padding: 0 }"
      >
        <modify-password @close="isShowModal = false" ref="modifyPassword" />
        <modify-mobile @close="isShowModal = false" ref="modifyMobile" />
      </a-modal>
    </PageWrapper>
  </div>
</template>

<script lang="ts">
  import {
    defineComponent,
    toRefs,
    reactive,
    computed,
    unref,
    ref,
    nextTick,
    onMounted,
    watch,
  } from 'vue';
  import { Card, Row, Col, List, Image, Button, Tag, Modal } from 'ant-design-vue';
  import { useModifyState, ModifyStateEnum } from './config/useModify';
  import ModifyMobile from './components/modifyMobile.vue';
  import ModifyPassword from './components/modifyPassword.vue';
  import { useUserStore } from '/@/store/modules/user';
  import DefaultAvatar from '/@/assets/images/login/avatar.png';
  import { PageWrapper } from '/@/components/Page';
  import { Description, useDescription } from '/@/components/Description/index';
  import { schemaBasic, schemaPermission } from './config/data';

  import { actionGetOocUserInfo } from '/@/api/settings/staff';

  export default defineComponent({
    components: {
      [Button.name]: Button,
      [Tag.name]: Tag,
      [Image.name]: Image,
      [Card.name]: Card,
      [List.name]: List,
      [List.Item.name]: List.Item,
      [Row.name]: Row,
      [Col.name]: Col,
      [Modal.name]: Modal,
      ModifyMobile,
      ModifyPassword,
      PageWrapper,
      Description,
    },
    setup() {
      const { setModifyState, getModifyState } = useModifyState();

      const state = reactive({
        isShowModal: false,
      });

      let userInfo = ref<any>({});
      let basicInfo = ref();
      let permissionInfo = ref();

      const modifyMobile = ref(null);
      const modifyPassword = ref(null);
      const userStore = useUserStore();
      userInfo.value = userStore.userInfo;
      basicInfo.value = userStore.userInfo;

      const [registerBasic] = useDescription({
        title: '基本信息',
        bordered: false,
        schema: schemaBasic(),
        column: 2,
      });

      const [registerPermission] = useDescription({
        title: ' 权限信息',
        bordered: false,
        schema: schemaPermission(),
        column: 2,
      });

      const modalTitle = computed(() =>
        unref(getModifyState) === ModifyStateEnum.PASSWORD ? '修改密码' : '修改手机号',
      );

      const handleOperate = async (type: number) => {
        setModifyState(type as ModifyStateEnum);
        state.isShowModal = true;
        await nextTick();

        type === ModifyStateEnum.MOBILE && (modifyMobile.value as any)?.resetForm();
        type === ModifyStateEnum.PASSWORD && (modifyPassword.value as any)?.resetForm();
      };

      const handleQueryPermissionInfo = async () => {
        if (!userInfo?.value?.accountId) {
          return;
        }
        const { status, data } = await actionGetOocUserInfo({
          accountId: userInfo.value.accountId,
        });

        if (status) {
          permissionInfo.value = data;
          basicInfo.value = Object.assign(basicInfo.value, data);
          userInfo.value = Object.assign(userInfo.value, data);
        }
      };

      onMounted(() => {
        handleQueryPermissionInfo();
      });

      return {
        ...toRefs(state),
        userInfo,
        setModifyState,
        modalTitle,
        handleOperate,
        ModifyStateEnum,
        modifyMobile,
        modifyPassword,
        DefaultAvatar,
        registerBasic,
        registerPermission,
        basicInfo,
        permissionInfo,
      };
    },
  });
</script>
<style lang="less" scoped>
  .personal-manage {
    box-sizing: border-box;
    margin: 16px;

    .flexRow {
      display: flex;
    }

    :deep(.ant-row) {
      padding: 12px;
      box-sizing: border-box;
    }

    header {
      margin-bottom: 1rem;
      background-color: #fff;

      .user-info {
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
  }
</style>
