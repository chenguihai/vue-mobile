<template>
  <div class="container">
    <head-nav title="入驻须知"></head-nav>
    <div class="settled_wrap">
      <p class="info">当前入驻的类目有以下信息需要知晓：</p>
      <!--诚信保证金-->
      <div class="title"><span class="type">诚信保证金</span>
        <a tag="span" href="/bond" class="desc blue">了解诚信保证金<img class="arrow"
                                                                         src="@/assets/auth/arrow_right.png" alt="">
        </a>
      </div>
      <ul class="type_wrap">
        <li class="type_item"><span class="label">服务商等级：<span class="red">{{storeDetail.shopLevel &&storeDetail.shopLevel.bl_name}}</span></span>
          <span>店铺赋能技能：<span class="red">{{(left.enteredNum-(-left.remain)) || 0}}个</span></span>
        </li>
        <li class="type_item"><span class="label">{{left.cate_name}}</span>
          <span>最低缴纳：<span
            class="red">¥{{storeDetail.type_id==1?left.min_deposit_personal:left.min_deposit_enterprise}}</span></span>
        </li>
      </ul>
      <!--技术费率-->
      <div class="title"><span class="type">技术费率</span>
        <a tag="span" href="/skillRate" class="desc blue">了解技术费率<img class="arrow"
                                                                             src="@/assets/auth/arrow_right.png" alt="">
        </a>
      </div>
      <ul class="type_wrap">
        <li class="type_item"><span class="label">技能：{{left.cate_name}}</span></li>
        <li class="type_item">
          <div class="skill_item" v-for="(item,index) in right" :key="index">
            <span class="label">{{item.cate_name}}</span>
            <span>技术费率：<span class="red">{{item.tech_rate}}%</span></span>
            <!--            <router-link tag="span" to="/skillRate">技术费率：<span class="red">{{item.tech_rate}}%</span></router-link>-->
          </div>
        </li>
      </ul>
      <p class="prompt_info" v-if="left.type">您的技能类目已用完，您可以通过购买技能类目或升级会员扩充技能类目。</p>
      <div class="btn_wrap">
        <van-button v-if="left.type" round plain class="custom_btn" :to="{path:'/tollMarketData?id=1'}">立即扩充类目
        </van-button>
        <template v-else>
          <van-checkbox icon-size="15px" class="check_wrap" v-model="checked">我已阅读并同意
            <a tag="a" href="/serviceSettle" class="blue">《服务入驻协议》</a>
          </van-checkbox>
          <van-button round plain class="custom_btn" :disabled="!checked" @click="onSubmit">同意上述规则</van-button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {skillAdd} from '@/api/auth'

  export default {
    name: "noticeEntry",
    data() {
      return {
        checked: false,
        skillObj: {},
        left: {},
        right: [],
        params: null
      }
    },
    created() {
      let addKill = localStorage.getItem('addKill');
      if (addKill) {
        const {left = {}, right = [], params = {}} = JSON.parse(addKill) || {};
        this.left = left;
        this.right = right;
        this.params = params;
      }
      let store = localStorage.getItem('storeInfo');
      if (this.storeInfo.type_id) {
        this.storeDetail = this.storeInfo;
      } else if (store) {
        this.storeDetail = JSON.parse(store);
      }
    },
    methods: {
      onSubmit() {
        if (!this.checked) {
          this.$toast('请勾选服务入驻协议');
          return;
        }
        this.addSkill();
      },
      async addSkill() {
        if (!this.params) return;
        let data = await skillAdd(this.params);
        if (!data) return
        this.$router.push({path: '/skillManage'})
      }
    },
    computed: {
      ...mapState(['storeInfo']),
    }
  }
</script>

<style scoped lang="scss">
  .settled_wrap {
    padding: $w_20 $w_30 210px;
    border-top: 1px solid $c_eee;

    .info {
      height: 30px;
      line-height: 30px;
      font-size: 22px;
      color: $c_666;
    }

    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 40px;
      line-height: 40px;
      font-size: 28px;
      margin: $w_30 0 $w_20;

      .type {

      }

      .desc {
        display: inline-flex;
        align-items: center;
        font-size: 24px;
      }

      .arrow {
        width: 12px;
        height: 22px;
        margin-left: $w_10;
      }
    }

    .type_wrap {
      border: 1px solid $c_ccc;
    }

    .type_item {
      min-height: 77px;
      line-height: 77px;
      font-size: 26px;

      &:first-child {
        border-bottom: 1px solid $c_ccc;
      }

      .label {
        display: inline-block;
        padding-left: 20px;
        width: 389px;
      }
    }

    .skill_item {
      display: flex;
      font-size: 26px;
      height: 37px;
      line-height: 37px;
      margin: $w_20 0;
    }

    .prompt_info {
      font-size: 24px;
      color: $c_666;
      line-height: 33px;
      margin-top: $w_30;
    }

    .check_wrap {
      font-size: 24px;
      color: $c_666;
      margin-bottom: $w_30;
    }
  }

  .btn_wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px $w_30 30px;
    z-index: 10;
    background-color: $white;
  }

  .custom_btn {
    width: 100%;
    height: 88px;
    font-size: 30px;
    border-radius: 8px;
    color: $white;
    text-align: center;
    line-height: 50px;
    background: $red;
  }
</style>
