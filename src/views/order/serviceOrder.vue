<template>
  <div class="contain bg">
    <head-nav title="服务订单"></head-nav>
    <!--滑动导航栏-->
    <slide-cpn :status="form.status" :list="navList" type="order" @change="emitChange"></slide-cpn>
    <div class="order_wrap">
      <listBox
        ref="listBox"
        :refreshLoading.sync="isLoading"
        :listLoading.sync="listLoading"
        :dataArr="dataArr"
        :dataObj="dataObj"
        @load="loadData"
      >
        <div class="oreder_item" v-for="(item,index) in dataArr" :key="item.id">
          <div class="head">
            <span>订单编号：{{item.order_sn}}</span>
            <span class="status">{{item.order_status |orderStateFilter}}</span>
          </div>
          <a
            tag="div"
            class="middle"
            :href="`/serviceOrder?sn=${item.order_sn}`"
          >
            <div class="middle_wrap">
              <van-image
                class="logo"
                :src="item.thumb+'?x-oss-process=image/resize,m_fill,h_108,w_180'"
                :noOss="false"
                :lazy-load="true"
              ></van-image>
              <div class="name_wrap">
                <h4 class="name">{{item.name}}</h4>
                <p class="desc">{{item.spec}}</p>
              </div>
              <span class="price">￥{{item.amount}}</span>
            </div>
            <p class="desc mb_5">雇主昵称：{{item.nickname}}</p>
            <p class="desc">下单时间：{{item.created_at}}</p>
          </a>
          <div class="btn_wrap">
            <van-button
              plain
              class="btn"
              v-if="item.order_status===0 || item.order_status===1"
              @click="editOrder(item.order_sn,index,+item.amount)"
            >修改订单</van-button>
            <van-button
              :to="{path:'/serviceOrder',query:{sn:item.order_sn}}"
              plain
              class="btn active"
            >查看详情</van-button>
            <!--  1：待定-不显示状态 2：权限不足 3:未填充合同-发起合同 5：未有签名-签署合同 6：有签名-查看合同 7：订单不存在-->
            <van-button
              v-if="item.sign===6"
              plain
              class="btn active"
              :to="{path:'/serviceOrder',query:{sn:item.order_sn}}"
            >查看合同</van-button>
            <van-button
              v-else-if="item.sign===5"
              plain
              class="btn active"
              :to="{path:'/serviceOrder',query:{sn:item.order_sn}}"
            >签署合同</van-button>
            <van-button
              v-else-if="item.sign===3"
              plain
              class="btn active"
              :to="{path:'/serviceOrder',query:{sn:item.order_sn}}"
            >发起合同</van-button>
          </div>
        </div>
      </listBox>
    </div>
    <!--弹框-->
    <skyPop v-model="showPop" @change="closePop">
      <template>
        <h5 class="pop-title">修改订单价格</h5>
        <div class="pop_wrap">
          <span class="pop_label">订单金额</span>
          <van-cell-group class="pop-tip price borderLR">
            <van-field
              type="number"
              @input="verificationForm"
              v-model="formPopup.amount"
              placeholder="请输入订单金额"
            />
          </van-cell-group>
        </div>
        <div class="pop-btn" @click="changePriceHttp">确认修改</div>
      </template>
    </skyPop>
    <upBack />
  </div>
</template>

<script>
import SlideCpn from "@/components/SlideCpn";
import skyPop from "@/components/service/order/skyPop";
import listBox from "@/components/service/listBox";
import { orderList, changePrice } from "@/api/order";
import { commonRegs, commonToastRegs } from "@/utils/tool";
import upBack from "@/components/service/upBack";

