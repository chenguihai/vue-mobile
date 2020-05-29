<template>
  <div class="container">
    <h4 class="step_title">填写法人信息</h4>
    <div class="company_name">
      <van-cell-group>
        <van-field
          disabled
          v-model="form.name"
          label="真实姓名"
          placeholder="请输入真实姓名"
          input-align="right"
          @input="verificationForm"
        />
        <van-field
          :disabled="authInfo.quickAuth > 0"
          v-model="form.idno"
          label="身份证号码"
          placeholder="请输入法人身份证号码"
          input-align="right"
          @input="verificationForm"
        />
        <van-field
          :disabled="authInfo.quickAuth > 0"
          v-model="form.mobile"
          label="手机号码"
          placeholder="请输入法人手机号码"
          input-align="right"
          @input="verificationForm"
        />
      </van-cell-group>
      <!--上传身份证的组件-->
      <upload-id v-model="fileLists" :list="uploadData"></upload-id>
      <upload-id v-model="fileListsSide" :list="uploadDataOther"></upload-id>
    </div>
    <fixed-btn name="下一步" :disabled="!isDisabled" :fixed="2" @submit="onSubmit"></fixed-btn>
  </div>
</template>

<script>
import UploadId from "@/components/UploadId";
import FixedBtn from "@/components/common/FixedBtn";
import { checkshareholder } from "@/api/audit";
import { uploadPositive, uploadOtherSide } from "@/utils/commonData";
import { mapState } from "vuex";
import { commonRegs, commonToastRegs, regDaqo } from "@/utils/tool";

const errMsgList = new Map([
  ["name", ["请输入姓名"]],
  ["idno", ["请输入身份证号码"]],
  ["mobile", ["请输入手机号"]],
  ["identity_card_front", ["请上传身份证正面照片"]],
  ["identity_card_back", ["请上传身份证反面照片"]]
]);
export default {
  name: "corporateInfo2",
  components: { UploadId, FixedBtn },
  data() {
    return {
      fileLists: [],
      fileListsSide: [],
      uploadData: uploadPositive,
      uploadDataOther: uploadOtherSide,
      form: {
        name: "", //	是	string	姓名
        idno: "", //	是	string	身份证号码
        mobile: "", //	是	string	手机号
        identity_card_front: "", //	是	string	身份证正面照片
        identity_card_back: "" //	是	string	身份证反面照片
      },
      formRules: [
        "name",
        "idno",
        {
          name: "mobile",
          test: regDaqo.phone
        },
        "identity_card_front",
        "identity_card_back"
      ],
      isDisabled: false,
      isLoading: false
    };
  },
  created() {
    let data = this.authInfo;
    let companyInfo = localStorage.getItem("companyInfo");
    this.form.name = companyInfo && JSON.parse(companyInfo).legalName;
    if (data.quickAuth > 0) {
      this.form.idno = data.idno;
      this.form.mobile = data.mobile;
      this.form.quickAuth = 1;
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
      this.checkshareholderHttp();
    },
    async checkshareholderHttp() {
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      let data = await checkshareholder(this.form);
      if (!data) {
        this.isLoading = false;
        return;
      }
      this.$emit("step", 3);
      this.isLoading = false;
    }
  },
  computed: mapState({
    authInfo: state => state.authInfo
  }),
  watch: {
    fileLists(val) {
      const [front = {}] = this.fileLists;
      this.form.identity_card_front = front.url || "";
      this.isDisabled = commonRegs(this.formRules, this.form);
    },
    fileListsSide(val) {
      const [back = {}] = this.fileListsSide;
      this.form.identity_card_back = back.url || "";
      this.isDisabled = commonRegs(this.formRules, this.form);
    }
  }
};
</script>

<style scoped lang="scss">
</style>
<style lang="scss">
@import "../../css/auth";
</style>
