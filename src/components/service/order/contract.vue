<template>
  <div class="order-contract">
    <p>{{tipText}}</p>
    <div class="contract-btn" :class="{'dis-btn':orderInfo.order_status < 3 || [8,9].includes(orderInfo.order_status)}" @click="readySign">{{btnText}}</div>
    <skyPop v-model="showPop">
      <!-- 未实名 -->
      <template v-if="nowPop === 0">
        <h5 class="pop-title">温馨提示</h5>
        <p class="pop-tip">
          根据《电子签名法》，电子合同具有法律效
          力，为了确保您的签名真实有效，请先实名
          认证。
        </p>
        <a class="pop-btn" tag="div" href="/userContent/homePage/realName">实名认证</a>
      </template>

      <!-- 功能异常 -->
      <template v-if="[2,3].includes(nowPop)">
        <h5 class="pop-title">温馨提示</h5>
        <p class="pop-tip" v-if="nowPop === 2">
          您的合同功能异常，请拨打以下客服电
          话联系管理员进行处理。
        </p>
        <p class="pop-tip" v-if="nowPop === 3">
          读取企业公章异常，请拨打以下客服电
          话联系管理员进行处理。
        </p>
        <p class="pop-kf">
          客服电话
          <span>400-688-6662</span>
        </p>
      </template>

      <!-- 选择模板 -->
      <template v-if="nowPop === 1">
        <h5 class="pop-title">签署合同</h5>
        <p class="contract-tip">
          电子合同可以有效的保证网络交易的双方权益，减
          少甲乙双方带来的纠纷。
        </p>
        <img class="contract-logo" src="@/assets/service/contract-logo.png" alt="合同LOGO">
        <a class="contract-ug-btn" :href="`/serviceContract?sn=${orderSn}&type=0`">发起凌天众媒官方合同</a>
      </template>
    </skyPop>
  </div>
</template>

<script>
import skyPop from '@/components/service/order/skyPop'
import { getContractStatus, getContract, isCert } from '@/api/service'
export default {
  name: 'contract',
  components: {
    skyPop
  },
  data () {
    return {
      doing: this.$route.query.doing,
      showPop: false, // 弹框提示
      nowPop: 3, // 0未实名 1选择模板 2功能异常 3读取公章异常
      contractDetail: null,
      isFill: false // 是否已经填充模板
    }
  },
  // role 1 服务商 2雇主
  props: ['role', 'orderInfo'],
  computed: {
    selfSign () {
      return this.role === 1 ? this.signB : this.signA
    },
    btnText () {
      if (!this.isFill) return '发起合同'
      return this.selfSign ? '查看合同' : '签署合同'
    },
    tipText () {
      if (this.orderInfo.order_status < 3) return '当前还不能发起合同'
      if (!this.isFill) return '还没有发起合同，请尽快发起合同'
      if (this.signA && this.signB) {
        return `已经签署合同，${this.role === 1 ? '您' : '服务商'}开始工作`
      } else {
        return this.selfSign ? '等待对方签署' : '合同已发起，请尽快签署合同'
      }
      // if (this.signA && !this.signB) return `雇主已经签署，等待服务商签署`
      // if (!this.signA && this.signB) return `服务商已经签署，等待雇主签署`
      // if (!this.signA && !this.signB) return `已经发起合同，请尽快签署`
    },
    orderSn () {
      return this.orderInfo.order_sn
    },
    signA () {
      // 雇主是否已签
      if (!this.contractDetail) return false
      return !!this.contractDetail.signA
    },
    signB () {
      // 服务商是否已签
      if (!this.contractDetail) return false
      return !!this.contractDetail.signB
    }
  },
  created () {
    this.contractInit()
    if (this.doing === 'noCert') {
      this.popTip(0)
    }
  },
  methods: {
    async contractInit () {
      this.checkFill()
    },
    async checkFill () {
      // 查看模板填充状态
      const data = await getContractStatus(this.orderSn)
      this.isFill = !!data
      if (this.isFill) {
        // 如果已经填充 说明已经发起 则查看合同
        this.checkContract()
      }
    },
    async checkContract () {
      const data = await getContract(this.orderSn)
      if (!data) return
      this.contractDetail = data.data
    },
    async readySign () {
      if (this.orderInfo.order_status < 3 || [8, 9].includes(this.orderInfo.order_status)) return
      const cert = await isCert()
      if (!cert) return this.popTip(0)
      if (!this.isFill) return this.popTip(1)
      // 选择模板
      this.$router.push({ path: '/serviceContract', query: { sn: this.orderSn, type: this.selfSign ? 2 : 1 } })
    },
    popTip (type) {
      this.nowPop = type
      this.showPop = true
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/css/sky-pop.scss";
/* 合同 */
.order-contract {
  color: #666;
  .contract-tip {
    line-height: 33px;
  }
}
</style>
