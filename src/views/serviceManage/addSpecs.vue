<template>
  <div class="container">
    <head-nav title="添加规格" btn="添加" @submit="addSpecs"></head-nav>
    <div v-if="false" class="specs_wrap">
      <h4 class="title">价格及库存</h4>
      <ul class="specs_list" v-if="item.checked ===1" v-for="(item,index) in upList" :key="index">
        <li v-if="item.checked_list.length" class="specs_item" v-for="(subItem,subIndex) in item.checked_list"
            :key="subIndex">
          <!--标题-->
          <div class="select_item"><span v-for="(key,keyIndex) in upList" :key="keyIndex" class="select_name"
                                         v-if="key.checked ===1">{{item.attr_name }}- {{subItem[key.id]}}</span>
          </div>
          <ul class="item_wrap">
            <li class="item_item">
              <van-cell-group>
                <van-field class="model" v-model="subItem.price" placeholder="请输入售价"/>
              </van-cell-group>
            </li>
            <li class="item_item">
              <van-cell-group>
                <van-field class="model" v-model="subItem.m_price" placeholder="请输入市场价"/>
              </van-cell-group>
            </li>
            <li class="item_item">
              <van-cell-group>
                <van-field class="model" v-model="subItem.stock" placeholder="请输入库存"/>
              </van-cell-group>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div v-if="listData.length > 0 " class="specs_wrap">
      <h4 class="title">价格及库存</h4>
      <ul class="specs_list">
        <li class="specs_item" v-for="(item,index) in listData" :key="index">
          <!--标题-->

          <div class="select_item">
            <span v-if="key.checked===1" class="select_name" v-for="(key,keyIndex) in upList" :key="keyIndex">
            {{key.attr_name }}- {{item[key.id] ||item.value}}
          </span>
            <i class="deleteIcon" @click="deleteSpecs(index)"></i>
          </div>
          <ul class="item_wrap">
            <li class="item_item">
              <van-cell-group>
                <van-field class="model" v-model="item.price" type="number" placeholder="请输入售价"/>
              </van-cell-group>
            </li>
            <li class="item_item">
              <van-cell-group>
                <van-field class="model" v-model="item.m_price" type="number" placeholder="请输入市场价"/>
              </van-cell-group>
            </li>
            <li class="item_item">
              <van-cell-group>
                <van-field class="model" v-model="item.stock" type="number" placeholder="请输入库存"/>
              </van-cell-group>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <no-data v-else name="该分类下未配置可选规格"></no-data>
    <fixed-btn name="保存" :fixed="1" @submit="saveSubmit"></fixed-btn>
    <!--弹出框-->
    <specPopup v-if="checkFlag" :list="upList" @close="emitClose" @submit="emitSubmit"></specPopup>
  </div>
</template>

