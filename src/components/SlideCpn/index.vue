<template>
  <div :class="['slide',{active:type ==='order'}]">
    <ul class="slide_wrap" v-if="type ==='arrayObject'">
      <li :class="['slide_item',{'active':undefined === status}]"
          @click="clickItem(undefined)">全部分类
      </li>
      <li :class="['slide_item',{'active':item.cat_id === status}]" v-for="item in list" :key="item.cat_id"
          @click="clickItem(item.cat_id)">{{item.cat_name}}
      </li>
    </ul>
    <ul class="slide_wrap" v-else-if="type==='qualify'">
      <li :class="['slide_item',index === status ? 'active':'']" v-for="(item,index) in list" :key="index"
          @click="clickOrder(index)">{{item}}
      </li>
    </ul>
    <!--服务订单-->
    <ul id="serviceSlide" class="slide_ul" v-else>
      <li :class="['slide_li',index === status ? 'active':'']" v-for="(item,index) in list"
          :key="index"
          @click="clickOrder(index)">{{item}}
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    name: 'index',
    props: {
      list: {
        type: Array,
        reqirue: true
      },
      status: {
        type: [Number, undefined],
        default: undefined
      },
      type: {
        type: String,
        default: 'arrayObject'
      }
    },
    data() {
      return {
        selectType: 0
      }
    },
    created() {
      let {type = ''} = this.$route.query;
      this.selectType = type;
    },
    mounted() {
      if (this.selectType === 6) {
        let data = document.getElementById('serviceSlide');
        data.scrollLeft = 576;
      }
    },
    methods: {
      clickItem(index) {
        this.$emit('change', index)
      },
      clickOrder(index) {
        this.$emit('change', index)
      }
    }
  }
</script>

<style scoped lang="scss">
  //滑动导航栏
  .slide {
    height: 94px;
    overflow: hidden;
    padding: 0 $w_10;
    background: $c_bg;

    &.active {
      height: 77px;
      background: $white;
      border-radius: 0px 0px 20px 20px;
      padding: 0 6px;
      color: $c_333;

      .slide_ul {
        white-space: nowrap; //可以强制目前布局而不让子元素自动换行
        overflow-y: hidden;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        color: $c_666;
        height: 77px;

        .slide_li {
          height: 77px;
          line-height: 77px;
          padding: 0 24px;
          font-size: 26px;
          display: inline-block;

          &.active {
            color: $red;
          }
        }
      }
    }

    .slide_wrap {
      white-space: nowrap; //可以强制目前布局而不让子元素自动换行
      overflow-y: hidden;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      color: $c_666;
      height: 100px;
      text-transform: capitalize;

      .slide_item {
        @include height(56px);
        text-align: center;
        padding: 0 20px;
        margin: 19px 10px;
        border-radius: 4px;
        opacity: 0.68;
        font-size: 22px;
        font-weight: 400;
        color: $c_666;
        /*box-sizing: border-box;*/
        background: $white;
        border: 1px solid $white;
        /*min-width: 186px;*/
        display: inline-block;

        &.active {
          color: $red;
          border-color: $red;
          background: $c_bg;
        }
      }
    }
  }
</style>
