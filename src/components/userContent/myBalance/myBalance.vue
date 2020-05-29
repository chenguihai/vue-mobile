<template>
  <div class="myBalance">
    <header>
      <div @click="histroyClick()">
        <img src="@/assets/arrowhead/zuo_nob.png" alt />
      </div>
      <h2>账户余额</h2>
    </header>
    <div class="myBalanceList">
      <div class="myBalanceMoney">
        <div class="moneyAll">
          <span>账户余额</span>
          <span>¥{{allMoney}}</span>
        </div>
        <div class="moneyList">
          <div>
            <span>可用余额</span>
            <span>¥{{money}}</span>
          </div>
          <div>
            <span>冻结余额</span>
            <span>¥{{money_frozen}}</span>
          </div>
        </div>
        <div class="withdraw">
          <span :disabled="disabled" @click="takeMoney">提现</span>
        </div>
      </div>
      <div class="myBalanceData">
        <div class="dataList" @click="dataListClick">
          <span>账户余额明细</span>
          <img src="@/assets/arrowhead/zuo_arrow.png" alt />
        </div>
        <div class="dataRecord" @click="dataRecordClick">
          <span>提现记录</span>
          <img src="@/assets/arrowhead/zuo_arrow.png" alt />
        </div>
      </div>
    </div>
    <div class="reminder" v-if="flageClose">
      <h4 class="reminderData">
        <h4>温馨提示</h4>
        <div class="spanD">
          <span v-if="flageL == 1">您还未实名认证，请先完成实名认证</span>
          <span v-else-if="flageL ==2">您还未绑定银行卡，请先绑定银行卡</span>
        </div>
        <button v-if="flageL == 1" @click="realClick">去实名认证</button>
        <button v-else-if="flageL ==2" @click="myBankClick">去绑定银行卡</button>
      </h4>
      <div class="close" @click="closeBut">
        <img src="../../../assets/userContent/guanbi.png" alt />
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
import { accountExp, accountMoney, realName } from "@/api/list";
import axios from "axios";
export default {
  name: "myBalance",
  data() {
    return {
      flageClose: false,
      flageL: "",
      money: "",
      money_frozen: "",
      allMoney: "",
      disabled: true
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      // 验证银行E签宝
      // let url = "http://47.106.240.143/api/api/user/account/exp";
      // axios
      //   .get(url, {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //       Authorization: "Bearer " + localStorage.getItem("token")
      //     }
      //   })
      //   .then(res => {
      //     if (res.data.code == 201) {
      //       this.flageClose = true;
      //       this.flageL = 2;
      //     } else if (res.data.code == 202) {
      //       this.flageClose = true;
      //       this.flageL = 1;
      //     }
      //   })
      //   .catch(err => {
      //     console.log(err);
      // });
      realName()
        .then(res => {
          console.log(res);
          if (res == false) {
            this.flageClose = true;
            this.flageL = 1;
            const toast = Toast({
              message: "1",
              className: "Toast1"
            });
          }
          if (res.signstatus != 3) {
            this.flageClose = true;
            this.flageL = 1;
          } else {
            this.flageClose = false;
            accountExp()
              .then(res => {
                if (res == false) {
                  this.flageClose = true;
                  this.flageL = 2;
                  const toast = Toast({
                    message: "1",
                    className: "Toast1"
                  });
                } else {
                  this.flageClose = false;
                }
              })
              .catch(err => {
                console.log(err);
              });
          }
        })
        .catch(err => {
          console.loh(err);
        });
      // accountExp()
      //   .then(res => {
      //     if (res == false) {
      //       this.flageClose = true;
      //       this.flageL = 2;
      //     } else {
      //       this.flageClose = false;
      //     }
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
      // 账户余额
      accountMoney()
        .then(res => {
          this.allMoney = Number(res.money) + Number(res.money_frozen);
          this.money = res.money;
          this.money_frozen = res.money_frozen;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 返回上一页
    histroyClick() {
      this.$router.go(-1);
    },
    // 提现
    takeMoney() {
      if (this.allMoney != 0) {
        if (this.flageL == 1 || this.flageL == 2) {
          this.flageClose = true;
        } else {
          this.$router.push({ path: "/userContent/homePage/withdraw" });
        }
      } else {
        Toast("余额为零，无法提现");
      }
    },
    // 关闭弹窗
    closeBut() {
      this.flageClose = false;
    },
    // 跳转余额明细
    dataListClick() {
      this.$router.push({ path: "/userContent/homePage/moneyDetail" });
    },
    // 跳转提现记录
    dataRecordClick() {
      this.$router.push({ path: "/userContent/homePage/moneyRecord" });
    },
    // 跳转实名认证
    realClick() {
      this.$router.push({ path: "/userContent/homePage/realName" });
    },
    // 绑定银行卡
    myBankClick() {
      this.$router.push({ path: "/userContent/homePage/myBank" });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/css/common.scss";
@import "./myBalanceScode";
</style>
<style lang="scss">
.van-toast--text {
  padding: 0;
  width: rem(400);
  height: rem(110);
}
.van-toast {
  top: 28%;
  background: rgba(51, 51, 51, 0.59);
}
.Toast1 {
  display: none !important;
}
</style>