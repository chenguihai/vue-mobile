<template>
  <div class="moneyRecord">
    <header>
      <div @click="histroyClick()">
        <img src="@/assets/arrowhead/zuo_nob.png" alt />
      </div>
      <h2>提现记录</h2>
      <div class="screen" @click="showPopup">
        <span>筛选</span>
        <img src="@/assets/arrowhead/screen.png" alt />
      </div>
    </header>
    <listBox
      v-if="dataList.length > 0"
      :refreshLoading.sync="isLoading"
      :listLoading.sync="listLoading"
      :dataArr="dataList"
      :dataObj="dataObj"
      @load="loadData"
      ref="listBox"
    >
      <div class="detailData" v-if="dataList.length > 0">
        <ul>
          <li v-for="(item , index) in dataList" :key="index" v-if="item.type == 1">
            <div class="dataList-l">
              <span>{{item.bank_name}}{{item.bank_number}}</span>
              <span>{{item.created_at}}</span>
            </div>
            <div class="dataList-r">
              <span v-if="item.status == 1">待审核</span>
              <span v-else-if="item.status == 2">审核失败</span>
              <span v-else-if="item.status == 3">打款中</span>
              <span v-else>已提现</span>
              <span>¥{{item.money}}</span>
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
            >{{item.text}}</li>
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
import { takeList, takeTime } from "@/api/list";
import listBox from "@/components/service/listBox";
import upBack from "@/components/service/upBack";
import noData from "@/components/noData";

export default {
  mixins: [bodyColor("fff")],
  components: {
    listBox,
    upBack,
    noData
  },

  data() {
    return {
      show: false,
      detaiType: [
        { text: "全部", id: "" },
        { text: "待审核", id: "1" },
        { text: "打款中", id: "3" },
        { text: "审核未通过", id: "2" },
        { text: "已提现", id: "4" }
      ],
      timeIndex: -1,
      TypeIndex: -1,
      page: "1",
      time: [],
      startTime: "",
      endTime: "",
      status: "",
      dataList: [],
      // dataList: [],
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
      takeList(startTime, endTime, status, page)
        .then(res => {
           console.log(res);
          this.dataList = res.list.data;
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
      // let list = null;
      data = await takeList(this.startTime, this.endTime, this.status, page)
      // data = list.data;
      this.listLoading = false;
      if (!data) return;
      this.dataObj = {
        current_page: data.list.current_page,
        total: data.list.total,
        per_page: data.list.per_page
      };
      this.dataList = page === 1 ? data.list.data : [...this.dataList, ...data.list.data];
    }
  }
};
</script>
<style lang="scss">
@import "@/css/common.scss";
@import "./moneyRecordScode";
</style>