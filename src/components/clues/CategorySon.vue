<template>
  <div class="m-category-son" v-if="list.length>0">
    <van-nav-bar
      title="分类"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="m-choice-class" @click="showCategoryChiocedPop">
      <div class="m-title">
        已选分类
      </div>
      <div class="m-choice-item">
        <div class="m-left-item" v-if="selectShowListChildArr!=''">
          {{selectShowListChildArr}}
        </div>
        <div class="m-left-item" v-else>
          您还未选择类目，请在下方选择
        </div>
        <div class="right-arrow">

        </div>
      </div>
    </div>
    <div class="m-choice-wrap">
      <div class="m-left-class">
        <ul>
          <li :class="{'active' : itemIndex == idx}" v-for="(item,idx) in list[index].child" @click="choiceItem(idx)" :key="idx">
            {{item.cate_name}}
          </li>
        </ul>
      </div>
      <div class="m-right-class">
        <ul v-for="(item,idex) in list[index].child" :key="idex" :style="idex==itemIndex?'display:block':'display:none'">
          <li>
            <van-checkbox v-model="item.choiceAll" @click="secondSelectHandle">全选</van-checkbox>
          </li>
          <li v-for="(itm, idx) in item.child" :key="idx+1">
            <van-checkbox @change="choiceSon(idx)" v-model="itm.selected" :key="idx">{{itm.cate_name}}</van-checkbox>
          </li>
        </ul>
      </div>
    </div>
    <div class="m-btn-save" @click="saveCategory">
      保存
    </div>
  </div>
</template>
<script>

