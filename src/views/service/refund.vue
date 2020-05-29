<template>
  <div class="ser-refund">
    <HeadNav title="申请退款"></HeadNav>
    <div class="refund">
      <div class="info-box">
        <p>退款项目：</p>
        <p class="van-ellipsis">{{orderDetail.name}}</p>
      </div>
      <div class="info-box center">
        <p>应退金额：</p>
        <p class="money">￥{{orderDetail.price}}</p>
      </div>
      <div class="info-box">
        <p>申请原因：</p>
        <p class="sel-btn" @click="showWhy = true">
          <span>{{radioObj.reason || '请选择'}}</span>
          <van-icon name="arrow" />
        </p>
      </div>
      <textarea v-model="message" class="msg-box" maxlength="200" placeholder="请输入需要描述的内容（字数限制200字）" />
      <comUpload ref="comUpload" v-model="files" :multiples="false"></comUpload>
    </div>
    <div class="btn" @click="sureRefund">确定</div>
    <van-popup v-model="showWhy" class="options-box" safe-area-inset-bottom round position="bottom" @click-overlay="giveUp" @open="openUp">
      <div class="need-title">退款原因</div>
      <div class="need-body nmgt">
        <van-radio-group v-model="radio">
  <van-cell-group>
     <van-cell :title="item.reason" clickable @click="radio = item.id" v-for="item in orderDetail.refundReason" :key="item.id">
            <van-radio slot="right-icon" checked-color="#F3262D" :name="item.id" />
          </van-cell>
  </van-cell-group>
</van-radio-group>
      </div>
      <van-button square size="large" type="danger" @click="radioChange">
        确定
      </van-button>
    </van-popup>
  </div>
</template>

<script>
import comUpload from '@/components/service/comUpload'
import { bodyColor } from '@/utils/mixins'
import { getOrderDetail, applyRefund } from '@/api/service'
export default {
  name: 'serviceRefund',
  mixins: [bodyColor('box100')],
  components: {
    comUpload
  },
  data () {
    return {
      message: '',
      showWhy: false,
      radio: null,
      orderSn: this.$route.query.sn,
      orderDetail: {},
      radioObj: {},
      oldRadio: null,
      files: []
    }
  },
  created () {
    this.dataInit()
  },
  methods: {
    async dataInit () {
      const data = await getOrderDetail(this.orderSn)
      if (!data) return
      this.orderDetail = data
    },
    async sureRefund () {
      if (this.radio === null) return this.$toast('请选择退款原因')
      if (this.message === '') return this.$toast('退款描述内容为10-200字')
      if (this.radio === 8 && this.message === '') return this.$toast('请填写其他原因')
      const list = this.files
      const data = await applyRefund({
        text: this.message,
        url: list.map(f => f.url),
        reason_id: this.radio,
        order_sn: this.orderSn
      })
      if (!data) return
      this.$toast('您的退款申请已提交成功，请耐心等待服务商处理，服务商同意后平台将赏金退回到您账户余额。')
      this.$router.replace({ path: '/serviceOrder', query: { sn: this.orderSn } })
    },
    radioChange () {
      this.radioObj = this.orderDetail.refundReason.find(item => item.id === this.radio)
      this.showWhy = false
    },
    giveUp () {
      this.radio = this.oldRadio
      this.oldRadio = null
    },
    openUp () {
      this.oldRadio = this.radio
    }
  }
}
</script>

<style scoped lang="scss">
.ser-refund {
  height: 100%;
  @include flex;
  flex-direction: column;
}
.refund {
  width: 100%;
  @include borderBox;
  margin-top: 20px;
  flex: 1;
  background: #fff;
  padding: 20px 30px;
  .info-box {
    @include flex(flex-start, flex-start);
    margin-bottom: 20px;
    font-size: 26px;
    font-family: $font;
    font-weight: 400;
    color: #333;
    &.center {
      align-items: center;
    }
    .money {
      font-size: 30px;
      font-weight: 500;
      color: $red;
    }
    .sel-btn {
      flex: 1;
      color: #999;
      @include flex(flex-end);
      span {
        margin-right: 20px;
      }
    }
  }
  .msg-box {
    width: 100%;
    height: 300px;
    border: 1px solid #ccc;
    margin-bottom: 30px;
    font-size: 22px;
    font-family: $font;
    font-weight: 400;
    padding: 20px 30px;
    @include borderBox;
  }
}
.btn {
  background: $red;
  width: 100%;
  height: 98px;
  @include flex(center);
  font-size: 30px;
  font-family: $font;
  font-weight: 500;
  color: #fff;
}
.need-title {
  font-size: 30px;
  font-family: $font;
  font-weight: 600;
  color: #333;
  margin-top: 30px;
  text-align: center;
}
.need-body {
  padding: 0 30px;
  @include borderBox;
  margin-top: 44px;
  padding-top: 30px;
  &.nmgt {
    margin-top: 0;
    max-height: 860px;
    overflow: auto;
  }
}
</style>
