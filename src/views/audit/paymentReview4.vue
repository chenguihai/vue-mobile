<template>
  <div class="container">
    <h4 class="step_title">对公打款对账</h4>
    <div class="pay_wrap">
      <img class="img" src="@/assets/auth/money.png" alt />
      <p class="desc">系统即将往您公司的对公账户打一笔1元以下的款项，打款将在两小时内完成，请收到款项后再次点击实名认证进入本页面填写打款金额，完成身份认证。</p>
      <div class="pay_money">
        <van-field
          v-model="form.cash"
          label="打款金额"
          placeholder="请输入打款金额"
          input-align="right"
          @input="verificationForm"
        />
      </div>
    </div>
    <fixed-btn name="下一步" :disabled="!isDisabled" :fixed="1" @submit="onSubmit">
      <p class="reminder">
        温馨提示
        <br />打款到账最多需要等待30分钟，打款金额72小时有效，请及时查看收款记录并提交验证，允许最多错误3次，超过3次请重新申请实名认证。
      </p>
    </fixed-btn>
  </div>
</template>

<script>
import FixedBtn from "@/components/common/FixedBtn";
import { commonRegs, commonToastRegs } from "@/utils/tool";
import { payAuth } from "@/api/audit";
const errMsgList = new Map([["cash", ["请输入资金"]]]);
export default {
  name: "paymentReview4",
  components: { FixedBtn },
  data() {
    return {
      form: {
        cash: "", //	是	int	资金
        serviceId: "" //	是	string	serviceId
      },
      formRules: ["cash"],
      isDisabled: false,
      isLoading: false
    };
  },
  created() {
    let companyInfo = localStorage.getItem("companyInfo");
    if (companyInfo) {
      let data = JSON.parse(companyInfo);
      this.form.serviceId = data.service_id;
    }
  },
  methods: {
    verificationForm() {
      this.isDisabled = commonRegs(this.formRules, this.form);
    },
    onSubmit() {
      this.isDisabled = commonToastRegs(
        this.formRules,
        this.form,
        errMsgList,
        this
      );
      if (!this.isDisabled) return;
      if (!this.form.cash) {
        this.$toast("请输入打款金额");
        return;
      }
      this.payAuthHttp();
    },
    async payAuthHttp() {
      if (this.isLoading) return;
      this.isLoading = true;
      let data = await payAuth(this.form);
      if (!data) {
        this.isLoading = false;
        return;
      }
      if (data.failure >= 3) {
        this.$emit("step", 5);
      } else if (data.errCode === 0) {
        this.$emit("step", 5);
      }
      this.isLoading = false;
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../css/auth";
.pay_wrap {
  padding: 50px $w_30 0;

  .img {
    display: block;
    width: 150px;
    height: 150px;
    margin: 0 auto;
  }

  .desc {
    height: 111px;
    line-height: 37px;
    font-size: 26px;
    padding: 0 $w_15;
    margin: 50px auto;
  }

  .pay_money {
    border: 1px solid $c_ccc;
  }
}
</style>
