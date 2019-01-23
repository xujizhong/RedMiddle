<template>
  <div>
    <!-- 背景图片 -->
    <router-link :to="`/game/${gameData.englishName}`">
      <div id="titleImage" :style="`background-image:url(${gameData.titleImage})`"></div>
    </router-link>
    <div style="height: 50px;position:relative">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="'/'">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="`/game/${gameData.englishName}`">{{gameData.name}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{replyTable[0] ? replyTable[0].title : '' }}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button
        title="发表回复"
        type="primary"
        icon="el-icon-plus"
        circle
        style="right:10px"
        :class="{'v-center':true}"
        size="mini"
        @click="openDialog()"
      ></el-button>
    </div>
    <el-table :data="replyTable" stripe id="replyTable">
      <el-table-column prop="user" label="发帖人" min-width="25%">
        <template slot-scope="scope">
          <div>{{scope.row.user.name}}</div>
          <div>注册：{{moment(scope.row.user.meta.createAt).format('YYYY-MM-DD')}}</div>
          <img v-if="scope.row.user.avatar" :src="scope.row.user.avatar" class="avatar_reply">
          <img v-else src="../../assets/avatar.png" class="avatar_reply">
        </template>
      </el-table-column>
      <el-table-column prop="content" label="内容" min-width="75%">
        <template slot-scope="scope">
          <div class="replyAt">{{global.postTimeFormat(scope.row.meta.createAt)}}</div>
          <div v-html="scope.row.content"></div>
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
    <!-- 发表回复弹出框 -->
    <el-dialog title="发表回复" :visible.sync="dialogTableVisible">
      <el-alert
        v-if="replyErrMsg"
        :title="replyErrMsg"
        type="error"
        @close="alertClose"
        style="margin-bottom:10px"
      ></el-alert>
      <div class="quill-editor-example">
        <!-- quill-editor -->
        <quill-editor
          ref="myTextEditor"
          :style="{marginTop:'15px'}"
          v-model="reply"
          :options="editorOption"
        ></quill-editor>
        <div class="quill-code">
          <code v-html="contentCode"></code>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendReply()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import https from "../../https/game/https";
import $ from "jquery";

export default {
  mounted() {
    this.postId = this.$route.params.postId; //防止串改postId
    this.englishName = this.$route.params.englishName;

    this.getPostReply();
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
    async sendReply() {
      const postId = this.postId;
      const content = this.reply;
      const gameId = this.gameData._id;

      const postSize = new Blob([content]).size / (1024 * 1024); //post内容mb

      if (postSize > 1) {
        this.replyErrMsg = "发表内容超过1MB啦";
        return;
      }
      if (
        $(content)
          .text()
          .trim().length < 8
      ) {
        this.replyErrMsg = "发表内容字符长度不能小于8";
        return;
      }
      const res = await https.sendNewReply({
        postId,
        gameId,
        content
      });

      if (res.status == 200) {
        this.$message({
          message: "发表成功！",
          type: "success"
        });
        this.getPostReply();
        this.dialogTableVisible = false;
        this.reply = "";
        this.replyErrMsg = "";
      }
    },
    async getPostReply() {
      const res = await https.getPostReply({
        englishName: this.englishName,
        postId: this.postId,
        skip: (this.page.skip - 1) * this.page.limit,
        limit: this.page.limit
      });
      if (res.status == 200) {
        this.page.total = res.data.count;
        this.gameData = res.data.res[0];
        if (this.page.skip == 1) {
          this.replyTable = res.data.res[1].concat(res.data.res[2]);
        } else {
          this.replyTable = res.data.res[2];
        }
      }
    },
    alertClose() {
      this.replyErrMsg = "";
    },
    handleSizeChange(val) {
      this.page.limit = val;
      this.getPostReply();
    },
    handleCurrentChange(val) {
      this.page.skip = val;
      this.getPostReply();
    }
  },
  data() {
    return {
      postId: "",
      englishName: "",
      replyTable: [],
      gameData: {},
      reply: "",
      replyErrMsg: "",
      dialogTableVisible: false,
      page: {
        total: 0,
        skip: 1,
        limit: 20
      },
      editorOption: {
        modules: {
          toolbar: {
            container: [
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
            ],
            handlers: {
              image() {
                var range = this.quill.getSelection();
                var value = prompt("请输入图片链接");
                this.quill.insertEmbed(
                  range.index,
                  "image",
                  value
                  // Quill.sources.USER
                );
              }
            }
          }
        }
      }
    };
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
#replyTable >>> td {
  vertical-align: top;
}
#replyTable >>> tr td:first-child .cell div:first-child {
  font-size: 20px;
}
#replyTable >>> tr td:first-child .cell div:first-child + div {
  font-size: 8px;
  color: #a2a2a2;
}
#replyTable >>> img {
  max-width: 100%;
  max-height: 400px;
}
.replyAt {
  text-align: right;
  color: #a2a2a2;
}
</style>

