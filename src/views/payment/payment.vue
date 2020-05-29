<template>
  <div class="m-payment-wrap">
    <head-nav title="凌天众媒收银台"></head-nav>
    <div class="m-pay-content">
      <div class="m-total-money-box">
        <h3>¥{{paymentTotal}}</h3>
        <p>应付金额</p>
      </div>
      <div class="m-pay-type">
        <div class="choice-text">选择支付方式：</div>
        <van-radio-group v-model="radio">
          <van-cell-group>
            <!--            <van-cell value-class="m-text" title="账户余额" clickable @click="radio = '1'">-->
            <!--              <van-icon-->
            <!--                slot="icon"-->
            <!--                name="../../../static/images/payment/icon-acount.png"-->
            <!--                style="line-height: inherit;"-->
            <!--              />-->
            <!--              <span>(可用余额：¥17777)</span>-->
            <!--              <van-radio checked-color="#f3262d" slot="right-icon" name="1" />-->
            <!--            </van-cell>-->
            <van-cell title="微信支付" clickable @click="radio = '2'">
              <van-icon
                slot="icon"
                name="../../../static/images/payment/icon-wx.png"
                style="line-height: inherit;"
              />
              <van-radio checked-color="#f3262d" slot="right-icon" name="2"/>
            </van-cell>
            <van-cell v-if="!$store.state.isWeixin" title="支付宝" clickable @click="radio = '1'">
              <van-icon
                slot="icon"
                name="../../../static/images/payment/icon-alipay.png"
                style="line-height: inherit;"
              />
              <van-radio checked-color="#f3262d" slot="right-icon" name="1"/>
            </van-cell>
            <van-cell value-class="m-link" title="银行卡转账" clickable @click="radio = '3'">
              <van-icon
                slot="icon"
                name="../../../static/images/payment/icon-card.png"
                style="line-height: inherit;"
              />
              <span @click="showBank=true">查看线下转账支付银行</span>
              <van-radio checked-color="#f3262d" slot="right-icon" name="3"/>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
    </div>
    <div class="m-btn-pay" @click="modePayment">立即支付</div>
    <van-popup
      class="support-list"
      v-model="showBank"
      round
      :style="{ width: '88%',height:'300px',paddingBottom:'10px' }"
       close-icon="close"
       close-icon-position="top-left"
    >
      <div class="m-bank-wrap">
        <h3 class="m-bank-title">支持转账银行</h3>
        <ul class="m-bank-list">
          <li>
            <div class="m-left-img">
              <img src="../../../static/images/payment/icon-szncsy.png" alt=""/>
            </div>
            <div class="m-right-text">
              <p>银行账号：000258691470</p>
              <p>开户名：深圳市凌天众媒科技有限公司</p>
              <p>开户行：深圳农村商业银行上合支行</p>
            </div>
          </li>
          <li>
            <div class="m-left-img">
              <img src="../../../static/images/payment/icon-zs.png" alt=""/>
            </div>
            <div class="m-right-text">
              <p>银行账号：755949468110806</p>
              <p>开户名：深圳市凌天众媒科技有限公司</p>
              <p>开户行：深圳市万科云城支行</p>
            </div>
          </li>
          <li>
            <div class="m-left-img">
              <img src="../../../static/images/payment/icon-gs.png" alt=""/>
            </div>
            <div class="m-right-text">
              <p>银行账号：6232604000002873282</p>
              <p>开户名：深圳市凌天众媒科技有限公司</p>
              <p>开户行：深圳市西丽支行</p>
            </div>
          </li>
        </ul>
        <div class="m-close" @click="showBank=false" v-if="showBank">
          +
        </div>
      </div>
    </van-popup>
    <van-popup
      v-model="showAccountTips"
      round
      :style="{ width: '80%',height:'150px' }"
    >
      <div class="m-acount-wrap">
        <h3 class="m-bank-title">线下银行卡转账</h3>
        <p>您选择了线下转账支付，请牢记转账识别码并将此识别码填写在转账备注说明。</p>
        <p class="m-text-bottom">转账识别码：{{orderSn}}</p>
        <div class="m-close-account" @click="showAccountTips=false" v-if="showAccountTips">
          +
        </div>
      </div>

    </van-popup>

  </div>
