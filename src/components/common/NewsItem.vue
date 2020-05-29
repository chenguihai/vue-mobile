<template>
<!-- @click="gotoNewsDetail(newsInfo.id)" -->
  <a class="m-news-item" :href="'/news/detail/' + newsInfo.id">
    <div class="m-img-box">
      <img v-lazy="$store.state.ali_api_host + newsInfo.cover" alt="" />
    </div>
    <div class="m-news-content">
      <h3 class="m-news-title">
        {{newsInfo.title}}
      </h3>
      <div class="m-news-bottom">
        <div class="m-time">{{newsInfo.created_at}}</div>
        <div class="m-num">
          <img src="../../../static/images/news/icon-news-num.png" alt="" /> {{newsInfo.click_num}}
        </div>
      </div>
    </div>
  </a>
</template>
<script>
  export default {
    name: 'NewsItem',
    props: ['newsInfo'],
    data () {
      return {

      }
    },
    methods: {
      // gotoNewsDetail(id) {
      //   this.$router.push('/news/detail/' + id)
      // }
    }
  }
</script>
<style lang="scss" scoped>
  .m-news-item{
    padding:20px 30px;
    margin-top:20px;
    width:690px;
    background:#fff;
    height:120px;
    position: relative;
    border-radius: 20px;
    display: flex;
    justify-content: start;
    a{
      display: block;
      width:690px;
      height:120px;
    }
    .m-img-box{
     width: 26.67%;
      height:120px;
      margin-right:20px;
      img{
        width:100%;//200px;
        height:120px;
        background: #ccc;
        display: block;
      }
    }
    .m-news-content{
       width: 70%;
      height:120px;
      position: relative;
      .m-news-title{
        width:100%;//470px;
        color:#333;
        font-size:26px;
        line-height: 30px;
        text-overflow:-o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .m-news-bottom{
        position: absolute;
        width:100%;
        bottom:0;
        left:0;
        display: flex;
        justify-content: space-between;
        .m-time{
          color:#999;
          font-size:22px;
        }
        .m-num{
          font-size:22px;
          color:#0066cc;
          img{
            width:38px;
            height:22px;
            margin-right:10px;
            vertical-align: bottom;
          }
        }
      }
    }
  }
</style>
