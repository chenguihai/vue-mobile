<template>
  <div class="container">
    <head-nav title="添加属性"></head-nav>
    <div class="company_name">
      <van-cell-group>
        <div v-for="(item,index) in downList" :key="item.id">
          <van-field v-if="item.input_type ===1" v-model="item.checked_list" :label="item.attr_name"
                     :placeholder="'请输入'+item.attr_name" input-align="right" clearable/>
          <van-cell v-else-if="item.input_type ===2" :title="item.attr_name"
                    :value-class="{cell_item:item.checked_list[0].value}"
                    is-link :value="item.checked_list[0].value ||'请选择'"
                    @click="clickSelect(item.input_select_val,index)"/>
          <van-cell v-else :title="item.attr_name" :value-class="{cell_item:item.checked_list.length > 0}"
                    is-link :value="(item.checked_list.length > 0 ? '已选择':'') ||'请选择'"
                    @click="clickChecked(item.input_select_val,index,item.checked_list)"/>
        </div>
        <fixed-btn name="保存" :fixed="1" @submit="onSubmit"></fixed-btn>
      </van-cell-group>
    </div>
    <!--弹框选择-->
    <popup-picker v-if="selectFlag" :list="selectList" @submit="handleSelect" @close="emitClose"></popup-picker>
    <!--弹出框-->
    <bottom-popup name="确定" v-if="checkFlag" :list="checkList" @close="emitClose"
                  @submit="handleCheck"/>
  </div>
</template>

<script>
  import PopupPicker from '@/components/common/PopupPicker'
  import FixedBtn from "@/components/common/FixedBtn";
  import BottomPopup from "@/components/common/BottomPopup";
  import {mapState} from 'vuex'
  import {serviceEdit} from '@/api/serviceManage'

  export default {
    name: "addAttribute",
    components: {
      PopupPicker, FixedBtn, BottomPopup
    },
    data() {
      return {
        selectId: 0,
        downList: [],
        checkList: [],
        selectList: [],
        selectFlag: false,
        checkFlag: false,
        selectIndex: 0,
        checkIndex: 0,
        checkItem: [],
        checkedArr: [],
      }
    },
    created() {
      let {id = 0} = this.$route.query;
      // let down = this.serviceSpec.down || [];
      let down = [];
      let serviceData = localStorage.getItem('serviceData');
      if (serviceData) {
        let {cate = [], spec = {}} = JSON.parse(serviceData);
        down = spec.down;
        this.checkItem = cate;
      }
      for (let i = 0; i < down.length; i++) { // down
        if (down[i].checked === 1) {
          // break;
        } else {
          if (down[i].input_type === 1) { // 给选择项字段赋值 imput
            down[i].checked_list = ''
          } else if (down[i].input_type === 2) { // select
            down[i].checked_list = [{value: ''}]
          } else { // check
            down[i].checked_list = []
          }
        }
      }
      this.downList = down;
      this.selectId = id;
    },
    // computed: mapState({
    //     serviceSpec: state => state.serviceSpec,
    // }),
    methods: {
      onSubmit() {
        this.baseInfoEditAttHttp();
      },

      baseInfoEditAttHttp() {
        let downData = this.downList;
        let dataJson = JSON.parse(JSON.stringify(downData));
        let data = [];
        for (let i = 0; i < dataJson.length; i++) {
          if (dataJson[i].input_type === 1 && !dataJson[i].checked_list) {
            // return true
          } else if (dataJson[i].input_type === 2 && !dataJson[i].checked_list[0].value) {
            // return true
          } else if (dataJson[i].input_type === 3 && !(dataJson[i].checked_list.length > 0)) {
            // return true
          }else{
            data.push(dataJson[i])
          }
        }
        if(data.length ===0){
          this.$router.push({path: '/perfectService', query: {id: this.selectId}})
        }
        const val1 = []
        let index = '', selectItem = [], value = '';
        for (let i = 0; i < data.length; i++) {
          index = data[i].id
          selectItem = data[i].checked_list
          value = data[i].input_type === 2 ? selectItem[0].value : data[i].input_type === 3 ? selectItem.toString() : selectItem
          if (value) { // 有值才添加
            val1.push({
              [index]: value
            })
          }
        }
        const params = {
          id: +this.selectId,
          action: 4,
          sale_attr: 0,
          val1: JSON.stringify(val1),//	是	string	复选框:1,2,3
          chk: data.map(item => item.id).toString()//	是	json	销售属性否:[{“7”:”单图文”},{“13”:”CPM,CPC”},{“14”:”信息流,开屏”}]
        }
        this.serviceEditHttp(params);
      },
      handleSelect(value) {
        this.selectFlag = false;
        let data = JSON.parse(JSON.stringify(this.downList[this.selectIndex]));
        data.checked_list[0].value = value;
        this.$set(this.downList, this.selectIndex, data);
      },
      handleCheck(value) {
        this.checkFlag = false;
        let data = JSON.parse(JSON.stringify(this.downList[this.checkIndex]));
        data.checked_list = value;
        this.$set(this.downList, this.checkIndex, data);
      },
      emitClose() {
        this.selectFlag = false;
        this.checkFlag = false;
      },
      clickSelect(value, index) {
        this.selectIndex = index;
        this.selectFlag = true;
        this.selectList = value.split('|');
      },
      clickChecked(value, index, checked = []) {
        this.checkIndex = index;
        this.checkFlag = true;
        this.checkedArr = checked;
        let data = value.split('|'), newData = [];
        for (let i = 0; i < data.length; i++) {
          newData.push({
            checked: false,
            name: data[i]
          })
        }
        for (let i = 0; i < newData.length; i++) {//checkItem
          for (let j = 0; j < checked.length; j++) {
            if (checked[j] === newData[i].name) {
              newData[i].checked = true;
              break
            }
          }
        }

        this.checkList = newData;
      },
      async serviceEditHttp(params) {
        const data = await serviceEdit(params);
        if (!data) return
        this.$router.push({path: '/perfectService', query: {id: this.selectId}})
      },
    }
  }
</script>

<style scoped lang="scss">
  @import "../../css/auth";

  .company_name {
    padding-bottom: 168px;
  }
</style>
