<template>
  <div class="container">
    <head-nav title="媒介资质"></head-nav>
    <div class="company_name">
      <van-cell-group>
        <van-cell :value-class="{cell_item:formShow.typeName}" title="资质类型" is-link :value="formShow.typeName ||'请选择'"
                  @click="showPopup('type')"/>
        <template v-if="form.type_id !== 0">
          <van-cell :value-class="{cell_item:form.begin_time}" title="代理开始时间" is-link :value="form.begin_time ||'请选择'"
                    @click="showPopup('begin')"/>
          <van-cell :value-class="{cell_item:form.end_time}" title="代理结束时间" is-link :value="form.end_time ||'请选择'"
                    @click="showPopup('end')"/>

        </template>
        <div class="upload_wrap">
          <h4 class="title">附件图片</h4>
          <comUpload ref="comUpload" :max="3" v-model="fileLists">
            <div slot="tips" class="need-tip">
              <!--              <p>上传图片比例最佳为5:3</p>-->
            </div>
          </comUpload>
        </div>
      </van-cell-group>
    </div>
    <fixed-btn name="保存" :fixed="1" :disabled="!isDisabled" @submit="emitSubmit"></fixed-btn>
    <!--弹框选择-->
    <popup-picker v-if="pickerFlag" :list="columns" @submit="emitPopup" @close="emitClose"></popup-picker>
    <!--开始时间-->
    <datetime-picker v-if="timeFlag" @submit="emitTimePopup" :date="currentDate" @close="emitClose"></datetime-picker>
  </div>
</template>

<script>
  import PopupPicker from '@/components/common/PopupPicker'
  import FixedBtn from "@/components/common/FixedBtn";
  import DatetimePicker from "@/components/common/DatetimePicker";
  import {mediaAdd, getInfoById, mediaEdit} from '@/api/storeInfo'
  import comUpload from "@/components/service/comUpload";
  import {commonRegs, commonToastRegs} from '@/utils/tool'

  const errMsgList = new Map([
    ['type_id', ['请选择媒介资质类型']],
    ['begin_time', ['请选择开始时间']],
    ['end_time', ['请选择结束时间']],
    ['img1', ['请上传附件图片']],
  ])
  export default {
    name: "addMedia",
    components: {PopupPicker, FixedBtn, DatetimePicker, comUpload},
    data() {
      return {
        pickerFlag: false,
        timeFlag: false,
        form: {
          type_id: '',//是	int	媒介资质类型 0：直营媒体 1：一级代理 2：二级代理 3：其他
          begin_time: '',//	否	date	开始时间"2019-11-27"
          end_time: '',//	否	date	结束时间"2019-11-27"
          img1: '',//	是	string	图片1路径
          img2: '',//	否	string	图片2路径
          img3: '',//	否	string	图片3路径
        },
        formShow: {
          typeName: ''
        },
        formRules: [],
        areaFlag: false,
        searchResult: [],
        columns: ['直营媒体', '一级代理', '二级代理', '其他'],
        fileLists: [],
        currentDate: '',
        selecetType: '',
        selectId: 0,
        isDisabled: false,
        imgUrl: '?x-oss-process=image/resize,m_fill,h_120,w_120'
      }
    },
    created() {
      const {id = ''} = this.$route.query;
      if (id) {
        this.selectId = id;
        this.getInfo();
      }
    },
    methods: {
      showPopup(type) {
        if (type === 'type') {
          this.pickerFlag = true;
        } else if (type === 'begin' || type === 'end') {
          this.timeFlag = true;
          this.currentDate = type === 'begin' ? this.form.begin_time : this.form.end_time;
        }
        this.selecetType = type;
      },
      emitSubmit() {
        // const [img1 = {}, img2 = {}, img3 = {}] = this.fileLists;
        // this.form.img1 = img1.url || '';
        // this.form.img2 = img2.url || '';
        // this.form.img3 = img3.url || '';
        // this.formRules = this.form.type_id === 0 ? ['type_id', 'img1'] : ['type_id', 'begin_time', 'end_time', 'img1'];
        // const unlock = this.formRules.every(item => checkEmptyValue(item, this.form, (type, name) => this.$toast(errMsgList.get(name)[type])))
        this.isDisabled = commonToastRegs(this.formRules, this.form, errMsgList, this);
        if (!this.isDisabled) return
        this.selectId ? this.edit() : this.add();
      },
      async add() {
        const data = await mediaAdd(this.form);
        if (!data) return
        this.$toast('添加成功，请耐心等待管理员审核');
        this.$router.push({path: '/mediaQualify'})
        // this.naturesList = data;
      },
      async edit() {
        let param = this.handleImg();
        const data = await mediaEdit(this.selectId, param);
        if (!data) return
        this.$toast('添加成功，请耐心等待管理员审核');
        this.$router.push({path: '/mediaQualify'})
      },
      handleImg() {
        let data = JSON.parse(JSON.stringify(this.form));
        for (let key in data) {
          console.log(key, data[key])
          if (data[key] && (data[key]+'').indexOf('?') >= 0) {
            data[key] = data[key].split('?')[0];
          }
        }
        return data;
      },
      async getInfo() {
        const data = await getInfoById(this.selectId);
        if (!data) return
        this.form = {
          type_id: data.type_id,//是	int	媒介资质类型 0：直营媒体 1：一级代理 2：二级代理 3：其他
          begin_time: data.type_id ? data.begin_time.split(' ')[0] : '',//	否	date	开始时间"2019-11-27"
          end_time: data.type_id ? data.end_time.split(' ')[0] : '',//	否	date	结束时间"2019-11-27"
          img1: data.img1,//	是	string	图片1路径
          img2: data.img2 || '',//	否	string	图片2路径
          img3: data.img3 || '',//	否	string	图片3路径
        };
        this.formShow = {
          typeName: this.columns[data.type_id]
        };
        this.fileLists = [data.img1, data.img2, data.img3].filter(item => item).map(item => {
          return {url: item + this.imgUrl}
        });
      },
      emitPopup(value) {
        this.formShow.typeName = value;
        for (let i = 0; i < this.columns.length; i++) {
          if (this.columns[i] === value) {
            this.form.type_id = i;
            break;
          }
        }
        this.emitClose();
        this.isDisabled = commonRegs(this.formRules, this.form);
      },
      emitTimePopup(value) {
        if (this.selecetType === 'begin') {
          this.form.begin_time = value
        } else if (this.selecetType === 'end') {
          this.form.end_time = value
        }
        this.emitClose();
        this.isDisabled = commonRegs(this.formRules, this.form);
      },
      emitClose() {
        this.pickerFlag = false;
        this.timeFlag = false;
      }
    },
    watch: {
      fileLists(val) {
        const [img1 = {}, img2 = {}, img3 = {}] = this.fileLists;
        this.form.img1 = img1.url || '';
        this.form.img2 = img2.url || '';
        this.form.img3 = img3.url || '';
        this.isDisabled = commonRegs(this.formRules, this.form);
      },
      'form.type_id'(val) {
        console.log('form.type_id=============')
        this.formRules = this.form.type_id === 0 ? ['type_id', 'img1'] : ['type_id', 'begin_time', 'end_time', 'img1'];
        this.isDisabled = commonRegs(this.formRules, this.form);
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../css/auth";
</style>

