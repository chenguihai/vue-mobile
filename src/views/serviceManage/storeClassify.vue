<template>
  <div class="container">
    <head-nav title="店铺分类" btn="添加" @submit="showClassify"></head-nav>
    <div v-if="storeList.length > 0 " class="class_wrap">
      <ul class="class_list">
        <li class="class_item" v-for="(item,index) in storeList" :key="item.cat_id" @click="clickClassify(index)">
          <span class="name">{{item.cat_name}}</span>
          <i :class="['circle',item.checked ? 'active':'']"></i>
        </li>
      </ul>
    </div>
    <no-data v-else name="您还没有添加店铺分类"></no-data>
    <fixed-btn name="确认" :fixed="1" @submit="onSubmit"></fixed-btn>
    <!--弹框-->
    <skyPop v-model="showPop">
      <template>
        <h5 class="pop-title">添加店铺分类</h5>
        <van-cell-group class="pop-tip borderLR">
          <van-field class="pop_input" :minlength="2" :maxlength="8" v-model="form.cat_name" placeholder="请输入店铺分类名称"/>
        </van-cell-group>
        <div class="pop-btn" @click="addClassify">确定</div>
      </template>
    </skyPop>
  </div>
</template>

<script>
  import NoData from "@/components/noData";
  import FixedBtn from "@/components/common/FixedBtn";
  import skyPop from '@/components/service/order/skyPop'
  import {categoryAdd, categoryList} from '@/api/serviceManage'

  export default {
    name: "storeClassify",
    components: {NoData, FixedBtn, skyPop},
    data() {
      return {
        form: {
          // cat_name: '',//	是	string	分类名称
          // keywords: '',//	是	string	分类关键字
          cat_desc: '',//	是	string	分类描述
          sort_order: 1,//排序
          is_show: 1,//	是	int	是否显示，0 1
        },
        listForm: {
          cname: '',//	否	string	分类名称，查询条件
          page: 1,//	否	int	分页参数，url后面携带
          is_show: 1//否 int	是否显示 （0,1）
        },
        showPop: false,
        storeArr: [],
        storeList: []
      }
    },
    created() {
      let {id = ''} = this.$route.query;
      let data = [];
      let serviceData = localStorage.getItem('publishServiceData');
      if (serviceData) {
        data = JSON.parse(serviceData).store_cate;
      }
      if (id) {
        let selectData = id.split(',');
        for (let i = 0; i < selectData.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (selectData[i] == data[j].cat_id) {
              data[j].checked = true;
              break
            }
          }
        }
      }
      this.storeList = data;
      // this.$router.push({path: '/publishService'})
    },
    methods: {
      onSubmit() {
        let params = '';
        let data = this.storeList.filter(item => item.checked);
        if (data.length > 0) {
          params = data.map(item => item.cat_id).toString();
        }
        this.$router.push({path: "/publishService", query: {class: params}});
      },
      showClassify() {
        this.showPop = true;
      },
      clickClassify(index) {
        let data = this.storeList[index];
        data.checked = !data.checked;
        this.$set(this.storeList, index, data);
      },
      async addClassify() {
        let nameLength = this.form.cat_name.length;
        if(nameLength < 2 || nameLength > 8){
           this.$toast('分类名称由2到8个字符组成');
          return
        }
        const data = await categoryAdd(this.form);
        if (!data) {
          this.$toast('提交失败，请重新提交');
        } else {
          if (data.code === 422) {
            this.$toast(data.message);
            return
          } else {
            this.showPop = false
            this.form.cat_name =''
            this.$toast('添加成功');
            this.getList();
          }
        }
      },
      async getList() {
        const data = await categoryList(this.listForm);
        if (!data) return
        this.storeList = data.data
      },
    }
  }
</script>

<style scoped lang="scss">
  @import "@/css/sky-pop.scss";

  .class_wrap {
    padding: 0 $w_30 168px;
  }

  .class_list {
    font-size: 26px;

    .class_item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: $w_20;
      height: 97px;
      border-bottom: 1px solid $c_ccc;

      .name {

      }

      .circle {
        width: 28px;
        height: 28px;
        border: 1px solid $c_666;
        border-radius: 50%;
        position: relative;

        &.active {
          background: $blue;
          border-color: $blue;

          &:before {
            content: "";
            position: absolute;
            width: 10px;
            height: 10px;
            background: $white;
            left: 50%;
            top: 50%;
            z-index: 10;
            transform: translate(-50%, -50%);
            border-radius: 50%;
          }
        }
      }
    }
  }
</style>

