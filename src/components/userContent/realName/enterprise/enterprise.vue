<template>
  <div class="enterprise">
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
      <span>上传企业信息</span>
      <div>
        <p class="radioEnt">
          <van-cell-group class="InvoiceTitle" :border="false">
            <van-field label="企业名称" @blur="blurTitle()" v-model="valueEnt" placeholder="请输入企业名称" />
          </van-cell-group>
        </p>
        <p class="radioEnt">
          <van-cell-group class="InvoiceTitle" :border="false">
            <van-field
              label="统一社会信用代码"
              @blur="blurNumber() "
              v-model="valueNumber"
              placeholder="请输入统一社会代码"
            />
          </van-cell-group>
        </p>
        <p class="radioEnt">
          <van-cell-group class="InvoiceTitle" :border="false">
            <van-field label="法人姓名" @blur="blurPEp()" v-model="valuePEp" placeholder="请输入法人姓名" />
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
import { checkcompany } from "@/api/list";
export default {
  mixins: [bodyColor("fff")],
  components: {
    MenuSlide
  },

  data() {
    return {
      valueEnt: "",
      valueNumber: "",
      valuePEp: "",
      showMenu: false,
      dis: true,
      serviceid: ""
    };
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
    blurTitle() {
      // if (this.valueEnt == "") {
      //   this.$toast("请输入企业名称");
      //   return false;
      // }
    },
    blurNumber() {
      // var regN = /^(?!^\d+$)(?!^[a-zA-Z]+$)[0-9a-zA-Z]{18,18}$/;
      // if (!regN.test(this.valueNumber)) {
      //   this.$toast("统一社会代码必须为18个大写字母和数字");
      //   return false;
      // }
    },
    blurPEp() {
      // var regP = /^[\u4e00-\u9fa5]{2,50}$/;
      // if (!regP.test(this.valuePEp)) {
      //   this.$toast("法人姓名必须为全中文");
      //   return false;
      // }
    },
    //下一步
    submitClick() {
      if (this.valueEnt == "") {
        this.$toast("请输入企业名称");
        return false;
      }
      var regN = /^(?!^\d+$)(?!^[a-zA-Z]+$)[0-9a-zA-Z]{18,18}$/;
      if (!regN.test(this.valueNumber)) {
        this.$toast("统一社会代码必须为18个大写字母和数字");
        return false;
      }
      var regP = /^[\u4e00-\u9fa5]{2,50}$/;
      if (!regP.test(this.valuePEp)) {
        this.$toast("法人姓名必须为全中文");
        return false;
      }
      var data = {
        name: this.valueEnt,
        codeUSC: this.valueNumber,
        legalName: this.valuePEp
      };
      checkcompany(data)
        .then(res => {
          if (res != false) {
             this.serviceid = res.service_id
               console.log(this.serviceid)
            this.$router.push({ name: "enterprisePep" ,params:{serviceid:this.serviceid,name:this.valuePEp,company:this.valueEnt}});
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  watch: {
    valuePEp() {
      if (
        this.valuePEp != "" &&
        this.valueNumber != "" &&
        this.valuePEp != ""
      ) {
        this.dis = false;
        return;
      }
    },
    valueNumber() {
      if (
        this.valuePEp != "" &&
        this.valueNumber != "" &&
        this.valuePEp != ""
      ) {
        this.dis = false;
        return;
      }
    },
    valuePEp() {
      if (
        this.valuePEp != "" &&
        this.valueNumber != "" &&
        this.valuePEp != ""
      ) {
        this.dis = false;
        return;
      }
    }
  }
};
</script>
<style lang="scss">
@import "@/css/common.scss";
@import "./enterpriseScode";
</style>