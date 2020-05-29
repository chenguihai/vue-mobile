<template>
  <div class="tollMarketData">
    <header>
      <div @click="histroyClick()">
        <img src="@/assets/arrowhead/zuo_nob.png" alt />
      </div>
      <h2>工具详情</h2>
      <MenuSlide @close="closeMenu" v-if="showMenu"></MenuSlide>
      <div class="dian" @click="onClickRight">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </header>
    <div class="detailsTools">
      <div class="detailsTools_img">
        <img :src="$store.state.ali_api_host + toolsinfo.tool_img" alt />
        <span>
          {{toolsinfo.tool_name}}
          <p>￥{{toolsinfo.price}}</p>
          <p>起</p>
        </span>
        <span v-if="toolsinfo.support_platform == '1'">
          支持平台
          <img src="../../assets/arrowhead/diannao.png" alt />
        </span>
        <span v-else-if="toolsinfo.support_platform == '2'">
          支持平台
          <img src="../../assets/arrowhead/shouji.png" alt />
        </span>
        <span v-else-if="toolsinfo.support_platform == '1,2'">
          支持平台
          <img src="../../assets/arrowhead/diannao.png" alt />
          <img src="../../assets/arrowhead/shouji.png" alt />
        </span>
      </div>
      <div class="standard">
        <van-cell @click="showPopup">
          <span>工具规格</span>
          <span>请选择规格</span>
          <img class="rightArr" src="../../assets/arrowhead/you_arrow.png" alt="">
        </van-cell>
        <van-popup v-model="show" position="bottom" round closeable>
          <div>
            <div class="shopData">
              <img :src="$store.state.ali_api_host + toolsinfo.tool_img" alt />
              <span v-if="id == 1 || id == 3">
                <p v-if="lm_list==''">￥{{toolsinfo.price}}</p>
                <p v-else>￥{{lm_list.price}}</p>
                <i v-if="lm_list==''">起</i>
              </span>
              <span v-else>
                <p>￥{{price}}</p>
                <i v-if="buyJNLM ==''">起</i>
              </span>
            </div>
            <div class="grade" v-if="id == 1 || id == 3">
              <span v-if="id == 1">会员等级</span>
              <span v-else-if="id == 3" >设计师等级</span>
              <ul class="gradeLict">
                <li
                  class="gradeLict"
                  v-for="(item,idx) in levels"
                  :key="idx"
                  :disabled="item.disabled"
                  :class="{level_active:l_index == idx,'aaaa':item.disabled}"
                >
                  <span @click.stop="levelsClick(idx)">{{item.ml_name}}</span>
                  <div v-if="item.disabled == true"></div>
                </li>
              </ul>
            </div>

            <div class="contNum" v-else>
              <span>类目个数</span>
              <van-stepper v-model="value" min="1" max="10" integer />
            </div>
            <div class="grade validity" v-if="id == 1 || id == 3">
              <span v-if="id == 1">有效期</span>
              <span v-else-if="id == 3">服务类型</span>
              <ul>
                <li
                  v-for="(item,idx) in months"
                  :key="idx"
                  @click.stop="monthClick(idx,item)"
                  :disabled="item.disabled"
                  :class="{month_active:y_index == idx,'aaaa':item.disabled}"
                >{{item.expire}}</li>
              </ul>
            </div>
            <div class="grade validity" v-else>
              <span>有效期</span>
              <ul>
                <li
                  v-for="(item , index) in buy"
                  :key="index"
                  :class="{buyActive:butIndex == index}"
                  @click.stop="buyClick(item,index)"
                >{{item.expire}}</li>
              </ul>
            </div>
          </div>
          <div class="submit" @click.stop="submitClick">
            <span>{{submitText}}</span>
          </div>
        </van-popup>
      </div>
      <div class="scroll">
        <p>购买动态：</p>
        <div class="dealScroll">
          <ul :class="{animateadMoney}">
            <li v-for="item in scrollListMoney" :key="item.id">
              <p>{{item.store_name}}</p>
              <p>在{{item.updated_at}}购买了</p>
              <p>{{item.type_name}}</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="ltzmService">
        <div>
          <h3>凌天众媒官方工具</h3>
        </div>
        <div>
          在线咨询：
          <a href="https://url.cn/59IhwSe?_type=wpa&qidian=true" target="_blank">
            <img src="../../assets/arrowhead/QQ.png" alt />
          </a>
          <p>{{store.qq}}</p>
        </div>
        <div>
          电话联系：
          <img src="../../assets/arrowhead/phone.png" alt />
          <p>{{store.tel}}</p>
        </div>
        <div>
          <span>周一至周日 9:00-20:00</span>
        </div>
        <!-- <div>
          <span>周六至周日 10:00～19:00</span>
        </div> -->
      </div>
      <div class="img">
        <div v-html="toolsinfo.description">{{toolsinfo.description}}</div>
      </div>
      <div class="submitBuy" @click.stop="submita">
        <span>立即购买</span>
      </div>
    </div>
        <upBack></upBack>

  </div>
