<template>
  <div class="m-choice-panel">
    <div class="m-close" @click="closeThis">
      +
    </div>
    <h3 v-if="!!title">{{title}}</h3>
    <div class="m-content" v-if="!!content">
      {{content}}
    </div>
    <ul class="m-list">
      <li @click="checkedThis(idx)" v-for="(item,idx) in ServiceRealm" :key="idx" :class="index==idx ? 'm-four-item active':'m-four-item'">{{item.sr_name}}</li>
    </ul>
    <div class="m-bottom-btn">
      <button class="m-button" @click="save">保存</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ChoicePanel',
  props: {
    title: {
      type: String
    },
    content: {
      type: String
    },
    ServiceRealm: {
      type: Array
    }
  },
  data () {
    return {
      index:null,
    }
  },
  methods: {
    closeThis () {
      this.$emit('close')
    },
    save () {
      this.$emit('save', this.ServiceRealm[this.index])
    },
    checkedThis (index) {
      this.index = index
    }
  }
}
</script>
<style lang="scss" scoped>
  .m-choice-panel{
    position: relative;
    background: #fff;
    h3{
      height:rem(89);
      border-bottom:1px solid #ccc;
      padding-left:rem(30);
      font-size:rem(30);
      color:#333;
      font-weight:bold;
      line-height: rem(89);
    }
    .m-close{
      width:rem(30);
      height:rem(50);
      position: absolute;
      right:rem(15);
      top:rem(15);
      font-size:rem(50);
      color:#666;
      transform: rotate(45deg);
    }
    .m-content{
      padding-left: rem(30);
      height: rem(89);
      line-height: rem(89);
      font-size:rem(30);
      border-bottom:1px solid #ccc;
    }
    .m-list{
      display: flex;
      flex-wrap: wrap;
      padding:rem(36) 0 0 rem(24);
      box-sizing: border-box;
      li.m-four-item{
        width: 23.5%;
        height:rem(56);
        background: #F4F6F8;
        margin-right:rem(7);
        margin-bottom:rem(32);
        text-align: center;
        line-height: rem(56);
        
      }
      li.active{
        position: relative;
        background:#FEEDED;
        color:$red;
        &::after{
          content:' ';
          width:26px;
          height:26px;
          background: url('../../../static/images/bottom_hook.png') no-repeat left top;
          background-size: 100% 100%;
          position: absolute;
          right:0;
          bottom:0;
        }
      }
    }
    .m-bottom-btn{
      padding:rem(45);
      .m-button{
        width:100%;//rem(660);
        height:rem(88);
        background:$red;
        color:#fff;
        font-size:rem(32);
        line-height:rem(88);
        text-align: center;
      }
    }
  }
</style>