</template>

<script>
  import HeadNav from '@/components/common/HeadNav'
  // eslint-disable-next-line standard/object-curly-even-spacing
  import {
    orderInfo,
    skillOrderInfo,
    serviceOrderInfo,
    cluesOrderDetail,
    payServiceClue,
    payshopclue,
    cluePayStatus,
    toolsPay,
    toolsOrderStatus,
    skillPayment,
    paymentService,
    skillCheckStatus,
    serviceOrderStatus
  } from '@/api/payment'
  import {Toast, Dialog} from 'vant'
import { apiUrl } from '@/utils/apiUrl'
  export default {
    name: 'payment',
    data() {
      return {
        radio: '2',
        showBank: false,
        showAccountTips: false,
        showMenu: false,
        type: 1,
        getPayStatusNum: 0,
        paymentTotal: 0,
        payBankShow: true,
        htmls: '',
        timer: 0,
        dialogFormVisible: false,
        dialogTableVi: false,
        payNum: 0,
        userMoney: '',
        wxQrCode: '',
        orderSn: '',
        cluesOrderList: [],
        skillOrderList: [],
        serviceOrderList: [],
        payDomain: 'https://' + document.domain,

        payPath: '',
      }
    },
    components: {
      HeadNav
    },
    methods: {
      async init() {
        let _this = this;
        //当前账户余额
        // accountMoney().then(res=>{
        //   console.log(res)
        //    this.userMoney = res.data.money;
        // }).catch(err=>{
        //   console.log(err)
        // })
        if (this.type == 2 || this.type == 1) {
          var data = {
            order_sn: this.orderSn
          }
          data.type = this.type
          this.getCluesOrderDetail(data)
        } else if (this.type == 3) {
          var data = {
            order_sn: this.orderSn
          };
          _this.getOrderInfo(data);

        } else if (this.type == 4) {
          let data = {
            order_sn: this.orderSn
          }
          // 工具市场订单内容
          _this.getSkillOrderInfo(data);

        } else if (this.type == 5) { //保证金定单详情
          let data = {
            order_sn: this.orderSn
          }
          const res = await serviceOrderInfo(data)
          if (!res) return
          _this.paymentTotal = res.price

        }

      },
      async getOrderInfo(obj) {
        // 订单详情
        let _this = this
        const data = await orderInfo(obj)
        if (!data) return
        _this.orderList = data.list
        _this.paymentTotal = data.amount
      },
      async getCluesOrderDetail(obj) {
        // 订单详情
        let _this = this
        const data = await cluesOrderDetail(obj)
        if (!data) return
        _this.paymentTotal = data.price
      },
      /**
       async getCluePayStatus(obj) {
        let _this = this
        const data = await cluePayStatus(obj)
        if (!data) return
        clearInterval(_this.timer)
        // window.location.href = '/clues/detail?id=' + data.data.clue_id
        this.$router.push({path: '/clues/detail', query: {id: data.data.clue_id}})
      },
       */

      async getSkillOrderInfo(data) {
        let _this = this
        const orderInfo = await skillOrderInfo(data)
        if (!orderInfo) return
        _this.paymentTotal = orderInfo.order_amount;
        // skillOrderInfo(data)
        //   .then(res => {
        //     if(res.data.code == 200){
        //       _this.skillOrderList = [res.data.data];
        //       _this.paymentTotal = res.data.data.order_amount;
        //     }
        //   })
        //   .catch(err => {
        //     console.log(err);
        //   });
      },
      async getPaymentStatus() {
        let _this = this
        _this.getPayStatusNum++
        if (_this.getPayStatusNum >= 100) {
          clearInterval(_this.timer)
          Toast('支付失败,请重新点击确定按钮去支付')
          setTimeout(function () {
            window.location.reload()
          }, 500)
        }
        if (_this.type == 1 || _this.type == 2) { //线索查询支付状态
          let data = {
            order_sn: _this.orderSn,
            type: _this.type
          }
          let cluePayStatusData = await cluePayStatus(data)
          if (!cluePayStatusData) return
          clearInterval(_this.timer)
          // if (!cluePayStatusData) {
          //   this.$router.push('/')
          // } else {
          // this.$router.push('/clues/detail?id=' + cluePayStatusData.clue_id)
          let clueId = localStorage.getItem('clueId')
          // this.$router.push('/clues/detail/' + clueId)
          window.location.href = location.origin+"/clues/detail/"+clueId;
          // }
          // window.location.href = '/clues/detail?id=' + cluePayStatusData.clue_id
          // this.$router.push({path: '/clues/detail', query: {id: cluePayStatusData.clue_id}})
        } else if (_this.type == 3) { //查询工具支付状态  工具市场
          let data = {
            order_sn: _this.orderSn,
            type: _this.type
          }
          const dataToolOrderStatus = await toolsOrderStatus(data)
          if (!dataToolOrderStatus) return
          clearInterval(_this.timer)
          // window.location.href = `/newbieTask`
          // this.$router.push({path: '/newbieTask'})
          this.$router.push(`/userContent/homePage/homePage?type=2`)
        } else if (_this.type == 4) { // 缴纳保证金支付状态查询  保证金
          let data = {
            order_sn: _this.orderSn
          }
          const skillDataStatus = await skillCheckStatus(data)
          if (!skillDataStatus) return
          clearInterval(_this.timer)
          let storeInfo = localStorage.getItem('storeInfo')
          if (storeInfo) {
            let data = JSON.parse(storeInfo)
            if (data.store_name) {
              this.$router.push('/userContent/homePage/homePage?type=2')
            } else {
              this.$router.push(`/newbieTask`)
            }
          } else {
            this.$router.push(`/newbieTask`)
          }
          // window.location.href = `/newbieTask`
        } else if (_this.type == 5) { //服务订单
          let data = {
            order_sn: _this.orderSn
          }
          const serviceOrderStatusData = await serviceOrderStatus(data)
          if (!serviceOrderStatusData) return
          clearInterval(_this.timer)
          // window.location.href = `/userContent/homePage/myOrder`
          this.$router.push({path: '/userContent/homePage/myOrder'})
        }
      },
      payCallBack(data) {
        let _this = this
        if (_this.payNum == 2) { //微信
          // window.open(`${this.payPath}&order_sn=${data.order_sn}&token=${data.token}`, '_blank');
          window.location.href = `${this.payPath}&order_sn=${data.order_sn}&token=${data.token}`;
          _this.timer = window.setInterval(() => {
            setTimeout(_this.getPaymentStatus(), 0)
          }, 3000)
        } else if (_this.payNum == 1) { //支付宝
          if (!data) return
          let routerData = this.$router.resolve({path: '/applyText', query: {htmls: data}});
          this.htmls = data
          // let open = window.open('about:blank')
          document.write(data);
          if (open === null || typeof (open) === 'undefined') {
            window.location.href = url
            return
          }
          setTimeout(() => {
            open.location = routerData.href
          }, 300)
          _this.getPayStatusNum = 0;
          _this.timer = window.setInterval(() => {
            _this.getPaymentStatus()
          }, 3000)
        } else if (_this.payNum == 3) {
          this.showAccountTips = true
        }
      },
      async modePayment() {
        let _this = this
        this.payNum = this.radio;
        localStorage.removeItem('flag');
        if (this.type && this.type == 1) {
          let data = {
            order_sn: this.orderSn,
            pay_type: this.payNum,
            token: localStorage.getItem('token')
          }
          let _this = this
          if (this.$store.state.isWeixin && _this.payNum == 2) { //微信环境支付
            const dataPayshopClue = await payshopclue(data)
            if (_this.payNum == 3) {
              _this.showAccountTips = true
              return
            }
            if (!dataPayshopClue) {
              this.$toast('服务器出错');
            } else {
              if (dataPayshopClue.code === '422') {
                this.$toast('请用微信登录绑定该账号后支付');
              } else {
                this.weixinPay(dataPayshopClue.data)
              }
            }
            return
          }
          if (_this.payNum == 2) {//浏览器微信支付
            _this.payPath = _this.payDomain + `/api/user/clue/payshopclue?pay_type=${data.pay_type}`
            localStorage.setItem('flag', 'callback')
            _this.payCallBack(data)
          } else if (_this.payNum == 1 || _this.payNum == 3) {
            const dataPayshopClue = await payshopclue(data)
            if (!dataPayshopClue) return
            if (_this.payNum == 3) {
              _this.showAccountTips = true;
              return
            }
            _this.payCallBack(dataPayshopClue)
            _this.timer = window.setInterval(() => {
              setTimeout(_this.getPaymentStatus(), 0)
            }, 3000)
          }
        } else if (this.type && this.type == 2) {
          let data = {
            order_sn: this.orderSn,
            pay_type: this.payNum,
            token: localStorage.getItem('token')
          }
          if (this.$store.state.isWeixin && _this.payNum == 2) {////微信环境支付
            const dataPayServiceClue = await payServiceClue(data)
            if (!dataPayServiceClue) {
              this.$toast('服务器出错');
            } else {
              if (dataPayServiceClue.code === '422') {
                this.$toast('请用微信登录绑定该账号后支付');
              } else {
                this.weixinPay(dataPayServiceClue.data)
              }
            }
            return
          }
          if (_this.payNum == 2) {//浏览器微信支付
            _this.payPath = _this.payDomain + `/api/user/clue/payserviceclue?pay_type=${data.pay_type}`
            localStorage.setItem('flag', 'callback')
            _this.payCallBack(data)
          } else if (_this.payNum == 1 || _this.payNum == 3) {
            const dataPayServiceClue = await payServiceClue(data)
            if (!dataPayServiceClue) return
            _this.payCallBack(dataPayServiceClue)
          }
        } else if (this.type && this.type == 3) {
          let data = {
            order_sn: this.orderSn,
            pay_id: this.payNum,
            token: localStorage.getItem('token')
          }
          _this.toolsPayRequest(data)

        } else if (this.type && this.type == 4) {
          let data = {
            order_sn: this.orderSn,
            pay_id: this.payNum,
            token: localStorage.getItem('token')
          }
          _this.skillPay(data)
        } else if (this.type && this.type == 5) {
          let data = {
            order_sn: this.orderSn,
            pay_id: this.payNum,
            token: localStorage.getItem('token')
          }
          if (this.$store.state.isWeixin && _this.payNum == 2) {//微信环境支付
            const dataPaymentService = await paymentService(data)
            if (!dataPaymentService) {
              this.$toast('服务器出错');
            } else {
              if (dataPaymentService.code === '422') {
                this.$toast('请用微信登录绑定该账号后支付');
              } else {
                this.weixinPay(dataPaymentService.data)
              }
            }
            return
          }
          if (_this.payNum == 2) { //浏览器微信支付
            _this.payPath = _this.payDomain + `/api/service/payment?pay_id=${data.pay_id}`
            localStorage.setItem('flag', 'callback')
            _this.payCallBack(data)
          } else if (_this.payNum == 1 || _this.payNum == 3) {
            const dataPaymentService = await paymentService(data)
            if (!dataPaymentService) return
            _this.payCallBack(dataPaymentService)
          }
        }
      },
      async weixinPaybackGoto() {
        let _this = this
        if (_this.type == 1 || _this.type == 2) {//查询支付状态 1 线索订单，2 线索增值服务订单
          let data = {
            order_sn: _this.orderSn,
            type: _this.type
          }
          // let cluePayStatusData = await cluePayStatus(data)
          // if (!cluePayStatusData) {
          //   this.$router.push('/')
          // } else {
          // this.$router.push('/clues/detail?id=' + cluePayStatusData.clue_id)
          let clueId = localStorage.getItem('clueId')
          // this.$router.push('/clues/detail/' + clueId)
          window.location.href = location.origin+"/clues/detail/"+clueId;
          // }
        } else if (_this.type == 3) { //工具市场
          this.$router.push(`/userContent/homePage/homePage?type=2`)
        } else if (_this.type == 4) { //保证金
          let storeInfo = localStorage.getItem('storeInfo')
          if (storeInfo) {
            let data = JSON.parse(storeInfo)
            if (data.store_name) {
              this.$router.push('/userContent/homePage/homePage?type=2')
            } else {
              this.$router.push(`/newbieTask`)
            }
          } else {
            this.$router.push(`/newbieTask`)
          }
        } else if (_this.type == 5) { //服务订单
          this.$router.push(`/userContent/homePage/myOrder`)
        }
      },
      weixinPay: function (data) {
        var vm = this
        if (typeof WeixinJSBridge == "undefined") {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', vm.onBridgeReady, false);
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', vm.onBridgeReady)
            document.attachEvent('onWeixinJSBridgeReady', vm.onBridgeReady)
          }
        } else {
          vm.onBridgeReady(data);
        }
      },
      onBridgeReady: function (data) {
        var vm = this
        // eslint-disable-next-line no-undef
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            "appId": data.appId,
            "timeStamp": data.timeStamp,
            "nonceStr": data.nonceStr,
            "package": data.package,
            "signType": data.signType,
            "paySign": data.paySign
          },
          function (res) {
            // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            vm.weixinPaybackGoto()
          },
        );
      },
      async toolsPayRequest(data) {
        let _this = this
        if (this.$store.state.isWeixin && _this.payNum == 2) {//微信环境支付
          const toolsPayBack = await toolsPay(data)
          if (!toolsPayBack) {
            this.$toast('服务器出错');
          } else {
            if (toolsPayBack.code === '422') {
              this.$toast('请用微信登录绑定该账号后支付');
            } else {
              this.weixinPay(toolsPayBack.data)
            }
          }
          return
        }
        if (_this.payNum == 2) {//浏览器微信支付
          _this.payPath = _this.payDomain + `/api/tools/pay?pay_id=${data.pay_id}`
          localStorage.setItem('flag', 'callback')
          _this.payCallBack(data)
        } else if (_this.payNum == 1 || _this.payNum == 3) {
          const toolsPayBack = await toolsPay(data)
          if (!toolsPayBack) return
          _this.payCallBack(toolsPayBack);
        }
      },
      async skillPay(obj) {
        let _this = this;
        if (this.$store.state.isWeixin && _this.payNum == 2) { //微信环境支付
          const data = await skillPayment(obj)
          if (!data) {
            this.$toast('服务器出错');
          } else {
            if (data.code === '422') {
              this.$toast('请用微信登录绑定该账号后支付');
            } else {
              this.weixinPay(data.data)
            }
          }
          return
        }
        if (_this.payNum == 2) { //浏览器微信支付
          _this.payPath = _this.payDomain + `/api/skill/payment?pay_id=${obj.pay_id}`
          localStorage.setItem('flag', 'callback')
          _this.payCallBack(obj)
        } else if (_this.payNum == 1 || _this.payNum == 3) {
          const data = await skillPayment(obj)
          if (!data) return
          _this.payCallBack(data);
        }
      }
    },
    mounted() {
      document.title = '凌天众媒收银台'
      const {order_sn, type} = this.$route.query
      this.orderSn = order_sn;
      this.type = type;
      // this.init();
      let callback = localStorage.getItem('flag');
      if (callback === 'callback') {
        Dialog.alert({
          message: '支付请求已受理，切勿重复支付，您可稍后在相应的页面查看支付结果。'
        }).then(() => {
          localStorage.removeItem('flag')
          this.weixinPaybackGoto();
        });
      } else {
        this.init();
      }
    },
    destroyed() {
      clearInterval(this.timer)
    }
  }
