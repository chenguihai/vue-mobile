<template>
  <div class="container bg">
    <head-nav title="自传资质详情"></head-nav>
    <!--滑动导航栏-->
    <slide-cpn type="qualify" :list="navList" :status="nowSelCla" @change="selChange"></slide-cpn>
    <ul class="qualify" v-if="typeObj.type_name">
      <li class="item">
        <h4 class="title">资质类型：{{navList[nowSelCla]}}</h4>
        <h4 class="title mt_10">授权单位：{{typeObj.type_name}}</h4>
        <p class="time">获得时间：{{typeObj.received_time}}</p>
        <div class="swipe" v-if="listObj.list.length > 0">
          <van-swipe :width="600" :height="360" :autoplay="3000" :style="{overflow:'hidden'}" @change="onChangeSwipe">
            <van-swipe-item v-for="(subItem) in listObj.list" :key="subItem.id">
              <van-image v-if="subItem.honor_img" fit="cover" :src="subItem.honor_img" :noOss="false"
                         @click="show = true" :lazy-load="true"></van-image>
            </van-swipe-item>
          </van-swipe>
        </div>
      </li>
    </ul>
    <!--无数据-->
    <not-data v-else></not-data>
    <!--预览图片-->
    <van-image-preview
      v-model="show"
      :images="viewImages"
      :startPosition="swipeIndex"
    >
      <template v-slot:index>第{{ swipeIndex }}页</template>
    </van-image-preview>
  </div>
</template>

<script>
  import SlideCpn from '@/components/SlideCpn'
  import NotData from '@/components/noData.vue'
  import {mapState} from 'vuex'

  export default {
    name: "certificateDetail",
    components: {SlideCpn, NotData},
    data() {
      return {
        navList: [],
        show: false,
        showIndex: 0,
        swipeIndex: 0,
        typeObj: {},
        viewImages: [],
        nowSelCla: 0,
        listObj: null,
        list: []
      }
    },
    created() {
      let archiveObj = localStorage.getItem('archiveObj');
      if (archiveObj) {
        let data = JSON.parse(archiveObj);
        this.list = data.selfHonorList;
        this.listObj = this.list[0];
        this.typeObj = this.listObj.list.length > 0 ? this.listObj.list[0] : null;
        this.navList = this.list.map(item => item.type_name);
        this.viewImages = this.listObj.list.map(item => this.ali_api_host + item.honor_img)
      }
    },
    methods: {
      onChangeSwipe(index) {
        this.swipeIndex = index;
        this.typeObj = this.listObj.list[index];
      },
      selChange(idx) {
        this.nowSelCla = idx;
        this.listObj = this.list[idx];
        this.typeObj = this.listObj.list.length > 0 ? this.listObj.list[0] : {};
        this.viewImages = this.listObj.list.length > 0 ? this.listObj.list.map(item => this.ali_api_host + item.honor_img) : [];
      }
    },
    computed: {
      ...mapState(['ali_api_host'])
    }
  }
</script>

<style scoped lang="scss">
  .qualify {
    background: $c_bg;

    .item {
      background: $white;
      padding: 50px 0 $w_30;

      &:not(:last-child) {
        margin-bottom: $w_20;
      }

      img {
        display: block;
        margin: 0 auto;
        width: 600px;
        height: 360px;
        pointer-events: auto;
      }
    }

    .title {
      text-align: center;
      @include height(37px);
      font-size: 26px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }

    .mt_10 {
      margin-top: $w_10;
    }

    .time {
      @include height(30px);
      font-size: 22px;
      color: $c_666;
      text-align: center;
      margin-top: $w_10;
    }

    .swipe {
      margin-top: $w_20;
    }
  }
</style>
