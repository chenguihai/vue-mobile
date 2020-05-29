<template>
  <div class="clues-wrap">
    <van-nav-bar title="发布线索需求" left-arrow @click-left="onClickLeft" />
    <!--div-- class="m-cell">
      <div class="m-label">类型 <span>*</span></div>
      <van-radio-group v-model="radio" class="m-radio-clues">
        <van-radio icon-size="16px" name="1" value="1">发布广告线索</van-radio>
        <van-radio icon-size="16px" disabled name="2" value="2">发布任务需求</van-radio>
      </van-radio-group>
    </!--div-->
    <div class="m-cell">
      <div class="m-label">
        标题
        <span>*</span>
      </div>
      <div class="m-input">
        <van-field v-model="eForm.title" placeholder="请用一句话概括您要做什么" />
      </div>
      <div class="m-insert-text" @click="showTemplatePop">插入模板</div>
    </div>
    <div class="m-cell">
      <div class="m-label">
        分类
        <span>*</span>
      </div>
      <div
        class="m-choice"
        @click="showCategoryPop"
      >{{selectShowListChildArr.length > 0 ? selectShowListChildArr : '请选择分类'}}</div>
    </div>
    <div class="m-textarea-box">
      <div id="toolbar" slot="toolbar">
        <button class="ql-bold" title="加粗">Bold</button>
        <select class="ql-header" title="段落格式">
          <option selected>正文</option>
          <option value="2">标题1</option>
          <option value="3">标题2</option>
          <option value="4">标题3</option>
        </select>
        <button class="ql-list" value="ordered" title="有序列表"></button>
        <button class="ql-list" value="bullet" title="无序列表"></button>
        <select class="ql-color" value="color" title="字体颜色"></select>
      </div>
      <quill-editor
        v-model="eForm.content"
        ref="myQuillEditor"
        :options="editorOption"
        @focus="onEditorFocus($event)"
        @blur="onEditorBlur($event)"
        @change="onEditorChange($event)"
      ></quill-editor>
      <div class="m-img-title">图片上传</div>
      <!--div-- class="com-up-box" :class="{_upload:fileLoading}">
        <div class="up-pre" v-for="(item, idx) in fileList" :key="idx" @click="viewImg(idx)">
          <van-icon class="del-icon" name="clear" size="0.346rem" color="#848484" @click.stop="beforeFileRemove(idx)" />
          <van-image class="preview-img" :src="item.url" :noOss="false" />
        </div>
        <van-loading v-if="fileLoading" class="pro" size="24px" vertical>拼命上传中...</van-loading>
        <van-uploader v-if="fileList.length < fileLimit" class="upload" :class="{fup:fileList.length === 0}" multiple :max-size="maxFileSize" :max-count="fileLimit - fileList.length" :preview-image="false" preview-size="1.6rem" :after-read="afterFile" :before-read="beforeRead" :oversize="moreSize">
          <div class="up-box">
            <img src="../../../static/images/clues/icon-photo.png" />
            <p>添加图片</p>
          </div>
        </van-uploader>
      </!--div-->
      <comUpload ref="comUpload" :max="5" v-model="fileLists" :multiples="false">
        <div slot="tips" class="need-tip">
          <p></p>
        </div>
      </comUpload>
    </div>
    <div class="m-cell m-margin-top10">
      <div class="m-label">
        联系人
        <span>*</span>
      </div>
      <div class="m-input">
        <van-field v-model="eForm.name" placeholder="请输入联系人姓名" />
      </div>
    </div>
    <div class="m-cell">
      <div class="m-label">
        手机号
        <span>*</span>
      </div>
      <div class="m-input-mobile">
        <van-field v-model="eForm.mobile" type="number" maxlength="11" placeholder="请输入手机号码" />
      </div>
      <div class="m-public-radio">
        <van-checkbox icon-size="16px" v-model="mobileStatus" @change="checkMobile">公开此手机号</van-checkbox>
      </div>
    </div>
    <div class="m-cell">
      <div class="m-label">
        验证码
        <span>*</span>
      </div>
      <div class="m-input">
        <van-field
          v-model="eForm.verification_code"
          type="number"
          maxlength="4"
          placeholder="请输入验证码"
        />
      </div>
      <div class="m-verification-code-btn" :disabled="ctrBtn" @click="getCodeHandle">{{text}}</div>
    </div>
    <div class="m-cell">
      <div class="m-label">微信</div>
      <div class="m-input">
        <van-field v-model="eForm.wechat" placeholder="请输入微信" />
      </div>
    </div>
    <div class="m-cell">
      <div class="m-label">QQ</div>
      <div class="m-input">
        <van-field v-model="eForm.qq" type="number" placeholder="请输入QQ" />
      </div>
    </div>
    <div class="m-cell">
      <div class="m-label">E-mail</div>
      <div class="m-input">
        <van-field v-model="eForm.email" maxlength="50" placeholder="请输入E-mail" />
      </div>
    </div>
    <van-cell class="m-choice-excharge" is-link @click="showExchangePop">
      选择交易模式
      <span class="red">*</span>
    </van-cell>
    <van-popup v-model="show">内容</van-popup>
    <div class="m-panel" v-if="service.length > 0">
      <h3 class="m-panel-title" style="font-weight:bold">请选择需要的服务</h3>
      <div class="m-panel-item" v-for="(item,index) in service" :key="index">
        <div class="m-checkbox-flex1">
          <van-checkbox
            shape="square"
            @change="choose"
            @click="checkedHand(item)"
            v-model="item.checked"
          >{{item.inc_name}}</van-checkbox>
          <!-- v-model="item.checked" -->
        </div>
        <div class="m-flex-txt">{{item.description}}</div>
        <div class="m-flex-price">¥{{item.price}}</div>
        <div class="m-flex-bottom" @click="showPickerLevel" v-if="item.id==6">
          <div class="m-city-box">选择等级</div>
          <div class="m-choice-city">
            <div class="m-service-v" v-if="levelName!='未选择'">{{levelName}}</div>
            <span v-if="levelName=='未选择'">{{levelName}}</span>
          </div>
          <div class="m-arrow-right"></div>
        </div>
        <div class="m-flex-bottom" @click="showAdd" v-if="item.id==4">
          <div class="m-city-box">选择地域</div>
          <div class="m-choice-city">
            <span v-html="addInfor"></span>
          </div>
          <div class="m-arrow-right"></div>
        </div>
      </div>
    </div>
    <div class="m-all-choice">
      <van-checkbox @click="chooseAll" v-model="checkAll" shape="square">全选</van-checkbox>
    </div>
    <div class="m-panel">
      <div class="m-panel-title" style="font-weight:bold;border-bottom:1px dotted #eee">结算清单</div>
      <div class="m-vip-service-box" v-if="eForm.inc.length>0">
        <dl>
          <dt>附加服务</dt>
          <dd v-for="(item,index) in eForm.inc" :key="index">
            <span>{{item.inc_name}}</span>
            <span class="m-vip-price">¥{{item.price}}</span>
          </dd>
        </dl>
        <div class="m-amount-box">
          应付金额：
          <span class="red">¥{{priceTotal.toFixed(2)}}</span>
        </div>
      </div>
    </div>
    <div class="m-panel">
      <div class="m-submitform-box">
        <van-checkbox v-model="agree" shape="square">
          我已同意《
          <a href="javascript:void(0)" @click="agreementShow = true">线索发布协议</a>》
        </van-checkbox>
        <!--        <p><button @click="submitForm">发布线索</button></p>-->
      </div>
      <fixed-btn name="发布线索" :fixed="2" @submit="submitForm"></fixed-btn>
    </div>
    <!--    分类选择组件-->
    <CategoryChoice
      @choiceSon="choiceSon"
      @closeThis="closeCategory"
      :categoryData="list"
      v-if="showCategoryChoice"
    ></CategoryChoice>
    <CategorySon
      @save="saveCategory"
      @showChoiced="showCategoryChiocedPop"
      v-if="showSon"
      @close="closeSon"
      :index="index"
      :sonData="list"
    ></CategorySon>
    <CategoryChoicedPop
      :isDetail="false"
      @close="showChoiced=false"
      :index="index"
      :showList="selectShowList"
      v-if="showChoiced"
    ></CategoryChoicedPop>
    <TemplateChoice
      @choiceTemplate="choiceTemplate"
      @close="closeTemplate"
      :templateData="templateData"
      v-show="showTemplateChoice"
    ></TemplateChoice>
    <ExchangeTypeChoice
      :ServiceRealm="ServiceRealm"
      :ClueCustomerType="ClueCustomerType"
      @close="closeExchange"
      :templateData="categoryList"
      v-show="showExchangeChoice"
    ></ExchangeTypeChoice>
    <van-popup class="bounced" v-model="showa" position="bottom">
      <van-area
        class="selected"
        :area-list="areaList"
        :columns-num="2"
        @cancel="onCancelarea"
        @confirm="onConfirmarea"
      />
    </van-popup>
    <!--弹框选择-->
    <van-popup v-model="showPicker" position="bottom">
      <van-picker show-toolbar :columns="columns" @confirm="_handleSubmit" @cancel="_handleClose"></van-picker>
    </van-popup>
    <Agreement v-if="agreementShow" @close="closeAgreement"></Agreement>
  </div>
