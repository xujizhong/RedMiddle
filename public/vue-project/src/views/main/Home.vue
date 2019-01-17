<template>
  <div class="home">
    <el-row :gutter="0">
      <div class="gameTypeTitle">{{chooseGameType.name || '全部游戏'}}</div>
      <el-col
        :xs="8"
        :sm="3"
        :md="2"
        :lg="2"
        :xl="1"
        :body-style="{ padding: '0px' }"
        v-for="item in gameType"
        :key="item._id"
        class="hidden-xs-only"
      >
        <el-button size="mini" @click="chooseType(item._id,item.name)">{{item.name}}</el-button>
      </el-col>
      <div style="clear:both"></div>
    </el-row>
    <el-row :gutter="20">
      <el-col
        :xs="8"
        :sm="6"
        :md="4"
        :lg="3"
        :xl="2"
        :style="{ marginBottom: '20px'}"
        v-for="game in gameCollection"
        :key="game._id"
        v-show="toggleGame(game.type)"
      >
        <el-card :body-style="{ padding: '0px',cursor:'pointer' }" shadow="hover">
          <router-link :to="'/game/'+game.englishName">
            <img :src="game.image" class="image">
            <div style="padding: 14px;text-align:center;font-size: 14px;">
              <span>{{game.name}}</span>
            </div>
          </router-link>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const axios = require("axios");

export default {
  async mounted() {
    axios
      .all([
        axios.post(this.$store.state.api + "/admin/queryGameCollection"),
        axios.post(this.$store.state.api + "/admin/queryGameType")
      ])
      .then(
        axios.spread((httpsGameCollection, httpsGameType) => {
          this.gameCollection = httpsGameCollection.data;

          httpsGameType.data.unshift({ name: "全部游戏", _id: "" });
          this.gameType = httpsGameType.data;
        })
      );
  },
  data() {
    return {
      gameType: [],
      gameCollection: [],
      chooseGameType: { name: "", _id: "" }
    };
  },
  methods: {
    chooseType(typeId, typeName) {
      this.chooseGameType.name = typeName;
      this.chooseGameType._id = typeId;
    },
    toggleGame(type) {
      const chooseGameType = this.chooseGameType;
      return !chooseGameType._id || type === chooseGameType._id;
    }
  },
  name: "home"
};
</script>

<style scoped>
.image {
  width: 100%;
  height: 150px;
}
.el-row::after {
  display: inline-block;
}
.gameTypeTitle {
  display: inline;
  line-height: 25px;
  float: left;
  margin: 0 41px 0 9px;
  border-left: 10px solid #7f0000;
  padding-left: 14px;
  font-size: 35px;
}
a {
  color: black;
}
</style>

