<template>
  <div class="myRefund">
    <header>
      <div @click="histroyClick()">
        <img src="@/assets/arrowhead/zuo_nob.png" alt />
      </div>
      <h2>我的退款</h2>
      <MenuSlide @close="closeMenu" v-if="showMenu"></MenuSlide>
      <div class="dian" @click="onClickRight">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </header>
    <listBox
      :refreshLoading.sync="isLoading"
      :listLoading.sync="listLoading"
      :dataArr="refundList"
      :dataObj="dataObj"
      @load="loadData"
    >
      <div class="myRefundData" v-if="refundList.length > 0">
        <ul>
          <li v-for="(item , index) in refundList" :key="index">
            <div class="myRefundData_t" @click="shopClick(item)">
              <div>
                <img src="@/assets/userContent/shop.png" alt />
                <span>{{item.get_shop.store_name}}</span>
                <img class="imgR" src="@/assets/arrowhead/you_arrow.png" alt />
              </div>
              <div>
                <span v-if="item.status ==0">待处理</span>
                <span v-else-if="item.status ==1">已退款</span>
                <span v-else-if="item.status ==3">已取消</span>
                <span v-else>已拒绝</span>
              </div>
            </div>
            <div class="myRefundData_c">
              <div @click="orderData(item) ">
                <span v-if="item.get_order_goods != null">{{item.get_order_goods.name}}</span>
                <span v-else></span>
                <span>￥{{item.amount}}</span>
              </div>
              <div>
                <span v-if="item.reason != null">申请原因：{{item.reason.reason}}</span>
              </div>
            </div>
            <div class="myRefundData_b">
              <div>
                <span>申请时间：{{item.created_at}}</span>
              </div>
              <div>
                <span @click="refundData(item)">退款详情</span>
                <span v-if="item.status ==0" @click="cancelRefund(item)">取消</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </listBox>
    <upBack></upBack>
    <div class="reminder" v-if="flageClose">
      <h4 class="reminderData">
        <h4>温馨提示</h4>
        <div class="spanD">
          <span>您确定取消退款吗？</span>
        </div>
        <button @click="mackShop">确定</button>
      </h4>
      <div class="close" @click="closeBut">
        <img src="../../../assets/userContent/guanbi.png" alt />
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
import MenuSlide from "@/components/common/MenuSlide";
import { refund, refundSuccess } from "@/api/list";
import listBox from "@/components/service/listBox";
import upBack from "@/components/service/upBack";
export default {
  components: {
    MenuSlide,
    listBox,
    upBack
  },

  data() {
    return {
      showMenu: false,
      refundList: [],
      flageClose: false,
      ordersn: "",
      listLoading: false,
      isLoading: false,
      dataObj: {},
      page: "1"
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      // 请求数据
      var page = this.page;
      refund(page)
        .then(res => {
          this.refundList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
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
    refundData(item) {
      this.$router.push({
        path: "/userContent/homePage/refundData",
        query: { order_sn: item.order_sn }
      });
    },
    // 取消退款 弹窗
    cancelRefund(item) {
      this.flageClose = true;
      this.ordersn = item.order_sn;
    },
    // 取消退款
    mackShop() {
      var ordersn = this.ordersn;
      refundSuccess(ordersn)
        .then(res => {
          console.log(res);
          this.flageClose = false;
          this.init();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 关闭弹窗
    closeBut() {
      this.flageClose = false;
    },
    // 跳转订单详情
    orderData(item) {
      this.$router.push({
        path: `/serviceOrder?sn=${item.order_sn}`
      });
    },
    // 跳转店铺首页
    shopClick(item) {
      // this.$router.push({
      //   path: `/shopDetail/${item.store_id}`,
      // });
      window.location.href = location.origin + "/shopDetail/" + item.store_id;
    },
    // 下来刷新
    async loadData(page) {
      page === 1 ? await this.onRefresh() : await this.getList(page);
    },
    async onRefresh() {
      await this.getList(1);
      // this.$toast("刷新成功");
      this.isLoading = false;
    },
    async getList(page) {
      this.listLoading = true;
      let data = null;
      data = await refund(page);
      this.listLoading = false;
      if (!data) return;
      this.dataObj = {
        current_page: data.current_page,
        total: data.total,
        per_page: data.per_page
      };
      this.refundList =
        page === 1 ? data.data : [...this.refundList, ...data.data];
    }
  }
};
</script>
<style lang="scss">
@import "@/css/common.scss";
@import "./myRefundScode";
</style>