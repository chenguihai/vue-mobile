<template>
  <div class="addBank">
    <header>
      <div @click="histroyClick()">
        <img src="@/assets/arrowhead/zuo_nob.png" alt />
      </div>
      <h2>银行卡管理</h2>
      <MenuSlide @close="closeMenu" v-if="showMenu"></MenuSlide>
      <div class="dian" @click="onClickRight">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </header>
    <div class="bankInput">
      <div class="bankName">
        <van-cell class="InvoiceType" is-link @click="showPopup" :border="false">
          <span>{{bankName}}</span>
          <van-field v-model="value" readonly clickable :placeholder="placeholder1" />
        </van-cell>
        <van-popup v-model="showPicker" position="bottom">
          <van-picker
            show-toolbar
            :columns="columns"
            @cancel="showPicker = false"
            @confirm="onConfirm"
            @change="onChange"
          />
        </van-popup>
      </div>
      <div class="bankName bankNum">
        <van-cell class="InvoiceType" :border="false">
          <span>{{bankNum}}</span>
          <van-field
          :border="false"
            v-model="valueBankAdd"
            @focus="focus1()"
            @blur="blurBankAdd() "
            :placeholder="placeholder2"
          />
          <div class="close" :class="{'close1':flage1}" @mousedown="closeFClick1">
            <img src="../../../assets/arrowhead/close.png" alt />
          </div>
        </van-cell>
      </div>
      <div class="bankName bankNum">
        <van-cell class="InvoiceType" :border="false">
          <span>{{bankUser}}</span>
          <van-field
          :border="false"
            v-model="valuePEp"
            @focus="focus2()"
            @blur="blurPEp()"
            :placeholder="placeholder3"
          />
          <div class="close" :class="{'close2':flage2}" @mousedown="closeFClick2">
            <img src="../../../assets/arrowhead/close.png" alt />
          </div>
        </van-cell>
      </div>
      <div class="bankName bankNum">
        <van-cell class="InvoiceType" :border="false">
          <span>{{subBranch}}</span>
          <van-field
          :border="false"
            v-model="valueSubBranch"
            @focus="focus3()"
            @blur="blurAddress() "
            :placeholder="placeholder4"
          />
          <div class="close" :class="{'close3':flage3}" @mousedown="closeFClick3">
            <img src="../../../assets/arrowhead/close.png" alt />
          </div>
        </van-cell>
      </div>
      <div class="agreement">
        <van-radio-group v-model="radio" class="radio">
          <div class="box" @click="clickitem($event)"></div>我已阅读并同意
          <a href="/userContent/homePage/greemen">
          <span>绑定银行卡协议</span>
          </a>
        </van-radio-group>
      </div>
      <div class="submitBank">
        <span @click="submitBank">确定绑定</span>
        <span>温馨提示：</span>
        <span>请绑定实名认证信息一致的储蓄卡银行账户，否则不能提现。</span>
      </div>
    </div>
  </div>
</template>
<script>
import { bodyColor } from "@/utils/mixins";
import MenuSlide from "@/components/common/MenuSlide";
import { bankCount, bankAdd } from "@/api/list";

