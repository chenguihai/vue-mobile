<template>
  <div class="container bg">
    <head-nav title="完善店铺资料"></head-nav>
    <div class="company_name">
      <van-cell-group>
        <van-cell
          :value-class="{cell_item:formShow.typeName}"
          title="店铺类型"
          is-link
          :value="formShow.typeName"
          :disabled="storeType"
          @click="showPopup('type')"
        />
        <template v-if="form.type_id === 1">
          <van-field
            v-model="form.store_name"
            label="店铺名称"
            placeholder="请输入店铺名称"
            input-align="right"
            @input="verificationForm"
          />
          <van-cell
            :value-class="{cell_item:formShow.areaName}"
            title="联系地址"
            is-link
            :value="formShow.areaName ||'请选择'"
            @click="showPopup('area')"
          />
          <van-field
            v-model="form.address"
            label="详细地址"
            placeholder="请输入详细地址"
            input-align="right"
            @input="verificationForm"
          />
          <van-field
            label-width="110px"
            v-model="form.contacts_name"
            label="姓名"
            placeholder="请输入常用联系人姓名"
            input-align="right"
            @input="verificationForm"
          />
          <van-field
            label-width="110px"
            v-model="form.phone"
            label="联系电话"
            placeholder="请输入常用联系人电话"
            input-align="right"
            @input="verificationForm"
          />
          <van-field
            label-width="110px"
            v-model="form.email"
            label="邮箱"
            placeholder="请输入常用联系人邮箱"
            input-align="right"
            @input="verificationForm"
          />
        </template>
        <!--公司-->
        <template v-else>
          <van-field
            v-model="form.store_name"
            label="店铺名称"
            placeholder="请输入店铺名称"
            input-align="right"
            @input="verificationForm"
          />
          <van-field
            v-model="formCompany.company_name"
            label="企业名称"
            placeholder="请输入企业名称"
            input-align="right"
            @input="verificationCompanyForm"
          />
          <van-cell
            :value-class="{cell_item:formShow.naturesName}"
            title="企业类型"
            is-link
            :value="formShow.naturesName ||'请选择'"
            @click="showPopup('natures')"
          />
          <van-cell
            :value-class="{cell_item:formShow.saclesName}"
            title="企业规模"
            is-link
            :value="formShow.saclesName ||'请选择'"
            @click="showPopup('scales')"
          />
          <van-cell
            :value-class="{cell_item:formShow.areaName}"
            title="当前所在地"
            is-link
            :value="formShow.areaName ||'请选择'"
            @click="showPopup('area')"
          />
          <van-field
            v-model="form.address"
            label="详细地址"
            placeholder="请输入详细地址"
            input-align="right"
            @input="verificationForm"
          />
          <van-field
            label-width="110px"
            v-model="form.contacts_name"
            label="常用联系人姓名"
            placeholder="请输入常用联系人姓名"
            input-align="right"
            @input="verificationForm"
          />
          <van-field
            label-width="110px"
            v-model="form.phone"
            label="常用联系人电话"
            placeholder="请输入常用联系人电话"
            input-align="right"
            @input="verificationForm"
          />
          <van-field
            label-width="110px"
            v-model="form.email"
            label="常用联系人邮箱"
            placeholder="请输入常用联系人邮箱"
            input-align="right"
            @input="verificationForm"
          />
        </template>
        <div class="desc_wrap">
          <van-field
            class="company_desc"
            v-model="form.about_us"
            autosize
            rows="3"
            type="textarea"
            border
            placeholder="请简单介绍下您自己"
            @input="verificationForm"
          />
        </div>
        <fixed-btn name="保存" :disabled="!isDisabled" :fixed="2" @submit="onSubmit"></fixed-btn>
      </van-cell-group>
      <ul class="jump_wrap active">
        <a :href="'/workExperience'" tag="li" v-if="form.type_id === 1" class="item">
          <span>工作经历</span>
          <img class="arrow" src="@/assets/auth/arrow_right_gray.png" alt />
        </a>
        <a :href="'/certificate'" tag="li" class="item">
          <span>自传资质</span>
          <img class="arrow" src="@/assets/auth/arrow_right_gray.png" alt />
        </a>
        <a :href="'/mediaQualify'" tag="li" class="item">
          <span>媒介资质</span>
          <img class="arrow" src="@/assets/auth/arrow_right_gray.png" alt />
        </a>
        <a :href="'/belongCompany'" tag="li" v-if="form.type_id === 1" class="item">
          <span>隶属媒体公司</span>
          <img class="arrow" src="@/assets/auth/arrow_right_gray.png" alt />
        </a>
      </ul>
    </div>
    <popup-picker v-if="pickerFlag" :list="columns" @submit="emitSubmit" @close="emitClose"></popup-picker>
    <!--选择省市区-->
    <van-popup class="bounced" v-model="areaFlag" position="bottom">
      <van-area
        class="selected"
        :area-list="areaList"
        :columns-placeholder="['请选择', '请选择', '请选择']"
        @cancel="emitClose"
        @confirm="onConfirmArea"
      />
    </van-popup>
  </div>
