<template>
  <div class="myEvaluate">
    <header>
      <div @click="histroyClick()">
        <img src="@/assets/arrowhead/zuo_nob.png" alt />
      </div>
      <h2>我的评价</h2>
      <MenuSlide @close="closeMenu" v-if="showMenu"></MenuSlide>
      <div class="dian" @click="onClickRight">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </header>
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
      :dataArr="myList"
      :dataObj="dataObj"
      @load="loadData"
    >
      <div class="myEvaluateData" v-if="myList.length > 0">
        <ul>
          <li
            v-for="(itemList , index) in myList"
            :key="index"
            v-if="indexActive==0&&itemList.u_content !='' &&  myList.length > 0 "
          >
            <div class="EvaData_top">
              <div class="EvaData_S">
                <div v-if="itemList.evaluate==1">
                  <img src="../../../assets/icon/good.png" alt />
                  <span>好评</span>
                  <van-rate
                    v-model="itemList.value"
                    allow-half
                    color="#f3262d"
                    void-icon="star"
                    size="15px"
                    readonly
                  />
                </div>
                <div v-if="itemList.evaluate==2">
                  <img src="../../../assets/icon/ordinary .png" alt />
                  <span>中评</span>
                  <van-rate
                    v-model="itemList.value"
                    allow-half
                    color="#f3262d"
                    void-icon="star"
                    size="15px"
                    readonly
                  />
                </div>
                <div v-if="itemList.evaluate==3">
                  <img src="../../../assets/icon/back.png" alt />
                  <span>差评</span>
                  <van-rate
                    v-model="itemList.value"
                    allow-half
                    color="#f3262d"
                    void-icon="star"
                    size="15px"
                    readonly
                  />
                </div>
                <div>
                  <span>{{ itemList.u_time}}</span>
                </div>
              </div>
              <div class="EvaData_C">
                <span :class="{'m-grey':itemList.evaluate>1}">{{itemList.u_content}}</span>
              </div>
            </div>
            <div class="EvaData_con" @click="EvaDataClick(itemList)">
              <span>{{itemList.name}}</span>
              <span>订单编号：{{itemList.order_sn}}</span>
            </div>
          </li>
          <li
            v-for="(itemList , index) in myList"
            :key="index"
            v-if="indexActive==1&&itemList.s_content !='' &&  myList.length > 0 "
          >
            <div class="EvaData_top">
              <div class="shopName">
                <img src="../../../assets/userContent/shop.png" alt />
                <span>{{itemList.store_name}}</span>
              </div>
              <div class="EvaData_S">
                <div v-if="itemList.s_evaluate==1">
                  <img src="../../../assets/icon/good.png" alt />
                  <span>好评</span>
                </div>
                <div v-if="itemList.s_evaluate==2">
                  <img src="../../../assets/icon/ordinary .png" alt />
                  <span>中评</span>
                </div>
                <div v-if="itemList.s_evaluate==3">
                  <img src="../../../assets/icon/back.png" alt />
                  <span>差评</span>
                </div>
                <div>
                  <span>{{ itemList.s_time}}</span>
                </div>
              </div>
              <div class="EvaData_C">
                <span>{{itemList.s_content}}</span>
              </div>
            </div>
            <div class="EvaData_con" @click="EvaDataClick(itemList)">
              <span>{{itemList.name}}</span>
              <span>订单编号：{{itemList.order_sn}}</span>
            </div>
          </li>
        </ul>
      </div>
    </listBox>
    <upBack></upBack>
  </div>
</template>
<script>
import MenuSlide from "@/components/common/MenuSlide";
import { evaluate } from "@/api/list";
import upBack from "@/components/service/upBack";
import listBox from "@/components/service/listBox";
export default {
  components: {
    MenuSlide,
    listBox,
    upBack
  },

  data() {
    return {
      value: 2,
      showMenu: false,
      table: [
        {
          tab: "我评价服务商的",
          id: "1"
        },
        {
          tab: "服务商评价我的",
          id: "2"
        }
      ],
      indexActive: 0,
      myList: [],
      listLoading: false,
      isLoading: false,
      dataObj: {},
      page: "1"
    };
  },
  created() {
    // this.init();
  },
  methods: {
    // init() {
    //   // 请求数据
    //   var page = this.page;
    //   evaluate(page)
    //     .then(res => {
    //       var myList = res.data;
    //       // for (var i = 0; i < myList.length; i++) {
    //       //   var a = Number(myList[i].attitude);
    //       //   var b = Number(myList[i].quality)
    //       //   var c = Number(myList[i].speed);
    //       //   var number = (a + b + c) / 3;
    //       //   myList[i] = { ...myList[i], value: number };
    //       //   console.log(number)
    //       // }
    //       // console.log(myList)
    //       this.myList = myList;
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
    },
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
      data = await evaluate(page);
      this.listLoading = false;
      // var myList = data.data;
      // console.log(data);

      // for (var i = 0; i < myList.length; i++) {
      //   var a = Number(myList[i].attitude);
      //   var b = Number(myList[i].quality);
      //   var c = Number(myList[i].speed);
      //   var number = (a + b + c) / 3;
      //   myList[i] = { ...myList[i], value: number };
      //   console.log(number);
      // }
      // this.myList = myList;
      if (!data) return;
      this.dataObj = {
        current_page: data.current_page,
        total: data.total,
        per_page: data.per_page
      };
      this.myList = page === 1 ? data.data : [...this.myList, ...data.data];
      for (var i = 0; i < this.myList.length; i++) {
        var a = Number(this.myList[i].attitude);
        var b = Number(this.myList[i].quality);
        var c = Number(this.myList[i].speed);
        var number = (a + b + c) / 3;
        this.myList[i] = { ...this.myList[i], value: number };
      }
    },EvaDataClick(itemList){
       this.$router.push({
        path: `/serviceOrder?sn=${itemList.order_sn}`
      });
    }
  }
};
</script>
<style lang="scss">
@import "@/css/common.scss";
@import "./myEvaluateScode";
</style>
