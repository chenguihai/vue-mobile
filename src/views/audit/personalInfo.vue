<template>
  <div class="container">
    <head-nav title="实名认证"></head-nav>
    <auth-type v-if="!statusObj.name &&c_steps===-1" :type="selectType === 1?'personal':'company'"
               @jump="clickType"></auth-type>
    <template v-else>
      <!--审核通过 个人-->
      <audit-pass v-if="statusObj.audit_status===1"></audit-pass>
      <!--待审核-->
      <div class="audit" v-else-if="p_steps > 1 && statusObj.audit_status === 0">
        <img class="img" src="@/assets/auth/audit.png" alt="待审核">
        <h4 class="title">您的实名认证申请已提交！</h4>
        <p class="desc">管理员会在72小时内完成审核，请耐心等待。</p>
        <div>
          <van-button plain class="danger_btn mr_30" :to="{path:'/newbieTask'}">返回新手任务</van-button>
          <van-button plain class="plain_btn" :to="{path:'/deposit'}">前往缴纳保证金</van-button>
        </div>
      </div>
      <!--审核未通过-->
      <div class="audit_failed" v-else-if="statusObj.audit_status === -1 &&personalFlag === false">
        <img class="img" src="@/assets/no_data.png" alt="审核未通过">
        <h4 class="title">您的实名认证申请审核未通过！</h4>
        <p class="desc">未通过原因：{{statusObj.remarks}}</p>
        <van-button plain class="danger_btn" @click="openStore">重新申请</van-button>
      </div>
      <!--填写审核-->
      <!--    -if="statusObj.audit_status === -1 ||personalFlag"-->
      <template v-else>
        <h4 class="step_title">填写本人信息</h4>
        <div class="company_name">
          <van-cell-group>
            <van-field :disabled="statusObj.quickAuth > 0" v-model="form.name" clearable label="真实姓名"
                       placeholder="请输入您的真实姓名" input-align="right"/>
            <van-field :disabled="statusObj.quickAuth > 0" v-model="form.idno" clearable label="身份证号码"
                       placeholder="请输入您的身份证号码" input-align="right"/>
            <van-field :disabled="statusObj.quickAuth > 0" type="number" disabled v-model="form.mobile" clearable
                       label="手机号码" placeholder="请输入您的手机号码"
                       input-align="right"/>
          </van-cell-group>
          <!--上传身份证的组件-->
          <upload-id v-model="fileLists" :list="uploadData"></upload-id>
          <upload-id v-model="fileListsSide" :list="uploadDataOther"></upload-id>
        </div>
        <fixed-btn name="下一步" :fixed="2" @submit="onSubmit"></fixed-btn>
      </template>
    </template>
  </div>
</template>

<script>
  import UploadId from '@/components/UploadId'
  import {uploadPositive, uploadOtherSide} from '@/utils/commonData'
  import FixedBtn from "@/components/common/FixedBtn";
  import {useradd, status} from '@/api/audit'
  import {checkEmptyValue} from '@/utils/tool'
  import {mapState} from 'vuex'
  import auditPass from "./auditPass";
  import AuthType from "./authType";

  const errMsgList = new Map([
    ['name', ['请输入姓名', '', '姓名必须全为中文']],
    ['idno', ['请输入身份证号码', '', '身份证号码格式错误']],
    ['mobile', ['请输入手机号码', '', '手机号格式不对']],
    ['identity_card_front', ['请上传身份证正面']],
    ['identity_card_back', ['请上传身份证反面']],
  ])
  export default {
    name: "personalInfo",
    components: {UploadId, FixedBtn, auditPass, AuthType},
    data() {
      return {
        form: {
          name: '',//	是	string	姓名
          idno: '',//	是	string	身份证号码
          mobile: '',//	是	string	手机号
          identity_card_front: '',//	是	string	身份证正面照片
          identity_card_back: '',//	是	string	身份证反面照片
        },
        formRules: [
          {
            name: 'name',
            test: /^([\u4e00-\u9fa5]+)$/
          },
          {
            name: 'idno',
            test: /[0-9X]{18}/
          },
          {
            name: 'mobile',
            test: /^((13[0-9]|14[1|5-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8})$/
          },
          'identity_card_front',
          'identity_card_back',
        ],
        fileLists: [],
        fileListsSide: [],
        uploadData: uploadPositive,
        uploadDataOther: uploadOtherSide,
        statusObj: {},
        personalFlag: false,
        c_steps: -1,
        p_steps: 1, // 默认 步骤 1
        selectType: 0
      }
    },
    created() {
      let storeInfo = localStorage.getItem('storeInfo');
      if (storeInfo) {
        let data = JSON.parse(storeInfo);
        this.selectType = data.type_id;
      }
      this.getStatus();
    },
    methods: {
      clickType() {
        this.c_steps = 1;
      },
      onSubmit() {
        const [front = {}] = this.fileLists;
        const [back = {}] = this.fileListsSide;
        this.form.identity_card_front = front.url || '';
        this.form.identity_card_back = back.url || '';
        const unlock = this.formRules.every(item => checkEmptyValue(item, this.form, (type, name) => this.$toast(errMsgList.get(name)[type])))
        if (!unlock) return
        this.addUser();
      },
      async addUser() {
        let data = await useradd(this.form);
        if (!data) return
        this.getStatus();
        // this.$router.push({path: '/auditFailed'})
        // this.$router.push({path: '/auditResult'})
      },
      async getStatus() {
        let data = await status();
        if (!data) {
          let userInfo = localStorage.getItem('user_info')
          if (userInfo) {
            let info = JSON.parse(userInfo);
            this.form.mobile = info.original.mobile;
          }
        } else if (data.status === 1) { //个人
          if (data.quickAuth > 0) {
            const {name = '', idno = '', mobile = '', identity_card_front = '', identity_card_back = ''} = data;
            this.form = {
              name, idno, mobile, identity_card_front: '', identity_card_back: ''
            };
            this.form.quickAuth = 1;
          }
          // this.fileLists = [{url: identity_card_front}];
          // this.fileListsSide = [{url: identity_card_back}];
          if (data.audit_status === 0) {
            this.p_steps = data.sd_id ? 2 : 1;
          } else if (data.audit_status === -1) {
            this.p_steps = 2
          } else if (data.audit_status === 1) { //附件资料审核状态 0：待审核 1：审核成功 -1：审核失败
            this.p_steps = 3
          }
          this.statusObj = data;
          this.$store.commit('AUTH_INFO', data)
        }
      },
      openStore() {//跳转到第一步
        this.p_steps = 1;
        this.personalFlag = true;
      },
    },
    computed: mapState({
      userInfo: state => state.userInfo
    })
  }
</script>

<style scoped lang="scss">
  .audit {
    padding: 87px 60px;
  }

  .audit_failed {
    padding: 60px;
  }

  .audit, .audit_failed {
    text-align: center;

    .img {
      display: block;
      width: 180px;
      height: 246px;
      margin: 0 auto 87px;
    }

    .title {
      @include height(42px);
      font-size: 30px;
      font-weight: 500;
    }

    .desc {
      @include height();
      font-size: 26px;
      margin: $w_30 0 57px;
    }

    .danger_btn {
      @include danger_btn();
    }

    .plain_btn {
      @include plain_btn();
    }
  }
</style>
<style lang="scss">
  @import "../../css/auth";
</style>
