<template>
  <div class="clues-wrap">
    <SearchBar :searchValue="title" @getSearchResult="getSearchResult"></SearchBar>
    <div class="m-clues-list">
      <div class="m-clues-tab-wrap">
        <a
          href="javascript:void(0)"
          class="detail-btn"
          :class="{'shopSctiveC':tabActive==0}"
          @click.stop="shopSctiveZ($event)"
        >综合</a>
        <a
          href="javascript:void(0)"
          class="detail-btn"
          :class="{'shopSctiveC':tabActive==1}"
          @click.stop="shopSctiveC($event)"
        >发布时间<img v-if="iconFlagC == 2" src="../../../static/images/clues/icon-asc.png" alt/><img
          class="icon-down"
          v-else-if="iconFlagC == 1 && tabActive==1"
          src="../../../static/images/clues/icon-asc.png"
          alt
        /><img v-else src="../../../static/images/clues/icon-desc.png" alt/>
        </a>
        <a
          href="javascript:void(0)"
          class="detail-btn"
          :class="{'shopSctiveC':tabActive==2}"
          @click.stop="shopSctiveH($event)"
        >剩余时间<img v-if="iconFlagH == 2" src="../../../static/images/clues/icon-asc.png" alt/><img
          class="icon-down"
          v-else-if="iconFlagH == 1 && tabActive==2"
          src="../../../static/images/clues/icon-asc.png"
          alt
        /><img v-else src="../../../static/images/clues/icon-desc.png" alt/>
        </a>
        <a
          href="javascript:void(0)"
          class="detail-btn"
          :class="{'shopSctiveC':tabActive==3}"
          @click.stop="shopSctiveJ($event)"
        >参与数<img v-if="iconFlagJ == 2" src="../../../static/images/clues/icon-asc.png" alt/><img
          class="icon-down"
          v-else-if="iconFlagJ == 1 && tabActive==3"
          src="../../../static/images/clues/icon-asc.png"
          alt
        /><img v-else src="../../../static/images/clues/icon-desc.png" alt/>
        </a>
        <a
          href="javascript:void(0)"
          class="detail-btn"
          :class="{'shopSctiveC':tabActive==4}"
          @click.stop="shopSctiveG($event)"
        >价格<img v-if="iconFlagG == 2" src="../../../static/images/clues/icon-asc.png" alt/><img
          class="icon-down"
          v-else-if="iconFlagG == 1 && tabActive==4"
          src="../../../static/images/clues/icon-asc.png"
          alt
        /><img v-else src="../../../static/images/clues/icon-desc.png" alt/>
        </a>
        <a href="javascript:void(0)" @click="showFilter=true">筛选</a>
      </div>
      <div class="m-clues-info">
        <listBox
          :refreshLoading.sync="isLoading"
          :listLoading.sync="listLoading"
          :dataArr="dataArr"
          :dataObj="dataObj"
          @load="loadData"
          ref="listBox"
        >
          <CluesProductItem v-for="(item,i) in dataArr" :key="i" :productInfo="item"></CluesProductItem>
        </listBox>
      </div>
    </div>
    <van-popup v-model="showFilter" position="right" :style="{ width: '80%' }">
      <CluesFilter
        @confirm="confirmFilter"
        :clueSeleType="clueSeleType"
        :clueSeleTime="clueSeleTime"
        :clueSeleMoney="clueSeleMoney"
        :clueSeleClass="clueSeleClass"
        @close="closeFilterPop"
      ></CluesFilter>
    </van-popup>
    <upBack></upBack>
  </div>