</script>

<style scoped lang="scss">
  .m-payment-wrap {
    position: relative;
    min-height: 100vh;
    color: #333;

    /deep/ .van-popup {
      overflow: visible;
    }

    .m-pay-content {
      width: rem(720);
      margin: rem(15) auto;
      background: #fff;
    }

    .choice-text {
      padding-top: 37px;
      padding-bottom: 18px;
      border-top: 1px solid #eee;
      color: #666;
      margin-left: 32px;
      font-size: 24px;
    }

    .m-total-money-box {
      height: rem(140);
      text-align: center;

      h3 {
        font-size: rem(36);
        font-weight: bold;
        padding-top: rem(32);
      }

      p {
        padding-top: rem(16);
        font-size: rem(24);
      }
    }

    .m-btn-pay {
      position: absolute;
      width: rem(660);
      height: rem(88);
      line-height: rem(88);
      color: #fff;
      font-size: rem(32);
      text-align: center;
      background: $red;
      bottom: rem(82);
      left: rem(45);
    }

    .m-pay-type {
      margin-left: rem(8);
      margin-right: 40px;

      /deep/ [class*=van-hairline]::after {
        border: 0 none;
      }

      .m-text {
        position: absolute;
        left: rem(180);
        color: #999;
        top: rem(20);
        font-size: rem(24);
      }

      .van-cell__title {
        font-size: rem(24);
      }

      .m-link {
        position: absolute;
        left: rem(230);
        color: $blue;
        font-size: rem(24);
        top: rem(20);
      }

      .van-image {
        width: 20px;
        height: 20px;
        margin-right: rem(10);
      }
    }

    .m-bank-title {
      padding-top: rem(29);
      padding-bottom: rem(37);
      text-align: center;
      color: #333;
      font-size: rem(30);
    }

    .m-bank-wrap {
      position: relative;
    }

    .m-bank-list {
      padding-left: rem(14);

      li {
        display: flex;
        padding-bottom: rem(64);
        justify-content: flex-start;
        align-items: center;

        .m-left-img {
          width: rem(204);
          height: rem(50);

          img {
            width: rem(204);
            height: rem(50);
          }
        }

        .m-right-text {
          line-height: 1.5em;
          color: #666;
          font-size: rem(24);
          padding-left: rem(26);
        }
      }
    }

    .m-close {
      z-index: 10000;
      position: absolute;
      bottom: rem(-150);
      width: rem(78);
      height: rem(78);
      line-height: rem(68);
      font-size: rem(60);
      left: 50%;
      color: #fff;
      text-align: center;
      margin-left: rem(-39);
      border: 1px solid #fff;
      -webkit-border-radius: rem(39);
      -moz-border-radius: rem(39);
      border-radius: rem(39);
      transform: rotate(45deg);
    }

    .m-close-account {
      z-index: 10000;
      position: absolute;
      bottom: rem(-280);
      width: rem(78);
      height: rem(78);
      line-height: rem(68);
      font-size: rem(60);
      left: 50%;
      color: #fff;
      text-align: center;
      margin-left: rem(-39);
      border: 1px solid #fff;
      -webkit-border-radius: rem(39);
      -moz-border-radius: rem(39);
      border-radius: rem(39);
      transform: rotate(45deg);
    }

    .m-acount-wrap {
      padding: 0 rem(66);
      font-size: rem(24);
      color: #666;
      height: 150px;
      position: relative;
      line-height: 1.5em;
    }

    .m-text-bottom {
      text-align: center;
      font-size: rem(28);
      margin-top: rem(38);
      white-space: nowrap;
    }
  }

  .m-menu-btn {
    color: #999;
    font-size: rem(60);
  }
</style>
