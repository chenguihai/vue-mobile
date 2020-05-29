<template>
  <div class="myThread">
    <head-nav :title="titles"></head-nav>
    <div class="myThreadList">
      <listBox
        :refreshLoading.sync="isLoading"
        :listLoading.sync="listLoading"
        :dataArr="myThreadList"
        :dataObj="dataObj"
        @load="loadData"
      >
        <div class="thread_item" v-for="(item , index) in myThreadList" :key="index" v-if="myThreadList.length > 0"  @click="clueClick(item)">
          <div>
            <span>
              <p>¥{{item.budget_money}}</p>
              <p>{{item.title}}</p>
            </span>
            <span v-if="item.status=='N'">
              <p>待审核</p>
            </span>
            <span v-else-if="item.status=='Y'">
              <p>审核未通过</p>
              <!-- <p>({{item.reason}})</p> -->
            </span>
            <span v-else-if="item.status=='S'">
              <p>已通过审核</p>
            </span>
          </div>
          <div>
            <span>
              <p>{{item.number}}人</p>浏览
            </span>
            <span>
              <p>{{item.pay_number}}人</p>已购买
            </span>
            <span>{{item.customer_type}}</span>
            <!-- <span>手机号码：{{item.mobile}}</span>
            <span v-if="item.qq != null">QQ：{{item.qq}}</span>
            <span v-if="item.wechat != null">微信：{{item.wechat}}</span>
            <span v-if="item.email != null">邮箱：{{item.email}}</span>-->
          </div>
          <div>
            <span>发布时间：{{item.created_at}}</span>

            <span @click="clueClick(item)">线索详情</span>
          </div>
        </div>
      </listBox>
    </div>
  </div>
</template>
<script>
import listBox from "@/components/service/listBox";
import { myClue } from "@/api/list";
// import { clueList } from "@/api/order";

export default {
  name: "myThread",
  components: { listBox },
  data() {
    // let { type = 0 } = this.$route.query;
    return {
      finished: false,
      listLoading: false,
      isLoading: false,
      error: false,
      dataObj: {},
      titles: "我发布的线索", //头部标题
      page: 1,
      myThreadList: [],
      // type: +type,
      // form: {
      //   // page: 1, //	是	integer	页码
      //   // time: '', // =2019-10-10,2019-10-25&
      //   // title: '', // =测试
      //   // cluestatus: ''// = N:已关闭,Y:未关闭'
      // }
    };
  },
  methods: {
    init() {
      // 请求数据
      var page = this.page;
      myClue(page)
        .then(res => {
          this.myThreadList = res.data;
          for (var i in this.myThreadList) {
            this.myThreadList[i].created_at = this.myThreadList[i].created_at
              .replace(/\ /g, " ")
              .split(" ")[0];
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
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
      data = await myClue(page);
      this.listLoading = false;
      if (!data) return;
      this.dataObj = {
        current_page: data.current_page,
        total: data.total,
        per_page: data.per_page
      };
      this.myThreadList =
        page === 1 ? data.data : [...this.myThreadList, ...data.data];
    },
    clueClick(item) {
      // this.$router.push({
      //   path: `/clues/detail/${item.id}`
      // });
      window.location.href = location.origin+"/clues/detail/"+item.id;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/css/common.scss";
@import "./myThreadScode";
</style>