const errMsgList = new Map([["amount", ["请输入订单金额"]]]);
export default {
  name: "serviceOrder",
  components: { listBox, skyPop, SlideCpn, upBack },
  data() {
    return {
      listLoading: false,
      isLoading: false,
      error: false,
      dataArr: [],
      dataObj: {},
      navList: [
        "全部",
        "待托管",
        "待接单",
        "待签署",
        "工作中",
        "待验收",
        "待评价",
        "已成交",
        "已冻结",
        "未成交"
      ],
      form: {
        page: 1, //	是	integer	页码
        // order_sn: '',//	否	string	定单号
        // start_time: '',//	否	integer	搜索开始时间，例:2019-08-29
        // end_time: '',//	否	integer	搜索结束时间，例:2019-08-30
        status: 0 //	否	integer	状态
        // name: '',//	否	string	服务名称
        // nickname: '',//	否	string	用户昵称
      },
      formPopup: {
        order_sn: "", //	是	string	定单号
        amount: "" //	是	decimal(10,2)	价格,例:1.99或1,注意:修改只可以小于原价,
      },
      formRules: ["amount"],
      showPop: false, //false
      selectIndex: 0,
      amount: 0
    };
  },
  created() {
    let { type = "" } = this.$route.query;
    if (type) {
      this.form.status = +type;
    }
  },
  methods: {
    closePop() {
      this.formPopup = {
        order_sn: "", //	是	string	定单号
        amount: "" //	是	decimal(10,2)	价格,例:1.99或1,注意:修改只可以小于原价,
      };
    },
    verificationForm() {
      this.isDisabled = commonRegs(this.formRules, this.form);
    },
    emitChange(index) {
      if (this.listLoading) {
        return;
      }
      this.form.status = index;
      if (this.$refs.listBox.nowPage === 1) {
        this.onRefresh();
      } else {
        this.$refs.listBox.nowPage = 1;
      }
    },
    editOrder(sn, index, amount) {
      this.selectIndex = index;
      this.amount = amount;
      this.formPopup.order_sn = sn;
      this.showPop = true;
    },
    async changePriceHttp() {
      let { order_sn, amount } = this.formPopup;
      if (!amount) {
        this.$toast("请输入订单金额");
        return;
      } else if (this.amount <= amount) {
        this.$toast("修改价格需小于订单金额");
        return;
      } else if (amount < 1) {
        this.$toast("不可小于1");
        return;
      }
      this.isDisabled = commonToastRegs(
        this.formRules,
        this.formPopup,
        errMsgList,
        this
      );
      if (!this.isDisabled) return;
      let data = await changePrice(this.formPopup);
      if (!data) return;
      this.showPop = false;
      let item = this.dataArr[this.selectIndex];
      item.amount = amount;
      (this.formPopup = {
        order_sn: "", //	是	string	定单号
        amount: "" //	是	decimal(10,2)	价格,例:1.99或1,注意:修改只可以小于原价,
      }),
        this.$set(this.dataArr, this.selectIndex, item);
    },
    async loadData(page) {
      page === 1 ? await this.onRefresh() : await this.getData(page);
    },
    async onRefresh() {
      await this.getData(1);
      this.isLoading = false;
    },
    async getData(page) {
      this.listLoading = true;
      let params = JSON.parse(JSON.stringify(this.form));
      params.page = page;
      params.status === 0 && delete params.status;
      const data = await orderList(params);
      this.listLoading = false;
      if (!data) return;
      this.dataObj = {
        current_page: data.current_page,
        total: data.total,
        per_page: data.per_page
      };
      this.dataArr = page === 1 ? data.data : [...this.dataArr, ...data.data];
    }
  },
  filters: {
    orderStateFilter(num) {
      // 订单状态的filter
      let name = "";
      switch (num) {
        case 0:
        case 1:
          name = "待托管";
          break;
        case 2:
          name = "待接单";
          break;
        case 3:
          name = "待签署";
          break;
        case 4:
          name = "工作中";
          break;
        case 5:
          name = "待验收";
          break;
        case 6:
          name = "待评价";
          break;
        case 7:
          name = "已成交";
          break;
        case 8:
          name = "已冻结";
          break;
        case 9:
          name = "未成交";
          break;
      }
      return name;
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/css/sky-pop.scss";

.oreder_item {
  background-color: $white;
  padding: 0 $w_30;
  font-size: 24px;
  margin: $w_20 0;
  border-radius: 20px;

  .head {
    height: 73px;
    line-height: 73px;
    color: $c_999;

    .status {
      float: right;
      color: $orange;
      font-size: 22px;
    }
  }

  .middle {
    padding: $w_30 0 35px;
    border-top: 1px solid $c_eee;
    border-bottom: 1px solid $c_eee;

    .middle_wrap {
      display: flex;
      justify-content: space-between;
      margin-bottom: 14px;

      .logo {
        width: 180px;
        height: 108px;
      }

      .name_wrap {
        flex: 1;
        margin: 0 27px 0 $w_20;
        font-size: 24px;

        .name {
          height: 66px;
          line-height: 33px;
          margin-bottom: $w_10;
          @include ellipsis(2);
        }
      }
    }

    .desc {
      @include height(33px);
      font-size: 24px;
      color: $c_999;
      @include ellipsis();
    }

    .mb_5 {
      margin-bottom: 5px;
    }

    .price {
      color: $price;
      font-size: 30px;
      font-weight: 500;
      @include height(42px);
    }
  }
}

.btn_wrap {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 90px;

  .btn {
    margin-left: $w_20;
    width: 135px;
    height: 50px;
    font-size: 24px;
    border-radius: 25px;
    text-align: center;
    line-height: 50px;
    color: $c_666;
    background: $white;
    border: 1px solid $c_ccc;
  }

  .active {
    color: $red;
    background: $white;
    border: 1px solid $red;
  }
}
</style>
<style lang="scss">
.btn_wrap {
  .van-button--normal {
    padding: 0;
  }
}
</style>
