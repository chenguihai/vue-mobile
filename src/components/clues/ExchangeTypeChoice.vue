<template>
  <div class="m-exchange-choice-pop">
    <van-nav-bar
      title="选择交易模式"
      left-arrow
      @click-left="onClickLeft"
    />
    <!--van-field
      is-link
      readonly
      clickable
      label="选择交易模式"
      :value="value"
      placeholder="请选择交易模式"
      @click="showPicker = true"
    /-->
    <div class="m-other">
      <van-field
        is-link
        readonly
        clickable
        label="投放起始时间"
        :value="startDateFormat"
        placeholder="请选择起始日期"
        @click="showStartDatePicker = true"
      />
      <van-field
        is-link
        readonly
        clickable
        label="投放截止时间"
        :value="endDateFormat"
        placeholder="请选择截止日期"
        @click="showEndDatePicker = true"
      />
      <van-field
        is-link
        readonly
        clickable
        label="客户类型"
        v-model="customer"
        placeholder="请选择客户类型"
        @click="showCustomerTypePicker = true"
      />
      <van-field
        is-link
        readonly
        clickable
        label="客户领域"
        v-model="customerField"
        placeholder="请选择客户领域"
        @click="showCustomerFieldPicker = true"
      />
      <van-field
        label="投放预算"
        v-model="budget_money"
        placeholder="请输入投放预算"
      />
      <van-field
        is-link
        readonly
        clickable
        label="截止采购时间"
        :value="buyEndDateFormat"
        placeholder="请选择截止采购时间"
        @click="showBuyEndDatePicker = true"
      />
      <van-field
        is-link
        readonly
        clickable
        label="选择投放区域"
        v-model="choiceAddress"
        placeholder="请选择投放区域"
        @click="showChoiceAddressPicker = true"
      />
    </div>
    <van-popup v-model="showPicker" position="bottom" class="showPicker">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
    <van-popup v-model="showStartDatePicker" position="bottom">
      <van-datetime-picker
        v-model="startDate"
        :min-date="minDate"
        type="date"
        @cancel="showStartDatePicker = false"
        @confirm="onConfirmStartDate"
      />
    </van-popup>
    <van-popup v-model="showEndDatePicker" position="bottom">
      <van-datetime-picker
        v-model="endDate"
        type="date"
        :min-date="minDate"
        @cancel="showEndDatePicker = false"
        @confirm="onConfirmEndDate"
      />
    </van-popup>
    <van-popup v-model="showBuyEndDatePicker" position="bottom">
      <van-datetime-picker
        v-model="buyEndDate"
        type="date"
        :min-date="minDate"
        @cancel="showBuyEndDatePicker = false"
        @confirm="onConfirmBuyEndDate"
      />
    </van-popup>
    <van-popup v-model="showCustomerTypePicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="customerList"
        @cancel="showCustomerTypePicker = false"
        @confirm="onConfirmCustomerType"
      />
    </van-popup>
    <van-popup v-model="showCustomerFieldPicker" position="bottom">
      <ChoicePanel @save="saveField" :ServiceRealm="ServiceRealm" @close="closeChoicePanel" title="客户领域" content="请选择您所在的领域"></ChoicePanel>
    </van-popup>
    <van-popup v-model="showChoiceAddressPicker" position="right" :style="{ width: '90%' }">
      <AddressPanel @save="saveAddress" @close="closeAddressPanel"></AddressPanel>
    </van-popup>
    <fixed-btn name="保存" :fixed="1" @submit="_handleSubmit"></fixed-btn>
  </div>
</template>
<script>
  import FixedBtn from "@/components/common/FixedBtn";
