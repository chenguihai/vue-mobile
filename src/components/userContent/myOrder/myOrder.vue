<template>
  <!-- 我的订单 -->
  <div class="myOrder">
    <header>
      <div @click="histroyClick()">
        <img src="@/assets/arrowhead/zuo_nob.png" alt />
      </div>

      <h2>我的订单</h2>
      <MenuSlide @close="closeMenu" v-if="showMenu"></MenuSlide>
      <div class="dian" @click="onClickRight">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </header>
    <div class="allOrder">
      <div class="orderTab">
        <ul>
          <li
            v-for="(item , index) in table"
            :key="index"
            :class="{active:indexActive==item.id}"
            @click="tabClick(item , index)"
          >{{item.tab}}</li>
        </ul>
      </div>
      <listBox
        :refreshLoading.sync="isLoading"
        :listLoading.sync="listLoading"
        :dataArr="orderList"
        :dataObj="dataObj"
        @load="loadData"
        ref="listBox"
      >
        <div class="orderCon">
          <ul>
            <li v-for="(item , index) in orderList" :key="index">
              <div class="order_sn">
                <span>订单编号：{{item.order_sn}}</span>
                <p v-if="item.order_status ==1">待托管</p>
                <p v-else-if="item.order_status ==2">待接单</p>
                <p v-else-if="item.order_status ==3">待签署</p>
                <p v-else-if="item.order_status ==4">工作中</p>
                <p v-else-if="item.order_status ==5">待验收</p>
                <p v-else-if="item.order_status ==6">待评价</p>
                <p v-else-if="item.order_status ==7">已成交</p>
                <p v-else-if="item.order_status ==8">已冻结</p>
                <p v-else-if="item.order_status ==9">未成交</p>
              </div>
              <div class="order_data">
                <div @click="shopClick(item)" class="order_name">
                  <img src="@/assets/userContent/shop.png" alt />
                  <span>{{item.get_shop.store_name}}</span>
                  <img src="@/assets/arrowhead/you_arrow.png" alt />
                </div>
                <div class="order_con" @click=" orderData(item)">
                  <img
                    v-if="item.get_order_goods.img != null || item.get_order_goods.img!=''"
                    :src="$store.state.ali_api_host +item.get_order_goods.img"
                    alt
                  />
                  <img v-else src="@/assets/default/fuwu.png" alt />
                  <div class="orderD">
                    <span>{{item.get_order_goods.name}}</span>
                    <span>{{item.get_order_goods.spec}}</span>
                  </div>
                  <span>￥{{item.amount}}</span>
                </div>
                <!-- <span>下单时间：{{ dateFormat(item.get_order_goods.created_at*1000)}}</span> -->
                <span>下单时间：{{item.get_order_goods.created_at}}</span>
              </div>
              <div class="order_buttom">
                <!--  1：待定-不显示状态 2：权限不足 3:未填充合同-发起合同 5：未有签名-签署合同 6：有签名-查看合同 7：订单不存在-->
                <span @click="orderData(item)">查看详情</span>
                <span class="data" @click="orderData(item)" v-if="item.sign===5">签署合同</span>
                <span class="data" @click="orderData(item)" v-else-if="item.sign===3">发起合同</span>
                <span class="data" @click="orderData(item)" v-else-if="item.sign===6">查看合同</span>
                <span class="data" @click="orderPuy(item)" v-if="item.order_status==1">托管赏金</span>
                <span
                  class="spanCon"
                  v-else-if="(item.order_status==6 || item.order_status==7) && item.u_invoice_status == 0"
                  @click="invoiceClick(item)"
                >申请发票</span>
                <span
                  class="data"
                  @click="orderTK(item)"
                  v-else-if="(item.order_status==8 || item.order_status==9)&&(item.pay_status == 2)"
                >查看退款</span>
              </div>
            </li>
          </ul>
        </div>
      </listBox>
    </div>
    <upBack></upBack>
  </div>
