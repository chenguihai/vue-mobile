<template>
  <div class="orderInvoice">
    <header>
      <div @click="histroyClick()">
        <img src="@/assets/arrowhead/zuo_nob.png" alt />
      </div>

      <h2>申请发票</h2>
      <MenuSlide @close="closeMenu" v-if="showMenu"></MenuSlide>
      <div class="dian" @click="onClickRight">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </header>
    <div class="makeInvoice" v-if="flagMI == 'show'">
      <h4>填写开票信息</h4>
      <p class="radio" @click="addAction()">
        <span>开票方式</span>
        <van-radio-group
        :border="false"
          class="redioC"
          v-model="radio"
          checked-color="3089E3"
          icon-size="0"
          @change="radioChange"
        >
          <van-radio value="1" name="2">企业</van-radio>
          <van-radio value="2" name="1">个人</van-radio>
        </van-radio-group>
      </p>
      <p class="radio">
        <!-- <van-cell class="InvoiceType" is-link @click="showPopup">
          <span>发票类型</span>
          <span>{{InvoiceName}}</span>
        </van-cell>-->
        <van-field
        :border="false"
          class="InvoiceType"
          :class="{'iceType':radio == 1}"
          readonly
          clickable
          right-icon="arrow"
          label="发票类型"
          :value="value"
          placeholder="请选择"
          @click.stop="showPopup"
          :disabled="disab"
        />

        <van-popup class="bounced" v-model="show" position="bottom">
          <van-picker
            class="selected"
            show-toolbar
            :columns="option1"
            @cancel="onCancel"
            @confirm="onConfirm"
            @change="radioChange"
          />
        </van-popup>
      </p>
      <p class="radio">
        <van-cell-group class="InvoiceTitle" :border="false">
          <van-field label="发票抬头" @blur="blurTitle()" v-model="valueTitle" :placeholder="title" :border="false" />
        </van-cell-group>
      </p>
      <p class="radio" v-if="flagP">
        <van-cell-group class="InvoiceTitle" :border="false">
          <van-field
          :border="false"
            label="纳税人识别号"
            @blur="blurNumber() "
            v-model="valueNumber"
            :placeholder="userNumber"
          />
        </van-cell-group>
      </p>
      <p class="radio" v-if="flag">
        <van-cell-group class="InvoiceTitle" :border="false">
          <van-field
          :border="false"
            label="注册电话"
            @blur="blurPhone() "
            v-model="valuePhone"
            :placeholder="userPhone"
          />
        </van-cell-group>
      </p>
      <p class="radio" v-if="flag">
        <van-cell-group class="InvoiceTitle" :border="false">
          <van-field
          :border="false"
            label="注册地址"
            @blur="blurAddress() "
            v-model="valueAddress"
            :placeholder="userAddress"
          />
        </van-cell-group>
      </p>
      <p class="radio" v-if="flag">
        <van-cell-group class="InvoiceTitle" :border="false">
          <van-field
          :border="false"
            label="开户支行名称"
            @blur="blurBank() "
            v-model="valueBank"
            :placeholder="userBank"
          />
        </van-cell-group>
      </p>
      <p class="radio" v-if="flag">
        <van-cell-group class="InvoiceTitle" :border="false">
          <van-field
          :border="false"
            label="银行卡号"
            @blur="blurBankAdd() "
            v-model="valueBankAdd"
            :placeholder="userBankAdd"
          />
        </van-cell-group>
      </p>
      <div class="nextWay">
        <van-button
          @click="nextWayClick"
          :disabled="dis"
          size="large"
          color="#f3262d"
          type="primary"
        >下一步</van-button>
      </div>
    </div>
    <div class="makeInvoice" v-else-if="flagMI == 'addg'">
      <h4>填写收票地址</h4>
      <p class="radio">
        <!-- <van-cell class="InvoiceType" is-link @click="showAdd" :border="false">
          <span>收票地址</span>
          <span>{{addInfor}}</span>
        </van-cell>-->
        <van-field
        :border="false"
          class="InvoiceType"
          readonly
          clickable
          right-icon="arrow"
          label="收票地址"
          :value="value2"
          placeholder="请选择"
          @click="showAdd"
        />
        <van-popup class="bounced" v-model="showa" position="bottom">
          <van-area
            class="selected"
            :area-list="areaList"
            :columns-placeholder="['请选择', '请选择', '请选择']"
            @cancel="onCancelarea"
            @confirm="onConfirmarea"
          />
        </van-popup>
      </p>
      <p class="radio">
        <van-cell-group class="InvoiceTitle" :border="false">
          <van-field
          :border="false"
            label="详细地址"
            @blur="blurAdd() "
            v-model="Address"
            :placeholder="placehAddress"
          />
        </van-cell-group>
      </p>
      <p class="radio">
        <van-cell-group class="InvoiceTitle" :border="false">
          <van-field label="收票人" @blur="blurPEp()" v-model="valuePEp" :placeholder="titlePEp" :border="false"/>
        </van-cell-group>
      </p>
      <p class="radio">
        <van-cell-group class="InvoiceTitle" :border="false">
          <van-field label="联系电话" @blur="blurmob() " v-model="valuemob" :placeholder="usermob" :border="false"/>
        </van-cell-group>
      </p>
      <div class="nextWay">
        <van-button
          @click="submitClick"
          :disabled="disa"
          size="large"
          color="#f3262d"
          type="primary"
        >确认提交</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
