<template>
  <div class="container">
    <head-nav title="隶属媒体公司"></head-nav>
    <template v-if="dataList.company_name">
      <ul class="belong_wrap">
        <li class="item">公司名称：<span>{{dataList.company_name}}</span></li>
        <li class="item">公司简称：<span>{{dataList.short_name}}</span></li>
        <li class="item">证明方式：<span>{{dataList.type_id | waysProof}}</span></li>
        <li>
          <span>证明图片</span>
          <div class="img_wrap">
            <van-image v-if="dataList.img_certify" class="img" :src="dataList.img_certify+imgUrl" :noOss="false"
                       :lazy-load="true"></van-image>
            <van-image v-if="dataList.img_license" class="img" :src="dataList.img_license+imgUrl" :noOss="false"
                       :lazy-load="true"></van-image>
          </div>
        </li>
        <li class="item">审核状态：<span>{{dataList.status | examineStatus}}</span><span v-if="dataList.status === -1" :title="dataList.remarks">，{{dataList.remarks}}</span>
        </li>
        <!--未通过，证明图片不清晰，请清空后重新添加。 /已通过。-->
      </ul>
      <fixed-btn name="删除" :fixed="1" @submit="agreeFlag = true"></fixed-btn>
    </template>
    <add-company v-else @submit="emitSubmit"></add-company>
    <skyPop v-model="agreeFlag" @change="agreeFlag=false" type="active">
      <template>
        <h5 class="pop-title">温馨提示</h5>
        <p class="pop_delete">删除会将已保存的数据清除，您确定要删除吗？</p>
        <div class="pop-btn" @click="deleteSubmit">确定</div>
      </template>
    </skyPop>
  </div>
</template>

<script>
  import FixedBtn from "@/components/common/FixedBtn";
  import skyPop from "@/components/service/order/skyPop";
  import {companyList, companyDelete} from '@/api/storeInfo'
  import AddCompany from "./addCompany";

  export default {
    name: "belongCompany",
    components: {FixedBtn, skyPop, AddCompany},
    data() {
      return {
        dataList: {},
        agreeFlag: false, //false
        imgUrl: '?x-oss-process=image/resize,m_fill,h_120,w_200'
      }
    },
    created() {
      this.getList();
    },
    methods: {
      deleteSubmit() {
        this.delete();
      },
      emitSubmit() {
        this.getList();
      },
      async getList() {
        const data = await companyList();
        if (!data) return
        this.dataList = data;
      },
      async delete() {
        const data = await companyDelete(this.dataList.id);
        if (!data) return
        this.agreeFlag = false;
        this.dataList = {};
      },
    },
    filters: {
      waysProof: (val) => {
        switch (val) {
          case 1:
            return '营业执照和工牌';
            break;
          case 2:
            return '营业执照和名片';
            break;
        }
      },
      examineStatus: (val) => { //状态：0 待审核 1 审核成功 -1 审核失败 -2 店铺关闭
        let name = '';
        switch (val) {
          case 0:
            name = '待审核';
            break;
          case 1:
            name = '已通过';
            break;
          case -1:
            name = '未通过';
            break;
          case -2:
            name = '店铺关闭';
            break;
        }
        return name;
      }
    },
  }
</script>

<style scoped lang="scss">
  @import "@/css/sky-pop.scss";

  .belong_wrap {
    padding: $w_30;

    & > li {
      font-size: 26px;
      margin: $w_20 0;

      &:last-child {
        color: $c_666;
      }
    }

    .item {
      @include height(37px);
    }

    .img_wrap {
      padding: $w_20 0 $w_10;

      .img {
        width: 200px;
        height: 120px;
        margin-right: $w_20;
      }
    }
  }
</style>

