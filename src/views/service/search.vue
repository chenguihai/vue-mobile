<template>
  <div class="ser-search" @click="showSel = false">
    <van-nav-bar class="search-bar">
      <template slot="title">
        <div class="search-box">
          <div class="left-sel" @click.stop="showSel = true">
            <span>{{nowSel}}</span>
            <van-icon name="arrow-down" color="#666" size="0.186rem" />
            <ul class="sel-down" v-if="showSel">
              <li class="sel-items" @click.stop="nowSelChange(1)">
                <img src="@/assets/service/search2.png" class="sel-icon" />
                <span>服务</span>
              </li>
              <li class="sel-items" @click.stop="nowSelChange(3)">
                <img src="@/assets/service/search1.png" class="sel-icon" />
                <span>线索</span>
              </li>
              <li class="sel-items" @click.stop="nowSelChange(2)">
                <img src="@/assets/service/search3.png" class="sel-icon" />
                <span>店铺</span>
              </li>
            </ul>
          </div>
          <form @submit.prevent="formSubmit(null)" action="javascript:return true">
            <div class="search-inp-box">
              <input
                type="search"
                class="search-inp"
                v-model.trim="search"
                placeholder
                autocomplete="off"
                maxlength="30"
              />
              <van-icon
                class="clear"
                name="clear"
                color="#ccc"
                size="0.33rem"
                v-if="search !== ''"
                @click="search=''"
              />
            </div>
          </form>
        </div>
        <div class="cancel" @click="$router.back()">取消</div>
      </template>
    </van-nav-bar>
    <!-- 历史排列 -->
    <div class="searchData" v-if="seaFlag">
      <ul>
        <li v-for="(item,index) in searchData" :key="index" @click="seaClick(item,index)">
          <div>
            <span>{{item.text}}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="search-his" v-else>
      <h1 class="his-title">大家都在搜</h1>
      <ul class="his-box">
        <li
          class="his-item"
          v-for="(item,i) in hotWorkData"
          :key="i"
          @click="jumHand(item)"
        >{{item.keyword}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { bodyColor } from "@/utils/mixins";
import { hotWordList, searchSuggest } from "@/api/service";
const selMap = new Map([
  [1, "服务"],
  [3, "线索"],
  [2, "店铺"]
]);
export default {
  name: "serviceSearch",
  mixins: [bodyColor("fff box100")],
  data() {
    const { keywords = "", type = 1 } = this.$route.query;
    return {
      search: keywords,
      selNum: +type,
      showSel: false,
      hotWorkData: [],
      searchData: [],
      seaFlag: false
    };
  },
  computed: {
    nowSel() {
      return selMap.get(this.selNum);
    }
  },
  mounted() {
    this.getHotword(1);
  },
  methods: {
    //搜索热词列表
    async getHotword(type) {
      let res = await hotWordList(type);
      if (res) {
        this.hotWorkData = res;
      } else {
        return;
      }
    },
    nowSelChange(val) {
      this.selNum = val;
      this.showSel = false;
      this.getHotword(val);
    },
    jumHand(row) {
      if (row.is_show == 1) {
        this.search == row.keyword;
      } else if (row.is_show == 0 && row.link) {
        window.open(row.m_link);
      }
    },
    formSubmit(keyword) {
      if (keyword) {
        this.search = keyword;
      }
      if (this.search === "") return this.$toast("请输入关键词");
      let path = "/";
      switch (this.selNum) {
        case 3:
          path = "/clues";
          break;
        case 2:
          path = "/shopList";
          break;
        default:
          path = "/serviceList";
      }

      this.$router.replace({ path, query: { keywords: this.search } });
    },
    async changeList() {
      this.searchData = [];
      if (this.selNum == 1) {
        var type = "service";
      } else if (this.selNum == 3) {
        var type = "clue";
      } else {
        var type = "store";
      }
      var keyword = this.search;
      var num = 15;
      if (keyword != "") {
        let dataSea = await searchSuggest(type, keyword, num);
        if (!dataSea) return;
        this.searchData = dataSea.data;
        console.log(this.searchData);
        // if(dataSea.data.code != 200) return this.$message.error(data.message)
        // this.searchData = dataSea.data.data.data
      }
    },
    seaClick(item, index) {
      this.search = item.text;
      this.seaFlag = false;
       let path = "/";
      switch (this.selNum) {
        case 3:
          path = "/clues";
          break;
        case 2:
          path = "/shopList";
          break;
        default:
          path = "/serviceList";
      }

      this.$router.replace({ path, query: { keywords: this.search } });
    }
  },
  watch: {
    search(newVal) {
       this.searchData = []
      if (newVal) {
        this.changeList();
        this.seaFlag = true;
      } else {
        this.seaFlag = false;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.ser-search {
  height: 100%;

  /*=============================================
=            搜索栏            =
=============================================*/
  .search-box {
    width: 100%;
    height: 58px;
    background: #f4f6f8;
    @include round(100px);
    @include flex;
    font-size: 26px;
    font-family: $font;
    font-weight: 400;
    color: #666;
    .left-sel {
      width: 97px;
      height: 100%;
      @include flex;
      span {
        margin-right: 10px;
        margin-left: 20px;
      }
      position: relative;
      .sel-down {
        @include borderBox;
        padding: 0 15px;
        color: #fff;
        background: rgba(0, 0, 0, 0.8);
        top: 90px;
        position: absolute;
        @include round(10px);
        &::after {
          position: absolute;
          content: " ";
          margin: auto;
          left: 0;
          right: 0;
          top: -12px;
          width: 0;
          height: 0;
          border-left-width: 10px;
          border-bottom-width: 14px;
          border-right-width: 10px;
          border-top-width: 0;
          border-style: solid;
          border-left-color: transparent;
          border-right-color: transparent;
          border-bottom-color: rgba(0, 0, 0, 0.8);
          border-top-color: transparent;
        }
        .sel-items {
          @include borderBox;
          padding: 20px 25px;
          border-bottom: 1px solid #eee;
          width: 150px;
          &:last-child {
            border: none;
          }
          @include flex;
          font-size: 26px;
          font-family: $font;
          font-weight: 400;
          line-height: 1;
          .sel-icon {
            @include square(28);
          }
        }
      }
    }
    form {
      flex: 1;
      height: 100%;
    }
    .search-inp-box {
      width: 100%;
      @include borderBox;
      @include flex;
      overflow: hidden;
      height: 100%;
      background: #f4f6f8;
      @include round(0px 100px 100px 0px);
      .clear {
        margin-right: 22px;
      }
      .search-inp {
        flex: 1;
        @include borderBox;
        padding: 10px 20px;
        height: 100%;
        background: #f4f6f8;
        color: #333;
        line-height: 38px;
      }
    }
  }
  /deep/ .van-nav-bar__title {
    max-width: 10rem;
    width: 100%;
    padding: rem(20);
    @include flex(center);
    &.van-ellipsis {
      overflow: visible;
    }
  }
  .search-bar {
    height: 88px;
    @include flex;
    .cancel {
      font-size: 26px;
      font-family: $font;
      font-weight: 400;
      color: #333;
      margin-left: 20px;
    }
  }

  /*=====  End of 搜索栏  ======*/
  .searchData {
    height: 100%;
    background: #f4f6f8;

    & > ul {
      display: flex;
      flex-direction: column;
      padding-left: rem(32);
      background: #fff;
      & > li {
        & > div {
          border-bottom: 1px solid #eee;
          & > span {
            font-size: rem(26);
            display: block;
            color: #666;
            padding: rem(31) 0 rem(23);
          }
        }
      }
    }
  }
  /*=============================================
  =            搜索历史            =
  =============================================*/
  .search-his {
    @include borderBox;
    padding: 30px;
    font-family: $font;
    .his-title {
      font-size: 26px;
      font-weight: 400;
      color: #333;
    }
    .his-box {
      // @include flex;
      // flex-wrap: wrap;
      display: flex;
      justify-content: end;
      flex-wrap: wrap;
      .his-item {
        @include borderBox;
        @include round(6px);
        padding: 7px 20px;
        background: #f4f6f8;
        margin-top: 20px;
        margin-right: 30px;
        font-size: 26px;
        font-weight: 400;
        color: #666;
        line-height: 37px;
      }
    }
  }

  /*=====  End of 搜索历史  ======*/
}
</style>
