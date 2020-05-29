<template>
<div class="m-filter-box">
  <div class="m-clues-filter-box">
    <div class="m-clues-filter-item">
      <div class="m-clues-filter-title">
        线索分类
      </div>
      <ul>
        <li><span :class="{active:territoryIndex == -1}" @click="choiceItem('category',0,-1)">全部</span> <span v-for="(item,index) in clueSeleClass" :key="index" :class="{active:territoryIndex == index}" @click="choiceItem('category',item.id,index)">{{item.cate_name}}</span></li>
      </ul>
    </div>
    <div class="m-clues-filter-item">
      <div class="m-clues-filter-title">
        投放预算
      </div>
      <ul>
        <li><span :class="{active:terriMoneyIndex == -1}" @click="choiceItem('money','',-1)">全部</span><span v-for="(item,indexM) in clueSeleMoney" :key="indexM" @click="choiceItem('money',item,indexM)" :class="{active:terriMoneyIndex == indexM}">{{indexM}}</span></li>
      </ul>
    </div>
    <div class="m-clues-filter-item">
      <div class="m-clues-filter-title">
        发布时间
      </div>
      <ul>
        <li><span :class="{active:terrItemIndex == -1}" @click="choiceItem('time','',-1)" class="all">全部</span><span  v-for="(item,indexM) in clueSeleTime" :key="indexM" @click="choiceItem('time',item,indexM)" :class="{active:terrItemIndex == indexM}">{{indexM}}</span></li>
      </ul>
    </div>
    <div class="m-clues-filter-item" style="padding-bottom:80px">
      <div class="m-clues-filter-title">
        客户类型
      </div>
      <ul>
        <li><span :class="{active:terrTypeIndex == -1}" @click="choiceItem('customer_type',0,-1)" class="all">全部</span><span v-for="(item,index) in clueSeleType" :key="index" @click="choiceItem('customer_type',item.id,index)" :class="{active:terrTypeIndex == index}">{{item.customer_type}}</span></li>
      </ul>
    </div>
  </div>
  <div class="m-clues-btn-bottom">
    <div @click="closeThis" class="m-btn-cancel">取消</div>
    <div class="m-btn-confirm" @click="confirm">确定</div>
  </div>
</div>
</template>
<script>
export default {
  name: 'CluesFilter',
  props: {
    clueSeleClass: {
      type: Array
    },
    clueSeleMoney: {
      type: Object
    },
    clueSeleTime: {
      type: Object
    },
    clueSeleType: {
      type: Array
    }
  },
  data () {
    return {
      territoryIndex: -1,
      terriMoneyIndex: -1,
      terrItemIndex: -1,
      terrTypeIndex: -1,
      filterObj: {
        classd: 0,
        money: '',
        time: '',
        type: 0,
      }
    }
  },
  components: {

  },
  methods: {
    choiceItem (type, id, index) {
      switch (type) {
        case 'category':
          this.territoryIndex = index;
          this.filterObj.classd = id;
          break
        case 'money':
          this.terriMoneyIndex = index;
          this.filterObj.money = id;
          break
        case 'time':
          this.terrItemIndex = index;
          this.filterObj.time = id;
          break
        case 'customer_type':
          this.terrTypeIndex = index;
          this.filterObj.type = id;
          break
        default:
          this.territoryIndex = -1;
          this.terriMoneyIndex = -1;

      }
    },
    closeThis () {
      this.$emit('close')
    },
    confirm () {
      this.$emit('confirm', this.filterObj)
      this.closeThis()
    }
  }
};
</script>
<style lang="scss" scoped>
.m-filter-box{
  height:100vh;
  width:100%;
  position: relative;
}
.m-clues-filter-box{
  position: fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  padding-left:rem(20);
  padding-right:rem(20);
  background: #fff;
  overflow-y: auto;
  z-index: 9;
  .m-clues-filter-item{
    border-bottom:1px solid #eee;
    padding-top:rem(8);
    ul{

      li{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        span{
          width:rem(270);
          margin-bottom:rem(32);
          justify-content: space-between;
          position: relative;
          height:rem(56);
          line-height:rem(56);
          background:#f4f6f8;
          font-size:rem(24);
          text-align: center;
          color:#666;
        }

        span.active{
          background: #FEEDED;
          &:after{
            position: absolute;
            width:rem(26);
            height:rem(26);
            content: ' ';
            background:url("../../../static/images/clues/icon-clues-active.png");
            -webkit-background-size: 100% 100%;
            background-size: 100% 100%;
            right:0;
            bottom:0;
          }
        }
        span:first-child{
          width:rem(84);
        }
        span:nth-child(2){
          width:rem(180);
        }
      }
    }
  }
  .m-clues-filter-title{
    color:#333;
    padding-top:rem(20);
    padding-bottom:rem(30);
    font-size:rem(30);
  }
}
.m-clues-btn-bottom{
  position: fixed;
  width:100%;
  bottom:0px;
  left:0;
  right:0;
  z-index: 100;
  height:rem(80);
  display: flex;
  font-size:rem(30);
  text-align: center;
  .m-btn-cancel{
    border-top:1px solid #eee;
    background:#fff;
    line-height:rem(80);
    color:#666;
    width:50%;
  }
  .m-btn-confirm{
    background:$red;
    line-height:rem(80);
    color:#fff;
    width:50%;
  }
}
</style>
