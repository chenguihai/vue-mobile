<template>
  <div class="side-item" :class="{'side-strech': strech}">
    <div class="side-item-top">
      <p class="title">{{title}}</p>
      <p class="side-sel">{{selActiveText}}</p>
    </div>
    <div class="side-sel-box" v-if="!strech">
      <div class="inp-box" v-if="title === '价格'">
        <input class="price-inp" type="number" :value="priceMin" @input="priceMinInput" placeholder="最低价格"
               v-numberOnly="{decimal:0}">
        <div class="line"></div>
        <input class="price-inp" type="number" :value="priceMax" @input="priceMaxInput" placeholder="最高价格"
               v-numberOnly="{decimal:0}">
      </div>
      <!-- 最外层6格展示 -->
      <template>
        <div @click="changeSel(item)" class="side-sel-item"
             :class="{active:sel && sel.id === item.id,'brand-item': title === '品牌'}"
             v-for="item in oblig.data.slice(0,title === '品牌' ? 7 : 5)" :key="item.id">
          <van-image v-if="title === '品牌'" :src="item.brand_logo" class="brand_img" :noOss="false"
                     :lazy-load="true"></van-image>
          <span v-else>{{item[propName[0]]}}</span>
          <img class="hook" src="/static/images/bottom_hook.png">
        </div>
      </template>
      <div @click="open" v-if="showMoreBtn" class="side-sel-item">更多</div>
    </div>

    <!-- 地区展开 -->
    <div class="region-strech" v-if="strech && title === '地区'">
      <div class="region-left">
        <p v-for="(item, idx) in cityData" :key="item.id" :class="{active:region === item.id}"
           @click="nowRegion = `${item.id};${idx}`">{{item.name}}</p>
      </div>
      <div class="region-right">
        <p v-for="item in cityList" :key="item.id" :class="{active:sel && +item.id === +sel.id}"
           @click="changeSel(item)">
          {{item.name}}
          <van-icon name="success" size="12" v-if="sel && +item.id === +sel.id"/>
        </p>
      </div>
    </div>

    <!-- 品牌展开 -->
    <div class="region-strech brand-strech" v-if="strech && title === '品牌'">
      <van-index-bar highlight-color="#F3262D" :sticky="false">
        <div v-for="[key, value] in Object.entries(brandSplit)" :key="key">
          <van-index-anchor :index="key"/>
          <div class="side-sel-box">
            <div @click="changeSel(brand)" class="side-sel-item brand-item" :class="{active:sel && sel.id === brand.id}"
                 v-for="brand in value" :key="brand.id">
              <van-image :src="brand.brand_logo" class="brand_img" :noOss="false" :lazy-load="true"></van-image>
              <img class="hook" src="/static/images/bottom_hook.png">
            </div>
          </div>
        </div>
      </van-index-bar>
    </div>

    <!-- 领域展开 -->
    <div class="side-sel-box strech-box" v-if="strech && title === '领域'">
      <div @click="changeSel(item)" class="side-sel-item" :class="{active:sel && sel.id === item.id}"
           v-for="item in oblig.data" :key="item.id">
        <span>{{item[propName[0]]}}</span>
        <img class="hook" src="/static/images/bottom_hook.png">
      </div>
    </div>
  </div>
</template>

<script>
  import {numberOnly} from '@/utils/directives'
  import cityData from '@/utils/city.json'

  const propsNameList = new Map([
    ['品牌', ['brand_name']],
    ['领域', ['sr_name']],
    ['地区', ['shortname', 'name']],
    ['价格', ['show_info']]
  ])
  export default {
    name: 'sideItem',
    // oblig 主数据  sel 选择项  isStrech 是否展开
    props: ['oblig', 'sel', 'isStrech', 'priceMin', 'priceMax'],
    model: {
      prop: 'sel',
      event: 'change'
    },
    directives: {numberOnly},
    computed: {
      title() {
        return this.oblig.name
      },
      showMoreBtn() {
        return this.title !== '价格' && this.oblig.data.length > (this.title === '品牌' ? 7 : 5)
      },
      selActiveText() {
        return this.sel ? this.sel[this.propName[0]] || this.sel[this.propName[1]] : ''
      },
      region() {
        return this.nowRegion ? this.nowRegion.split(';')[0] : ''
      },
      cityList() {
        // 城市列表
        return this.nowRegion ? this.cityData[this.nowRegion.split(';')[1]].child : []
      },
      strech() {
        return this.isStrech === this.title
      },
      propName() {
        return propsNameList.get(this.title) || []
      },
      // 品牌
      brandSplit() {
        if (this.title === '品牌') {
          const tmp = {}
          this.oblig.data.forEach(item => {
            tmp[item.first_letter] ? tmp[item.first_letter].push(item) : tmp[item.first_letter] = [item]
          })
          return tmp
        }
        return {}
      }
    },
    data() {
      return {
        cityData,
        nowRegion: ''
      }
    },
    methods: {
      open() {
        // 每次打开重置数据
        this.sel && this.title === '地区' && this.positionNow(this.sel.pid || this.sel.parentid)
        this.$emit('update:isStrech', this.title)
        this.$emit('open')
      },
      positionNow(pid) {
        for (let [idx, region] of this.cityData.entries()) {
          if (+region.id === +pid) {
            this.nowRegion = `${region.id};${idx}`
            break
          }
        }
      },
      changeSel(sel) {
        this.$emit('change', (this.sel && this.sel.id === sel.id) ? undefined : sel)
      },
      priceMaxInput(e) {
        this.$emit('update:priceMax', e.target.value)
      },
      priceMinInput(e) {
        this.$emit('update:priceMin', e.target.value)
      }
    }
  }
