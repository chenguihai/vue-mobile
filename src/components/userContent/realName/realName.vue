<template>
  <div class="realName">
    <header>
      <div @click="histroyClick()">
        <img width="44" height="42" src="@/assets/arrowhead/zuo_nob.png" alt />
      </div>
      <h2>实名认证</h2>
      <MenuSlide @close="closeMenu" v-if="showMenu"></MenuSlide>
      <div class="dian" @click="onClickRight">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </header>
    <div class="realHome" v-if="flag==1">
      <span>仅针对中国大陆用户（非开店铺认证）</span>
      <div class="realPer">
        <span>个人实名</span>
        <span>每个身份证仅支持5个账户使用，且认证通过身份证号不能修改</span>
        <span @click="realPerClick">立即申请</span>
      </div>
      <div class="realPer realEnt">
        <span>企业实名</span>
        <span>每个身份证仅支持5个账户使用，且认证通过身份证号不能修改</span>
        <span @click="realEntClick">立即申请</span>
      </div>
    </div>
    <div class="realPerName" v-else-if="flag ==2">
      <span>
        <img src="../../../assets/icon/greadG.png" alt /> 恭喜，您已经通过了实名认证
      </span>
      <div>
        <span>
          认证身份：
          <p>个人</p>
        </span>
        <span>
          真实姓名：
          <p>{{reslData.name}}</p>
        </span>
        <span>
          证件号码：
          <p>{{reslData.idno}}</p>
        </span>
        <span>
          手机号码：
          <p>{{reslData.mobile}}</p>
        </span>
        <span v-if="reslData.accountid ==null || reslData.accountid ==''">
          合同功能：未拥有，请联系
          <a href="https://url.cn/59IhwSe?_type=wpa&qidian=true" target="_blank">客服人员</a>
        </span>
        <span v-else>合同功能：已拥有</span>
      </div>
      <span @click="backHome">返回首页</span>
    </div>
    <div class="realPerName realEntName" v-else-if="flag ==3">
      <span>
        <img src="../../../assets/icon/greadG.png" alt /> 恭喜，您已经通过了实名认证
      </span>
      <div>
        <span>
          认证身份：
          <p>企业</p>
        </span>
        <span>
          企业名称：
          <p>{{reslData.company_name}}</p>
        </span>
        <span>
          企业统一信任代码：
          <p>{{reslData.company_codeusc}}</p>
        </span>
        <span>
          法人姓名：
          <p>{{reslData.name}}</p>
        </span>
        <span>
          法人身份证号码：
          <p>{{reslData.idno}}</p>
        </span>
        <span>
          法人手机号：
          <p>{{reslData.mobile}}</p>
        </span>
        <span v-if="reslData.accountid ==null || reslData.accountid ==''">
         合同功能：未拥有，请联系
          <a href="https://url.cn/59IhwSe?_type=wpa&qidian=true" target="_blank">客服人员</a>
        </span>
        <span v-else>合同功能：已拥有</span>
      </div>
      <span @click="backHome">返回首页</span>
    </div>
  </div>
</template>
<script>
import MenuSlide from '@/components/common/MenuSlide'
import { realName } from '@/api/list'
import { Toast } from 'vant'
export default {
  components: {
    MenuSlide
  },

  data () {
    return {
      flag: '', // 实名认证状态 是否企业或个人认证
      showMenu: false,
      reslData: ''
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      // 校验是否实名认证
      realName()
        .then(res => {
          if (res != false) {
            res.name = res.name.replace(
              /(.)(.*)/,
              (_, $1, $2) => $1 + '*'.repeat($2.length)
            )
            if (res.signstatus == 3) {
              if (res.status == 1) {
                this.flag = '2'
                this.reslData = res
                var reg = /(.{4}).*(.{4})/
                var str = this.reslData.idno.replace(reg, '$1********$2')
                this.reslData.idno = str
                var regp = /^(\d{3})\d+(\d{4})$/
                var pho = this.reslData.mobile.replace(regp, '$1****$2')
                this.reslData.mobile = pho
              } else if (res.status == 2) {
                this.flag = '3'
                this.reslData = res
                var reg = /(.{4}).*(.{4})/
                var str = this.reslData.idno.replace(reg, '$1********$2')
                this.reslData.idno = str
                var regp = /^(\d{3})\d+(\d{4})$/
                var pho = this.reslData.mobile.replace(regp, '$1****$2')
                this.reslData.mobile = pho
                var rege = /(.{4}).*(.{4})/
                var a = this.reslData.company_codeusc
                var com = a.toString().replace(rege, '$1********$2')
                this.reslData.company_codeusc = com
              }
            } else if (
              res.signstatus != 3 &&
              res.step == 4 &&
              res.signService != null
            ) {
              if (res.signService.number < 3) {
                this.$router.push({
                  name: 'backfillMoney',
                  params: { serviceid: res.service_id }
                })
              } else {
                this.flag = '1'
                this.$message.error('打款超过3次请重新申请实名认证')
              }
            } else {
              this.flag = 1
            }
          } else {
            this.flag = 1
            const toast = Toast({
              message: '用户呢称不能为空',
              className: 'Toast1'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 返回上一页
    histroyClick () {
      this.$router.go(-1)
    },
    onClickRight () {
      this.showMenu = true
    },
    closeMenu () {
      this.showMenu = false
    },
    // 个人
    realPerClick () {
      this.$router.push({ path: '/userContent/homePage/personage' })
    },
    // 企业
    realEntClick () {
      this.$router.push({ path: '/userContent/homePage/enterprise' })
    },
    backHome () {
      this.$router.push({ path: '/' })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/css/common.scss";
@import "./realNameScode";
</style>
<style lang="scss">
.Toast1 {
  display: none !important;
}
</style>
