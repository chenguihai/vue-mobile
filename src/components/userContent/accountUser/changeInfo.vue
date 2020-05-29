<template>
  <div class="changeInfo" :class="{'changeInfoC':type == 2}">
    <header>
      <div @click="histroyClick()">
        <img src="@/assets/arrowhead/zuo_nob.png" alt />
      </div>
      <h2>{{title}}</h2>
    </header>
    <div class="userName" v-if="type == 1">
      <van-cell-group :border="false">
        <van-field
          :border="false"
          v-model="value"
          @focus="focusClick()"
          @blur="userNameBlur()"
          placeholder="请输入新的昵称"
        />
        <div class="close" :class="{'closeF':flageI}" @mousedown="closeFClick">
          <img src="../../../assets/arrowhead/close.png" alt />
        </div>
      </van-cell-group>
    </div>
    <div class="userName add" v-if="type == 2">
      <p class="radio">
        <van-cell-group class="InvoiceType" is-link @click="showAdd" :border="false">
          <van-field
            :border="false"
            right-icon="arrow"
            clickable
            label="联系地址："
            :value="addInfor"
            readonly="readonly"
            placeholder="请选择"
          />
        </van-cell-group>
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
            label="详细地址："
            @focus="AddressClick()"
            @blur="AddressBlur()"
            v-model="Address"
            placeholder="请输入详细的地址"
          />
          <div class="close Address" :class="{'closeF':flageI}" @mousedown="closeFClick">
            <img src="../../../assets/arrowhead/close.png" alt />
          </div>
        </van-cell-group>
      </p>
    </div>
    <div class="submiName">
      <span v-if="type == 1" @click="submiName">确定</span>
      <span v-if="type == 2" @click="submiAdd">确定</span>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant'
