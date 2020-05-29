<template>
  <div class="service-list-p">
    <div class="search-bar">
      <van-icon name="arrow-left" color="#666" size="0.48rem" @click.stop="$router.go(-1)"/>
      <div class="search-box">
        <div class="search-inp-box"
             @click.stop="$router.push({path:'/serviceSearch',query:{keywords:searchUIText,type:1}})">
          <van-icon class="clear" name="search" color="#666" size="0.35rem"/>
          <input type="text" class="search-inp" disabled :value="searchUIText">
        </div>
      </div>
    </div>
    <div class="list-top">
      <sortCpn v-model="sorts" :sorts="sorts" :list="sortList"></sortCpn>
      <div class="screen" @click="showSide = true">
        <span>筛选</span>
        <van-icon name="filter-o"></van-icon>
      </div>
    </div>
    <list ref="list" class="service-list-b" :oblig="oblig" :sideOblig="sideOblig" :sorts="sorts"></list>
    <transition name="van-slide-right">
      <serviceSide v-show="showSide" :show="showSide" :sideOblig="sideOblig" @close="sideClose"
                   :cid="oblig.cid"></serviceSide>
    </transition>
    <upBack/>
  </div>
</template>

<script>
  import list from '@/components/service/list'
  import sortCpn from '@/components/SortCpn/index'
  import serviceSide from '@/components/service/side'
  import {bodyColor} from '@/utils/mixins'
  import upBack from "@/components/service/upBack";

  const DESC = 'desc'
  const ASC = 'asc'
  export default {
    name: 'serviceList',
    mixins: [bodyColor('box100')],
    data() {
      return {
        sorts: {
          order: 'default',
          sort: ''
        },
        showSide: false,
        sideOblig: {
          brand: undefined, // 品牌
          field: undefined, // 领域
          region: undefined, // 地区
          price: undefined, // 价格
          traffic: undefined, // 流量
          priceMin: undefined,
          priceMax: undefined
        }, // 筛选信息
        sortList: [
          {name: '综合', order: 'default', sort: ''},
          {name: '成交量', order: 'sales', sort: DESC},
          {name: '好评率', order: 'comments', sort: DESC},
          {name: '价格', order: 'price', sort: DESC},
          {name: '最新', order: 'new', sort: DESC}
        ]
      }
    },
    computed: {
      queryData() {
        const {claid, bid, pid, keywords} = this.$route.query
        return {
          cidData: this.parseQuery(claid),
          bidData: this.parseQuery(bid),
          pidData: this.parseQuery(pid),
          kwdData: this.parseQuery(keywords)
        }
      },
      oblig() {
        let cid = this.queryData.cidData[0] && +this.queryData.cidData[0]
        let brand_id = this.queryData.bidData[0] && +this.queryData.bidData[0]
        let price_id = this.queryData.pidData[0] && +this.queryData.pidData[0]
        let keywords = this.queryData.kwdData[0] && this.queryData.kwdData[0]
        return {
          cid, // 分类id
          brand_id, // 品牌id
          price_id, // 价格id
          keywords
        }
      },
      searchUIText() {
        let txt = ''
        for (let [k, v] of Object.entries(this.queryData)) {
          if (v[0]) {
            txt = v[1] || v[0]
          }
          if (k === 'bidData' && v[0]) {
            return txt
          }
        }
        return txt
      }
    },
    components: {list, sortCpn, serviceSide, upBack},
    methods: {
      sideClose(data) {
        this.showSide = false
        if (data) this.sideOblig = data
      },
      parseQuery(s) {
        return s ? s.split(';') : [undefined, undefined]
      },
    }
  }
</script>

<style scoped lang="scss">
  .service-list-p {
    width: 100%;
    height: 100%;
    @include flex;
    flex-direction: column;

    .service-list-b {
      flex: 2;
      overflow: auto;
    }
  }

  /*=============================================
  =            搜索栏            =
  =============================================*/
  .search-box {
    width: 640px;
    height: 58px;
    background: #f4f6f8;
    @include round(100px);
    @include flex;
    font-size: 26px;
    font-family: $font;
    font-weight: 400;
    color: #666;

    .search-inp-box {
      flex: 1;
      @include borderBox;
      @include flex;
      overflow: hidden;
      height: 100%;
      background: #f4f6f8;
      @include round(100px);

      .clear {
        margin-left: 22px;
      }

      .search-inp {
        flex: 1;
        @include borderBox;
        padding: 10px 20px;
        height: 100%;
        background: #f4f6f8;
        color: #333;
      }
    }
  }

  .search-bar {
    height: 88px;
    width: 100%;
    background: #fff;
    @include borderBox;
    @include flex;
    padding: 0 30px;
    border-bottom: 1px solid #eee;
    z-index: 100;

    .cancel {
      font-size: 26px;
      font-family: $font;
      font-weight: 400;
      color: #333;
      margin-left: 20px;
    }
  }

  /*=====  End of 搜索栏  ======*/
  .list-top {
    background: #fff;
    @include round(0px 0px 20px 20px);
    @include flex;
    height: 88px;
    width: 100%;

    .screen {
      width: 145px;
      height: 60px;
      font-size: 24px;
      font-family: $font;
      font-weight: 400;
      color: #333;
      @include flex(center);
      @include borderBox;
      border-left: 1px solid #eee;

      span {
        margin-right: 10px;
      }
    }
  }
</style>
