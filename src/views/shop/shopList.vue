<template>
  <div class="contain bg">
    <head-nav title="" @search="emitSearch" :search="form.keywords"></head-nav>
    <!--  排序/筛选-->
    <div class="sort_box">
      <sort-cpn v-model="sorts" :sort="sorts" :list="sortList" @change="sortchange"/>
      <span class="line"></span>
      <span class="screen" @click="showPopup">筛选<van-icon name="filter-o"></van-icon>
</span>
    </div>
    <!--  服务列表-->
    <div class="service_wrap">
      <listBox :refreshLoading.sync="isLoading" :listLoading.sync="listLoading" :dataArr="dataArr" :dataObj="dataObj"
               @load="loadData">
        <service-item v-for="(item,index) in dataArr" :item="item" :key="item.id"></service-item>
      </listBox>
    </div>
    <side-item v-if="sortFlag" :item="filterList" :select="sideSelect" @close="emitClose"
               @submit="emitSubmit"></side-item>
    <upBack/>
  </div>
</template>

<script>
  import SortCpn from '@/components/SortCpn'
  import SideItem from './components/sideItem'
  import ServiceItem from './components/serviceItem'
  import listBox from '@/components/service/listBox'
  import {storeList, filtrateList} from '@/api/shopList'
  import upBack from "@/components/service/upBack";
  import {EventUtil} from '@/utils/tool'

  const DESC = 'desc'
  const ASC = 'asc'

  export default {
    name: "shopList",
    components: {SortCpn, SideItem, listBox, ServiceItem, upBack},
    data() {
      return {
        sortFlag: false,
        areaFlag: false,
        sorts: {
          order: 'default',
          sort: ''
        },
        value: 2.5,
        list: [],
        finished: false,
        listLoading: false,
        isLoading: false,
        error: false,
        dataArr: [],
        dataObj: {},
        form: {
          cat_id: '',//	否	string	筛选分类id
          region_id: '',//	否	string	筛选地区id
          order: 'default',//	否	string	排序字段（’sales’,’comments’,’time’）
          sort: '',//	否	string	排序方式（’asc’,’desc’）
          keywords: '',//	否	string	搜索关键字
        },
        filterList: {},
        sideSelect: {},
        sortList: [
          {name: '综合', order: 'default', sort: ''},
          {name: '成交量', order: 'sales', sort: DESC},
          {name: '好评率', order: 'comments', sort: DESC},
          {name: '开通时间', order: 'time', sort: DESC},
        ]
      }
    },
    created() {
      const {keywords = ''} = this.$route.query;
      this.form.keywords = keywords;
      this.filtrate();
    },
    methods: {
      emitSubmit(val) {
        this.form = {...this.form, ...val};
        this.sideSelect = val;
        this.emitClose();
        this.getData(1);
      },
      emitClose() {
        this.sortFlag = false;
      },
      showPopup() {
        this.sortFlag = true;
      },
      emitSearch(val) {
        this.form.keywords = val;
        this.getData(1);
      },
      sortchange(val) {
        this.form = {...this.form, ...val};

        this.getData(1);
      },
      sideClose(data) {
        this.sortFlag = false
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
        const data = await storeList({...this.form, page: page})
        this.listLoading = false
        if (!data) return
        this.dataObj = data
        this.dataArr = page === 1 ? data.data : [...this.dataArr, ...data.data]
      },
      async filtrate() {
        let data = await filtrateList();
        if (!data) return;
        this.filterList = data;
      }
    }
  }
</script>

<style scoped lang="scss">
  .sort_box {
    @include flex;
    @include round($w_0 $w_0 $w_20 $w_20);
    height: 88px;
    padding: $w_0 $w_30;
    background: $white;

    .flex_1 {
      flex: 1;
    }
  }

  .line {
    width: 1px;
    height: 60px;
    background: $c_eee;
    margin: 0 37px 0 17px;
  }

  .screen {
    color: $c_333;
    font-size: 24px;
  }
</style>
