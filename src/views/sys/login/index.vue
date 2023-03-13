<template>
  <div class="relative w-full h-full login-manage">
    <header>
      <img :src="loginLogo" class="login-logo" />
    </header>

    <main>
      <div class="left">
        <img :src="loginAvatar" class="avatar" />
        <img :src="loginTip" class="login-tip" />
      </div>
      <div class="right">
        <LoginForm />
        <ForgetPasswordForm />
      </div>
    </main>
  </div>
</template>
<script lang="ts" setup>
  import loginLogo from '/@/assets/images/login/logo.png';
  import loginAvatar from '/@/assets/images/login/avatar.png';
  import loginTip from '/@/assets/images/login/login-tip.png';

  import LoginForm from './components/loginForm.vue';
  import ForgetPasswordForm from './components/forgetPasswordForm.vue';

  defineProps({
    sessionTimeout: {
      type: Boolean,
    },
  });
</script>
<style lang="less">
  .login-manage {
    background-image: url(/@/assets/images/login/bg-cover.png);
    background-position: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    header {
      padding: 42px 44px;

      .login-logo {
        width: 190px;
        height: 37px;
      }
    }

    main {
      height: 340px;
      display: flex;
      justify-content: center;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;

      .left {
        background-image: url(/@/assets/images/login/bg.png);
        background-position: 100%;
        background-repeat: no-repeat;
        background-size: 100%;
        width: 287px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .avatar {
          height: 80px;
          width: 80px;
          margin-bottom: 23px;
        }

        .login-tip {
          width: 229px;
          height: 52px;
        }
      }

      .right {
        width: 511px;
        background: #fff;
        padding: 42px 105px;
        box-sizing: border-box;
      }
    }
  }
</style>
