<template>
  <div class="accountUser">
    <header>
      <div @click="histroyClick()">
        <img src="@/assets/arrowhead/zuo_nob.png" alt />
      </div>
      <h2>账号设置</h2>
    </header>
    <div class="userData">
      <div class="userImg">
        <van-uploader class="uploader"
          :before-read="beforeRead"
          :after-read="afterRead"
            >
          <van-button type="primary"></van-button>
        </van-uploader>
        <span>头像</span>
        <div>
          <img v-if="!avatar" src="@/assets/default/user.jpg" alt />
          <img v-else :src="avatar.indexOf('http')>-1?avatar:$store.state.ali_api_host+avatar" alt />
          <img src="@/assets/arrowhead/zuo_arrow.png" alt />
        </div>
      </div>
      <!-- <van-popup v-model="showImg" class="changImg" position="bottom">
        <div class="activeClick">
          <span>取消</span>
          <span>确定</span>
        </div>
        <div class="phoneImg">
          <van-uploader class="uploader">
            <van-button type="primary">拍照</van-button>
          </van-uploader>
          <van-uploader
            class="uploader"
            :before-read="beforeRead"
            :after-read="afterRead"
            name="avatar"
          >
            <van-button type="primary">从相册选择</van-button>
          </van-uploader>
        </div>
      </van-popup> -->
      <div class="dataList">
        <div class="userName" @click="userNameClick">
          <span>昵称</span>
          <div>
            <span>{{userData.nick_name}}</span>
            <img src="@/assets/arrowhead/zuo_arrow.png" alt />
          </div>
        </div>
      </div>
      <div class="userSxe">
        <van-cell class="userSxeVal" is-link @click="showPopup" :border="false">
          <span>性别</span>
          <van-field
            v-model="SxeVal"
            readonly
            clickable
            :border="false"
            :class="{'SxeValC':SxeVal == '保密'}"
          />
        </van-cell>
        <van-popup v-model="showPicker" position="bottom">
          <van-picker
            show-toolbar
            title="选择性别"
            :columns="columns"
            @cancel="showPicker = false"
            @confirm="onConfirm"
          />
        </van-popup>
      </div>
      <div class="userSxe birthday">
        <van-cell class="userSxeVal" is-link @click="showbirthday" :border="false">
          <span>生日</span>
          <van-field
            :border="false"
            v-if="birthdayVal == null"
            v-model="birthdayVal"
            readonly
            clickable
            placeholder="请选择"
          />
          <van-field v-else v-model="birthdayVal" readonly clickable :border="false" />
        </van-cell>
        <van-popup v-model="birthdayPicker" position="bottom">
          <van-datetime-picker
            show-toolbar
            @cancel="birthdayPicker = false"
            @confirm="onConfirmbir"
            v-model="currentDate"
            type="date"
            :min-date="minDate"
            :max-date="maxDate"
          />
        </van-popup>
      </div>
      <div class="dataList userAddress">
        <div class="userName" @click="userAddClick">
          <span>联系地址</span>
          <div>
            <span
              v-if="userData.province == 0 ||userData.city == 0 ||userData.district == 0 ||userData.address == null "
              class="SxeValC"
            >未设置</span>
            <span v-else>{{addAll}}</span>
            <img src="@/assets/arrowhead/zuo_arrow.png" alt />
          </div>
        </div>
      </div>
    </div>
    <div class="userData">
      <div class="dataList userOperation">
        <div class="userName" @click="userRealNameClick">
          <span>实名认证</span>
          <div>
            <span v-if="flag ==1" class="SxeValC">未认证</span>
            <span v-else-if="flag ==2">已认证</span>
            <img src="@/assets/arrowhead/zuo_arrow.png" alt />
          </div>
        </div>
      </div>
      <div class="dataList userOperation">
        <div class="userName" @click="userPhoneClick">
          <span>修改手机</span>
          <div>
            <span>{{userPhone}}</span>
            <img src="@/assets/arrowhead/zuo_arrow.png" alt />
          </div>
        </div>
      </div>
      <div class="dataList userOperation">
        <div class="userName" @click="userPasswordClick">
          <span>修改登录密码</span>
          <div>
            <span></span>
            <img src="@/assets/arrowhead/zuo_arrow.png" alt />
          </div>
        </div>
      </div>
    </div>
    <div class="userData" @click="myBankClick">
      <div class="dataList userOperation">
        <div class="userName">
          <span>银行卡管理</span>
          <div>
            <span></span>
            <img src="@/assets/arrowhead/zuo_arrow.png" alt />
          </div>
        </div>
      </div>
    </div>
    <div class="quitLogin">
      <span @click="quitLoginClick">退出登录</span>
    </div>
    <div class="userBottom">
      <div class="userIcon">
        <div>
          <img src="@/assets/icon/weixin1.png" alt />
          <span>微信版</span>
        </div>
        <div>
          <img src="@/assets/icon/chuping2.png" alt />
          <span>触屏版</span>
        </div>
        <div>
          <img src="@/assets/icon/diannaoban3.png" alt />
          <span>电脑版</span>
        </div>
      </div>
      <div class="userText">
        <span>copyright&copy;2019-2020 凌天众媒网 版权所有</span>
      </div>
    </div>
    <div class="reminder" v-if="flageClose">
      <h4 class="reminderData">
        <h4>温馨提示</h4>
        <div class="spanD">
          <span>您还未实名认证，请先完成实名认证</span>
        </div>
        <button @click="realClick">去实名认证</button>
      </h4>
      <div class="close" @click="closeBut">
        <img src="../../../assets/userContent/guanbi.png" alt />
      </div>
    </div>
    <van-loading size="24px" v-show="accLoading" class="acc_loading" type="spinner" vertical>头像上传中...</van-loading>
  </div>
