<template>
  <div class="container">
    <h3 class="pass_title"><i class="icon"></i><span>恭喜，您已经通过了实名认证</span></h3>
    <!--企业-->
    <ul class="pass_wrap" v-if="authInfo.status ===2">
      <li class="item">认证身份：企业</li>
      <li class="item">企业名称：{{authInfo.company_name}}</li>
      <li class="item">企业统一信任代码：{{computedCode }}</li>
      <li class="item">法人姓名：{{computedName}}</li>
      <li class="item">身份证号码：{{ computedIdno}}</li>
      <li class="item">法人手机号：{{computedPhone}}</li>
      <li class="item">合同功能：
        <span v-if="authInfo.accountid">已拥有</span>
        <span v-else>未拥有，请联系<a style="color:#0066cc" href="https://url.cn/59IhwSe?_type=wpa&qidian=true" target="_blank">客服人员</a></span>
      </li>
    </ul>
    <!--个人-->
    <ul class="pass_wrap" v-else>
      <li class="item">认证身份：个人</li>
      <li class="item">真实姓名：{{computedName}}</li>
      <li class="item">证件号码：{{computedIdno}}</li>
      <li class="item">手机号码：{{computedPhone}}</li>
      <li class="item">合同功能：
        <span v-if="authInfo.accountid">已拥有</span>
        <span v-else>未拥有，请联系<a style="color:#0066cc" href="https://url.cn/59IhwSe?_type=wpa&qidian=true" target="_blank">客服人员</a></span>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {filterName, filterPhone, filterIdno, filterCode} from '@/utils/tool'

export default {
  name: 'auditPass',
  methods: {},
  computed: {
    ...mapState({
      authInfo: state => state.authInfo
    }),
    computedName () {
      return filterName(this.authInfo.name)
    },
    computedPhone () {
      return filterPhone(this.authInfo.mobile)
    },
    computedIdno () {
      return filterIdno(this.authInfo.idno)
    },
    computedCode () {
      return filterIdno(this.authInfo.company_codeusc)
    }
  }
}
</script>

<style scoped lang="scss">
  .pass_title {
    display: flex;
    align-items: center;
    justify-content: center;
    color: $pass;
    height: 50px;
    font-size: 36px;
    font-weight: bold;
    margin-top: 60px;

    .icon {
      width: 48px;
      height: 48px;
      background: url("/static/images/auth/check_mark_green.png") no-repeat left center;
      background-size: 48px 48px;
      margin-right: 10px;
    }
  }

  .pass_wrap {
    padding: 50px 110px 16px;

    .item {
      font-size: 26px;
      line-height: 40px;
    }
  }
</style>
