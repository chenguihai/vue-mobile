<template>
  <div class="cla-list">
    <SearchLoginBar :showInCategory="true"></SearchLoginBar>
    <div class="region-strech">
      <div class="region-left">
        <p :class="{active:nowHot === 'hot'}" @click="changeCate('hot')">热门专区</p>
        <p :class="{active:nowHot === idx}" @click="changeCate(idx)" v-for="(item, idx) in cateList" :key="item.id">
          {{item.cate_name}}</p>
      </div>
      <div class="region-right">
        <div class="ad-img-box">
          <van-image v-for="item in adImg" :key="item.id" class="cla-img" :class="!isHot ? 'nht mini' : ''"
                     :src="item.ad_img" :noOss="false" :lazy-load="true"></van-image>
        </div>
        <div class="cla-hot" v-if="hotBrand.length > 0">
          <h1 class="title">热门品牌</h1>
          <div class="cla-box">
            <div class="cla-item" v-for="item in hotBrand" :key="item.id"
                 @click="goServiceListByBrand( item.id, item.name, )">
              <van-image class="cla-logo" :src="item.logo" :noOss="false" :lazy-load="true"></van-image>
              <p>{{item.name}}</p>
            </div>
          </div>
        </div>

        <div class="cla-hot" v-if="hotCla.length > 0">
          <h1 class="title">热门分类</h1>
          <div class="cla-box">
            <div class="cla-item" v-for="item in hotCla" :key="item.id"
                 @click="goServiceList('claid', item.id, item.mobile_name)">
              <van-image class="cla-icon" :src="item.mobile_icon" :noOss="false" :lazy-load="true"></van-image>
              <p>{{item.mobile_name}}</p>
            </div>
          </div>
        </div>

        <div class="cla-hot" v-if="!isHot" v-for="item in nowClaList" :key="item.id">
          <h1 class="title">{{item.cate_name}}</h1>
          <div class="cla-box rejects-box">
            <div class="cla-item rejects" @click="goServiceList('claid', cate.id, cate.cate_name)" :class="{
              'ug-odd':item.child.length % 2 ? idx === item.child.length - 1 : idx === item.child.length - 2,
              'ug-even':!(item.child.length % 2) && idx === item.child.length - 1 ,
              'cover': item.child.length === 1,
              'double': item.child.length === 2,
              'active': cate.inh === 1,
              }" :key="cate.id" v-for="(cate, idx) in item.child">
              {{cate.cate_name}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <IndexBar></IndexBar>
  </div>
</template>

<script>
  import SearchLoginBar from '@/components/common/SearchLoginBar'
  import IndexBar from '@/components/common/Tabbar'
  import {bodyColor} from '@/utils/mixins'
  import {getIndexClaList} from '@/api/service'

  export default {
    name: 'claList',
    mixins: [bodyColor('fff box100')],
    components: {IndexBar, SearchLoginBar},
    data() {
      return {
        nowHot: 'hot',
        mockArr: Array.from({length: Math.floor(Math.random() * 20)}).fill(1),
        cateList: [],
        hotData: null
      }
    },
    computed: {
      isHot() {
        return this.nowHot === 'hot'
      },
      adImg() {
        return this.isHot ? this.hotData ? [this.hotData.ad] : [] : this.nowCate.ad
      },
      nowCate() {
        return this.isHot ? {} : this.cateList[this.nowHot]
      },
      hotBrand() {
        if (this.isHot) {
          return this.hotData ? this.hotData.brand : []
        } else {
          return this.cateList.length <= 0 ? [] : this.nowCate.brand
        }
      },
      nowClaList() {
        return this.isHot ? [] : this.nowCate.child
      },
      hotCla() {
        if (this.isHot) {
          return this.hotData ? this.hotData.cate3 : []
        } else {
          return this.cateList.length <= 0 ? [] : this.nowClaList.map(cate => cate.child ? cate.child.filter(item => item.inr === 1) : []).flat(Infinity)
        }
      }
    },
    created() {
      this.claInit()
    },
    methods: {
      async claInit() {
        const data = await getIndexClaList()
        if (!data) return
        this.cateList = data.cate
        this.hotData = data.hot
      },
      changeCate(id) {
        this.nowHot = id
      },
      goServiceList(type, id, name) {
        const query = {}
        query[type] = `${id};${name}`
        this.$router.push({path: '/serviceList', query})
      },
      goServiceListByBrand(bid, name) {
        const query = {}
        query.bid = `${bid};${name}`
        if (this.nowCate.id) {
          query.claid = `${this.nowCate.id};`
        }
        this.$router.push({path: '/serviceList', query})
      }
    }
  }
</script>

<style scoped lang="scss">
  .cla-list {
    padding-bottom: 100px;
    height: 100%;
    @include flex;
    flex-direction: column;
    @include borderBox;
    padding-top: 88px;

    .region-strech {
      border-top: 1px solid #eee;
      width: 100%;
      flex: 1;
      overflow-y: auto;
      @include flex(flex-start, flex-start);
      @include borderBox;
      flex: 1;
      color: #333;

      .region-left {
        width: 34%;//256px;
        border-right: 1px solid #eee;
        height: 100%;
        overflow-y: auto;

        p {
          @include borderBox;
          padding: 25px 0px 25px 20px;
          background: #fff;
          font-size: 24px;
          font-family: $font;
          font-weight: 400;
          color: #333;
          // height:90px;
          // line-height:90px;
          // padding-left:20px;
          &.active {
            // font-size: 28px;
            color: $red;
            border-left: 6px solid $red;
            background: #f4f6f8;
            font-weight: 500;
            // padding-left:14px;
          }
        }
      }

      .region-right {
        @include borderBox;
        flex: 1;
        height: 100%;
        overflow-y: auto;
        padding: 20px;
        padding-bottom: 45px;
        font-size: 24px;
        font-family: $font;
        font-weight: 400;

        .ad-img-box {
          width: 100%;//450px;
          @include flex;
          @include borderBox;

          .cla-img {
            flex: 1;
            height: 220px;
            margin: auto;
            @include round(10px);
            overflow: hidden;

            &.mini {
              max-width: 225px;
            }

            &:last-child {
              margin-left: 4px;
            }

            &.nht {
              height: 175px;
            }
          }
        }

        /*=============================================
        =            分类块            =
        =============================================*/

        .cla-hot {
          margin-top: 40px;

          .title {
            font-size: 24px;
            font-family: $font;
            font-weight: 600;
            color: #333;
          }

          .cla-box {
            @include flex(flex-start);
            flex-wrap: wrap;

            &.rejects-box {
              margin-top: 16px;
            }

            .cla-item {
              @include flex(center);
              flex-direction: column;
              text-align: center;
              width: 33.33%;//144px;
              margin-top: 20px;
              padding-right: 10px;
              @include borderBox;

              &:nth-child(3n) {
                margin-right: 0;
              }

              .cla-logo {
                width: 100%;
                height: 64px;
              }

              .cla-icon {
                max-width: 60px;
                max-height: 60px;
              }

              p {
                font-size: 22px;
                font-family: $font;
                font-weight: 400;
                color: #333;
                margin-top: 16px;
              }
            }

            /* 非常规类 */
            .rejects {
              width: 50%;//226px;
              height: 70px;
              border: 1px solid #ddd;
              border-top: none;
              margin: 0;
              line-height: 0.32rem;
              &.active {
                color: $red;
              }

              &:nth-child(2n) {
                border-left: none;
              }

              &:nth-child(1) {
                @include round(8px 0 0 0);
                border: 1px solid #ddd;
              }

              &:nth-child(2) {
                @include round(0 8px 0 0);
                border: 1px solid #ddd;
                border-left: none;
              }

              &.ug-odd {
                @include round(0 0 0 8px);
                border: 1px solid #ddd;
                border-top: none;

                &.double {
                  border-top: 1px solid #ddd;
                  @include round(8px 0 0 8px);
                }
              }

              &.ug-even {
                @include round(0 0 8px 0);
                border: 1px solid #ddd;
                border-top: none;
                border-left: none;

                &.double {
                  border-top: 1px solid #ddd;
                  @include round(0 8px 8px 0);
                }
              }

              /* 1 2 情况处理 */

              &.cover {
                border: 1px solid #ddd !important;
                @include round(8px);
              }
            }
          }
        }

        /*=====  End of 分类块  ======*/
      }
    }
  }
</style>
