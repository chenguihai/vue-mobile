<template>
  <div class="alterPhone">
    <header>
      <div @click="histroyClick()">
        <img src="@/assets/arrowhead/zuo_nob.png" alt />
      </div>
      <h2>修改绑定手机号</h2>
      <MenuSlide @close="closeMenu" v-if="showMenu"></MenuSlide>
      <div class="dian" @click="onClickRight">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </header>
    <div class="verifyPhone">
      <span>请先验证身份</span>
      <div class="Phone">
        <span>已绑定手机号码：{{phone}}</span>
        <div>
          <van-cell-group :border="false">
            <van-field
            :border="false"
              v-model="value"
              maxlength="4"
              @blur="usercore()"
              @focus="focusClick()"
              placeholder="请输入验证码"
            />
            <div class="close" :class="{'closeF':flageI}" @mousedown="closeFClick">
              <img src="../../../assets/arrowhead/close.png" alt />
            </div>
            <span v-if="!isGetCode" @click="getCode">{{codeInfo}}</span>
            <span class="gettingCode" v-else>重新获取({{codeNum}})</span>
          </van-cell-group>
        </div>
      </div>
      <div class="nextTime">
        <van-button
          size="large"
          color="#f3262d"
          :disabled="dis"
          type="primary"
          @click="nextTimeClick"
        >下一步</van-button>
      </div>
    </div>
    <div class="question">
      <div class="question_T">
        <h5>常见问题：</h5>
        <div>
          <span>1:无法获取短信验证码怎么办？</span>
          <span>短信到达需要1-2分钟，若您长时间未收到短信建议您重新发验证码。</span>
        </div>
        <div>
          <span>2:手机卡号遗失，无法使用手机接收短信验证码怎么办？</span>
          <span>您可以通过申请人工审核来取消原有手机的认证信息，然后重新进行认证。</span>
        </div>
      </div>
      <div class="question_B">
        <div class="userIcon">
          <div>
            <img src="@/assets/icon/weixin1.png" alt />
            <span>微信版</span>
          </div>
          <div>
            <img src="@/assets/icon/chuping2.png" alt />
            <span>触屏版</span>
          </div>
          <div>
            <img src="@/assets/icon/diannaoban3.png" alt />
            <span>电脑版</span>
          </div>
        </div>
        <div class="userText">
          <span>copyright&copy;2019-2020 凌天众媒网 版权所有</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { bodyColor } from "@/utils/mixins";
import { Toast } from "vant";
import MenuSlide from "@/components/common/MenuSlide";
import { changMobile, changPhone } from "@/api/list";
import { getUserInfo } from "@/api/service";
export default {
  mixins: [bodyColor("fff")],
  components: {
    MenuSlide
  },
  name: "alterPhone",
  data() {
    return {
      value: "",
      isGetCode: false,
      dis: true,
      codeNum: 60,
      mobile: "",
      showMenu: false,
      codeInfo: "获取验证码",
      phone: "",
      key: "",
      flageI: false
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      getUserInfo()
        .then(res => {
          this.userData = res.original;
          this.mobile = this.userData.mobile;
          this.deletPhont();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 隐藏手机
    deletPhont() {
      var mobile = this.mobile;
      var reg = /^(\d{3})\d+(\d{4})$/;
      var str = mobile.toString().replace(reg, "$1****$2");
      this.phone = str;
    },
    // 返回首页
    histroyClick() {
      this.$router.go(-1);
    },
    onClickRight() {
      this.showMenu = true;
    },
    closeMenu() {
      this.showMenu = false;
    },
    //清空昵称按钮
    // userNameDle() {
    //   this.value = "";
    //   this.dis = true;
    // },
    closeFClick() {
      this.value = "";
    },
    usercore() {
      // if (this.value == "") {
      //   Toast("请输入验证码");
      // } else {
      //   this.dis = false;
      // }
      this.dis = false
      this.flageI = false;
    },
    focusClick() {
      if (this.value != "") {
        this.flageI = true;
      }
    },

    //验证码
    getCode() {
      var data = {
        mobile: this.mobile
      };
      changMobile(data)
        .then(res => {
          if (res != false) {
            this.key = res.key;
            Toast("验证码已发送");
            this.isGetCode = true;
            this.timerCode = setInterval(() => {
              this.codeNum -= 1;
              if (this.codeNum <= 0) {
                this.codeNum = 60;
                this.isGetCode = false;
                this.codeInfo = "重新获取";
                clearInterval(this.timerCode);
                this.timerCode = null;
              }
            }, 1000);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 下一步
    nextTimeClick() {
      if (this.value == "") {
        Toast("验证码不能为空");
        return false;
      } else if (this.key == "") {
        Toast("请先获取验证码");
        return false;
      } else {
        this.dis = false;
        var data = {
          verification_key: this.key,
          mobile: this.mobile,
          verification_code: this.value
        };
        changPhone(data)
          .then(res => {
            if (res != false) {
              this.$router.push({
                name: "alterPhoneIng",
                params: { mobile: res }
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  },
  watch: {
    value(val, newval) {
      if (newval && this.value != "") {
        this.dis = false;
        this.flageI = true;
      } else {
        this.dis = true;
        this.flageI = false
      }
    },
    // value: {
    //   handler(newVal) {
    //     if (this.value != "") {
    //     this.flageI = true;
    //   }
    //   },
    //   deep: true
    // }
  }
};
</script>
<style lang="scss" scoped>
@import "@/css/common.scss";
@import "./alterPhoneScode";
</style>
<style lang="scss">
.alterPhone {
  & > .verifyPhone {
    & > .Phone {
      & > div {
        & > .van-cell-group {
          display: flex;
          align-items: center;
          position: relative;
          & > .van-cell {
            padding: rem(20) 0;
            width: 63%;
            .van-cell__value {
              .van-field__body {
                .van-field__control {
                  color: #333;
                }
                .van-field__right-icon {
                  padding: 0 20px;
                  // .van-icon {
                  //   background: #d8d8d8;
                  //   width: rem(28);
                  //   height: rem(28);
                  //   font-size: rem(24);
                  //   text-align: center;
                  //   line-height: rem(30);
                  //   color: #fff;
                  //   border-radius: 50%;
                  // display: block;
                  // }
                }
                .van-icon {
                  margin-right: rem(20);
                  font-size: rem(30);
                }
              }
            }
          }
          & > span {
            color: #f3262d;
            border-left: 1px solid #ccc;
            padding-left: rem(23);
          }
          & > .gettingCode {
            color: #999;

          }
        }
      }
    }
    & > .nextTime {
      & > .van-button {
        height: rem(88);
        line-height: rem(88);
      }
    }
  }
}
.van-toast--text {
  padding: 0;
  width: rem(400);
  height: rem(110);
}
.van-toast {
  top: 34%;
  background: rgba(51, 51, 51, 0.59);
}
.close {
  width: rem(25);
  height: rem(25);
  display: none;
  position: absolute;
  z-index: 1;
  right: rem(250);
  & > img {
    display: block;
    width: rem(25);
    height: rem(25);
  }
}
.closeF {
  display: block;
}
// .van-icon {
//   font-size: rem(40);
// }
</style>
