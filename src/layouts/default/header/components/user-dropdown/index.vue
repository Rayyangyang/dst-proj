<template>
  <Dropdown placement="bottomLeft" :overlayClassName="`${prefixCls}-dropdown-overlay`">
    <span :class="[prefixCls, `${prefixCls}--${theme}`]" class="flex">
      <!-- <img :class="`${prefixCls}__header`" :src="getUserInfo.avatar" /> -->
      <span :class="`${prefixCls}__info hidden md:block`">
        <span :class="`${prefixCls}__name  `" class="truncate">
          {{ getUserInfo.realName }}
          <BasicArrow :expand="true" bottom />
        </span>
      </span>
    </span>

    <template #overlay>
      <Menu>
        <MenuItem>
          <div class="flexColumn items-center justify-center">
            <img :src="loginAvatar" alt="" class="user-avatar" />
            <div class="overflowHidden">
              <span v-if="getUserInfo.realName" class="user-name">{{ getUserInfo.realName }}</span>
              <span v-if="getUserInfo.position" class="user-position">{{
                getUserInfo.position
              }}</span>
            </div>
            <div v-if="getUserInfo.companyName" class="company-name">{{
              getUserInfo.companyName
            }}</div>
          </div>
        </MenuItem>

        <MenuDivider />

        <MenuItem v-if="hasPermission(PersonMangeEnum.Person_Page)">
          <span class="flex items-center" @click.stop="handleMenuClick('personal')">
            <span>个人信息</span>
          </span>
        </MenuItem>

        <MenuDivider />

        <MenuItem>
          <span class="flex items-center" @click.stop="handleMenuClick('export')">
            <span>导出记录</span>
          </span>
        </MenuItem>

        <MenuDivider />

        <MenuItem>
          <span class="flex items-center" @click.stop="handleMenuClick('logout')">
            <span>退出登录</span>
          </span>
        </MenuItem>
      </Menu>
    </template>
  </Dropdown>
</template>
<script lang="ts">
  import { useRouter } from 'vue-router';

  // components
  import { Dropdown, Menu } from 'ant-design-vue';

  import { defineComponent, computed } from 'vue';

  import { useUserStore } from '/@/store/modules/user';
  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useDesign } from '/@/hooks/web/useDesign';

  import { propTypes } from '/@/utils/propTypes';
  import { BasicArrow } from '/@/components/Basic/index';

  import loginAvatar from '/@/assets/images/login/avatar.png';
  import { orderManageEnum } from '/@/assets/permission/orderManage';
  import { PersonMangeEnum } from '/@/assets/permission/settings';
  import { usePermission } from '/@/hooks/web/usePermission';

  type MenuEvent = 'logout' | 'personal' | 'export';

  export default defineComponent({
    name: 'UserDropdown',
    components: {
      Dropdown,
      Menu,
      BasicArrow,
      MenuItem: Menu.Item,
      MenuDivider: Menu.Divider,
    },
    props: {
      theme: propTypes.oneOf(['dark', 'light']),
    },
    setup() {
      const { prefixCls } = useDesign('header-user-dropdown');
      const { getShowDoc, getUseLockPage } = useHeaderSetting();
      const userStore = useUserStore();
      const { hasPermission } = usePermission();
      const { push } = useRouter();

      const getUserInfo = computed(() => {
        const {
          accountName: realName,
          avatar,
          desc,
          position,
          companyName,
        } = userStore.getUserInfo || {};
        return { realName, avatar: avatar, desc, position, companyName };
      });

      //  login out
      function handleLoginOut() {
        userStore.confirmLoginOut();
      }

      function hanleToPersonal() {
        push('/settings/personal');
      }

      function hanleToExport() {
        push('/orderManage/orderList/export');
      }

      function handleMenuClick(e: MenuEvent) {
        switch (e) {
          case 'logout':
            handleLoginOut();
            break;
          case 'export':
            hanleToExport();
            break;
          case 'personal':
            hanleToPersonal();
            break;
        }
      }

      return {
        prefixCls,
        getUserInfo,
        handleMenuClick,
        getShowDoc,
        getUseLockPage,
        loginAvatar,
        usePermission,
        orderManageEnum,
        PersonMangeEnum,
        hasPermission,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-user-dropdown';

  .@{prefix-cls} {
    height: @header-height;
    padding: 0 0 0 10px;
    padding-right: 10px;
    overflow: hidden;
    font-size: 12px;
    cursor: pointer;
    align-items: center;

    img {
      width: 24px;
      height: 24px;
      margin-right: 12px;
    }

    &__header {
      border-radius: 50%;
    }

    &__name {
      font-size: 14px;
    }

    &--dark {
      &:hover {
        background-color: @header-dark-bg-hover-color;
      }
    }

    &--light {
      &:hover {
        background-color: @header-light-bg-hover-color;
      }

      .@{prefix-cls}__name {
        color: @text-color-base;
      }

      .@{prefix-cls}__desc {
        color: @header-light-desc-color;
      }
    }

    &-dropdown-overlay {
      .ant-dropdown-menu-item {
        min-width: 160px;
      }
    }

    .justify-center {
      justify-content: center;
    }
  }

  .user-avatar {
    height: 65px;
    width: 65px;
    border-radius: 50%;
  }
  .user-name {
    color: #333333;
    font-weight: 600;
  }

  .user-position {
    color: #878787;
    margin-left: 0.5rem;
  }

  .company-name {
    color: #878787;
  }

  .flexColumn {
    display: flex;
    flex-direction: column;
  }

  .overflowHidden {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
