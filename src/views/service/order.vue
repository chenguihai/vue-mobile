<template>
  <div class="service-order" v-if="orderDetail">
    <HeadNav title="服务工作台"></HeadNav>
    <!-- 服务信息 -->
    <div class="service-info">
      <div class="info-title">
        <p>已购服务信息</p>
        <p>已托管<span class="balance">￥{{orderDetail.pay_status==1 ? orderDetail.amount : 0}}</span></p>
      </div>
      <serInfoCon :orderInfo="orderDetail"></serInfoCon>
      <!-- 订单信息 -->
      <div class="order-info">
        <div class="info-item van-ellipsis">
          <van-icon :name="require('@/assets/service/order4.png')" size="0.4rem" color="#F3262D" />
          <p>订单时间：{{orderDetail.created_at | timeFormat}}</p>
        </div>
        <div class="info-item van-ellipsis">
          <van-icon :name="require('@/assets/service/order1.png')" size="0.4rem" color="#F3262D" />
          <p>订单编号：{{orderSn}}</p>
        </div>
        <div class="info-item van-ellipsis">
          <van-icon :name="require('@/assets/service/order3.png')" size="0.4rem" color="#F3262D" />
          <p>需求类型：{{orderDetail.cate_name}}</p>
        </div>
        <div class="info-item van-ellipsis">
          <van-icon :name="require('@/assets/service/order2.png')" size="0.4rem" color="#F3262D" />
          <p>需求数量：{{orderDetail.number}}</p>
        </div>
      </div>
      <!-- 需求详情按钮 -->
      <a tag="div" :href="`/serviceDemand?sn=${orderSn}`" class="supp-view">
        <p>需求详情</p>
        <van-icon name="arrow" size="0.4rem" color="#999" />
      </a>
      <!-- 当前状态 -->
      <p class="now-status">
        当前状态:<span>{{finalProcess.status}}</span>
      </p>
      <statusBtns :role="firstPerson" :orderInfo="orderDetail" :finals="finalProcess" @update="dataUpdate"></statusBtns>
    </div>
    <!-- 各流程 -->
    <div class="order-steps">
      <h1 class="steps-title">签单</h1>
      <!-- 日志 -->
      <div class="log-box" v-if="userInfo">
        <div class="log-title">
          <p>您已与{{firstPerson === 2 ? '服务商' : '雇主'}}</p>
          <!-- userAva.src.indexOf('http')>-1?userAva.src:$store.state.ali_api_host+ -->
          <van-image v-if="userAva.src.indexOf('http')>-1" class="avatar-img"  round :src="userAva.src"/>
          <van-image v-else class="avatar-img" :noOss="userAva.noOss"  round :src="userAva.src" 
                   :lazy-load="true"/>
          <!-- <van-image class="avatar-img" :noOss="userAva.noOss"  round :src="userAva.src" 
                   :lazy-load="true"/> -->
          <p style="color:#F3262D;">{{firstPerson === 2 ? orderDetail.employee.store_name : orderDetail.employer.nick_name}}</p>
          <p >完成签单啦</p>
          <kfBtn :small="true" v-if="firstPerson === 2" :kfAcc="orderDetail.employee.kf_account"></kfBtn>
        </div>
        <p class="log" v-if="orderDetail.order_status <= 2 && orderDetail.confirm_status !== 1">
          <span>正在等待{{firstPerson === 2 ? '服务商' : '您'}}接单</span>
        </p>
        <p class="log" v-for="item in logArr" :key="item.id">{{userInfo.original.id === item.user_id ? '您' : firstPerson === 2 ? '服务商' : '雇主'}}<span v-html="item.operate"></span> {{item.created_at}}</p>
      </div>
      <h1 class="steps-title">合同</h1>
      <!-- 合同 -->
      <contract :role="firstPerson" :orderInfo="orderDetail"></contract>
      <h1 class="steps-title">工作</h1>
      <!-- 工作 -->
      <orderJob :role="firstPerson" :orderInfo="orderDetail" :phaseData="phaseData" @update="dataUpdate"></orderJob>
      <h1 class="steps-title">评价</h1>
      <!-- 评价 -->
      <orderComment :role="firstPerson" :orderInfo="orderDetail"></orderComment>
    </div>
  </div>
</template>