</template>
<script>
import { quillEditor } from "vue-quill-editor"; // 调用富文本编辑器
import FixedBtn from "@/components/common/FixedBtn";
import area from "@/assets/js/area";
import "quill/dist/quill.snow.css";
import { Toast } from "vant";
// import { uploadMixin } from '@/utils/mixins'
import comUpload from "@/components/service/comUpload";
import { regDaqo, checkEmptyValue } from "@/utils/tool";
import { ImagePreview } from "@/components/nvan";
import CategoryChoice from "@/components/clues/CategoryChoice";
import CategorySon from "@/components/clues/CategorySon";
import CategoryChoicedPop from "@/components/clues/CategoryChoicedPop";
import TemplateChoice from "@/components/clues/TemplateChoice";
import ExchangeTypeChoice from "@/components/clues/ExchangeTypeChoice";
import { cluesShow, changMobile, addReleaseData } from "@/api/clues";
import { smsLogin} from "@/api/account";
import PopupPicker from "@/components/common/PopupPicker";
import Agreement from "@/components/clues/Agreement";
const msgList = new Map([
  ["budget_money", ["请输入投放预算", "", "投放预算请输入大于100的数字"]],
  ["email", ["", "", "请输入正确的邮箱名"]],
  ["qq", ["", "", "请输入正确的QQ号"]],
  [
    "wechat",
    ["", "", "微信必须是6-20位字母、数字、下划线和减号,必须以字母开头"]
  ],
  ["name", ["请填写姓名", "", "请输入真实姓名"]]
]);
export default {
  name: "clues",
  // mixins: [uploadMixin()],
  data() {
    return {
      checkedArr: [],
      agreementShow: false,
      fileLists: [],
      addInfor: "请选择",
      areaList: area,
      mobileStatus: 1,
      service: [],
      radio: "1",
      show: false,
      showSon: false,
      showChoiced: false,
      agree: false,
      sonData: [],
      showCategoryChoice: false,
      showTemplateChoice: false,
      maxSize: "",
      editor: null,
      text: "获取验证码", // 按钮文字
      ctrBtn: false, // 控制按钮可点击
      oblig: {
        budget_money: "",
        email: "",
        name: ""
      },
      rules: [
        {
          name: "budget_money",
          test: regDaqo.budget_money
        },
        {
          name: "name",
          test: regDaqo.testName
        },
        {
          name: "email",
          custom(val) {
            if (val) {
              return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
                val
              );
            } else {
              return true;
            }
          }
        },
        {
          name: "qq",
          custom(val) {
            if (val) {
              return /^[1-9][0-9]{4,10}$/.test(val);
            } else {
              return true;
            }
          }
        },
        {
          name: "wechat",
          custom(val) {
            if (val) {
              return /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/.test(val);
            } else {
              return true;
            }
          }
        }
      ],
      editorOption: {
        //  富文本编辑器配置
        modules: {
          toolbar: "#toolbar"
        },
        theme: "snow",
        placeholder: "必填：详细的写下需求描述会更快找到专业人才哦(限1500字)"
      },
      list: [],
      map: {
        child: [],
        cate_name: ""
      },
      templateData: [],
      ServiceRealm: [],
      showPicker: false,
      columns: [],
      priceTotal: 0,
      levelName: "未选择",
      index: 1,
      categoryList: [],
      showExchangeChoice: false,
      publicFlag: "1",
      selectShowList: [],
      selectShowListPage: [],
      selectShowListChildArr: "",
      ClueCustomerType: [],
      checkAll: false,
      check: [],
      showa: false,
      prosDatasOtherFlag: true,
      selectFlag: true,
      levelArr: [],
      eForm: {
        category: {
          class: "",
          list: []
        },
        title: "",
        city: [],
        mobile_status: "N",
        content: "",
        mobile: "",
        name: "",
        wechat: "",
        email: "",
        qq: "",
        clue_start_time: "",
        clue_end_time: "",
        end_time: "",
        budget_money: "",
        type_id: "",
        verification_code: "",
        verification_key: "",
        field_id: "",
        inc: [],
        annex: []
      }
    };
  },
  components: {
    CategoryChoice,
    TemplateChoice,
    ExchangeTypeChoice,
    CategorySon,
    CategoryChoicedPop,
    PopupPicker,
    FixedBtn,
    comUpload,
    Agreement,
    quillEditor
  },
  methods: {
    closeAgreement() {
      this.agreementShow = false;
    },
    viewImg(idx) {
      ImagePreview({
        images: this.fileList.map(file =>
          file.url ? `${this.imgHost}/${file.url}` : file.content
        ),
        startPosition: idx
      });
    },
    _handleSubmit(e) {
      let idx = this.eForm.inc.findIndex(res => {
        return res.id == 6;
      });
      this.eForm.inc[idx].grade = e.id;
      this.levelName = e.text;
      this.showPicker = false;
    },
    _handleClose() {
      this.showPicker = false;
    },
    showPickerLevel() {
      if (this.selectFlag) return;
      this.showPicker = true;
    },
    // 地址选择
    showAdd() {
      if (this.prosDatasOtherFlag) return false;
      this.showa = true;
    },
    onCancelarea() {
      var _this = this;
      _this.showa = false;
    },
    onConfirmarea(val) {
      var _this = this;
      _this.showa = false;
      this.addInfor = val[0].name + "&nbsp;&nbsp;&nbsp;&nbsp;" + val[1].name;
      // this.province = val[0].code;
      // this.city = val[1].code;
      let idx = this.eForm.inc.findIndex(res => {
        return res.id == 4;
      });
      this.eForm.inc[idx].city_id = val[1].code;
    },
    chooseAll() {
      let e = !this.checkAll;
      this.service = this.service.map(res => {
        res.checked = e;
        return res;
      });
      this.handleCheckedCitiesChange();
    },
    choose(e) {
      if (e) {
        let a = true;
        this.service.forEach(res => {
          if (!res.checked) {
            a = false;
          }
        });
        this.checkAll = a;
      } else {
        this.checkAll = false;
      }
    },
    checkedHand(row) {
      this.service.map((item, i) => {
        if (row.id == item.id) {
          row.checked = !row.checked;
          this.service.item = row;
        }
      });
      this.handleCheckedCitiesChange();
    },
    handleCheckedCitiesChange() {
      let _this = this;
      let value = _this.service;
      _this.eForm.inc = [];
      let flagInc = value.find(incItem => {
        return incItem.id == 4 && incItem.checked == true;
      });
      let selectFlag = value.find(selectItem => {
        return selectItem.id == 6 && selectItem.checked == true;
      });
      if (flagInc) {
        _this.prosDatasOtherFlag = false;
      } else {
        _this.prosDatasOtherFlag = true;
        _this.addInfor = "请选择";
      }
      if (selectFlag) {
        _this.selectFlag = false;
      } else {
        _this.selectFlag = true;
        _this.levelName = "未选择";
      }
      _this.priceTotal = 0;
      value.forEach((res, index) => {
        if (res.checked == true) {
          let itemPrice = res.price - 0;
          _this.priceTotal = _this.priceTotal + itemPrice;
          _this.eForm.inc.push(res);
        }
      });
    },
    checkMobile(e) {
      if (e) {
        this.$toast("用户能通过购买线索查看到您的手机号码");
        this.eForm.mobile_status = "N";
      } else {
        this.$toast("您的手机号码将会被隐藏");
        this.eForm.mobile_status = "Y";
      }
    },
    choiceTemplate(data) {
      this.eForm.title = data.title;
      this.eForm.content = data.content;
      this.showTemplateChoice = false;
    },
    closeSon() {
      this.showSon = false;
    },
    choiceSon(index) {
      this.index = index;
      if (this.list[index].child) {
        this.showSon = true;
      }
    },
    saveCategory() {
      this.showCategoryChoice = false;
      this.showSon = false;
    },
    /** 处理按钮倒计时 **/
    countTime() {
      clearInterval(this.timer);
      let _times = 60;
      let _speed = 1000;
      let _t = this.text;
      this.timer = setInterval(() => {
        this.ctrBtn = true;
        _times--;
        this.text = `重新获取(${_times})`;
        if (_times <= 0) {
          this.text = "重新获取";
          this.ctrBtn = false;
          clearInterval(this.timer);
        }
      }, _speed);
    },
    async getCodeHandle() {
      if (this.ctrBtn) return;
      this.ctrBtn = true;
      let _this = this;
      let data = await smsLogin(_this.eForm.mobile );
      if (!data) {
        _this.ctrBtn = false;
        return false;
      }
      _this.eForm.verification_key = data.key;
      localStorage.setItem("verification_key", JSON.stringify(data.key));
      Toast("验证码已发送");
      _this.countTime();
    },
    async submitForm() {
      let _this = this;
      let thisForm = JSON.parse(JSON.stringify(_this.eForm));
      if (!thisForm.category.class) {
        Toast("请选择分类");
        return;
      }
      if (thisForm.title == "") {
        Toast("请填写标题");
        return;
      }
      if (thisForm.content == "") {
        Toast("请填写详情内容");
        return;
      }

      if (thisForm.content.length < 13 || thisForm.content.length > 1500) {
        Toast("详细内容应大于5个字，少于1500个字");
        return;
      }
      if (thisForm.title.length < 2 || thisForm.title.length > 30) {
        Toast("标题应为2-30个字");
        return;
      }

      if (thisForm.name.length < 2 || thisForm.name.length > 20) {
        Toast("姓名应大于2个字，少于20个字");
        return;
      }
      if (thisForm.mobile == "") {
        Toast("请填写手机号");
        return;
      }
      if (thisForm.wechat == "" && thisForm.qq == "" && thisForm.email == "") {
        Toast("微信,qq,email至少填写一项");
        return;
      }
      if (thisForm.qq.length > 0) {
        if (thisForm.qq.length < 6 || thisForm.qq.length > 15) {
          Toast("qq号码必须是6-15位的数字");
          return;
        }
      }
      if (thisForm.wechat.length > 0) {
        if (thisForm.wechat.length < 6 || thisForm.wechat.length > 20) {
          Toast("微信必须是6-20位");
          return;
        }
      }
      if (thisForm.verification_key == "") {
        Toast("请获取手机验证码");
        return;
      }
      if (thisForm.verification_code == "") {
        Toast("请输入手机验证码");
        return;
      }

      if (
        thisForm.clue_start_time == "" ||
        thisForm.clue_end_time == "" ||
        thisForm.end_time == "" ||
        thisForm.type_id == "" ||
        thisForm.budget_money == "" ||
        thisForm.field_id == "" ||
        thisForm.city.length == 0
      ) {
        Toast("请选择交易模式");
        return;
      }

      if (thisForm.inc.length == 0) {
        delete thisForm.inc;
      } else {
        let idx = this.eForm.inc.findIndex(res => {
          return res.id == 6;
        });
        if (idx > -1) {
          if (!thisForm.inc[idx].grade) {
            Toast("请选择服务商等级");
            return;
          }
        }
        let idx_city = this.eForm.inc.findIndex(res => {
          return res.id == 4;
        });
        if (idx_city > -1) {
          if (!thisForm.inc[idx_city].city_id) {
            Toast("请选择地域");
            return;
          }
        }
      }
      let annexArr = _this.fileLists;
      let imgArr = {};
      if (annexArr.length > 0) {
        annexArr.forEach((res, index) => {
          let keyName = "annex" + index;
          imgArr[keyName] = this.imgHost + res.url;
        });
        thisForm.annex = imgArr;
      }
      if (thisForm.wechat == "") {
        delete thisForm.wechat;
      }
      if (thisForm.qq == "") {
        delete thisForm.qq;
      }
      if (thisForm.email == "") {
        delete thisForm.email;
      }
      this.oblig.budget_money = this.eForm.budget_money;
      this.oblig.email = this.eForm.email;
      this.oblig.qq = this.eForm.qq;
      this.oblig.name = this.eForm.name;
      this.oblig.wechat = this.eForm.wechat;
      thisForm.end_time = thisForm.end_time + " 23:59:59";
      const unlock = this.rules.every(item =>
        checkEmptyValue(item, this.oblig, (type, name) => {
          this.$toast(msgList.get(name)[type]);
        })
      );
      if (!unlock) return;
      if (!_this.agree) {
        Toast("您还没有同意线索发布协议");
        return;
      }
      let addResponse = await addReleaseData({ ...thisForm });
      if (!addResponse) {
        localStorage.setItem("cluesPubInfo", JSON.stringify(this.eForm));
        localStorage.setItem(
          "selectShowListChildArr",
          JSON.stringify(this.selectShowListChildArr)
        );
        localStorage.setItem("fileLists", JSON.stringify(this.fileLists));
        return;
      } else {
        localStorage.removeItem("cluesPubInfo");
        localStorage.removeItem("selectShowListChildArr");
        localStorage.removeItem("fileLists");
      }
      if (!addResponse.order_sn) {
        Toast("线索发布成功");
        // this.$router.push(`/clues/detail/${addResponse}`);
         window.location.href = location.origin+"/clues/detail/"+addResponse;
      } else {
        this.$router.push(
          "/payment?order_sn=" + addResponse.order_sn + "&type=2"
        );
      }
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    showPopup() {
      this.show = true;
    },
    showCategoryPop() {
      this.showCategoryChoice = true;
    },
    showTemplatePop() {
      this.showTemplateChoice = true;
    },
    closeCategory() {
      this.showCategoryChoice = false;
    },
    closeExchange() {
      this.showExchangeChoice = false;
    },
    showExchangePop() {
      this.showExchangeChoice = true;
    },
    showCategoryChiocedPop() {
      this.showChoiced = true;
    },
    closeTemplate() {
      this.showTemplateChoice = false;
    },
    afterRead(file) {
      console.log(111, file);
    },
    onOversize() {
      this.$toast(`最大可上传图片为${this.maxSize}MB，请尝试压缩图片尺寸`);
    },
    async getShowData() {
      let showData = await cluesShow();
      if (!showData) return;
      this.list = showData.Category;
      this.templateData = showData.Template;
      this.ClueCustomerType = showData.ClueCustomerType;
      this.ServiceRealm = showData.ServiceRealm;
      let serviceData = showData.service.filter(item => item.is_show > 0);
      for (let i = 0; i < serviceData.length; i++) {
        serviceData[i].checked = false;
      }
      this.service = serviceData;

      this.levelArr = showData.level;
      this.levelArr.forEach(res => {
        this.columns.push({
          text: res.bl_name,
          id: res.id
        });
      });
    },
    onEditorReady(editor) {},
    onEditorBlur(editor) {},
    onEditorFocus(editor) {},
    onEditorChange(editor) {}
  },
  watch: {
    selectShowList(newArr, oldArr) {
      return newArr;
    },
    selectShowListPage(newArr, oldArr) {
      this.selectShowListChildArr = "";
      let outFlag = true;
      if (!newArr.child) return;
      if (newArr.child.length > 0) {
        newArr.child.forEach(res => {
          let flag = true;
          res.child.forEach(item => {
            if (item.selected === true) {
              if (outFlag) {
                this.selectShowListChildArr = newArr.cate_name + ">";
                outFlag = false;
              }
              if (flag) {
                this.selectShowListChildArr += res.cate_name;
                this.selectShowListChildArr += ">";
                flag = false;
              }
              this.selectShowListChildArr += item.cate_name;
              this.selectShowListChildArr += " 、";
            }
          });
        });
        this.showListFlag = true;
      } else {
        this.showListFlag = false;
      }
    }
  },
  computed: {
    imgHost() {
      return this.$store.state.ali_api_host;
    }
  },
  created() {
    let _this = this;
    _this.getShowData();
  },
  beforeDestroy() {
    this.editor = null;
    delete this.editor;
  },
  mounted() {
    this.editor = this.$refs.myQuillEditor.quill;
    let clueData = JSON.parse(localStorage.getItem("clueData"));
    if (clueData) {
      this.eForm.content = clueData[0].content;
      this.eForm.title = clueData[1].title;
      localStorage.removeItem("clueData");
    }
    if (localStorage.getItem("user_info")) {
      var userInfo = JSON.parse(localStorage.getItem("user_info"));
      this.eForm.mobile = userInfo.original.mobile;
    }
    if (localStorage.getItem("cluePhone")) {
      this.eForm.mobile = JSON.parse(localStorage.getItem("cluePhone"));
      localStorage.removeItem("cluePhone");
    }

    if (localStorage.getItem("selectShowListChildArr")) {
      this.selectShowListChildArr = JSON.parse(
        localStorage.getItem("selectShowListChildArr")
      );
    }
    if (localStorage.getItem("fileLists")) {
      this.fileLists = JSON.parse(localStorage.getItem("fileLists"));
    }
    if (localStorage.getItem("cluesPubInfo")) {
      this.eForm = JSON.parse(localStorage.getItem("cluesPubInfo"));
      this.agree = true;
      // this.submitForm();
    }
  }
};
</script>

