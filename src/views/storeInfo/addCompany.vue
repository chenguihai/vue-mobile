<template>
  <div>
    <div class="company_name">
      <van-cell-group>
        <van-field v-model="form.company_name" label="公司名称" placeholder="请输入公司名称" input-align="right"
                   @input="verificationForm"/>
        <van-field v-model="form.short_name" label="公司简称" placeholder="请输入公司简称" input-align="right"
                   @input="verificationForm"/>
        <van-cell :value-class="{cell_item:formShow.typeName}" title="证明方式" is-link :value="formShow.typeName ||'请选择'"
                  @click="pickerFlag = true"/>

        <div class="upload_wrap">
          <h4 class="title">附件图片</h4>
          <comUpload ref="comUpload" :max="2" v-model="fileLists">
            <div slot="tips" class="need-tip">
              <!--              <p>上传图片比例最佳为5:3</p>-->
            </div>
          </comUpload>
        </div>
      </van-cell-group>
    </div>
    <fixed-btn name="保存" :disabled="!isDisabled" :fixed="1" @submit="onSubmit"></fixed-btn>
    <!--弹框选择-->
    <popup-picker v-if="pickerFlag" :list="columns" @submit="emitSubmit" @close="emitClose"></popup-picker>
  </div>
</template>

<script>
  import PopupPicker from '@/components/common/PopupPicker'
  import FixedBtn from "@/components/common/FixedBtn";
  import comUpload from "@/components/service/comUpload";
  import {companyAdd, companyEdit} from '@/api/storeInfo'
  import {commonRegs, commonToastRegs} from '@/utils/tool'

  const errMsgList = new Map([
    ['company_name', ['请输入公司名称']],
    ['short_name', ['请输入公司简称']],
    ['type_id', ['请选择证明方式']],
    ['img_license', ['请上传营业执照']],
    ['img_certify', ['请上传工牌/名片']],
  ])
  export default {
    name: "addCompany",
    components: {PopupPicker, FixedBtn, comUpload},
    data() {
      return {
        pickerFlag: false,
        formShow: {
          typeName: ''
        },
        form: {
          company_name: '',//	是	string	公司名称
          short_name: '',//	是	string	公司简称
          type_id: '',//	是	int	证明方式 1：营业执照和工牌 2：营业执照和名片
          img_license: '',//	是	string	营业执照图片路径
          img_certify: '',//	是	string	证明图片路径 工牌或者名片照片
        },
        formRules: [
          'company_name',
          'short_name',
          'type_id',
          'img_license',
          'img_certify',
        ],
        columns: ['营业执照和工牌', '营业执照和名片'],
        fileLists: [],
        isDisabled: false
      }
    },
    methods: {
      verificationForm() {
        this.isDisabled = commonRegs(this.formRules, this.form);
      },
      onSubmit() {
        this.isDisabled = commonToastRegs(this.formRules, this.form, errMsgList, this);
        if (!this.isDisabled) return;
        this.add();
      },
      emitSubmit(val) {
        this.formShow.typeName = val;
        this.form.type_id = '营业执照和工牌' === val ? 1 : 2
        this.emitClose();
        this.isDisabled = commonRegs(this.formRules, this.form);
      },
      emitClose() {
        this.pickerFlag = false;
      },
      async add() {
        const data = await companyAdd(this.form);
        if (!data) return
        this.$emit('submit')
      },
      async edit() {
        const data = await companyEdit(this.selectId, this.form);
        if (!data) return
        this.$router.push({path: '/mediaQualify'})
      },
    },
    watch: {
      fileLists(val) {
        const [license = {}, certify = {}] = this.fileLists;
        this.form.img_license = license.url || '';
        this.form.img_certify = certify.url || '';
        this.isDisabled = commonRegs(this.formRules, this.form);
      },
    }
  }
</script>

<style scoped lang="scss">
  @import "../../css/auth";
</style>
