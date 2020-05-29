<template>
  <div class="contain">
    <head-nav title="我的保证金"></head-nav>
    <ul class="price_wrap">
      <li class="price_item">
        <span class="text">当前保证金</span>
        <span class="price">¥{{storeInfo.paidMargin ||'0.00'}}</span>
      </li>
      <li class="price_item">
        <span class="text">需补缴保证金 <i class="help_icon" @click="agreeFlag =true"></i></span>
        <span class="price">¥{{storeInfo.unpaidMargin ||'0.00'}}</span>
      </li>
    </ul>
    <ul class="btn_wrap">
      <li class="btn_item">
        <span class="single_btn_200" @click="applyReturn">申请退回</span>
      </li>
      <li class="btn_item">
        <span class="single_btn_200 active" @click="payment">立即补缴</span>
      </li>
    </ul>
    <div class="split_line"></div>
    <div class="bond_wrap">
      <h4 class="title">保证金明细</h4>
      <div class="bond_list">
        <listBox :refreshLoading.sync="isLoading" :listLoading.sync="listLoading" :dataArr="dataArr" :dataObj="dataObj"
                 @load="loadData">
          <div class="bond_item" v-for="(item,index) in dataArr" :key="item.id">
            <span :class="['num',{active:item.process_type==1}]">{{item.process_type==1?'+':'-'}}{{item.order_amount || 0}}</span>
            <div class="name">{{item.process_type |typeStatus}}</div>
            <p class="content">
              <span class="time">{{item.created_at}}</span>
              <span class="time">剩余保证金：¥<span>{{item.remain || 0}}</span></span>
            </p>
          </div>
        </listBox>

      </div>
    </div>
    <!--弹框-->
    <skyPop v-model="agreeFlag" @change="emitClose">
      <template>
        <h5 class="pop-title">需补缴保证金包含</h5>
        <p class="pop-tip left">
          1、所有已保存未缴纳类目保证金之和。 <br>
          2、出现违规扣除保证金后需要补足的保证金。</p>
      </template>
    </skyPop>
    <!--资料不全-->
    <skyPop v-model="uncertifyFlag" @change="emitClose">
      <template>
        <h5 class="pop-title">温馨提示</h5>
        <template v-if="status=== -2">
          <p class="pop-single">您还未实名认证，请先完成实名认证</p>
          <div class="pop-btn active" @click="popupSubmit(1)">去实名认证</div>
        </template>
        <template v-if="status=== -3">
          <p class="pop-single">您还未绑定银行卡，请先绑定银行卡</p>
          <div class="pop-btn active" @click="popupSubmit(2)">去绑定银行卡</div>
        </template>
      </template>
    </skyPop>
    <!--退回保证金-->
    <skyPop v-model="returnFlag" @change="emitClose">
      <template>
        <h5 class="pop-title">温馨提示</h5>
        <!--满足条件-->
        <template v-if="status===1">
          <p class="pop-top">尊敬的服务商您好，您申请退回保证金将受到如下影响：</p>
          <p class="pop-bottom">
            1.您的店铺将会被关闭；<br>
            2.您店铺下的服务、客户合作示例等内容将会被下架；<br>
            3.您将不能购买广告线索；
          </p>
        </template>
        <!--条件不足-->
        <template v-if="status === -1">
          <p class="pop-top">尊敬的服务商您好，满足条件可以申请退回保 证金，具体条件是：</p>
          <p class="pop-bottom">
            1.没有未处理完成的举报维权或争议纠纷案件。 <br>
            2.没有因争议纠纷案件未尝还的待付款项。 <br>
            3.没有未结束的交易。 <br>
            4.最后一笔交易完结时间已经超过90个自然日；
          </p>
          <p class="pop-bottom">温馨提醒：您目前的条件不能全部达到，建议您满足条件后再来申请退出。</p>

        </template>
        <div class="pop-btn active" @click="clickPopup">我已知晓</div>
      </template>
    </skyPop>
    <upBack/>

  </div>
</template>

