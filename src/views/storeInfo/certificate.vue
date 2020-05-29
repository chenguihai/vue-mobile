<template>
  <div class="container bg">
    <head-nav title="自传资质"></head-nav>
    <ul class="certify_wrap" v-if="selfList.length > 0">
      <a tag="li" :href="`/addCertificate?id=${item.id}`" class="item"
                   v-for="(item,index) in selfList" :key="item.id">
        <p class="top"><span class="name">{{item.type_name}}</span><span>{{item.received_time}}</span></p>
        <div class="certify">
          <van-image class="img" fit="cover" :noOss="false" :src="item.honor_img+'?x-oss-process=image/resize,m_fill,h_120,w_200'" lazy-load/>
          <i class="deleteIcon" @click.stop="showProp(item.id,index)"></i>
        </div>
      </a>
      <li class="btn_wrap">
        <van-button class="custom_btn" plain type="danger" size="small" :to="{path:'/addCertificate'}">添加自传资质
        </van-button>
      </li>
    </ul>
    <add-attribute name="添加自传资质" v-else @submit="emitSubmit">
      <p class="desc">添加自传资质，增强您的实力，让雇主更加信任您！</p>
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
    import AddAttribute from '@/components/common/AddAttribute'
    import skyPop from "@/components/service/order/skyPop";
    import {selfhonorList, selfhonorDelete} from '@/api/storeInfo'

    export default {
        name: "certificate",
        components: {AddAttribute, skyPop},
        data() {
            return {
                agreeFlag: false,
                selfList: [],
                selectId: 0,
                selectIndex: 0,
            }
        },
        created() {
            this.getList();
        },
        methods: {
            showProp(id, index) {
                this.agreeFlag = true;
                this.selectId = id;
                this.selectIndex = index;
            },
            emitSubmit() {
                this.$router.push({path: '/addCertificate'});
            },
            deleteSubmit() {
                this.delete();
            },
            emitClose() {
                this.agreeFlag = false;
            },
            async getList() {
                let data = await selfhonorList();
                if (!data) return
                this.selfList = data;
            },
            async delete() {
                const data = await selfhonorDelete(this.selectId);
                if (!data) return
                this.selfList.splice(this.selectIndex, 1)
                this.emitClose();
            },
        }
    }
</script>

<style scoped lang="scss">
  @import "@/css/sky-pop.scss";

  .certify_wrap {
    margin: $w_20 15px;
    background: $white;

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
      padding: $w_30 $w_20;
      border-bottom: 1px solid $c_eee;
    }

    .top {
      @include height(33px);
      font-size: 24px;
      margin-bottom: $w_20;
    }

    .name {
      color: $c_333;
      margin-right: $w_20;
    }

    .certify {
      display: flex;
      align-items: start;
      justify-content: space-between;
      height: 120px;

      .img {
        width: 200px;
        height: 120px;
      }
    }

    .deleteIcon {
      width: 24px;
      height: 24px;
      background: url("/static/images/auth/trash.png") no-repeat center;
      background-size: 24px 24px;
      margin-top: $w_20;
    }
  }

</style>
