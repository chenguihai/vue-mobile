<template>
  <div class="detail" v-if="detail!=''">
    <opcHeader @mounted="setHeader"></opcHeader>
    <serviceDetailSwiper
      :images="(detail.images && detail.images.length <= 0) ? [{url:detail.img}] : [{url:detail.img}].concat(detail.images)"
      :video="detail.video"
    ></serviceDetailSwiper>
    <!-- 大概信息 -->
    <div class="info-part" id="serviceDetailInfo">
      <div class="top">
        <div class="price">
          <span>￥{{detail.price}}/{{detail.unit_name}}</span>
          <span class="original">¥{{detail.market_price}}</span>
        </div>
        <div class="share" @click="sharePage">
          <img src="@/assets/service/share.png" alt />
          <span>分享</span>
        </div>
      </div>
      <div class="bottom van-multi-ellipsis--l2">
        <p class="new-f-icon">新</p>
        <p>{{detail.name}}</p>
      </div>
    </div>
    <!-- 服务商保证金 -->
    <div class="info-part bzj">
      <p>
        服务商已缴纳保证金
        <span>{{detail.marginsum}}</span>元
      </p>
      <p>承诺交易出问题，保证金赔付</p>
    </div>
    <!-- 选择规格 -->
    <div class="info-part seltype" @click="showSku = true">
      <p>服务规格</p>
      <p>
        请选择规格
        <van-icon name="arrow" size="0.4rem" />
      </p>
    </div>
    <!-- 服务参数 -->
    <div
      class="info-part seltype"
      @click="showInfo = true"
      v-if="detail.normal_attr && detail.normal_attr.length !== 0"
    >
      <p>服务参数</p>
      <p>
        查看服务各种参数值
        <van-icon name="arrow" size="0.4rem" />
      </p>
    </div>
    <!-- 服务评价 -->
    <div
      class="info-part allp"
      @click="$router.push({path:'/commentDetail', query:{sid:sid}})"
      id="serviceDetailComment"
    >
      <div
        class="seltype comment-top"
        :class="{'has-con':comments.data && comments.data.length > 0}"
      >
        <p>服务评价</p>
        <!--        v-if="commentCount.good"-->
        <p>
          {{(commentCount.good+commentCount.middle+commentCount.bad) || 0}}评价
          <span>（好评率{{goodpp}}%）</span>
          <van-icon name="arrow" size="0.4rem" />
        </p>
        <!--
        <p v-else>
          0评价
          <span>（好评率0%）</span>
          <van-icon name="arrow" size="0.4rem"/>
        </p>
        -->
      </div>
      <template v-if="comments.data && comments.data.length > 0">
        <commentCon v-for="item in comments.data" :key="item.id" :comment="item"></commentCon>
        <div class="comment-more">查看全部评价</div>
      </template>
    </div>
    <!-- 店铺信息 -->
    <a
      tag="div"
      :href="'/shopDetail/'+store_id"
      class="info-part allp"
      id="serviceDetailStore"
    >
      <storeInfo :info="storeInfo" :origin="storeOrigin"></storeInfo>
      <div class="comment-more">
        <van-icon name="shop-o" class="more-icon" />
        <span>进入店铺</span>
      </div>
    </a>
    <!-- 店铺精选 -->
    <div class="info-part allp">
      <h3 class="service-title">店铺精选</h3>
      <div class="store-service" v-if="detail.bestServiceList">
        <shop-item
          class="service-items"
          v-for="item in detail.bestServiceList"
          :key="item.id"
          :item="Object.assign(item, {store_id:store_id})"
        ></shop-item>
      </div>
    </div>
    <!-- 服务各块 -->
    <!-- <van-sticky :offset-top="stiky"> -->
    <div class="nav-box" id="serviceDetailCon">
      <p @click="showDetail = 1" :class="{active:showDetail === 1}">服务介绍</p>
      <p @click="showDetail = 2" :class="{active:showDetail === 2}">交易保障</p>
      <p @click="showDetail = 3" :class="{active:showDetail === 3}">案例介绍</p>
      <p @click="showDetail = 4" :class="{active:showDetail === 4}">传记介绍</p>
    </div>
    <!-- </van-sticky> -->
    <div class="info-part allo de-con" v-show="showDetail === 1">
      <!--      v-if="detail.pc"-->
      <div id="navDetail1" class="info_html" v-html="detail.pc"></div>
      <noData v-if="!detail.pc"></noData>
      <platform-state />
    </div>
    <div class="info-part allo de-con" v-show="showDetail === 2">
      <img id="navDetail2" src="@/assets/service/bus.jpg" alt="交易保障" />
      <platform-state />
    </div>
    <div class="info-part allo de-con" v-show="showDetail === 3">
      <!--      v-if="detail.case"-->
      <div id="navDetail3" class="info_html" v-html="detail.case"></div>
      <noData v-if="!detail.case"></noData>
      <platform-state />
    </div>
    <div class="info-part allo de-con" v-show="showDetail === 4">
      <!--      v-if="detail.biography"-->
      <div id="navDetail4" class="info_html" v-html="detail.biography"></div>
      <noData v-if="!detail.biography"></noData>
      <platform-state />
    </div>
    <!-- 底部 -->
    <van-goods-action :safe-area-inset-bottom="true">
      <a :href="'/shopDetail/'+store_id">
        <!-- :to="{path:'/shopDetail/'+store_id}" -->
      <van-goods-action-icon icon="shop-o" text="店铺"/>
      </a>
      <van-goods-action-icon icon="chat-o" text="客服" @click="customerService" />
      <!-- <van-goods-action-icon icon="cart-o" text="购物车" info="5" /> -->
      <!-- <van-goods-action-button type="warning" @click="addToCar" color="#F7B432" text="加入购物车" /> -->
      <van-goods-action-button type="danger" @click="buyNow" color="#F3262D" text="立即购买" />
    </van-goods-action>

    <!-- 回顶  -->
    <upBack></upBack>
    <!-- 选购 -->
    <van-sku
      :safe-area-inset-bottom="true"
      stepper-title="数量"
      v-model="showSku"
      :sku="sku"
      :goods="goods"
      :goods-id="1"
      @buy-clicked="selSpec"
      close-on-click-overlay
    >
      <template slot="sku-actions" slot-scope="props">
        <van-button square size="large" type="danger" @click="props.skuEventBus.$emit('sku:buy')">确定</van-button>
      </template>
    </van-sku>
    <!-- 填需求 -->
    <van-popup v-model="showNeed" v-if="saled.selectedSkuComb" round position="bottom" closeable>
      <div class="need-title">购买服务</div>
      <div class="need-body">
        <div class="need-top">
          <p class="van-ellipsis">{{detail.name}}</p>
          <p>￥{{saled.selectedSkuComb.price * saled.selectedNum / 100}}</p>
        </div>
        <!-- <div class="need-top">
        </div>-->
        <textarea class="need-text" v-model="needMsg" placeholder="请填写详细的需求，以便服务商更好的为您服务。"></textarea>
        <comUpload ref="comUpload" v-model="files" :multiples="false"></comUpload>
      </div>
      <van-button square size="large" type="danger" @click="goBuy">确定</van-button>
    </van-popup>

    <!-- 服务参数 -->
    <van-popup v-model="showInfo" safe-area-inset-bottom round position="bottom">
      <div class="need-title">服务参数</div>
      <div class="need-body nmgt">
        <div class="options" v-for="item in detail.normal_attr" :key="item.id">
          <p>{{item.attr_name}}</p>
          <p v-if="item.input_type === 1">{{item.checked_list}}</p>
          <p v-if="item.input_type === 2">
            <span
              v-for="(checked,idx) in item.checked_list"
              :key="checked.id"
            >{{checked.value}}{{idx === item.checked_list.length - 1 ? '' : ','}}</span>
          </p>
          <p v-if="item.input_type === 3">
            <span
              v-for="(checked,idx) in item.checked_list"
              :key="idx"
            >{{checked}}{{idx === item.checked_list.length - 1 ? '' : ','}}</span>
          </p>
        </div>
        <template v-if="detail.normal_attr">
          <div v-if="detail.normal_attr.length ===1" class="two_line"></div>
          <div v-else-if="detail.normal_attr.length ===2" class="one_line"></div>
        </template>
      </div>
      <van-button square size="large" type="danger" @click="showInfo = false">完成</van-button>
    </van-popup>

    <!-- 客服 -->
    <van-popup
      v-model="showKf && detail.customerServices"
      safe-area-inset-bottom
      round
      position="bottom"
      closeable
    >
      <div class="need-title">客服</div>
      <div class="need-body">
        <div class="kf-box" v-if="detail.customerServices">
          <a
            class="items"
            :href="'mqqapi://card/show_pslcard?src_type=internal&version=1&uin='+detail.customerServices.kf_account"
          >
            <kfBtn :kfAcc="detail.customerServices.kf_account"></kfBtn>
            <div class="kf-name">{{detail.customerServices.kf_name}}</div>
          </a>
        </div>
      </div>
      <van-button square size="large" type="danger" @click="showKf = false">完成</van-button>
    </van-popup>
  </div>