</template>

<script>
import PopupPicker from "@/components/common/PopupPicker";
import FixedBtn from "@/components/common/FixedBtn";
import { getAddressCommon } from "@/utils/tool";
import area from "@/assets/js/area";
import {
  getShopInfo,
  shopScales,
  shopNatures,
  shopAdd,
  shopEdit
} from "@/api/storeInfo";
import { commonRegs, commonToastRegs } from "@/utils/tool";

const errMsgList = new Map([
  ["store_name", ["请输入店铺名称"]],
  ["company_name", ["请输入企业名称"]],
  ["scale_id", ["请选择企业规模"]],
  ["company_type_id", ["请选择企业性质"]],
  ["district", ["请输入当前所在地"]],
  ["address", ["请输入详细地址"]],
  ["contacts_name", ["请输入姓名"]],
  ["phone", ["请输入电话", "", "手机号码格式不对"]],
  ["email", ["请输入邮箱"]],
  ["about_us", ["请输入自我介绍"]]
]);
export default {
  name: "storeInfoPerson",
  components: { PopupPicker, FixedBtn },
  data() {
    return {
      areaList: JSON.parse(JSON.stringify(area)),
      pickerFlag: false,
      areaFlag: false,
      columns: [],
      storeInfo: {},
      selecetType: "",
      formShow: {
        typeName: "个人",
        areaName: "",
        naturesName: "",
        saclesName: ""
      },
      form: {
        type_id: 1, //	是	int	类型(个人1/企业2)

        store_name: "", //	是	string	店铺名称
        province: "", //	是	int	选择省份id
        city: "", //	是	int	选择城市id
        district: "", //	是	int	选择区域id
        address: "", //	是	string	具体详细地址

        contacts_name: "", //	是	string	联系人姓名
        phone: "", //	是	string	联系人电话
        email: "", //	是	string	邮箱
        about_us: "" //	是	string	关于我们
        // country: '100000',//	是	int	选择国家id
      },
      formCompany: {
        company_name: "", //	是	string	企业名称
        scale_id: "", //	是	int	企业规模id
        company_type_id: "" //	是	int	企业性质id
      },
      formRules: [
        "store_name",
        "district",
        "address",
        "contacts_name",
        {
          name: "phone",
          test: /^((13[0-9]|14[1|5-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8})$/
        },
        "email",
        "about_us"
      ],
      formCompanyRules: ["company_name", "scale_id", "company_type_id"],
      scalesList: [],
      naturesList: [],
      isDisabled: false,
      storeType: false
    };
  },
  created() {
    this.getNatures();
    this.getScales();
    this.getShopInfoHttp();
  },
  methods: {
    verificationForm() {
      this.isDisabled = commonRegs(this.formRules, this.form);
    },
    verificationCompanyForm() {
      this.isDisabled = commonRegs(this.formCompanyRules, this.formCompany);
    },
    onSubmit() {
      if (this.form.type_id === 2) {
        this.isDisabled = commonToastRegs(
          this.formCompanyRules,
          this.formCompany,
          errMsgList,
          this
        );
        if (!this.isDisabled) return;
      } else {
        if (/公司|旗舰/.test(this.form.store_name)) {
          this.$toast("个人店铺名称不能包含公司，旗舰等字");
          this.isDisabled = false;
          return;
        }
      }
      this.isDisabled = commonToastRegs(
        this.formRules,
        this.form,
        errMsgList,
        this
      );
      if (!this.isDisabled) return;
      if (this.storeInfo.isStore !== 0) {
        this.editShop();
        return;
      }
      this.addShop();
    },
    showPopup(type) {
      let data = [];
      if (type === "area") {
        this.areaFlag = true;
        if (this.storeInfo.store_name) {
          //province: 110000,city: 110100,district: 110106
          const { province, city, district } = this.storeInfo;
          let provinceList = {},
            cityList = {},
            countyList = {};
          const { province_list, city_list, county_list } = this.areaList;
          provinceList = {
            [province]: province_list[province]
          };
          cityList = {
            [city]: city_list[city]
          };
          let str = `${district}`.substr(0, 2);
          let reg = new RegExp("^" + str);
          for (let key in county_list) {
            if (reg.test(key)) {
              countyList[key] = county_list[key];
            }
          }
          // countyList = {
          //   [district]:  county_list[district]
          // };
          this.areaList = {
            province_list: provinceList,
            city_list: cityList,
            county_list: countyList
          };
        }
        // return;
      }
      if (type === "type") {
        if (this.storeInfo && this.storeInfo.isStore !== 0) {
          return;
        } else if (this.storeType) {
          return;
        }
        data = ["个人", "企业"];
      } else if (type === "natures") {
        data = this.naturesList.map(item => item.nature_name);
      } else if (type === "scales") {
        data = this.scalesList.map(item => item.scale_name);
      }
      this.pickerFlag = true;
      this.selecetType = type;
      this.columns = data;
    },
    onConfirmArea(val) {
      const [province = {}, city = {}, district = {}] = val;
      if (!district.name) return;
      this.formShow.areaName = `${province.name}/${
        province.name === city.name ? "" : city.name + "/"
      }${district.name}`;
      this.form.province = province.code;
      this.form.city = city.code;
      this.form.district = district.code;
      this.emitClose();
      // this.isDisabled = this.commonRegs(this.formRules, this.form);
      this.verificationForm();
    },
    emitSubmit(value) {
      let type = this.selecetType;
      if (type === "type") {
        this.formShow.typeName = value;
        this.form.type_id = value === "个人" ? 1 : 2;
        // this.isDisabled = this.commonRegs(this.formRules, this.form);
        this.verificationForm();
      } else if (type === "natures") {
        let [data = {}] = this.naturesList.filter(
          item => item.nature_name === value
        );
        this.formCompany.company_type_id = data.id || "";
        this.formShow.naturesName = data.nature_name || "";
        this.verificationCompanyForm();
      } else if (type === "scales") {
        let [data = {}] = this.scalesList.filter(
          item => item.scale_name === value
        );
        this.formCompany.scale_id = data.id || "";
        this.formShow.saclesName = data.scale_name || "";
        this.verificationCompanyForm();
      }
      this.emitClose();
    },
    emitClose() {
      this.pickerFlag = false;
      this.areaFlag = false;
    },
    async getShopInfoHttp() {
      const data = await getShopInfo();
      console.log("getShopInfo", data);
      if (!data) return;
      if (data.isStore !== 0) {
        this.storeType = true;
      }
      if (data.type) {
        this.form.type_id = data.type;
        this.formShow.typeName = data.type === 2 ? "企业" : "个人";
      } else {
        this.form = {
          type_id: data.type_id || 1, //	是	int	类型(个人1/企业2)
          store_name: data.store_name, //	是	string	店铺名称
          contacts_name: data.contacts_name, //	是	string	联系人姓名
          email: data.email, //	是	string	邮箱
          phone: data.phone, //	是	string	联系人电话
          about_us: data.about_us, //	是	string	关于我们
          country: data.country, //	是	int	选择国家id
          province: data.province, //	是	int	选择省份id
          city: data.city, //	是	int	选择城市id
          district: data.district, //	是	int	选择区域id
          address: data.address //	是	string	具体详细地址
        };
        this.formCompany = {
          company_name: data.company_name, //	是	string	企业名称
          scale_id: data.scale_id, //	是	int	企业规模id
          company_type_id: data.company_type_id //	是	int	企业性质id
        };
        const [naturesItem = {}] = this.naturesList.filter(
          item => item.id === data.company_type_id
        );
        const [scalesItem = {}] = this.scalesList.filter(
          item => item.id === data.scale_id
        );

        this.formShow = {
          naturesName: naturesItem.nature_name,
          saclesName: scalesItem.scale_name,
          typeName: data.type_id === 2 ? "企业" : "个人",
          areaName: getAddressCommon(data.province, data.city, data.district)
        };
      }
      this.storeInfo = data;
      this.verificationForm();
      if (this.form.type_id === 2) {
        this.verificationCompanyForm();
      }
    },
    async getScales() {
      const data = await shopScales();
      if (!data) return;
      this.scalesList = data;
    },
    async getNatures() {
      const data = await shopNatures();
      if (!data) return;
      this.naturesList = data;
    },
    async addShop() {
      let params = { ...this.form, ...this.formCompany };
      const data = await shopAdd(params);
      if (!data) {
        this.$toast("提交失败，请重新提交");
      } else {
        if (data.code === 422) {
          this.$toast(data.message);
          return;
        }
        this.getShopInfoHttp();
        this.$toast("保存成功");
      }
    },
    async editShop() {
      let params = { ...this.form, ...this.formCompany };
      const data = await shopEdit(params);
      if (!data) {
        this.$toast("提交失败，请重新提交");
      } else {
        if (data.code === 422) {
          this.$toast(data.message);
          return;
        }
        this.getShopInfoHttp();
        this.$toast("保存成功");
      }
    }
  }
};
</script>


<style scoped lang="scss">
@import "../../css/auth";

.jump_wrap {
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 30px;
    height: 88px;
    padding: 0 $w_30;
    background: $white;
    margin: $w_20 0;

    .arrow {
      width: 12px;
      height: 22px;
    }
  }
}
</style>
