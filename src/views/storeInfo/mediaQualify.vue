<template>
  <div class="container bg">
    <head-nav title="媒介资质"></head-nav>
    <ul class="media_wrap" v-if="mediaList.length>0">
      <a tag="li" :href="`/addMedia?id=${item.id}`" class="item" v-for="(item,index) in mediaList"
                   :key="item.id">
        <p class="title"><span class="name">{{item.type_id | mediasfilter}}</span><span v-if="item.type_id !== 0">{{item.begin_time
          |timeFilter}}-{{item.end_time | timeFilter}}</span>
        </p>
        <div class="img_box">
          <van-image fit="cover" v-if="item.img1" class="img"
                     :src="item.img1+imgUrl" :noOss="false"
                     :lazy-load="true"></van-image>
          <van-image fit="cover" v-if="item.img2" class="img"
                     :src="item.img2+imgUrl" :noOss="false"
                     :lazy-load="true"></van-image>
          <van-image fit="cover" v-if="item.img3" class="img"
                     :src="item.img3+imgUrl" :noOss="false"
                     :lazy-load="true"></van-image>
          <span class="flex_1"></span>
          <i class="deleteIcon" @click.stop="showMedia(item.id,index)"></i>
        </div>
        <p class="status">审核状态：{{item.status |examineStatus}}<span v-if="item.status === -1">，{{item.remarks}}</span>
        </p>
      </a>
      <li class="btn_wrap">
        <van-button class="custom_btn" plain type="danger" size="small" :to="{path:'/addMedia'}">添加媒介资质</van-button>
      </li>
    </ul>
    <add-attribute name="添加媒介资质" v-else @submit="emitSubmit">
      <p class="desc">添加媒介资质，增强您的实力，让雇主更加信任您！</p>
    </add-attribute>
    <!--弹框-->
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
  import AddAttribute from "@/components/common/AddAttribute";
  import {mediaList, mediaAdd, mediaEdit, mediaDelete} from '@/api/storeInfo'
  import skyPop from "@/components/service/order/skyPop";

  export default {
    name: "mediaQualify",
    components: {AddAttribute, skyPop},
    data() {
      return {
        mediaList: [],
        agreeFlag: false,
        selectId: 0,
        selectIndex: 0,
        imgUrl: '?x-oss-process=image/resize,m_fill,h_120,w_200'
      }
    },
    created() {
      this.getList();
    },
    methods: {
      showMedia(id, index) {
        this.agreeFlag = true;
        this.selectId = id;
        this.selectIndex = index;
      },
      emitSubmit() {
        this.$router.push({path: '/addMedia'})
      },
      deleteSubmit() {
        this.delete();
      },
      emitClose() {
        this.agreeFlag = false;
      },
      async getList() {
        const data = await mediaList();
        if (!data) return
        this.mediaList = data;
      },
      async delete() {
        const data = await mediaDelete(this.selectId);
        if (!data) return
        this.mediaList.splice(this.selectIndex, 1)
        this.emitClose();
      },
    },
    filters: {
      timeFilter(val = '') {
        return val.split(' ')[0].replace(/-/g, '.');
      },
      mediasfilter: (val) => {
        let mediasOptions = [
          {value: '直营媒体', lable: '直营媒体', type_id: 0,},
          {value: '一级代理', lable: '一级代理', type_id: 1,},
          {value: '二级代理', lable: '二级代理', type_id: 2,},
          {value: '其他', lable: '其他', type_id: 3,},
        ]
        return mediasOptions[val].lable
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
    }
  }
</script>

<style scoped lang="scss">
  @import "@/css/sky-pop.scss";

  .media_wrap {
    background: $white;
    color: $c_666;
    margin: $w_15;

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
      padding: 0;
    }

    .item {
      padding: $w_30 $w_20;
      border-bottom: 1px solid $c_eee;
      display: block;
    }

    .title {
      @include height(33px);
      font-size: 24px;
    }

    .name {
      color: $c_333;
      margin-right: $w_30;
    }

    .img_box {
      margin: $w_20 0;
      display: flex;
      align-items: center;

      .img {
        margin-right: 16px;
        width: 200px;
        height: 120px;
      }

      .flex_1 {
        flex: 1;
      }
    }

    .deleteIcon {
      width: 44px;
      height: 44px;
      background: url("/static/images/auth/trash.png") no-repeat center center;
      background-size: 24px;
    }

    .status {
     line-height:30px;
      font-size: 22px;
    }
  }
</style>
