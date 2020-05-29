<template>
  <div class="ser-refund">
    <HeadNav title="评价"></HeadNav>
    <div class="refund">
      <serInfoCon class="ser-info" v-if="orderDetail" :orderInfo="orderDetail"></serInfoCon>
      <div class="sel-comment">
        <p>综合评分</p>
        <div class="icon-box">
          <commentIcon :type="1" :isRadio="true" :nowSel.sync="evaluate"></commentIcon>
          <commentIcon :type="2" :isRadio="true" :nowSel.sync="evaluate"></commentIcon>
          <commentIcon :type="3" :isRadio="true" :nowSel.sync="evaluate"></commentIcon>
        </div>
      </div>
      <div class="rate-box" v-if="role === 2">
        <div class="rate">
          <p>服务态度</p>
          <van-rate v-model="attitude" color="#F3262D" />
        </div>
        <div class="rate">
          <p>工作速度</p>
          <van-rate v-model="speed" color="#F3262D" />
        </div>
        <div class="rate">
          <p>完成质量</p>
          <van-rate v-model="quality" color="#F3262D" />
        </div>
      </div>
      <h5 class="oth-title">评价内容</h5>
      <textarea v-model="con" class="msg-box" maxlength="300" :placeholder="placeEvalOfWho" />

      </div>
      <div class="btn-box">
        <div class="btn" @click="submit">提交评价</div>
      </div>

  </div>
</template>

<script>
import serInfoCon from '@/components/service/order/serInfoCon'
import commentIcon from '@/components/service/detail/commentIcon'
import { bodyColor } from '@/utils/mixins'
import { getOrderDetail, sendComments } from '@/api/service'
export default {
  name: 'serviceAdditional',
  mixins: [bodyColor('box100')],
  components: {
    serInfoCon,
    commentIcon
  },
  async beforeRouteEnter (to, from, next) {
    const { query, path } = to
    if (!query.sn) {
      next('/')
    } else {
      const data = await getOrderDetail(query.sn, { _to: to })
      next(vm => {
        vm.orderDetail = data
        vm.isOth = path !== '/serviceOrder'
      })
    }
  },
  data () {
    return {
      con: '',
      evaluate: 1,
      attitude: 0,
      speed: 0,
      quality: 0,
      role: +(this.$route.query.role || 2),
      orderSn: this.$route.query.sn,
      isOth: false,
      orderDetail: null
    }
  },
  computed: {
    placeEvalOfWho () {
      return this.role === 1 ? '请评价雇主（字数限制300字）' : '请评价服务商（字数限制300字）'
    }
  },
  methods: {
    async submit () {
      if (this.con === '') return this.$toast('请填写评价内容')
      if (this.role === 2 && [this.attitude, this.speed, this.quality].includes(0)) return this.$toast('最低评价1星')
      let params = {
        order_sn: this.orderSn,
        type: 2,
        evaluate: this.evaluate,
        text: this.con
      }
      if (this.role === 2) {
        params.attitude = this.attitude
        params.speed = this.speed
        params.quality = this.quality
        params.type = 1
      }
      const res = await sendComments(params)
      if (!res) return
      this.$toast('提交评价成功')
      this.$router.go(-1);
      // const rep = this.isOth ? {
      //   path: '/evaluationOrder',
      //   query: { type: 1 }
      // } : {
      //   path: '/serviceOrder',
      //   query: { sn: this.orderSn }
      // }
      // this.$router.replace(rep)
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
  overflow-y: auto;
  background: #fff;
  padding: 20px 30px;
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
  .ser-info {
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
  }
  .sel-comment {
    @include flex;
    margin-top: 32px;
    margin-bottom: 31px;
    > p {
      font-size: 26px;
      font-family: $font;
      font-weight: 400;
      color: #333;
    }
    .icon-box {
      margin-left: 40px;
      @include flex;
      flex: 1;
    }
  }
  .rate {
    margin-top: 20px;
    @include flex(flex-start);
    &:first-child {
      margin-top: 0;
    }
    p {
      font-size: 26px;
      font-family: $font;
      font-weight: 400;
      color: #666;
      margin-right: 30px;
    }
  }
  .oth-title {
    font-size: 26px;
    font-family: $font;
    font-weight: 400;
    color: #666;
    margin-top: 40px;
    margin-bottom: 20px;
  }
}
.btn-box {
  background: #fff;
  padding-bottom: 30px;
  height: 98px;
  @include borderBox;
  width: 100%;
}
.btn {
  background: $red;
  width: 690px;
  height: 68px;
  @include flex(center);
  font-size: 30px;
  font-family: $font;
  font-weight: 500;
  color: #fff;
  margin: auto;
}
</style>
