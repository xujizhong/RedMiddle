<template>
  <div>
    <!-- 游戏类型列表 -->
    <div style="height: 50px;">
      <h2 style="margin:0;float:left">游戏类型管理</h2>
      <el-button type="primary" icon="el-icon-plus" circle style="float:right" @click="addRow()"></el-button>
    </div>
    <el-table :data="tableData" stripe style="width: 100%" height="calc(100vh - 200px)">
      <el-table-column prop="name" label="名称" width="180"></el-table-column>
      <el-table-column prop="sort" label="排序" width="180"></el-table-column>
      <el-table-column label="操作">
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
const https = require("../../../https/admin/gameType/https");
export default {
  mounted() {
    this.queryData();
  },
  data() {
    return {
      tableHeight: window.innerHeight - 200,
      dialogVisible: false,
      chooseData: {},
      tableData: []
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
          const res = await https.deleteGameType(data[index]);

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
          const res = await https.editGameType(this.chooseData);
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
      const res = await https.queryGameType();
      this.tableData = res.data;
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
</style>

