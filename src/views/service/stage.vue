<template>
  <div class="stage">
    <HeadNav :title="role === 2 ? '确定验收付款' : '申请验收付款'"></HeadNav>
    <div class="stage-info" v-if="phase">
      <p class="title">
        当前阶段“<span style="color:#333;">{{phase.payOrderStage.name}}</span>”{{payWho}}
        <span style="color:#ff0027;">{{phase.payOrderStage.moneys}}</span>元，赏金剩余
        <span style="color:#ff0027;">{{phase.payOrderStage.balance}}</span>元
      </p>
      <RTable :border="true" :tableHead="recordTableHead" :tableData="phase.orderStageList">
        <p slot="status" slot-scope="scope">
          {{scope.row.status === 1 ?'已付款' : '未付款'}}
        </p>
      </RTable>
      <!-- 短信验证 -->
      <template v-if="role === 2">
        <p class="user-info">接收手机号码：{{phase.mobile}}</p>
        <van-field v-model="code" placeholder="短信验证码" class="code-box" type="number">
          <div class="code-btn" @click="sendCode" :class="{'dis-btn':!canCountDownDo}" slot="button">{{countDownUIText}}</div>
        </van-field>
      </template>
      <section class="tips">
        <p>温馨提示：</p>
        <template v-if="role === 2">
          <p>1、此操作会从托管金额中扣除指定金额支付给服务商，请谨慎操作；雇主需支付完上一阶段的金额，才能进行下一阶段的支付</p>
          <p>2、如需更换手机号请前往雇主中心->更改绑定手机号页面进行更换</p>
        </template>
        <template v-else>
          <p>1、此操作会通知雇主验收您上传的文件，请确保您已完成当前阶段工作并上传成果。</p>
          <p>2、雇主验收通过后，平台将奖金结算到您的账户余额。</p>
        </template>
      </section>
    </div>
    <div class="btn-box">
      <div class="btn cancel" @click="$router.go(-1)">取消</div>
      <div class="btn" @click="submit">确定</div>
    </div>
  </div>
</template>

<script>
import { bodyColor, countDownMixin } from '@/utils/mixins'
import RTable from '@/components/service/order/RecordTable/RecordTable'
import { getPhaseInfo, payPhase, sendPhaseCode, applyPay } from '@/api/service'
export default {
  name: 'serviceStage',
  mixins: [bodyColor('box100'), countDownMixin()],
  components: { RTable },
  async beforeRouteEnter (to, from, next) {
    const { query } = to
    if (query.sn) {
      const data = await getPhaseInfo(query.sn, { _to: to })
      next(vm => {
        vm.phase = data
      })
      return
    }
    next()
  },
  data () {
    return {
      phase: null,
      orderSn: this.$route.query.sn,
      recordTableHead: [
        {
          name: '项目阶段',
          props: 'stage'
        },
        {
          name: '工期',
          props: 'days'
        }, {
          name: '付款金额',
          props: 'moneys'
        }, {
          name: '付款状态',
          props: 'status'
        }
      ],
      code: '',
      key: '',
      role: +this.$route.query.role // 1服务商 2雇主
    }
  },
  computed: {
    payWho () {
      return this.role === 1 ? '雇主需支付给您' : '您需支付给服务商'
    }
  },
  methods: {
    async applyPayment () {
      const res = await applyPay(this.orderSn)
      if (!res) return
      this.$toast('申请成功')
      this.$router.replace({ path: '/serviceOrder', query: { sn: this.orderSn } })
    },
    async submit () {
      if (this.role === 1) return this.applyPayment()
      if (this.code === '') return this.$toast('请填写验证码')
      const params = {
        order_sn: this.orderSn,
        verification_key: this.key,
        verification_code: this.code,
        stage_id: this.phase.payOrderStage.id // 阶段id
      }
      const res = await payPhase(params)
      if (!res) return
      // 发起结算 后应该支付
      this.$toast('验收成功')
      this.$router.replace({ path: '/serviceOrder', query: { sn: this.orderSn } })
    },
    async sendCode () {
      if (!this.canCountDownDo) return
      if (!this.phase.mobile) return this.$toast('手机号解析错误')
      const res = await sendPhaseCode(this.phase.mobile)
      if (!res) return
      this.key = res.key
      // 发送验证码
      this.countDownInit()
    },
    async getPhase () {
      const data = await getPhaseInfo(this.orderSn)
      if (!data) return
      this.phase = data
    }
  }
}
</script>

<style scoped lang="scss">
.header {
  height: 88px;
}
.stage {
  width: 100%;
  height: 100%;
  @include flex;
  flex-direction: column;
  .btn-box {
    width: 100%;
    @include flex;
    .btn {
      flex: 1;
      @include borderBox;
      height: 98px;
      line-height: 98px;
      text-align: center;
      font-size: 30px;
      font-family: $font;
      font-weight: 500;
      background: $red;
      color: #fff;
      &.cancel {
        background: #fff;
        color: #666;
        border-top: 1px solid #ccc;
      }
    }
  }
  .stage-info {
    width: 100%;
    margin-top: 20px;
    flex: 1;
    background-color: #fff;
    @include borderBox;
    padding: 30px;
    padding-bottom: 130px;
    overflow-y: auto;
    .title {
      font-size: 26px;
      font-family: $font;
      font-weight: 400;
      color: #666;
    }
    .user-info {
      margin-top: 30px;
      @extend .title;
    }
    .code-box {
      width: 480px;
      padding: 0;
      margin-top: 20px;
      /deep/ .van-field__body {
        height: 100%;
        .van-field__control {
          font-family: $font;
          font-weight: 400;
          line-height: 0.493rem;
          font-size: rem(26);
          height: 100%;
          border: 1px solid #ccc;
          @include round(0.05rem 0px 0px 0.05rem);
          padding: 0 0.266rem;
        }
        .van-field__button {
          padding-left: 0;
        }
      }
      .code-btn {
        font-size: 30px;
        font-family: $font;
        font-weight: 400;
        background: $red;
        @include round(0 4px 4px 0);
        padding: 15px 23px;
        color: #fff;
        line-height: 37px;
        &.dis-btn {
          background: #cccccc;
          color: #fff;
          cursor: not-allowed;
          pointer-events: none;
        }
      }
    }
    .tips {
      margin-top: 30px;
      font-size: 22px;
      font-family: $font;
      font-weight: 400;
      color: #999;
      line-height: 30px;
    }
  }
}
</style>
