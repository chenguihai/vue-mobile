<template>
  <div class="personage">
    <header>
      <div @click="histroyClick()">
        <img width="44" height="42" src="@/assets/arrowhead/zuo_nob.png" alt />
      </div>
      <h2>个人实名认证</h2>
      <MenuSlide @close="closeMenu" v-if="showMenu"></MenuSlide>
      <div class="dian" @click="onClickRight">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </header>
    <div class="personageData">
      <p class="radioData">
        <van-cell-group class="InvoiceTitle" :border="false">
          <van-field label="真实姓名" @blur="blurPEp()" v-model="valuePEp" placeholder="请输入真实姓名" />
        </van-cell-group>
      </p>
      <p class="radioData">
        <van-cell-group class="InvoiceTitle" :border="false">
          <van-field
            label="身份证号码   "
            @blur="blurNumber() "
            v-model="valueNumber"
            placeholder="请输入身份证号码"
          />
        </van-cell-group>
      </p>
      <p class="radioData">
        <van-cell-group class="InvoiceTitle" :border="false">
          <van-field label="手机号码" disabled='true' v-model="valuemob" />
        </van-cell-group>
      </p>
      <span @click="changePhone">手机号需要修改点击此处 ></span>
    </div>
    <div class="nextWay">
      <van-button
        @click="submitClick"
        :disabled="dis"
        size="large"
        color="#f3262d"
        type="primary"
      >下一步</van-button>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
import { Button } from "vant";
import { bodyColor } from "@/utils/mixins";
import MenuSlide from "@/components/common/MenuSlide";
import { getUserInfo } from "@/api/service";
import { perUseradd } from "@/api/list";
export default {
  mixins: [bodyColor("fff")],
  components: {
    MenuSlide
  },

  data() {
    return {
      valuemob: "",
      dis: true,
      valuePEp: "",
      valueNumber: "",
      showMenu: false
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
          this.valuemob = this.userData.mobile;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 返回上一页
    histroyClick() {
      this.$router.go(-1);
    },
    onClickRight() {
      this.showMenu = true;
    },
    closeMenu() {
      this.showMenu = false;
    },
    // 跳转修改手机
    changePhone() {
      this.$router.push({ path: "/userContent/homePage/alterPhone" });
    },
    // 校验
    blurPEp() {
      // var regV = /^[\u4e00-\u9fa5]{2,50}$/;
      // if (!regV.test(this.valuePEp)) {
      //   this.$toast("姓名必须全为中文");
      // }
    },
    blurNumber() {
      // var reN = /[0-9X]{18}/;
      // if (!reN.test(this.valueNumber)) {
      //   this.$toast("请输入18位的身份证，字母必须为大写");
      // }
    },
    // 下一步
    submitClick() {
      var regV = /^[\u4e00-\u9fa5]{2,50}$/;
      if (!regV.test(this.valuePEp)) {
        this.$toast("姓名必须全为中文");
        return false;
      }
      var reN = /[0-9X]{18}/;
      if (!reN.test(this.valueNumber)) {
        this.$toast("身份证格式错误");
        return false;
      }
      var data = {
        name: this.valuePEp,
        mobile: this.valuemob,
        idno: this.valueNumber
      };
      perUseradd(data)
        .then(res => {
          if (res != false){
            const toast = Toast({
              duration: 0, // 持续展示 toast
              forbidClick: true,
              message: "个人实名认证成功，页面3S后自动返回"
            });
            let second = 3;
            const timer = setInterval(() => {
              second--;
              if (second) {
                toast.message = `个人实名认证成功，页面${second}S后自动返回`;
              } else {
                clearInterval(timer);
                // 手动清除 Toast
                Toast.clear();
                this.$router.push({ path: "/userContent/homePage/realName" });
              }
            }, 1000);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  watch: {
    valuePEp() {
      if (this.valuePEp != "" && this.valueNumber != "") {
        this.dis = false;
        return;
      }
    },
    valueNumber() {
      if (this.valuePEp != "" && this.valueNumber != "") {
        this.dis = false;
        return;
      }
    }
  }
};
</script>
<style lang="scss">
@import "@/css/common.scss";
@import "./personageScode";
</style>