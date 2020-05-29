<template>
  <div class="container bg">
    <head-nav title="媒介资质详情"></head-nav>
    <!--滑动导航栏-->
    <slide-cpn type="qualify" :list="navList" :status="nowSelCla" @change="selChange"></slide-cpn>
    <ul class="qualify" v-if="filterList.length > 0">
      <li class="item" v-for="(item, index) in filterList" :key="index">
        <h4 class="title">资质类型：{{navList[nowSelCla]}}</h4>
        <p class="time" v-if="nowSelCla!==0">代理时间：{{item.begin_time | timeFilter}}-{{item.end_time | timeFilter}}</p>
        <div class="swipe">
          <van-swipe @change="onChangeSwipe">
            <van-swipe-item :style="{'text-align': 'center'}"
                            v-for="(sub,subIndex) in [item.img1,item.img2,item.img3].filter(item=>item)"
                            :key="subIndex">
              <van-image v-if="sub" fit="cover" :src="sub" :noOss="false" @click="queryImage(item)"
                         :lazy-load="true"></van-image>
              <!--              <div v-if="sub" class="swipe_img" :style="{backgroundImage:'url('+ali_api_host+sub+')'}"></div>-->
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
      <!--      <template v-slot:index>第{{ swipeIndex }}页</template>-->
    </van-image-preview>
  </div>
</template>

<script>
  import SlideCpn from '@/components/SlideCpn'
  import NotData from '@/components/noData.vue'
  import {mapState} from 'vuex'

  export default {
    name: "qualifyDetail",
    components: {SlideCpn, NotData},
    data() {
      return {
        navList: ['直营媒体', '一级代理', '二级代理', '其他'],
        show: false,
        swipeIndex: 0,
        nowSelCla: 0,
        viewImages: [],
        list: [],
        filterList: [],
      }
    },
    created() {
      let archiveObj = localStorage.getItem('archiveObj');
      if (archiveObj) {
        let data = JSON.parse(archiveObj);
        this.list = data.mediaAptitudeList;
        for (let key in this.list) {
          this.filterList = this.list[key]
          this.nowSelCla = +key;
          break;
        }
      }
    },
    methods: {
      queryImage(item) {
        let arr = [item.img1, item.img2, item.img3].filter(item => item),
          data = Array.from(new Set(arr))
        this.viewImages = data.map(item => this.ali_api_host + item)
        this.show = true
      },
      onChangeSwipe(index) {
        this.swipeIndex = index;
      },
      selChange(idx) {
        this.nowSelCla = idx;
        this.filterList = this.list[idx] || [];
      }
    },
    computed: {
      ...mapState(['ali_api_host']),
    },
    filters: {
      timeFilter(val = '') {
        return val.split(' ')[0].replace(/-/g, '.');
      },
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

    .time {
      @include height(30px);
      font-size: 22px;
      color: $c_666;
      text-align: center;
      margin-top: $w_10;
    }

    .swipe {
      width: 600px;
      height: 360px;
      margin: $w_20 auto 0;
      overflow: hidden;
    }
  }
</style>
