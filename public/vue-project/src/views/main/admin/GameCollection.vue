<template>
  <div>
    <!-- 游戏集合列表 -->
    <div style="height: 50px;">
      <h2 style="margin:0;float:left">游戏集合管理</h2>
      <el-button type="primary" icon="el-icon-plus" circle style="float:right" @click="addRow()"></el-button>
    </div>
    <el-table :data="tableData" stripe style="width: 100%" height="calc(100vh - 200px)">
      <el-table-column prop="name" label="名称" width="180"></el-table-column>
      <el-table-column prop="englishName" label="英文名称" width="180"></el-table-column>
      <el-table-column prop="type" label="类别" width="180" :formatter="formatType"></el-table-column>
      <el-table-column prop="image" label="图片" width="180">
        <template slot-scope="scope">
          <img :src="scope.row.image" style="width:120px">
        </template>
      </el-table-column>
      <el-table-column prop="titleImage" label="标题图片" width="180">
        <template slot-scope="scope">
          <img :src="scope.row.titleImage" style="width:120px">
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="180"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click.native.prevent="editRow(scope.$index, tableData)">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button type="text" @click.native.prevent="deleteRow(scope.$index, tableData)">
            <i class="el-icon-delete"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="dialogVisible">
      <el-form ref="editForm" :model="chooseData" label-width="80px">
        <el-form-item
          label="名称"
          prop="name"
          :rules="[
                { required: true, message: '请输入名称', trigger: 'blur' },
                ]"
        >
          <el-input type="text" v-model="chooseData.name"></el-input>
        </el-form-item>
        <el-form-item
          label="英文名称"
          prop="englishName"
          :rules="[
                { required: true, message: '请输入英文名称', trigger: 'blur' },
                ]"
        >
          <el-input type="text" v-model="chooseData.englishName"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="chooseData.type" placeholder="请选择游戏类型">
            <el-option
              v-for="item in gameType"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片">
          <div class="avatar-uploader" @click="uploadGameCollectionImage(0)">
            <img v-if="chooseData.image" :src="chooseData.image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </div>
          <input
            type="file"
            id="gameCollectionImage"
            ref="gameCollectionImage"
            @change="changeImage(0)"
          >
        </el-form-item>
        <el-form-item label="标题图片">
          <div class="avatar-uploader" @click="uploadGameCollectionImage(1)">
            <img v-if="chooseData.titleImage" :src="chooseData.titleImage" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </div>
          <input
            type="file"
            id="gameCollectionTitleImage"
            ref="gameCollectionTitleImage"
            @change="changeImage(1)"
          >
        </el-form-item>
        <el-form-item
          label="排序"
          prop="sort"
          :rules="[
                { required: true, message: '请输入排序', trigger: 'blur' },
                ]"
        >
          <el-input type="number" v-model="chooseData.sort"></el-input>
        </el-form-item>
        <el-form-item style="text-align:right">
          <el-button type="primary" @click="saveRow('editForm')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
const https = require("../../../https/admin/gameCollection/https");
const httpsGameType = require("../../../https/admin/gameType/https");
export default {
  async mounted() {
    this.queryData();

    const res = await httpsGameType.queryGameType();
    this.gameType = res.data;
  },
  data() {
    return {
      dialogVisible: false,
      chooseData: {},
      tableData: [],
      gameType: []
    };
  },
  methods: {
    addRow() {
      this.chooseData = {};
      this.dialogVisible = true;
    },
    deleteRow(index, data) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await https.deleteGameCollection(data[index]);

          if (res.data.code == 200) {
            this.queryData();
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.dialogVisible = false;
          } else {
            this.$message({
              message: "删除失败",
              type: "danger"
            });
          }
        })
        .catch(_ => {});
    },
    editRow(index, data) {
      this.chooseData = _.cloneDeep(data[index]);
      this.dialogVisible = true;
    },
    saveRow(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const res = await https.editGameCollection(this.chooseData);
          
          if (res.data.code == 200) {
            this.queryData();
            this.$message({
              message: "保存成功",
              type: "success"
            });
            this.dialogVisible = false;
          } else {
            this.$message({
              message: "保存失败",
              type: "danger"
            });
          }
        }
      });
    },
    async queryData() {
      const res = await https.queryGameCollection();
      this.tableData = res.data;
    },
    formatType(row, column, cellValue, index) {
      const type = this._.find(this.gameType, { _id: cellValue }) || {};
      return type.name;
    },
    uploadGameCollectionImage(i) {
      if (!i) {
        this.$refs.gameCollectionImage.click();
      } else {
        this.$refs.gameCollectionTitleImage.click();
      }
    },
    changeImage(i) {
      var imgFile;
      if (!i) {
        imgFile = this.$refs.gameCollectionImage.files[0];
      } else {
        imgFile = this.$refs.gameCollectionTitleImage.files[0];
      }

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
        this.$set(this.chooseData, `${!i ? "image" : "titleImage"}`, fr.result);
      };

      fr.readAsDataURL(imgFile);
    }
  }
};
</script>

<style>
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
.el-select {
  width: 100% !important;
}
</style>

<style scoped>
.el-icon-delete {
  color: #f56c6c;
}
#gameCollectionImage {
  display: none;
}
#gameCollectionTitleImage {
  display: none;
}
</style>