export default {
  name: 'CategorySon',
  props: {
    index: {
      type: Number
    },
    sonData: {
      type: Array,
    }
  },
  data () {
    return {
      selectShowListChildArr:'',
      itemIndex: 0,
      allChecked: false,
      category: {},
      thisCategory: 0,
      map:{},
      selectShowList:null,
      list:[]
    };
  },
  computed: {
  },
  methods: {
    onClickLeft () {
      this.$emit('close')
    },
    choiceItem (idx) {
      this.itemIndex = idx
    },
    saveCategory () {
      this.$parent.list = this.list
      this.$parent.selectShowListPage = this.selectShowList
      this.$parent.selectShowList = this.selectShowList
      this.$parent.eForm.category = this.category
      this.$emit('save')
    },
    showCategoryChiocedPop () {
      document.getElementsByTagName("body")[0].className="m-fixed-body";
      this.$parent.selectShowList = this.selectShowList;
      this.$emit('showChoiced');
    },
    secondSelectHandle () {
      let obj = {
        s: !this.list[this.index].child[this.itemIndex].choiceAll,
        itemIndex: this.itemIndex,
        id: this.list[this.index].child[this.itemIndex].id
      };

      // this.$emit('choiceAll', obj)
      this.choiceAll(obj)
    },
    choiceSon (idx) {
      let obj = {
        s: this.list[this.index].child[this.itemIndex].child[idx].selected,
        pi: this.index,
        ci: this.itemIndex,
        val1: this.list[this.index].child[this.itemIndex].id,
        val2: this.list[this.index].child[this.itemIndex].child[idx].id
      }
     this.thirdSelectHandle(obj);
     
      // this.$emit('choiceSon', obj)
    },
    choiceAll (e) {
      let s = e.s,
          pi = this.index,
          ci = e.itemIndex,
          val = e.id;
      this.map = {}
      // this.$set(this.list[pi].child[ci], 'selected', s);
      if (this.list[pi].id != this.category.class) {
        this.category = {class: '', list: []}
      }
      // 切换一级选项卡时，清空其他选项的选中状态
      this.list.forEach((item, idx) => {
        if (pi !== idx) {
          if (item.child) {
            item.child.forEach((item2, idx2) => {
              this.$set(this.list[idx].child[idx2], 'selected', false)
              if (item2.child) {
                item2.child.forEach((item3, idx3) => {
                  this.$set(this.list[idx].child[idx2].child[idx3], 'selected', false)
                })
              }
            })
          }
        }
      })
      let arr = this.list[pi].child[ci].child
      if (arr && arr.length) {
        arr.forEach((el, i) => {
          if (el.pid == val) {
            if (s) {
              this.$set(this.list[pi].child[ci].child[i], 'selected', true)
              this.category.class = this.list[pi].id;
              this.category.list.push(this.list[pi].child[ci].child[i].id);
            } else if(s==false){
              let eformCategory = this.category.list;
              this.category.list.splice(eformCategory.findIndex(res => res == this.list[pi].child[ci].child[i].id), 1)
              this.$set(this.list[pi].child[ci].child[i], 'selected', false)
            }
          }
        })
      }
      // 处理点击二级选项时，添加到列表里
      let arrList = this.list[pi].child
      let arrList1 = arrList.filter(item => (item.selected && item.child))
      this.map.child = JSON.parse(JSON.stringify(arrList))
      this.map.cate_name = this.list[pi].cate_name
      this.selectShowList = this.map;
    },
    thirdSelectHandle (obj) {
      let s = obj.s,
          pi = obj.pi,
          ci = obj.ci,
          val2 = obj.val2;
      let _this = this
      _this.listSelectFormat(pi, ci);
      if (this.list[pi].id != this.category.class) {
        this.category = {class: '', list: []}
      }
      let arr = this.list[pi].child[ci].child
      if (arr && arr.length > 0) {
        arr.forEach((el, i) => {
          if (el.id == val2) {
            if (s) {
              this.$set(this.list[pi].child[ci].child[i], 'selected', true)
              this.category.class = this.list[pi].id
              if (this.category.list.findIndex(res => res == this.list[pi].child[ci].child[i].id) == -1) {
                this.category.list.push(this.list[pi].child[ci].child[i].id)
              }
            } else {
              let eformCategory = this.category.list
              this.category.list.splice(eformCategory.findIndex(res => res == this.list[pi].child[ci].child[i].id), 1)
              this.$set(this.list[pi].child[ci].child[i], 'selected', false)
            }
          }
        })
      }
      // 处理点击三级选项时，添加到列表里
      let arrChild = JSON.parse(JSON.stringify(_this.list[pi].child[ci].child));
      arrChild = arrChild.filter(item => (item.selected));
      if (arrChild.length == 0) {
        // this.$set(this.list[pi].child[ci], 'selected', false);
        let index = this.map.child.findIndex(res => {
          return res.id == this.list[pi].child[ci].child[0].pid;
        })
        this.map.child.splice(index, 1);
      } else {
        let idx = this.map.child.findIndex(res => {
          return res.id == arrChild[0].pid;
        })
        if(idx>-1){
          this.map.child[idx].child = arrChild;
        }
        if(_this.list[pi].child[ci].child.length == this.map.child[idx].child.length) {
          this.$set(this.list[pi].child[ci], 'choiceAll', true);
        }else{
          this.$set(this.list[pi].child[ci], 'choiceAll', false);
        }
      }
      this.selectShowList = this.map;
       setTimeout(()=>{
         if(this.selectShowList.child.length<1||!this.selectShowListChildArr){
          this.$set(this.list[pi].child[ci], 'choiceAll', false);
          }
       },100)
      
    },
    listSelectFormat (pi, ci) {
      this.list.forEach((item, idx) => {
        if (pi !== idx) {
          this.map = {};
          if (item.child) {
            item.child.forEach((item2, idx2) => {
              this.$set(this.list[idx].child[idx2], 'selected', false)
              if (item2.child) {
                item2.child.forEach((item3, idx3) => {
                  this.$set(this.list[idx].child[idx2].child[idx3], 'selected', false)
                })
              }
            })
          }
        }
        let arr = this.list[pi].child
        if (this.list[pi].child) {
          this.$set(this.list[pi].child[ci],'selected',true)
          arr = arr.filter(item => (item.selected && item.child))
          this.map.child = JSON.parse(JSON.stringify(arr))
          this.map.cate_name = this.list[pi].cate_name
          this.selectShowList = this.map
        }
      })
    },

  },
  mounted () {
    this.list = this.sonData
    this.category = this.$parent.eForm.category
    this.selectShowList = this.$parent.selectShowList
  },
  watch: {
    selectShowList (newArr, oldArr) {
      this.selectShowListChildArr = ''
      let outFlag = true
      if (!newArr.child) return
      if (newArr.child.length > 0) {
        newArr.child.forEach(res => {
          let flag = true
          res.child.forEach(item => {
            if (item.selected === true) {
              if (outFlag) {
                this.selectShowListChildArr = newArr.cate_name + '>'
                outFlag = false
              }
              if (flag) {
                this.selectShowListChildArr += res.cate_name
                this.selectShowListChildArr += '>'
                flag = false
              }
              this.selectShowListChildArr += item.cate_name
              this.selectShowListChildArr += ' 、'
            }
          })
        })
        this.showListFlag = true
      } else {
        this.showListFlag = false
      }
    }
  }
}
</script>
<style>
.m-fixed-body{
  position: fixed;
}
</style>
<style lang="scss" scoped>
.m-category-son{
  position: fixed;
  left:0;
  top:0;
  bottom:0;
  right:0;
  background:#fff;
  z-index: 50;
}
.m-btn-save{
  width:rem(750);
  position: absolute;
  height:rem(96);
  background:$red;
  line-height:rem(96);
  bottom:0;
  left:0;
  color:#fff;
  font-size:rem(30);
  text-align: center;
  z-index: 99;
}
.m-choice-class{
  width:rem(750);
  position: relative;
  z-index: 9;
  height:rem(73);
  background:#F4F6F8;
  padding:rem(22) rem(26) rem(22) rem(52);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  .m-title{
    color:$red;
    font-size:rem(24);
    height:rem(28);
    width:rem(672);
  }
  .m-choice-item{
    display: flex;
    height:rem(28);
    width:rem(672);
    justify-content: space-between;
    .m-left-item{
      width:rem(640);
      color:#030303;
      font-size:rem(28);
      overflow: hidden;
      height:rem(28);
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .right-arrow{
      border-right:1px solid #666;
      border-top:1px solid #666;
      width:rem(15);
      height:rem(15);
      transform: rotate(45deg);
    }
  }
}
.m-choice-wrap{
  padding-left:rem(200);
  width:rem(670);
}
.m-left-class{
  width:rem(210);
  z-index: 8;
  background: #F4F6F8;
  position: absolute;
  left:0;
  top:rem(200);
  bottom:rem(96);
  overflow-y: auto;
  li{
    height:rem(90);
    line-height: rem(90);
    text-align: center;
    &.active{
      background:#fff;
      position:relative;
      &:after{
        width:rem(6);
        height:rem(24);
        background:$red;
        position: absolute;
        left:rem(8);
        top:rem(33);
        content: ' ';
      }
    }
  }
}
.m-right-class{
  max-height: calc(100vh - 310px);
  overflow-y: auto;
  li{
    height:rem(89);
    border-bottom:1px solid #eee;
  }
  /deep/ .van-checkbox{
    height:rem(84);
    padding-top:rem(5);
    padding-left:rem(48);
    line-height:rem(59);
  }
}
</style>
