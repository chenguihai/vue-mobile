<template>
  <div class="alterPassword">
    <header>
      <div @click="histroyClick()">
        <img src="@/assets/arrowhead/zuo_nob.png" alt />
      </div>
      <h2>修改登录密码</h2>
      <MenuSlide @close="closeMenu" v-if="showMenu"></MenuSlide>
      <div class="dian" @click="onClickRight">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </header>
    <div class="workPassword">
      <div class="alterNews">
        <van-cell-group :border="false">
          <van-field
            :border="false"
            v-model="value1"
            type="password"
            label="当前密码"
            class="News"
            @blur="userNameBlur1()"
            @focus="focus1()"
            placeholder="请输入当前密码"
          />
          <div class="close" :class="{'close1':flage1}" @mousedown="closeFClick1">
            <img src="../../../assets/arrowhead/close.png" alt />
          </div>
        </van-cell-group>
      </div>
      <div class="alterNews">
        <van-cell-group :border="false">
          <van-field
            :border="false"
            v-model="value2"
            type="password"
            label="新密码"
            class="News"
            @blur="userNameBlur2()"
            @focus="focus2()"
            placeholder="请输入8-32位新密码"
          />
          <div class="close" :class="{'close2':flage2}" @mousedown="closeFClick2">
            <img src="../../../assets/arrowhead/close.png" alt />
          </div>
        </van-cell-group>
      </div>
      <div class="alterNews">
        <van-cell-group :border="false">
          <van-field
            :border="false"
            v-model="value3"
            type="password"
            label="确认新密码"
            class="News"
            @blur="userNameBlur3()"
            @focus="focus3()"
            placeholder="请再次输入您的新密码"
          />
          <div class="close" :class="{'close3':flage3}" @mousedown="closeFClick3">
            <img src="../../../assets/arrowhead/close.png" alt />
          </div>
        </van-cell-group>
      </div>
    </div>
    <span>提示：密码只能设置8-32位字母/数字/特殊符号</span>
    <div class="nextTime">
      <van-button
        size="large"
        color="#f3262d"
        :disabled="dis"
        type="primary"
        @click="nextTimeClick"
      >确认修改</van-button>
    </div>
  </div>
</template>
<script>
import { bodyColor } from "@/utils/mixins";
import { Toast } from "vant";
import MenuSlide from "@/components/common/MenuSlide";
import { newpassword } from "@/api/list";
import passwordEncryption from "@/utils/passwordEncryption";
export default {
  mixins: [bodyColor("fff")],
  components: {
    MenuSlide
  },
  data() {
    return {
      value1: "",
      value2: "",
      value3: "",
      dis: true,
      showMenu: false,
      flage1: false,
      flage2: false,
      flage3: false
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
    // 校验
    userNameBlur1() {
      //   var reN =  /^[a-z0-9A-Z]{6,16}$/;;
      // if (this.value1 == "" || !reN.test(this.value1)) {
      //   this.$toast("请输入6-16位旧密码");
      //   return false;
      // }
      this.flage1 = false;
    },
    userNameBlur2() {
      // var reN =  /^[a-z0-9A-Z]{6,16}$/;;
      // if (this.value2 == "" || !reN.test(this.value2)) {
      //   this.$toast("密码只能设置6-16位字母、数字或符号组成");
      //   return false;
      // }
      this.flage2 = false;
    },
    userNameBlur3() {
      // if (this.value3 != this.value2) {
      //   this.$toast("两次新密码输入必须一致");
      //   return false;
      // }
      this.flage3 = false;
    },
    focus1() {
      if (this.value1 != "") {
        this.flage1 = true;
      }
    },
    focus2() {
      if (this.value2 != "") {
        this.flage2 = true;
      }
    },
    focus3() {
      if (this.value3 != "") {
        this.flage3 = true;
      }
      // this.dis = true;
    },
    closeFClick1() {
      this.value1 = "";
      console.log("1111");
      this.dis = true;
    },
    closeFClick2() {
      this.value2 = "";
      console.log("1111");
      this.dis = true;
    },
    closeFClick3() {
      this.value3 = "";
      console.log("1111");
      this.dis = true;
    },
    // 提交按钮
    nextTimeClick() {
      var passReg = /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?]{6,32}$/;
      if (
        this.value1 == "" ||
        this.value1.length < 6 ||
        this.value1.length > 32
      ) {
        this.$toast("请输入6-32位旧密码");
        return false;
      }
      if (
        this.value2 == "" ||
        this.value2.length < 8 ||
        this.value2.length > 32
      ) {
        this.$toast("请输入8-32位新密码");
        return false;
      } else if (!passReg.test(this.value2)) {
        this.$toast("密码包含字母、数字、特殊符号任意两种");
        return false;
      }
      if (this.value2 == this.value1) {
        this.$toast("新密码不能和旧密码一样");
        return false;
      }
      if (this.value3 != this.value2) {
        this.$toast("两次新密码输入不一致");
        return false;
      }
      var data = {
        password: passwordEncryption("xxx", this.value1),
        newpassword: passwordEncryption("xxx", this.value2),
        newpasswordtwo: passwordEncryption("xxx", this.value3)
      };
      newpassword(data)
        .then(res => {
          if (res != false) {
            this.$toast("密码修改成功");
            var storage = window.localStorage;
            storage.clear();
            this.$router.push({ path: "/login" });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  watch: {
    value1(val, newval) {
      if (newval && this.value1 != "") {
        this.flage1 = true;
      } else {
        this.flage1 = false;
      }
      if (this.value1 != "" && this.value2 != "" && this.value3 != "") {
        this.dis = false;
        return;
      }
    },
    value2(val, newval) {
      if (newval && this.value2 != "") {
        this.flage2 = true;
      } else {
        this.flage2 = false;
      }
      if (this.value1 != "" && this.value2 != "" && this.value3 != "") {
        this.dis = false;
        return;
      }
    },
    value3(val, newval) {
      if (newval && this.value3 != "") {
        this.flage3 = true;
      } else {
        this.flage3 = false;
      }
      if (this.value1 != "" && this.value2 != "" && this.value3 != "") {
        this.dis = false;
        return;
      }
    }
  }
};
</script>
<style lang="scss">
@import "@/css/common.scss";
@import "./alterPasswordScode";
</style>
<style lang="scss" scoped>
.close {
  width: rem(25);
  height: rem(25);
  display: none;
  position: absolute;
  z-index: 1;
  right: rem(100);
  top: rem(32);
  & > img {
    display: block;
    width: rem(25);
    height: rem(25);
  }
}
.close1,
.close2,
.close3 {
  display: block;
}
</style>