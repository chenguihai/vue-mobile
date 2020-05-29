<template>
  <div>
    <HeadNav title="凌天众媒注册">
      <div tag="div" slot="right" class="reg-btn"></div>
    </HeadNav>
    <div class="login" @keyup.enter="submit">
      <loginLogo class="logo" />
      <div class="inp-box">
        <loginInp v-model="oblig.username" placeholder="请输入手机号码" maxLength="11" :icon="1" />
      </div>
      <div class="inp-box code-box">
        <loginInp
          v-model="oblig.password"
          placeholder="请输入8-32位字母/数字/特殊符号"
          type="password"
          maxlength="32"
          :icon="2"
        />
      </div>
      <div class="inp-box code-box">
        <loginInp
          v-model="oblig.code"
          :othProps="{maxlength:4}"
          placeholder="请输入验证码"
          :btnText="countDownUIText"
          :btnActive="oblig.username !== oblig.username.replace(/^((13[0-9]|14[1|5-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8})$/)"
          @btnClick="sendCode"
          @onBlurs="onBlurs"
          maxlength="4"
          :icon="3"
        />
      </div>
      <div class="agree-box">
        <div class="check" :class="{active:oblig.agree}" @click="oblig.agree = !oblig.agree">
          <van-icon v-show="oblig.agree" name="success" color="#fff" />
        </div>我已看过并接受
        <a href="/user/agreement" tag="span" class="agreement">《服务协议》</a>
      </div>
      <div class="submit" :class="{dis:!submitActive}" @click="submit">注册</div>
      <identity v-if="showSelect" />
    </div>
  </div>
</template>

<script>
import loginLogo from '@/components/login/logo'
import loginInp from '@/components/login/inp'
import identity from '@/components/login/identity'
import { regDaqo, checkEmptyValue, loginDo } from '@/utils/tool'
import { register, sendRegCode } from '@/api/account'
import { countDownMixin, bodyColor,iosWechatBlur } from '@/utils/mixins'
import passwordEncryption from '@/utils/passwordEncryption'
const errMsgList = new Map([
  ["username", ["请输入用户名", "", "请输入正确的号码"]],
  [
    "password",
    ["请输入密码", "", "密码8-32位包含字母、数字、特殊符号任意两种"]
  ],
  ["code", ["请输入验证码"]],
  ["agree", ["", "请阅读并勾选相关协议"]]
  // ['key', ['请先获得验证码']]
]);
export default {
  name: "register",
  mixins: [countDownMixin(), bodyColor("fff"), iosWechatBlur()],
  data() {
    return {
      showSelect: false,
      oblig: {
        username: "",
        password: "",
        code: "",
        agree: false,
        key: ""
      },
      registerRules: [
        {
          name: "username",
          test: regDaqo.phone
        },
        "password",
        "code",
        {
          name: "agree",
          test: true
        }
      ]
    };
  },
  computed: {
    submitActive() {
      const { username, password, code } = this.oblig;
      return this.nowActive === 0
        ? username !== "" && password !== ""
        : username !== "" && password !== "" && code !== "";
    }
  },
  components: {
    loginLogo,
    loginInp,
    identity
  },
  methods: {
    async submit() {
      var passReg = /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?]{6,32}$/;
      if (!this.submitActive) return;
      const unlock = this.registerRules.every(item =>
        checkEmptyValue(item, this.oblig, (type, name) => {
          this.$toast(errMsgList.get(name)[type]);
        })
      );
      if (!unlock) return;
      if (this.oblig.password.length < 8 || this.oblig.password.length > 32) {
        this.$toast("密码长度为8个到32个字符");
        return false;
      } else if (!passReg.test(this.oblig.password)) {
        this.$toast("密码包含字母、数字、特殊符号任意两种");
        return false;
      }
        const password = passwordEncryption(this.oblig.username, this.oblig.password);
        let params = JSON.parse(JSON.stringify(this.oblig));
        params.password =password;
      const data = await register(params)
      if (!data) return
      await loginDo.bind(this)(data.access_token)
      this.$toast('注册并登录成功')
     this.hackIWBlur()
      this.showSelect = true
    },
    async sendCode() {
      const unlock =
        this.canCountDownDo &&
        checkEmptyValue(this.registerRules[0], this.oblig, (type, name) =>
          this.$toast(errMsgList.get(name)[type])
        );
      if (!unlock) return;
      const data = await sendRegCode(this.oblig.username);
      if (!data) return;
      this.countDownInit();
      this.oblig.key = data.key;
      this.$toast("验证码已发送");
    },
    onBlurs() {
      setTimeout(() => {
        window.scroll(0, 0);
      }, 100);
    }
  }
};
</script>

<style scoped lang="scss">
.reg-btn {
  margin-right: rem(44);
}
.login {
  padding: 0 45px;
  background: #fff;
  @include borderBox;
  padding-bottom: 3rem;
  .logo {
    margin-top: 57px;
    margin-bottom: 57px;
  }
  .tab-box {
    margin-top: 61px;
    padding: 0 20px;
  }
  .inp-box {
    @extend .tab-box;
  }
  .code-box {
    margin-top: 50px;
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
    margin-top: 168px;
    &.dis {
      background: rgba(243, 38, 45, 0.3);
    }
  }
  .tip {
    font-size: 24px;
    font-weight: 400;
    color: $red;
    margin-top: 21px;
    text-align: left;
  }

  /*=============================================
  =            注册独有            =
  =============================================*/

  .agree-box {
    @include flex(flex-start);
    color: #666;
    font-size: 24px;
    font-family: $font;
    font-weight: 400;
    margin-top: 20px;
    margin-left: 43px;
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

  /*=====  End of 注册  ======*/
}
</style>