</template>

<script>
import serviceDetailSwiper from "@/components/service/detail/swiper";
import commentCon from "@/components/service/detail/commentDetail";
import opcHeader from "@/components/service/detail/opcHeader";
import storeInfo from "@/components/service/detail/storeInfo";
import ShopItem from "@/components/common/shopItem";
import upBack from "@/components/service/upBack";
import kfBtn from "@/components/common/kfBtn";
import comUpload from "@/components/service/comUpload";
import noData from "@/components/noData";
import {
  getServiceDetail,
  getServiceComments,
  buyService
} from "@/api/service";
import { getStoreInfo } from "@/api/shop";
import PlatformState from "./components/platformState";
import { browser } from "@/utils/tool";
import router from "@/router";
import { wxShareCommon } from "@/utils/util";

export default {
  name: "serviceDetail",
  components: {
    serviceDetailSwiper,
    commentCon,
    storeInfo,
    comUpload,
    opcHeader,
    upBack,
    noData,
    kfBtn,
    ShopItem,
    PlatformState,
  },
  beforeRouteUpdate(to, from, next) {
    this.sid = to.params.id;
    this.store_id = to.query.id;
    next();
    this.init();
  },
  data() {
    return {
      sid: this.$route.params.id,
      store_id: this.$route.query.id,
      storeInfo: {},
      detail: '',
      comments: {},
      saled: {},
      needMsg: "",
      showDetail: 1,
      showSku: false,
      showNeed: true,
      showInfo: false,
      showKf: false,
      stiky: 0,
      files: [],
      commentCount: {},
      stockNum: 0,
      isWeChat: browser.versions.isWeChat,
    };
  },
  computed: {
    storeOrigin() {
      // 店铺证书信息
      const {
        mediaCompany,
        mediaCompanyShortName,
        mediaAptitudeType,
        proof
      } = this.detail;
      if (mediaCompany === undefined) return {};
      return {
        cpy: mediaCompanyShortName || mediaCompany,
        type: mediaAptitudeType,
        num:
          proof.honorTypeNum.reduce((pre, cur) => pre + cur.count, 0) +
          proof.mediaNum
      };
    },
    goodpp() {
      // 好评率
      if (!this.commentCount.good) return 0;
      const { good, bad, middle } = this.commentCount;
      const p = (good / (good + bad + middle)) * 100;
      return Math.floor(p);
    },
    skuTree() {
      if (!this.detail.sale_attr) return [];
      const { sale_attr } = this.detail;
      let obj = {},
        id = 1,
        tree = [],
        index = 1;
      sale_attr.map(item => {
        item.list &&
          item.list.map((attr, idx) => {
            const { attr_name, value } = attr;
            if (obj[attr_name]) {
              obj[attr_name].add(value);
            } else {
              obj[attr_name] = new Set([value]);
            }
          });
      });
      for (let [k, value] of Object.entries(obj)) {
        const v = Array.from(value).map(item => ({
          id: `${id++}`,
          name: item
        }));
        tree.push({ k, v, k_s: `s${index}` });
        index++;
      }
      return tree;
    },
    skuList() {
      if (!this.detail.sale_attr) return [];
      const { sale_attr } = this.detail;
      let id = 1000;
      this.stockNum = this.detail.stock;
      return sale_attr.map(attr => {
        const { stock, price, list } = attr;
        let obj = {
          id: id++,
          price: price * 100,
          stock_num: stock,
          ending: list.map(pop => ({ key: pop.key, value: pop.value }))
        };
        // eslint-disable-next-line no-labels
        outer: for (let i = 0, val; (val = this.skuTree[i++]); ) {
          for (let j = 0, vj; (vj = val.v[j++]); ) {
            for (let k = 0, vk; (vk = list[k++]); ) {
              if (val.k === vk.attr_name && vj.name === vk.value) {
                obj[val.k_s] = vj.id;
                continue outer;
              }
            }
          }
        }
        // this.stockNum = stock;
        return obj;
      });
    },
    sku() {
      return {
        // 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
        // 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
        tree: this.skuTree,
        // 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
        list: this.skuList,
        price: this.detail.price, // 默认价格（单位元）
        stock_num: this.stockNum, // 商品总库存
        collection_id: 9999, // 无规格商品 skuId 取 collection_id，否则取所选 sku 组合对应的 id
        none_sku: this.detail.sale_attr
          ? this.detail.sale_attr.length === 0
          : true // 是否无规格商品
      };
    },
    goods() {
      return {
        // 商品标题
        title: this.detail.name,
        // 默认商品 sku 缩略图
        picture: `${this.$store.state.ali_api_host}${this.detail.img}`
      };
    }
  },
  created () {
    this.init()
     document.title = '凌天众媒网一站式全媒界大型媒体电商平台'
  },
  mounted(){
    //  document.title = '我在凌天众媒网发现了一个不错的广告位，赶快来看看'
  },
  methods: {
    customerService() {
      if (this.isWeChat) {
        this.$toast("微信环境不支持qq交谈\n" + "请点击右上角...在浏览器打开");
      } else if (!this.detail.customerServices) {
        this.$toast("暂无客服信息");
      } else {
        this.showKf = true;
      }
    },
    init() {
      this.getSerDetail();
      this.getComments();
      this.getStore();
    },
    sharePage () {
      console.log(this.detail)
        if(this.storeInfo.logo == '' && this.storeInfo.logo == null){
         var img = 'https://ltzm1.oss-cn-shenzhen.aliyuncs.com/' +this.detail.img
      }else{
         var img ="https://m.zhongmei66.com/static/bitbug_favicon.ico"
      }


      let obj = {
        title: this.detail.name,
        link: window.location.href, // 网址，默认使用window.location.href
         desc: '我在凌天众媒网发现了一个不错的广告位，赶快来看看',
        imgUrl: img,
        infoMap: {
          wx: {
            title: this.detail.name,
            desc: '我在凌天众媒网发现了一个不错的广告位，赶快来看看',
            link: window.location.href,
            imgUrl:img
          }
        },
        fnDoShare: function(type) {
          // console.log(1)
        }
      };
      console.log(obj);
      Mshare.popup(obj);
    },
    setHeader(height) {
      this.stiky = height;
    },
    async goBuy() {
      if (this.needMsg === "") return this.$toast("请填写需求内容");
      const { ending, price } = this.saled.selectedSkuComb;
      const data = await buyService({
        sid: this.sid,
        spec_json: ending,
        amount: price / 100,
        number: this.saled.selectedNum,
        service_demand: this.needMsg,
        demand_files: this.files.map(f => f.url)
      });
      if (!data) return;
      this.$toast("下单成功");
      // this.$router.push({ path: '/serviceOrder', query: { sn: data.order_sn } })
      this.$router.push({
        path: "/payment",
        query: { order_sn: data.order_sn, type: 5 }
      });
    },
    selSpec(buy) {
      this.saled = buy;
      this.showSku = false;
      this.showNeed = true;
    },
    buyNow() {
      let token = localStorage.getItem("token");
      if (token) {
        this.showSku = true;
      } else {
        // this.$toast("未登录或登录已失效");
        let redirect = router.currentRoute.fullPath;
        router.replace({
          path: "/login",
          query: { redirect }
        });
      }
    },
    addToCar() {},
    async getSerDetail() {
      const data = await getServiceDetail(this.sid);
      if (!data) return this.$router.push({path:"/closeData", query: { type: 1 }});
      this.detail = data;
      document.title = this.detail.name;
      const { img = "", name = "" } = data;
      wxShareCommon(name, img, "我在凌天众媒网发现了一个不错的广告位，赶快来看看");
    },
    async getComments() {
      const data = await getServiceComments({ sid: this.sid });
      if (!data) return;
      this.comments = data;
      this.commentCount = data.commentCount;
    },
    async getStore() {
      const data = await getStoreInfo(this.store_id);
      if (!data) return;
      this.storeInfo = data;
    }
  }
  // watch: {
  //   showDetail: {
  //     immediate: true,
  //     handler(val) {
  //       let dom = document.getElementById('navDetail' + val)
  //       console.log(val, dom, dom.offsetHeight)
  //     }
  //   }
  // }
};
</script>

