<template>
  <div class="anticon" :class="getAppLogoClass" @click="goHome">
    <img
      :src="companyInfoOEM && companyInfoOEM.icon ? companyInfoOEM.icon : AppLogo"
      :class="['menu-dst-logo', companyInfoOEM && companyInfoOEM.icon ? 'limit' : '']"
    />
  </div>
</template>
<script lang="ts" setup>
import { computed, unref } from 'vue';
import { useGo } from '/@/hooks/web/usePage';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useDesign } from '/@/hooks/web/useDesign';
import { PageEnum } from '/@/assets/enums/pageEnum';
import { useUserStore } from '/@/store/modules/user';
import AppLogo from '/@/assets/images/home/logoo.png';

const props = defineProps({
  /**
   * The theme of the current parent component
   */
  theme: { type: String, validator: (v: string) => ['light', 'dark'].includes(v) },
  /**
   * Whether to show title
   */
  showTitle: { type: Boolean, default: true },
  /**
   * The title is also displayed when the menu is collapsed
   */
  alwaysShowTitle: { type: Boolean },
});

const { prefixCls } = useDesign('app-logo');
const { getCollapsedShowTitle } = useMenuSetting();
const userStore = useUserStore();
const go = useGo();

const getAppLogoClass = computed(() => [
  prefixCls,
  props.theme,
  { 'collapsed-show-title': unref(getCollapsedShowTitle) },
]);

const companyInfoOEM = userStore.getCompanyInfoOEM;

function goHome() {
  go(userStore.getUserInfo.homePath || PageEnum.BASE_HOME);
  console.log(companyInfoOEM);
}
</script>
<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-app-logo';

.@{prefix-cls} {
  display: flex;
  align-items: center;
  padding-left: 7px;
  cursor: pointer;
  transition: all 0.2s ease;
  justify-content: center;
  overflow: hidden;

  &.light {
    border-bottom: 1px solid @border-color-base;
  }

  &.collapsed-show-title {
    padding-left: 20px;
  }

  &.light &__title {
    color: @primary-color;
  }

  &.dark &__title {
    color: @white;
  }

  &__title {
    font-size: 16px;
    font-weight: 700;
    transition: all 0.5s;
    line-height: normal;
  }
}

.menu-dst-logo {
  width: 75%;
  height: auto;
  &.limit{
    max-width: 210px;
  }

}
</style>
