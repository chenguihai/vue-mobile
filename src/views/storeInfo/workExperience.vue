<template>
  <div class="container bg">
    <head-nav title="工作经历"></head-nav>
    <ul class="work_wrap" v-if="dataList.length >0 ">
      <a tag="li" :href="`/addExperience?id=${item.id}`" class="item"
                   v-for="(item,index) in dataList" :key="item.id">
        <p class="name">{{item.company_name}}</p>
        <div class="time">
          <span>{{item.begin_time | timeFilter}}-{{item.end_time |timeFilter}}</span>
          <span>{{item.position}}</span>
          <i class="deleteIcon" @click.stop="showMedia(item.id,index)"></i>
        </div>
        <p class="num">{{item.nature_name}}／{{item.scale_name}}</p>
      </a>
      <li class="btn_wrap">
        <van-button class="custom_btn" plain type="danger" size="small" :to="{path:'/addExperience'}">添加工作经历
        </van-button>
      </li>
    </ul>
    <add-attribute name="添加工作经历" v-else @submit="emitSubmit">
      <p class="desc">添加工作经历，增强您的实力，让雇主更加信任您！</p>
    </add-attribute>
    <skyPop v-model="agreeFlag" @change="emitClose" type="active">
      <template>
        <h5 class="pop-title">温馨提示</h5>
        <p class="pop_delete">删除会将已保存的数据清除，您确定要删除吗？</p>
        <div class="pop-btn" @click="deleteSubmit">确定</div>
      </template>
    </skyPop>
  </div>
</template>

<script>
  import AddAttribute from '@/components/common/AddAttribute'
  import skyPop from "@/components/service/order/skyPop";
  import {experienceList, experienceDelete, shopScales, shopNatures,} from '@/api/storeInfo'

  export default {
    name: "workExperience",
    components: {AddAttribute, skyPop},
    data() {
      return {
        dataList: [],
        selectId: 0,
        selectIndex: 0,
        agreeFlag: false
      }
    },
    created() {
      this.getList();
      let scales = localStorage.getItem('scalesList');
      let natures = localStorage.getItem('naturesList');
      if (!scales) {
        this.getScales();
      }
      if (!natures) {
        this.getNatures();
      }
    },
    methods: {
      showMedia(id, index) {
        this.agreeFlag = true;
        this.selectId = id;
        this.selectIndex = index;
      },
      emitSubmit() {
        this.$router.push({path: '/addExperience'})
      },
      emitClose() {
        this.agreeFlag = false;
      },
      deleteSubmit() {
        this.delete();
      },
      async getList() {
        const data = await experienceList();
        if (!data) return
        this.dataList = data;
      },
      async delete() {
        const data = await experienceDelete(this.selectId);
        if (!data) return
        this.dataList.splice(this.selectIndex, 1)
        this.emitClose();
      },
      async getScales() {
        const data = await shopScales();
        if (!data) return
        // this.scalesList = data;
        localStorage.setItem('scalesList', JSON.stringify(data));
      },
      async getNatures() {
        const data = await shopNatures();
        if (!data) return
        // this.naturesList = data;
        localStorage.setItem('naturesList', JSON.stringify(data));
      },
    },
    // beforeDestroy() {
    //   localStorage.removeItem('scalesList');
    //   localStorage.removeItem('naturesList');
    // },
    filters: {
      timeFilter(val = '') {
        return val.split(' ')[0].replace(/-/g, '.');
      },
    }
  }
</script>

<style scoped lang="scss">
  @import "@/css/sky-pop.scss";

  .work_wrap {
    background: $white;
    margin: $w_20 15px;

    .btn_wrap {
      padding: 90px 0 100px;
      text-align: center;
    }

    .custom_btn {
      width: 200px;
      @include height(56px);
      text-align: center;
      background: $white;
      font-size: 24px;
      border-radius: 4px;
      border: 1px solid $red;
    }

    .item {
      color: $c_666;
      padding: $w_30 $w_10 $w_30 $w_20;
      border-bottom: 1px solid $c_eee;
      display: block;
    }

    .name, .num {
      @include height(33px);
      font-size: 24px;
      color: $c_333;
    }

    .time {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 33px;
      font-size: 24px;
      margin: 16px 0;
    }

    .deleteIcon {
      width: 44px;
      height: 44px;
      background: url("/static/images/auth/trash.png") no-repeat center;
      background-size: 24px;
    }
  }

</style>
