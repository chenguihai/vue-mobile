<template>
  <div class="accountInfor">
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
      <span>对公账户信息</span>
      <div>
        <p class="radioEnt">
          <van-cell-group class="InvoiceTitle" :border="false">
            <van-field label="对公账户户名" disabled v-model="valueEnt" />
          </van-cell-group>
        </p>
        <p class="radioEnt">
          <van-cell-group class="InvoiceTitle" :border="false">
            <van-field
              label="企业对公银行账号"
              @blur="blurNumber() "
              v-model="valueNumber"
              placeholder="请输入对公银行账号"
            />
          </van-cell-group>
        </p>
        <p class="radioEnt">
          <van-cell-group class="InvoiceTitle" :border="false">
            <van-field
              label="开户行名称"
              @blur="blurName() "
              v-model="valueName"
              placeholder="请输入开户行名称"
            />
          </van-cell-group>
        </p>
        <p class="radioEnt">
          <van-cell-group class="InvoiceTitle" :border="false">
            <van-field
              label="开户行支行全称"
              @blur="blursubbranchBank()"
              v-model="valuesubbranchBank"
              placeholder="请输入开户行支行全称"
            />
          </van-cell-group>
        </p>
        <p class="radioEnt">
          <van-cell-group class="InvoiceTitle" is-link @click="showAdd" :border="false">
            <van-field
              right-icon="arrow"
              label="开户行所在地"
              disabled
              v-model="addInfor"
               readonly='readonly'
              placeholder="请选择"
            />
          </van-cell-group>
          <van-popup class="bounced" v-model="showa" position="bottom">
            <van-picker
              class="selected"
              show-toolbar
              :columns="columns"
              @cancel="onCancelarea"
              @confirm="onConfirmarea"
              @change="onChange"
            /> 
              <span class="column">{{provName}}</span>
          </van-popup>
        
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
import { Picker } from "vant";
import { bodyColor } from "@/utils/mixins";
import MenuSlide from "@/components/common/MenuSlide";
import { checkTopay, getBranch } from "@/api/list";
export default {
  mixins: [bodyColor("fff")],
  components: {
    MenuSlide
  },
  name: "accountInfor",
  data() {
    return {
      valueEnt: this.$route.params.company,
      valueNumber: "",
      showMenu: false,
      valueP: "",
      valueName: "",
      columns: [],
      valuesubbranchBank: "",
      dis: true,
      addInfor: "请选择",
      showa: false,
      province: "",
      city: "",
      serviceid: this.$route.params.serviceid,
      name: this.$route.params.name,
      company: this.$route.params.company,
      bankData:'',
      provName:'',
    };
  },
  created() {
      console.log(this.serviceid)
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
      // var regN = /^[0-9]{12,21}$/;
      // if (!regN.test(this.valueNumber)) {
      //   this.$toast("请输入12-21个位银行卡号");
      //   return false;
      // }
    },
    blurName() {
      // var regV = /^[A-Za-z0-9\u4e00-\u9fa5]{4,50}$/;
      // if (!regV.test(this.valueName)) {
      //   this.$toast("请输入开户行名称");
      // }
    },
    blursubbranchBank() {
      var regP = /^[A-Za-z0-9\u4e00-\u9fa5]{4,50}$/;
      if (!regP.test(this.valuesubbranchBank)) {
        // this.$toast("请输入开户行支行全称");
        return false;
      }
      var data = { keyword: this.valuesubbranchBank };
      getBranch(data)
        .then(res => {
          var bank = [];
          this.provName = "";
          var bankPro = [];
          for (var i = 0; i < res.length; i++) {
            if (res[i].bank == this.valueName) {
              bank.push(res[i]);
            }
          }
          this.provName = res[0].s;
          console.log(this.provName)
          for (var i = 0; i < res.length; i++) {
            res[i] = { ...res[i], text: res[i].city };
            if (res[i].s == this.provName) {
              bankPro.push(res[i]);
            }
          }
             console.log(bankPro)
          var objItem = {},
            newAry = [];
          for (var i = 0; i < bankPro.length; i++) {
            if (!objItem[bankPro[i].ml_name]) {
              newAry.push(bankPro[i]);
              objItem[bankPro[i].ml_name] = true;
            }
          }
          this.columns = newAry
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 地址选择
    showAdd() {
      this.showa = true;
    },
    onChange(picker, value, index) {
      var text = value.text;
      var value = value.index;
    },

    onCancelarea() {
      var _this = this;
      _this.showa = false;
    },
    onConfirmarea(val) {
      var _this = this;
      _this.showa = false;
      _this.addInfor = val.s+' '+ val.city
      this.bankData = val
    },
    //下一步
    submitClick() {
      var regN = /^[0-9]{12,21}$/;
      if (!regN.test(this.valueNumber)) {
        this.$toast("请输入12-21个位银行卡号");
        return false;
      }
      var regV = /^[A-Za-z0-9\u4e00-\u9fa5]{4,50}$/;
      if (!regV.test(this.valueName)) {
        this.$toast("请输入开户行名称");
      }
      var regP = /^[A-Za-z0-9\u4e00-\u9fa5]{4,50}$/;
      if (!regP.test(this.valuesubbranchBank)) {
        this.$toast("请输入开户行支行全称");
        return false;
      }
      if (this.addInfor == "请选择") {
        this.$toast("请选择开户行所在地");
        return false;
      }
      var data = {
        bank: this.valueName,
        cardno: this.valueNumber,
        provice: this.bankData.s,
        city: this.bankData.city,
        name: this.valueEnt,
        service_id: this.serviceid,
        subbranch: this.valuesubbranchBank
      };
      checkTopay(data)
        .then(res => {
          if (res != false) {
            this.$toast("身份验证成功");
            this.$router.push({
              name: "backfillMoney",
              params: {
                serviceid: this.serviceid,
                valueEnt: this.valueEnt,
                company: this.company
              }
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
      if (
        this.valueNumber != "" &&
        this.valueName != "" &&
        this.valuesubbranchBank != "" &&
        this.addInfor != "请选择"
      ) {
        this.dis = false;
        return;
      }
    },
    valueName() {
      if (
        this.valueNumber != "" &&
        this.valueName != "" &&
        this.valuesubbranchBank != "" &&
        this.addInfor != "请选择"
      ) {
        this.dis = false;
        return;
      }
    },
    valuesubbranchBank() {
      if (
        this.valueNumber != "" &&
        this.valueName != "" &&
        this.valuesubbranchBank != "" &&
        this.addInfor != "请选择"
      ) {
        this.dis = false;
        return;
      }
    },
    addInfor() {
      if (
        this.valueNumber != "" &&
        this.valueName != "" &&
        this.valuesubbranchBank != "" &&
        this.addInfor != "请选择"
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
@import "./accountInfor";
</style>