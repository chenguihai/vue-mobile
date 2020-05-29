<template>
  <div class="myBank">
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
    <div class="myBankList" v-if="flagBank">
      <div class="myBankTow" :class="{'BankLf':bankpf}">
        <ul>
          <li
            v-for="(item , index) in bankList"
            :key="index"
            :class="{activeBank:bankIndex == index}"
            @click="bankClick(item , index)"
          >{{item.bankG}}</li>
        </ul>
      </div>
      <div class="index0" :class="{'BankL':bankG.length>0}" v-if="bankIndex == 0">
        <div class="myBankData" v-if="bankG.length>0">
          <ul>
            <li v-for="(item , index) in bankG" :key="index">
              <div class="bankNum">
                <div>
                  <span>{{item.bank_name}}</span>
                  <span>{{item.banknumber}}</span>
                </div>
                <div>
                  <span @click="deletBankClick(item)">删除</span>
                </div>
              </div>
              <div class="bankUser">
                <span>{{item.name}}</span>
              </div>
            </li>
          </ul>
          <div class="myBankAdd">
            <img src="../../../assets/userContent/add.png" alt />
            <span @click="abbBankPG">添加个人银行卡</span>
          </div>
        </div>
        <div class="noBank" v-else>
          <img src="../../../assets/userContent/bankList.png" alt />
          <span>您还未绑定个人银行卡</span>
          <strong @click="abbBankPG">+立即绑定个人银行卡</strong>
        </div>
      </div>
      <div class="index0" :class="{'Bankg':bankQ.length>0}" v-if="bankIndex == 1">
        <div class="myBankData" v-if="bankQ.length>0">
          <ul>
            <li v-for="(item , index) in bankQ" :key="index">
              <div class="bankNum">
                <div>
                  <span>{{item.bank_name}}</span>
                  <span>{{item.banknumber}}</span>
                </div>
                <div>
                  <span @click="deletBankClick(item)">删除</span>
                </div>
              </div>
              <div class="bankUser">
                <span>{{item.name}}</span>
              </div>
            </li>
          </ul>
          <div class="myBankAdd">
            <img src="../../../assets/userContent/add.png" alt />
            <span @click="abbBankG">添加对公银行卡</span>
          </div>
        </div>
        <div class="noBank" v-else>
          <img src="../../../assets/userContent/bankList.png" alt />
          <span>您还未绑定对公银行卡</span>
          <strong @click="abbBankG">+立即绑定对公银行卡</strong>
        </div>
      </div>
    </div>
    <div class="myBankG" v-if="flagBG">
      <span>个人银行卡</span>
      <div class="myBankData myBankGL" v-if="bankG.length>0">
        <ul>
          <li v-for="(item , index) in bankG" :key="index">
            <div class="bankNum">
              <div>
                <span>{{item.bank_name}}</span>
                <span>{{item.banknumber}}</span>
              </div>
              <div>
                <span @click="deletBankClick(item)">删除</span>
              </div>
            </div>
            <div class="bankUser">
              <span>{{item.name}}</span>
            </div>
          </li>
        </ul>
        <div class="myBankAdd">
          <img src="../../../assets/userContent/add.png" alt />
          <span @click="abbBankP">添加个人银行卡</span>
        </div>
      </div>
      <div class="noBank" v-else>
        <img src="../../../assets/userContent/bankList.png" alt />
        <span>您还未绑定个人银行卡</span>
        <strong @click="abbBankP">+立即绑定个人银行卡</strong>
      </div>
    </div>
    <div></div>
  </div>
</template>
<script>
import { Toast } from "vant";
import { bodyColor } from "@/utils/mixins";
import MenuSlide from "@/components/common/MenuSlide";
import { userBank, bankDelete, signAccount } from "@/api/list";
export default {
  mixins: [bodyColor("fff")],

  components: {
    MenuSlide
  },

  data() {
    return {
      bankList: [
        { bankG: "个人银行卡", id: 1 },
        { bankG: "对公银行卡", id: 2 }
      ],
      bankIndex: 0,
      showMenu: false,
      flag: "1", //是否有银行卡 1：有 2：无
      flage: "1", // 是否实名验证 1：有 2：无
      bankData: [],
      bankG: [],
      bankQ: [],
      status: "",
      flagBank: false,
      flagBG: false,
      bankpf: false
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      userBank()
        .then(res => {
          for (var i = 0; i < res.length; i++) {
            var banknum = res[i].banknumber;
            var reg = /^(\d{4})\d+(\d{4})$/;
            var str = banknum.replace(reg, "$1**** **** $2");
            res[i].banknumber = str;
            if (res[i].status == 1) {
              this.bankG.push(res[i]);
              if (this.bankG != undefined && this.bankG.length > 0) {
                this.bankpf = true;
              }else{
                 this.bankpf = false;
              }
            } else if (res[i].status == 2) {
              this.bankQ.push(res[i]);
              //  if (this.bankQ != undefined && this.bankQ.length > 0) {
              //   this.bankpf = true;
              // }
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
      signAccount()
        .then(res => {
          if (res == false) {
            this.flage = 2;
            this.$toast("您还未实名认证，请先认证后添加银行卡");
            // this.flagBank = true;
            this.flagBG = true;
          } else if (res.signstatus != 3) {
            this.flag = 2;
            this.$toast("您还未实名认证，请先认证后添加银行卡");
            this.flagBG = true;
          } else {
            this.flage = 1;
            this.status = res.status;
            if (this.status == 1) {
              this.flagBG = true;
            } else if (this.status == 2) {
              this.flagBank = true;
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
    onClickRight() {
      this.showMenu = true;
    },
    closeMenu() {
      this.showMenu = false;
    },
    toast() {
      const toast = Toast({
        message: "您还未实名认证，请先认证后添加银行卡",
        className: "Toast"
      });
    },
    toast1() {
      const toast = Toast({
        message: "您还未企业认证，请先认证后添加银行卡",
        className: "Toast"
      });
    },
    // 切换 个人 对公
    bankClick(item, index) {
      this.bankIndex = index;
      console.log(index)
      if (index == 0) {
        if (this.bankG != undefined && this.bankG.length > 0) {
          this.bankpf = true;
        }
        else{
           this.bankpf = false;
        }
      } else {
        if (this.bankQ != undefined && this.bankQ.length > 0) {
          this.bankpf = true;
        } else{
           this.bankpf = false;
        }
      }
    },
    // 删除用户银行卡
    deletBankClick(item) {
      var id = item.id;
      bankDelete(id)
        .then(res => {
          this.$toast("删除成功");
          window.location.reload();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 添加银行卡
    abbBankP() {
      if (this.status != "1") {
        this.toast();
      } else {
        this.$router.push({
          path: "/userContent/homePage/addBank",
          query: { type: 1 }
        });
      }
    },
    abbBankPG(){
 if (this.status != "2") {
        this.toast1();
      } else {
        this.$router.push({
          path: "/userContent/homePage/addBank",
          query: { type: 1 }
        });
      }
    },
    abbBankG() {
      if (this.status != "2") {
        this.toast1();
      } else {
        this.$router.push({
          path: "/userContent/homePage/addBank",
          query: { type: 2 }
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/css/common.scss";
@import "./myBankScode";
</style>
<style lang="scss">
.Toast {
  background-color: rgba(50, 50, 51, 0.59);
  width: rem(272);
  padding: rem(15) rem(64);
  top: 35%;
  left: 50%;
}
</style>