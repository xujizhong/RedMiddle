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
                <el-menu-item index="/admin">
                    <i class="el-icon-menu"></i>
                    <span slot="title">游戏集合管理</span>
                </el-menu-item>
                <el-menu-item index="/admin/gameType">
                    <i class="el-icon-setting"></i>
                    <span slot="title">游戏分类管理</span>
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
export default {
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
