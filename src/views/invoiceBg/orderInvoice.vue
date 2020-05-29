<template>
  <div class="contain bg">
    <head-nav title="订单发票"></head-nav>
    <!--导航栏-->
    <ul class="invoice_nav">
      <li :class="['item',form.type === 2 ? 'active':'']" @click="clickNav(2)">雇主申请的发票</li>
      <li :class="['item',form.type === 1 ? 'active':'']" @click="clickNav(1)">我申请的发票</li>
      <li class="screen" @click="clickShowSide">
        <span>筛选</span>
        <van-icon name="filter-o"></van-icon>
      </li>
    </ul>
    <!--列表-->
    <div class="invoice_list">
      <listBox ref="listBox" :refreshLoading.sync="isLoading" :listLoading.sync="listLoading" :dataArr="dataArr"
               :dataObj="dataObj"
               @load="loadData">
        <div @click="jumpDetail(item.id)" class="invoice_item" v-for="(item,index) in dataArr" :key="index">
          <h4 class="name">{{item.company_name}}</h4>
          <div class="wrap"><span>{{item.invoice_type_name}}</span><span class="price">￥{{item.money}}</span><em
            class="btn">{{item.status_name}}</em></div>
          <p class="order_num">订单编号：<span>{{item.order_sn}}</span></p>
        </div>
      </listBox>
    </div>
    <side-item v-if="sideFlag" :item="params" @close="_handleClose" @submit="_handleSubmit"></side-item>
    <upBack/>
  </div>
</template>

<script>
  import {invoiceList} from "@/api/order";
  import listBox from '@/components/service/listBox'
  import SideItem from './components/sideItem'
  import upBack from "@/components/service/upBack";

  export default {
    name: "orderInvoice",
    components: {listBox, SideItem, upBack},
    data() {
      return {
        sideFlag: false,
        listLoading: false,
        isLoading: false,
        error: false,
        dataArr: [],
        dataObj: {},
        form: {
          page: 1,//	是	integer	页码
          type: 2,//	否	integer	1雇主申请的发票，2服务商申请的发票
          // status: 1,//	是	integer	状态:0待开 1已开
          // invoice_type: 2,//	是	integer	发票类型1普通 2增值税专用
          // start_time: '',//	否	integer	搜索开始时间，例:2019-08-29
          // end_time: '',//	否	integer	搜索结束时间，例:2019-08-30
          // name: '',//	否	string	收票人姓名
          // company_name: '',//	否	string	抬头
          // order_sn: '',//	否	string	定单号
        },
        params: {}
      }
    },
    methods: {
      clickShowSide() {
        this.sideFlag = true;
        const {status = '', invoice_type = 0, index = 0} = this.form;
        this.params = {
          index: index,
          status: status,
          invoice_type: invoice_type,
        }
      },
      _handleClose() {
        this.sideFlag = false;
      },
      _handleSubmit(value) {
        this.form = {...this.form, ...value};
        // this.loadData(1);
        this.refreshFun();
      },
      jumpDetail(id) {
        this.$router.push({path: '/invoiceDetail', query: {id: id, type: this.form.type}})
      },
      clickNav(type) {
        this.form.type = type;
        // this.loadData(1)
        this.refreshFun();
      },
      refreshFun() {
        if (this.$refs.listBox.nowPage === 1) {
          this.onRefresh();
        } else {
          this.$refs.listBox.nowPage = 1;
        }
      },
      async loadData(page) {
        page === 1 ? await this.onRefresh() : await this.getData(page)
      },
      async onRefresh() {
        await this.getData(1)
        this.isLoading = false
      },
      async getData(page) {
        this.listLoading = true
        this.form.page = page;
        let params = JSON.parse(JSON.stringify(this.form))
        params.status === '' && delete params.status
        params.invoice_type === 0 && delete params.invoice_type
        !params.start_time ? delete params.start_time : params.start_time = params.start_time + ' 0:0:0'
        !params.end_time ? delete params.end_time : params.end_time = params.end_time + ' 23:59:59'
        const data = await invoiceList(params)
        this.listLoading = false
        if (!data) return
        this._handleClose();
        this.dataObj = {
          current_page: data.current_page,
          total: data.total,
          per_page: data.per_page
        }
        this.dataArr = page === 1 ? data.data : [...this.dataArr, ...data.data]
      }
    },
  }
</script>

<style scoped lang="scss">
  .invoice_nav {
    display: flex;
    align-items: center;
    height: 77px;
    font-size: 26px;
    padding: 0 $w_30;
    background-color: $white;
    border-radius: 0px 0px 20px 20px;

    .item {
      margin-right: 48px;

      &:nth-child(2) {
        flex: 1;
      }
    }

    .active {
      color: $red;
    }

    .screen {
      height: 60px;
      font-size: 24px;
      font-family: $font;
      font-weight: 400;
      color: #333;
      @include flex(center);
      @include borderBox;
      /*border-left: 1px solid #eee;*/
      span {
        margin-right: 10px;
      }
    }

  }

  .invoice_list {
    font-size: 26px;

    .invoice_item {
      padding: $w_30;
      margin: $w_20 0;
      background-color: $white;

      .name {
        @include height();
      }

      .wrap {
        @include height(42px);
        font-weight: 500;
        color: $c_666;
        margin: $w_20 0;
      }

      .price {
        color: $red;
        font-size: 30px;
      }

      .btn {
        font-size: 22px;
        color: $orange;
        float: right;
      }

      .order_num {
        @include height(30px);
        font-size: 22px;
        color: $c_999;
      }
    }
  }

</style>
