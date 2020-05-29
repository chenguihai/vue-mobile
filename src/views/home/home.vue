<template>
  <div class="page" id="page">
    <div v-if="showNewUser" :class="[transition ? 'm-fixed-img' : 'fixed-transition']">
      <a href="/settleIntroduce"><img src="/static/images/home/icon_home_new.png" alt=""></a>
    </div>
    <SearchLoginBar></SearchLoginBar>
    <div class="m-top">
      <van-swipe v-if="banner.length>0" class="m-swipe-top" :autoplay="3000" @change="onChange">
         <!-- @click="redBan(item)" -->
        <van-swipe-item v-for="(item) in banner" :key="item.id">
          <!-- item.ad_img_link -->
          <a :href="item.ad_img_link" class="add-coverage">
            <img :src="imgPrefix + item.ad_img"/>
          </a>
        </van-swipe-item>
        <div class="m-custom-indicator" slot="indicator">
          <span :class="{'sel' : index==current }" v-for="(item,index) in banner" :key="index"></span>
        </div>
      </van-swipe>
      <div class="arc-box">
        <div class="cars"></div>
      </div>
    </div>
    <van-swipe :loop="false" class="m-menu-swipe" @change="switchMenu">
      <van-swipe-item>
        <ul class="m-menu-swipe-item" v-if="m_cate.length>0">
          <li>
            <a href="/hot">
              <img src="../../../static/images/home/icon_hot.png" alt=""/>
              <span>热卖媒体</span>
            </a>
          </li>
          <li v-for="(item,index) in cateMin" :key="index" @click="service(item)">
            <a>
              <img :src="imgPrefix + item.m_icon" alt=""/>
              <span>{{item.m_name}}</span>
            </a>
          </li>
        </ul>
      </van-swipe-item>
      <van-swipe-item>
        <ul class="m-menu-swipe-item">
          <li v-for="(item,index) in cateMax" :key="index" @click="service(item)">
            <a>
              <img :src="imgPrefix + item.m_icon" alt=""/>
              <span>{{item.m_name}}</span>
            </a>
          </li>
        </ul>
      </van-swipe-item>
      <div class="m-custom-indicator-menu" slot="indicator">
        <span :class="{'sel' : 0==curMenu }"></span>
        <span :class="{'sel' : 1==curMenu }"></span>
      </div>

    </van-swipe>
    <div class="m-tt-box" id="news-wrap">
      <span>最新</span>
      <div class="wrap">
        <ul :class="{anim:animate==true}">
          <li v-for="(item, index) in noticeList" :key="index">
