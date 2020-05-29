<template>
  <div class="backfillMoney">
    <header>
      <div @click="histroyClick()">
        <img width="44" height="42" src="@/assets/arrowhead/zuo_nob.png" alt />
      </div>
      <h2>实名认证</h2>
      <MenuSlide @close="closeMenu" v-if="showMenu"></MenuSlide>
      <div class="dian" @click="onClickRight">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </header>
    <div class="backfillCon">
      <span>对公打款对账</span>
      <div class="backfillData">
        <div class="moneyImg">
          <img src="@/assets/auth/money.png" alt />
        </div>
        <div class="backfillText">
          <span>系统即将往您公司的对公账户打一笔1元以下的款项，打款将在两小时内完成，请收到款项后再次点击实名认证进入本页面填写打款金额，完成身份认证。</span>
        </div>
        <div class="money">
          <van-cell-group :border="false">
            <van-field label="打款金额" @blur="blurMoney() " v-model="value" placeholder="请输入打款金额" />
          </van-cell-group>
        </div>
        <div class="nextWay">
          <van-button
            @click="submitClick"
            :disabled="dis"
            size="large"
            color="#f3262d"
            type="primary"
          >确定</van-button>
        </div>
        <div class="prompt">
          <span>温馨提示：</span>
          <span>打款到账最多需要等待30分钟，打款金额72小时有效，请及时查看收款记录并提交验证，允许最多错误3次，超过3次请重新申请实名认证。</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
import { Button } from "vant";
import { bodyColor } from "@/utils/mixins";
import MenuSlide from "@/components/common/MenuSlide";
import { payAuth } from "@/api/list";
import axios from "axios";
import { apiUrl } from '@/utils/apiUrl'

export default {
  mixins: [bodyColor("fff")],
  components: {
    MenuSlide
  },
  name: "backfillMoney",
  data() {
    return {
      value: "",
      showMenu: false,
      dis: true,
      serviceid: this.$route.params.serviceid,
      valueEnt: this.$route.params.name,
      company: this.$route.params.company
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
    blurMoney() {
      var regN = /^-?(\d{1,100000000}|\d\.\d{1,2}|\d\d\.\d)$/;
      if (!regN.test(this.value)) {
        this.$toast("金额只能保留两位小数");
        return false;
      }
    },
    submitClick() {
      var regN = /^-?(\d{1,100000000}|\d\.\d{1,2}|\d\d\.\d)$/;
      if (!regN.test(this.value)) {
        this.$toast("金额只能保留两位小数");
        return false;
      }
      var value = parseFloat(this.value)
      var data = {
        cash: value,
        serviceId: this.serviceid
      };
      console.log(data)
      //let url = "http://api.lingtianzhongmei.com/api/api/user/sign/payAuth";
      let url =`${apiUrl}/user/sign/payAuth`;
      //  let url =` http://www.zhongmei66.com/api/api/user/sign/payAuth`;
      console.log(url)
      axios
        .post(url, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            console.log(res);
            const toast = Toast({
              duration: 0, // 持续展示 toast
              forbidClick: true,
              message: "企业实名认证成功 ，页面3S后自动返回"
            });
            let second = 3;
            const timer = setInterval(() => {
              second--;
              if (second) {
                toast.message = `企业实名认证成功 ，页面${second}S后自动返回`;
              } else {
                clearInterval(timer);
                // 手动清除 Toast
                Toast.clear();
                this.$router.push({ path: "/userContent/homePage/realName" });
              }
            }, 1000);
          } else if (res.data.code == 201) {
            console.log(res);
            if (res.data.data.failure == 3) {
              this.$router.push({ path: "/userContent/homePage/fail" });
            }
          } else {
            console.log(res);
            var a = 3 - Number(res.data.data.failure);

            if (a == 0) {
              this.$router.push({ path: "/userContent/homePage/fail" });
            } else {
              this.$toast("输入打款金额有误，剩余" + a + "次机会");
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
      // payAuth(data)
      // .then(res => {
      //   console.log(res);
      //   if (res != false) {
      //     //   this.$toast("输入打款金额有误，剩余2次机会。");
      //     // this.$toast("企业实名认证成功，页面将在3S自动返回。"); // 认证成功
      //     // this.$router.push({path:'/userContent/homePage/fail'})//认证失败
      //     const toast = Toast({
      //       duration: 0, // 持续展示 toast
      //       forbidClick: true,
      //       message: "企业实名认证成功 ，页面3S后自动返回"
      //     });
      //     let second = 3;
      //     const timer = setInterval(() => {
      //       second--;
      //       if (second) {
      //         toast.message = `企业实名认证成功 ，页面${second}S后自动返回`;
      //       } else {
      //         clearInterval(timer);
      //         // 手动清除 Toast
      //         Toast.clear();
      //         this.$router.push({ path: "/userContent/homePage/realName" });
      //       }
      //     }, 1000);
      //   } else {
      //     // var a = 3 - Number(res.failure);
      //     // this.$message.error("输入打款金额有误，剩余" + a + "次机会");

      //   }
      // })
      // .catch(err => {
      //   console.log(err);
      // });
    }
  },
  watch: {
    value() {
      if (this.value != "") {
        this.dis = false;
        return;
      }
    }
  }
};
</script>
<style lang="scss">
@import "@/css/common.scss";
@import "./backfillMoney";
</style>