<style scoped lang="scss">
/deep/ .van-sku-container {
  .van-sku-header {
    @include flex;
    height: rem(120);
    padding: 20px 0;

    .van-sku-header__img-wrap {
      width: rem(200);
      height: 100%;
    }

    .van-sku-header__goods-info {
      flex: 1;
      height: 100%;
      min-height: unset;
      padding: 0;
      padding-left: rem(10);

      .van-sku__goods-price {
        .van-sku__price-num,
        .van-sku__price-symbol {
          font-size: rem(32);
        }
      }
    }
  }

  .van-stepper__minus--disabled,
  .van-stepper__plus--disabled,
  .van-stepper__minus,
  .van-stepper__plus {
    background: #fff;
  }

  .van-stepper__minus,
  .van-stepper__plus {
    color: #999;
  }

  .van-stepper__minus--disabled,
  .van-stepper__plus--disabled {
    color: #ddd;
  }

  .van-stepper__input {
    width: rem(90);
    height: rem(56);
  }

  .van-sku-header-item {
    margin-top: rem(8);

    &:nth-child(3) {
      display: none;
    }
  }
}

.detail {
  padding-bottom: 100px;
}

.info-part {
  background: #fff;
  font-family: $font;
  @include borderBox;
  padding: 20px 0 20px 30px;
  margin-bottom: 20px;
  display: block;
  .info_html {
    padding: 20px 30px;
    font-size: 28px;
    box-sizing: border-box;
    //height:calc(100 vh - #{300px});

    p {
      line-height: 30px;
    }
  }

  &.allp {
    // 全包
    padding: 20px 30px;
    box-sizing: border-box;
  }

  &.allo {
    // 全开放
    /*position: relative;*/
    padding: 0;
    height: calc(100vh - #{300px});
    /*padding-bottom: 228px;*/
  }

  /deep/ &.de-con {
    width: 100%;
    overflow-x: hidden;
    white-space: pre-wrap;
    white-space: -moz-pre-wrap;
    white-space: -pre-wrap;
    white-space: -o-pre-wrap;
    word-wrap: break-word;

    img {
      max-width: 100%;
    }
  }

  /*=============================================
    =            价格及分享            =
    =============================================*/

  .top {
    @include flex;

    .price {
      font-size: 32px;
      font-weight: 500;
      color: $red;

      .original {
        text-decoration: line-through;
        font-size: 26px;
        color: #666;
        margin-left: 10px;
      }
    }

    .share {
      width: 119px;
      height: 45px;
      @include round(89px 0px 0px 100px);
      background: #f4f6f8;
      font-size: 26px;
      font-weight: 400;
      color: #999;
      line-height: 45px;
      text-align: center;
      @include flex(center);

      img {
        @include square(26);
      }

      span {
        margin-left: 10px;
      }
    }
  }

  .bottom {
    font-size: 28px;
    font-weight: 500;
    color: #333;
    line-height: 37px;
    margin-top: 15px;
    padding-right: 30px;
    @include borderBox;
    @include flex(flex-start);

    .new-f-icon {
      border: 1px solid $red;
      padding: 0 8px;
      @include borderBox;
      color: $red;
      font-size: 20px;
      font-weight: 400;
      line-height: 28px;
      @include round(4px);
      margin-right: 10px;
      transform: scale(0.83);
    }
  }

  /*=====  End of 价格及分享  ======*/
}

/*=============================================
    =            服务商保证金            =
    =============================================*/

.bzj > p {
  font-size: 24px;
  font-weight: 400;
  color: #666;
  line-height: 33px;

  span {
    color: $red;
  }
}

/*=====  End of 服务商保证金  ======*/

/*=============================================
  =            选择规格 |参数|评价头           =
  =============================================*/

.seltype {
  padding: 20px 30px;
  @include flex;
  font-size: 24px;
  font-weight: 400;
  color: #999;

  p:last-child {
    color: #666;
    @include flex;
  }

  /* 评价头 */

  &.comment-top {
    padding: 0;

    span {
      color: $red;
    }
  }

  &.has-con {
    padding-bottom: 20px;
    border-bottom: 1px solid #eeeeee;
  }
}

/*=====  End of 选择规格 |参数|评价头   ======*/

/* 查看全部评价 */
.comment-more {
  @include borderBox;
  font-size: 20px;
  font-weight: 400;
  color: #333;
  background: #fff;
  @include round(100px);
  border: 1px solid #dfdfdf;
  margin: auto;
  width: 178px;
  height: 45px;
  margin-top: 20px;
  @include flex(center);

  .more-icon {
    margin-right: 7px;
  }
}

/* 店铺精选 */
.service-title {
  font-size: 26px;
  font-family: $font;
  font-weight: 400;
  color: #333;
  text-align: center;
}

.store-service {
  @include flex;
  flex-wrap: wrap;
  padding-top: 20px;

  .service-items {
    width: 49.2%;
    &:not(:nth-child(2n + 2)) {
      margin-right: $w_10;
    }
  }
}

/* 服务各块 */
.nav-box {
  @include flex;
  margin-bottom: 0;
  background-color: #fff;
  border-bottom: 1px solid #eee;

  p {
    flex: 1;
    @include borderBox;
    height: 73px;
    line-height: 73px;
    text-align: center;
    border-right: 1px solid #eee;
    font-size: 26px;
    font-weight: 400;

    &:last-child {
      border: none;
    }

    &.active {
      color: $red;
    }
  }
}

/deep/ .van-goods-action-button {
  @include round(0);
}

/*=============================================
  =            需求填写            =
  =============================================*/

.need-title {
  font-size: 30px;
  font-family: $font;
  font-weight: 600;
  color: #333;
  margin-top: 30px;
  text-align: center;
}

.need-body {
  padding: 0 30px;
  @include borderBox;
  margin-top: 44px;

  &.nmgt {
    margin-top: 0;
    max-height: 860px;
    overflow: auto;
  }

  .two_line {
    height: 174px;
  }

  .one_line {
    height: 74px;
  }

  .need-top {
    width: 100%;
    @include flex;
    font-size: 26px;
    font-weight: 400;
    color: #333;

    p:last-child {
      color: $red;
      font-size: 32px;
    }
  }

  .need-text {
    width: 100%;
    height: 300px;
    @include borderBox;
    padding: 20px;
    margin-top: 20px;
    border: 1px solid #ccc;
    font-size: 26px;
    font-weight: 400;
    line-height: 28px;
    resize: none;
    margin-bottom: 43px;
  }
}

/*=====  End of 需求填写  ======*/

/*=============================================
  =            服务参数            =
  =============================================*/
.options {
  font-size: 26px;
  font-family: $font;
  font-weight: 400;
  color: #333;
  @include flex(flex-start);
  @include borderBox;
  padding: 30px 0;
  border-bottom: 1px solid #eee;
  line-height: 37px;

  p:first-child {
    width: 131px;
    margin-right: 30px;
    color: #999;
  }

  p:last-child {
    flex: 1;
  }
}

/*=====  End of 服务参数  ======*/

/*=============================================
  =            客服            =
  =============================================*/
.kf-box {
  @include flex;
  @include borderBox;
  border-top: 1px solid #eee;
  padding: 0 20px 75px 20px;
  flex-wrap: wrap;

  .items {
    @include flex;
    flex-direction: column;
    font-family: $font;
    margin-top: 75px;

    .kf-name {
      margin-top: 16px;
      font-size: 26px;
      font-weight: 400;
      color: #333;
    }
  }
}

/*=====  End of 客服  ======*/
</style>