<script>
    import NoData from "@/components/noData";
    import specPopup from './components/specPopup'
    import FixedBtn from "@/components/common/FixedBtn";
    import {serviceEdit} from '@/api/serviceManage'

    export default {
        name: "addSpecs",
        components: {NoData, specPopup, FixedBtn},
        data() {
            return {
                list: [
                    {'price': '', 'm_price': '', 'stock': '', 'sale_attr': 1}
                ],
                value: '',
                checkFlag: false,
                selectId: 0,
                submitId: [],
                upList: [],
                listData: [],
                oneFlag: false
            }
        },
        created() {
            let {id = 0} = this.$route.query;
            let up = [];
            let serviceData = localStorage.getItem('serviceData');
            if (serviceData) {
                let {spec = {}} = JSON.parse(serviceData);
                up = spec.up;
            }
            const obj = {} // 选中复选框key的对象
            let listData = [], subItem = [], listKey = '', key = '', selectSpecs = []; // up 选择了那些项目
            for (let i = 0; i < up.length; i++) { // up
                if (up[i].checked === 1) { // 选择了那些项
                    selectSpecs.push(up[i].id)
                    if (up[i].input_type === 1) { // 选择项目id作为key
                        key = up[i].id
                        obj[key] = ''
                    } else {
                        key = up[i].id
                        obj[key] = []
                    }
                    subItem = up[i].checked_list || ''
                    if (i === 0) { // 确定数组长度 listData
                        listData = subItem || [];
                        // || this.list
                        for (let j = 0; j < listData.length; j++) {
                            if (listData[j].key) { // key存在才执行
                                listKey = listData[j].key
                                listData[j][listKey] = listData[j].value
                            }
                        }
                    } else { // 把其他项的值赋给第一项 listData
                        if (subItem) {
                            if (listData.length === 0) {
                                listData = subItem;
                            }
                            for (let j = 0; j < subItem.length; j++) {
                                if (subItem[j].key) {
                                    listKey = subItem[j].key
                                    listData[j][listKey] = subItem[j].value
                                }
                            }
                        }
                    }
                }
            }

            // this.list = listData.length > 0 ? listData : this.list
            this.upList = up;
            this.submitId = selectSpecs;
            this.listData = listData;
            this.oneFlag = !!listData.length
            this.selectId = id;
        },
        methods: {
            deleteSpecs(index) {
                this.listData.splice(index, 1);
            },
            saveSubmit() {
                // {'price': '', 'm_price': '', 'stock': '', 'sale_attr': 1}
                let data = this.listData;
                for (let i = 0; i < data.length; i++) {
                    if (!data[i].price || !data[i].m_price || !data[i].stock) {
                        this.$toast('数据不能为空');
                        return
                    }
                }
                let ids = JSON.parse(JSON.stringify(this.submitId))
                const params = {
                    id: +this.selectId,
                    action: 4,
                    sale_attr: 1,
                    val: JSON.stringify(this.listData),//	是	string	复选框:1,2,3
                    // chk: this.upList.map(item => item.id).toString()//	是	json	销售属性否:[{“7”:”单图文”},{“13”:”CPM,CPC”},{“14”:”信息流,开屏”}]
                    chk: ids.toString()//	是	json	销售属性否:[{“7”:”单图文”},{“13”:”CPM,CPC”},{“14”:”信息流,开屏”}]
                }
                this.serviceEditHttp(params);
            },
            async serviceEditHttp(params) {
                const data = await serviceEdit(params);
                if (!data) return
                this.$router.push({path: '/perfectService', query: {id: this.selectId}})
            },
            addSpecs() {
                if (this.upList.length > 0) {
                    this.checkFlag = true;
                }
            },
            emitClose() {
                this.checkFlag = false;
            },
            emitSubmit(value, ids) {
                let keyArr = Object.keys(value);
                let upList = JSON.parse(JSON.stringify(this.upList));
                // let item = {...this.list[0], ...value}
                for (let j = 0; j < upList.length; j++) {
                    for (let i = 0; i < keyArr.length; i++) {
                        if (keyArr[i] == upList[j].id) {
                            upList[j].checked = 1;
                            break;
                        }
                        if (i === keyArr.length - 1) {
                            upList[j].checked = 0;
                        }
                    }
                }
                let param = JSON.parse(JSON.stringify(this.listData));
                let list = [];
                for (let i = 0; i < param.length; i++) {
                    list.push({...value, ...param[i]})
                }
                let item = {...this.list[0], ...value}
                list.push(item)
                this.submitId = ids;
                this.listData = list;
                this.upList = upList;
                this.checkFlag = false;
            }
        },
    }
</script>

<style scoped lang="scss">
  .specs_wrap {
    padding: 0 $w_30 168px;
    font-size: 24px;

    .title {
      @include height(74px);
      color: $c_666;
    }
  }

  .specs_list {
    font-size: 24px;
    border-top: 1px solid $c_eee;
    border-bottom: 1px solid $c_eee;
    padding-top: $w_20;

    .specs_item {
      padding-bottom: $w_30;

      .select_item {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        line-height: 33px;

        .select_name {
          /*flex: 1;*/
          margin-right: 20px;
          @include height(33px);
          font-size: 24px;
          margin-bottom: 16px;
        }

        .deleteIcon {
          width: 30px;
          height: 30px;
          background: url("/static/images/auth/trash.png") no-repeat center;
          background-size: 30px;
        }
      }
    }

    .item_wrap {
      display: flex;
    }

    .item_item {
      flex: 1;

      .model {
        width: 200px;
        height: 49px;
        border-radius: 4px;
        border: 1px solid $c_ddd;
      }
    }
  }
</style>
<style lang="scss">
  .item_item {
    .van-cell {
      padding: 0 5px;
    }
  }
</style>
