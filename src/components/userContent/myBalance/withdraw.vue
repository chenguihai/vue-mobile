<template>
  <div class="withdraw">
    <header>
      <div @click="histroyClick()">
        <img src="@/assets/arrowhead/zuo_nob.png" alt />
      </div>
      <h2>提现</h2>
    </header>
    <div class="withdrawData">
      <div class="bank">
        <van-field
          readonly
          clickable
          :value="value1"
          placeholder="请选择银行卡号"
          @click="showPicker = true"
        />
        <van-popup v-model="showPicker" class="changBank" position="bottom">
          <div class="title">
            <span>选择到账银行卡</span>
            <img src alt />
          </div>
          <div class="bankList" v-if="status == ''">
            <span
              class="bank"
              v-for="(item , index) in bank"
              :key="index"
              :class="{active:bankIndex == index}"
              @click="bankClick(item , index)"
            >{{item}}</span>
          </div>
          <div class="bankList" v-if="status == '1'">
            <span
              class="bank"
              v-for="(item , index) in bank"
              :key="index"
              :class="{activeS:bankIndex == index}"
              @click="bankClick(item , index)"
            >{{item}}</span>
          </div>
          <div class="bankNmae">
            <ul v-if="bankIndex ==0">
              <li
                v-for="(item , index) in bankPep"
                :key="index"
                :class="{activeBank:activeIndex == index}"
                @click="backPClick(item ,index)"
              >
                <div>
                  <span>{{item.bank_name}}</span>
                  <span>{{item.banknum}}</span>
                </div>
              </li>
            </ul>
            <ul v-else>
              <li
                v-for="(item , index) in bankPublic"
                :key="index"
                :class="{activeBank:activegIndex == index}"
                @click="backPgClick(item ,index)"
              >
                <div>
                  <span>{{item.bank_name}}</span>
                  <span>{{item.Public}}</span>
                </div>
              </li>
            </ul>
          </div>
        </van-popup>
        <img src="@/assets/arrowhead/zuo_arrow.png" alt />
      </div>
      <div class="withdrawMoney">
        <span>提现金额</span>
        <van-cell-group :border="false" class="withdrawM">
          <van-field
            label-class="labelSize"
            @blur="blurMoney()"
            @focus="focus1()"
            onkeyup="this.value= this.value.match(/\d+(\.\d{0,1})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''"
            v-model="value"
            label-width="30"
            label="￥"
          />
          <div class="close" :class="{'close1':flage1}" @mousedown="closeFClick1">
            <img src="../../../assets/arrowhead/close.png" alt />
          </div>
        </van-cell-group>
      </div>
      <div class="withdrawBut">
        <span>可用余额：¥{{money}}</span>
        <span>
          提现手续费费率为
          <p>1%</p>
        </span>
      </div>
    </div>
    <div class="submit">
      <span @click="submitClick">确认提现</span>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
