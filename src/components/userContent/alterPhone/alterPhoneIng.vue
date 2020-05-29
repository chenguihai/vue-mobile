<template>
  <div class="alterPhoneIng">
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
      <span>绑定新手机</span>
      <div class="Phone">
        <div class="alterNews">
          <van-cell-group :border="false">
            <van-field
            :border="false"
              v-model="value"
              label="新手机"
              class="News"
              @focus="focusClick()"
              @blur="userNameBlur()"
              placeholder="请输入新的手机"
              maxlength="11"
            />
            <div class="close" :class="{'closeF':flageI}" @mousedown="closeFClick">
              <img src="../../../assets/arrowhead/close.png" alt />
            </div>
          </van-cell-group>
        </div>
        <div>
          <van-cell-group :border="false">
            <van-field
            :border="false"
              label="验证码"
              class="NewsCode"
              v-model="valueCode"
              @focus="AddressClick()"
              @blur="AddressBlur()"
              placeholder="请输入验证码"
              maxlength="4"
            />
            <div class="close" :class="{'closeP':flageP}" @mousedown="closePClick">
              <img src="../../../assets/arrowhead/close.png" alt />
            </div>
            <span v-if="!isGetCode" @click="getCode">{{codeInfo}}</span>
            <span class="gettingCode" v-else>重新获取({{codeNum}})</span>
          </van-cell-group>
        </div>
      </div>
      <div class="nextTime alterPhoTime">
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
      <div class="question_B alterPho">
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
import { changMobileP, newmobile } from "@/api/list";

export default {
  mixins: [bodyColor("fff")],
  components: {
    MenuSlide
  },
  name: "alterPhoneIng",
  data() {
    return {
      value: "",
      valueCode: "",
      isGetCode: false,
      dis: true,
      codeNum: 60,
      showMenu: false,
      codeInfo: "获取验证码",
      mobile: this.$route.params,
      key: "",
      flageI: false,
      flageP: false
    };
  },
  methods: {
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
    // 验证手机
    userNameBlur() {
      // var reP = /^1[3|4|5|7|8][0-9]\d{8}$/;
      // if (!reP.test(this.value)) {
      //   this.$toast("请输入正确的注册号码");
      //   return false;
      // }
    },
    //清空昵称按钮
    // userNameDle() {
    //   this.value = "";
    //   this.dis = true;
    // },
    // userNameDleCode() {
    //   this.valueCode = "";
    //   this.dis = true;
    // },

    userNameBlur() {
      // if (this.value == "") {
      //   const toast = Toast({
      //     message: "用户呢称不能为空",
      //     className: "Toast"
      //   });
      //   return;
      // }
      this.flageI = false;
    },
    focusClick() {
      if (this.value != "") {
        this.flageI = true;
      }
    },
    AddressBlur() {
      this.flageP = false;
    },
    AddressClick() {
      if (this.valueCode != "") {
        this.flageP = true;
      }
    },
    closeFClick() {
      this.value = "";
    },
    closePClick() {
      this.valueCode = "";
    },
    //验证码
    getCode() {
      if (this.value == "") {
        Toast("请输入新的手机");
      } else {
        var data = {
          mobile: this.value
        };
        changMobileP(data)
          .then(res => {
            if (res != false) {
              this.key = res;
              this.isGetCode = true;
               Toast("验证码已发送");
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
      }
    },
    // 下一步
    nextTimeClick() {
      if (this.valueCode == "") {
        Toast("请输入验证码");
          return false;
      } else if (this.value == "") {
        Toast("请输入新手机号");
          return false;
      } else if (this.key.key == "") {
        Toast("请先获取验证码");
        return false;
      } else {
        this.dis = false;
        var data = {
          oldmobile: this.mobile.mobile.mobile,
          mobile: this.value,
          newmobile: this.value,
          verification_code: this.valueCode,
          verification_key: this.key.key
        };
        newmobile(data)
          .then(res => {
            if (res != false) {
              Toast("手机修改成功");
              this.$router.push({ path: "/userContent/homePage/accountUser" });
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
        this.flageI = true;
      } else {
        this.flageI = false;
      }
    },

    valueCode(val, newval) {
      if (newval && this.valueCode != "") {
        this.dis = false;
        this.flageP = true;
      } else {
        this.dis = true;
        this.flageP = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/css/common.scss";
@import "./alterPhoneScode";
.close {
  width: rem(25);
  height: rem(25);
  display: none;
  position: absolute;
  z-index: 1;
  right: rem(166);
  top: rem(32);
  & > img {
    display: block;
    width: rem(25);
    height: rem(25);
  }
}
.closeF,.closeP {
  display: block;
}
.closeP {
  top: rem(32) !important;
  right: rem(250);
}

</style>
<style lang="scss">
.alterPhoneIng {
  & > .verifyPhone {
    & > .Phone {
      & > .alterNews {
        width: 100% !important;

        & > .van-cell-group {
          position: relative;
          & > .van-cell {
            .van-cell__value {
              .van-field__body {
                .van-icon {
                  margin-right: rem(60);
                  font-size: rem(30);
                }
              }
            }
          }
        }
      }
      & > div {
        width: 100% !important;
        & > .van-cell-group {
          display: flex;
          align-items: center;
           position: relative;
          & > .van-cell {
            padding: rem(20) 0;
            width: 70%;
            .van-cell__value {
              .van-field__body {
                .van-field__control {
                  color: #333;
                }
                .van-field__right-icon {
                  padding: 0 20px 0 0;
                  // .van-icon {
                  //   background: #d8d8d8;
                  //   width: rem(28);
                  //   height: rem(28);
                  //   font-size: rem(24);
                  //   text-align: center;
                  //   line-height: rem(30);
                  //   color: #fff;
                  //   border-radius: 50%;
                  // }
                }
                .van-icon {
                  margin-right: rem(20);
                  font-size: rem(30);
                }
              }
            }
          }
          & > .News {
            padding: rem(20) rem(80) rem(20) 0;
            width: 100%;
            .van-cell__value {
              margin-left: rem(-20);
            }
          }
          & > .NewsCode {
            .van-cell__value {
              margin-left: rem(-20);
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
</style>
