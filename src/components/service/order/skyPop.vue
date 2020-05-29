<template>
  <van-popup class="sky-pop" round v-model.sync="show" @close="closePopup" :close-on-click-overlay="false">
    <div :class="['pop-noid',type==='active'?'active':type === 'cate'? 'cate':'']">
      <slot></slot>
      <img src="@/assets/service/big-close.png" class="close" @click="closePopup"/>
    </div>
  </van-popup>
</template>

<script>
  export default {
    name: 'skyPop',
    props: {
      'show': {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: ''
      }
    },
    model: {
      prop: 'show',
      event: 'change'
    },
    data() {
      return {}
    },
    methods: {
      closePopup() {
        this.$emit('change');
      }
    }
  }
</script>

<style scoped lang="scss">
  /*1、active 2、cate */
  .sky-pop {
    overflow: visible;
    -webkit-overflow-scrolling: touch;
  }

  .pop-noid {
    width: 600px;
    padding: 50px;

    &.cate {
      padding: 50px 20px;
    }

    &.active {
      width: 610px;
      padding: 30px 30px 50px;
    }

    @include borderBox;
    font-family: $font;
    @include flex(center);
    flex-direction: column;
    position: relative;

    .close {
      @include square(78);
      position: absolute;
      bottom: -130px;
      pointer-events: auto;
      left: 0;
      right: 0;
      margin: auto;
    }
  }
</style>