import moment from 'moment'
import ChoicePanel from '../common/ChoicePanel'
import AddressPanel from '../common/AddressPanel'
import {Toast} from 'vant'
export default {
  name: 'ExchangeTypeChoice',
  props: {
    TemplateData: {
      type: Array
    },
    ClueCustomerType: {
      type: Array
    },
    ServiceRealm: {
      type: Array
    }
  },
  data () {
    return {
      value: '信息模式(广告主发布广告投放需求)',
      amount: '',
      budget_money: '',
      customer: '',
      customerField: '',
      showCustomerFieldPicker: false,
      showStartDatePicker: false,
      showCustomerTypePicker: false,
      showPicker: false,
      showEndDatePicker: false,
      showBuyEndDatePicker: false,
      minDate: new Date(),
      startDate: '',
      endDate: '',
      buyEndDate: '',
      buyEndDateFormat: '',
      endDateFormat: '',
      startDateFormat: '',
      columns: [{
        text:'信息模式(广告主发布广告投放需求)'
      },{
        text:'单人悬赏(只有一个中标者)',
        disabled: true
      },{
        text:'多人悬赏(多个中标，分享赏金)',
        disabled: true
      },{
        text:'计件悬赏(合格一稿，支付一稿)',
        disabled: true
      },{
        text:'招标任务(适合周期较长的任务)',
        disabled: true
      }],
      customerList: [],
      showDatePicker: false,
      choiceAddress: '',
      showChoiceAddressPicker: false
    }
  },
  components: {
    ChoicePanel,
    FixedBtn,
    AddressPanel
  },
  watch: {
    ClueCustomerType: {
      immediate: true,
      handler (val) {
        let _this = this;
        _this.ClueCustomerType = val
        _this.customerList = []
        this.ClueCustomerType.forEach(res=>{
          _this.customerList.push({
            text:res.customer_type,
            id:res.id
          })
        })
      }
    },
    ServiceRealm: {
      immediate: true,
      handler (val) {
        this.ServiceRealm = val
      }
    }
  },
  methods: {
    saveField (ServiceRealm) {
      this.$parent.eForm.field_id = ServiceRealm.id
      this.customerField = ServiceRealm.sr_name
      this.showCustomerFieldPicker = false
    },
    onClickLeft () {
      this.$emit('close');
    },
    onConfirm (value) {
      this.value = value.text
      this.showPicker = false
    },
    onConfirmCustomerType (value) {
      this.customer = value.text
      this.$parent.eForm.type_id = value.id
      this.showCustomerTypePicker = false
    },
    onConfirmStartDate (value) {
      this.startDateFormat = moment(value).format('YYYY-MM-DD')
      this.$parent.eForm.clue_start_time = this.startDateFormat
      this.showStartDatePicker = false
    },
    onConfirmEndDate (value) {
      this.endDateFormat = moment(value).format('YYYY-MM-DD')
      this.$parent.eForm.clue_end_time = this.endDateFormat
      this.showEndDatePicker = false
    },
    onConfirmBuyEndDate (value) {
      this.buyEndDateFormat = moment(value).format('YYYY-MM-DD')
      this.$parent.eForm.end_time = this.buyEndDateFormat
      this.showBuyEndDatePicker = false
    },
    closeChoicePanel () {
      this.showCustomerFieldPicker = false
    },
    closeAddressPanel () {
      this.showChoiceAddressPicker = false
    },
    _handleSubmit () {
      this.$parent.eForm.budget_money = this.budget_money
      if (this.$parent.eForm.clue_start_time == '') {
        Toast('请选择广告投放开始时间');
        return;
      }
      if (this.$parent.eForm.clue_end_time == '') {
        Toast('请选择广告投放结束时间');
        return;
      }
      if (this.$parent.eForm.end_time == '') {
        Toast('请选择广告线索采购截至时间');
        return;
      }
      if (this.$parent.eForm.type_id == '') {
        Toast('请选择客户类型');
        return;
      }
      if (this.$parent.eForm.budget_money == '') {
        Toast('请输入投放预算');
        return;
      }
      if (this.$parent.eForm.field_id == '') {
        Toast('请选择客户领域');
        return;
      }
      if (this.$parent.eForm.city.length == 0) {
        Toast('选择投放区域');
        return;
      }
      this.$emit('close')
    },
    saveAddress (addressArr) {
      let _this = this;
      _this.$parent.eForm.city = [];
      _this.choiceAddress=''
      addressArr.forEach( res => {
        _this.$parent.eForm.city.push(res.id);
        if (_this.choiceAddress !='') {
          _this.choiceAddress = _this.choiceAddress + ','
        }
        _this.choiceAddress = _this.choiceAddress + res.cityes
      });
      this.closeAddressPanel()
    }
  }
}
</script>
<style lang="scss" scoped>
.m-exchange-choice-pop{
  position: fixed;
  left:0;
  top:0;
  bottom:0;
  right:0;
  background:#fff;
  z-index: 30;
  .m-other{
    padding-top:rem(8);
    background:#f4f6f8;
  }
}
/deep/ .van-cell__title{
  color:#666;
  font-size:rem(24);
}
/deep/ .van-cell:not(:last-child)::after{
  left:0;
}
</style>
<style lang="scss">
.van-popup--right{
  height: 100%!important;
  .m-address-panel{
    height: 100%!important;
  }
}
</style>
