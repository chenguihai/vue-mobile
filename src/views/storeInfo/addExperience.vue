<template>
  <div class="container">
    <head-nav title="工作经历"></head-nav>
    <div class="company_name">
      <van-cell-group>
        <van-field v-model="form.company_name" label="公司名称" placeholder="请输入公司名称"
                   input-align="right" @input="verificationForm"/>
        <van-cell :value-class="{cell_item:formShow.naturesName}" title="公司性质" is-link
                  :value="formShow.naturesName ||'请选择'" @click="showPopup('natures')"/>
        <van-cell :value-class="{cell_item:formShow.saclesName}" title="公司规模" is-link
                  :value="formShow.saclesName ||'请选择'"
                  @click="showPopup('scales')"/>
        <van-field v-model="form.department" label="工作部门" placeholder="请输入工作部门" input-align="right"
                   @input="verificationForm"/>
        <van-field v-model="form.position" label="工作职位" placeholder="请输入工作职位"
                   input-align="right" @input="verificationForm"/>
        <van-cell :value-class="{cell_item:form.begin_time}" title="开始时间" is-link
                  :value="form.begin_time ||'请选择'"
                  @click="showTimePopup('begin')"/>
        <van-cell :value-class="{cell_item:form.end_time}" title="结束时间" is-link
                  :value="form.end_time ||'请选择'"
                  @click="showTimePopup('end')"/>
        <!--
        <div class="desc_wrap">
          <van-field class="company_desc"
                     v-model="form.work_desc"
                     autosize
                     rows="3"
                     type="textarea" border
                     placeholder="请简单描述您的工作内容"
                     @input="verificationForm"
          />
        </div>
        -->
        <fixed-btn name="添加" :disabled="!isDisabled" :fixed="1" @submit="onSubmit"></fixed-btn>
      </van-cell-group>
    </div>
    <popup-picker v-if="pickerFlag" :list="columns" @submit="emitSubmit" @close="emitClose"></popup-picker>
    <!--开始时间-->
    <datetime-picker v-if="timeFlag" type="max" @submit="emitTimePopup" :date="currentDate"
                     @close="emitClose"></datetime-picker>
  </div>
</template>

<script>
  import PopupPicker from '@/components/common/PopupPicker'
  import FixedBtn from "@/components/common/FixedBtn";
  import DatetimePicker from "@/components/common/DatetimePicker";
  import {experienceGetInfo, experienceAdd, experienceEdit} from '@/api/storeInfo'
  import {commonRegs, commonToastRegs} from '@/utils/tool'

  const errMsgList = new Map([
    ['company_name', ['请输入公司名称']],
    ['nature_id', ['请选择公司性质']],
    ['scale_id', ['请选择公司规模']],
    ['department', ['请选择所在部门']],
    ['position', ['请输入公司职务']],
    ['begin_time', ['请选择开始时间']],
    ['end_time', ['请选择结束时间']],
    // ['work_desc', ['请输入工作经历简介']],
  ])
  export default {
    name: "addExperience",
    components: {FixedBtn, DatetimePicker, PopupPicker},
    data() {
      return {
        pickerFlag: false,
        timeFlag: false,
        fileList: [],
        formShow: {
          naturesName: '',
          saclesName: '',
        },
        form: {
          company_name: '',//	是	string	公司名称
          nature_id: '',//是	int	公司性质id
          scale_id: '',//	是	int	公司规模id
          department: '',//	是	string	所在部门
          position: '',//是	string	公司职务
          begin_time: '',//	是	date	开始时间
          end_time: '',//	是	date	结束时间
          // work_desc: '',//	是	string	工作经历简介
        },
        formRules: [
          'company_name',
          'nature_id',
          'scale_id',
          'department',
          'position',
          'begin_time',
          'end_time',
          // 'work_desc',
        ],
        columns: [],
        currentDate: '',
        naturesList: [],
        scalesList: [],
        selectId: 0,
        isDisabled: false
      }
    },
    created() {
      let scales = localStorage.getItem('scalesList');
      let natures = localStorage.getItem('naturesList');
      if(scales){
        this.scalesList = JSON.parse(scales);
      }
      if(natures){
        this.naturesList = JSON.parse(natures);
      }
    },
    mounted() {
      const {id = ''} = this.$route.query;
      this.selectId = id;
      id && this.getInfo();
    },
    methods: {
      verificationForm() {
        this.isDisabled = commonRegs(this.formRules, this.form);
      },
      onSubmit() {
        this.isDisabled = commonToastRegs(this.formRules, this.form, errMsgList, this);
        if (!this.isDisabled) return;
        const {begin_time, end_time} = this.form;
        let begin = new Date(begin_time).getTime();
        let end = new Date(end_time).getTime();
        if (begin >= end) {
          this.$toast('开始时间不能大于结束时间');
          return;
        }
        this.selectId ? this.editExperience() : this.addExperience();
      },
      showPopup(type) {
        let data = [];
        if (type === 'natures') {
          data = this.naturesList.map(item => item.nature_name);
        } else if (type === 'scales') {
          data = this.scalesList.map(item => item.scale_name);
        }
        this.pickerFlag = true;
        this.selecetType = type;
        this.columns = data;
      },
      showTimePopup(type) {
        const {begin_time, end_time} = this.form;
        this.currentDate = type === 'begin' ? begin_time : end_time;
        this.timeFlag = true;
        this.selecetType = type;
      },
      emitSubmit(value) {
        let type = this.selecetType;
        if (type === 'natures') {
          let [data = {}] = this.naturesList.filter(item => item.nature_name === value);
          this.form.nature_id = data.id || '';
          this.formShow.naturesName = data.nature_name || '';
        } else if (type === 'scales') {
          let [data = {}] = this.scalesList.filter(item => item.scale_name === value);
          this.form.scale_id = data.id || '';
          this.formShow.saclesName = data.scale_name || '';
        }
        this.emitClose();
        this.isDisabled = commonRegs(this.formRules, this.form);
      },
      emitTimePopup(value) {
        let type = this.selecetType;
        if (type === 'begin') {
          this.form.begin_time = value
        } else if (type === 'end') {
          this.form.end_time = value
        }
        this.emitClose();
        this.isDisabled = commonRegs(this.formRules, this.form);
      },
      emitClose() {
        this.pickerFlag = false;
        this.timeFlag = false;
      },
      async addExperience() {
        const data = await experienceAdd(this.form);
        if (!data) return
        this.$router.push({path: '/workExperience'})
      },
      async editExperience() {
        const data = await experienceEdit(this.selectId, this.form);
        if (!data) return
        this.$router.push({path: '/workExperience'})
      },
      async getInfo() {
        const data = await experienceGetInfo(this.selectId);
        if (!data) return
        const [naturesItem = {}] = this.naturesList.filter(item => item.id === data.nature_id);
        const [scalesItem = {}] = this.scalesList.filter(item => item.id === data.scale_id);
        this.formShow = {
          naturesName: naturesItem.nature_name,
          saclesName: scalesItem.scale_name,
        };
        this.form = {
          company_name: data.company_name,//	是	string	公司名称
          scale_id: data.scale_id,//	是	int	公司规模id
          nature_id: data.nature_id,//是	int	公司性质id
          department: data.department,//	是	string	所在部门
          position: data.position,//是	string	公司职务
          begin_time: this.timeFilter(data.begin_time),//	是	date	开始时间
          end_time: this.timeFilter(data.end_time),//	是	date	结束时间
          // work_desc: data.work_desc,//	是	string	工作经历简介
        };
      },
      timeFilter(val = '') {
        return val.split(' ')[0];
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../css/auth";
</style>
