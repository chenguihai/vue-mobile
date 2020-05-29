<template>
  <li class="m-clues-prod-item">
    <a :href="'/clues/detail/'+productInfo.id">
      <div class="m-clues-title">
        <div class="m-price">
          ¥{{productInfo.budget_money}}
        </div>
        <div class="m-title">
          {{productInfo.title}}
        </div>
        <div class="m-clues-icon">
          <span class="icon-clues-2" v-if="productInfo.top=='Y'">顶</span>
          <span class="icon-clues-1" v-if="productInfo.go=='Y'">急</span>
          <span class="icon-clues-1" v-if="productInfo.service=='Y'">办</span>
          <span class="icon-clues-4" v-if="productInfo.city_id">域</span>
          <span class="icon-clues-3" v-if="productInfo.grade > 0">级</span>
        </div>
      </div>
      <div class="m-clues-info-box">
        <p>客户领域：{{productInfo.customer_type || productInfo.sr_name}}</p>
        <p>投放时间：{{productInfo.clue_start_time.slice(0,10)}}至{{productInfo.clue_end_time.slice(0,10)}}</p>
      </div>
      <div class="m-clues-info-box">
        <p><span class="font-red">{{productInfo.pay_number}}人</span> 已购买</p>
        <p v-if="productInfo.clue_status=='N' || isEnd ">
          <span>{{endTips}}</span>
        </p>
        <p v-else>
          <span class="font-red">{{endD }}天{{endH}}小时</span>后截止购买线索
        </p>
      </div>
    </a>
  </li>
</template>
<script>
import moment from 'moment'
export default {
  name: 'cluesProductItem',
  props: ['productInfo', 'buyNumShow', 'theSameShow'],
  data () {
    return {
      endTips: '已截止购买'
    }
  },
  methods: {
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    endD () {
      let formatTime = this.productInfo.end_time ? this.productInfo.end_time.replace(/-/g, '/') : this.productInfo.end_time.replace(/-/g, '/')
      // eslint-disable-next-line one-var
      let endTimeX = parseInt(moment(formatTime).format('X')),
        nowTimeX = parseInt(moment().format('X'))
      if (endTimeX > nowTimeX) {
        return parseInt((endTimeX - nowTimeX)/(24*60*60))
        // this.endH = parseInt(((endTimeX - nowTimeX)/(60*60))%24)
      } else {
        return 0
      }
    },
    isEnd () {
      let formatTime = this.productInfo.end_time ? this.productInfo.end_time.replace(/-/g, '/') : this.productInfo.end_time.replace(/-/g, '/')
      // eslint-disable-next-line one-var
      let endTimeX = parseInt(moment(formatTime).format('X')),
        nowTimeX = parseInt(moment().format('X'))
      if (endTimeX > nowTimeX) {
        return false
        // this.endH = parseInt(((endTimeX - nowTimeX)/(60*60))%24)
      } else {
        return true
      }
    },
    endH () {
      let formatTime = this.productInfo.end_time ? this.productInfo.end_time.replace(/-/g, '/') : this.productInfo.end_time.replace(/-/g, '/')
      // eslint-disable-next-line one-var
      let endTimeX = parseInt(moment(formatTime).format('X')),
        nowTimeX = parseInt(moment().format('X'))
      if (endTimeX > nowTimeX) {
        return parseInt(((endTimeX - nowTimeX)/(60*60))%24)
        // this.endH = parseInt(((endTimeX - nowTimeX)/(60*60))%24)
      } else {
        return 0
      }
    }
  },
  mounted () {
    // console.log(this.productInfo)
  }
}
</script>
<style lang="scss" scoped>
  li.m-clues-prod-item{
    height:rem(126);
    margin-bottom:20px;
    background:#fff;
    border-radius: 10px;
    padding:rem(25) rem(20);
    .m-clues-info-box{
      display: flex;
      justify-content: space-between;
      padding:rem(24) 0 0 0;
      p{
        color:#666;
        font-size:rem(24);
      }
      .font-red{
        color:$red;
      }
    }
    .m-clues-title {
      display: flex;
      height:rem(30);
      line-height:rem(30);
      justify-content: flex-start;
      .m-price{
        color:$red;
        font-size:rem(24);
        margin-right:rem(18);
        font-weight:bold;
      }
      .m-title{
        font-size:rem(28);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width:auto;
        max-width:rem(358);
        margin-right:18px;
        font-weight:bold;
      }
      .m-clues-icon{
        display: flex;
        justify-content: start;
        span{
          display: inline-block;
          margin-right:rem(10);
          text-align:center;
        }
        .icon-clues-1{
          width:rem(36);
          height:rem(36);
          background:url("/static/images/icon_clues_1.png") no-repeat left top;
          -webkit-background-size: 100% 100%;
          background-size: 100% 100%;
          color:#fff;
          line-height:rem(36);
          font-size:rem(20);
          margin-top:rem(-4);
        }
        .icon-clues-2{
          width:rem(36);
          height:rem(36);
          background:url("/static/images/icon_clues_2.png") no-repeat left top;
          -webkit-background-size: 100% 100%;
          background-size: 100% 100%;
          color:#fff;
          line-height:rem(36);
          font-size:rem(20);
          margin-top:rem(-4);
        }
        .icon-clues-3{
          width:rem(36);
          height:rem(36);
          background:url("/static/images/icon_clues_3.png") no-repeat left top;
          -webkit-background-size: 100% 100%;
          background-size: 100% 100%;
          color:#fff;
          line-height:rem(36);
          font-size:rem(20);
          margin-top:rem(-4);
        }
        .icon-clues-4{
          width:rem(36);
          height:rem(36);
          background:url("/static/images/icon_clues_4.png") no-repeat left top;
          -webkit-background-size: 100% 100%;
          background-size: 100% 100%;
          color:#fff;
          line-height:rem(36);
          font-size:rem(20);
          margin-top:rem(-4);
        }
        .icon-clues-5{
          width:rem(36);
          height:rem(36);
          background:linear-gradient(180deg,rgba(248,144,108,1) 0%,rgba(247,71,138,1) 100%);
          border-radius:2px;
          color:#fff;
          line-height:rem(36);
          font-size:rem(20);
          margin-top:rem(-4);
        }
      }
    }
  }
</style>