import area from '@/assets/js/area'
import { modifyName, upInfodataData } from '@/api/list'
export default {
  data () {
    return {
      title: '',
      type: '',
      value: '',
      addInfor: '请选择',
      showa: false,
      areaList: area,
      province: '',
      city: '',
      district: '',
      Address: '',
      flageI: false
    }
  },
  created () {
    if (this.$route.query.type == '1') {
      this.title = '修改昵称';
      this.type = this.$route.query.type;
      this.value = this.$route.query.nick_name;
    } else if (this.$route.query.type == '2') {
      this.title = '联系地址';
      this.type = this.$route.query.type;
      if (
        this.$route.query.p &&
        this.$route.query.c &&
        this.$route.query.a &&
        this.$route.query.d
      ) {
        this.province = this.$route.query.p;
        this.city = this.$route.query.c;
        this.district = this.$route.query.d;
        this.Address = this.$route.query.a;
        this.addInfor = this.province + this.city + this.district;
      }
    }
  },
  methods: {
    // 返回上一页
    histroyClick() {
      this.$router.go(-1);
    },
    userNameBlur() {
      // if (this.value == '') {
      //   const toast = Toast({
      //     message: '用户呢称不能为空',
      //     className: 'Toast'
      //   });
      //   return;
      // }
      this.flageI = false;
    },
    focusClick() {
      if (this.value != '') {
        this.flageI = true;
      }
    },
    AddressBlur() {
      this.flageI = false;
    },
    AddressClick() {
      if (this.Address != '') {
        this.flageI = true;
      }
    },
    closeFClick() {
      this.value = '';
      this.Address = '';
      console.log('1111');
    },
    //清空昵称按钮
    // userNameDle() {/^1[3456789]\d{9}$/.test(phone)
    //   this.value = '';
    // },
    //昵称提交
    submiName() {
      if (this.value == '') {
        const toast = Toast({
          message: '用户呢称不能为空',
          className: 'Toast'
        });
        return;
      }
      if(/^1[3456789]\d{9}$/.test(this.value)){
         const toast = Toast({
          message: '用户呢称不能为手机号，请修改',
          className: 'Toast'
        });
        return;
      }
      // var data = {
      var nick_name = this.value;
      // };
      console.log(nick_name);
      modifyName(nick_name)
        .then(res => {
          if(res!=false){


          const toast = Toast({
            message: '昵称提交',
            className: 'Toast'
          });
          this.$router.push({ path: '/userContent/homePage/accountUser' });
           }
       })
        .catch(err => {
          console.log(err);
        });
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
      if(val[0].name!='钓鱼岛'){
         if (val[0].name === val[1].name) {
        this.addInfor = val[0].name + '' + val[2].name;
      } else {
        this.addInfor = val[0].name + '' + val[1].name + '' + val[2].name;
      }

      this.province = val[0].code;
      this.city = val[1].code;
      this.district = val[2].code;
      }else{
         console.log(val[0].name);
         this.addInfor =val[0].name;
      }

    },
    blurAdd() {
      // var reD = /^.{4,25}$/;
      // if (!reD.test(this.Address)) {
      //   this.$toast('请输入详细地址4-25个字');
      // }
    },
    submiAdd() {
      var reD = /^.{4,25}$/;
       if(this.addInfor !='钓鱼岛'){
          if (this.province == '' || this.city == '' || this.district == '') {
        this.$toast('请选择联系地址的省市区');
        return;
      } else if (this.Address == '' || !reD.test(this.Address)) {
        this.$toast('请输入详细地址4-25个字');
        return;
      }
      var prov = ''
      for(var i in this.areaList.province_list){
        if(this.areaList.province_list[i] == this.province)
          this.province = i
      }
      var cit = ''
      for(var i in this.areaList.city_list){
        if(this.areaList.city_list[i] == this.city)
          this.city = i
      }
      var distri = ''
      for(var i in this.areaList.county_list){
        if(this.areaList.county_list[i] == this.district)
          this.district = i
      }
       }else{
         this.province='900000'
         this.city ='900000'
         this.district ='900000'
       }

      var data = {
        province: this.province,
        city: this.city,
        district: this.district,
        address: this.Address
      };
      upInfodataData(data)
        .then(res => {
          if (res != false) {
            this.$toast('地址修改成功');
            this.$router.push({ path: '/userContent/homePage/accountUser' });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
    // stopKeyborad() {
    //   this.$refs.scanTextbox.setAttribute('readonly', 'readonly');
    //   setTimeout(() => {
    //     this.$refs.scanTextbox.removeAttribute('readonly');
    //   }, 200);
    // }
  },
  watch: {
    value(val, newval) {
      if (newval && this.value != '') {
        this.flageI = true;
      } else {
        this.flageI = false;
      }
    },
    Address(val, newval) {
      if (newval && this.Address != '') {
        this.flageI = true;
      } else {
        this.flageI = false;
      }
    }
    // value: {
    //   handler(newVal) {
    //     if (this.value != "") {
    //     this.flageI = true;
    //   }
    //   },
    //   deep: true  Address
    // }
  }
};
</script>
<style lang="scss" scoped>
@import "@/css/common.scss";
@import "./changeInfoScode";
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
  right: rem(45);
  top: rem(34);
  & > img {
    display: block;
    width: rem(25);
    height: rem(25);
  }
}
.closeF {
  display: block;
}
.Address {
  top: rem(40) !important;
}
.changeInfoC {
  height: rem(1334);
  background: #fff;
}
</style>
<style lang="scss">
.changeInfo {
  .userName {
    width: 92%;//rem(700);
    box-sizing: border-box;
    height: rem(88);
    margin: 0 auto;
     margin-top: rem(36);
    padding: 0 rem(24);
    border: rem(1) solid #ccc;
    background: #fff;
    & > .van-cell-group {
      position: relative;
      background: none;
      .van-cell {
        background: none;
        .van-field__label {
          width: rem(140);
        }
        .van-cell__value {
          .van-field__body {
            .van-field__control {
                color: #333;
            }
            .van-field__right-icon {
              .van-icon {
                background: #d8d8d8;
                width: rem(28);
                height: rem(28);
                font-size: rem(24);
                text-align: center;
                line-height: rem(30);
                color: #fff;
                border-radius: 50%;
              }
            }
          }
          　::-webkit-input-placeholder {
            /* WebKit browsers */

            　　color: #999;
          }

          　　:-moz-placeholder {
            /* Mozilla Firefox 4 to 18 */

            　　color: #999;
          }

          　　::-moz-placeholder {
            /* Mozilla Firefox 19+ */

            　　color: #999;
          }

          　　:-ms-input-placeholder {
            /* Internet Explorer 10+ */

            　　color: #999;
          }
        }
      }
    }
  }
  .add {
    display: flex;
    flex-direction: column;
    height: auto;
    border: 0;
    .radio {
      border-bottom: rem(2) solid #eee;
      .van-cell-group {
        position: relative;

        .van-cell {
          line-height: rem(30);
          padding: rem(39) rem(32);

          .van-cell__value {
            .van-field__body {
              .van-field__control {
              }
              .van-field__right-icon {
                padding: 0 rem(30) 0 rem(16);
                .van-icon {
                  background: #fff;
                  width: rem(30);
                  height: rem(30);
                  font-size: rem(30);
                  text-align: center;
                  line-height: rem(30);
                  color: #999;
                  border-radius: 0;
                }
              }
            }
          }
        }
      }
    }
    .radio:nth-child(2) {
      // margin-top: rem(-2);
    }
  }
  .radio {
    // border-bottom: 1px solid #eee;
    .InvoiceType {
      border: 0;
      .van-cell__value {
        .van-cell {
          padding: rem(10) rem(1);
          .van-cell__value {
            .van-field__body {
              .van-field__control {
              }
            }
          }
        }
      }
    }
  }
}
.Toast {
  top: 20%;
}
</style>
