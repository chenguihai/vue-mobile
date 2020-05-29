<template>
  <div class="invoiceData">
    <header>
      <div @click="histroyClick()">
        <img src="@/assets/arrowhead/zuo_nob.png" alt />
      </div>
      <h2>发票详情</h2>
      <MenuSlide @close="closeMenu" v-if="showMenu"></MenuSlide>
      <div class="dian" @click="onClickRight">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </header>
    <div class="DataList">
      <div class="invoiceD">
        <h4>发票信息</h4>
        <div class="red1">
          <span>发票状态：</span>
          <span v-if="dataList.status == 0">待开票</span>
          <span v-else>已开票</span>
        </div>
        <div class="red2">
          <span>发票金额：</span>
          <span>￥{{dataList.money}}</span>
        </div>
        <div>
          <span>发票类型：</span>
          <span v-if="dataList.invoice_type == 1">增值税普通发票</span>
          <span v-else>增值税专用发票</span>
        </div>
        <div v-if="flagG">
          <span>公司名称：</span>
          <span>{{dataList.company_name}}</span>
        </div>
        <div v-if="flagG">
          <span>纳税人识别号：</span>
          <span>{{dataList.taxpayer_id}}</span>
        </div>
        <div v-if="flagG2">
          <span>注册地址：</span>
          <span>{{dataList.registration_address}}</span>
        </div>
        <div v-if="flagG2">
          <span>注册电话：</span>
          <span>{{dataList.registration_phone}}</span>
        </div>
        <div v-if="flagG2">
          <span>银行卡号：</span>
          <span>{{dataList.bank_account}}</span>
        </div>
        <div v-if="flagG2">
          <span>开户支行名称：</span>
          <span>{{dataList.deposit_bank}}</span>
        </div>
        <div v-if="flag1">
          <span>姓名：</span>
          <span>{{dataList.company_name}}</span>
        </div>
         <div>
          <span>申请时间：</span>
          <span>{{dataList.created_at}}</span>
        </div>
      </div>
      <div class="invoiceD">
        <h4>收票信息</h4>
        <div>
          <span>收票人：</span>
          <span>{{dataList.name}}／{{dataList.phone}}</span>
        </div>
        <div>
          <span>收票人地址：</span>
          <span v-if="dataList.province == dataList.city">{{dataList.province}}{{dataList.district}}{{dataList.address}}</span>
          <span v-else>{{dataList.province}}{{dataList.city}}{{dataList.district}}{{dataList.address}}</span>
        </div>
      </div>
      <div class="invoiceD" @click="invoiceDClick">
        <h4>订单信息</h4>
        <div>
          <img src="@/assets/userContent/shop.png" alt />
          <span class="shopName">{{dataList.store_name}}</span>
        </div>
        <div>
          <span>订单编号：</span>
          <span>{{dataList.order_sn}}</span>
        </div>
        <div>
          <!-- <span>下单时间：</span>
          <span>{{dataList.created_at}}</span> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MenuSlide from "@/components/common/MenuSlide";
import area from "@/assets/js/area";
import { invoiceD } from "@/api/list";
export default {
  name: "invoiceData",
  components: {
    MenuSlide
  },

  data() {
    return {
      showMenu: false,
      dataList: {},
      flagG: true,
      flagG2: true,
      flag1: false,
      area:JSON.parse(JSON.stringify(area)),
      orderSn:this.$route.query.order_sn
    };
  },
  created() {
    this.init()
    // this.dataList = JSON.parse(localStorage.getItem("invoiceData"));

  },
  methods: {
    init(){
        var order_sn =this.orderSn
      invoiceD(order_sn).then(res=>{
        console.log(res)
        this.dataList = res
        console.log(this.dataList)
         var province_list = this.area.province_list
    var city_list = this.area.city_list
    var county_list = this.area.county_list
    console.log(this.dataList.province)
    for(var i in province_list){
      if(this.dataList.province == i){
        this.dataList.province = province_list[i]
      }
    }
     for(var i in city_list){
      if(this.dataList.city == i){
        this.dataList.city = city_list[i]
      }
    }
     for(var i in county_list){
      if(this.dataList.district == i){
        this.dataList.district = county_list[i]
      }
    }
    if (this.dataList.type == 1) {
      this.flagG = false;
      this.flagG2 = false;
      this.flag1 = true;
    } else {
      if (this.dataList.invoice_type == 1) {
        this.flagG = true;
        this.flagG2 = false;
        this.flag1 = false;
      } else {
        this.flagG = true;
        this.flagG2 = true;
        this.flag1 = false;
      }
    }
      }).catch(err=>{
        console.log(err)
      })
    },
    // 返回上一页
    histroyClick() {
      this.$router.go(-1);
    },
    onClickRight() {
      this.showMenu = true;
    },
    closeMenu() {
      this.showMenu = false;
    },
    invoiceDClick(){
       this.$router.push({
        path: `/serviceOrder?sn=${this.dataList.order_sn}`
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/css/common.scss";
@import "./invoiceDataScode";
</style>
