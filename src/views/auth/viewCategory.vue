<template>
  <div class="container bg">
    <head-nav title="查看类目"></head-nav>
    <p class="cate_title">
      您已选择一级类目<em>{{skillObj.cate_name}}</em>下如下类目：
    </p>
    <!--分类容器-->
    <div class="cate_wrap" v-if="selectNumFun(item.children)" v-for="(item,index) in skillTwo" :key="item.id">
      <h4 class="title"><span>{{item.cate_name}}</span>
        <i class="deleteIcon" v-if="queryType!=='skill'"
           @click="showDelete2(item.cate_name,index,item.id)"></i>
      </h4>
      <ul class="field_wrap clearFix">
        <li v-if="item3.entered===1" class="field_item pr"
            v-for="(item3,index3) in item.children" :key="item3.id">
          <span>{{item3.cate_name}}</span>
          <i v-if="queryType!== 'skill'" @click="showDelete3(item3,index,index3)" class="delete"></i>
        </li>
      </ul>
      <div class="btn_wrap" v-if="false">
        <van-button round plain class="custom_btn">查看更多</van-button>
      </div>
    </div>
    <!--弹框-->
    <skyPop v-model="agreeFlag" @change="emitClose" type="cate">
      <template>
        <h5 class="pop-title mb_30">温馨提示</h5>
        <p class="pop-top" v-if="clickIndex3 ===-1">确定要删除【{{cateName}}】二级类目吗，删除后该类目下的三级类目都会被被删除哦，并有以下影响：</p>
        <p class="pop-top" v-else>确定要删除【{{cateName}}】三级类目吗，删除后并有以下影响：</p>
        <p class="pop-bottom w_rate">1、您将不能发布该类目下服务 <br>
          2、您将不能参与该类目下的任务 <br>
          3、您将不能购买该类目下的线索 <br>
          4、请选择其他类目弥补空缺，让赚钱来得更容易
        </p>
        <div class="pop-empty-btn" @click="emitSubmit">确认删除</div>
      </template>
    </skyPop>
    <skyPop v-model="hintFlag" @change="emitClose">
      <template>
        <h5 class="pop-title">温馨提示</h5>
        <p class="pop_delete">您的类目数量过少，不能再删除了。</p>
      </template>
    </skyPop>
  </div>
</template>

<script>
  import skyPop from '@/components/service/order/skyPop'
  import {deletecate, skillList} from '@/api/bond'
  import {mapState} from 'vuex'

  export default {
    name: "viewCategory",
    components: {skyPop},
    data() {
      return {
        skillObj: {},
        skillTwo: [],
        agreeFlag: false,
        hintFlag: false,

        clickIndex: 0,
        clickIndex3: -1,
        cateName: '',
        cateId: 0,
        queryType: 'skill',
        queryIndex: 0,
      }
    },
    created() {
      let {id = 0, index = 0, type = 'deposit'} = this.$route.query;
      if (type === 'skill') {
        let categoryList = localStorage.getItem('categoryList');
        let data = (categoryList && JSON.parse(categoryList)) || []
        const [item = {}] = data.filter(item => item.id == id);
        this.skillObj = item;
        this.skillTwo = item.children || [];
      } else {
        this.getList(index, type);
      }
      this.queryIndex =index;
    },
    methods: {
      showDelete2(name, index, id) {
        if (this.skillTwo.length === 1) {
          this.hintFlag = true;
          return
        }
        this.clickIndex = index;
        this.clickIndex3 = -1;
        this.cateId = id;
        this.cateName = name;
        this.agreeFlag = true;
      },
      showDelete3(item, index, subIndex) {
        let data = this.skillTwo[index].children;
        if (this.skillTwo.length === 1 && data.length === 1) {//只有一个三级类型
          this.hintFlag = true;
          return;
        }
        this.clickIndex = index;
        this.clickIndex3 = subIndex;
        this.cateName = item.cate_name;
        this.cateId = item.id;
        this.agreeFlag = true;
      },
      async delete() {
        let params = {
          id: this.skillObj.id,//	是	int	当前入主技能id
          type: this.clickIndex3 === -1 ? 2 : 3,//	是	int	删除的为几级类目 1：一级类目 2：二级类目 3：三级类目
          cat_id: this.cateId,//	是	int	删除的类目id
        };
        let data = await deletecate(params);
        if (!data) return
        let index = this.clickIndex;
        if (this.clickIndex3 === -1) {
          // this.skillTwo.splice(index, 1);
          this.getList(this.queryIndex);
        } else {
          let item = this.skillTwo[index];
          if (item.children.length === 1) {
            // this.skillTwo.splice(index, 1);
            this.getList(this.queryIndex);
          } else {
            item.children.splice(this.clickIndex3, 1);
            // item.children[this.clickIndex3].entered = 0;
          }
          this.$set(this.skillTwo, index, item);
        }
        this.emitClose();
      },
      emitClose() {
        this.agreeFlag = false;
        this.hintFlag = false;
      },
      emitSubmit() {
        this.delete();
      },
      selectNumFun(val = []) {
        let data = val.filter(item => item.entered === 1)
        return !!data.length;
      },
      async getList(index = 0, type = 'deposit') {
        let datas = await skillList();
        if (!datas) return
        let data = datas[index] || [];
        let twoItem = data.children2, threeItem = data.children3, newArr = [];
        for (let i = 0; i < twoItem.length; i++) {
          for (let j = 0; j < threeItem.length; j++) {
            if (twoItem[i].id === threeItem[j].pid) {
              threeItem[j].entered = 1;
              newArr.push(threeItem[j]);
            }
          }
          twoItem[i].children = newArr;
          newArr = [];
        }
        this.queryType = type;
        this.skillObj = data;
        this.skillTwo = twoItem;
      },
    },
  }
</script>

<style scoped lang="scss">
  @import "@/css/sky-pop.scss";

  .cate_title {
    display: flex;
    align-items: center;
    height: 80px;
    text-indent: $w_20;
    font-size: 28px;
    background: $white;
    margin: $w_20 $w_15;

    > em {
      font-weight: bold;
    }
  }

  .cate_wrap {
    //padding: $w_30 50px 50px;
    padding: $w_30 20px 50px;
    margin: $w_20 $w_15;
    background: $white;

    .title {
      height: 40px;
      font-size: 28px;
      color: $c_333;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .deleteIcon {
        width: 24px;
        height: 24px;
        background: url("/static/images/auth/trash.png") no-repeat center;
        background-size: 24px 24px;
      }
    }

    .field_wrap {
      color: $c_666;

      .field_item {
        float: left;
        /*width: 180px;*/
        width: 212px;
        height: 56px;
        line-height: 56px;
        text-align: center;
        background: $c_bg;
        margin-top: 30px;
        font-size: 24px;
        position: relative;

        &:not(:nth-child(3n)) {
          margin-right: 20px;
        }
      }

      .delete {
        position: absolute;
        top: 6px;
        right: 6px;
        z-index: 20;
        width: 20px;
        height: 20px;
        background: url("/static/images/gray_delete.png") no-repeat center;
        background-size: 20px;
      }
    }

    .btn_wrap {
      text-align: center;
      padding-top: 50px;
    }

    .custom_btn {
      font-size: 24px;
      width: 171px;
      height: 50px;
      color: $c_666;
      text-align: center;
      line-height: 50px;
      background: $f4f4f4;
      border-radius: 29px;
      border: 1px solid $dfdfdf;
    }
  }

</style>