<!--            :to="'/news/detail?id='+item.id"-->
            <a :href="'/news/detail/'+item.id">{{item.title}}</a>
          </li>
        </ul>
      </div>
      <a class="more" href="/news/list">更多</a>
    </div>
    <div class="m-banner" v-if="ad_vip">
      <img :src="imgPrefix + ad_vip.ad_img" alt=""/>
    </div>
    <ul class="m-category-flex">
      <li>
        <a href="/clues">
          <img src="/static/images/home/icon-home-1.png" alt=""/>
          <div class="name">
            广告线索大厅
          </div>
          <div class="m-content">
            广告有求必应
          </div>
        </a>
      </li>
      <li @click="noOpen">
        <a href="javascript:void(0)">
          <img src="/static/images/home/icon-home-2.png" alt=""/>
          <div class="name">
            任务需求大厅
          </div>
          <div class="m-content">
            免费接单赚钱
          </div>
        </a>
      </li>
      <li @click="noOpen">
        <a href="javascript:void(0)">
          <img src="/static/images/home/icon-home-3.png" alt=""/>
          <div class="name">
            实时上刊画面
          </div>
          <div class="m-content">
            海量画面优选
          </div>
        </a>
      </li>
      <li @click="noOpen">
        <a href="javascript:void(0)">
          <img src="/static/images/home/icon-home-4.png" alt=""/>
          <div class="name">
            创意广告鉴赏
          </div>
          <div class="m-content">
            创意绽放色彩
          </div>
        </a>
      </li>
    </ul>
    <ul class="m-link-img-list">
      <li>
        <a href="/tollMarket" v-if="ad_tools"><img v-lazy="imgPrefix + ad_tools.ad_img" src="" alt=""/></a>
      </li>
      <li>
        <a href="/" v-if="ad_promo"><img v-lazy="imgPrefix + ad_promo.ad_img" alt=""/></a>
      </li>
    </ul>
    <div class="m-home-clues-box">
      <h3 class="title">
        线索
      </h3>
      <div class="m-clues-list">
        <ul v-if="clues.length>0" :style="'width:'+clues.length*494*10/750+'rem'">
          <a class="clueList" v-for="(item,index) in clues" :key="index" :href="'/clues/detail/' + item.id">
            <div class="avatar">
              <img v-if="item.avatar" :src="item.avatar.indexOf('http')>-1?item.avatar:imgPrefix + item.avatar" alt=""/>
              <img v-else src="../../../static/images/avatar-default.png" alt=""/>
            </div>
            <span class="m-clues-title"><span class="m-color-red">¥{{item.money}}</span>{{item.title}}</span>
            <div class="m-clues-icon">
              <span class="icon-clues-1" v-if="item.go=='Y'">{{cluesText[0]}}</span>
              <span class="icon-clues-2" v-if="item.top=='Y'">{{cluesText[1]}}</span>
              <span class="icon-clues-5" v-if="item.service=='Y'">{{cluesText[3]}}</span>
              <span class="icon-clues-3" v-if="item.city_id">{{cluesText[2]}}</span>
              <span class="icon-clues-4" v-if="item.grade>0">{{cluesText[4]}}</span>
            </div>
            <div class="m-time">发布时间：{{item.created_at}} <span class="m-follow"><img
              src="../../../static/images/home/icon-p-clues.png"/>{{item.deal_num}}</span></div>
          </a>
        </ul>
      </div>
    </div>
    <div class="m-me-media-box">
      <h3 class="m-media-title">
        放心购好物
        <a href="/shopList" class="m-more-media">更多 ></a>
      </h3>
      <div class="m-me-media-list">
        <ul v-if="shop_reco&&shop_reco.list.length>0" :style="'width:'+shop_list.length*154*10/750+'rem'">
           <!-- v-if="index<8" -->
          <li v-for="(item) in shop_reco.list.filter((item,index)=>index<8)" :key="item.store_id">
<!--            :to="'/shopDetail?id='+item.store_id"-->
            <a :href="'/shopDetail/'+item.store_id">
              <img v-if="item.logo" v-lazy="imgPrefix + item.logo" alt=""/>
              <img v-else src="../../../static/images/home/store_default.png" alt=""/>
              <h4 class="m-me-media-name">{{item.store_name}}</h4>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="m-day-buy">
      <h3 class="m-day-buy-title">
        每日逛
      </h3>
      <div class="m-day-buy-left">
        <h4 class="m-day-buy-left-title">全网服务排行榜</h4>
        <p class="m-day-buy-text">让每一次服务都能极致</p>
        <a class="m-day-buy-img-top" v-if="cate_rank.length>0"
                     :href="'/serviceList?claid='+cate_rank[0].id+';'+cate_rank[0].cate_name">
          {{cate_rank[0].cate_name}}
        </a>
        <div class="m-day-buy-img-bottom">
          <a class="bg-second" v-if="cate_rank.length>0"
                       :href="'/serviceList?claid='+cate_rank[1].id+';'+cate_rank[1].cate_name">
            <p>{{cate_rank[1].cate_name}}</p>
          </a>
          <a class="bg-third" v-if="cate_rank.length>0"
                       :href="'/serviceList?claid='+cate_rank[2].id+';'+cate_rank[2].cate_name">
            <p>{{cate_rank[2].cate_name}}</p>
          </a>
        </div>
      </div>
      <div class="m-day-buy-right">
        <a href="/serviceList?tag=is_new" class="m-day-buy-right-bottom">
          <img src="../../../static/images/home/banner-index-new.png" alt=""/>
        </a>
        <a href="/serviceList?tag=is_fine" class="m-day-buy-right-top">
          <img src="../../../static/images/home/banner-index-jt.png" alt=""/>
        </a>
      </div>
      <div class="clearfix"></div>
    </div>
    <div class="m-recommend-store" v-if="shop_reco">
      <h3 class="m-recommend-title"><a href="/shopList" class="m-recommend-more">更多></a></h3>
      <van-swipe :loop="false" @change="switchStore">
        <van-swipe-item>
          <ul class="m-recommend-list">
            <li class="m-recommend-item-left">
              <img v-lazy="imgPrefix + shop_reco.ad.ad_img" alt=""/>
            </li>
            <li v-for="(item,index) in shopRecoListMin" :key="index">
              <!--              '/shopDetail?id='+item.store_id-->
              <a :href="'/shopDetail/'+item.store_id">
                <span class="name" v-if="!item.logo">{{item.store_name}}</span>
                <img v-if="item.logo" v-lazy="imgPrefix + item.logo" alt=""/>
                <img v-else src="../../../static/images/home/store_default.png" alt=""/>
              </a>
            </li>
          </ul>
        </van-swipe-item>
        <van-swipe-item v-if="shop_reco.list.length>6">
          <ul class="m-recommend-list1">
            <li v-for="(item,index) in shopRecoListMax" :key="index">
              <!--:to="'/shopDetail?id='+item.store_id"-->
              <a v-if="item.store_id" :href="'/shopDetail/'+item.store_id">
                <span class="name" v-if="!item.logo">{{item.store_name}}</span>
                <img v-if="item.logo" v-lazy="imgPrefix + item.logo" alt=""/>
                <img v-else src="../../../static/images/home/store_default.png" alt=""/>
              </a>
              <img v-else src="../../../static/images/service-avatar-none.png" alt=""/>
            </li>
          </ul>
        </van-swipe-item>
        <div class="m-custom-indicator-menu" slot="indicator">
          <span :class="{'sel' : 0==curStore }"></span>
          <span v-if="shop_reco.list.length>6" :class="{'sel' : 1==curStore }"></span>
        </div>
      </van-swipe>
    </div>
    <div class="m-product">
      <div class="m-tab-list-wrap">
        <div class="m-tab-list">
          <ul>
            <li :class="{active:cateActive==-1}" @click="switchCateTab(-1)">
              <a href="javascript:void(0)">猜你喜欢</a>
            </li>
            <li @click="switchCateTab(index)" :class="{active:cateActive==index}" v-for="(item,index) in cate_one"
                :key="index">
              <a href="javascript:void(0)">{{item.m_name}}</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="m-product-wrap">
        <ul>
          <ProductItem v-for="(item,index) in cateList" :productInfo="item" :key="index" :theSameShow="0"/>
        </ul>
      </div>
    </div>
    <bottomTabbar :active="0"></bottomTabbar>
    <upBack></upBack>
  </div>
