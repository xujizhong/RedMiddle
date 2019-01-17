<template>
  <div>
    <el-form
      id="loginForm"
      :model="loginForm"
      ref="loginForm"
      label-width
      label-position="top"
       @keyup.enter.native="login('loginForm')"
    >登录
      <el-alert v-if="loginErrMsg" :title="loginErrMsg" type="error" @close="alertClose"></el-alert>
      <el-form-item
        label="用户名/邮箱"
        prop="name"
        :rules="[
          { required: true, message: '请输入用户名/邮箱', trigger: 'blur' },
        ]"
      >
        <el-input type="text" v-model="loginForm.name"></el-input>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
        :rules="[
          { required: true, message: '请输入密码', trigger: 'blur' },
        ]"
      >
        <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="verification_code"  class="is-required">
        <el-input v-model="loginForm.verification_code" autocomplete="off"></el-input>
      </el-form-item>
      <div v-html="loginForm.captcha" @click="getCaptcha"></div>
      <el-form-item>
        <el-button size="medium" type="primary" @click="login('loginForm')">登录</el-button>
      </el-form-item>没有账号？
      <router-link to="/sign/signup_email">注册</router-link>
    </el-form>
  </div>
</template>

<script>
const https = require("../../https/https");

export default {
  mounted() {
    this.getCaptcha();
  },
  methods: {
    async login(formName) {
      //校验验证码
      if (
        this.loginForm.verification_code.toLowerCase() !==
        this.loginForm.captcha_value
      ) {
        this.loginErrMsg = "验证码错误";
        this.getCaptcha();
        return;
      }

      //校验表单
      this.$refs[formName].validate(async valid => {
        if (valid) {
          //登录
          const name = this.loginForm.name;
          const password = this.loginForm.password;
          const res = await https.login({ name, password });

          if (res.data.code == 200) {
            this.$router.push({ path: "/" }); //登录成功后跳转到首页
            this.$store.commit("setUser", res.data.user || {}); //将user放入vuex
          } else {
            this.loginErrMsg = res.data.msg;
          }
        }
      });
    },
    async getCaptcha() {
      const captcha = await https.getCaptcha();
      this.loginForm.captcha = captcha.data.data;
      this.loginForm.captcha_value = captcha.data.text;
    },
    alertClose(){
      this.loginErrMsg = "";
    }
  },
  data() {
    return {
      loginForm: {
        name: "",
        password: "",
        verification_code: "",
        captcha: "",
        captcha_value: ""
      },
      loginErrMsg: ""
    };
  },
  name: "login"
};
</script>

<style scoped>
form {
  margin: 0 auto;
}
.el-form--label-top >>> .el-form-item__label {
  float: left;
  padding: 0;
}
.el-form-item {
  margin-bottom: 10px !important;
}
.el-button--medium {
  width: 100%;
  margin-top: 20px;
}

</style>