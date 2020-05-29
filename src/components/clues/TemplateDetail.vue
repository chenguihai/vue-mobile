<template>
  <div class="m-template-detai-pop">
    <van-nav-bar
      title="模版详情"
      left-arrow
      @click-left="onClickLeft"
    />
    <h3 class="m-template-detail-title">
      {{templateDataDetail.title}}
    </h3>
    <div class="m-template-detail-content" v-html="templateDataDetail.content"></div>
    <fixed-btn name="插入模版" :fixed="1" @submit="_handleSubmit"></fixed-btn>
  </div>
</template>
<script>
import FixedBtn from "@/components/common/FixedBtn";
export default {
  name: 'TemplateChoice',
  props: {
    templateDataDetail: {
      type: Object
    }
  },
  components: {
    FixedBtn
  },
  data () {
    return {
      radio: '1'
    }
  },
  methods: {
    onClickLeft () {
      this.$emit('close')
    },
    _handleSubmit () {
      this.$emit('choiceDetail', this.templateDataDetail)
    }
  },
  watch: {
    templateDataDetail: {
      immediate: true,
      handler (val) {
        this.templateDataDetail = val
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.m-template-detai-pop{
  position: fixed;
  left:0;
  top:0;
  bottom:0;
  right:0;
  background:#fff;
  z-index: 50;
  .m-template-detail-title{
    text-align: center;
    color:#333;
    font-size:rem(28);
    padding-top:rem(30);
  }
  .m-template-detail-content{
    padding-top:rem(39);
    padding-left:rem(45);
    padding-right:rem(45);
    font-size:rem(24);
    color:#666;
    line-height:1.2em;
  }
}

</style>
