<template>
  <van-popup
    v-model="showFlag"
    position="right"
    class="popup"
    :style="{ height: '100%' }"
  >
    <!--申请时间-->
    <div class="cate_wrap">
      <h4 class="title clearFix">申请时间</h4>
      <ul class="cate_content">
        <li :class="['item',form.index ===index ? 'active':'']" v-for="(item,index) in timeList" :key="index"
            @click="clickTime(index)">
          <span>{{item}}</span>
        </li>
      </ul>
    </div>
    <!--类型-->
    <div class="cate_wrap">
      <h4 class="title clearFix">类型</h4>
      <ul class="cate_content">
        <li :class="['item',form.invoice_type === index ? 'active':'']" @click="clickInvoiceType(index)"
            v-for="(item,index) in invoiceType" :key="index"><span>{{item}}</span>
        </li>
      </ul>
    </div>
    <!--状态-->
    <div class="cate_wrap">
      <h4 class="title clearFix">状态</h4>
      <ul class="cate_content">
        <li :class="['item',form.status=== '' ? 'active':'']" @click="clickStatus('')"><span>全部</span></li>
        <li :class="['item',form.status=== 0 ? 'active':'']" @click="clickStatus(0)"><span>待开票</span></li>
        <li :class="['item',form.status=== 1 ? 'active':'']" @click="clickStatus(1)"><span>已开票</span></li>
      </ul>
    </div>
    <div class="side-btn-box">
      <div class="side-btn" @click="$emit('close')">取消</div>
      <div class="side-btn" @click="onsubmit">确定</div>
    </div>
  </van-popup>
</template>

<script>
  import moment from 'moment'

  export default {
    name: "sideItem",
    props: {
      item: {
        type: Object,
        require: true
      }
    },
    data() {
      return {
        showFlag: true,
        invoiceType: ['全部', '增值税普通', '增值税专用'],
        timeList: ['全部', '最近1个月', '最近3个月', '最近1年'],
        form: this.item
        //         status: '',//	是	integer	状态:0待开 1已开
        //         invoice_type: 0,//	是	integer	发票类型1普通 2增值税专用
        //         // start_time: '',//	否	integer	搜索开始时间，例:2019-08-29
        //         // end_time: '',//	否	integer	搜索结束时间，例:2019-08-30
        //         index: 0,
        //     }
      }
    },
    methods: {
      clickInvoiceType(type) {
        this.form.invoice_type = type;
      },
      clickStatus(type) {
        this.form.status = type;
      },
      clickTime(index) {
        this.form.index = index;
        if (index >0) {
          let startTime = 0, date = moment(new Date());
         let endTime = date.format('YYYY-MM-DD');
          if (index === 1) { //最近1个月
            startTime = date.subtract(1, 'months');
          } else if (index === 2) { //最近3个月
            startTime = date.subtract(3, 'months');
          } else {//最近1年
            startTime = date.subtract(1, 'years');
          }
          this.form.start_time = startTime.format('YYYY-MM-DD');
          this.form.end_time = endTime;
        }else{
          this.form.start_time = '';
          this.form.end_time = '';
        }
      },
      onsubmit() {
        this.$emit('submit', this.form)
      }
    }
  }
</script>

<style scoped lang="scss">
  .popup {
    width: 640px;
    background: $c_bg;
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

      &.active {
        color: $red;
        background: $red_bg url("/static/images/bottom_hook.png") no-repeat bottom right;
        background-size: 25px 19px;
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
