<template>
  <div class>
    <h4 class="step_title">填写企业信息</h4>
    <div class="company_name">
      <van-cell-group>
        <van-field
          v-model="form.name"
          :disabled="authInfo.quickAuth>0"
          label="企业名称"
          placeholder="请输入企业名称"
          input-align="right"
          @input="verificationForm"
        />
        <van-field
          v-model="form.codeUSC"
          :disabled="authInfo.quickAuth>0"
          label="统一信任代码"
          placeholder="请输入统一信任代码"
          input-align="right"
          @input="verificationForm"
        />
        <van-field
          v-model="form.legalName"
          :disabled="authInfo.quickAuth>0"
          label="企业法人"
          placeholder="请输入企业法人姓名"
          input-align="right"
        />
        <van-cell
          title="企业所在地"
          :value-class="{cell_item:formShow.areaName}"
          is-link
          :value="formShow.areaName || '请选择'"
          @click="showPopup"
        />
        <van-field
          v-model="form.address"
          label="详细地址"
          placeholder="请输入详细地址"
          input-align="right"
          @input="verificationForm"
        />
        <van-cell
          :value-class="{cell_item:form.begin_time}"
          title="营业年限开始"
          is-link
          :value="form.begin_time || '请选择'"
          @click="showTimePopup('begin')"
        />
        <van-cell
          :value-class="{cell_item:form.end_time}"
          title="营业年限结束"
          is-link
          :value="form.end_time || '请选择'"
          @click="showTimePopup('end')"
        />
      </van-cell-group>
      <div class="desc_wrap">
        <van-field
          class="company_desc"
          v-model="form.business_scope"
          autosize
          rows="3"
          type="textarea"
          border
          placeholder="请填写您营业执照上的经验范围"
          @input="verificationForm"
        />
      </div>
      <!--上传身份证的组件-->
      <upload-id v-model="fileLists" :list="uploadData"></upload-id>
    </div>
    <fixed-btn name="保存" :disabled="!isDisabled" :fixed="2" @submit="onSubmit"></fixed-btn>
    <!--选择省市区-->
    <van-popup class="bounced" v-model="areaFlag" position="bottom">
      <van-area
        class="selected"
        :area-list="areaList"
        :columns-placeholder="['请选择', '请选择', '请选择']"
        @cancel="emitClose"
        @confirm="onConfirmArea"
      />
    </van-popup>
    <!--开始时间-->
    <datetime-picker v-if="timeFlag" :date="currentDate" @submit="emitTimePopup" @close="emitClose"></datetime-picker>
  </div>
</template>

<script>
import area from "@/assets/js/area";
import UploadId from "@/components/UploadId";
import FixedBtn from "@/components/common/FixedBtn";
import DatetimePicker from "@/components/common/DatetimePicker";
import { uploadLicense } from "@/utils/commonData";
import { checkcompany } from "@/api/audit";
import { mapState } from "vuex";
import { commonRegs, commonToastRegs } from "@/utils/tool";

const errMsgList = new Map([
  ["name", ["请输入公司名称"]],
  ["codeUSC", ["请输入统一社会信用代码"]],
  ["legalName", ["请输入法人姓名"]],
  ["bl_district", ["请选择营业执照所在地"]],
  ["address", ["请输入营业执照详细地址"]],
  ["begin_time", ["请选择营业年限开始时间"]],
  ["end_time", ["请选择营业年限结束时间"]],
  ["business_scope", ["请输入经营范围"]],
  ["business_license", ["请输入营业执照"]]
]);
export default {
  name: "invoiceInfo1",
  components: { UploadId, FixedBtn, DatetimePicker },
  data() {
    return {
      uploadData: uploadLicense,
      formShow: {
        areaName: ""
      },
      form: {
        name: "", //	是	string	公司名称
        codeUSC: "", //	是	string	统一社会信用代码
        legalName: "", //	是	string	法人姓名
        bl_province: "", //	是	string	营业执照所在地(省)
        bl_city: "", //	是	string	营业执照所在地(市)
        bl_district: "", //	是	string	营业执照所在地(县/区)
        address: "", //	是	string	营业执照详细地址
        begin_time: "", //	否（没选长期的时候选择）	date	营业年限开始时间
        end_time: "", //	否（没选长期的时候选择）	date	营业年限结束时间
        // long_time: '',//	否（营业年限和长期二选一）	int	营业年限是否为长期 选中为：1
        business_scope: "", //	是	string	经营范围
        business_license: "" //	是	string	营业执照
      },
      formRules: [
        "name",
        "codeUSC",
        "legalName",
        "bl_district",
        "address",
        "begin_time",
        "end_time",
        "business_scope",
        "business_license"
      ],
      areaList: JSON.parse(JSON.stringify(area)),
      areaFlag: false,
      timeFlag: false,
      fileLists: [],
      selecetType: "",
      currentDate: "",
      isDisabled: false,
      isLoading: false
    };
  },
  created() {
    let data = this.authInfo;
    if (data.quickAuth > 0) {
      this.form.name = data.company_name;
      this.form.codeUSC = data.company_codeusc;
      this.form.legalName = data.name;
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
      this.checkcompanyHttp();
    },
    emitClose() {
      this.pickerFlag = false;
      this.areaFlag = false;
      this.timeFlag = false;
    },
    showPopup() {
      this.areaFlag = true;
    },
    showTimePopup(type) {
      const { begin_time, end_time } = this.form;
      this.currentDate = type === "begin" ? begin_time : end_time;
      this.timeFlag = true;
      this.selecetType = type;
      this.verificationForm();
    },
    emitTimePopup(value) {
      let type = this.selecetType;
      if (type === "begin") {
        this.form.begin_time = value;
      } else if (type === "end") {
        this.form.end_time = value;
      }
      this.emitClose();
      this.verificationForm();
    },
    onConfirmArea(val) {
      const [province = {}, city = {}, district = {}] = val;
      if (!district.name) return;
      this.formShow.areaName = `${province.name}/${
        province.name === city.name ? "" : city.name + "/"
      }${district.name}`;
      this.form.bl_province = province.code;
      this.form.bl_city = city.code;
      this.form.bl_district = district.code;
      this.emitClose();
    },
    async checkcompanyHttp() {
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      let data = await checkcompany(this.form);
      if (!data) {
        this.isLoading = false;
        return;
      }
      localStorage.setItem("companyInfo", JSON.stringify(data));
      this.$emit("step", 2);
      this.isLoading = false;
      // this.$router.push({path: '/corporateInfo2'})
    }
  },
  computed: mapState({
    authInfo: state => state.authInfo
  }),
  watch: {
    fileLists(val) {
      const [license = {}] = this.fileLists;
      this.form.business_license = license.url || "";
      this.isDisabled = commonRegs(this.formRules, this.form);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../css/auth";
</style>
