<template>
  <div class="refundData">
    <header>
      <div @click="histroyClick()">
        <img src="@/assets/arrowhead/zuo_nob.png" alt/>
      </div>
      <h2>退款详情</h2>
      <MenuSlide @close="closeMenu" v-if="showMenu"></MenuSlide>
      <div class="dian" @click="onClickRight">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </header>

    <div class="refundDataList">
      <div class="refunType">
        <div v-if="dataList.status == 0">
          <span>退款状态：待处理</span>
          <!-- <span>还剩2天23小时59分</span> -->
        </div>
        <div v-else-if="dataList.status == 1">
          <span>退款状态：已退款</span>
          <span></span>
        </div>
        <div v-else-if="dataList.status == 2">
          <span>退款状态：已拒绝</span>
          <span></span>
        </div>

        <div v-else-if="dataList.status == 3">
          <span>退款状态：已取消</span>
          <span></span>
        </div>
        <div>
          <span v-if="dataList.status == 0" @click="cancelClick">取消退款</span>
        </div>
      </div>
      <div class="refunTime" v-if="dataList.status == 1">
        <span>{{dataList.updated_at}}</span>
        <span>服务商同意退款,平台退款给您</span>
      </div>
      <div class="refunTime refunTimej" v-else-if="dataList.status == 2">
        <span>{{dataList.updated_at}} 服务商拒绝退款</span>
        <span class="jjyy">拒绝原因：{{dataList.refuse_reason}}</span>
      </div>
      <!-- <div class="refunTime type_1" v-if="dataList.status == 1">
        <span>{{dataList.updated_at}}</span>
        <span>服务商同意退款</span>
      </div> -->
      <div class="refunTime type_1" v-else-if="dataList.status == 3">
        <span>{{dataList.updated_at}}</span>
        <span>您取消退款</span>
      </div>
      <div class="back" v-if="dataList.status != 0"></div>
      <div class="refunCon">
        <div class="sqTime">
          <span class="titles">申请时间：</span>
          <span>{{dataList.created_at}}</span>
        </div>
        <div class="refunRadio">
          <span>
            <span class="titles">订单编号：</span>
            <p>{{dataList.order_sn}}</p>
          </span>
          <span>
            <span class="titles">申请项目：</span>
            <p class="content">{{dataList.name}}</p>
          </span>
          <span>
            <span class="titles">退款金额：</span>
            <p>￥{{dataList.amount}}</p>
          </span>
        </div>
        <div class="refunRadio refunDesc">
          <span>
            <span class="titles">退款原因：</span>
            <p>{{dataList.reasonD}}</p>
          </span>
          <span>
            <span class="titles">详细描述：</span>
            <p class="describe">{{dataList.content}}</p>
          </span>
          <span v-if="dataList.url != ''">
            <p v-for="(item , index) in filtUrl" :key="index">
              <a :href="item" download="logo1.png">附件{{index+1}}.text</a>
            </p>
          </span>
        </div>
      </div>
    </div>
    <div class="reminder" v-if="flageClose">
      <h4 class="reminderData">
        <h4>温馨提示</h4>
        <div class="spanD">
          <span>您确定取消退款吗？</span>
        </div>
        <button @click="mackShop">确定</button>
      </h4>
      <div class="close" @click="closeBut">
        <img src="../../../assets/userContent/guanbi.png" alt/>
      </div>
    </div>
  </div>
</template>
<script>
  import {bodyColor} from "@/utils/mixins";
  import MenuSlide from "@/components/common/MenuSlide";
  import {refundSuccess, refundD} from "@/api/list";
  import {Toast} from "vant";
  import {mapState} from 'vuex'

  export default {
    mixins: [bodyColor("fff")],
    // name: "refundData",
    components: {
      MenuSlide
    },

    data() {
      return {
        showMenu: false,
        dataList: {},
        filtUrl: [],
        flageClose: false,
        orderSn: this.$route.query.order_sn
      };
    },
    created() {
      this.init()
    },
    computed: {
      ...mapState({
        aliHost: 'ali_api_host',
      })
    },
    methods: {
      init() {
        var order_sn = this.orderSn
        refundD(order_sn).then(res => {
          console.log(res)
          if (res.reason) {
            this.dataList = {...res, name: res.get_order_goods.name, reasonD: res.reason.reason}

          } else {
            this.dataList = {...res, name: res.get_order_goods.name}
          }

          console.log(this.dataList)
          this.filtImg();
        }).catch(err => {
          console.log(err)
        })
      },
      // 返回上一页
      histroyClick() {
        this.$router.go(-1);
      },
      // 取消退款 弹窗
      cancelClick() {
        this.flageClose = true;
      },
      mackShop() {
        var ordersn = this.dataList.order_sn;
        refundSuccess(ordersn)
          .then(res => {
            this.flageClose = false;
            this.$router.push({path: "/userContent/homePage/myRefund"})
          })
          .catch(err => {
            console.log(err);
          });
      },
      // 关闭弹窗
      closeBut() {
        this.flageClose = false;
      },
      // 分割附件
      filtImg() {
        var url = this.dataList.url;
        if (url != '') {
          this.filtUrl = url.replace(/\,/g, ",").split(",");
          for (var j = 0; j < this.filtUrl.length; j++) {
            this.filtUrl[j] = this.aliHost + this.filtUrl[j];
          }
        }

      },
      onClickRight() {
        this.showMenu = true;
      },
      closeMenu() {
        this.showMenu = false;
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "@/css/common.scss";
  @import "./refundDataScode";
</style>
