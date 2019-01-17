<template>
  <div>
    <!-- 背景图片 -->
    <router-link :to="`/game/${$route.params.englishName}`">
      <div id="titleImage" :style="`background-image:url(${singleGameDetail.titleImage})`"></div>
    </router-link>
    <!-- 标题 -->
    <div style="height: 50px;position:relative">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="'/'">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{singleGameDetail.name}}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button
        title="发表新帖"
        type="primary"
        icon="el-icon-plus"
        circle
        style="right:10px"
        :class="{'v-center':true}"
        size="mini"
        @click="openDialog()"
      ></el-button>
    </div>
    <!-- 表格主体 -->
    <el-table :data="postTable" style="width: 100%" stripe id="postTable">
      <el-table-column prop="replyCount" label="回复" min-width="10%"></el-table-column>
      <el-table-column prop="title" label="标题" min-width="60%">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click.native.prevent="$router.push(`/post/${$route.params.englishName}/${scope.row._id}`)"
          >{{scope.row.title}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="发帖人" min-width="15%" align="center">
        <template slot-scope="scope">
          <p>{{scope.row.user.name}}</p>
          <p>{{global.postTimeFormat(scope.row.meta.createAt)}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="最后回复" min-width="15%" align="center">
        <template slot-scope="scope">
          <p>{{(scope.row.lastReplyUser ? scope.row.lastReplyUser.name : "") || scope.row.user.name}}</p>
          <p>{{global.postTimeFormat(scope.row.lastReplyAt)}}</p>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :current-page.sync="page.skip"
      :page-size="page.limit"
      :page-sizes="[20, 30, 50, 100]"
      layout="sizes, prev, pager, next, jumper"
      :total="page.total"
    ></el-pagination>
    <!-- 发表新帖弹出框 -->
    <el-dialog title="发表新帖" :visible.sync="dialogTableVisible">
      <el-form id="post" :model="post" ref="post" label-width label-position="top">
        <el-alert
          v-if="postErrMsg"
          :title="postErrMsg"
          type="error"
          @close="alertClose"
          style="margin-bottom:10px"
        ></el-alert>
        <el-form-item
          prop="title"
          :rules="[
          { required: true, message: '请输入标题', trigger: 'blur' },
          { max: 25, message: '长度最长25个字符', trigger: 'blur' }
        ]"
        >
          <el-input placeholder="请输入标题" v-model="post.title"></el-input>
        </el-form-item>
        <div class="quill-editor-example">
          <!-- quill-editor -->
          <quill-editor
            ref="myTextEditor"
            :style="{marginTop:'15px'}"
            v-model="post.content"
            :options="editorOption"
          ></quill-editor>
          <div class="quill-code">
            <code v-html="contentCode"></code>
          </div>
        </div>
        <el-form-item class="model-footer">
          <el-button @click="dialogTableVisible = false">取 消</el-button>
          <el-button type="primary" @click="sendPost('post')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import https from "../../https/game/https";
import $ from 'jquery';

export default {
  async mounted() {
    const res = await https.getSingleGameData(this.$route.params.englishName);
    if (res.status === 200) {
      this.singleGameDetail = res.data;
      this.getSingleGamePosts();
    }
  },
  data() {
    return {
      singleGameDetail: {},
      postTable: [],
      dialogTableVisible: false,
      postErrMsg: "",
      page: {
        total: 0,
        skip: 1,
        limit: 20
      },
      post: {
        title: "",
        content: ""
      },
      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ["clean"],
            ["link", "image", "video"]
          ]
        }
      }
    };
  },
  methods: {
    openDialog() {
      //没有登录跳转到登录页面
      const user = this.$store.state.user._id;
      if (!user) {
        this.$router.push("/sign/login");
        this.$message({
          message: "登陆后可以发言",
          type: "warning"
        });
        return;
      }

      this.dialogTableVisible = true;
    },
    async sendPost(formName) {
      //校验表单
      this.$refs[formName].validate(async valid => {
        if (!valid) return;

        const gameId = this.singleGameDetail._id;
        const title = this.post.title;
        const content = this.post.content;

        const postSize = new Blob([content]).size / (1024 * 1024); //post内容mb

        if (postSize > 1) {
          this.postErrMsg = "发表内容超过1MB啦";
          return;
        }
        if($(content).text().trim().length < 8){
          this.postErrMsg = "发表内容字符长度不能小于8";
          return;
        }
        const res = await https.sendNewPost({
          gameId,
          title,
          content
        });

        if (res.status == 200) {
          this.$message({
            message: "发表成功！",
            type: "success"
          });
          this.getSingleGamePosts();
          this.dialogTableVisible = false;
          this.post.title = "";
          this.post.content = "";
        }
      });
    },
    async getSingleGamePosts() {
      const res = await https.getSingleGamePosts({
        gameId: this.singleGameDetail._id,
        skip: (this.page.skip - 1) * this.page.limit,
        limit: this.page.limit
      });
      if (res.status == 200) {
        this.page.total = res.data.count;
        this.postTable = res.data.res;
      }
    },
    alertClose() {
      this.postErrMsg = "";
    },
    handleSizeChange(val) {
      this.page.limit = val;
      this.getSingleGamePosts();
    },
    handleCurrentChange(val) {
      this.page.skip = val;
      this.getSingleGamePosts();
    }
  },
  computed: {
    editor() {
      return this.$refs.myTextEditor.quill;
    },
    contentCode() {
      // return hljs.highlightAuto(this.content).value;
    }
  }
};
</script>

<style scoped>
.el-table__row p {
  margin: 0;
}
#postTable >>> tr td:first-child .cell {
  font-size: 18px;
  font-weight: bold;
}
</style>


