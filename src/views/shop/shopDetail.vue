<template>
  <div class="detail_wrap" v-if="storeInfo!=null">
    <shop-Head></shop-Head>
    <!--头部-->
    <div class="detail" v-if="storeInfo">
      <div class="shop_info clearFix">
        <van-image
          fit="cover"
          v-if="storeInfo.logo"
          class="logo"
          :src="storeInfo.logo+'?x-oss-process=image/resize,m_fill,h_130,w_130'"
          :noOss="false"
          :lazy-load="true"
        ></van-image>
        <img v-else class="logo" src="@/assets/default/shop.png" alt="默认头像" />
        <h4 class="name">{{storeInfo.store_name}}</h4>
        <lvInfo :oblig="storeInfo" type="bond"></lvInfo>
        <div class="add_box">
          <address class="addr">
            <span class="addr_icon"></span>
            <span>{{storeInfo.name}}</span>
          </address>
          <div class="share" @click="sharePage">
            <img src="@/assets/service/share.png" alt />
            <span>分享</span>
          </div>
        </div>
      </div>
      <ul class="shop_evaluate">
        <li class="item">
          <span class="num">{{storeInfo.sales_amount}}</span>
          <span class="txt">店铺销量</span>
        </li>
        <li class="item">
          <span class="num">{{storeInfo.praise_rate}}%</span>
          <span class="txt">好评率</span>
        </li>
        <li class="item">
          <span class="num">{{storeInfo.threeMonthAmount}}</span>
          <span class="txt">近三月收入</span>
        </li>
        <li class="item">
          <span class="num">{{storeInfo.score}}</span>
          <span class="txt">综合评分</span>
        </li>
      </ul>
    </div>
    <van-sticky>
      <div class="detail_box" ref="opcHeader">
        <img
          :style="navScrollStyle"
          class="gray"
          src="@/assets/shop/arrow_left_gray.png"
          alt="返回箭头"
        />
        <ul class="detail_nav">
          <li class="item" @click="clickNav(1)">
            <span class="text">首页</span>
            <i :class="['line',{active:selectType ===1}]"></i>
          </li>
          <li class="item" @click="clickNav(2)">
            <span class="text">店铺档案</span>
            <i :class="['line',{active:selectType ===2}]"></i>
          </li>
          <li class="item" @click="clickNav(3)">
            <span class="text">客户示例</span>
            <i :class="['line',{active:selectType ===3}]"></i>
          </li>
          <li class="item" @click="clickNav(4)">
            <span class="text">交易评价</span>
            <i :class="['line',{active:selectType ===4}]"></i>
          </li>
        </ul>
        <img :style="navScrollStyle" class="gray" src="@/assets/shop/three_point_gray.png" alt="更多" />
      </div>
    </van-sticky>
    <!--首页-->
    <template v-if="selectType ===1">
      <!--滑动导航栏-->
      <slide-cpn :list="claList" :status="nowSelCla" @change="selChange"></slide-cpn>
      <!--排序-->
      <div class="sort">
        <sort-cpn v-model="sorts" :sort="sorts" :list="sortList"></sort-cpn>
      </div>
      <home-page :sorts="sorts" :claid="nowSelCla"></home-page>
    </template>
    <!--店铺档案-->
    <store-archive v-if="selectType ===2"></store-archive>
    <!--客户示例-->
    <customer-example v-if="selectType ===3"></customer-example>
    <!--    v-if="storeInfo"-->
    <!--交易评价-->
    <transaction-evaluate
      v-if="selectType === 4"
      :score="storeInfo.score"
      :scoreData="storeInfo"
      :scoreDiff="storeInfo.serviceStatistic"
    ></transaction-evaluate>
    <upBack />
  </div>
