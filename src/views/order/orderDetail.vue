<template>
  <div class="container">
    <head-nav title="订单退款详情"></head-nav>
    <div class="order_head">
      <span class="status">退款状态：{{orderDetail.status}}</span>
      <div class="btn_wrap" v-if="orderDetail.status === '待处理'">
        <van-button plain class="btn" @click="agreeRefund">同意退款</van-button>
        <van-button plain class="btn" @click="jumpOrderRefund">拒绝退款</van-button>
      </div>
    </div>
    <div class="order_content">
      <ul class="order_status">
        <!--        "待处理", "已退款", "已拒绝", "已取消"-->
        <li class="item" v-if="orderDetail.status === '待处理'">
          <span><span>{{orderDetail.created_at}}</span> 雇主申请退款</span>
        </li>
        <li class="item" v-else-if="orderDetail.status === '已退款'">
          <span><span>{{orderDetail.updated_at}}</span> 您同意退款,平台退款给雇主</span>
        </li>
        <li class="item" v-else-if="orderDetail.status === '已拒绝'">
          <div><span>{{orderDetail.updated_at}}</span> 您拒绝退款</div>
          <div class="error">拒绝原因：{{orderDetail.refuse_reason}}</div>
        </li>
        <li class="item" v-else-if="orderDetail.status === '已取消'">
          <span><span>{{orderDetail.updated_at}}</span> 雇主取消退款</span>
        </li>
      </ul>
      <div class="split_line"></div>
      <div class="order_item">
        <span class="label">申请时间：</span>
        <span class="text">{{orderDetail.created_at}}</span>
      </div>
      <ul class="detail_ul">
        <li class="dtail_li">
          <span class="label">雇主昵称：</span>
          <span class="text">{{orderDetail.nickname}}</span>
        </li>
        <li class="dtail_li">
          <span class="label">订单编号：</span>
          <span class="text">{{orderDetail.order_sn}}</span>
        </li>
        <li class="dtail_li ellipsis">
          <span class="label">申请项目：</span>
          <span class="text">{{orderDetail.name}}</span>
        </li>
        <li class="dtail_li">
          <span class="label">退款金额：</span>
          <span class="text price_red">￥<span>{{orderDetail.amount}}</span></span>
        </li>
      </ul>
      <ul class="detail_ul">
        <li class="dtail_li">
          <span class="label">退款原因：</span>
          <span class="text">{{orderDetail.apply_reason}}</span>
        </li>
        <li class="dtail_li">
          <span class="label">详细描述：</span>
          <span class="text">{{orderDetail.content}}</span>
        </li>
      </ul>
    </div>
    <div class="annex">
      <span class="annex_item" v-if="!!item" v-for="(item,index) in (orderDetail.attach ||[])" :key="index"
            @click="clickAnnex(index)">附件{{index}}</span>
    </div>
    <!--图片预览-->
    <van-image-preview
      v-model="showImage"
      :images="images"
      :startPosition="curIndex"
      @change="onChange"
    >
      <!--      <template v-slot:curIndex>第{{ curIndex }}页</template>-->
    </van-image-preview>
    <!--弹框-->
    <skyPop v-model="agreeFlag" @change="onClose">
      <template>
        <h5 class="pop-title">温馨提示</h5>
        <p class="pop-tip">您确认同意退款吗？<br> 同意后平台将赏金退回给雇主。</p>
        <div class="pop-btn" @click="onSubmit">确定</div>
      </template>
    </skyPop>
  </div>
</template>

<script>
  import skyPop from '@/components/service/order/skyPop'
  import {mapState} from 'vuex'
  import {refundList, refundStatus} from '@/api/order'

  export default {
    name: "orderDetail",
    components: {skyPop},
    data() {
      return {
        orderDetail: {},
        agreeFlag: false,
        showImage: false,
        images: [],
        curIndex: 0,
        selectId: 0,
      }
    },
    created() {
      let {id = 0} = this.$route.query;
      if (id > 0) {
        this.selectId = id;
        this.getList();
      }
    },
    methods: {
      clickAnnex(index) {
        this.showImage = true;
        this.curIndex = index;
        this.images = this.orderDetail.attach.map(item => this.imgPrefix + item)
      },
      onChange(index) {
        this.curIndex = index;
      },
      agreeRefund() {
        this.agreeFlag = true;
      },
      jumpOrderRefund() {
        this.$router.push({path: '/refusalRefund', query: {id: this.orderDetail.id, type: 'detail'}})
      },
      onClose() {
        this.agreeFlag = false;
      },
      onSubmit() {
        this.refundStatusHttp(1);
      },
      async refundStatusHttp(status) {
        let params = {
          id: this.selectId,//	是	integer	退款id
          status: status,//	是	integer	状态:1退款,2拒绝
        }
        const data = await refundStatus(params);
        if (!data) return
        this.onClose();
        this.getList();
      },
      async getList() {
        const data = await refundList({id: this.selectId})
        if (!data) return
        const [item = []] = data.data
        this.orderDetail = item;
      },
    },
    computed: {
      ...mapState({
        imgPrefix: state => state.ali_api_host
      })
    }
  }
</script>

<style scoped lang="scss">
  @import "@/css/sky-pop.scss";

  .order_head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 50px 0 $w_30;
    height: 177px;
    background: $order_bg;

    .status {
      font-size: 26px;
      color: $white;
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
  }

  .order_content {
    font-size: 22px;

    .order_status {
      .item {
        padding: $w_20 $w_30;
        line-height: 30px;

        .error {
          color: $red;
          margin-top: $w_10;
        }

        &:not(:last-child) {
          border-bottom: 1px solid $c_eee;
        }
      }
    }

    .order_item, .detail_ul {
      .label {
        color: $c_999;
      }

      .text {
        color: $c_666;
      }

      .ellipsis {
        @include ellipsis()
      }
    }

    .order_item {
      padding: 0 $w_30;
      @include height(70px) ;
    }

    .detail_ul {
      border-top: 1px solid $c_eee;
      padding: 4px $w_30;

      .dtail_li {
        margin: 16px 0;
        line-height: 30px;

        .text {
          word-break: break-all;

        }
      }
    }
  }

  .annex {
    padding: 0 $w_30;
    font-size: 22px;

    .annex_item {
      color: $blue;
      margin-right: $w_30;
      line-height: 30px;
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
