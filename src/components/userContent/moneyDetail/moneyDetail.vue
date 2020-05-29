<template>
  <div class="moneyDetail">
    <header>
      <div @click="histroyClick()">
        <img src="@/assets/arrowhead/zuo_nob.png" alt />
      </div>
      <h2>余额明细</h2>
      <div class="screen" @click="showPopup">
        <span>筛选</span>
        <img src="@/assets/arrowhead/screen.png" alt />
      </div>
    </header>
    <listBox
      v-if="detaiData.length > 0"
      :refreshLoading.sync="isLoading"
      :listLoading.sync="listLoading"
      :dataArr="detaiData"
      :dataObj="dataObj"
      @load="loadData"
      ref="listBox"
    >
      <div class="detailData">
        <ul>
          <li v-for="(item , index) in detaiData" :key="index">
            <div class="dataList-l">
              <span>{{item.typename}}</span>
              <!-- <span>订单号：{{item.order_sn}}</span> -->
              <span>
                {{item.created_at}}
                <p>余额：¥{{item.account_money}}</p>
              </span>
            </div>
            <div class="dataList-r">
              <span class="add" v-if="item.money_status == 1">+¥{{item.trade_money}}</span>
              <span v-else class="delet">-¥{{item.trade_money}}</span>
            </div>
          </li>
        </ul>
      </div>
    </listBox>
    <div v-else class="detailData">
      <noData />
    </div>
    <upBack></upBack>

    <van-popup
      v-model="show"
      position="right"
      class="detaiChoice"
      :style="{ height: '100%',width:'85%' }"
    >
      <div class="detaiChoiceTop">
        <div class="detaiTime">
          <span>操作时间</span>
          <ul>
            <li
              v-for="(item , index) in time"
              :key="index"
              :class="{activeTime:timeIndex == index}"
              @click="timeClick(item , index)"
            >{{item.text}}</li>
          </ul>
        </div>
        <div class="detaiTime detaiType">
          <span>类型</span>
          <ul>
            <li
              v-for="(item , index) in detaiType"
              :key="index"
              :class="{activeTime:TypeIndex == index}"
              @click="typeIndexClick(item , index)"
            >{{item.type_name}}</li>
          </ul>
        </div>
      </div>
      <div class="buttom">
        <span @click="resetClick">重置</span>
        <span @click="submitClick">确定</span>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { bodyColor } from "@/utils/mixins";
import { accountList, accountType, takeTime } from "@/api/list";
import noData from "@/components/noData";
import listBox from "@/components/service/listBox";
import upBack from "@/components/service/upBack";
export default {
  mixins: [bodyColor("fff")],
  components: {
    noData,
    listBox,
    upBack
  },

  data() {
    return {
      show: false,
      detaiType: [],
      timeIndex: 0,
      TypeIndex: 0,
      page: "1",
      time: [],
      startTime: "",
      endTime: "",
      status: "",
      detaiData: [],
      listLoading: false,
      isLoading: false,
      dataObj: {},
      timeS: ""
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      var startTime = this.startTime;
      var endTime = this.endTime;
      var status = this.status;
      var page = this.page;
      accountList(startTime, endTime, status, page)
        .then(res => {
          this.detaiData = res.data;
        })
        .catch(err => {
          console.log(err);
        });
      accountType()
        .then(res => {
          this.detaiType = res;
          this.detaiType = [{ id: "", type_name: "全部" }, ...this.detaiType];
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 返回上一页
    histroyClick() {
      this.$router.go(-1);
    },
    showPopup() {
      this.show = true;
      takeTime()
        .then(res => {
          var time = [res.time.一个月内, res.time.三个月内, res.time.一年内];
          var a = time[0].split(",");
          for (var i = 0; i < time.length; i++) {
            time[i] = { ...time[i].split(",") };
            if (i == 0) {
              time[i] = {
                startTime: time[i][0],
                endTime: time[i][1],
                text: "最近1个月"
              };
            } else if (i == 1) {
              time[i] = {
                startTime: time[i][0],
                endTime: time[i][1],
                text: "最近3个月"
              };
            } else {
              time[i] = {
                startTime: time[i][0],
                endTime: time[i][1],
                text: "最近1年"
              };
            }
          }
          this.time = [{ startTime: "", endTime: "", text: "全部" }, ...time];
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 操作时间
    timeClick(item, index) {
      this.timeIndex = index;
      this.startTime = item.startTime;
      this.endTime = item.endTime;
    },
    typeIndexClick(item, index) {
      this.TypeIndex = index;
      this.status = item.id;
    },
    // 重置
    resetClick() {
      this.timeIndex = -1;
      this.TypeIndex = -1;
      this.startTime = "";
      this.endTime = "";
      this.status = "";
    },
    // 确定
    submitClick() {
      var myDate = new Date();
      var H = myDate.getHours();
      var M = myDate.getMinutes();
      var S = myDate.getSeconds();
      console.log(H);
      console.log(M);
      console.log(S);
      
      this.timeS = H + ":" + M + ":" + S;
      console.log(this.timeS);
      this.endTime = this.endTime + " " + this.timeS;
      this.init();
      this.show = false;
      if (this.$refs.listBox.nowPage === 1) {
        this.onRefresh();
      } else {
        this.$refs.listBox.nowPage = 1;
      }
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
      data = await accountList(this.startTime, this.endTime, this.status, page);
      this.listLoading = false;
      if (!data) return;
      this.dataObj = {
        current_page: data.current_page,
        total: data.total,
        per_page: data.per_page
      };
      this.detaiData =
        page === 1 ? data.data : [...this.detaiData, ...data.data];
    }
  }
};
</script>
<style lang="scss">
@import "@/css/common.scss";
@import "./moneyDetailScode";
</style>