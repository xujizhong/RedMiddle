<template>
  <el-container id="leftNav">
    <el-aside>
      <el-menu
        :default-active="defaultActive"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        :collapse="isCollapse"
        :router="true"
      >
        <el-menu-item index="/user/profile">
          <v-icon name="user"></v-icon>
          <span slot="title">基础信息</span>
        </el-menu-item>
        <el-menu-item index="/user/account">
          <v-icon name="edit"></v-icon>
          <span slot="title">账户密码</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view/>
    </el-main>
  </el-container>
</template>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
#leftNav .el-radio-button__inner {
  border: 0 !important;
}
</style>

<script>
const https = require("../../../https/https");

export default {
  async mounted() {
    //没登录时跳转到注册页面
    const { data } = await https.getSessionData();
    if (!data) {
      this.$router.push("/sign/signup_email");
    }
  },
  data() {
    return {
      isCollapse: false,
      defaultActive: this.$route.path
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>