</template>
<script>
import listBox from "@/components/service/listBox";
import { countDownMixin, bodyColor } from "@/utils/mixins";
// loginDo
import { regDaqo, checkEmptyValue } from "@/utils/tool";
import MenuSlide from "@/components/common/MenuSlide";
import { userOrder } from "@/api/list";
import { mapMutations, mapState } from "vuex";
import upBack from "@/components/service/upBack";
export default {
  name: "myOrder",
  components: {
    MenuSlide,
    listBox,
    upBack
  },
  data() {
    return {
      table: [
        {
          tab: "全部",
          id: "0"
        },
        {
          tab: "待托管",
          id: "1"
        },
        {
          tab: "待签署",
          id: "3"
        },
        {
          tab: "待验收",
          id: "5"
        },
        {
          tab: "待评价",
          id: "6"
        },
        {
          tab: "已成交",
          id: "7"
        }
      ],
      indexActive: 0,
      showMenu: false,
      created: "",
      type: "",
      title: "",
      orderList: [],
      listLoading: false,
      isLoading: false,
      dataObj: {}
    };
  },
  created() {
    if (this.$route.query.type) {
      this.type = this.$route.query.type;
      this.indexActive = this.$route.query.type;
    }
  },
  methods: {
    // 时间格式化
    // dateFormat: function(time) {
    //   var date = new Date(time);
    //   var year = date.getFullYear();
    //   /* 在日期格式中，月份是从0开始的，因此要加0
    //    * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
    //    * */
    //   var month =
    //     date.getMonth() + 1 < 10
    //       ? "0" + (date.getMonth() + 1)
    //       : date.getMonth() + 1;
    //   var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    //   var hours =
    //     date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    //   var minutes =
    //     date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    //   var seconds =
    //     date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds(); // 拼接
    //   return (
    //     year +
    //     "-" +
    //     month +
    //     "-" +
    //     day +
    //     " " +
    //     hours +
    //     ":" +
    //     minutes +
    //     ":" +
    //     seconds
    //   );
    // },
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
    // tab切换
    tabClick(item, index) {
      this.indexActive = item.id;
      this.type = this.indexActive == 0 ? "" : item.id;
      if (this.$refs.listBox.nowPage === 1) {
        this.onRefresh();
      } else {
        this.$refs.listBox.nowPage = 1;
      }
    },
    invoiceClick(item) {
      this.$router.push({
        path: "/userContent/homePage/orderInvoice",
        query: { sn: item.order_sn }
      });
    },
    // 跳转订单详情
    orderData(item) {
      this.$router.push({
        path: `/serviceOrder?sn=${item.order_sn}`
      });
    },
    // 查看退款
    orderTK(item) {
      this.$router.push({
        path: "/userContent/homePage/myRefund"
      });
    },
    //
    orderPuy(item) {
      this.$router.push({
        path: `/payment`,
        query: { order_sn: item.order_sn, type: 5 }
      });
    },
    // 跳转店铺首页
    shopClick(item) {
      // this.$router.push({
      //   path: `/shopDetail/${item.store_id}`
      // });
      window.location.href = location.origin+"/shopDetail/"+item.store_id;
    },
    // 下来刷新
    async loadData(page) {
      page === 1 ? await this.onRefresh() : await this.getList(page);
    },
    async onRefresh() {
      await this.getList(1);
      this.isLoading = false;
    },
    async getList(page) {
      this.listLoading = true;
      let data = null;
      data = await userOrder(this.created, this.type, this.title, page);
      this.listLoading = false;
      if (!data) return;
      this.dataObj = {
        current_page: data.current_page,
        total: data.total,
        per_page: data.per_page
      };
      this.orderList =
        page === 1 ? data.data : [...this.orderList, ...data.data];
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/css/common.scss";
@import "./myOrderScode";
</style>
<style lang="scss">
.myOrder {
  & > .allOrder {
    & > .van-pull-refresh {
      & > .van-pull-refresh__track {
        & > .van-pull-refresh__head {
          display: none;
        }
        & > .van-list {
          & > .orderCon {
            width: 100%;
            margin-top: rem(97);

            & > ul {
              & > li {
                height: rem(420);
                display: flex;
                flex-direction: column;
                background: #fff;
                border-radius: rem(20);
                padding: 0 rem(30);
                margin-bottom: rem(20);

                & > .order_sn {
                  height: rem(70);
                  border-bottom: rem(1) solid #eee;
                  font-size: rem(22);
                  display: flex;
                  justify-content: space-between;
                  align-items: center;

                  & > span {
                    color: #999;
                  }

                  & > p {
                    color: #ff9b2f;
                  }
                }

                & > .order_data {
                  border-bottom: rem(1) solid #eee;

                  & > .order_name {
                    height: rem(37);
                    display: flex;
                    margin: rem(20) 0;
                    align-items: center;

                    & > :nth-child(1) {
                      width: rem(29);
                      height: rem(28);
                    }

                    & > :nth-child(2) {
                      font-size: rem(26);
                      //    line-height: rem(20);
                      max-width: rem(209);
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      color: #333;
                      margin: 0 rem(20) 0 rem(10);
                    }

                    & > :nth-child(3) {
                      width: rem(12);
                      height: rem(24);
                    }
                  }

                  & > .order_con {
                    display: flex;
                    justify-content: space-between;
                    height: rem(108);

                    & > img {
                      width: rem(180);
                      height: rem(108);
                    }

                    & > .orderD {
                      display: flex;
                      flex-direction: column;
                      justify-content: space-between;

                      & > span {
                        width: rem(312);
                        font-size: rem(24);
                      }

                      & > span:nth-child(1) {
                        color: #333;
                        line-height: rem(30);
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                      }

                      & > span:nth-child(2) {
                        color: #999;
                        line-height: rem(30);
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                      }
                    }

                    & > span {
                      font-size: rem(30);
                      color: #ff0027;
                      font-weight: 500;
                    }
                  }

                  & > span {
                    display: block;
                    padding: rem(20) 0;
                    font-size: rem(24);
                    color: #999;
                  }
                }

                & > .order_buttom {
                  flex: 1;
                  display: flex;
                  justify-content: flex-end;
                  align-items: center;

                  & > span {
                    width: rem(135);
                    height: rem(50);
                    border: 1px solid #ccc;
                    border-radius: rem(25);
                    text-align: center;
                    line-height: rem(50);
                    font-size: rem(24);
                    color: #666;
                  }

                  & > .spanCon {
                    margin-left: rem(20);
                  }

                  & > .data {
                    margin-left: rem(20);
                    color: #f3262d;
                    border: 1px solid #f3262d;
                  }
                }
              }

              & > li:last-child {
                margin-bottom: 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>
