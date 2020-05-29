<template>
  <div>
    <HeadNav title="忘记密码">
      <div tag="div" slot="right" class="reg-btn"></div>
    </HeadNav>
    <div class="login" @keyup.enter="submit">
      <loginLogo class="logo" />
      <div class="inp-box">
        <loginInp v-model="oblig.username" placeholder="请输入手机号码" :icon="1" maxlength="11" />
      </div>
      <div class="inp-box code-box">
        <loginInp
          v-model="oblig.code"
          :othProps="{maxlength:4}"
          placeholder="请输入验证码"
          :btnText="countDownUIText"
          :btnActive="oblig.username !== ''&&oblig.username.length==11&&countDownUIText=='获取验证码'"
          @btnClick="sendCode"
          maxlength="4"
          :icon="3"
        />
      </div>
      <div class="inp-box code-box">
        <loginInp
          v-model="oblig.password"
          type="password"
          placeholder="密码8-32位字母/数字/特殊符号"
          maxlength="32"
          :icon="2"
        />
      </div>
      <div class="submit" :class="{dis:!submitActive}" @click="submit">确定</div>
      <p class="tip">
        温馨提示：若无法通过手机号重置登录密码，请联系客服
        400-688-6662。
      </p>
    </div>
  </div>
</template>

<script>
import loginLogo from "@/components/login/logo";
import loginInp from "@/components/login/inp";
import { countDownMixin, bodyColor } from "@/utils/mixins";
import { sendLoginCode, forgetChange, sendForgetCode } from "@/api/account";
import { checkEmptyValue, regDaqo } from "@/utils/tool";
import passwordEncryption from "@/utils/passwordEncryption";

const errMsgList = new Map([
  ["username", ["请输入用户名", "", "请输入正确的号码"]],
  ["password", ["请输入密码", "", "密码只能设置6-16位字母，数字，符号组成"]],
  ["code", ["请输入验证码"]],
  ["key", ["请先获取验证码"]]
]);

export default {
  name: "forget",
  mixins: [countDownMixin(), bodyColor("fff")],
  data() {
    return {
      oblig: {
        username: "",
        password: "",
        code: "",
        key: ""
      },
      forgetRules: [
        {
          name: "username",
          test: regDaqo.phone
        },
        "password",
        "code",
        "key"
      ]
    };
  },
  computed: {
    submitActive() {
      const { username, password, code } = this.oblig;
      return username !== "" && password !== "" && code !== "";
    }
  },
  components: {
    loginLogo,
    loginInp
  },
  methods: {
    async submit() {
      var passReg = /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?]{6,32}$/;
      if (!this.submitActive) return;
      const unlock = this.forgetRules.every(item =>
        checkEmptyValue(item, this.oblig, (type, name) =>
          this.$toast(errMsgList.get(name)[type])
        )
      );
      if (!unlock) return;
      if (this.oblig.password.length < 8 || this.oblig.password.length > 32) {
        this.$toast("密码长度为8个到32个字符");
        return false;
      } else if (!passReg.test(this.oblig.password)) {
        this.$toast("密码包含字母、数字、特殊符号任意两种");
        return false;
      }
      const password = passwordEncryption(
        this.oblig.username,
        this.oblig.password
      );
      let params = JSON.parse(JSON.stringify(this.oblig));
      params.password = password;
      const data = await forgetChange(params);
      if (!data) return;
      this.$toast("新密码设置成功,请直接登录");
      this.$router.replace("/login");
    },
    async sendCode() {
      const unlock =
        this.canCountDownDo &&
        checkEmptyValue(this.forgetRules[0], this.oblig, (type, name) =>
          this.$toast(errMsgList.get(name)[type])
        );
      if (!unlock) return;
      const data = await sendForgetCode(this.oblig.username);
      if (!data) return;
      this.countDownInit();
      this.oblig.key = data.key;
      this.$toast("验证码已发送");
    }
  }
};
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
    margin-top: 57px;
    margin-bottom: 57px;
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
  .submit {
    height: 88px;
    @include round(4px);
    background: $red;
    line-height: 88px;
    text-align: center;
    font-size: 32px;
    font-weight: 500;
    color: #fff;
    margin-top: 132px;
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
}
</style>
