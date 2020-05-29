<template>
  <div class="container bg">
    <head-nav title="发票详情"></head-nav>
    <!--发票信息-->
    <div class="invoice_wrap">
      <h4 class="title">发票信息</h4>
      <ul class="invoice_ul">
        <li class="invoice_li">
          <span class="label">发票状态：</span>
          <span class="text red">{{detail.status_name}}</span>
        </li>
        <li class="invoice_li">
          <span class="label">发票金额：</span>
          <span class="text red">￥{{detail.money}}</span>
        </li>
        <li class="invoice_li">
          <span class="label">发票类型：</span>
          <span class="text">{{detail.invoice_type_name}}</span>
        </li>
        <li class="invoice_li">
          <span class="label">公司名称：</span>
          <span class="text">{{detail.company_name}}</span>
        </li>
        <li class="invoice_li" v-if="detail.type ===2">
          <span class="label">纳税人识别号：</span>
          <span class="text">{{detail.taxpayer_id}}</span>
        </li>
        <template v-if="detail.invoice_type_name === '增值税专用发票'">
          <li class="invoice_li">
            <span class="label">注册地址：</span>
            <span class="text">{{detail.registration_address}}</span>
          </li>
          <li class="invoice_li">
            <span class="label">注册电话：</span>
            <span class="text">{{detail.registration_phone}}</span>
          </li>
          <li class="invoice_li">
            <span class="label">银行卡号：</span>
            <span class="text">{{detail.bank_account}}</span>
          </li>
          <li class="invoice_li">
            <span class="label">开户支行名称：</span>
            <span class="text">{{detail.deposit_bank}}</span>
          </li>
        </template>
      </ul>
    </div>
    <!--收票信息-->
    <div class="invoice_wrap">
      <h4 class="title">收票信息</h4>
      <ul class="invoice_ul">
        <li class="invoice_li">
          <span class="label">收票人：</span>
          <span class="text">{{detail.name}}／{{detail.phone}}</span>
        </li>
        <li class="invoice_li">
          <span class="label">收票人地址：</span>
          <span class="text">{{addressCpt}}{{detail.address}}</span>
        </li>
      </ul>
    </div>
    <!--订单信息-->
    <a
      tag="div"
      :href="`/serviceOrder?sn=${detail.order_sn}`"
      :class="['invoice_wrap',detail.status_name !== '已开票'?'active':'']"
    >
      <h4 class="title">订单信息</h4>
      <ul class="invoice_ul">
        <li class="invoice_li">
          <span class="label">下单用户：</span>
          <span class="text">{{detail.username}}</span>
        </li>
        <li class="invoice_li">
          <span class="label">订单编号：</span>
          <span class="text">{{detail.order_sn}}</span>
        </li>
        <li class="invoice_li">
          <span class="label">下单时间：</span>
          <span class="text">{{detail.order_created}}</span>
        </li>
      </ul>
    </a>
    <!--    detail.status_name !== '已开票'-->
    <fixed-btn v-if="form.type !== 1" name="确认开票" :fixed="0" @submit="saveSubmit"></fixed-btn>
  </div>
</template>

<script>
import { invoiceList, invoiceStatus } from "@/api/order";
import FixedBtn from "@/components/common/FixedBtn";
import moment from "moment";
import { getAddressCommon } from "@/utils/tool";

export default {
  name: "invoiceDetail",
  components: { FixedBtn },
  data() {
    return {
      detail: {},
      form: {
        type: 2,
        id: 0
      }
    };
  },
  created() {
    let { id = 0, type = 2 } = this.$route.query;
    this.form = {
      id: +id,
      type: +type
    };
    this.getDetail();
  },
  methods: {
    async getDetail() {
      const data = await invoiceList(this.form);
      if (!data) return;
      const [item = {}] = data.data;
      this.detail = item;
    },
    async setStatus() {
      let params = {
        id: this.form.id, //	是	integer	发票id,多个值用逗号隔开
        status: 1 //是	integer	状态:0未开票，1开票
      };
      const data = await invoiceStatus(params);
      if (!data) return;
      this.getDetail();
    },
    saveSubmit() {
      this.setStatus();
    }
  },
  computed: {
    orderCreated() {
      return moment(this.detail.order_created * 1000).format(
        "YYYY-MM-DD HH:mm"
      );
    },
    addressCpt() {
      const { province, city, district } = this.detail;
      return getAddressCommon(province, city, district);
    }
  }
};
</script>

<style scoped lang="scss">
.invoice_wrap {
  margin: $w_20 0;
  padding: $w_30;
  background-color: $white;
  display: block;
  &.active {
    margin-bottom: 120px;
  }

  .title {
    @include height(40px);
    font-size: 28px;
    margin-bottom: $w_10;
  }

  .invoice_ul {
    font-size: 24px;

    .invoice_li {
      display: inline-flex;
      width: 100%;
      margin-top: $w_20;

      .label {
        color: $c_666;
        line-height: 33px;
      }

      .text {
        flex: 1;
        line-height: 33px;
      }

      .red {
        color: $red;
      }
    }
  }
}
</style>
