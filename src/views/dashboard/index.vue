<template>
  <div class="dashboard-manage p-4">
    <Image :src="homeTitle" class="home-title" :preview="false" />
    <Image :src="homeBg" class="home-bg" :preview="false" />

    <a-modal
      v-model:visible="isShowModal"
      title="选择企业"
      :footer="null"
      :maskClosable="false"
      :closable="false"
      centered
      wrapClassName="dst-choose-company"
      :bodyStyle="{ padding: '24px' }"
    >
      <a-spin :spinning="spinning" tip="Loading...">
        <p
          class="company-item"
          v-for="(item, index) in companyData"
          :key="index"
          :class="[currentIndex === index ? 'active' : '']"
          @click="handleCompany(index)"
          >{{ item.companyName }}</p
        >
      </a-spin>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { Image, Spin } from 'ant-design-vue';
  import homeBg from '/@/assets/images/home/home-bg.png';
  import homeTitle from '/@/assets/images/home/home-title.png';
  import { useUserStore } from '/@/store/modules/user';
  import { usePermissionStoreWithOut } from '/@/store/modules/permission';
  import { Modal } from 'ant-design-vue';
  import { actiongSsoGetCompanyListh, actiongSsoSelectCompany } from '/@/api/sys/user';
  import { ref, onMounted } from 'vue';

  import { usePermission } from '/@/hooks/web/usePermission';

  const AModal = Modal;
  const ASpin = Spin;

  const currentIndex = ref<number | string>(-1);
  const isShowModal = ref<boolean>(false);
  const spinning = ref<boolean>(false);
  const companyData = ref<Array<any>>([]);
  const userStore = useUserStore();
  const { refreshMenu } = usePermission();
  const permissionStore = usePermissionStoreWithOut();

  // 选中企业
  const handleCompany = async (index: number | string) => {
    currentIndex.value = index;
    isShowModal.value = false;
    const { status } = await actiongSsoSelectCompany(companyData.value[index].companyId);

    if (status) {
      sessionStorage.setItem('isMultienterprise', 'false');
      await userStore.getUserPermission();
      userStore.getUserInfoAction();
      await refreshMenu();
      permissionStore.setDynamicAddedRoute(true);
    }
  };

  const getCompanyData = async () => {
    spinning.value = true;
    try {
      const { status, data } = await actiongSsoGetCompanyListh();
      if (status) {
        companyData.value = data;
      }
    } finally {
      spinning.value = false;
    }
  };

  onMounted(async () => {
    isShowModal.value = false;
    companyData.value = [];
    if (sessionStorage.getItem('isMultienterprise') === 'true') {
      await getCompanyData();
      companyData.value.length > 0 && (isShowModal.value = true);
    } else {
      isShowModal.value = false;
    }
  });
</script>

<style lang="less" scoped>
  .dashboard-manage {
    display: flex;
    flex-direction: column;
    align-items: center;

    :deep(.home-title) {
      margin-top: 7rem;
      margin-bottom: 3rem;
    }

    .home-bg {
      width: 63%;
    }
  }

  .company-item {
    padding: 0.7rem;
    background: #f2f2f2;
    width: 60%;
    border-radius: 20px;
    text-align: center;
    margin: 0 auto 1rem;
    cursor: pointer;
    &.active {
      background: @primary-color;
      color: #fff;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
</style>

<style lang="less">
  .dst-choose-company {
    .ant-modal-title {
      text-align: center !important;
      font-weight: 600;
      font-size: 18px;
    }
  }
</style>
