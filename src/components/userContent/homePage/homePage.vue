<template>
  <!-- 雇主中心首页 -->
  <div class="homePage">
    <!--头部导航-->
    <head-nav title="我的"></head-nav>
    <!--公共的头部-->
    <div class="contentA">
      <div :class="['userData',{active:switchgType!==1}]">
        <div class="icon_t">
          <div @click="myJumpUrl('accountUser')">
            <img src="@/assets/arrowhead/tool.png" alt/>
          </div>
          <div @click="myJumpUrl('allNews')">
            <img src="../../../../static/images/home/icon_message_top.png" alt/>
            <div class="number" v-if="(this.countT + this.countS ) != 0">{{this.countT + this.countS}}</div>
          </div>
        </div>
        <div class="data_u">
          <div class="userImg">
            <template v-if="switchgType ===1">
              <img
                v-if="userInfo.avatar == null || userInfo.avatar == ''"
                src="@/assets/default/user.jpg"
                alt
              />
              <img v-else :src="userInfo.avatar.indexOf('http')>-1?userInfo.avatar:$store.state.ali_api_host+userInfo.avatar" alt/>
            </template>
            <template v-else>
              <img v-if="!storeInfo.logo" src="@/assets/default/shop.png" alt/>
              <van-image
                v-else
                round
                fit="cover"
                :src="storeInfo.logo"
                :noOss="false"
                :lazy-load="true"
              ></van-image>
            </template>
          </div>
          <div class="data_list" v-if="flagLogin == 1">
            <span @click="routerJump('login')">登录 / 注册 ></span>
          </div>
          <div class="data_list flagLogin" v-else>
            <template v-if="switchgType ===1">
              <span>{{userInfo.nick_name}}</span>
              <div class="icon_list">
                <span class="typeid typeid1" v-if="status ==1">个人</span>
                <span class="typeid typeid2" v-else-if="status ==2">企业</span>
                <img v-if="status ==1 || status ==2" src="@/assets/icon/authentication.png" alt/>
                <img v-else src="@/assets/icon/meitigongsiweirenzheng.png" alt/>
                <img class="bank" v-if="banknum != undefined && banknum.length >0" src="@/assets/icon/bank.png" alt/>
                <img
                  v-if="status ==1 || status ==2"
                  class="phone"
                  src="@/assets/icon/phone.png"
                  alt
                />
              </div>
            </template>
            <!--服务商-->
            <template v-else>
              <span>{{storeInfo.store_name}}</span>
              <lvInfo :oblig="storeInfo"></lvInfo>
              <!--已开通-->
              <div class="level" v-if="storeInfo.status === 1">
                <span>店铺状态：</span>
                <span>已开通</span>
              </div>
              <!--已关闭 -->
              <template v-else-if="storeInfo.status === -2">
                <div class="level">
                  <span>店铺状态：</span>
                  <span>已关闭</span>
                </div>
                <div class="level apply">
                  <span @click="openStore">申请开通</span>
                  <img class="arrow" src="@/assets/shop/arrow_left_white.png" alt/>
                </div>
              </template>
            </template>
          </div>

          <div
            :class="['dataFu',{active:switchgType!==1}]"
            v-if="flagLogin == 2"
            @click="dataFuClick"
          >
            <span>{{switchgType===1 ? '切换为服务商':'切换为雇主'}}</span>
          </div>
        </div>
      </div>
      <!--雇主-->
      <div id="content" v-if="switchgType ===1">
        <!--我的订单-->
        <div class="userOrder">
          <div class="order_top">
            <h4>我的订单</h4>
            <span @click="myJumpUrl('myOrder')">查看全部 ></span>
          </div>
          <div class="orderData">
            <div class="orderData_t" @click="orderData(1)">
              <div class="icon icon_t">
                <img src="@/assets/userContent/daichuli.png" alt/>
                <div class="number" v-if="homePageData.order1 > 0">{{homePageData.order1}}</div>
              </div>
              <span>待托管</span>
            </div>
            <div class="orderData_t" @click="orderData(3)">
              <div class="icon icon_q">
                <img src="@/assets/userContent/daiqianshu.png" alt/>
                <div class="number" v-if="homePageData.order2 > 0">{{homePageData.order2}}</div>
              </div>
              <span>待签署</span>
            </div>
            <div class="orderData_t" @click="orderData(5)">
              <div class="icon icon_y">
                <img src="@/assets/userContent/daiyanshou.png" alt/>
                <div class="number" v-if="homePageData.order3 > 0">{{homePageData.order3}}</div>
              </div>
              <span>待验收</span>
            </div>
            <div class="orderData_t" @click="orderData(6)">
              <div class="icon icon_p">
                <img src="@/assets/userContent/xiaoxi.png" alt/>
                <div class="number" v-if="homePageData.order4 > 0">{{homePageData.order4}}</div>
              </div>
              <span>待评价</span>
            </div>
          </div>
        </div>
        <!--交易管理-->
        <div class="payTransaction">
          <div class="Transaction_top">
            <h4>交易管理</h4>
          </div>
          <div class="Transaction_con">
            <div class="conList" @click="myJumpUrl('myEvaluate')">
              <img class="img" src="@/assets/userContent/pingjia.png" alt/>
              <span>我的评价</span>
            </div>
            <div class="conList" @click="myJumpUrl('myInvoice')">
              <img class="img img2" src="@/assets/userContent/fapiao.png" alt/>
              <span>我的发票</span>
            </div>
            <div class="conList" @click="myJumpUrl('myRefund')">
              <img class="img img3" src="@/assets/userContent/tuikuan.png" alt/>
              <span>我的退款</span>
            </div>
            <div class="conList" @click="myJumpUrl('myBalance')">
              <img class="img img3" src="@/assets/userContent/yue.png" alt/>
              <span>我的余额</span>
            </div>
            <div class="conList" @click="myJumpUrl('myThread')">
              <img class="img img4" src="@/assets/userContent/xiansuo.png" alt/>
              <span>我的线索</span>
            </div>
          </div>
        </div>
        <!--广告-->
        <div class="look">
          <div @click="myJumpUrl('novicClick')">
            <img :src="$store.state.ali_api_host + img1.ad_img" alt/>
          </div>
          <div @click="routerJump('settleIntroduce')">
            <img :src="$store.state.ali_api_host + img2.ad_img" alt/>
          </div>
        </div>
        <!--为你推荐-->
        <div class="recommend">
          <div class="recommend_top">
            <span>———</span>
            <span>为你推荐</span>
            <span>———</span>
          </div>
          <div class="recommend_con">
            <ul>
              <li
                v-for="(item , index) in dataOrder"
                :key="index"
                @click="itemClick(item)"
              >
                <img :src="$store.state.ali_api_host + item.img" alt/>
                <span>{{item.name}}</span>
                <div class="money">
                  <span>￥{{item.price}}/月</span>
                  <span>
                    成交量：
                    <p>{{item.deal_num}}</p>
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!--服务商-->
      <div class="service_wrap" v-else>
        <!--交易数据-->
        <div class="data_wrap">
          <h4 class="title">
            交易数据
