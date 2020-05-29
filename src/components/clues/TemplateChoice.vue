<template>
  <div class="m-template-choice-pop">
    <van-nav-bar
      title="选择模版"
      right-text="插入模版"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <van-radio-group v-model="radio">
    <ul class="m-template-list" v-if="templateData.length>0">
      <li v-for="(item,index) in templateData" :key="index">
        <h3 class="m-title">{{item.title}}<van-radio class="m-radio" :name="index" checked-color="#f3262d"></van-radio></h3>
        <div @click="toDetail(index)" class="m-template-content" v-html="item.content">
        </div>
      </li>
    </ul>
    </van-radio-group>
    <TemplateDetail @close="showTemplateDetail=false" @choiceDetail="choiceDetail" :templateDataDetail="templateDataDetail" v-if="showTemplateDetail"></TemplateDetail>
  </div>
</template>
<script>
import TemplateDetail from './TemplateDetail'
export default {
  name: 'TemplateChoice',
  props: ['templateData'],
  data() {
    return {
      radio: 0,
      showTemplateDetail: false,
      templateDataDetail: null
    };
  },
  components: {
    TemplateDetail
  },
  methods: {
    onClickLeft () {
      this.$emit('close');
    },
    onClickRight () {
      this.$emit('choiceTemplate', this.templateData[this.radio]);
    },
    choiceDetail (detail) {
      this.showTemplateDetail = false
      this.$emit('choiceTemplate', detail)
    },
    toDetail (index) {
      this.radio = index
      this.templateDataDetail = this.templateData[index];
      this.showTemplateDetail = true
    }
  }
};
</script>
<style lang="scss" scoped>
.m-template-choice-pop{
  position: fixed;
  left:0;
  top:0;
  bottom:0;
  right:0;
  background:#F4F6F8;
  z-index: 30;
  .m-template-list{
    width:100%;//rem(750);
    height: calc(100vh - 90px);
    overflow-y:auto;
    li{
      height:rem(268);
      border-radius: rem(20);
      background:#fff;
      padding:0 rem(18);
      margin-bottom:rem(18);
      .m-title{
        height:rem(64);
        margin-left:rem(18);
        margin-right:rem(18);
        line-height:rem(64);
        font-weight:bold;
        color:#333;
        position: relative;
        padding-top:rem(10);
        border-bottom:1px solid #eee;
        .m-radio{
          position: absolute;
          top:rem(20);
          right:rem(15);
        }
        .van-radio{
          width:1.6em;
          i{
            width:18px;
            height:18px;
            display: block;
          }
        }
      }
      .m-template-content{
        color:#666;
        font-size:rem(26);
        padding-top:rem(13);
        padding-right:rem(18);
        line-height:rem(42);
        padding-left:18px;
        height:rem(160);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
      }
    }
  }
}

</style>