</template>
<script>
  import {clueShowhead, clueShowlist, clueInquire} from "@/api/clues";
  import upBack from "@/components/service/upBack";
  import listBox from "@/components/service/listBox";
  import SearchBar from "@/components/common/SearchBar";
  import CluesFilter from "@/components/clues/CluesFilter";
  import CluesProductItem from "@/components/common/CluesProductItem";

  const topr = require("@/assets/service/topr.png");
  const topc = require("@/assets/service/topc.png");
  export default {
    name: "clues",
    data() {
      return {
        listLoading: false,
        tabActive: 0,
        isLoading: false,
        title: "",
        error: false,
        dataArr: [],
        dataObj: {},
        showFilter: false,
        page: 1,
        clueSeleClass: "",
        clueSeleMoney: "",
        clueSeleTime: "",
        clueSeleType: "",
        classData: "",
        dataS: "",
        moneyData: "",
        timeData: "",
        typeData: "",
        money: "",
        classd: 0,
        time: "",
        type: 0,
        iconFlagZ: 1,
        iconFlagC: 1,
        iconFlagH: 1,
        iconFlagJ: 1,
        iconFlagG: 1,
        topr,
        topc,
      };
    },
    components: {
      SearchBar,
      CluesFilter,
      CluesProductItem,
      upBack,
      listBox
    },
    methods: {
      async init() {
        const data = await clueShowhead();
        if (!data) return;
        this.clueSeleClass = data.class;
        this.clueSeleMoney = data.money;
        this.clueSeleTime = data.time;
        this.clueSeleType = data.type;
      },
      // 排序
      shopSctiveZ(e) {
        this.tabActive = 0;
        this.iconFlagC = 1;
        this.iconFlagH = 1;
        this.iconFlagJ = 1;
        this.iconFlagG = 1;
        if (this.iconFlagZ == 1) {
          this.iconFlagZ = 2;
          this.dataS = "";
        } else {
          this.iconFlagZ = 1;
          this.dataS = "";
        }
        this.refreshFun();
      },
      shopSctiveC(e, item, index) {
        this.tabActive = 1;
        this.iconFlagZ = 1;
        this.iconFlagH = 1;
        this.iconFlagJ = 1;
        this.iconFlagG = 1;
        if (this.iconFlagC == 1) {
          this.iconFlagC = 2;
          this.dataS = "created_at,asc";
        } else {
          this.iconFlagC = 1;
          this.dataS = "created_at,desc";
        }
        this.refreshFun();
      },

      shopSctiveH(e) {
        this.tabActive = 2;
        this.iconFlagZ = 1;
        this.iconFlagC = 1;
        this.iconFlagJ = 1;
        this.iconFlagG = 1;
        if (this.iconFlagH == 1) {
          this.iconFlagH = 2;
          this.dataS = "end_time,asc";
        } else {
          this.iconFlagH = 1;
          this.dataS = "end_time,desc";
        }
        this.refreshFun();
      },

      shopSctiveJ(e) {
        this.tabActive = 3;
        this.iconFlagZ = 1;
        this.iconFlagC = 1;
        this.iconFlagH = 1;
        this.iconFlagG = 1;
        if (this.iconFlagJ == 1) {
          this.iconFlagJ = 2;
          this.dataS = "pay_number,asc";
        } else {
          this.iconFlagJ = 1;
          this.dataS = "pay_number,desc";
        }
        this.refreshFun();
      },

      shopSctiveG(e) {
        this.tabActive = 4;
        this.iconFlagZ = 1;
        this.iconFlagC = 1;
        this.iconFlagH = 1;
        this.iconFlagJ = 1;
        if (this.iconFlagG == 1) {
          this.iconFlagG = 2;
          this.dataS = "budget_money,asc";
        } else {
          this.iconFlagG = 1;
          this.dataS = "budget_money,desc";
        }
        this.refreshFun();
      },
      getSearchResult(obj) {
        this.title = obj ? obj.keywords : '';
        this.refreshFun();
      },
      refreshFun() {
        if (this.$refs.listBox.nowPage === 1) {
          this.onRefresh();
        } else {
          this.$refs.listBox.nowPage = 1;
        }
      },
      loadData(page) {
        this.getData(page);
      },
      async onRefresh() {
        await this.getData(1);
        this.isLoading = false;
      },
      closeFilterPop() {
        this.showFilter = false;
      },
      confirmFilter(obj) {
        this.classd = obj.classd;
        this.money = obj.money;
        this.time = obj.time;
        this.type = obj.type;
        // this.loadData(1);
        if (this.$refs.listBox.nowPage === 1) {
          this.onRefresh();
        } else {
          this.$refs.listBox.nowPage = 1;
        }
      },
      async getData(page) {
        if (
          !this.$route.query.keywords &&
          this.classd == 0 &&
          this.time == "" &&
          this.money == "" &&
          this.type == 0 &&
          this.dataS == ""
        ) {
          this.listLoading = true;
          const data = await clueShowlist(page);
          this.listLoading = false;
          if (!data) return;
          this.dataObj = data.list;
          //      this.dataObj = {
          //   current_page: data.list.current_page,
          //   total: data.list.total,
          //   per_page: data.list.per_page
          // };
          this.dataArr =
            page === 1 ? data.list.data : [...this.dataArr, ...data.list.data];
        } else {
          if (this.$route.query.keywords) {
            this.title = this.$route.query.keywords;
          }
          this.listLoading = true;
          var money = this.money;
          var classd = this.classd;
          var time = this.time;
          var type = this.type;
          var dataS = this.dataS;
          var title = this.title;
          const data = await clueInquire(
            money,
            classd,
            time,
            type,
            dataS,
            title,
            page
          );
          this.listLoading = false;
          if (!data) return;
          this.dataObj = data;
          //    this.dataObj = {
          //   current_page: data.current_page,
          //   total: data.total,
          //   per_page: data.per_page
          // };
          this.dataArr = page === 1 ? data.data : [...this.dataArr, ...data.data];
        }
        this.isLoading = false;
      }
    },
    mounted() {
      this.init();
      document.title='凌天众媒网一站式全媒界大型媒体电商平台'
    },
  };
</script>

<style scoped lang="scss">
  .clues-wrap {
    background: #f4f6f8;
    min-height: 100vh;
  }

  .m-clues-list {
    position: relative;
    padding-top: rem(100);

    .shopSctiveC {
      color: $red;
    }

    .m-clues-tab-wrap {
      font-size: rem(24);
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 56px;
      background: #fff;
      border-bottom: 1px solid #eee;

      img {
        width: rem(14);
        height: rem(20);
        margin-left: 4px;
      }

      img.icon-down {
        transform: rotate(180deg);
      }

      a {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      a:last-child {
        &:after {
          content: " ";
          color: #eee;
          display: inline-block;
          vertical-align: middle;
          margin-top: -2px;
          margin-left: 2px;
          width: 18px;
          height: 20px;
          background: url("../../../static/images/clues/icon_tab_list.png") no-repeat left top;
          background-size: rem(18) rem(20);
        }
      }
    }

    .m-clues-info {
      padding-top: 20px;
    }
  }

</style>
