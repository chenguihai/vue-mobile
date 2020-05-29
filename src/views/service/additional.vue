<template>
  <div class="ser-refund">
    <HeadNav title="补充需求"></HeadNav>
    <div class="refund">
      <textarea v-model="message" class="msg-box" maxlength="500" placeholder="请输入需要补充的需求（字数限制500字）" />
      <comUpload ref="comUpload" v-model="files" :multiples="false"></comUpload>
    </div>
    <div class="btn" @click="sureAdd">确定</div>
  </div>
</template>

<script>
import comUpload from '@/components/service/comUpload'
import { bodyColor } from '@/utils/mixins'
import { submitSupplement } from '@/api/service'
export default {
  name: 'serviceAdditional',
  mixins: [bodyColor('box100')],
  components: {
    comUpload
  },
  data () {
    return {
      message: '',
      orderSn: this.$route.query.sn,
      orderId: this.$route.query.id,
      files: []
    }
  },
  methods: {
    async sureAdd () {
      if (this.message === '') return this.$toast('请填写需求内容')
      const data = await submitSupplement({
        require: this.message,
        require_attach: this.files.length > 0 ? this.files.map(f => f.url) : undefined,
        order_id: this.orderId
      })
      if (!data) return
      this.$toast('提交成功')
      this.$router.replace({ path: '/serviceOrder', query: { sn: this.orderSn } })
    }
  }
}
</script>

<style scoped lang="scss">
.ser-refund {
  height: 100%;
  @include flex;
  flex-direction: column;
  input,textarea{-webkit-appearance: none;appearance: none;}
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
</style>