import area from "@/assets/js/area";
import MenuSlide from "@/components/common/MenuSlide";
import { applyInvoice } from "@/api/list";
export default {
  name: "orderInvoice",
  components: {
    MenuSlide
  },

  data() {
    return {
      radio: "2",
      value1: 1,
      value: "",
      value2: "",
      option1: ["增值税专用发票", "增值税普通发票"],
      InvoiceName: "请选择",
      InvoiceType: 0,
      typeActive: false,
      showMenu: false,
      show: false,
      showa: false,
      title: "请填写公司名称",
      userNumber: "请填写税务登记证上的纳税人识别号",
      userPhone: "请填写营业执照上的注册电话",
      userAddress: "请填写营业执照上的地址",
      userBank: "请填写开户支行名称",
      userBankAdd: "请填写银行卡号",
      placehAddress: "请填写详细地址",
      titlePEp: "请输入收票人姓名",
      usermob: "请填写收票人联系电话",
      valueTitle: "",
      valueNumber: "",
      valuePhone: "",
      valueAddress: "",
      Address: "",
      valuePEp: "",
      valuemob: "",
      valueBank: "",
      valueBankAdd: "",
      province: "",
      city: "",
      district: "",
      subClick: true,
      flagP: true,
      flag: true,
      flagMI: "show",
      areaList: JSON.parse(JSON.stringify(area)),
      addInfor: "请选择",
      dis: true,
      disa: true,
      orderSn: this.$route.query.sn,
      disab: false
    };
  },
  created() {},
  computed: {},
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
    addAction() {
      console.log(this.radio);
    },
    showPopup() {
      if (this.disab != true) {
        this.show = true;
      } else {
        this.show = false;
      }
    },
    //发票类型
    onConfirm(value, index) {
      console.log(value);
      this.value = value;
      var _this = this;

      if (this.value == "增值税专用发票") {
        this.InvoiceType = 2;
      } else {
        this.InvoiceType = 1;
      }
      console.log(this.InvoiceType);
      this.InvoiceName = value;
      this.typeActive = true;
      this.show = false;
      this.valueTitle = "";
      this.valueNumber = "";
      this.valuePhone = "";
      this.valueAddress = "";
      this.valueBank = "";
      this.valueBankAdd = "";

      // 发票类型
      if (this.radio == 2) {
        if (this.InvoiceType == 2) {
          this.flagP = true;
          this.flag = true;
        } else if (this.InvoiceType == 1) {
          this.flagP = true;
          this.flag = false;
        }
      }
    },
    onCancel() {
      var _this = this;
      _this.show = false;
    },
    // 失去焦点
    blurTitle() {
      // var reg = /^[A-Za-z0-9\u4e00-\u9fa5]{2,50}$/;
      // if (!reg.test(this.valueTitle)) {
      //   this.$toast("请输入2-50位字符");
      // }
    },
    blurNumber() {
      // var reN = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{15,20}|([0-9]){15,20}$/;
      // if (!reN.test(this.valueNumber)) {
      //   this.$toast("请输入正确的15-20位纳税人识别号");
      // }
    },
    blurPhone() {
      // var reP = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
      // if (!reP.test(this.valuePhone)) {
      //   this.$toast("请输入正确的注册号码");
      // }
    },
    blurAddress() {
      // var reA = /^.{4,25}$/;
      // if (!reA.test(this.valueAddress)) {
      //   this.$toast("请输入4-25个字符");
      // }
    },
    blurBank() {
      // var reB = /^.{4,25}$/;
      // if (!reB.test(this.valueBank)) {
      //   this.$toast("请输入4-25个字符");
      // }
    },
    blurBankAdd() {
      // var reBA = /^[0-9]{12,21}$/;
      // if (!reBA.test(this.valueBankAdd)) {
      //   this.$toast("请输入12-21个数字");
      // }
    },
    // 下一步
    nextWayClick(e) {
      console.log("点击");
      if (this.radio == 2) {
        if (this.InvoiceType == 2) {
          if (this.InvoiceName == "请选择") {
            this.$toast("请选择发票类型");
            return false;
          }
          var reg = /^[A-Za-z0-9\u4e00-\u9fa5]{2,50}$/;
          if (this.valueTitle == "" || !reg.test(this.valueTitle)) {
            this.$toast("请输入正确的发票抬头");
            return false;
          }
          var reN = /^((?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{15,20}|([0-9]{15,20}))$/;
          if (this.valueNumber == "" || !reN.test(this.valueNumber)) {
            this.$toast("请输入正确的纳税人识别号");
            return false;
          }
          console.log(this.valueNumber);
          var reP = /^((0\d{2,3}-\d{7,8})|(1[357984]\d{9}))$/;
          if (this.valuePhone == "" || !reP.test(this.valuePhone)) {
            this.$toast("请输入正确的注册电话");
            return false;
          }
          var reA = /^.{4,25}$/;
          if (this.valueAddress == "" || !reA.test(this.valueAddress)) {
            this.$toast("请输入正确的注册地址");
            return false;
          }
          var reB = /^.{4,25}$/;
          if (this.valueBank == "" || !reB.test(this.valueBank)) {
            this.$toast("请输入正确的开户支行名称");
            return false;
          }
          var reBA = /^[0-9]{12,21}$/;
          if (this.valueBankAdd == "" || !reBA.test(this.valueBankAdd)) {
            this.$toast("请输入正确的银行卡号");
            return false;
          }
          this.flagMI = "addg";
        } else {
          var reg = /^[A-Za-z0-9\u4e00-\u9fa5]{2,50}$/;
          if (this.valueTitle == "" || !reg.test(this.valueTitle)) {
            this.$toast("请输入正确的发票抬头");
            return false;
          }
          var reN = /^((?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{15,20}|([0-9]{15,20}))$/;
          if (this.valueNumber == "" || !reN.test(this.valueNumber)) {
            this.$toast("请输入正确的纳税人识别号");
            return false;
          }
           console.log(this.valueNumber);
          this.flagMI = "addg";
        }
      } else {
        var reg = /^[A-Za-z0-9\u4e00-\u9fa5]{2,50}$/;
        if (this.valueTitle == "" || !reg.test(this.valueTitle)) {
          this.$toast("请输入正确的发票抬头");
          return false;
        }
        this.flagMI = "addg";
      }
      // if()

    },
    //企业个人切换
    radioChange() {
      this.valueTitle = "";
      this.valueNumber = "";
      this.valuePhone = "";
      this.valueAddress = "";
      this.valueBank = "";
      this.valueBankAdd = "";
      if (this.radio == 2) {
        this.flagP = true;
        this.flag = true;
        this.disab = false;
        this.title = "请填写公司名称";
        this.option1 = ["增值税专用发票", "增值税普通发票"];
        // if (this.value == "增值税专用发票") {
        //   this.InvoiceType = 2;
        // } else {
        //   this.InvoiceType = 1;
        //   this.flagP = true;
        //   this.flag = false;
        // }
        this.value = ''
          this.InvoiceType = 2;
      } else if (this.radio == 1) {
        this.flagP = false;
        this.flag = false;
        this.title = "请填写姓名";
        this.option1 = ["增值税普通发票"];
        this.value = "增值税普通发票";
        this.InvoiceType = 1;
        this.disab = true;
      }
    },
    blurAdd() {
      // var reD = /^.{4,25}$/;
      // if (!reD.test(this.Address)) {
      //   this.$toast("请输入4-25个字符");
      // }
    },

    blurPEp() {
      // var regV = /^[\u4e00-\u9fa5]{2,50}|[a-zA-Z\.\s]{2,50}$/;
      // if (!regV.test(this.valuePEp)) {
      //   this.$toast("请输入2-50位字符");
      // }
    },

    blurmob() {
      // var reL = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
      // if (!reL.test(this.valuemob)) {
      //   this.$toast("请输入正确的注册号码");
      // }
    },
    // 地址选择
    showAdd() {
      this.showa = true;
    },
    onCancelarea() {
      var _this = this;
      _this.showa = false;
    },
    onConfirmarea(val) {
      var _this = this;
      _this.showa = false;
      this.addInfor = val[0].name + "" + val[1].name + "" + val[2].name;
      this.province = val[0].code;
      this.city = val[1].code;
      this.district = val[2].code;
      this.value2 = this.addInfor;
    },
    submitClick() {
      var reD = /^.{4,25}$/;
      var regV = /^[\u4e00-\u9fa5]{2,50}|[a-zA-Z\.\s]{2,50}$/;
      var reL = /^((0\d{2,3}-\d{7,8})|(1[3-9]\d{9}))$/;
      if (this.province == "" || this.city == "" || this.district == "") {
        this.$toast("请选择发票地址");
        return false;
      }
      if (this.Address == "" || !reD.test(this.Address)) {
        this.$toast("请输入正确的详细地址");
        return false;
      }
      if (this.valuePEp == "" || !regV.test(this.valuePEp)) {
        this.$toast("请输入正确的收票人");
        return false;
      }
      if (this.valuemob == "" || !reL.test(this.valuemob)) {
        this.$toast("请输入正确的手机号码");
        return false;
      }

      var data = {
        order_sn: this.orderSn,
        user_type: "2",
        type: this.radio,
        invoice_type: this.InvoiceType,
        company_name: this.valueTitle,
        taxpayer_id: this.valueNumber,
        registration_phone: this.valuePhone,
        registration_address: this.valueAddress,
        deposit_bank: this.valueBank,
        bank_account: this.valueBankAdd,
        province: this.province,
        city: this.city,
        district: this.district,
        address: this.Address,
        name: this.valuePEp,
        phone: this.valuemob
      };
      console.log(data);
      applyInvoice(data)
        .then(res => {
          if (res != false) {
            this.$router.push({ path: "/userContent/homePage/myInvoice" });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  watch: {
    valueTitle() {
      if (this.valueTitle != "") {
        this.dis = false;
        return;
      }
    },
    valuemob() {
      if (this.valuemob != "") {
        this.disa = false;
        return;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/css/common.scss";
@import "./orderInvoiceScode";
/deep/ ::-webkit-input-placeholder {
  text-align: right;
}

/deep/ :-moz-placeholder {
  text-align: right;
}

/deep/ ::-moz-placeholder {
  text-align: right;
}

/deep/ :-ms-input-placeholder {
  text-align: right;
}
</style>
<style lang="scss" >
@import "./orderInvoice";
.nextWay {
  width: rem(690);
  height: rem(88);
  // background: #f3262d;
  border-radius: rem(4);
  text-align: center;
  line-height: rem(88);
  font-size: rem(30);
  color: #fff;
  // padding-left: rem(30);
  margin-top: rem(204);
  border: 0;
  .van-button {
    height: rem(88) !important;
    line-height: rem(88);
  }
}
</style>
