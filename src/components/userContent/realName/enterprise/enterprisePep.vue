<template>
  <div class="enterprisePep">
    <header>
      <div @click="histroyClick()">
        <img width="44" height="42" src="@/assets/arrowhead/zuo_nob.png" alt />
      </div>
      <h2>企业实名认证</h2>
      <MenuSlide @close="closeMenu" v-if="showMenu"></MenuSlide>
      <div class="dian" @click="onClickRight">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </header>
    <div class="entData">
      <span>上传法人信息</span>
      <div>
        <p class="radioEnt">
          <van-cell-group class="InvoiceTitle" :border="false">
            <van-field label="真实姓名" disabled v-model="valueEnt" />
          </van-cell-group>
        </p>
        <p class="radioEnt">
          <van-cell-group class="InvoiceTitle" :border="false">
            <van-field
              label="身份证号码"
              @blur="blurNumber() "
              v-model="valueNumber"
              placeholder="请输入身份证号码"
            />
          </van-cell-group>
        </p>
        <p class="radioEnt">
          <van-cell-group class="InvoiceTitle" :border="false">
            <van-field label="手机号码" @blur="blurPEp()" v-model="valueP" placeholder="请输入手机号码" />
          </van-cell-group>
        </p>
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
  </div>
</template>
<script>
import { Toast } from "vant";
import { Button } from "vant";
import { bodyColor } from "@/utils/mixins";
import MenuSlide from "@/components/common/MenuSlide";
import { checkCompanyUser } from "@/api/list";
export default {
  mixins: [bodyColor("fff")],
  components: {
    MenuSlide
  },
  name: "enterprisePep",
  data() {
    return {
      valueNumber: "",
      valueP: "",
      showMenu: false,
      dis: true,
      serviceid: this.$route.params.serviceid,
      valueEnt: this.$route.params.name,
      company:this.$route.params.company
    };
  },
  created() {
    console.log(this.serviceid);
  },
  methods: {
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
    // 校验
    blurNumber() {
      // var regN = /[0-9X]{18}/;
      // if (!regN.test(this.valueNumber)) {
      //   this.$toast("请输入18位的身份证，字母必须为大写");
      //   return false;
      // }
    },
    blurPEp() {
      // var regP = /^1[3|4|5|7|8][0-9]\d{8}$/;
      // if (!regP.test(this.valueP)) {
      //   this.$toast("请输入正确的手机号");
      //   return false;
      // }
    },
    //下一步
    submitClick() {
      var regN = /[0-9X]{18}/;
      if (!regN.test(this.valueNumber)) {
        this.$toast("请输入18位的身份证，字母必须为大写");
        return false;
      }
      var regP = /^((13[0-9]|14[1|5-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8})$/;
      if (!regP.test(this.valueP)) {
        this.$toast("请输入正确的手机号");
        return false;
      }

      var data = {
        name: this.valueEnt,
        idno: this.valueNumber,
        mobile: this.valueP
      };
      checkCompanyUser(data)
        .then(res => {
          if (res != false) {
            this.$toast("身份验证成功");
            this.$router.push({
              name: "accountInfor",
              params: { serviceid: this.serviceid ,valueEnt: this.valueEnt ,company: this.company }
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  watch: {
    valueNumber() {
      if (this.valueNumber != "" && this.valueP != "") {
        this.dis = false;
        return;
      }
    },
    valueP() {
      if (this.valueNumber != "" && this.valueP != "") {
        this.dis = false;
        return;
      }
    }
  }
};
</script>
<style lang="scss">
@import "@/css/common.scss";
@import "./enterprisePep";
</style>