<script>
  import skyPop from '@/components/service/order/skyPop'
  import {checkReturnMargin, getMargin} from '@/api/bond'
  import {mapMutations} from 'vuex'
  import {getShopInfo} from '@/api/storeInfo'
  import listBox from '@/components/service/listBox'
  import upBack from "@/components/service/upBack";

  export default {
    name: "myBond",
    components: {skyPop, listBox, upBack},
    data() {
      return {
        listLoading: false,
        isLoading: false,
        error: false,
        dataArr: [],
        dataObj: {},

        agreeFlag: false,
        returnFlag: false,
        uncertifyFlag: false, //false
        status: '',// status状态说明 1：正常状态，可以退还 -1:90天内有交易订单 -2：未实名认证 -3：未绑定银行卡 -4 已申请退还
        marginList: [],
        storeInfo: {},
      }
    },
    created() {
      const {type = ''} = this.$route.query;
      let storeInfo = localStorage.getItem('storeInfo');
      if (storeInfo) {
        let data = JSON.parse(storeInfo);
        if (type === 'success') {
          data.paidMargin = 0;
          localStorage.setItem('storeInfo', JSON.stringify(data));
        }
        this.storeInfo = data;
      } else {
        this.getShopInfoHttp();
      }
      this.checkStatus();
    },
    methods: {
      ...mapMutations(['GET_STORE_INFO']),
      clickPopup() {
        this.emitClose();
        if (this.status === 1) {
          this.$router.push({path: '/returnBond'})
        }
      },
      payment() {
        if (!this.storeInfo.unpaidMargin) {
          return
        }
        this.$router.push({path: '/payBond', query: {num: this.storeInfo.unpaidMargin}})
      },
      applyReturn() {
        if (this.storeInfo.isStore === 0 || this.storeInfo.paidMargin == 0) { //保证金不足
          this.$toast('你的保证金为0，没有可退的呢');
        } else if (this.status === 1) {//正常状态
          this.returnFlag = true;
          // this.$router.push({path: '/returnBond'})
        } else if (this.status === -1) { //90天内有交易订单
          this.returnFlag = true;
        } else if (this.status === -2) { //去实名认证
          this.uncertifyFlag = true;
        } else if (this.status === -3) { //去绑定银行卡
          this.uncertifyFlag = true;
        } else if (this.status === -4) {
          this.$toast('您有一笔保证金退回申请正在处理，请处理完成后再提交。');
        }
      },
      emitClose() {
        this.agreeFlag = false;
        this.returnFlag = false;
        this.uncertifyFlag = false;
      },
      popupSubmit(index) {
        let url = this.storeInfo.type_id === 1 ? '/personalInfo' : '/companyInfo';
        this.$router.push({path: index === 1 ? url : '/userContent/homePage/myBank'})
      },
      async checkStatus() {
        let data = await checkReturnMargin();
        if (!data) return
        this.status = data.status;
      },
      async loadData(page) {
        page === 1 ? await this.onRefresh() : await this.getData(page)
      },
      async onRefresh() {
        await this.getData(1)
        this.isLoading = false
      },
      async getData(page) {
        let params = {
          page: page,
          beginTime: '',//	否	date	開始時間
          endTime: '',//	否	date	結束時間
          type: '',//	否	int	狀態 1：缴纳 -1：退还 -2：扣除
          keywords: '',//	否	string	搜索关键字
        }
        this.listLoading = true
        let data = await getMargin(params);
        this.listLoading = false
        if (!data) return
        this.dataArr = page === 1 ? data.data : [...this.dataArr, ...data.data]
        this.dataObj = {
          current_page: data.current_page,
          total: data.total,
          per_page: data.per_page
        }
      },
      async getShopInfoHttp() {
        const data = await getShopInfo();
        if (!data) return
        // this.storeInfo = data;
        this.GET_STORE_INFO(data);
      },
    },
    filters: {
      typeStatus: (type) => {//狀態 1：缴纳 -1：退还 -2：扣除
        let name = '';
        switch (type) {
          case 1:
            name = '缴纳';
            break;
          case -1:
            name = '退还';
            break;
          case -2:
            name = '扣除';
            break;
        }
        return name;
      }
    },
  }
</script>

<style scoped lang="scss">
  @import "@/css/sky-pop.scss";

  .price_wrap {
    padding: 60px $w_30 $w_20;
    display: flex;
    border-bottom: 1px solid $c_eee;

    .price_item {
      flex: 1;
      text-align: center;

      &:not(:last-child) {
        border-right: 1px solid $c_eee;
      }

      .text {
        position: relative;
        color: $c_666;
        @include height(30px);
        font-size: 22px;
      }

      .help_icon {
        @include rightTop(-5px, -15px);
        z-index: 10;
        width: 28px;
        height: 28px;
        background: url("/static/images/hint.png") no-repeat center center;
        background-size: 28px;
      }

      .price {
        display: block;
        font-weight: bold;
        @include height(50px);
        font-size: 36px;
      }
    }
  }

  .btn_wrap {
    padding: 50px $w_30 58px;
    display: flex;

    .btn_item {
      flex: 1;
      text-align: center;
    }
  }

  .bond_wrap {
    padding: 10px 0 54px;

    .title {
      margin: 0 30px;
      @include height(80px);
      font-size: 28px;
      font-weight: bold;
      border-bottom: 1px solid $c_eee;
    }

    .bond_list {
      padding: 0 30px;
    }

    .bond_item {
      padding: 20px 0;
      font-size: 28px;
      border-bottom: 1px solid $c_eee;

      .name {
        @include height(40px);
        margin-bottom: $w_10;
      }

      .num {
        float: right;
        margin-top: 20px;
        height: 40px;
        line-height: 40px;
        color: $price_green;

        &.active {
          color: $red;
        }
      }

      .content {
        .time {
          @include height(28px);
          font-size: 22px;
          color: $c_999;

          &:first-child {
            margin-right: 20px;
          }
        }
      }
    }
  }
</style>
