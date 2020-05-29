<template>
  <div class="ser-refund">
    <HeadNav title="解释"></HeadNav>
    <div class="refund">
      <serInfoCon class="explain-ser"></serInfoCon>
      <h5 class="sec-title">解释内容</h5>
      <textarea v-model="explain" class="msg-box" maxlength="300" placeholder="请输入需要描述的内容（字数限制300字）" />
      </div>
    <div class="btn-box">
      <div class="btn" @click="submitExplain">提交解释</div>
    </div>
  </div>
</template>

<script>
import serInfoCon from '@/components/service/order/serInfoCon'
import { bodyColor } from '@/utils/mixins'
import { sendExplain } from '@/api/service'
export default {
  name: 'serviceExplain',
  mixins: [bodyColor('box100')],
  components: {
    serInfoCon
  },
  data () {
    return {
      explain: '',
      orderSn: this.$route.query.sn,
      isOth: false
    }
  },
  async beforeRouteEnter (to, from, next) {
    const { query, path } = to
    if (!query.sn) {
      next('/')
    } else {
      next(vm => {
        vm.isOth = path !== '/serviceOrder'
      })
    }
  },
  methods: {
    async submitExplain () {
      if (this.explain === '') return this.$toast('请填写解释内容')
      if (this.explain.length > 300) {
        this.$toast('请输入300字以内。')
        return
      }
      const params = {
        order_sn: this.orderSn,
        explain: this.explain
      }
      const res = await sendExplain(params)
      if (!res) return
      this.$toast('提交解释成功')
      const rep = this.isOth ? {
        path: '/evaluationOrder',
        query: { type: 0 }
      } : {
        path: '/serviceOrder',
        query: { sn: this.orderSn }
      }
      this.$router.replace(rep)
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
.explain-ser {
  padding-bottom: 30px;
  border-bottom: 1px solid #eee;
}
.sec-title {
  margin-top: 30px;
  margin-bottom: 20px;
  font-size: 26px;
  font-family: $font;
  font-weight: 400;
  color: #666;
}
</style>