</template>
<script>
import { DatetimePicker } from "vant";
import { getUserInfo } from "@/api/service";
import area from "@/assets/js/area";
import { Toast } from "vant";
import { upInfodataData, realName, upavatar } from "@/api/list";
import { Picker } from "vant";
import axios from "axios";
import {
  logoutDo
} from '@/utils/tool'
export default {
  data() {
    return {
      showImg: false,
      columns: ["男", "女", "保密"],
      showPicker: false,
      SxeVal: "",
      minDate: new Date(1900, 1, 1),
      maxDate: new Date(2019, 12, 31),
      currentDate: new Date(),
      birthdayVal: "",
      birthdayPicker: false,
      userPhone: "",
      areaList: JSON.parse(JSON.stringify(area)),
      userData: "",
      addAll: "",
      flag: "1",
      avatar: "",
      pro: "",
      cit: "",
      dis: "",
      signstatus: "",
      flageClose: false,
      accLoading:false
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
          var province = this.userData.province;
          var city = this.userData.city;
          var district = this.userData.district;
          var address = this.userData.address;
          this.birthdayVal = this.userData.birthday;
          this.avatar = this.userData.avatar;
          // this.SxeVal = this.userData.sex;
          if (this.userData.sex == "M") {
            this.SxeVal = "男";
          } else if (this.userData.sex == "F") {
            this.SxeVal = "女";
          } else {
            this.SxeVal = "保密";
          }

          // 获取地址
          for (var key in this.areaList.province_list) {
            if (province == key) {
              this.pro = this.areaList.province_list[key];
            }
          }
          for (var key in this.areaList.city_list) {
            if (city == key) {
              this.cit = this.areaList.city_list[key];
            }
          }
          for (var key in this.areaList.county_list) {
            if (district == key) {
              this.dis = this.areaList.county_list[key];
            }
          }
          if ((this.pro+'市') == this.cit) {
            this.addAll = this.cit + this.dis + address;
          } else {
            this.addAll = this.pro + this.cit + this.dis + address;
          }
          this.deletPhont();
          this.birthdayVal = this.userData.birthday
            .replace(/\ /g, " ")
            .split(" ")[0];
        })
        .catch(err => {
          console.log(err);
        });

      realName()
        .then(res => {
          if (res == false) {
            this.flag = "1";
            const toast = Toast({
              message: "用户呢称不能为空",
              className: "Toast1"
            });
          } else if (res.signstatus != 3) {
            this.flag = "1";
          } else {
            this.signstatus = res.signstatus;
            console.log(this.signstatus);
            this.flag = "2";
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
    beforeRead(file) {
      // console.log(file)
      if (file.type == "image/jpeg"||file.type == "image/png") {
        this.accLoading = true
         return true;
      }
        Toast("请上传正确格式的图片");
        return false;
    },

    // 返回 Promise
    asyncBeforeRead(file) {
      return new Promise((resolve, reject) => {
        if (file.type !== "image/jpeg") {
          Toast("请上传 jpg 格式图片");
          reject();
        } else {
          resolve();
        }
      });
    },
    afterRead(file) {
      let data = new FormData(); //创建form对象
      data.append("avatar", file.file); //通过append向form对象添加数据//第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
     // alert(JSON.stringify(file.file))
      // alert(file.file.size)
      upavatar(data)
        .then(res => {
            this.init();
          // this.avatar = res.file;
          this.accLoading = false
          Toast("修改成功");
        })
        .catch(err => {
          console.log(err);
          this.accLoading = false
        });
    },

    deletPhont() {
      var mobile = this.userData.mobile;
      var reg = /^(\d{3})\d+(\d{4})$/;
      var str = mobile.replace(reg, "$1****$2");
      this.userPhone = str;
    },
    // 修改昵称
    userNameClick() {
      this.$router.push({
        name: "changeInfo",
        query: { type: "1", nick_name: this.userData.nick_name }
      });
    },
    // 选择性别
    showPopup() {
      this.showPicker = true;
    },
    onConfirm(value) {
      this.SxeVal = value;
      this.showPicker = false;
      var sexD = "";
      if (this.SxeVal == "男") {
        sexD = "M";
      } else if (this.SxeVal == "女") {
        sexD = "F";
      } else {
        sexD = "U";
      }

      var data = {
        sex: sexD
      };
      upInfodataData(data)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 选择生日
    showbirthday() {
      this.birthdayPicker = true;
    },
    onConfirmbir(value) {
      var b = this.birthdayVal;
      value =
        value.getFullYear() +
        "-" +
        (value.getMonth() + 1) +
        "-" +
        value.getDate();
      this.birthdayVal = value;
      this.birthdayPicker = false;
      var data = {
        birthday: this.birthdayVal
      };
      upInfodataData(data)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 修改联系地址
    userAddClick() {
      if (
        this.userData.province != 0 ||
        this.userData.city != 0 ||
        this.userData.district != 0 ||
        this.userData.address != null
      ) {
        var address = this.userData.address;
        this.$router.push({
          path: "/userContent/homePage/changeInfo",
          query: {
            type: "2",
            p: this.pro,
            c: this.cit,
            d: this.dis,
            a: address
          }
        });
      } else {
        this.$router.push({
          path: "/userContent/homePage/changeInfo",
          query: {
            type: "2"
          }
        });
      }
    },
    // 绑定银行卡
    myBankClick() {
      if (this.signstatus == 3) {
        this.$router.push({ path: "/userContent/homePage/myBank" });
      } else {
        this.flageClose = true;
      }
    },
    // 跳转实名认证
    realClick() {
      this.$router.push({ path: "/userContent/homePage/realName" });
    },
    // 关闭弹窗
    closeBut() {
      this.flageClose = false;
    },
    // 修改绑定手机
    userPhoneClick() {
      this.$router.push({
        name: "alterPhone",
        params: { mobile: this.userData.mobile }
      });
    },
    // 修改密码
    userPasswordClick() {
      this.$router.push({ path: "/userContent/homePage/alterPassword" });
    },
    userRealNameClick() {
      this.$router.push({ path: "/userContent/homePage/realName" });
    },
    // 退出登录
    quitLoginClick() {
      window.localStorage.clear();
      logoutDo()
      this.$router.push({ path: "/login" });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/css/common.scss";
@import "./accountUserScode";
</style>
<style lang="scss">
.accountUser{
  .acc_loading{
    color: #ffffff;
    text-align: center;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background: rgba($color: #000000, $alpha: 0.8);
    padding:0.6rem;
    border-radius: 0.2rem;
  }
  .van-uploader__wrapper {
     .van-button {
            height: rem(104);
            padding: 0;
            width: 100%;
          }
  }
}
.changImg {
  .van-uploader__input-wrapper {
      button {
            height: rem(104);
            padding: 0;
            width: 100% !important;

          }
  }
  .phoneImg {
    .uploader {
      width: 100%;
      .van-uploader__wrapper {
        .van-uploader__input-wrapper {
          width: 100%;
          .van-button--primary {
            background-color: #f4f6f8;
            border: 0;
            color: #333;
            font-size: rem(30);
          }
          .van-button {
            height: rem(104);
            padding: 0;
            width: 100%;
          }
        }
      }
    }
    .uploader:nth-child(1) {
      border-bottom: 1px solid #ccc;
    }
  }
}

.userSxe {
  // height: rem(102);
  &>.userSxeVal {
    padding: rem(27) rem(20);
    // border-bottom: rem(1) solid #eee;
    .van-cell__value {
      display: flex;
      .van-field__body {
        width: 95%;
        display: flex;
        justify-content: flex-end;
        overflow: hidden;
        .van-field__control {
          text-align: right;
          width: 44%;
          overflow: hidden;
          color: #666;
        }
      }
      ::-webkit-input-placeholder {
        text-align: right;
        color: #999 !important;
      }

      :-moz-placeholder {
        text-align: right;
        color: #999 !important;
      }

      ::-moz-placeholder {
        text-align: right;
        color: #999 !important;
      }

      :-ms-input-placeholder {
        text-align: right;
        color: #999 !important;
      }
      .van-cell {
        padding: 0;
      }
      span:nth-child(1) {
        color: #333;
        font-size: rem(28);
        width: rem(400);
      }
      span:nth-child(2) {
        color: #999;
        font-size: rem(28);
        margin-left: rem(141);
      }
    }
  }
}
.SxeValC {
  color: #999 !important;
  .van-cell__value {
    .van-field__body {
      .van-field__control {
        color: #999 !important;
      }
    }
  }
}
.Toast1 {
  display: none !important;
}
</style>
