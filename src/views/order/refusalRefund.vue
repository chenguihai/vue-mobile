<template>
  <div class="container">
    <head-nav title="拒绝退款"></head-nav>
    <div class="split_line"></div>
    <div class="textarea">
      <textarea class="need-text" maxlength="200" v-model="reason" placeholder="请输入需要描述的内容（字数限制200字）"></textarea>
    </div>
    <fixed-btn name="确定" :fixed="0" @submit="onSubmit"></fixed-btn>
  </div>
</template>

<script>
  import FixedBtn from "@/components/common/FixedBtn";
  import {refundStatus} from '@/api/order'

  export default {
    name: "refusalRefund",
    components: {FixedBtn},
    data() {
      return {
        reason: '',
        selectId: '',
        selectType: '',
      }
    },
    created() {
      let {id = 0, type = ''} = this.$route.query;
      this.selectId = id;
      this.selectType = type;
    },
    methods: {
      onSubmit() {
        this.refundStatusHttp();
      },
      async refundStatusHttp() {
        if (!this.selectId) {
          return
        }
        let params = {
          id: this.selectId,//	是	integer	退款id
          status: 2,//	是	integer	状态:1退款,2拒绝
          reason: this.reason,//	否	string	原因，状态为2的时候必填
        }
        const data = await refundStatus(params);
        if (!data) return
        this.$router.push({
          path: this.selectType === 'list' ? '/orderRefund' : '/order/orderDetail',
          query: {id: this.selectId}
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .textarea {
    padding: 20px 30px;

    .need-text {
      width: 100%;
      height: 300px;
      @include borderBox;
      padding: 20px;
      border: 1px solid #ccc;
      font-size: 20px;
      font-weight: 400;
      line-height: 28px;
      resize: none;
      margin-bottom: 43px;
    }
  }
</style>
