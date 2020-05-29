<template>
  <div>
    <HeadNav title="凌天众媒登录">
      <a tag="div" href="/register" slot="right" class="reg-btn">注册</a>
    </HeadNav>
    <div class="login" @keyup.enter="submit">
      <loginLogo class="logo" />
      <loginTab class="tab-box" :tabs="tabArr" v-model="nowActive" @change="tabChange(nowActive)" />
      <div class="inp-box">
        <loginInp v-model="oblig.username" placeholder="请输入手机号码" :maxLength="11" :icon="1" />
      </div>
      <div class="inp-box code-box" v-if="nowActive === 0">
        <loginInp v-model="oblig.password" placeholder="请输入密码" type="password" :icon="2" />
      </div>
      <div class="inp-box code-img-box" v-if="nowActive === 0&&errorNum>=3">
        <loginInp
          v-model="oblig.verification_captcha_code"
          placeholder="请输入图形验证码"
          :icon="3"
          :maxLength="10"
        />
        <div class="code-img" @click="getCode">
          <img :src="codeData.captcha_image_content" alt />
        </div>
      </div>
      <div class="inp-box code-box" v-if="nowActive === 1">
        <loginInp
          v-model="oblig.code"
          placeholder="请输入验证码"
          :othProps="{maxlength:4}"
          :icon="3"
          :btnText="countDownUIText"
          :btnActive="oblig.username !== ''&&oblig.username.length==11&&countDownUIText=='获取验证码'"
          @btnClick="sendCode"
          @onBlurs="onBlurs"
          :maxLength="4"
        />
      </div>
      <p class="forget" v-if="nowActive === 0">
        <a tag="span" href="/forget">忘记密码</a>
      </p>
      <div class="submit" :class="{dis:!submitActive}" @click="submit">登录</div>
      <p class="tip" v-if="nowActive === 1">注：未注册的手机将自动创建为凌天众媒账号</p>
      <van-divider class="divider">其他方式登录</van-divider>
      <div class="oth-login">
        <div class="oth" @click="outhWx" v-if="isWeChat">
          <img src="@/assets/login/wx.png" alt="wx" />
          <p>微信登录</p>
        </div>
        <div class="oth" @click="outhQQ">
          <img src="@/assets/login/qq.png" alt="qq" />
          <p>QQ登录</p>
          <div id="qqLoginBtn"></div>
        </div>
      </div>
      <div id="login_container"></div>
    </div>
  </div>
</template>

<script>
import loginLogo from "@/components/login/logo";
import loginTab from "@/components/login/tab";
import loginInp from "@/components/login/inp";
import { countDownMixin, bodyColor } from "@/utils/mixins";
import passwordEncryption from "@/utils/passwordEncryption";

