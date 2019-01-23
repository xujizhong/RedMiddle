<template>
  <div>
    <el-container>
      <el-header>
        <el-menu
          :default-active="defaultActive"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          menu-trigger="click"
        >
          <el-menu-item index="/">
            <img class="navLogo" src="../../assets/logo_text.png">
          </el-menu-item>
          <!-- <el-menu-item index="/about">关于</el-menu-item> -->
          <el-menu-item v-if="_.isEmpty($store.state.user)" index="/sign/signup_email" class="fr">注册</el-menu-item>
          <el-menu-item v-if="_.isEmpty($store.state.user)" index="/sign/login" class="fr">登录</el-menu-item>
          <el-submenu v-if="!_.isEmpty($store.state.user)" index :style="{float:'right'}">
            <template slot="title">
              <img
                v-if="$store.state.user.avatar"
                :src="$store.state.user.avatar"
                class="avatar_nav"
              >
              <img v-else src="../../assets/avatar.png" class="avatar_nav">
            </template>
            <el-menu-item index="/admin">
              <v-icon name="monitor"></v-icon>管理
            </el-menu-item>
            <el-menu-item index="/user/profile">
              <v-icon name="settings"></v-icon>设置
            </el-menu-item>
            <el-menu-item index="logout">
              <v-icon name="log-out"></v-icon>退出
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
      <el-footer>copyright © RedMiddle
        <a href="http://www.miitbeian.gov.cn/" rel="nofollow">辽ICP备18015473号</a>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
const https = require("../../https/https");

export default {
  created() {
    this.setUser();
  },
  methods: {
    async setUser() {
      const { data } = await https.getSessionData();
      this.$store.commit("setUser", data || {}); //将user放入vuex
    },
    async logout() {
      const res = await https.logout();
      if (res.status != 200) return;
      this.$router.push("/sign/signup_email"); //退出登录后跳转到注册页面
      this.$store.commit("clearUser");
    },
    handleSelect(key) {
      if (key == "logout") this.logout();
      else if (key) {
        this.$router.push(key);
      }
    }
  },
  data() {
    return {
      defaultActive: this.$route.path
    };
  },
  name: "layer"
};
</script>
<script type="text/javascript">
var cnzz_protocol =
  "https:" == document.location.protocol ? "https://" : "http://";
document.write(
  unescape(
    "%3Cspan id='cnzz_stat_icon_1276056134'%3E%3C/span%3E%3Cscript src='" +
      cnzz_protocol +
      "s23.cnzz.com/z_stat.php%3Fid%3D1276056134%26show%3Dpic' type='text/javascript'%3E%3C/script%3E"
  )
);
</script>
<style scoped>
.navLogo {
  width: 178px;
}
</style>


