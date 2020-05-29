<template>
  <div class="container">
    <h4 class="step_title">填写法人信息</h4>
    <div class="company_name">
      <van-cell-group>
        <van-field
          disabled
          v-model="form.name"
          label="对公账户户名"
          placeholder="请输入真实姓名"
          input-align="right"
          @input="verificationForm"
        />
        <van-field
          label-width="120px"
          v-model="form.cardno"
          label="对公账户银行账号"
          placeholder="请输入对公账户银行账号"
          input-align="right"
          @input="verificationForm"
        />
        <van-field
          v-model="form.bank"
          label="开户行名称"
          placeholder="请输入开户行名称"
          input-align="right"
          @input="verificationForm"
        />
        <van-field
          v-model="form.subbranch"
          label="开户支行全称"
          placeholder="请输入开户支行全称"
          input-align="right"
          @input="verificationForm"
          @blur="blurFirld"
        />
        <van-cell title="支行所在地" is-link :value="serviceName ||'请选择'" @click="bankAddres" />
      </van-cell-group>
    </div>
    <fixed-btn name="下一步" :disabled="!isDisabled" :fixed="1" @submit="onSubmit"></fixed-btn>
    <!--弹框选择-->
    <popup-picker v-if="pickerFlag" :list="columns" @submit="emitSubmit" @close="emitClose"></popup-picker>
  </div>
</template>

<script>
import FixedBtn from "@/components/common/FixedBtn";
import { topay, getbranch } from "@/api/audit";
import PopupPicker from "@/components/common/PopupPicker";
import { mapState } from "vuex";
import { commonRegs, commonToastRegs } from "@/utils/tool";

const errMsgList = new Map([
  ["name", ["请输入公司全称"]],
  ["cardno", ["请输入对公银行卡号"]],
  ["bank", ["请输入对公银行全称"]],
  ["subbranch", ["请输入支行全称"]],
  ["city", ["请选择支行所在地"]]
]);
export default {
  name: "accountInfo3",
  components: { FixedBtn, PopupPicker },
  data() {
    return {
      pickerFlag: false,
      isDisabled: false,
      serviceName: "",
      form: {
        name: "", //	是	string	公司全称
        cardno: "", //	是	string	对公银行卡号
        bank: "", //	是	string	对公银行全称
        subbranch: "", //是	string	支行全称

        provice: "", //	是	string	省
        city: "", //	是	string	市
        service_id: "" //是	string	service_id
      },
      formRules: ["name", "cardno", "bank", "subbranch", "city"],
      bankList: [],
      columns: [],
      isLoading: false
    };
  },
  created() {
    // let data = this.authInfo
    let companyInfo = localStorage.getItem("companyInfo");
    if (companyInfo) {
      let data = JSON.parse(companyInfo);
      this.form.name = data.name;
      this.form.service_id = data.service_id;
    }
  },
  methods: {
    verificationForm() {
      this.isDisabled = commonRegs(this.formRules, this.form);
    },
    bankAddres() {
      if (this.columns.length === 0) {
        this.$toast("请先输入支行全称");
        return;
      }
      this.pickerFlag = true;
    },
    blurFirld() {
      if (this.form.subbranch) {
        this.getbranchHttp();
      }
    },
    onSubmit() {
      this.isDisabled = commonToastRegs(
        this.formRules,
        this.form,
        errMsgList,
        this
      );
      if (!this.isDisabled) return;
      this.topayHttp();
    },
    async topayHttp() {
      if (this.isLoading) return;
      this.isLoading = true;
      let data = await topay(this.form);
      if (!data) {
        this.isLoading = false;
        return;
      }
      this.$emit("step", 4);
      this.isLoading = false;
      // this.$router.push({path: '/paymentReview4'})
    },
    async getbranchHttp() {
      let params = {
        keyword: this.form.subbranch //	是	string	支行全称
      };
      let data = await getbranch(params);
      if (!data) return;
      this.bankList = data;
      this.columns = Array.from(new Set(data.map(item => item.s + item.city)));
    },
    emitClose() {
      this.pickerFlag = false;
    },
    emitSubmit(val) {
      this.serviceName = val;
      let [data] = this.bankList.filter(item => item.s + item.city === val);
      this.form.provice = data.s;
      this.form.city = data.city;
      this.emitClose();
      this.verificationForm();
    }
  },
  computed: mapState({
    authInfo: state => state.authInfo
  })
};
</script>

<style lang="scss" scoped>
@import "../../css/auth";
</style>