<style scoped lang="scss">
.clues-wrap {
  font-size: rem(28);
  color: #333;
  /deep/ .van-nav-bar__title {
    font-size: rem(34);
    font-weight: bold;
  }
  .van-nav-bar__title {
    font-size: rem(34);
  }
  .m-margin-top10 {
    margin-top: 10px;
  }
  .m-choice-excharge {
    margin: rem(12) 0;
  }
  .m-label {
    width: 114px;
    span {
      color: $red;
    }
  }
  .m-cell {
    padding-left: rem(32);
    background: #fff;
    height: rem(97);
    line-height: rem(97);
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
    .van-radio {
      margin-right: rem(40);
      padding-left: rem(16);
    }
    .m-choice {
      color: $blue;
      padding-left: rem(16);
      height: rem(97);
      line-height: rem(97);
      width: rem(500);
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    /deep/ .van-cell {
      padding-left: rem(16) !important;
    }
    .m-input {
      width: 53%;//rem(400);
    }
    .m-input-mobile {
      width: 50%;//rem(320);
    }
    .m-insert-text {
      color: $blue;
    }
  }
  .m-img-title {
    color: #333;
    height: rem(60);
    line-height: rem(60);
    padding-top: 20px;
  }
  .m-textarea-box {
    background: #fff;
    margin: 0 auto;
    padding: rem(32) rem(32) rem(5);
    .quill-editor {
      height: rem(310);
      font-size: 38px !important;
    }
    .ql-editor.ql-blank::before{
     font-style: normal;
    color: #999;
    }
  }
  .m-upload-img-box {
  }
  .m-radio-clues {
    display: flex;
    font-size: rem(28);
  }
  .m-public-radio {
    font-size: rem(24);
  }
  .m-verification-code-btn {
    border-left: 1px solid #ccc;
    height: rem(30);
    line-height: rem(30);
    padding-left: rem(20);
    color: $red;
    white-space: nowrap;
  }
  .m-panel {
    background: #fff;
    .m-panel-title {
      padding: rem(28);
      color: #333;
      font-size: rem(28);
    }
    /deep/ .van-checkbox__label {
      font-weight: bold;
    }
    .m-panel-item {
      border-top: 1px solid #eee;
      display: flex;
      flex-wrap: wrap;
      padding: rem(28) 0 rem(28) rem(28);
      box-sizing: border-box;
      .m-checkbox-flex1 {
        width: 27%;//rem(188);
        font-size: rem(24);
      }
      .m-flex-txt {
        width: 53%;//rem(407);
        font-size: rem(24);
        color: #666;
        line-height: 0.5rem;
      }
      .m-flex-price {
        color: $red;
        font-size: rem(24);
        line-height: 0.5rem;
        margin-left: 0.1rem;
      }
      .m-flex-bottom {
        padding-top: rem(36);
        width: 100%;
        padding-left: rem(56);
        display: flex;
        font-size: rem(24);
        height: rem(40);
        line-height: rem(40);
        .m-city-box {
          width: rem(135);
          color: $blue;
        }
        .m-service-v {
          border: 1px solid $red;
          border-radius: rem(4);
          color: $red;
          text-align: center;
          width: rem(100);
          height: rem(40);
          line-height: rem(40);
        }
        .m-choice-city {
          color: #666;
          width:68%;//rem(460);
        }
        .m-arrow-right {
          width: rem(15);
          height: rem(15);
          border-top: 1px solid #999;
          border-right: 1px solid #999;
          transform: rotate(45deg);
          margin-top: 0.15rem;
        }
      }
    }
  }
  .m-all-choice {
    padding-top: rem(24);
    height: rem(60);
    background: #fff;
    font-size: rem(24);
    padding-left: rem(28);
    margin-bottom: rem(4);
  }
  .m-vip-service-box {
    padding: rem(16) rem(28);
    font-size: rem(24);
    border-bottom: 1px solid #eee;
    box-sizing: border-box;
    dt {
      padding-bottom: rem(17);
    }
    dd {
      width: 90%;//rem(620);
      margin: 0 auto;
      height: rem(55);
      line-height: rem(55);
      padding: 0 rem(35);
      display: flex;
      justify-content: space-between;
      background: rgba(208, 2, 27, 0.04);
      margin-bottom: rem(12);
      .m-vip-price {
        color: $red;
      }
    }
    .m-amount-box {
      font-size: rem(28);
      padding-top: rem(21);
      padding-bottom: rem(27);
    }
  }
  .m-submitform-box {
    padding: rem(24) rem(28);
    font-size: rem(24);
    button {
      width: rem(200);
      font-size: rem(28);
      height: rem(62);
      text-align: center;
      background: $red;
      line-height: rem(62);
      color: #fff;
      margin-top: rem(12);
    }
    a {
      color: #06c !important;
    }
  }
}
.com-up-box {
  @include flex(flex-start);
}
.up-box {
  @include square(120);
  @include flex(center);
  @include borderBox;
  flex-direction: column;
  border: 1px solid #ccc;
  p {
    font-size: 22px;
    font-family: $font;
    font-weight: 400;
    color: #adadad;
    margin-top: 6px;
  }
  .up-icon {
    width: 49px;
    height: 44px;
  }
}
.need-tip {
  margin-top: 20px;
  font-size: 20px;
  font-family: $font;
  font-weight: 400;
  line-height: 28px;
  margin-bottom: 30px;
  color: #999;
}
.upload {
  margin-left: 22px;
  &.fup {
    margin-left: 0;
  }
}
._upload {
  position: relative;
  overflow: hidden;
  .pro {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.8);
    margin: auto;
    z-index: 10;
    width: 100%;
    @include flex(center);
  }
}
.up-box {
  @include square(120);
  @include flex(center);
  @include borderBox;
  flex-direction: column;
  border: 1px solid #ccc;
  img {
    width: rem(49);
    height: rem(44);
  }
  p {
    font-size: 22px;
    font-family: $font;
    font-weight: 400;
    color: #adadad;
  }
  .up-pre {
    @include square(120);
    margin-left: 22px;
    position: relative;
    &:first-child {
      margin-left: 0;
    }
    .preview-img {
      width: 100%;
      height: 100%;
    }
    .del-icon {
      position: absolute;
      top: -13px;
      right: -13px;
      z-index: 2;
    }
  }
}
/deep/ .van-picker__confirm,
/deep/ .van-picker__cancel {
  font-size: 16px;
}
/deep/ .ql-container {
  font-size: 28px !important;
}
</style>