<script>
import { stateForUI } from './status'
import statusBtns from '@/components/service/order/statusBtns'
import serInfoCon from '@/components/service/order/serInfoCon'
import orderComment from '@/components/service/order/orderComment'
import orderJob from '@/components/service/order/job'
import contract from '@/components/service/order/contract'
import kfBtn from '@/components/common/kfBtn'
import { getOrderDetail, getUserInfo, getPhaseInfo } from '@/api/service'
const defaultAva = require('@/assets/service/icon_sign_mobile.png')
const defaultSerAva = require('@/assets/service/ser_ava.png')
export default {
  name: 'serviceOrder',
  components: { statusBtns, kfBtn, serInfoCon, orderComment, orderJob, contract },
  async beforeRouteEnter (to, from, next) {
    const { query } = to
    if (!query.sn) {
      next('/')
    } else {
      const data = await getOrderDetail(query.sn, { _to: to })
      next(vm => {
        vm.orderDetail = data
      })
    }
  },
  data () {
    return {
      orderDetail: null,
      phaseData: null,
      orderSn: this.$route.query.sn
    }
  },
  filters: {
    timeFormat (time) {
      return time.split(' ')[0]
    }
  }, 
  created () {
    this.userInit()
    // this.dataInit()
    this.phaseInit()
  },
  computed: {
    userAva () {
      const {employee:{logo},employer:{avatar}} = this.orderDetail;
      const src = this.firstPerson === 2 ? logo : avatar;
      console.log('src====',src,this.firstPerson)
      console.log('src----',avatar,logo)
      return {
        src: src || (this.firstPerson === 2 ? defaultSerAva : defaultAva),
        noOss: !src
      }
    },
    userInfo () {
      return this.$store.state.userInfo
    },
    finalProcess () {
      // 最终流程定点
      if (!this.orderDetail) return {}
      const { order_status, pay_status, isRefund, refundStatus } = this.orderDetail
      return stateForUI(+order_status, +pay_status, isRefund, refundStatus)
    },
    firstPerson () {
      if (this.userInfo && this.orderDetail) {
        const { id } = this.userInfo.original
        /*
        0 无角色身份 1服务商 2雇主
        */
         console.log('firstPerson----',id === this.orderDetail.employer.id ? 2 : 1)
        return id === this.orderDetail.employer.id ? 2 : 1
      } else {
        return 0
      }
    },
    logArr () {
      return this.orderDetail ? this.orderDetail.operateLog.filter(log => log.step === 1) : []
    }
  },
  methods: {
    async dataUpdate () {
      const data = await getOrderDetail(this.orderSn)
      if (!data) return
      this.orderDetail = data
    },
    async userInit () {
      if (this.userInfo) return
      const data = await getUserInfo()
      if (!data) return
      this.$store.commit('CHANGE_USER_INFO', data)
    },
    async phaseInit () {
      const data = await getPhaseInfo(this.orderSn)
      if (!data) return
      this.phaseData = data
    }
  }
}
</script>

<style scoped lang="scss">
.order-steps,
.service-info {
  margin-top: 20px;
  @include borderBox;
  padding: 20px 30px;
  background: #fff;
}
.order-comment,
.order-job,
.now-status,
.order-contract,
.log-title,
.log {
  font-size: 24px;
  font-family: $font;
  font-weight: 400;
}
/*=============================================
=            服务信息            =
=============================================*/
.service-info {
  .info-title {
    @include flex;
    font-size: 28px;
    font-family: $font;
    font-weight: 400;
    .balance {
      color: $red;
      font-weight: 600;
    }
  }
}

/*=====  End of 服务信息  ======*/

/*=============================================
=            订单信息总览            =
=============================================*/
.order-info {
  // @include flex;
  flex-wrap: wrap;
  .info-item {
    @include flex(flex-start);
    margin-top: 20px;
    // width: 345px;
    max-width: 100%;
    padding-bottom:4px;
    @include borderBox;
    p {
      margin-left: 10px;
      font-size: 22px;
      font-family: $font;
      font-weight: 400;
      color: #666;
    }
  }
}

/*=====  End of 订单信息总览  ======*/

/*=============================================
=            查看需求条            =
=============================================*/
.supp-view {
  @include flex;
  @include borderBox;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
  p {
    font-size: 26px;
    font-family: $font;
    font-weight: 400;
    color: #333;
  }
}

/*=====  End of 查看需求条  ======*/
.now-status {
  padding: 20px 0;
  span {
    color: #ff9b2f;
  }
}

/*=============================================
=            其他流程盒子            =
=============================================*/

.order-steps {
  .steps-title {
    font-size: 28px;
    font-family: $font;
    font-weight: 400;
    color: #333;
    font-weight:bold;
    margin-bottom: 10px;
    margin-top: 50px;
    &:first-child {
      margin-top: 0;
    }
  }

  /* 日志 */

  .log-box {
    color: #666;
    .log-title {
      @include flex(flex-start);
      .avatar-img {
        @include square(56);
        margin: 0 6px;
      }
      .kf-btn {
        margin-left: 30px;
      }
    }
    .log {
      width: 100%;
      @include borderBox;
      padding: 11px 10px;
      background: #fff8f8;
      margin-top: 10px;
    }
  }
}

/*=====  End of 其他流程盒子  ======*/
</style>