</template>

<script>
  import {mindex} from "@/api/home"
  import {Toast} from "vant";
  import upBack from '@/components/service/upBack'
  import bottomTabbar from '@/components/common/Tabbar'
  import SearchLoginBar from '@/components/common/SearchLoginBar'
  import ProductItem from '@/components/common/ProductItem'
  import {mapState} from 'vuex'

  export default {
    name: 'Home',
    data() {
      return {
        animate: false,
        transition: true,
        showNewUser: false,
        pos: 0,
        isLogin: false,
        noticeTop: 0, // 公告top值
        cateActive: -1,
        m_cate: [],
        shop_list: [],
        clues: [],
        ad_promo: '',
        isActive: true, // 是否显示transitionTop动画
        timer: null, // 公告滚动定时器
        banner: [],
        current: 0,
        curMenu: 0,
        curStore: 0,
        active: 0,
        ad_vip: null,
        ad_tools: null,
        noticeList: [],
        guess_like: [],
        cate_rank: [],
        msgAmount: 0,
        service_list: [],
        cate_one: [],
        cateList: [],
        shop_reco: null
      };

    },
    components: {
      bottomTabbar,
      SearchLoginBar,
      upBack,
      ProductItem
    },
    computed: {
      ...mapState({
        imgPrefix: state => state.ali_api_host
      }),
      noticeLen() { // 公告列表长度
        return this.noticeList.length;
      },
      cateMin() {
        return this.m_cate.filter((item, index) => {
          return index < 9;
        })
      },
      cateMax() {
        return this.m_cate.filter((item, index) => {
          return index >= 9;
        })
      },
      shopRecoListMin() {
        let data = JSON.parse(JSON.stringify(this.shop_reco.list));
        return data.filter((item, index) => {
          return index < 6;
        })
      },
      shopRecoListMax() {
        let data = JSON.parse(JSON.stringify(this.shop_reco.list));
        if (data.length < 19 && data.length > 6) {
          for (let i = data.length; i < 18; i++) {
            data.push({
              store_id: null,
              store_name: null,
              logo: '../../../static/images/service-avatar-none.png'
            })
          }
          return data.filter((item, index) => {
            return index >= 6;
          })
        }

      }
    },
    methods: {
      goto(id) {
        this.$router.push('/clues/detail/' + id)
      },
      switchCateTab(num) {
        this.cateActive = num
        if (num === -1) {
          this.cateList = this.guess_like
        } else {
          this.cateList = this.cate_one[num].list
        }
      },
      onChange(index) {
        this.current = index;
      },
      redBan(item) {
        if (item.id == 89) {
          this.$router.push({path: '/redpage'})
        }
        if (item.id == 107) {
          this.$router.push({path: '/banner'})
        }
      },
      switchStore(index) {
        this.curStore = index;
      },
      switchMenu(index) {
        this.curMenu = index;
      },
      async getIndexData() {
        let _this = this;
        const homeData = await mindex();
        this.banner = homeData.ad_top;
        this.m_cate = homeData.m_cate;
        this.noticeList = homeData.notice.concat(homeData.notice);
        this.ad_promo = homeData.ad_promo;
        this.clues = homeData.clue.list;
        this.cluesText = homeData.clue.text;
        this.shop_list = homeData.shop_list;
        this.ad_vip = homeData.ad_vip;
        this.ad_tools = homeData.ad_tools;
        this.guess_like = homeData.guess_like;
        this.cate_rank = homeData.cate_rank;
        this.shop_reco = homeData.shop_reco;
        this.service_list = homeData.service_list;
        this.cate_one = homeData.cate_one.slice(0, 6);
        if (this.cateActive == -1) {
          this.cateList = this.guess_like
        }
        this.timer = setInterval(_this.noticeScroll, 3000)
      },
      noticeScroll() {
        if (this.noticeLen > 0) {
          this.animate = true;
          setTimeout(() => {
            this.noticeList.push(this.noticeList[0]);
            this.noticeList.shift();
            this.animate = false;
          }, 1000)
        }
      },
      noOpen() {
        Toast('功能暂未开放，敬请期待！')
      },
      // 跳转子类列表
      service(item) {
        this.$router.push('/classifyChild?id=' + item.id)
        console.log(item.id)
      }
    },
    mounted() {
      if (this.$store.state.storeInfo && this.$store.state.storeInfo.isStore === 0) {
        this.showNewUser = true;
      }
    },
    created() {
      let _this = this;
      _this.getIndexData();
    }
  };
