<template>
  <div class="contain bg">
    <head-nav title="服务管理"></head-nav>
    <!--头部导航-->
    <van-sticky>
      <ul class="head_nav">
        <li class="item" v-for="(item,index) in navList" :key="index" @click="clickNav(index)"><span
          :class="['text',index === selectIndex ?'active':'']">{{item}}</span></li>
      </ul>
    </van-sticky>
    <!--服务列表-->
    <div class="service_list">
      <listBox ref="listBox" :refreshLoading.sync="isLoading" :listLoading.sync="listLoading" :dataArr="dataArr"
               text="您还没发布服务，马上去发布吧。"
               :dataObj="dataObj"
               @load="loadData">
        <list-manage v-for="(item) in dataArr" :item="item" :index="selectIndex" @refresh="handleRefresh"
                     :key="item.id+Math.random()"></list-manage>
      </listBox>
    </div>
    <!--无数据-->
    <!--底部按钮-->
    <fixed-btn name="发布服务" @submit="onSubmit"></fixed-btn>
    <!--回到顶部-->
    <upBack/>
  </div>
</template>

<script>
  import FixedBtn from "@/components/common/FixedBtn";
  import listBox from '@/components/service/listBox'
  import ListManage from "@/components/manage/ListManage";
  import {serviceList} from '@/api/serviceManage'
  import upBack from "@/components/service/upBack";

  export default {
    name: "serviceManage",
    components: {FixedBtn, ListManage, listBox, upBack},
    data() {
      return {
        selectIndex: 0,
        dataArr: [],
        navList: ['出售中', '待审核', '待上架', '未通过'],
        list: [],
        finished: false,
        listLoading: false,//false
        isLoading: false,//false
        error: false,
        dataObj: {},
        form: {
          page: 1,//	是	integer	页码
          status: 1,//	否	integer	状态:0待审核，1通过，2拒绝
          shelf_status: 1,//	否	integer	上架状态:0下架，1上架
          // hot_status: '',//	否	integer	店内热门状态:0关闭，1开启
          // qua_status: '',//	否	integer	店内精品状态:0关闭，1开启
          // new_status: '',//	否	integer	店内新品状态:0关闭，1开启
          // name: '',//	否	string	名称
          // id: '',//	否	integer	id
          // cate_id: '',//	否	string	一二三级分类类目id，逗号隔开(1,2,3)
          // brand_id: '',//	否	integer	品牌id
        },
        firstCount: 1
      }
    },
    created() {
      localStorage.removeItem('publishService');
      localStorage.removeItem('formShow');
    },
    methods: {
      async loadData(page) {
        page === 1 ? await this.onRefresh() : await this.getList(page)
      },
      async onRefresh() {
        await this.getList(1)
        this.isLoading = false
      },
      handleRefresh() {
        if (this.$refs.listBox.nowPage === 1) {
          this.onRefresh();
        } else {
          this.$refs.listBox.nowPage = 1;
        }
        // this.getList(1);
      },
      clickNav(index) {
        if (this.listLoading) {
          return
        }
        let data = {page: 1};
        this.selectIndex = index;
        if (index === 0) { //出售中
          data.status = 1;
          data.shelf_status = 1;
        } else if (index === 1) { //待审核
          data.status = 0;
        } else if (index === 2) { //待上架
          data.status = 1;
          data.shelf_status = 0;
        } else { //未通过
          data.status = 2;
        }
        this.form = data;
        if (this.$refs.listBox.nowPage === 1) {
          this.onRefresh();
        } else {
          this.$refs.listBox.nowPage = 1;
        }
      },
      onSubmit() {
        this.$router.push({path: '/publishService'})
      },
      async getList(page = 1) {
        this.listLoading = true
        this.form.page = page;
        const data = await serviceList(this.form);
        this.listLoading = false;
        if (!data) return
        this.firstCount = 2;
        this.dataObj = {
          current_page: data.current_page,
          total: data.total,
          per_page: data.per_page
        }
        this.dataArr = page === 1 ? data.data : [...this.dataArr, ...data.data]
        localStorage.setItem('serviceCate', JSON.stringify(data.cate));
      }
    }
  }
</script>

<style scoped lang="scss">
  .head_nav {
    display: flex;
    height: 94px;
    background: $white;
    padding: $w_20 $w_10;
    border-radius: 0 0 $w_20 $w_20;

    .item {
      text-align: center;
      flex: 1;
      font-size: 28px;
      color: $c_333;

      .text {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        position: relative;
      }

      .active {
        color: $red;

        &:after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -10px;
          height: 4px;
          width: 100%;
          background: $red;

        }
      }
    }
  }

  .service_list {
    padding-bottom: 98px;
  }

</style>