</template>
<script>
import { Toast } from 'vant'
import { Stepper } from 'vant'
import MenuSlide from '@/components/common/MenuSlide'
import { Popup } from 'vant'
import { toolsInfo, toolsOrder } from '@/api/list'
import upBack from '@/components/service/upBack'
import router from '@/router'
export default {
  components: {
    MenuSlide,
    upBack
  },
  data () {
    return {
      showMenu: false,
      show: false,
      submitText: '立即购买',
      animateadMoney: false,
      id: this.$route.query.id,
      value: '',
      scrollListMoney: [
        {
          store_name: '服务商',
          updated_at: '2019-01-02 12:20',
          type_name: '会员升级'
        },
        {
          store_name: '服务商',
          updated_at: '2019-01-02 12:20',
          type_name: '技能类目'
        }
      ],
      tools: [],
      toolsList: [],
      dynamicNews: [],
      toolsinfo: '',
      store: {},
      buy: [],
      price: '',
      butIndex: -1,
      buyJNLM: '',
      leId: '',
      map: '',
      levels: '',
      l_index: 0,
      months: '',
      y_index: -1,
      lm_list: ''
    }
  },
  created () {
    this.init()
    this.submitText = '立即购买'
    if (this.scrollListMoney.length > 1) {
      setInterval(this.showMoney, 2000)
    }
  },
  methods: {
    init () {
      var data = {
        id: this.id
      }
      toolsInfo(data)
        .then(res => {
          // this.tools = res;
          var b = res
          if (b.tools_info.id == 3) {
            for (let i = 0; i < b.buy.length; i++) {
              b.buy[i] = {
                ...b.buy[i],
                sml_id: b.buy[i].designer_level_id,
                ml_name: b.buy[i].designer_level,
                expire: b.buy[i].service_type
              }
            }
            this.tools = b
          } else {
            this.tools = res
          }
          this.scrollListMoney = this.tools.dynamic
          this.store = this.tools.store
          this.toolsList = this.tools.tools_list
          this.toolsinfo = this.tools.tools_info
          this.price = this.toolsinfo.price
          // 用户会员德等级
          this.showPo()
        })
        .catch(err => {
          console.log(err)
        })
    },
    onClickRight () {
      this.showMenu = true
    },
    closeMenu () {
      this.showMenu = false
    },
    // 返回上一页
    histroyClick () {
      this.$router.go(-1)
    },
    showPopup () {
      this.show = true
      this.submitText = '立即购买'
      // this.showPo();
    },
    showPo () {
      let levels = [] // 存所有名称
      let map = new Map()
      if (this.id == 2) {
        this.buy = this.tools.buy
      } else {
        var { buy } = this.tools
        if (this.id == 1 && this.tools.shop_info != undefined && this.tools.shop_info.vip_level) {
          this.leId = this.tools.shop_info.vip_level.id
          for (let i = 0; i < buy.length; i++) {
            if (this.leId > buy[i].sml_id) {
              buy[i] = { ...buy[i], disabled: true }
            } else {
              buy[i] = { ...buy[i], disabled: false }
            }
          }

          buy.forEach((item, idx) => {
            // 遍历，添加所有名称到等级
            if (this.leId > item.sml_id) {
              levels.push({ ml_name: item.ml_name, disabled: true })
            } else {
              levels.push({ ml_name: item.ml_name, disabled: false })
            }
          })
        } else {
          for (let i = 0; i < buy.length; i++) {
            buy[i] = { ...buy[i], disabled: false }
          }
          buy.forEach((item, idx) => {
            // 遍历，添加所有名称到等级 添加等级判断
            levels.push({ ml_name: item.ml_name, disabled: false })
          })
        }
        // 去重
        var objItem = {},
          newAry = []
        for (var i = 0; i < levels.length; i++) {
          if (!objItem[levels[i].ml_name]) {
            newAry.push(levels[i])
            objItem[levels[i].ml_name] = true
          }
        }
        levels = newAry
        // 重组数组 遍历会员等级
        levels.forEach((l_item, l_idx) => {
          let tmp = []
          buy.forEach((item, idx) => {
            if (l_item.ml_name == item.ml_name) {
              tmp.push(item)
            }
            map.set(l_item, tmp)
          })
        })
        this.map = map
        this.levels = levels
        this.months = this.map.get(this.levels[this.l_index])
      }
    },
    // 选择会员等级
    levelsClick (idx) {
      this.lm_list = ''
      if (this.l_index == -1 || this.l_index != idx) {
        this.l_index = idx
        this.y_index = -1
        this.months = this.map.get(this.levels[this.l_index])
      } else {
        this.l_index = -1
        this.y_index = -1
        this.months = this.map.get(this.levels[0])
      }
    },
    // 点击月份切换事件
    monthClick (idx, item) {
      if (this.l_index != -1) {
        if (this.y_index == -1 || this.y_index != idx) {
          this.y_index = idx
          let { levels, y_index, l_index } = this // 获取等级数组，月份索引，等级索引
          let curMons = this.map.get(levels[l_index])
          let obj = curMons[y_index]
          this.lm_list = obj
          return obj
        } else if (this.y_index == idx) {
          this.y_index = -1
          this.lm_list = ''
        }
      } else {
        if (this.id == 1) {
          Toast('请选择会员等级')
        } else {
          Toast('请选择设计师等级')
        }
      }
    },

    // 技能类目有效期选择
    buyClick (item, index) {
      if (this.butIndex == -1 || this.butIndex != index) {
        this.butIndex = index
        this.price = item.price
        this.buyJNLM = item
      } else {
        this.butIndex = -1
        this.buyJNLM = ''
        this.price = this.buy[0].price
      }
    },
    // 确定
    submitClick () {
      if (this.l_index == -1) {
        if (this.id == 1) {
          Toast('请选择会员等级')
        } else {
          Toast('请选择设计师等级')
        }
      } else {
        if (this.id == 1 || this.id == 3) {
          // Toast("这个是会员");
          if (this.months.length < 1) {
            if (this.id == 1) {
              Toast('请选择会员等级')
            } else {
              Toast('请选择设计师等级')
            }

            this.show = true
            // this.showPo();
          } else if (this.lm_list == '' || this.lm_list.disabled == true) {
            if (this.id == 1) {
              Toast('请选择有效期')
            } else {
              Toast('请选择服务类型')
            }
            this.show = true
            // this.showPo();
          } else {
            var data = {
              id: this.id,
              buy_id: this.lm_list.id,
              number: 1
            }
            toolsOrder(data)
              .then(res => {
                if (res != false) {
                  this.$router.push({
                    path: `/payment`,
                    query: { order_sn: res, type: 3 }
                  })
                }
              })
              .catch(err => {
                console.log(err)
              })
          }
        } else if (this.id == 2) {
          if (this.buyJNLM == '') {
            Toast('请选择有效期')
            this.show = true
            // this.showPo();
          } else {
            var data = {
              id: this.id,
              buy_id: this.buyJNLM.id,
              number: this.value
            }
            toolsOrder(data)
              .then(res => {
                if (res != false) {
                  this.$router.push({
                    path: `/payment`,
                    query: { order_sn: res, type: 3 }
                  })
                }
              })
              .catch(err => {
                console.log(err)
              })
          }
        }
      }
    },
    submita () {
      let token = localStorage.getItem('token')
      if (token) {
        if (this.id == 1 || this.id == 3) {
        // Toast("这个是会员");
          if (this.months.length < 1) {
            this.show = true
          // this.showPo();
          } else if (this.lm_list == '' || this.lm_list.disabled == true) {
            this.show = true
          // this.showPo();
          } else {
            var data = {
              id: this.id,
              buy_id: this.lm_list.id,
              number: 1
            }
            toolsOrder(data)
              .then(res => {
                if (res != false) {
                  this.$router.push({
                    path: `/payment`,
                    query: { order_sn: res, type: 3 }
                  })
                }
              })
              .catch(err => {
                console.log(err)
              })
          }
        } else if (this.id == 2) {
          if (this.buyJNLM == '') {
            this.show = true
            this.showPo()
          } else {
            var data = {
              id: this.id,
              buy_id: this.buyJNLM.id,
              number: this.value
            }
            toolsOrder(data)
              .then(res => {
                if (res != false) {
                  this.$router.push({
                    path: `/payment`,
                    query: { order_sn: res, type: 3 }
                  })
                }
              })
              .catch(err => {
                console.log(err)
              })
          }
        }
      } else {
        // this.$toast('未登录或登录已失效')
        let redirect = router.currentRoute.fullPath
        router.replace({
          path: '/login',
          query: {redirect}
        })
      }
    },
    // 滚动
    showMoney () {
      this.animateadMoney = true
      setTimeout(() => {
        this.scrollListMoney.push(this.scrollListMoney[0])
        this.scrollListMoney.shift()
        this.animateadMoney = false
      }, 1000)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/css/common.scss";
@import "./tollMarketDataScode";
</style>
<style lang="scss">
.tollMarketData {
  & > .detailsTools {
    & > .standard {
      margin-top: rem(20);
      & > .van-cell {
        & > .van-cell__value {
          display: flex;
          justify-content: space-between;
          padding-right: rem(32);
          & > span {
            font-size: rem(24);
            color: #999;
          }
          & > span:nth-child(2) {
            color: #666;
          }
        }
      }
      & > .van-popup {
        & > div {
          padding: rem(20) rem(20) rem(0) rem(30);
          & > .shopData {
            display: flex;
            align-items: center;
            padding-bottom: rem(30);
            border-bottom: 1px solid #eee;
            & > img {
              width: rem(120);
              height: rem(120);
            }
            & > span {
              display: flex;
              align-items: flex-end;
              font-size: rem(22);
              margin-left: rem(20);
              color: #ff0027;
              & > p {
                font-size: rem(34);
                line-height:rem(34);
              }
            }
          }
          & > .grade {
            border-bottom: 1px solid #eee;
            padding-bottom: rem(30);
            & > span {
              font-size: rem(26);
              color: #333;
            }
            & > ul {
              display: flex;
              flex-wrap: wrap;
              & > .gradeLict {
                width: rem(180);
                height: rem(56);
                font-size: rem(24);
                color: #333;
                background: #f4f6f8;
                margin: rem(20) rem(20) 0 0;
                border: 1px solid #f4f6f8;
                text-align: center;
                line-height: rem(56);
                position: relative;
                & > span {
                  display: block;
                  width: rem(180);
                  height: rem(56);
                }
                & > div {
                  width: rem(180);
                  height: rem(56);
                  position: absolute;
                  left: 0;
                  top: 0;
                  z-index: 1;
                }
              }
              & > .level_active {
                width: rem(180);
                height: rem(56);
                background: #feeded;
                border: 1px solid #f3262d;
                border-radius: rem(4);
                color: #f3262d;
                line-height: rem(54) !important;
                & > span {
                  display: block;
                  width: rem(180);
                  height: rem(56);
                  line-height: rem(54) !important;
                }
              }
              & > .aaaa {
                border: 1px solid #ddd !important;
                background: #ddd !important;
                color: #fff !important;
              }
            }
          }
          & > .contNum {
            border-bottom: 1px solid #eee;
            padding: rem(20) 0 rem(30);
            display: flex;
            justify-content: space-between;
            align-items: center;
            & > span {
              font-size: rem(26);
              color: #333;
            }
            & > .van-stepper {
              & > .van-stepper__input {
                width: rem(90);
                height: rem(56);
              }
              & > .van-stepper__minus,
              & > .van-stepper__plus {
                background: #fff;
              }
            }
          }
          & > .validity {
            border-bottom: 0;
            & > ul {
              & > li {
                font-size: rem(24);
                color: #333;
                background: #f4f6f8;
                margin: rem(20) rem(20) 0 0;
                text-align: center;
                line-height: rem(56);
                padding: rem(5) rem(30);
                border: 1px solid #f4f6f8;
                border-radius: rem(4);
              }
              & > .buyActive,
              & > .month_active {
                background: #feeded;
                border: 1px solid #f3262d;
                border-radius: rem(4);
                color: #f3262d;
              }
            }
          }
        }
        & > .submit {
          padding: 0;
          font-size: rem(30);
          color: #fff;
          height: rem(98);
          background: #f3262d;
          text-align: center;
          line-height: rem(98);
        }
      }
    }
  }
}
</style>
