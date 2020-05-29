<template>
  <div class="">
    <van-popup
      v-model="showFlag"
      position="right"
      class="popup"
      :style="{ height: '100%' }"
      @close="$emit('close')"
    >
      <div class="side_box">
        <div class="cate_wrap">
          <h4 class="title">分类</h4>
          <ul class="cate_content">
            <li :class="['item2',form.cat_id === item.id?'active':'']"
                v-for="(item) in cateList" :key="item.id"
                @click="clickCate(item.id)">
              <span>{{item.cate_name}}</span>
            </li>
          </ul>
        </div>
        <div class="cate_wrap">
          <h4 class="title clearFix">地区 <span class="city">{{selectRegion}}</span></h4>
          <ul class="cate_content">
            <li :class="['item',form.region_id == item.id?'active':'']"
                v-for="(item) in regionList" :key="item.id"
                @click="clickRegion(item.id,item.shortname)">
              <span>{{item.shortname}}</span>
            </li>
            <li class="item" @click="reloadMore">
              <span>更多</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="side-btn-box">
        <div class="side-btn" @click="$emit('close')">取消</div>
        <div class="side-btn" @click="onSubmit">确定</div>
      </div>
    </van-popup>
    <choice-area v-if="areaFlag" :item="{id:form.region_id,name:this.selectRegion}" @close="areaFlag= false"
                 @submit="clickRegion"></choice-area>
  </div>
</template>

<script>
    import ChoiceArea from './ChoiceArea'

    export default {
        name: "sideItem",
        components: {ChoiceArea},
        props: {
            item: {
                type: Object,
                default: {}
            },
            select: {
                type: Object,
                default: {}
            },
        },
        data() {
            const {cateList = [], regionList = []} = this.item;
            const {cat_id = '', region_id = ''} = this.select;
            return {
                showFlag: true,
                areaFlag: false,
                cateList: cateList,
                regionList: regionList,
                selectRegion: '',
                form: {
                    cat_id: cat_id,
                    region_id: region_id,
                }
            }
        },
        created() {
            if (this.form.region_id) {
                this.selectRegion = localStorage.getItem('selectRegion');
            }
        },
        methods: {
            clickCate(val) {
                this.form.cat_id = this.form.cat_id === val ? '' : val;
            },
            clickRegion(val, name) {
                let flag = name === this.selectRegion;
                this.form.region_id = flag ? '' : val;
                this.selectRegion = flag ? '' : name;
                this.areaFlag = false;
              localStorage.setItem('selectRegion', this.selectRegion)
            },
            onSubmit() {
                this.$emit('submit', this.form);
            },
            reloadMore() {
                this.areaFlag = true;
            }
        }
    }
</script>

<style scoped lang="scss">
  .popup {
    width: 640px;
    background: $c_bg;
    overflow-y: auto;
    overflow-x: hidden;
    padding-bottom: 88px;
  }

  .side_box {
    height: calc(100vh - 88px);
    padding-bottom: 88px;
    overflow-y: auto;
  }

  .cate_wrap {
    padding: $w_30 $w_20;
    background: $white;
    margin-bottom: $w_20;

    .title {
      @include height(42px);
      font-size: $w_30;
      padding-right: 36px;

      .city {
        float: right;
        color: $red;
        /*height:37px;*/
        font-size: 26px;
      }
    }

    .cate_content {
      display: flex;
      flex-wrap: wrap;
    }

    .item2, .item {
      @include height(56px);
      background: $c_bg;
      text-align: center;
      margin: $w_20 $w_10 0;
      font-size: 24px;
      color: $c_666;
      border-radius: 2px;

      &.active {
        color: $red;
        background: $red_bg url("/static/images/bottom_hook.png") no-repeat bottom right;
        background-size: 26px 26px;
      }
    }

    .item2 {
      width: 280px;
    }

    .item {
      width: 180px;
    }
  }

  .side-btn-box {
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 10;
    margin: auto;
    width: 640px;
    height: 88px;
    @include borderBox;
    @include flex;

    .side-btn {
      flex: 1;
      height: 100%;
      text-align: center;
      line-height: 88px;
      font-size: 30px;
      font-family: $font;
      font-weight: 400;
      background: $red;
      color: #fff;

      &:first-child {
        background: #fff;
        color: #333;
      }
    }
  }
</style>
