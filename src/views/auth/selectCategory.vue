<template>
  <div class="container bg">
    <head-nav title="选择类目"></head-nav>
    <div class="select_wrap">
      <ul class="left">
        <li :class="['cate_one',(1 === item.entered ||clickCate1===index)?'red':'']"
            v-for="(item,index) in categoryList" :key="item.id"
            @click="onClickOne(index)">
          {{item.cate_name}}
        </li>
      </ul>
      <div class="right">
        <van-collapse v-model="openCate2" @change="onClickTwo" accordion>
          <van-collapse-item class="collapse_item" :name="index"
                             v-for="(item,index) in twoCate" :key="item.id">
            <div slot="title" class="title_wrap">
              <span>{{item.cate_name}} </span>
              <span class="title_num" v-if="selectNumFun(item.children)">{{item.children | selectNum}}</span>
            </div>
            <van-checkbox v-model="subItem.entered" @click="onClickThree(subIndex,subItem.disabled)"
                          :disabled="subItem.disabled"
                          v-for="(subItem,subIndex) in item.children" :key="subItem.id"
                          class="cate3" :name="subIndex">{{subItem.cate_name}}
            </van-checkbox>
          </van-collapse-item>
        </van-collapse>
      </div>
    </div>
    <van-button class="custom_btn" plain @click="saveSkill">保存</van-button>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {getCategory} from '@/api/auth'

  export default {
    name: "selectCategory",
    data() {
      return {
        categoryList: [],
        twoCate: [],
        selectCat1: 0,
        selectCat2: 0,
        selectCat3: 0,
        clickCate1: -1,
        clickCate2: -1,
        clickCate3: -1,
        openCate2: [],
        selectCatOld1: 0,
        selectCatOld2: [],
        selectCatOld3: [],
        fistSelect: [],//一开始就选择的东西

        count: 0,   //需要初始化数据
        selectedList: [],//已选择的类目
        selectArray: [],//保存已选择的数据
        leftObj: {},// 入驻须知  诚信保证金
        rightList: [],// 入驻须知  技术费率
        settledIn: {},
      }
    },
    created() {
      let settledIn = this.$route.query;
      if (settledIn) {
        this.settledIn = settledIn;
      }
      let data = JSON.parse(JSON.stringify(this.cateEnter));
      if (data.length > 0) {
        this.selectedList = this.filterSelectItem(data);
        this.twoCate = data[0].children;
      } else {
        this.getCategorys();
      }
    },
    methods: {
      saveSkill() {
        let different = this.findObjectDifferent(this.fistSelect, this.selectArray);
        if (different.length === 0) {
          this.$toast('类目无变化，请先添加类目')
          return
        } else if (different.length > 50) {
          this.$toast('每次添加类目个数不能超过50个')
          return;
        }
        if (this.oldSelectCate1.length !== this.newSelectCate1.length) {//判断是否新选了一级类目
          if (this.settledIn.remain < (this.newSelectCate1.length - this.oldSelectCate1.length)) {
            this.settledIn.type = 1;
          }
        }
        // cat_one: 5,childrenCat: "{"41":[56],"43":[56,57]}"
        // 计算汇率
        let catOne = 0, childrenCat = {}, item = [], subItem = [], threeItem = [], catId3 = '', rightItem = [];
        for (let i = 0; i < different.length; i++) {
          const [one, two, three] = different[i].indexArr;
          item = this.categoryList[one];
          subItem = item.children[two];
          threeItem = subItem.children[three];
          catId3 = threeItem.id;
          rightItem.push({
            cate_name: threeItem.cate_name,
            tech_rate: threeItem.tech_rate
          });
          if (i === 0) {
            catOne = item.id;
            childrenCat[subItem.id] = [catId3]
            this.leftObj = {
              ...this.settledIn,
              cate_name: item.cate_name,
              min_deposit_enterprise: item.min_deposit_enterprise,
              min_deposit_personal: item.min_deposit_personal
            }
          } else {
            for (let key in childrenCat) {
              if (key == subItem.id) { //二级相同
                childrenCat[key] = childrenCat[key].concat([catId3])
              } else { //二级不相同
                if (childrenCat[subItem.id] === undefined) {
                  childrenCat[subItem.id] = [catId3]
                }
              }
            }
          }
        }
        this.noticeParams = {
          cat_one: catOne,
          childrenCat: JSON.stringify(childrenCat)
        }
        this.rightList = rightItem;
        localStorage.setItem('addKill', JSON.stringify({
          left: this.leftObj,
          right: this.rightList,
          params: this.noticeParams
        }))
        this.$router.push({path: '/noticeEntry'});
      },
      findObjectDifferent(array1, array2) { //找出数组中不同的对象
        let result = [];
        for (let i = 0; i < array2.length; i++) {
          let obj = array2[i], num = obj.id, isExist = false;
          for (let j = 0; j < array1.length; j++) {
            let aj = array1[j], n = aj.id;
            if (n == num) {
              isExist = true;
              break;
            }
          }
          if (!isExist) {
            result.push(obj);
          }
        }
        return result;
      },
      onClickOne(index) { //一级类目点击事件
        this.selectCat1 = index;
        this.selectCat2 = 0;
        this.selectCat3 = 0;
        this.clickCate1 = index;
        this.clickCate2 = -1;
        this.clickCate3 = -1;
        this.twoCate = this.categoryList[index].children || [];
      },
      onClickTwo(index) { //二级类目点击事件
        this.selectCat2 = index;
        this.selectCat3 = 0;
        this.clickCate2 = index;
        this.clickCate3 = -1;
      },
      onClickThree(index, disabled) {// 三级类目点击事件
        if (disabled) {//之前已经选中了
          return
        }
        let item = this.categoryList[this.selectCat1], selectFlag = false;
        const cat1 = this.selectCatOld1;
        this.selectCat3 = index;
        this.clickCate3 = index;
        if (item.entered === 0) { //之前没有选中
          if (cat1 !== this.selectCat1) { //选中的是不同类目，清除之前新增的样式
            let oneItem = this.categoryList[cat1], twoItem = [], threeItem = [];
            for (let i = 0; i < this.fistSelect.length; i++) {
              if (this.fistSelect[i].indexArr[0] === cat1) {
                selectFlag = true;
                break;
              }
            }
            if (!selectFlag) { //一级
              oneItem.entered = 0;
              twoItem = oneItem.children || [];
              for (let i = 0; i < twoItem.length; i++) { //二级
                if (twoItem[i].entered == 1) {
                  twoItem[i].entered = 0;
                }
                threeItem = twoItem[i].children || [];
                for (let j = 0; j < threeItem.length; j++) {//三级
                  if (threeItem[j].entered == 1) {
                    threeItem[j].entered = 0;
                  }
                }
              }
              this.$set(this.categoryList, cat1, oneItem)
            } else {
              twoItem = oneItem.children || [];
              for (let i = 0; i < twoItem.length; i++) { //二级
                if (this.selectCatOld2.length > 0) {
                  for (let j = 0; j < this.selectCatOld2.length; j++) {
                    let cat3Arr = twoItem[this.selectCatOld2[j]].children.filter(item => item.entered == 1);
                    if (cat3Arr.length == 1) {
                      twoItem[this.selectCatOld2[j]].entered = 0;
                    }
                  }
                }
                threeItem = twoItem[i].children || [];
                for (let j = 0; j < threeItem.length; j++) {//三级
                  if (this.selectCatOld3.length > 0) {
                    for (let k = 0; k < this.selectCatOld3.length; k++) {
                      threeItem[this.selectCatOld3[k]].entered = 0;
                    }
                  }
                }
              }
              this.$set(this.categoryList, cat1, oneItem)
            }
          }
          if (item.entered !== 1) {//一级之前是否选中
            this.selectCatOld1 = this.selectCat1;
            item.entered = 1;
          }
          if (item.children[this.selectCat2].entered !== 1) {//二级之前是否选中
            this.selectCatOld2 = [this.selectCat2];
            item.children[this.selectCat2].entered = 1;
          }
          if (item.children[this.selectCat2].children[index].entered !== 1) { //三级之前是否选中
            item.children[this.selectCat2].children[index].entered = 1;
            this.selectCatOld3 = [this.selectCat3];
            this.$set(this.categoryList, this.selectCat1, item)
          }
          this.selectCatOld1 = this.selectCat1;
        } else { //之前选中过的
          if (cat1 === this.selectCat1) { //同一类目
            if (item.children[this.selectCat2].entered !== 1) {//二级之前是否选中
              this.selectCatOld2.push(this.selectCat2); //保存二级选择的下标
              item.children[this.selectCat2].entered = 1;
            }
            if (!item.children[this.selectCat2].children[index].entered) { //三级之前是否选中
              item.children[this.selectCat2].children[index].entered = 1;
              this.selectCatOld3.push(this.selectCat3); //保存三级选择的下标
              this.$set(this.categoryList, this.selectCat1, item)
            } else { //去掉之前选中的状态
              item.children[this.selectCat2].children[index].entered = 0;
              this.selectCatOld3 = this.selectCatOld3.filter(item => item !== this.selectCat3);
              this.$set(this.categoryList, this.selectCat1, item)
            }
            // if (item.children[this.selectCat2].children[index].entered !== 1) { //三级之前是否选中
            //   item.children[this.selectCat2].children[index].entered = 1;
            //   this.selectCatOld3.push(this.selectCat3);
            //   this.$set(this.categoryList, this.selectCat1, item)
            // }
          } else { //不同类目，删掉之前选择的类目的类目
            let oneItem = this.categoryList[cat1], twoItem = [], threeItem = [];
            oneItem.entered = 0;
            twoItem = (oneItem && oneItem.children) || [];
            for (let i = 0; i < twoItem.length; i++) { //二级
              for (let m = 0; m < this.selectCatOld2.length; m++) {
                twoItem[this.selectCatOld2[m]].entered = 0;
              }
              threeItem = twoItem[i].children || [];
              for (let k = 0; k < this.selectCatOld3.length; k++) {//三级
                threeItem[this.selectCatOld3[k]].entered = 0;
              }
            }
            if (item.entered !== 1) {//一级之前是否选中
              this.selectCatOld1 = this.selectCat1;
              item.entered = 1;
            }
            if (item.children[this.selectCat2].entered !== 1) {//二级之前是否选中
              this.selectCatOld2 = [this.selectCat2];
              item.children[this.selectCat2].entered = 1;
            }
            if (item.children[this.selectCat2].children[index].entered !== 1) { //三级之前是否选中
              item.children[this.selectCat2].children[index].entered = 1;
              this.selectCatOld3 = [this.selectCat3];
              this.$set(this.categoryList, this.selectCat1, item)
            }
            this.selectCatOld2 = [this.selectCat2];
            this.selectCatOld3 = [this.selectCat3];
            this.$set(this.categoryList, cat1, oneItem)
          }
          this.selectCatOld1 = this.selectCat1;
        }
        this.selectedList = this.filterSelectItem(this.categoryList);
      },
      filterSelectItem(data) { //过滤第三级分类，选择了那些项目
        let item = [], subItem = [], threeArr = [], selectArr = [], oneSelectCate1 = [];
        for (let i = 0; i < data.length; i++) { //一级
          if (data[i].entered !== 1) {
            continue;
          }
          oneSelectCate1.push(data[i].id);
          item = data[i].children || [];
          for (let j = 0; j < item.length; j++) { //二级
            if (item[j].entered !== 1) {
              continue;
            }
            subItem = item[j].children || [];
            for (let k = 0; k < subItem.length; k++) { //三级
              if (subItem[k].entered) { // == 1
                if (this.count === 0) {
                  data[i].children[j].children[k].disabled = true;
                }
                threeArr.push(subItem[k]);
                selectArr.push({id: subItem[k].id, indexArr: [i, j, k]});
                if (this.clickCate1 < i) {
                  this.clickCate1 = i;
                  this.clickCate2 = j;
                  this.clickCate3 = k;
                }
              }
            }
          }
        }
        //
        if (this.count === 0) {
          this.categoryList = data;
          this.fistSelect = selectArr;
          this.oldSelectCate1 = oneSelectCate1;
          this.count = 1;
        }
        this.selectArray = selectArr;
        this.newSelectCate1 = oneSelectCate1;
        return threeArr;
      },
      async getCategorys() {
        const data = await getCategory();
        if (!data) return
        this.selectedList = this.filterSelectItem(data);
        // this.categoryList = data;
        this.twoCate = data[0].children;
        localStorage.setItem('category', JSON.stringify(data));
      },
      selectNumFun(val = []) {
        let data = val.filter(item => item.entered)
        return !!data.length;
      },
    },
    computed: {
      ...mapState(['cateEnter']),
    },
    filters: {
      selectNum(val = []) {
        let data = val.filter(item => item.entered)
        return data.length;
      },
    }
  }
</script>

<style scoped lang="scss">
  .select_wrap {
    display: flex;
    height: calc(100vh - 186px);

    .left {
      width: 339px;
      background: $c_bg;
      padding-left: $w_30;
      overflow-y: auto;

      .cate_one {
        height: 90px;
        line-height: 90px;
        font-size: 28px;
      }
    }

    .right {
      flex: 1;
      overflow-y: auto;
      background: $white;

      .check_icon {
        width: 28px;
        height: 28px;
      }

      .collapse_item {
        padding: 0;
      }

      .title_wrap {
      }

      .title_num {
        display: inline-block;
        width: 28px;
        height: 28px;
        text-align: center;
        line-height: 28px;
        border-radius: 50%;
        background: $red;
        font-size: 26px;
        color: $white;
      }

      .cate3 {
        height: 90px;
        line-height: 90px;
        font-size: 28px;
      }
    }
  }

  .custom_btn {
    font-size: 30px;
    width: 100%;
    height: 98px;
    line-height: 98px;
    background: $red;
    color: $white;
    text-align: center;
  }
</style>