import { takeShow, takeMoney, signAccount } from "@/api/list";
export default {
  data() {
    return {
      value1: "",
      value: "",
      showPicker: false,
      bankPep: [],
      bankPublic: [],
      bankIndex: 0,
      bank: ["个人银行卡", "对公银行卡"],
      banknum: "",
      Public: "",
      activeIndex: -1,
      activegIndex: -1,
      money: "", // 余额
      bankId: "",
      item: "",
      status: "",
      flage1: false
    };
  },
  created() {
    this.bankData();
  },
  methods: {
    bankData() {
      takeShow()
        .then(res => {
          for (var i = 0; i < res.list.length; i++) {
            if (res.list[i].status == 1) {
              this.bankPep.push(res.list[i]);
            } else {
              this.bankPublic.push(res.list[i]);
            }
          }
          this.money = res.money.money;
          this.init();
        })
        .catch(err => {
          console.log(err);
        });
      signAccount()
        .then(res => {
          if (res != false) {
            if (res.status == 1) {
              this.bank = ["个人银行卡"];
              this.status = "1";
            } else {
              this.bank = ["个人银行卡", "对公银行卡"];
              this.status = "";
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 返回上一页
    histroyClick() {
      this.$router.go(-1);
    },
    onConfirm(value, index) {},
    onCancel() {},
    bankClick(item, index) {
      this.bankIndex = index;
    },
    //选中银行
    backPClick(item, index) {
      this.item = "";
      this.activegIndex = -1;
      this.activeIndex = index;
      this.value1 = item.bank_name + " " + "(" + item.banknum + ")";
      this.bankId = item.id;
      this.item = item;this.showPicker = false
    },
    backPgClick(item, index) {
      this.item = "";
      this.activeIndex = -1;
      this.activegIndex = index;
      this.value1 = item.bank_name + " " + "(" + item.Public + ")";
      this.bankId = item.id;
      this.item = item;this.showPicker = false
    },
    //银行卡隐藏
    init() {
      for (var i = 0; i < this.bankPep.length; i++) {
        this.banknum = this.bankPep[i].banknumber;
        var reg = /^(\d{4})\d+(\d{4})$/;
        var str = this.banknum.toString().replace(reg, "$1**** ****$2");
        this.banknum = str;
        this.bankPep[i] = { ...this.bankPep[i], banknum: this.banknum };
      }
      for (var i = 0; i < this.bankPublic.length; i++) {
        this.Public = this.bankPublic[i].banknumber;
        var reg = /^(\d{4})\d+(\d{4})$/;
        var str = this.Public.toString().replace(reg, "$1**** ****$2");
        this.Public = str;
        this.bankPublic[i] = { ...this.bankPublic[i], Public: this.Public };
      }
    },
    // 验证提现金额
    blurMoney() {
      // console.log(Number(this.money));
      // console.log(this.value);
      // this.value = this.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
      // if (this.value == "") {
      //   Toast("请输入提现金额");
      //   return false;
      // }
      // if (Number(this.value) > Number(this.money)) {
      //   Toast("输入金额超出可用余额");
      //   return false;
      // }
      // if (this.value < 1) {
      //   Toast("输入金额需大于一元");
      //   return false;
      // }
      this.flage1 = false;
    },
    focus1() {
      if (this.value != "") {
        this.flage1 = true;
      }
    },
    closeFClick1() {
      this.value = "";
    },
    submitClick() {
     if (this.value1 == "") {
        Toast("请选择银行卡");
        return false;
      }
      if (this.value == "") {
        Toast("请输入提现金额");
        return false;
      }
      if (Number(this.value) > Number(this.money)) {
        Toast("输入金额超出可用余额");
        return false;
      }
      if (this.value < 1) {
        Toast("输入金额需大于一元");
        return false;
      }
      var data = {
        money: this.value,
        bid: this.bankId,
        bankname: this.item.bank_name,
        banknumber: this.item.banknumber,
        branch: this.item.branch,
        name: this.item.name
      };
      takeMoney(data)
        .then(res => {
          if (res != false) {
            Toast("提交成功等待审核");
            this.$router.push({
              path: "/userContent/homePage/myBalance"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  watch: {
    value(val, newval) {
      if (newval && this.value != "") {
        this.flage1 = true;
      } else {
        this.flage1 = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/css/common.scss";
@import "./withdrawScode";
/deep/ .van-icon-clear {
  margin-right: rem(0);
  font-size: rem(30);
}
/deep/ .van-cell {
  padding: rem(20) 0;
}
.close {
  width: rem(25);
  height: rem(25);
  display: none;
  position: absolute;
  z-index: 1;
  right: rem(10);
  top: rem(48);
  & > img {
    display: block;
    width: rem(25);
    height: rem(25);
  }
}
.close1 {
  display: block;
}
</style>
<style lang="scss">
.withdrawM {
  position: relative;
  & > .van-cell {
    padding: rem(20) 0;
    border-bottom: rem(1) solid #ccc;
    display: flex;
    align-items: center;
    & > .van-cell__value {
      & > .van-field__body {
        & > .van-field__control {
          font-size: rem(60);
        }
      }
    }
  }
}
.labelSize {
  display: flex;
  align-items: flex-end;
  margin-top: rem(10);
  & > span {
    font-size: rem(48);
    color: #333;
  }
}
.changBank {
  .title {
    position: fixed;
    z-index: 1;
    background: #fff;
    width: 100%;
    font-size: rem(28);
    color: #333;
    display: flex;
    justify-content: center;
    padding: rem(33) 0 rem(28) 0;
  }
  .bankList {
    width: rem(657);
    background: #fff;
    margin: rem(87) rem(29) 0 rem(64);
    position: fixed;
    font-size: rem(28);
    color: #666;
    display: flex;
    justify-content: space-between;
    border-bottom: rem(1) solid #ccc;
    span {
      width: rem(211);
      padding-bottom: rem(10);
    }
    span:nth-child(2) {
    }
    .active {
      color: #f3262d;
      padding-bottom: rem(10);
      border-bottom: rem(1) solid #f3262d;
    }
    .activeS {
      color: #f3262d;
      padding-bottom: rem(10);
      border-bottom: 0;
    }
  }
  .bankNmae {
    margin-top: rem(115);
    padding: 0 rem(20) 0 rem(64);
    ul {
      height: rem(492);
      li {
        height: rem(123);
        border-bottom: rem(1) solid #ccc;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-right: rem(30);

        div {
          width: 85%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          span:nth-child(1) {
            font-size: rem(28);
            margin-bottom: rem(10);
            color: #333;
          }
          span:nth-child(2) {
            font-size: rem(24);
            color: #666;
          }
        }
      }
      li:last-child {
        border-bottom: 0;
      }
      .activeBank {
        div {
          background: url("../../../assets/arrowhead/gou1.png") right no-repeat;
          background-size: rem(38) rem(28);
        }
      }
    }
  }
}
</style>
