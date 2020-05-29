<template>
  <div class="container">
    <head-nav title="补缴保证金"></head-nav>
    <div class="price_wrap">
      <span class="desc">您需要补缴的金额：</span>
      <!--      <h4 class="price">¥{{payNum}}</h4>-->
      <van-field class="price" v-model="money" placeholder="请输入金额"/>
    </div>
    <div class="split_line"></div>
    <div class="money_wrap">
      <h4 class="title">您还可以选择其他金额</h4>
      <ul class="money_list">
        <li :class="['money_item',item.value == money ? 'active':'']" v-for="(item,index) in priceList" :key="index"
            @click="handleMoney(item.value)">{{item.label}}
        </li>
      </ul>
    </div>
    <div class="btn_wrap">
      <van-button class="btn" plain type="danger" size="small" @click="onsubmit">立即补缴</van-button>
      <div class="link">查看 <a href="/bond" class="blue">《保证金的管理与使用》</a></div>
    </div>
  </div>
</template>

<script>
    import {marginOrder} from '@/api/bond'

    export default {
        name: "payBond",
        data() {
            return {
                priceList: [
                    {value: '10000.00', label: '1万元'},
                    {value: '20000.00', label: '2万元'},
                    {value: '40000.00', label: '4万元'},
                    {value: '70000.00', label: '7万元'},
                ],
                payNum: 0,
                money: 0,
            }
        },
        created() {
            let {num = 0} = this.$route.query;
            this.payNum = num;
            this.money = num;
        },
        methods: {
            handleMoney(val) {
                this.money = val === this.money ? 0 : val;
            },
            onsubmit() {
                if (this.money !== 0 && this.money < this.payNum) {
                    this.$toast('其他金额必须不少于您需要补缴的金额')
                } else {
                    this.marginOrderHttp();
                }
            },
            async marginOrderHttp() {
                let num = this.payNum > this.money ? this.payNum : this.money
                let params = {
                    type: 1,//	否	int	类型，服务商首页缴纳保证金使用 1
                    amount: num,//	否	int	金额 ，服务商首页缴纳保证金使用
                }
                let data = await marginOrder(params);
                if (!data) return;
                this.$toast('订单提交成功，正在跳转到收银台');
                this.$router.push(`/payment?order_sn=${data.order_sn}&type=4`)
            }
        }
    }
</script>

<style scoped lang="scss">
  .price_wrap {
    padding: 40px 40px 26px;

    .desc {
      @include height(40px);
      font-size: 28px;
      color: $c_666;
    }

    .price {
      @include height(56px);
      font-size: 40px;
      font-weight: 500;
    }
  }

  .money_wrap {
    height: 347px;
    padding: $w_30 44px;

    .title {
      @include height(40px);
      font-size: 28px;
      font-weight: 500;
      margin-bottom: 27px;
    }

    .money_list {
      display: flex;
      justify-content: space-between;
      height: 56px;
      font-size: 24px;
    }

    .money_item {
      width: 130px;
      @include height(56px);
      color: $c_666;
      background-color: $c_bg;
      text-align: center;

      &.active {
        color: $red;
        background: $red_bg url("/static/images/bottom_hook.png") no-repeat bottom right;
        background-size: 25px 19px;
      }
    }
  }

  .btn_wrap {
    padding: 0 45px;

    .btn {
      width: 100%;
      height: 88px;
      background: $red;
      border-radius: 8px;
      font-size: 30px;
      color: $white;
    }

    .link {
      text-align: center;
      margin-top: 14px;
      @include height(33px);
      font-size: 24px;
    }
  }

</style>
<style lang="scss">
  .price_wrap {
    .van-cell {
      padding: 0 5px;
    }
  }
</style>
