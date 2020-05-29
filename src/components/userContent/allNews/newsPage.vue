<template>
  <div class="newsPage">
    <head-nav :title="title"></head-nav>
    <div class="content">
      <span>{{params.title}}</span>
      <span>{{params.content}}</span>
      <span>{{params.daye}}</span>
    </div>
  </div>
</template>
<script>
import { bodyColor } from "@/utils/mixins";
export default {
    name:'newsPage',
  mixins: [bodyColor("fff")],

  data() {
    return {
        title:'交易消息',
          params:this.$route.params.data,
    };
  },
  created(){
    console.log(this.params)
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
@import "./newsPageScode";
</style>