export default {
  mixins: [bodyColor("fff")],
  components: {
    MenuSlide
  },

  data() {
    return {
      value: "",
      showPicker: false,
      showMenu: false,
      columns: [],
      placeholder1: "",
      placeholder2: "",
      placeholder3: "",
      placeholder4: "",
      bankName: "",
      bankNum: "",
      bankUser: "",
      subBranch: "",
      valueBankAdd: "",
      valuePEp: "",
      valueSubBranch: "",
      radio: "",
      nameBank: [],
      name: "1",
      bankId: "",
      type: this.$route.query.type,
       flage1: false,
      flage2: false,
      flage3: false
    };
  },
  created() {
    if (this.type == 1) {
      this.placeholder1 = "请选择开户行";
      this.placeholder2 = "请输入正确的银行账号";
      this.placeholder3 = "请输入正确的开户户名";
      this.placeholder4 = "请输入正确的开户支行名称";
      this.bankName = "开户行名称";
      this.bankNum = "银行卡账号";
      this.bankUser = "开户户名";
      this.subBranch = "开户支行名称";
    } else {
      this.placeholder1 = "请选择正确的对公开户行";
      this.placeholder2 = "请输入正确的对公银行卡账号";
      this.placeholder3 = "请输入正确的开户公司名称";
      this.placeholder4 = "请输入正确的开户支行名称";
      this.bankName = "对公开户行名称";
      this.bankNum = "对公银行账号";
      this.bankUser = "对公开户户名";
      this.subBranch = "对公开户支行名称";
    }
    this.init();
  },
  methods: {
    init() {
      bankCount()
        .then(res => {
          this.columns = res;
          for (var i = 0; i < res.length; i++) {
            var text = res[i].bank_name;
            res[i] = { ...res[i], text: text };
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onChange(picker, value, index) {
      var text = value.text;
      var value = value.id;
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
    onConfirm(value) {
      this.value = value.text;
      this.showPicker = false;
      this.bankId = value.id;
    },
    showPopup() {
      this.showPicker = true;
    },
    // 验证
    blurBankAdd() {
      // var reBA = /^[0-9]{12,21}$/;
      // if (!reBA.test(this.valueBankAdd)) {
      //   this.$toast("请输入12-21个数字");
      // }
      this.flage1 = false;
    },
    blurPEp() {
      // var regV = /^[A-Za-z0-9\u4e00-\u9fa5]{2,50}$/;
      // if (!regV.test(this.valuePEp)) {
      //   this.$toast("请输入2-50位字符");
      // }
      this.flage2 = false;
    },
    blurAddress() {
      // var reA = /^.{4,25}$/;
      // if (!reA.test(this.valueSubBranch)) {
      //   this.$toast("请输入4-25个字符");
      // }
       this.flage3 = false;
    },
     focus1() {
      if (this.valueBankAdd != "") {
        this.flage1 = true;
      }
    },
    focus2() {
      if (this.valuePEp != "") {
        this.flage2 = true;
      }
    },
    focus3() {
      if (this.valueSubBranch != "") {
        this.flage3 = true;
      }
      // this.dis = true;
    },
    closeFClick1() {
      this.valueBankAdd = "";
      console.log("1111");
    },
    closeFClick2() {
      this.valuePEp = "";
      console.log("1111");
    },
    closeFClick3() {
      this.valueSubBranch = "";
      console.log("1111");
    },
    clickitem(e) {
      if (e.target.className.indexOf("box_red") == -1) {
        e.target.className = `box box_red`;
        this.radio = "1";
      } else {
        e.target.className = `box`;
        this.radio = "0";
      }
      // console.log(this.name);
      // console.log(e);
      // console.log(this.radio);
      // e == this.radio ? (this.radio = "1") : (this.radio = '0');
    },
    //绑定按钮
    submitBank() {
      if (this.value == "") {
        this.$toast(this.placeholder1);
        return false;
      }
      var reBA = /^[0-9]{12,21}$/;
      if (this.valueBankAdd == "" || !reBA.test(this.valueBankAdd)) {
        this.$toast(this.placeholder2);
        return false;
      }
      var regV = /^[A-Za-z0-9\u4e00-\u9fa5]{2,50}$/;
      if (this.valuePEp == "" || !regV.test(this.valuePEp)) {
        this.$toast(this.placeholder3);
        return false;
      }
      var reA = /^.{4,25}$/;
      if (this.valueSubBranch == "" || !reA.test(this.valueSubBranch)) {
        this.$toast(this.placeholder4);
        return false;
      }
      if (this.radio != 1) {
        this.$toast("请仔细阅读绑定银行卡协议");
        return false;
      }
      var data = {
        bid: this.bankId,
        banknumber: this.valueBankAdd,
        name: this.valuePEp,
        branch: this.valueSubBranch,
        status: this.$route.query.type
      };
      bankAdd(data)
        .then(res => {
          if (res != false) {
            this.$toast("银行卡添加成功");
            this.$router.push({
              path: "/userContent/homePage/myBank"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
    watch: {
    valueBankAdd(val, newval) {
      if (newval && this.valueBankAdd != "") {
        this.flage1 = true;
      } else {
        this.flage1 = false;
      }
    },
    valuePEp(val, newval) {
      if (newval && this.valuePEp != "") {
        this.flage2 = true;
      } else {
        this.flage2 = false;
      }
    },
   valueSubBranch(val, newval) {
      if (newval && this.valueSubBranch != "") {
        this.flage3 = true;
      } else {
        this.flage3 = false;
      }
    }
  }

};
</script>
<style lang="scss" scoped>
@import "@/css/common.scss";
@import "./addBankScode";
/deep/ .van-icon-clear {
  margin-right: rem(0);
  font-size: rem(30);
}

.close {
  width: rem(25);
  height: rem(25);
  display: none;
  position: absolute;
  z-index: 1;
  right: rem(10);
  top: rem(12);
  & > img {
    display: block;
    width: rem(25);
    height: rem(25);
  }
}
.close1,.close2,.close3 {
  display: block;
}
</style>
<style lang="scss">
@import "@/css/common.scss";
@import "./addBank";
</style>
