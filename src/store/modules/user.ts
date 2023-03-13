import type { UserInfo } from '/#/store';
import type { ErrorMessageMode } from '/#/axios';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { RoleEnum } from '/@/assets/enums/roleEnum';
import { PageEnum } from '/@/assets/enums/pageEnum';
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '/@/assets/enums/cacheEnum';
import { getAuthCache, setAuthCache, clearAuthCache } from '/@/utils/auth';
import { GetUserInfoModel, LoginParams } from '/@/api/sys/model/userModel';
import { doLogout, getUserInfo, loginApi, actiongQuerySsoAuth , actiongOemBaseConfigDetail } from '/@/api/sys/user';
import { useMessage } from '/@/hooks/web/useMessage';
import { router } from '/@/router';
import { usePermissionStore } from '/@/store/modules/permission';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import { ResultCodeEnum } from '/@/assets/enums/httpEnum';
import { USER__INFO__PERMISSION } from '/@/assets/enums/cacheEnum';
import { isArray } from '/@/utils/is';
import { h } from 'vue';

interface UserState {
  userInfo: any;
  token?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
  companyInfoOEM: any;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRoleList(): RoleEnum[] {
      return this.roleList.length > 0 ? this.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime;
    },
    getCompanyInfoOEM(): any {
      return this.companyInfoOEM || {};
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },
    resetLastUpdateTime() {
      this.lastUpdateTime = 0;
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
        sysCode?: number;
      },
    ): Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        const data = await loginApi(loginParams, mode);
        const { token } = data;

        // save token
        this.resetLastUpdateTime();
        this.setToken(token);
        await this.getUserPermission();
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    // 获取权限数据
    async getUserPermission() {
      const { status, data, code } = await actiongQuerySsoAuth();

      if (status) {
        const permissionValuesData = (data?.permissions || []).map((item) => item?.permissionValue);
        const permissionStore = usePermissionStore();
        permissionStore.setPermissionValueList(permissionValuesData);
        sessionStorage.setItem('isMultienterprise', 'false');
        this.handleQueryCompanyDetail(data?.companyId);
      } else if (code == ResultCodeEnum.TOKEN_FAIL_COMPANY) {
        sessionStorage.setItem('isMultienterprise', 'true');
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<GetUserInfoModel | null> {
      if (!this.getToken) return null;
      if (sessionStorage.getItem('isMultienterprise') === 'true') {
        this.handleDealCompany();
        return null;
      }
      // get user info
      const userInfo = await this.getUserInfoAction();

      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          routes.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
          permissionStore.setDynamicAddedRoute(true);
        }

        goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME));
      }

      return userInfo;
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      console.log('getUserInfoAction', sessionStorage.getItem('isMultienterprise'));
      if (!this.getToken) return null;
      if (sessionStorage.getItem('isMultienterprise') === 'true') return null;
      const userInfo = await getUserInfo();

      const { roles = [] } = userInfo;
      if (isArray(roles)) {
        const roleList = roles.map((item) => item.value) as RoleEnum[];
        this.setRoleList(roleList);
      } else {
        userInfo.roles = [];
        this.setRoleList([]);
      }

      this.setUserInfo(userInfo);
      return userInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          await doLogout();
        } catch {
          console.log('注销Token失败');
        }
      }
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      // setAuthCache(USER__INFO__PERMISSION, []);
      goLogin && router.push(PageEnum.BASE_LOGIN);
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();

      createConfirm({
        iconType: 'warning',
        title: () => h('span', '温馨提示'),
        content: () => h('span', '是否确认退出系统?'),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },
    /**
     * 处理 多企业情况,直接跳转首页
     */
    async handleDealCompany() {
      const permissionStore = usePermissionStore();
      if (!permissionStore.isDynamicAddedRoute) {
        const routes = await permissionStore.buildRoutesAction();
        routes.forEach((route) => {
          router.addRoute(route as unknown as RouteRecordRaw);
        });
        router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
        permissionStore.setDynamicAddedRoute(true);
      }

      await router.replace(PageEnum.BASE_HOME);
    },
    // 获取企业OEM配置信息
    async handleQueryCompanyDetail(id) {
      const { status, data } = await actiongOemBaseConfigDetail({ id });
      if (status) {
        this.companyInfoOEM = data;
      }
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