</script>

<style scoped lang="scss">
  .side-item {
    width: 100%;
    margin-bottom: 20px;
    background: #fff;
    @include borderBox;
    padding: 30px;

    /*=============================================
    =            展开地区            =
    =============================================*/
    &.side-strech {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 88px;
      margin: auto;
      width: 640px;
      @include flex;
      flex-direction: column;
      z-index: 10;
      padding-bottom: 0;

      .region-strech {
        border-top: 1px solid #eee;
        width: 100%;
        @include flex(flex-start, flex-start);
        @include borderBox;
        flex: 1;
        margin-top: 24px;
        /*padding-top: 30px;*/
        color: #333;
        overflow: hidden;

        /deep/ .van-index-bar {
          width: 100%;

          .van-index-anchor {
            width: 100%;
            background: #f4f6f8;
            height: rem(40);
            line-height: rem(40);
            font-size: rem(30);
            margin-top: rem(30);
            margin-bottom: rem(20);
          }

          .van-index-bar__sidebar {
            .van-index-bar__index {
              font-size: rem(20);
              width: rem(29);
              height: rem(29);
              @include flex(center);
            }

            .van-index-bar__index--active {
              background: #f3262d;
              color: #fff !important;
              font-size: rem(20);
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              @include round(50%);
              text-align: center;
              padding: 0;
              margin-left: 16px;
              margin-right: 4px;
            }
          }
        }

        // 品牌
        &.brand-strech {
          overflow: auto;
        }

        .region-left {
          width: 230px;
          border-right: 1px solid #eee;
          height: 100%;
          overflow-y: auto;

          p {
            font-size: 26px;
            line-height: 80px;
            font-family: $font;
            font-weight: 400;

            &.active {
              color: $red;
            }
          }
        }

        .region-right {
          @include borderBox;
          flex: 1;
          padding-left: 20px;
          padding-top: $w_10;
          font-size: 26px;
          font-family: $font;
          font-weight: 400;

          p {
            @include flex;
            /*margin-bottom: 30px;*/
            height: 60px;
            &.active {
              color: $red;
            }
          }
        }
      }
    }

    /*=====  End of 展开地区  ======*/

    .side-item-top {
      @include flex;
      width: 100%;

      .title {
        font-size: 30px;
        font-family: $font;
        font-weight: 400;
        color: #333;
      }

      .side-sel {
        font-size: 26px;
        font-family: $font;
        font-weight: 400;
        color: $red;
      }
    }

    .side-sel-box {
      @include flex;
      flex-wrap: wrap;
      align-content: flex-start;

      &::after {
        content: " ";
        width: 180px;
      }

      /* 展开之后 */
      &.strech-box {
        overflow-y: auto;
        /*border-top: 1px solid #eee;*/
        width: 100%;
        @include flex;
        @include borderBox;
        flex: 1;
      }

      /* 展开之后 */
      .side-sel-item {
        margin-top: 20px;
        background: #f4f6f8;
        width: 180px;
        height: 56px;
        text-align: center;
        line-height: 56px;
        position: relative;
        color: #666;
        font-size: 24px;
        @include borderBox;
        @include round(2px);

        .hook {
          display: none;
          @include square(26);
          right: 0;
          bottom: 0;
          z-index: 2;
          position: absolute;
        }

        // 品牌
        .brand_img {
          width: 100%;
          height: 100%;
        }

        &.brand-item {
          width: 138px;
          height: 61px;
          margin-right: 9px;

          &.active {
            border: 1px solid #f3262d;
          }

          &:nth-child(4n) {
            margin-right: 0;
          }
        }

        &.active {
          background: #feeded;
          color: $red;

          .hook {
            display: block;
          }
        }
      }

      .inp-box {
        @include flex;
        width: 100%;
        @include borderBox;
        margin-top: 20px;
      }

      .price-inp {
        width: 260px;
        height: 70px;
        background: #f4f6f8;
        text-align: center;
        font-size: 24px;
        font-family: $font;
        font-weight: 400;
        @include borderBox;
        line-height: 46px;
        padding: 12px 0;
        color: #999;
      }

      .line {
        width: 20px;
        height: 2px;
        background: #ddd;
      }
    }

    /* 展开品牌 */
  }
</style>