</script>
<style lang="scss" scoped>
  @import "@/css/common.scss";

  .page {
    min-height: 100vh;
    padding-bottom: rem(110);
    width: 100%;
    overflow: auto;

    .m-top {
      position: relative;
      height: rem(540);

      .arc-box {

        width: 100%;
        height: 0.8rem;
        background: url('/static/images/home/coverage.png') no-repeat;
        background-size: 100% 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        // background: #000;

        // .cars {
        //   width: 100%;
        //   height: 0.8rem;
        //   margin: 0 auto;
        //   border-radius: 0 0 70% 70%/0 0 150% 150%;
        //   background: #fff;
        // }
      }

      .m-swipe-top {
      }

      .m-swipe-top {
        height: rem(540);
        position: relative;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
        }

        .m-custom-indicator {
          position: absolute;
          left: 0;
          bottom: rem(31);
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;

          span {
            display: block;
            margin-right: rem(6);
            width: rem(18);
            height: rem(6);
            border-radius: rem(3);
            background: #ccc;
          }

          span.sel {
            background: #fff;
          }
        }
      }

    }

    .m-menu-swipe {
      height: 5.1rem;
      width: 96.3%;
      margin: 0 auto;

      .m-menu-swipe-item {
        display: flex;
        align-content: flex-start;
        flex-wrap: wrap;
        height: 5.1rem;

        li {
          // width: rem(150);
          width: 20%;
          padding: 0 rem(10);
          padding-top: rem(24);
          text-align: center;
          box-sizing: border-box;

          a {
            display: block;
          }

          img {
            width: rem(90);
            height: rem(90);
          }

          span {
            // width: rem(150);
            width: 100%;
            display: block;
            color: #333;
            font-size: rem(24);
            line-height: 0.35rem;
            height: rem(32);
          }
        }
      }

    }

    .m-custom-indicator-menu {
      position: absolute;
      left: 0;
      bottom: rem(31);
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      span {
        display: block;
        margin-right: rem(14);
        width: rem(14);
        height: rem(14);
        border-radius: rem(7);
        border: rem(1) solid #BEBEC0;
        background: #DADBDB;
      }

      span.sel {
        background: $red;
      }
    }

    .m-tt-box {
      // width: rem(544);
      width: 93.3%;
      font-size: rem(24);
      text-align: left;
      height: rem(60);
      line-height: rem(60);
      margin: 0 auto;
      background: #fff;
      box-shadow: 0px 2px 2px 2px rgba(222, 222, 222, 0.5);
      border-radius: rem(8);
      background: url("/static/images/home/icon_home_tt.png") no-repeat rem(26) center;
      -webkit-background-size: rem(110) rem(28);
      background-size: rem(110) rem(28);
      padding-left: 20%; //rem(150);
      color: #F52222;
      box-sizing: border-box;
      display: flex;
      position: relative;

      .wrap {
        // position: absolute;
        // top: 0;
        // right: rem(116);
        width: 51%; //rem(360);
        height: rem(60);
        overflow: hidden;
        font-size: .24rem;
        color: #666;

        li {
          margin-left: 10px;
        }

        .anim {
          transition: all 1s;
          margin-top: -0.8rem;
        }
      }

      .more {
        height: rem(25);
        line-height: rem(25);
        color: #333;
        font-size: rem(26);
        border-left: 1px solid #ccc;
        padding-left: rem(17);
        margin: 0.24rem 0;
        position: absolute;
        right: rem(25);
      }

      ul {
        position: relative;
        top: rem(-60);

        li {
          height: rem(60);
          line-height: rem(60);
        }
      }

      .transitionTop {
        transition: top 200ms ease-in-out;
      }
    }

    .m-banner {
      // width: rem(700);
      width: 93.3%;
      margin: 0 auto;
      padding-top: rem(22);

      img {
        width: 100%;
      }
    }

    .m-category-flex {
      padding: rem(5) rem(24) rem(24);
      display: flex;
      justify-content: space-around;

      li {
        // width: rem(170);
        width: 24%;
        height: rem(205);
        background: #fff;
        box-shadow: 0px 2px 4px 0px rgba(209, 209, 209, 0.5);
        border-radius: rem(8);
        text-align: center;

        a {
          display: inline-block;
          width: 100%; // rem(170);
          height: rem(205);
        }

        img {
          width: rem(90);
          height: rem(90);
          display: block;
          margin: 0 auto;
          margin-top: rem(19);
          margin-bottom: rem(22);
        }

        .name {
          color: #333;
          font-size: rem(24);
        }

        .m-content {
          color: #666;
          width: rem(200);
          margin-left: rem(-15);
          font-size: rem(22);
          transform: scale(0.70);
        }
      }
    }

    .m-link-img-list {
      width: 93.3%; // rem(702);
      margin: 0 auto;
      display: flex;
      justify-content: space-around;

      li {
        width: 49.4%; //rem(346);
        height: rem(130);
        color: #fff;

        a {
          display: inline-block;
        }

        img {
          width: 100%;
          height: rem(130);
        }
      }
    }

    .m-home-clues-box {
      width: 93.3%; //702px;
      margin: 0 auto;
      padding-top: rem(20);
      height: 222px;
      overflow: hidden;

      .title {
        height: rem(40);
        width: 77px;
        text-indent: -9999px;
        overflow: hidden;
        background: #fff url('/static/images/home/home-clues.png') no-repeat center center;
        -webkit-background-size: rem(54) rem(27);
        background-size: rem(54) rem(27);
      }

      .m-clues-list {
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        // width: 100%;//rem(700);
        height: 182px;
        padding-bottom: 60px;

        .m-clues-title {
          width: 368px;
          word-wrap: break-word;
          word-break: normal;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          font-weight: bold;
        }

        ul {
          display: flex;
          color: #333333;
          font-size: rem(22);
          justify-content: start;
        }

        .m-clues-icon {
          display: flex;
          justify-content: start;
          padding-top: rem(10);

          span {
            display: inline-block;
            margin-right: rem(10);
            text-align: center;
          }

          .icon-clues-1 {
            width: rem(30);
            height: rem(30);
            background: url("/static/images/icon_clues_1.png") no-repeat left top;
            -webkit-background-size: 100% 100%;
            background-size: 100% 100%;
            color: #fff;
            line-height: rem(30);
            font-size: rem(20);
          }

          .icon-clues-2 {
            width: rem(30);
            height: rem(30);
            background: url("/static/images/icon_clues_2.png") no-repeat left top;
            -webkit-background-size: 100% 100%;
            background-size: 100% 100%;
            color: #fff;
            line-height: rem(30);
            font-size: rem(20);
          }

          .icon-clues-3 {
            width: rem(32);
            height: rem(32);
            background: url("/static/images/icon_clues_3.png") no-repeat left top;
            -webkit-background-size: 100% 100%;
            background-size: 100% 100%;
            color: #fff;
            line-height: rem(32);
            font-size: rem(20);
          }

          .icon-clues-4 {
            width: rem(32);
            height: rem(32);
            background: url("/static/images/icon_clues_4.png") no-repeat left top;
            -webkit-background-size: 100% 100%;
            background-size: 100% 100%;
            color: #fff;
            line-height: rem(32);
            font-size: rem(20);
          }

          .icon-clues-5 {
            width: rem(32);
            height: rem(32);
            background: linear-gradient(180deg, rgba(248, 144, 108, 1) 0%, rgba(247, 71, 138, 1) 100%);
            border-radius: 2px;
            color: #fff;
            line-height: rem(32);
            font-size: rem(20);
          }
        }

        .clueList {
          background: #fff;
          color: #333;
          width: rem(368);
          height: rem(148);
          margin-right: rem(14);
          position: relative;
          padding: rem(24) rem(24) 0 rem(102);
          box-shadow: 0px 2px 4px 0px rgba(209, 209, 209, 0.5);
          border-radius: rem(8);

          span {
            margin-right: rem(15);
          }

          a {
            display: block;
          }

          .avatar {
            width: rem(70);
            height: rem(70);
            border-radius: rem(35);
            overflow: hidden;
            position: absolute;
            left: rem(16);
            top: rem(38);

            img {
              width: 100%;
              height: 70px;
            }
          }

          .m-time {
            text-align: left;
            padding-top: 10px;
            color: #666;
            font-size: 22px;

            .m-follow {
              margin-left: rem(20);

              img {
                width: 22px;
                height: 22px;
                margin-right: 6px;
              }
            }
          }
        }
      }
    }

    .m-me-media-box {
      width: 93.3%; // rem(700);
      height: rem(310);
      margin: 0 auto;
      margin-top: rem(22);
      position: relative;
      background: #fff;
      box-shadow: 0px 2px 4px 0px rgba(209, 209, 209, 0.5);
      border-radius: rem(8);
      overflow: hidden;

      .m-media-title {
        font-size: rem(24);
        height: rem(80);
        line-height: rem(60);
        background: url("/static/images/home/home-self-ad.png") no-repeat rem(14) rem(16);
        -webkit-background-size: rem(79) rem(27);
        background-size: rem(79) rem(27);
        padding-left: rem(121);
        color: #666;

        .m-more-media {
          position: absolute;
          color: #666;
          top: rem(0);
          right: rem(20);
        }
      }

      .m-me-media-list {
        overflow-x: auto;
        white-space: nowrap;
        overflow-y: hidden;
        padding-bottom: 80px;
        -webkit-overflow-scrolling: touch;
        width: rem(700);

        ul {
          display: flex;
          justify-content: end;
          min-width: rem(680);
          padding: rem(7) rem(17) 0;
        }

        li {
          width: rem(135);
          margin-right: rem(19);
          text-align: center;
          word-wrap: break-word;

          img {
            width: rem(100);
            margin: 0 auto;
            height: rem(100);
            display: block;
            border: 1px solid #D1D1D1;
            -webkit-border-radius: rem(67);
            -moz-border-radius: rem(67);
            border-radius: rem(67);
          }

          .m-me-media-name {
            color: #333;
            margin-top: rem(27);
            width: rem(135);
            overflow: hidden;
            font-size: rem(26);
            height: rem(52);
            text-overflow: ellipsis;
            display: -webkit-box;
            white-space: pre-wrap;
            word-wrap: break-word;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .m-me-media-con {
            margin-top: rem(7);
            width: rem(135);
            color: #666;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            font-size: rem(24);
            -webkit-box-orient: vertical;
          }
        }
      }
    }

    .clearfix {
      clear: both;
      height: 1px;
      overflow: hidden;
    }

    .m-day-buy {
      width: 93.3%; //rem(704);
      margin: 0 auto;
      margin-top: rem(22);

      .m-day-buy-left {
        width: 49%; //rem(346);
        padding-top: rem(12);
        height: rem(365);
        background: #fff;
        border-radius: rem(8);
        box-shadow: 0px 2px 4px 0px rgba(209, 209, 209, 0.5);
        float: left;

        .m-day-buy-left-title {
          width: rem(195);
          height: rem(28);
          margin: 0 auto;
          background: url("/static/images/home/text-ranking.png") no-repeat left top;
          -webkit-background-size: 100% 100%;
          background-size: 100% 100%;
          text-indent: -9999px;
          overflow: hidden;
          margin-bottom: rem(6);
        }

        .m-day-buy-text {
          color: #666;
          text-align: center;
          font-size: rem(18);
          margin-bottom: rem(19);
        }

        .m-day-buy-img-top {
          background: #ccc;
          width: 90%; //rem(301);
          padding-top: rem(53);
          margin: 0 auto;
          display: block;
          margin-bottom: rem(12);
          height: rem(87);
          font-size: rem(22);
          color: #fff;
          font-weight: bold;
          text-align: center;
          background: url("../../../static/images/home/bg-first.png") no-repeat left top;
          -webkit-background-size: 100% 100%; //
          background-size: 100% 100%; // rem(300) rem(140);
        }

        .m-day-buy-img-bottom {
          width: 88%; //rem(301);
          display: flex;
          margin: 0 auto;
          justify-content: space-around;

          .bg-second {
            width: 49%; //rem(147);
            padding-top: rem(45);
            height: rem(78);
            text-align: center;
            color: #fff;
            font-size: rem(24);
            background: url("../../../static/images/home/bg-second.png") no-repeat left top;
            -webkit-background-size: 100% 100%;
            background-size: 100% 100%;

            p {
              transform: scale(0.8);
              font-weight: bold;
            }
          }

          .bg-third {
            width: 49%; //rem(147);
            padding-top: rem(45);
            height: rem(78);
            text-align: center;
            color: #fff;
            font-size: rem(24);
            background: url("../../../static/images/home/bg-third.png") no-repeat left top;
            -webkit-background-size: 100% 100%;
            background-size: 100% 100%;

            p {
              transform: scale(0.8);
              font-weight: bold;
            }
          }
        }
      }

      .m-day-buy-right {
        width: 49%; //rem(331);
        text-align: center;
        float: right;
        background: #fff;
        padding: rem(8);
        -webkit-border-radius: rem(8);
        -moz-border-radius: rem(8);
        border-radius: rem(8);
        box-sizing: border-box;
      }

      .m-day-buy-right-top {
        width: 100%; //rem(331);
        height: rem(178);
        background: #fff;
        display: block;

        img {
          width: 100%; //rem(331);
          height: rem(178);
        }
      }

      .m-day-buy-right-img-box {
        display: flex;
        width: rem(312);
        margin: 0 auto;
        margin-top: rem(8);
        justify-content: space-around;

        img {
          width: rem(151);
          height: rem(89);
          background: #ccc;
          display: block;
        }
      }

      .m-day-buy-right-bottom {
        display: block;
        width: 100%; //rem(331);
        height: rem(178);
        background: #fff;
        margin-top: rem(7);

        img {
          width: 100%; //rem(331);
          height: rem(178);
          margin: 0 auto;
        }
      }

      .m-day-buy-title {
        height: rem(44);
        background: url("/static/images/home/title-day-buy.png") no-repeat center center;
        -webkit-background-size: rem(136) rem(44);
        background-size: rem(136) rem(44);
        text-indent: -9999px;
        margin-bottom: rem(17);
        overflow: hidden;
      }
    }

    .m-color-red {
      color: $red;
    }

    .text-indent {
      text-indent: -9999px;
      overflow: hidden;
    }

    .m-recommend-store {
      width: 93.3%; //rem(700);
      margin: 0 auto;
      margin-top: rem(19);

      .m-recommend-title {
        background: url("/static/images/home/text-recommend-store.png") no-repeat center center;
        -webkit-background-size: rem(156) rem(49);
        background-size: rem(156) rem(49);
        position: relative;
        height: rem(49);
        margin-bottom: rem(22);
        margin-top: rem(19);

        .m-recommend-more {
          position: absolute;
          color: #666;
          right: rem(25);
          font-size: rem(24);
          top: rem(12);
        }
      }

      .m-recommend-list, .m-recommend-list1 {
        width: 100%;
        box-sizing: border-box;
        height: rem(320);
        // width: rem(424);
        margin: 0 auto;
        padding-left: 50%; //rem(276);
        position: relative;
        display: flex;
        align-content: flex-start;
        flex-wrap: wrap;
        justify-content: space-around;

        li {
          width: 29.8%; //rem(124);
          height: 112px;
          margin-bottom: rem(8);
          background: rgba(247, 249, 250, 1);
          border-radius: rem(5);

          a {
            display: inline-block;
            width: 100%; // rem(124);
            height: 100%; //rem(124);
            position: relative;
            border-radius: rem(5);

            .name {
              position: absolute;
              font-size: 24px;
              color: #666;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              width: 100px;
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              -webkit-box-orient: vertical;
            }
          }

          img {
            width: 100%;
            height: 100%;
            display: block;
            background: #ccc;
            border-radius: rem(5);
          }
        }

        .m-recommend-item-left {
          position: absolute;
          left: 0;
          top: 0;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      .m-recommend-item-left {
        width: 48% !important; //rem(256) !important;
        height: rem(232) !important;

        &:nth-child(1) {
          margin: 0;
        }
      }

      .m-recommend-list1 {
        padding-left: 0;
        width: 100%; //rem(710);
        margin: 0 auto;

        li {
          width: 16%; //114px;
          height: 112px;

          a {
            display: block;
            width: 100%; //114px;
            height: 112px;
          }
        }
      }
    }

    .m-product {
      width: 93.3%; //rem(700);
      margin: 0 auto;

      .m-product-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
      }
    }

    /**商品列表**/
    .service-items {
      width: 345px;
      height: 426px;
      @include round(8px);
      background: #fff;

      .ser-img {
        width: 100%;
        height: 207px;
      }

      .ser-name {
        width: 310px;
        margin-left: 10px;
        margin-top: 10px;
        font-size: 24px;
        font-family: $font;
        font-weight: 500;
        color: #333;
      }

      .ser-market,
      .store,
      .info {
        @include flex;
        margin-top: 6px;
        margin-left: 10px;
        @include borderBox;
        padding-right: 25px;
      }

      .ser-price {
        font-size: 24px;
        font-family: $font;
        font-weight: 500;
        color: $red;
      }

      .ser-amount,
      .store-name,
      .info {
        font-size: 20px;
        font-family: $font;
        font-weight: 500;
        color: #999;

        span {
          color: #0066cc;
          margin-left: 10px;
        }
      }

      .store-name {
        width: 277px;
      }

      .info {
        margin-top: 16px;
        justify-content: flex-start;
        color: #fff;

        .level,
        .type {
          margin-right: 10px;
          @include borderBox;
          padding: 3px 5px;
          @include round(4px);
        }

        .level {
          background: #ffa24f;
        }

        .type {
          background: #9eadfe;
        }
      }
    }

    .m-fixed-img {
      position: fixed;
      z-index: 1000;
      width: rem(138);
      right: rem(24);
      top: rem(900);
      transition: 0.7s ease-in-out;

      img {
        width: 100%;
      }
    }

    .fixed-transition {
      position: fixed;
      z-index: 1000;
      width: rem(138);
      top: rem(900);
      right: rem(-150);
      opacity: 0.4;
      transition: 1s ease-in-out;

      img {
        width: 100%;
      }
    }

    .m-tab-list-wrap {
      height: 84px;
      overflow: hidden;
    }

    .m-tab-list {
      // width: rem(700);
      padding: 0 rem(25);
      margin: 0 auto;
      white-space: nowrap;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      overflow-x: auto;
      padding-bottom: rem(97);

      ul {
        width: auto;
        min-width: 700px;
        white-space: nowrap;
      }

      li {
        display: inline-block;
        font-size: rem(28);
        padding: 0 rem(14);
        border-right: 1px solid #ccc;
      }

      li:first-child {
        padding-left: 0;
      }

      li:last-child {
        border-right: 0;
      }

      li.active {
        a {
          color: $red;
          border-bottom: 1px solid $red;
        }
      }
    }

    .m-product-wrap {
      min-height: 300px;

      & > ul {
        -moz-column-count: 2; /* Firefox */
        -webkit-column-count: 2; /* Safari �� Chrome */
        column-count: 2;
        -moz-column-gap: 0;
        -webkit-column-gap: 0;
        column-gap: 0;
      }
    }
  }
  .add-coverage{
    display: block;
  }
</style>