</template>
<script>
import { EventUtil } from "@/utils/tool";
import { wxShareCommon } from "@/utils/util";
import MenuSlide from "@/components/common/MenuSlide";
import SortCpn from "@/components/SortCpn";
import SlideCpn from "@/components/SlideCpn";
import StoreArchive from "./storeArchive";
import HomePage from "./homePage";
import CustomerExample from "./customerExample";
import TransactionEvaluate from "./transactionEvaluate";
import { getStoreInfo } from "@/api/shop";
import lvInfo from "@/components/service/lvInfo";
import ShopHead from "./components/shopHead";
import upBack from "@/components/service/upBack";

const DESC = "desc";
const ASC = "asc";

export default {
  name: "shopDetail",
  components: {
    ShopHead,
    SortCpn,
    SlideCpn,
    StoreArchive,
    CustomerExample,
    TransactionEvaluate,
    HomePage,
    lvInfo,
    upBack,
    MenuSlide
  },
  data() {
    return {
      storeId: this.$route.params.id,
      storeInfo: null,
      active: 4,
      sorts: {
        order: "default",
        sort: ""
      },
      nowSelCla: undefined,
      claList: [],
      selectType: 1,
      opcHeader: null,
      scrollTop: 0,
      sortList: [
        { name: "综合", order: "default", sort: "" },
        { name: "成交量", order: "sales", sort: DESC },
        { name: "好评率", order: "comments", sort: DESC },
        { name: "价格", order: "price", sort: DESC },
        { name: "最新", order: "new", sort: DESC }
      ]
    };
  },
  // async beforeRouteEnter(to, from, next) {
  //   const {query} = to
  //   if (query.id) {
  //     const data = await getStoreInfo(query.id)
  //     // const claList = await getStoreClaList()
  //     next(vm => {
  //       vm.storeInfo = data
  //       vm.claList = data.shop_category
  //       const {logo, store_name} = data;
  //       let title = store_name + '-我在凌天众媒网看到一个不错的媒体店铺，赶快来看看';
  //       localStorage.setItem('shareItem', JSON.stringify({title, imgUrl: logo}));
  //       console.log(`title=${title},img=${logo}`)
  //       vm.wxShareCommonFun();
  //     })
  //   } else {
  //     next()
  //   }
  // },
  created() {
    document.title = "凌天众媒网一站式全媒界大型媒体电商平台";
    this.getStoreInfoFun();
  },
  mounted() {
    EventUtil.addHandler(window, "scroll", this.scrollEvent, true);
    this.opcHeader = this.$refs.opcHeader;
  },
  beforeDestroy() {
    EventUtil.removeHandler(window, "scroll", this.scrollEvent, true);
  },
  computed: {
    navScrollStyle() {
      return { opacity: this.journey };
    },
    journey() {
      if (this.scrollTop > 200) return 1;
      if (!this.scrollTop < 190) return 0;
      // let diff = 200 - this.scrollTop
      // diff = diff < 0 ? 0 : diff
      // let ratio = (diff / 200).toFixed(2)
      // ratio = ratio <= 0 ? 0 : ratio > 1 ? 1 : ratio
      // return (100 - ratio * 100) / 100
    }
  },
  methods: {
    async getStoreInfoFun() {
      const { id = "" } = this.$route.params;
      if (id) {
        const data = await getStoreInfo(id);
        if (!data) return this.$router.push({path:"/closeData", query: { type: 2 }});

        this.storeInfo = data;
        this.claList = data.shop_category;
        const { logo, store_name } = data;
        wxShareCommon(
          store_name,
          logo,
          "我在凌天众媒网看到一个不错的媒体店铺，赶快来看看"
        );
        document.title = store_name;
      }
    },
    clickNav(index) {
      this.selectType = index;
    },
    histroyClick() {
      // 返回
      this.$router.go(-1);
    },
    selChange(idx) {
      this.nowSelCla = idx;
    },
    scrollEvent() {
      this.scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
    },
    sharePage() {
      if (this.storeInfo.logo == "" && this.storeInfo.logo == null) {
        var img =
          "https://ltzm1.oss-cn-shenzhen.aliyuncs.com/" + this.storeInfo.logo;
      } else {
        var img = "https://m.zhongmei66.com/static/bitbug_favicon.ico";
      }

      let obj = {
        title: this.storeInfo.store_name,
        link: window.location.href, // 网址，默认使用window.location.href
        desc: "我在凌天众媒网看到一个不错的媒体店铺，赶快来看看",
        imgUrl: img,
        infoMap: {
          title: this.storeInfo.store_name,
          desc: "我在凌天众媒网看到一个不错的媒体店铺，赶快来看看",
          link: window.location.href,
          imgUrl: img
        },
        fnDoShare: function(type) {
          console.log(1);
        }
      };
      Mshare.popup(obj);
    }
  }
};
</script>

