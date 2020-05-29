<template>
  <div class="m-category-choice-pop">
    <van-nav-bar
      title="分类"
      left-arrow
      @click-left="onClickLeft"
    />
    <ul class="m-show-first">
      <li v-for="(item,index) in categoryData" :key="index" @click="choice(index)">
        <img :src="$store.state.ali_api_host+item.mobile_icon" alt="" />
        <h3 class="m-name">{{item.cate_name}}</h3>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'CategoryChoice',
  props: ['categoryData'],
  data () {
    return {
      index: 0,
    };
  },
  components: {
  },
  methods: {
    onClickLeft () {
      this.$emit('closeThis')
    },
    choice (index) {
      this.$emit('choiceSon', index)
    }
  }
}
</script>
<style lang="scss" scoped>
.m-category-choice-pop{
  position: fixed;
  left:0;
  top:0;
  bottom:0;
  right:0;
  background:#fff;
  z-index: 30;
}
.m-show-first{
  display: flex;
  flex-wrap: wrap;
  padding-top:rem(27);
  justify-content: flex-start;
  li{
    width:33%;
    padding:rem(27) 0;
    border-bottom:1px solid #eee;
    text-align: center;
    img{
      width:rem(70);
    }
    .m-name{
      font-size:rem(24);
      color:#333;
      padding:rem(30) 0 rem(16);
    }
  }
}
</style>
