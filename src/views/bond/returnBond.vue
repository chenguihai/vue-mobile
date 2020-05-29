<template>
  <div class="container bg">
    <head-nav title="退回保证金"></head-nav>
    <div class="bank_card" @click="selectBanks">
      <van-cell :title="bankItem.bank_name ? bankItem.bank_name+computedCard:'请选择'" is-link/>
    </div>

    <ul class="price_warp">
      <li class="top">
        <span class="text">可退回金额</span>
        <span class="price">¥{{margin}}</span>
      </li>
      <li class="bottom">
        <van-button class="btn" plain type="danger" size="small" @click="onsubmit">确认退回</van-button>
      </li>
    </ul>
    <select-bank v-if="brankFlag" :list="bankList" @submit="emitSubmit" @close="emitClose"></select-bank>
  </div>
</template>

<script>
  import selectBank from "./components/selectBank";
  import {bankList, returnMargin} from '@/api/bond'
  import {filterCard} from '@/utils/tool'

  export default {
    name: "returnBond",
    components: {selectBank},
    data() {
      return {
        brankFlag: false,//false
        margin: 0,
        bankList: [],
        bankItem: {},
      }
    },
    created() {
      this.getBankList();
    },
    methods: {
      onsubmit() {
        this.returnMarginHttp();

      },
      selectBanks() {
        this.brankFlag = true;
      },
      emitSubmit(val = {}) {
        this.bankItem = val;
        this.emitClose();
      },
      emitClose() {
        this.brankFlag = false;
      },
      async getBankList() {
        let data = await bankList();
        if (!data) return
        this.bankList = data.list;
        this.margin = data.margin;
      },
      async returnMarginHttp() {
        if (!this.bankItem.id) {
          this.$toast('请选择银行卡');
          return
        }
        let params = {
          amount: +this.margin,// 是  int  退还金额
          bid: this.bankItem.id,// 是  int  银行卡列表id
        }
        let data = returnMargin(params);
        if (!data) return;
        this.$toast('提交成功，请耐心等待审核。');
        this.$router.push({path: '/myBond', query: {type: 'success'}});
      }
    },
    computed: {
      computedCard() {
        return filterCard(this.bankItem.banknumber)
      },
    }
  }
</script>

<style scoped lang="scss">
  .bank_card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 108px;
    margin-bottom: $w_10;
    background: $white;
    margin: $w_15;
  }

  .price_warp {
    background: $white;
    margin: $w_15;

    .top {
      padding: 27px 0 40px 27px;
      border-bottom: 1px solid $c_eee;

      .text {
        display: block;
        @include height(33px);
        font-size: 24px;
        color: $c_666;
      }

      .price {
        display: block;
        @include height(56px);
        font-size: 40px;
        font-weight: 500;
      }
    }

    .bottom {
      padding: 84px 40px 62px 40px;

      .btn {
        width: 100%;
        height: 88px;
        background: $red;
        font-size: 30px;
        color: $white;
      }
    }
  }
</style>
