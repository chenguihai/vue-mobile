<template>
  <div class="container">
    <head-nav title="实名认证"></head-nav>
    <auth-type v-if="!statusObj.name && c_steps===-1" type="company" @jump="clickType"></auth-type>
    <template v-else>
      <audit-pass
        v-if="statusObj.signstatus===3 && statusObj.sd_id != null && statusObj.quickAuth !==1&& statusObj.audit_status === 1"
      ></audit-pass>
      <div
        v-else-if="statusObj.quickAuth ===2 && (statusObj.step===4 || statusObj.step===2) && !companyFlag"
      >
        <audit-wait v-if="statusObj.audit_status===0 && statusObj.accountid"></audit-wait>
        <audit-fail
          v-else-if="statusObj.audit_status===-1 && statusObj.accountid"
          @step="clickStep"
        ></audit-fail>
      </div>
      <real-fail
        v-else-if="!statusObj.accountid && statusObj.quickAuth ===0&& statusObj.step===4 && !companyFlag"
        @step="clickStepReal"
      ></real-fail>
      <div v-else-if="c_steps >= 1 || companyFlag">
        <invoice-info1 key="1" v-if="c_steps ===1" @step="clickStep"></invoice-info1>
        <corporate-info2 key="2" v-if="c_steps ===2" @step="clickStep"></corporate-info2>
        <account-info3 key="3" v-if="c_steps ===3" @step="clickStep"></account-info3>
        <payment-review4 key="4" v-if="c_steps ===4" @step="clickStep"></payment-review4>
      </div>
    </template>
  </div>
</template>

<script>
import invoiceInfo1 from "./invoiceInfo1";
import corporateInfo2 from "./corporateInfo2";
import accountInfo3 from "./accountInfo3";
import paymentReview4 from "./paymentReview4";
import auditPass from "./auditPass";
import auditFail from "./auditFail";
import auditWait from "./auditWait";
import realFail from "./realFail";
import { status } from "@/api/audit";
import AuthType from "./authType";

export default {
  name: "companyInfo",
  components: {
    invoiceInfo1,
    corporateInfo2,
    accountInfo3,
    paymentReview4,
    auditPass,
    auditFail,
    auditWait,
    realFail,
    AuthType
  },
  data() {
    return {
      statusObj: {},
      c_steps: -1, // 默认 -1
      companyFlag: false,
      cAuthForm1: {
        name: "", // 公司名称
        legalName: "", // 法人姓名
        codeUSC: "" // 统一社会信用代码
      },
      cAuthForm2: {
        name: "", // 公司名称
        idno: "", // 身份证号码
        mobile: "" // 手机号码
      }
    };
  },
  created() {
    this.getStatus();
  },
  methods: {
    clickType() {
      this.c_steps = 1;
    },
    clickStep(index) {
      this.c_steps = index;
      if (index === 3) {
        // this.getStatus();
        // this.$set(this.statusObj, 'audit_status', 0)
        // console.log(JSON.parse(JSON.stringify(this.statusObj)));
        // this.$store.commit('AUTH_INFO', this.statusObj)


        // this.$router.push({ path: "/jumpPage" });
      } else if (index == 5) {
        this.companyFlag = false;
        this.getStatus();
      } else {
        this.companyFlag = true;
      }
    },
    clickStepReal(index) {
      this.c_steps = index;
      this.companyFlag = true;
    },
    async getStatus() {
      let data = await status();
      if (!data) return;
      if (data.status === 2) {
        // 企业
        // const { stop = -1 } = this.$route.query;
        // if (stop > -1) {
        //   this.c_steps = stop;
        // } else {
          this.c_steps = data.step === 3 ? 4 : 1;
        // }
      } else {
        // 个人
        this.$router.push({ path: "/personalInfo" });
      }
      this.statusObj = data;
      console.log(JSON.parse(JSON.stringify(data)));
      this.$store.commit("AUTH_INFO", data);
    }
  }
};
</script>

<style scoped lang="scss">
</style>