<!--            <router-link class="detail" :to="{path:'/userContent/homePage/moneyDetail'}">收入明细</router-link>-->
          </h4>
          <ul class="data_ul">
            <li class="data_item">
              <span class="price">¥{{today.income || 0}}</span>
              <span class="text">今日收入</span>
            </li>
            <li class="data_item">
              <span class="price">¥{{today.turnover || 0}}</span>
              <span class="text">累计成交额</span>
            </li>
            <li class="data_item">
              <span class="price">¥{{today.total_income || 0}}</span>
              <span class="text">累计收入</span>
            </li>
          </ul>
        </div>
        <!--我的订单-->
        <div class="data_wrap">
          <h4 class="title">我的订单</h4>
          <ul class="order_list">
            <a
              tag="li"
              class="order_item"
              :href="'/order/serviceOrder?type=2'"
            >
              <div class="img_box">
                <img class="img" src="@/assets/myService/waiting_order.png" alt/>
                <!--              <van-image class="img" :noOss="false" src="@/assets/myService/waiting_order.png" lazy-load/>-->
                <i
                  class="number"
                  v-if="orderOrder.length > 0&&orderOrder[1].value"
                >{{orderOrder[1].value}}</i>
              </div>
              <div class="text">待接单</div>
            </a>
            <a
              tag="li"
              class="order_item"
              :href="'/order/serviceOrder?type=3'"
            >
              <div class="img_box">
                <img class="img" src="@/assets/myService/to_evaluated.png" alt/>
                <i
                  class="number"
                  v-if="orderOrder.length > 0&&orderOrder[2].value"
                >{{orderOrder[2].value}}</i>
              </div>
              <div class="text">待签署</div>
            </a>
            <a
              tag="li"
              class="order_item"
              :href="'/order/serviceOrder?type=4'"
            >
              <div class="img_box">
                <img class="img" src="@/assets/myService/work.png" alt/>
                <i
                  class="number"
                  v-if="orderOrder.length > 0&&orderOrder[3].value"
                >{{orderOrder[3].value}}</i>
              </div>
              <div class="text">工作中</div>
            </a>
            <a
              tag="li"
              class="order_item"
              :href="'/order/serviceOrder?type=6}}'"
            >
              <div class="img_box">
                <img class="img" src="@/assets/myService/info_red.png" alt/>
                <i
                  class="number"
                  v-if="orderOrder.length > 0 &&orderOrder[5].value"
                >{{orderOrder[5].value}}</i>
              </div>
              <div class="text">待评价</div>
            </a>
            <a tag="li" class="order_item" :href="'/order/serviceOrder'">
              <div class="img_box">
                <img class="img" src="@/assets/myService/service_order.png" alt/>
              </div>
              <div class="text">服务订单</div>
            </a>
            <a tag="li" class="order_item" :href="'/order/clueOrder'">
              <div class="img_box">
                <img class="img" src="@/assets/myService/clue_order.png" alt/>
              </div>
              <div class="text">线索订单</div>
            </a>
            <a tag="li" class="order_item" :href="'/orderRefund'">
              <div class="img_box">
                <img class="img" src="@/assets/myService/refund.png" alt/>
              </div>
              <div class="text">订单退款</div>
            </a>
            <a tag="li" class="order_item" :href="'/evaluationOrder'">
              <div class="img_box">
                <img class="img" src="@/assets/myService/evaluate.png" alt/>
              </div>
              <div class="text">订单评价</div>
            </a>
            <a tag="li" class="order_item" :href="'/orderInvoice'">
              <div class="img_box">
                <img class="img" src="@/assets/myService/invoice_manage.png" alt/>
              </div>
              <div class="text">订单发票</div>
            </a>
          </ul>
        </div>
        <!--店铺服务-->
        <div class="data_wrap">
          <h4 class="title">
            店铺服务
            <a class="detail" :href="'/publishService'">发布服务</a>
          </h4>
          <ul class="data_ul">
            <li class="data_item">
              <span class="price">{{(storeService[3] && storeService[3].value) |falseToZero}}</span>
              <span class="text">出售中</span>
            </li>
            <li class="data_item">
              <span class="price">{{(storeService[0] && storeService[0].value) |falseToZero}}</span>
              <span class="text">待审核</span>
            </li>
            <li class="data_item">
              <span class="price">{{(storeService[2] && storeService[2].value) |falseToZero}}</span>
              <span class="text">待上架</span>
            </li>
            <li class="data_item">
              <span class="price">{{(storeService[1] && storeService[1].value) |falseToZero}}</span>
              <span class="text">未通过</span>
            </li>
          </ul>
        </div>
        <!--店铺工具-->
        <div class="data_wrap">
          <h4 class="title">店铺工具</h4>
          <ul class="order_list">
            <a tag="li" class="order_item" :href="'/storeInfoPerson'">
              <img class="toolImg" src="@/assets/myService/store_info.png" alt/>
              <span class="text">店铺资料</span>
            </a>
            <li class="order_item" @click="jumpRouter(2)">
              <img class="toolImg" src="@/assets/myService/skill_manage.png" alt/>
              <span class="text">技能管理</span>
            </li>
            <li class="order_item" @click="jumpRouter(3)">
              <img class="toolImg" src="@/assets/myService/name_auth.png" alt/>
              <span class="text">实名认证</span>
            </li>
            <li class="order_item" @click="jumpRouter(4)">
              <img class="toolImg" src="@/assets/myService/bond.png" alt/>
              <span class="text">缴纳保证金</span>
            </li>
            <a class="order_item" :href="'/serviceManage'" tag="li">
              <img class="toolImg" src="@/assets/myService/service_manage.png" alt/>
              <span class="text">服务管理</span>
            </a>
            <a tag="li" :href="'/rateDetails'" class="order_item">
              <img class="toolImg" src="@/assets/myService/tyechnical_rate.png" alt/>
              <span class="text">技术费率</span>
            </a>
            <li class="order_item" @click="agreeFlag = true">
              <img class="toolImg" src="@/assets/myService/quota_manange.png" alt/>
              <span class="text">免费技术额度</span>
            </li>
            <a tag="li" :href="'/myBond'" class="order_item">
              <img class="toolImg" src="@/assets/myService/my_bond.png" alt/>
              <span class="text">我的保证金</span>
            </a>
            <a tag="li" :href="'/tollMarket'" class="order_item">
              <img class="toolImg" src="@/assets/myService/hold_all.png" alt/>
              <span class="text">工具市场</span>
            </a>
            <a tag="li" class="order_item" :href="'/exampleManage'">
              <img class="toolImg" src="@/assets/myService/example.png" alt/>
              <span class="text">客户合作示例</span>
            </a>
          </ul>
        </div>
      </div>
    </div>
    <!--弹框-->
    <skyPop v-model="agreeFlag" @change="emitClose">
      <template>
        <h5 class="pop-title">温馨提示</h5>
        <p class="pop-top">您当前免费技术额度如下：</p>
        <p class="pop-bottom">
          剩余：
          <span>{{storeInfo.free_amount}}</span>
        </p>
      </template>
    </skyPop>
    <skyPop v-model="applyFlag" @change="emitApllyClose">
      <template>
        <h5 class="pop-title">温馨提示</h5>
        <p class="pop-top">您的店铺开通申请已提交，管理员会在72小时内完成审核，请耐心等待。</p>
      </template>
    </skyPop>
    <!--弹框-->
    <div class="reminder" v-if="flageClose">
      <h4 class="reminderData">
        <h4>温馨提示</h4>
        <div class="spanD">
          <span>1.您还未开通店铺，申请开通。</span>
          <span>2.等待审核，1个工作日。</span>
          <span>3.开通成功，发布服务，接单赚钱。</span>
        </div>
        <button @click="routerJump('newbieTask')">开通店铺</button>
      </h4>
      <div class="close" @click="closeBut">
        <img src="@/assets/userContent/guanbi.png" alt/>
      </div>
    </div>
    <bottomTabbar :active="4"></bottomTabbar>
  </div>
