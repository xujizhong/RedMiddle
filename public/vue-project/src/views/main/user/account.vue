<template>
  <el-form id="accountForm" :model="accountForm" ref="accountForm" label-width label-position="top">
    <el-col :xs="24" :sm="12">
      <el-alert v-if="accountErrMsg" :title="accountErrMsg" type="error" @close="alertCloseErr"></el-alert>
      <el-alert v-if="accountSucMsg" :title="accountSucMsg" type="success" @close="alertCloseSuc"></el-alert>

      <el-form-item label="邮箱账户" prop="email">
        <el-input type="text" v-model="accountForm.email" disabled></el-input>
      </el-form-item>
      <el-form-item
        label="旧密码"
        prop="old_password"
        :rules="[
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { min: 7,  message: '长度在至少7个字符', trigger: 'blur' }
        ]"
      >
        <el-input type="password" v-model="accountForm.old_password"></el-input>
      </el-form-item>
      <el-form-item
        label="新密码"
        prop="new_password"
        :rules="[
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 7,  message: '长度在至少7个字符', trigger: 'blur' }
        ]"
      >
        <el-input type="password" v-model="accountForm.new_password"></el-input>
      </el-form-item>
    </el-col>

    <el-col :xs="24">
      <el-button type="primary" @click="accountSave('accountForm')">保存</el-button>
    </el-col>
  </el-form>
</template>
<script>
import https from "../../../https/https";
import userHttps from "../../../https/user/https";

export default {
  async mounted() {
    const res = await https.getSessionData();
    if (res.status == 200) {
      this.accountForm.email = res.data.email;
    }
  },
  data() {
    return {
      accountErrMsg: "",
      accountSucMsg: "",
      accountForm: {
        email: "",
        old_password: "",
        new_password: ""
      }
    };
  },
  methods: {
    accountSave(formName) {
      //校验表单
      this.$refs[formName].validate(async valid => {
        if (valid) {
          //提交保存
          const old_password = this.accountForm.old_password;
          const new_password = this.accountForm.new_password;

          const res = await userHttps.updateAccount({
            new_password,
            old_password
          });
          if (res.status == 200 && res.data.code == 200) {
            this.$message({
              message: "保存成功",
              type: "success",
              onClose: _ => {
                this.$router.go(0);
              }
            });
          } else {
            this.accountErrMsg = res.data.msg;
          }
        }
      });
    }
  }
};
</script>