import {
  login,
  codeLogin,
  sendLoginCode,
  getErr,
  getImgCode,
  smsLogin
} from "@/api/account";
import {
  regDaqo,
  checkEmptyValue,
  loginDo,
  wxLogin,
  qqLogin,
  browser
} from "@/utils/tool";
const errMsgList = new Map([
  ["username", ["请输入用户名", "", "请输入正确的号码"]],
  ["password", ["请输入密码"]],
  ["code", ["请输入验证码"]]
]);
export default {
  name: "login",
  mixins: [countDownMixin(), bodyColor("fff")],
  data() {
    const { type = 0, inviteUserId, redirect } = this.$route.query;
    return {
      tabArr: ["账号密码登录", "手机验证码登录"],
      nowActive: isNaN(type) ? 0 : +type,
      oblig: {
        username: "",
        password: "",
        code: "",
        key: "",
        verification_captcha_code: "",
        inviteUserId: inviteUserId
      },
      isGetcode: false,
      redirect: redirect || "/",
      isWeChat: browser.versions.isWeChat, //
      bodyHeight: "100%",
      codeData: {},
      errorNum: 0,
      isLoading:false
    };
  },
  computed: {
    submitActive() {
      const { username, password, code } = this.oblig;
      return this.nowActive === 0
        ? username !== "" && password !== "" && password.length > 5
        : username !== "" && code !== "";
    },
    loginRules() {
      return [
        {
          name: "username",
          test: regDaqo.phone
        },
        this.nowActive === 0 ? "password" : "code"
      ];
    }
  },
  components: {
    loginLogo,
    loginTab,
    loginInp
  },
  mounted() {
    this.oblig.username = sessionStorage.getItem("uAccount") || "";
    if (this.oblig.username) {
      this.getErrFn();
    }
    document.title = "凌天众媒网一站式全媒界大型媒体电商平台";
    // this.outhQQ()
  },
  methods: {
    async getCode() {
      let res = await getImgCode({ mobile: this.oblig.username });
      if (!res) return;
      this.codeData = res;
      this.oblig.verification_captcha_key = this.codeData.captcha_key;
    },
    async getErrFn() {
      let res = await getErr({ mobile: this.oblig.username });
      if (!res) return;
      this.errorNum = res.number;
      if (this.errorNum >= 3) {
        this.getCode();
      }
    },
    tabChange(type) {
      this.oblig = {
        username: "",
        password: "",
        code: "",
        key: "",
        inviteUserId: undefined
      };
    },
    outhWx() {
      wxLogin();
    },
    outhQQ() {
      qqLogin();
    },
    async submit() {
      if(this.isLoading){
        return
      }
       this.isLoading = true;
      if (!this.submitActive) return;
      const unlock = this.loginRules.every(item =>
        checkEmptyValue(item, this.oblig, (type, name) =>
          this.$toast(errMsgList.get(name)[type])
        )
      );
      if (!unlock) return;
      if (this.nowActive !== 0 && this.oblig.code.length < 4)
        return this.$toast("请输入4位数短信验证码");
      if (this.nowActive !== 0 && !this.isGetcode)
        return this.$toast("请获取短信验证码");
      if (
        this.nowActive === 0 &&
        this.errorNum >= 3 &&
        !this.oblig.verification_captcha_code
      )
        return this.$toast("请输入图形验证码");
      const password = passwordEncryption(
        this.oblig.username,
        this.oblig.password
      );
      let params = JSON.parse(JSON.stringify(this.oblig));
      params.password = password;
      const data =
        this.nowActive === 0
          ? await login(params)
          : await codeLogin(this.oblig);
      if (this.nowActive === 0) {
        sessionStorage.setItem("uAccount", this.oblig.username);
        this.getErrFn();
      }
      if (!data){
         this.isLoading = false;
         return;
      } 
      await loginDo.bind(this)(data.access_token);
      this.$toast("登录成功");
      // let newbieTask = sessionStorage.getItem("newbieTask");
      // if (newbieTask) {
      //   this.$router.push(newbieTask);
      // } else {
        this.$router.replace(this.redirect);
      this.isLoading = false;
        // this.$router.push(this.redirect);
        //  window.location.href = location.origin+this.redirect;
      // }
    },
    async sendCode() {
      const unlock =
        this.canCountDownDo &&
        checkEmptyValue(this.loginRules[0], this.oblig, (type, name) =>
          this.$toast(errMsgList.get(name)[type])
        );
      if (!unlock) return;
      const data = await smsLogin(this.oblig.username);
      if (!data) return;
      this.countDownInit();
      this.oblig.key = data.key;
      this.isGetcode = true;
      this.$toast("验证码已发送");
    },
    onBlurs() {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    }
  },
  // beforeDestroy() {
  //   sessionStorage.removeItem("newbieTask");
  // }
};
</script>

<style scoped lang="scss">
.reg-btn {
  color: #0066cc;
  font-size: 28px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  margin-right: 50px;
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
    margin-top: 60px;
  }
  .code-img-box {
    margin-top: 60px;
    position: relative;
    .login-inp {
      // width: ;
    }
    .code-img {
      position: absolute;
      right: 18px;
      bottom: 8px;
      width: 200px;
      height: 70px;
      background: #fff;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .forget {
    font-size: 28px;
    height: 40px;
    line-height: 40px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #0066cc;
    text-align: right;
    margin-top: 15px;
    padding: 0 20px;
    display: flex;
    justify-content: flex-end;
    & > a {
      color: #0066cc;
    }
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
    margin-top: 80px;
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
  =            第三方登录            =
  =============================================*/

  .divider {
    margin-top: 76px;
  }
  .oth-login {
    @include flex(center);
    margin-top: 48px;
    .oth {
      @include flex(center);
      flex-direction: column;
      position: relative;
      &:nth-child(2n) {
        margin-left: 204px;
      }
      p {
        margin-top: 12px;
        font-size: 20px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        line-height: 28px;
      }
      img {
        @include square(64);
      }
      // #qqLoginBtn {
      //   position: absolute;
      //   width: 100%;
      //   height: 100%;
      //   opacity: 0;
      //   overflow: hidden;
      // }
    }
  }

  /*=====  End of 第三方登录  ======*/
}
</style>