</template>
<script>
  import {Toast} from "vant";
  import {mapMutations, mapState} from "vuex";
  import bottomTabbar from "@/components/common/Tabbar";
  import skyPop from "@/components/service/order/skyPop";
  import {
    userIndex,
    commonTop,
    msgcountT,
    msgcountS,
    homeImage,
    userBank,
    orderData,
  } from "@/api/list";
  import {storeIndex} from "@/api/customer";
  import {getShopInfo} from "@/api/storeInfo";
  import lvInfo from "@/components/service/lvInfo";
  import {applyOpen} from "@/api/auth";
  import {falseToZero} from "@/utils/filters";

  export default {
    name: "homePage",
    components: {bottomTabbar, skyPop, lvInfo},
    filters: {falseToZero},
    data() {
      return {
        flagLogin: "2",
        flageA: "2",
        flageClose: false,
        switchgType: 1, //身份切换  1、雇主 2、服务商
        agreeFlag: false, //技术额度
        applyFlag: false,
        homePageData: "",
        userInfo: {}, // ''
        status: "",
        shopStatus: "",
        entryNow: "",
        countT: "",
        countS: "",
        img1: "",
        img2: "",
        type: "",
        today: {},
        storeService: [],
        orderOrder: [],
        active: 4,
        storeInfo: {},
        banknum: '',
        dataOrder:'',
      };
    },
    async created() {
      let {type = 1} = this.$route.query;
      this.switchgType = +type;
      let token = localStorage.getItem("token");
      if (token) {
      await  this.getShopInfoHttp();
        this.storeIndexHttp();
        this.flagLogin = "2";
        this.init();
      } else {
        this.flagLogin = "1";
      }
      this.type = "22";
      this.img();
      this.type = "23";
      this.img();
      localStorage.removeItem("publishService");
      localStorage.removeItem("formShow");
      this.orderList()
    },
    methods: {
      ...mapMutations(["GET_STORE_INFO"]),
      emitClose() {
        this.agreeFlag = false;
        this.applyFlag = false;
      },
      emitApllyClose() {
        this.applyFlag = false;
        this.$router.push({path: "/newbieTask"});
      },
      openStore() {
        this.getApplyOpen();
      },
      async getApplyOpen() {
        const data = await applyOpen();
        if (!data) return;
        this.applyFlag = true;
        // this.getShopInfoHttp();
      },
      jumpRouter(type) {
        let storeInfo = this.storeInfo;
        if (!storeInfo.store_name) {
          //isStore
          this.$toast("请先完善店铺资料");
          return;
        }
        if (type == 2) {
          //isEntered
          this.$router.push({path: "/skillManage"});
        } else if (storeInfo.isEntered) {
          if (type === 3) {
            //实名认证  isAuth
            if (storeInfo.isStore === 0) {
              this.$router.push({path: "/authType"});
            } else {
              this.$router.push({
                path: storeInfo.type_id === 1 ? "/personalInfo" : "/companyInfo"
              });
            }
          } else if (type === 4) {
            //isPayMargin
            this.$router.push({path: "/deposit"});
          }
        } else {
          this.$toast("请先完善擅长技能");
        }
      },
      async getShopInfoHttp() {
        const data = await getShopInfo();
        if (!data) return;
        this.storeInfo = data;
        this.GET_STORE_INFO(data);
        localStorage.setItem("storeInfo", JSON.stringify(data));
      },
      init() {
        // 请求数据
        userIndex().then(res => {
          this.homePageData = res;
          this.userInfo = this.homePageData.userInfo;
          if (this.userInfo.sign != false) {
            this.status = this.userInfo.sign.status;
          }
        }).catch(err => {
          console.log(err);
        });

        // 判断是否开店
        commonTop().then(res => {
          this.shopStatus = res.status;
          if (this.shopStatus !== 2) {
            this.switchgType = 1;
            this.$router.replace("?type=" + this.switchgType);
          }
          if (res.status === 1) {
            this.$store.state.storeInfo.isStore = 0;
          }
          // this.entryNow = res.entryNow;
        })
          .catch(err => {
            console.log(err);
          });
        // 交易消息
        msgcountT()
          .then(res => {
            this.countT = Number(res.count);
          })
          .catch(err => {
            console.log(err);
          });
        // 系统消息
        msgcountS()
          .then(res => {
            this.countS = Number(res.count);
          })
          .catch(err => {
            console.log(err);
          });
        userBank()
          .then(res => {
            this.banknum = res
          }).catch(err => {
          console.log(err)
        })
      },
     async orderList(){
       const dataO = await orderData()
      if(!dataO) return ;
      this.dataOrder = dataO
    },
      img() {
        // 图片
        var type = this.type;
        homeImage(type)
          .then(res => {
            if (type == 22) {
              this.img1 = res;
            } else if (type == 23) {
              this.img2 = res;
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      // 切换店铺
      dataFuClick() {
        // if (this.shopStatus === 2) {
        if (this.storeInfo.status === 1 || this.storeInfo.status === -2) {
          this.switchgType = this.switchgType === 1 ? 2 : 1;
          // if (this.switchgType === 2 && !this.storeInfo.type_id) {
          //     this.storeIndexHttp();
          //     this.getShopInfoHttp();
          //     console.log('111')
          // }
          this.$router.replace("?type=" + this.switchgType);
          // localStorage.removeItem("publishService");
          // localStorage.removeItem("formShow");
          // this.$router.push({path: "/newbieTask"});
        } else {
          this.flageClose = true;
        }
      },
      orderData(type) {  // 我的订单跳转
        this.$router.push({
          path: "/userContent/homePage/myOrder",
          query: {type: type}
        });
      },
      closeBut() { // 关闭弹窗
        this.flageClose = false;
      },
      routerJump(url) {
        this.$router.push({path: `/${url}`});
      },
      shoplick() {
        this.$router.push({
          path: "/settleIntroduce"
        });
      },
      myJumpUrl(pathname){
        this.$router.push({path: `/userContent/homePage/${pathname}`});
      },
      async storeIndexHttp() {
        let data = await storeIndex();
        if (!data) return;
        const {today = {}, store_product = {}, store_order = {}} = data;
        this.today = today;
        this.storeService = store_product.data[0] || [];
        this.orderOrder = store_order.data[0] || [];
      },
      // 跳转服务详情页
      itemClick(item) {
        // this.$router.push({
        //   path: `/serviceDetail/${item.id}?id=${item.store_id}`
        // });
         window.location.href = `${location.origin}/serviceDetail/${item.id}?id=${item.store_id}`;
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "@/css/sky-pop.scss";

  .service_wrap {
    width: 100%;
  }

  .data_wrap {
    margin: $w_20 15px;
    font-size: 24px;
    background-color: $white;

    .title {
      height: 90px;
      line-height: 90px;
      padding: 0 46px 0 $w_30;
      border-bottom: 1px solid $c_eee;
      font-size: 28px;
      font-weight: bold;

      .detail {
        float: right;
        color: $blue;
        font-weight: 400;
      }
    }
  }

  .data_ul {
    padding: 24px 24px 40px;
    display: flex;
    justify-content: space-between;

    .data_item {
      text-align: center;

      .price {
        display: block;
        @include height(40px);
        font-size: 28px;
        font-weight: bold;
        margin-bottom: $w_10;
      }

      .text {
        display: block;
        @include height(33px);
      }
    }
  }

  .order_list {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    padding-bottom: 35px;

    .order_item {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      width: 25%;
      margin-top: 65px;

      > a {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
      }

      .img_box {
        display: inline-block;
        position: relative;
      }

      .img {
        width: 48px;
        margin: 0 auto $w_20;
      }

      .toolImg {
        width: 56px;
        margin: 0 auto $w_20;
      }

      .text {
        @include height(33px);
      }

      .number {
        position: absolute;
        top: -14px;
        right: -14px;
        z-index: 10;
        width: 28px;
        @include height(28px);
        text-align: center;
        border-radius: 50%;
        background: $white;
        color: $red;
        border: 1px solid $tips;
      }
    }
  }

  .level {
    display: flex;
    align-items: center;
    height: 30px;
    line-height: 30px;
    margin-top: 10px;
    font-size: 22px;

    &.apply {
      width: 131px;
      height: 39px;
      padding: 0 12px;
      justify-content: center;
      background: #c8473f;
      border-radius: 25px;
    }

    span {
      display: inline-block;
      height: 28px;
      line-height: 28px;
      font-size: 22px;
      font-weight: 500;
    }

    .arrow {
      width: 12px;
      height: 22px;
      margin-left: $w_10;
      transform: rotate(180deg);
    }

    .mr_70 {
      margin-right: 70px;
    }
  }
</style>
<style lang="scss" scoped>
  @import "@/css/common.scss";
  @import "./homePageScode";
</style>
