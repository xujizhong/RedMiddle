<template>
  <el-form
    id="profileForm"
    :model="profileForm"
    ref="profileForm"
    label-width
    label-position="top"
    :rules="rules"
  >
    <el-col :xs="24" :sm="12">
      <el-alert v-if="profileErrMsg" :title="profileErrMsg" type="error" @close="alertCloseErr"></el-alert>
      <el-alert v-if="profileSucMsg" :title="profileSucMsg" type="success" @close="alertCloseSuc"></el-alert>

      <el-form-item label="用户名" prop="name" class="is-required">
        <el-input type="text" v-model="profileForm.name"></el-input>
      </el-form-item>
    </el-col>
    <el-col :xs="24">
      <el-form-item label="头像">
        <div class="avatar-uploader" @click="uploadAvatar()">
          <img v-if="profileForm.avatar" :src="profileForm.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </div>
        <input type="file" id="avatar" ref="avatar" @change="changeImage()">
      </el-form-item>
    </el-col>

    <el-col :xs="24">
      <el-button type="primary" @click="profileSave('profileForm')">保存</el-button>
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
      this.profileForm.name = res.data.name;
      this.profileForm.avatar = res.data.avatar;
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
      profileErrMsg: "",
      profileSucMsg: "",
      profileForm: {
        name: "",
        avatar: ""
      },
      rules: { name: [{ validator: validateName, trigger: "blur" }] }
    };
  },
  methods: {
    alertCloseErr() {
      this.profileErrMsg = "";
    },
    alertCloseSuc() {
      this.profileSucMsg = "";
    },
    async profileSave(formName) {
      //校验表单
      this.$refs[formName].validate(async valid => {
        if (valid) {
          //提交保存
          const name = this.profileForm.name;
          const avatar = this.profileForm.avatar;
          const res = await userHttps.updateProfile({ name, avatar });

          if (res.status == 200 && res.data.code == 200) {
            this.$message({
              message: "保存成功",
              type: "success",
              onClose: _ => {
                this.$router.go(0);
              }
            });
          } else {
            this.profileErrMsg = res.data.msg;
          }
        }
      });
    },
    uploadAvatar() {
      this.$refs.avatar.click();
    },
    changeImage() {
      var imgFile = this.$refs.avatar.files[0];

      if (!imgFile) return;

      if (imgFile.type.indexOf("image") < 0 || imgFile.size > 1024 * 1024) {
        this.$message({
          message: "请上传图片文件并小于1MB",
          type: "danger"
        });
        return;
      }
      var fr = new FileReader();
      fr.onload = () => {
        this.$set(this.profileForm, "avatar", fr.result);
      };

      fr.readAsDataURL(imgFile);
    }
  }
};
</script>
<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px;
  border-style: dashed;
  border-radius: 5px;
  border-color: #dcdfe6;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
#avatar {
  display: none;
}
</style>