<style scoped lang="scss">
.detail_wrap {
  height: 100vh;
  background: $white;
}

.detail {
  font-weight: 400;
  color: $white;
  /*background: linear-gradient(*/
  /*    180deg,*/
  /*    rgba(126, 126, 126, 0.94) 0%,*/
  /*    rgba(0, 0, 0, 0.93) 100%*/
  /*);*/
  background: url("/static/images/store/detail_bg.png") no-repeat center;
  background-size: cover;
}

.shop_info {
  padding: $w_30;
  padding-top: 98px;

  .logo {
    float: left;
    width: 130px;
    height: 130px;
    margin-right: $w_20;
  }

  .name {
    height: 33px;
    font-size: 24px;
    line-height: 33px;
  }

  .level {
    display: flex;
    align-items: center;
    height: 34px;
    margin: 16px 0;

    span {
      display: inline-block;
      height: 28px;
      line-height: 28px;
      font-size: 20px;
      font-weight: 500;
    }
  }
  .add_box {
    display: flex;
  }
  .addr {
    display: flex;
    align-items: center;
    height: 28px;
    font-size: 20px;
    margin-bottom: 16px;
    margin-top: 18px;

    .addr_icon {
      width: 20px;
      height: 25px;
      background: url("/static/images/address_white.png") no-repeat center;
      background-size: 20px 25px;
      margin-right: 10px;
    }
  }
  .share {
    height: 28px;
    font-size: 20px;
    margin-bottom: 16px;
    margin-top: 18px;
    font-weight: 400;
    color: #fff;
    // line-height: 45px;
    text-align: center;
    margin-left: 40px;
    display: flex;
    align-items: center;
    img {
      @include square(26);
    }
    span {
      margin-left: 10px;
    }
  }
}

.shop_evaluate {
  display: flex;
  justify-content: space-around;
  padding-bottom: $w_30;

  .item {
    flex: 1;
    text-align: center;

    .num {
      display: block;
      height: 37px;
      font-size: 26px;
      line-height: 37px;
    }

    .txt {
      display: block;
      height: 30px;
      line-height: 30px;
      font-size: 22px;
      color: $c_ccc;
      margin-top: 6px;
    }

    &:not(:last-child) {
      border-right: 1px solid $c_ccc;
    }
  }
}

.detail_box {
  display: flex;
  align-items: center;
  padding: 20px 10px;
  background-color: $white;
  height: 94px;
  box-sizing: border-box;

  .gray {
    /*display: none;*/
    width: 50px;
    height: 50px;
  }
}

.detail_nav {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 54px;
  /*height: 94px;*/
  margin: 0 20px;

  .item {
    /*flex: 1;*/
    font-size: 28px;
    color: $c_333;

    .text {
      height: 40px;
      line-height: 40px;
      display: block;
      /*position: relative;*/
      margin-bottom: 10px;
      text-align: center;
    }

    .line {
      display: block;
      height: 4px;
      width: 100%;
      background-color: $white;

      &.active {
        background-color: $red;
      }
    }
  }
}

.sort {
  @include flex;
  padding-left: $w_20;
  height: 73px;
  background: #fff;
}
</style>
