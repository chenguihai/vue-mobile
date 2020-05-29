<template>
  <div>
    <HeadNav title="凌天众媒登录">
      <div tag="div" slot="right" class="reg-btn"></div>
    </HeadNav>
    <div class="login" @keyup.enter="submit">
      <loginLogo class="logo"/>
      <loginTab class="tab-box" :tabs="tabArr" v-model="nowActive"/>
      <div class="inp-box">
        <loginInp v-model="oblig.username" placeholder="请输入手机号码" :icon="1"/>
      </div>
      <div class="inp-box code-box" v-if="nowActive === 1">
        <loginInp v-model="oblig.password" placeholder="请输入密码" type="password" @onBlurs='onBlurs' :icon="2"/>
      </div>
      <div class="inp-box code-box" v-if="nowActive === 0">
        <loginInp v-model="oblig.code" :othProps="{maxlength:4}" placeholder="请输入验证码" :icon="3"
                  :btnText="countDownUIText" :btnActive="oblig.username !== ''&&oblig.username.length==11"
                  @btnClick="sendCode" @onBlurs='onBlurs'/>
      </div>
      <!-- <p class="forget" v-if="nowActive === 0">
        <router-link tag="span" to="/forget">忘记密码</router-link>
      </p> -->
      <div class="agree-box" v-if="nowActive === 0">
        <!-- <div class="check" :class="{active:oblig.agree}" @click="oblig.agree = !oblig.agree">
          <van-icon v-show="oblig.agree" name="success" color="#fff" />
        </div>
        我已看过并接受<router-link to="/user/agreement" tag="span" class="agreement">《用户协议》</router-link> -->
        注：未注册的手机将自动创建为凌天众媒账号
      </div>
      <div class="submit" :class="{dis:!submitActive}" @click="submit">确定绑定</div>
      <p class="tip">
        请先绑定一个平台账号，绑定后可以使用第三方一键登录
      </p>
    </div>
  </div>

</template>

<script>
  import loginLogo from '@/components/login/logo'
  import loginTab from '@/components/login/tab'
  import loginInp from '@/components/login/inp'
  import {countDownMixin, bodyColor, iosWechatBlur} from '@/utils/mixins'
  import {bindAccount, bindReg, sendLoginCode ,smsLogin} from '@/api/account'
  import {regDaqo, checkEmptyValue, loginDo, browser, EventUtil} from '@/utils/tool'
import passwordEncryption from "@/utils/passwordEncryption";
  const errMsgList = new Map([
    ['username', ['请输入用户名', '', '请输入正确的号码']],
    ['password', ['请输入密码']],
    ['code', ['请输入验证码']],
    ['agree', ['', '请仔细阅读并同意用户协议']]
  ])
  export default {
    name: 'login',
    mixins: [countDownMixin(), bodyColor('fff'), iosWechatBlur()],
    data() {
      const {wechat = '', qq = '', avatar = '', name = '', unionid = '', openid = '', redirect} = this.$route.query;
      return {
        isWechat: browser.versions.isWeChat,
        tabArr: ['手机验证码', '账号密码'],
        nowActive: 0,
        oblig: {
          username: '',
          password: '',
          code: '',
          key: '',
          agree: false
        },
        wechatid: wechat,
        qqid: qq,
        avatar: avatar,
        name: name,
        unionid: unionid,
        openid: openid,
        redirect: redirect || '/'
      }
    },
    computed: {
      submitActive() {
        const {username, password, code} = this.oblig
        return this.nowActive === 1
          ? (username !== '' && password !== '')
          : (username !== '' && code !== '')
      },
      loginRules() {
        let rules = [
          {
            name: 'username',
            test: regDaqo.phone
          }
        ]
        rules.push(this.nowActive !== 1 ? 'code' : 'password')
        return rules
      }
    },
    components: {
      loginLogo,
      loginTab,
      loginInp
    },
    mounted() {
      this.isWechat && this.checkHis()
    },
    methods: {
      async submit() {
        this.hackIWBlur()
        if (!this.submitActive) return
        const unlock = this.loginRules.every(item => checkEmptyValue(item, this.oblig, (type, name) => this.$toast(errMsgList.get(name)[type])))
        if (!unlock) return
        const opts = Object.assign(this.oblig, {
          wechatid: this.wechatid,
          qqid: this.qqid,
          avatar: this.avatar,
          name: this.name,
          unionid: this.unionid,
          openid: this.openid
        }, {verification_key: this.oblig.key, verification_code: this.oblig.code, mobile: this.oblig.username})
           const password = passwordEncryption(
        opts.username,
        opts.password
      );
      opts.password = password;

        const data = this.nowActive === 1 ? await bindAccount(opts) : await bindReg(opts)
        if (!data) return
        await loginDo.bind(this)(data.access_token)
        this.$toast('绑定成功')
        EventUtil.removeHandler(window, 'popstate', this.initHis)
        this.$router.replace('/')
      },
      async sendCode() {
        const unlock = this.canCountDownDo && checkEmptyValue(this.loginRules[0], this.oblig, (type, name) => this.$toast(errMsgList.get(name)[type]))
        if (!unlock) return
        const data = await smsLogin(this.oblig.username)
        if (!data) return
        this.countDownInit()
        this.oblig.key = data.key
        this.$toast('验证码已发送')
      },
      onBlurs() {
        setTimeout(() => {
          window.scrollTo(0, 0)
        }, 100)
      },
      checkHis() {
        this.initHis()
        EventUtil.addHandler(window, 'popstate', this.initHis)
      },
      initHis() {
        history.pushState(null, null, document.URL)
      }
    },
    beforeRouteEnter(to, from, next) {
      const {query} = to
      if (query.token) {
        next(async vm => {
          loginDo.bind(vm)(query.token)
          vm.$router.replace('/')
        })
        return
      }
      next()
    }
  }
</script>

<style scoped lang="scss">
  .reg-btn {
    margin-right: rem(44);
  }

  .login {
    background: #fff;
    @include borderBox;
    padding: 0 45px;

    .logo {
      margin-top: 67px;
    }

    .tab-box {
      margin-top: 61px;
      padding: 0 20px;
    }

    .inp-box {
      @extend .tab-box;
      margin-top: 42px;
    }

    .code-box {
      margin-top: 80px;
    }

    .forget {
      font-size: 28px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #0066cc;
      text-align: right;
      margin-top: 15px;
      display: flex;
      justify-content: flex-end;
    }

    .submit {
      height: 88px;
      @include round(4px);
      background: $red;
      line-height: 88px;
      text-align: center;
      font-size: 32px;
      font-weight: 500;
      color: #fff;
      margin-top: 107px;

      &.dis {
        background: rgba(243, 38, 45, 0.3);
      }
    }

    .tip {
      font-size: 24px;
      font-weight: 400;
      color: #666;
      margin-top: 21px;
      text-align: left;
    }

    .agree-box {
      @include flex(flex-start);
      color: #666;
      font-size: 24px;
      font-family: $font;
      font-weight: 400;
      margin-top: 20px;
      // margin-left: 43px;
      .agreement {
        color: #0066cc;
      }

      .check {
        margin-right: 13px;
        @include square(24);
        @include round(4px);
        border: 1px solid #999;
        background: #eee;
        @include borderBox;

        &.active {
          border: none;
          background: $red;
        }
      }
    }
  }
</style>
