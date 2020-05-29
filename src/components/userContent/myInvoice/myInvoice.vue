<template>
  <div class="myInvoice">
    <header>
      <div @click="histroyClick()">
        <img src="@/assets/arrowhead/zuo_nob.png" alt />
      </div>
      <h2>我的发票</h2>
      <MenuSlide @close="closeMenu" v-if="showMenu"></MenuSlide>
      <div class="dian" @click="onClickRight">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </header>
    <div class="myInvoTab">
      <div class="InvoTab">
        <ul>
          <li
            v-for="(item , index) in table"
            :key="index"
            :class="{active:indexActive==index}"
            @click="tabClick(item , index)"
          >{{item.tab}}</li>
        </ul>
      </div>
      <listBox
        :refreshLoading.sync="isLoading"
        :listLoading.sync="listLoading"
        :dataArr="dataLict"
        :dataObj="dataObj"
        @load="loadData"
        ref="listBox"
      >
        <div class="InvoData" v-if="dataLict.length > 0">
          <ul>
            <li v-for=" (item , index) in dataLict " :key="index" @click="InvoDataClick(item)">
              <div class="InvoData_l">
                <div>
                  <img src="@/assets/userContent/shop.png" alt />
                  <span v-if="item.get_shop !=null">{{item.get_shop.store_name}}</span>
                </div>
                <div>
                  <span v-if="item.invoice_type==1">增值税普通发票</span>
                  <span v-else>增值税专用发票</span>
                  <span>￥{{item.money}}</span>
                </div>
                <div>
                  <span>订单编号：{{item.order_sn}}</span>
                </div>
              </div>
              <div class="InvoData_r">
                <span v-if="item.status==0">待开票</span>
                <span v-else-if="item.status==1">已开票</span>
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
import MenuSlide from "@/components/common/MenuSlide";
import { invoice } from "@/api/list";
import listBox from "@/components/service/listBox";
import upBack from "@/components/service/upBack";
export default {
  name: "myInvoice",
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
          id: "1"
        },
        {
          tab: "增值税专用发票",
          id: "2"
        },
        {
          tab: "增值税普通发票",
          id: "3"
        }
      ],
      indexActive: 0,
      showMenu: false,
      invoiceList: [],
      dataLict: [],
      listLoading: false,
      isLoading: false,
      dataObj: {},
      page: "1",
      num: 0
    };
  },
  created() {
    // this.init();
  },
  methods: {
    // init() {
    //   // 请求数据
    //   var page = this.page;
    //   invoice(page)
    //     .then(res => {
    //       this.invoiceList = res.data;
    //       this.dataLict = this.invoiceList;
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
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
    //tab切换
    tabClick(item, index) {
      this.indexActive = index;
      this.dataLict = [];
      this.invoiceList = [];
      if (this.$refs.listBox.nowPage === 1) {
        this.onRefresh();
      } else {
        this.$refs.listBox.nowPage = 1;
      }
    },
    InvoDataClick(item) {
      // window.localStorage.setItem("invoiceData", JSON.stringify(inData));
      this.$router.push({ path: "/userContent/homePage/invoiceData", query:{order_sn:item.order_sn}});
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
      data = await invoice(page);
      this.listLoading = false;
      if (!data) return;
      // this.dataLict = data.data;
      if (this.num != 0) {
        data.total = this.num;
      }
      this.dataObj = {
        current_page: data.current_page,
        total: data.total,
        per_page: data.per_page
      };
      this.dataLict = page === 1 ? data.data : [...this.dataLict, ...data.data];
      console.log(this.indexActive);
      if (this.indexActive == 0) {
      } else if (this.indexActive == 1) {
        for (var i = 0; i < this.dataLict.length; i++) {
          if (this.dataLict[i].invoice_type == 2) {
            this.invoiceList.push(this.dataLict[i]);
            console.log(this.dataLict[i]);
          }
        }

        this.dataLict = this.invoiceList;
        this.num = Object.keys(this.dataLict).length;
        console.log(this.num);
      } else {
        for (var i = 0; i < this.dataLict.length; i++) {
          if (this.dataLict[i].invoice_type == 1) {
            this.invoiceList.push(this.dataLict[i]);
            console.log(this.dataLict[i]);
          }
        }
        this.dataLict = this.invoiceList;
        this.num = Object.keys(this.dataLict).length;
        console.log(this.num);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/css/common.scss";
@import "./myInvoiceScode";
</style>
<style lang="scss">
.myInvoice {
  & > .myInvoTab {
    &>.van-pull-refresh {
       &>.van-pull-refresh__track {
         &>.van-pull-refresh__head {
          display: none;
        }
         &>.van-list {
           &>.InvoData {
            width: 100%;
            margin-top: rem(97);

            & > ul {
              & > li {
                height: rem(209);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #fff;
                border-radius: rem(20);
                padding: 0 rem(30);
                margin-bottom: rem(20);

                & > .InvoData_l {
                  & > div {
                    display: flex;
                  }
                  & > div:nth-child(1) {
                    display: flex;

                    & > img {
                      width: rem(29);
                      height: rem(28);
                      margin-right: rem(10);
                    }

                    & > span {
                      width: rem(209);
                      font-size: rem(26);
                      line-height: rem(26);
                      color: #333;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    }
                  }

                  & > div:nth-child(2) {
                    margin: rem(22) 0 rem(23);
                    height: rem(30);
                    & > span:nth-child(1) {
                      font-size: rem(26);
                      color: #666;
                      line-height: rem(26);
                    }

                    & > span:nth-child(2) {
                      font-size: rem(30);
                      color: #ff0027;
                      line-height: rem(30);
                    }
                  }

                  & > div:nth-child(3) {
                    height: rem(24);
                    & > span {
                      font-size: rem(22);
                      color: #999;
                      line-height: rem(22);
                    }
                  }
                }

                & > .InvoData_r {
                  & > span {
                    font-size: rem(22);
                    color: #ff9b2f;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>