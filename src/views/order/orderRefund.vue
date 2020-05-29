<template>
  <div class="contain bg">
    <head-nav title="订单退款"></head-nav>
    <div class="order_wrap">
      <listBox :refreshLoading.sync="isLoading" :listLoading.sync="listLoading" :dataArr="dataArr" :dataObj="dataObj"
               @load="loadData">
        <order-item v-for="(item,index) in dataArr" :item="item" :index="index" :key="item.id"
                    @open="openPopup"></order-item>
      </listBox>
    </div>
    <!--弹框-->
    <skyPop v-model="agreeFlag" @change="emitClose">
      <template>
        <h5 class="pop-title">温馨提示</h5>
        <p class="pop-tip">您确认同意退款吗？<br> 同意后平台将赏金退回给雇主。</p>
        <div class="pop-btn" @click="emitSubmit">确定</div>
      </template>
    </skyPop>
    <upBack/>
  </div>
</template>

<script>
  import skyPop from '@/components/service/order/skyPop'
  import listBox from '@/components/service/listBox'
  import {refundList, refundStatus} from '@/api/order'
  import OrderItem from './components/orderItem'
  import upBack from "@/components/service/upBack";

  export default {
    name: "orderRefund",
    components: {skyPop, listBox, OrderItem, upBack},
    data() {
      return {
        agreeFlag: false, //false
        listLoading: false,
        isLoading: false,
        selectId: '',
        dataArr: [],
        dataObj: {},
        selectIndex: 0,
        form: {
          page: 1,//	是	integer	页码
          // order_sn: '',//	否	string	定单号
          // start_time: '',//	否	integer	搜索开始时间，例:2019-08-29
          // end_time: '',//	否	integer	搜索结束时间，例:2019-08-30
          // status: '',//	否	integer	状态
          // name: '',//	否	string	服务名称
          // nickname: '',//	否	string	用户昵称
          // reason_id: '',//	否	integer	退款原因id
        }
      }
    },
    methods: {
      async loadData(page) {
        page === 1 ? await this.onRefresh() : await this.getList(page)
      },
      async onRefresh() {
        await this.getList(1)
        this.isLoading = false
      },
      async getList(page) {
        this.listLoading = true
        const opts = {
          ...this.form,
          page
        }
        const data = await refundList(this.form)
        this.listLoading = false
        if (!data) return
        this.dataObj = data;
        this.dataArr = page === 1 ? data.data : [...this.dataArr, ...data.data];
      },
      openPopup(id, index) {
        this.selectId = id;
        this.selectIndex = index;
        this.agreeFlag = true;
      },
      emitClose() {
        this.agreeFlag = false;
      },
      emitSubmit() {
        this.refundStatusHttp(1);
      },
      async refundStatusHttp(status) {
        let params = {
          id: this.selectId,//	是	integer	退款id
          status: status,//	是	integer	状态:1退款,2拒绝
        }
        const data = await refundStatus(params);
        if (!data) return
        let item = this.dataArr[this.selectIndex];
        item.status = '已退款'
        this.$set(this.dataArr, this.selectIndex, item);
        this.emitClose();
        this.onRefresh();
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "@/css/sky-pop.scss";

  .order_wrap {

  }
</style>
<style lang="scss">
  .btn_wrap {
    .van-button--normal {
      padding: 0;
    }
  }
</style>
