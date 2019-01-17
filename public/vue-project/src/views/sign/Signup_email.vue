<template>
  <div>
    <el-form
      id="signupForm"
      :model="signupForm"
      ref="signupForm"
      label-width
      label-position="top"
      @keyup.enter.native="signup_email('signupForm')"
      :rules="rules"
    >注册
      <el-alert v-if="signupErrMsg" :title="signupErrMsg" type="error" @close="alertCloseErr"></el-alert>
      <el-alert v-if="signupSucMsg" :title="signupSucMsg" type="success" @close="alertCloseSuc"></el-alert>

      <el-form-item label="用户名" prop="name" class="is-required">
        <el-input type="text" v-model="signupForm.name"></el-input>
      </el-form-item>
      <el-form-item
        label="邮箱"
        prop="email"
        :rules="[
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]"
      >
        <el-input v-model="signupForm.email"></el-input>
      </el-form-item>

      <el-form-item
        label="密码"
        prop="password"
        :rules="[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 7,  message: '长度在至少7个字符', trigger: 'blur' }
        ]"
      >
        <el-input type="password" v-model="signupForm.password" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button size="medium" type="primary" @click="signup_email('signupForm')">注册</el-button>
      </el-form-item>已有账号？
      <router-link to="/sign/login">登录</router-link>
    </el-form>
  </div>
</template>

<script>
const https = require("../../https/https");

export default {
  mounted() {},
  methods: {
    signup_email(formName) {
      //校验表单
      this.$refs[formName].validate(async valid => {
        if (valid) {
          //提交注册
          const res = await https.signup_email(
            this.signupForm.name.trim(),
            this.signupForm.password,
            this.signupForm.email
          );

          if (res.data.code == 200) {
            this.signupSucMsg = res.data.msg;
          } else {
            this.signupErrMsg = res.data.msg;
          }
        }
      });
    },
    alertCloseErr() {
      this.signupErrMsg = "";
    },
    alertCloseSuc() {
      this.signupSucMsg = "";
    }
  },
  data() {
    const validateName = (rule, value, callback) => {
      //用户名验证 4-20位长度 no _ or . at the beginning  no __ or _. or ._ or .. inside allowed characters no _ or . at the end
      const nameReg = /^(?=.{4,20}$)(?!.*[_.]{2})[a-zA-Z0-9._]+$/;
      if (value == "") {
        callback(new Error("请输入用户名"));
      } else if (!nameReg.test(value)) {
        callback(new Error("用户名为长度4-20,只能为英文，数字，_.的组合"));
      } else {
        callback();
      }
    };
    return {
      signupForm: {
        name: "",
        email: "",
        password: ""
      },
      signupErrMsg: "",
      signupSucMsg: "",
      rules: { name: [{ validator: validateName, trigger: "blur" }] }
    };
  },
  name: "signup"
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

