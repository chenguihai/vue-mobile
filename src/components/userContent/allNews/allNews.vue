<template>
  <div class="allNews">
    <header>
      <div @click="histroyClick()">
        <img src="@/assets/arrowhead/zuo_nob.png" alt />
      </div>
      <h2>消息</h2>
      <!-- <MenuSlide @close="closeMenu" v-if="showMenu"></MenuSlide> -->
      <!-- <div class="dian" @click="onClickRight">
        <div></div>
        <div></div>
        <div></div>
      </div>-->
      <div class="dian" @click="readAllClick">
        <span>全部已读</span>
        <img src="../../../assets/arrowhead/readNews.png" alt />
      </div>
    </header>
    <div class="allNewsList">
      <ul>
        <li @click="dealNews">
          <div>
            <img src="../../../assets/icon/jiaoyutongzhi1.png" alt />
            <span class="newsCont" v-if="countT>0">{{countT}}</span>
            <span>交易消息</span>
          </div>
          <!-- <div>
            <img src="@/assets/arrowhead/zuo_arrow.png" alt />
          </div>-->
        </li>
        <li @click="systemNews">
          <div>
            <img src="../../../assets/icon/xitongtongzhi2.png" alt />
            <span class="newsCont" v-if="countS>0">{{countS}}</span>
            <span>系统消息</span>
          </div>
          <!-- <div>
            <img src="@/assets/arrowhead/zuo_arrow.png" alt />
          </div>-->
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { bodyColor } from "@/utils/mixins";
// import MenuSlide from "@/components/common/MenuSlide";
import { msgcountT, msgcountS ,msgupdate } from "@/api/list";

export default {
  mixins: [bodyColor("fff")],
  components: {
    // MenuSlide
  },
  data() {
    return {
      // showMenu: false,
      countT: "",
      countS: "",
      type: ""
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      // 交易消息
      msgcountT()
        .then(res => {
          this.countT = res.count;
        })
        .catch(err => {
          console.log(err);
        });
      // 系统消息
      msgcountS()
        .then(res => {
          this.countS = res.count;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 返回首页
    histroyClick() {
      this.$router.go(-1);
    },
    // onClickRight() {
    //   this.showMenu = true;
    // },
    // closeMenu() {
    //   this.showMenu = false;
    // },
    // 交易消息
    dealNews() {
      this.$router.push({
        path: "/userContent/homePage/allNewsData",
        query: { type: "T" }
      });
    },
    // 系统消息
    systemNews() {
      this.$router.push({
        path: "/userContent/homePage/allNewsData",
        query: { type: "S" }
      });
    },
    // 全部设为已读
    readAllClick() {
      this.newsR();
   
    },
    newsR() {
      msgupdate()
        .then(res => {
             this.init();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/css/common.scss";
@import "./allNewsScode";
</style>