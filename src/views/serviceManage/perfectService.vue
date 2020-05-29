<template>
  <div class="container">
    <head-nav title="发布服务"></head-nav>
    <div class="company_name">
      <!--第二步-->
      <van-cell-group>
        <!--主图-->
        <div class="upload_wrap">
          <h4 class="title">图册</h4>
          <comUpload ref="comUpload" v-model="imageList" :multiples="false">
            <div slot="tips" class="need-tip">
              <p>上传图片比例最佳为5:3</p>
            </div>
          </comUpload>
        </div>
        <ul class="jump_wrap">
          <a tag="li" class="item" :href="`/serviceIntroduce?id=${selectId}&type=pc`">
            <span class="name">详细描述</span>
            <span class="text" v-if="introduceObj.pc">已填写</span>
            <img class="arrow" src="@/assets/auth/arrow_right_gray.png" alt="">
          </a>
          <a tag="li" class="item" :href="`/addSpecs?id=${selectId}`">
            <span class="name">规格（可选）</span>
            <span class="text" v-if="upFlag">已选择</span>
            <span class="place" v-else>请选择</span>
            <img class="arrow" src="@/assets/auth/arrow_right_gray.png" alt=""></a>
          <a tag="li" class="item" :href="`/addAttribute?id=${selectId}`">
            <span class="name">属性（可选）</span>
            <span class="text" v-if="downFlag">已选择</span>
            <span class="place" v-else>请选择</span>
            <img class="arrow" src="@/assets/auth/arrow_right_gray.png" alt=""></a>
          <a tag="li" class="item" :href="`/serviceIntroduce?id=${selectId}&type=case`">
            <span class="name">相关案例介绍（可选）</span>
            <span class="text" v-if="introduceObj.case">已填写</span>
            <img class="arrow" src="@/assets/auth/arrow_right_gray.png" alt=""></a>
          <a tag="li" class="item" :href="`/serviceIntroduce?id=${selectId}&type=biography`">
            <span class="name">相关传记介绍（可选）</span>
            <span class="text" v-if="introduceObj.biography">已填写</span>
            <img class="arrow" src="@/assets/auth/arrow_right_gray.png" alt=""></a>
        </ul>
        <fixed-btn name="确认发布" @submit="onSubmit"></fixed-btn>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
  import comUpload from "@/components/service/comUpload";
  import FixedBtn from "@/components/common/FixedBtn";
  import {showEdit, serviceEdit} from '@/api/serviceManage'
  import {mapMutations} from 'vuex'

  export default {
    name: "perfectService",
    components: {comUpload, FixedBtn},
    data() {
      return {
        selectId: 0,
        galleryForm: {
          action: 3,//	是	integer	编辑页面: 1基础信息,2详细介绍,3图库,4规格属性
          id: '',//	是	integer	服务id
          pic: '',//	是	json	[{“url”:”uploads/images/201909/03/201909031021073155.jpg”,”sort”:1}]
        },
        introduceObj: {},
        imageList: [],
        oldImageList: [],
        upList: [],
        downList: [],
        downFlag: false,
        upFlag: false,
        serviceFlag: false
      }
    },
    created() {
      localStorage.removeItem('serviceData');
      let {id = 0} = this.$route.query;
      this.selectId = id;
      if (id) {
        this.getList(id)
      }
    },
    methods: {
      ...mapMutations(['SERVICE_SPEC', 'SERVICE_GALLERY', 'SERVICE_INTRODUCE']),
      onSubmit() {
        if (this.imageList.length === 0) {
          this.$router.push({path: "/serviceManage"});
          return
        }
        this.imageList = this.imageList.map(item => {
          item.sort = item.sort || 1
          return item;
        })
        this.editService();
      },
      async getList(id) {
        let params = {
          id: +id,//	是	integer	服务id
          action: 5,//	是	integer	编辑页面: 1基础信息,2详细介绍,3图库,4规格属性,5 返回2,3,4
        }
        const data = await showEdit(params);
        if (!data) return
        const {service_images = [], service_info = {}, spec: {up = [], down = []}} = data;
        this.introduceObj = service_info;
        this.imageList = service_images;
        this.oldImageList = service_images;
        this.upList = up;
        this.downList = down;
        this.upFlag = up.some(item => item.checked === 1)
        this.downFlag = down.some(item => item.checked === 1)
        // this.$store.commit('SERVICE_SPEC', data.spec)
        // this.$store.commit('SERVICE_GALLERY', data.service_images)
        // this.$store.commit('SERVICE_INTRODUCE', data.service_info)
        localStorage.setItem('serviceData', JSON.stringify(data));
      },
      async editService() {
        let params = {pic: JSON.stringify(this.imageList), id: this.selectId, action: 3}
        const data = await serviceEdit(params);
        if (!data) return
        // this.$router.push({path: "/serviceManage", query: {id: this.selectId}});
        if (this.serviceFlag) {
          this.serviceFlag = false;
        } else {
          this.$router.push({path: "/serviceManage"});
        }
      },
    },
    beforeDestroy() {
      let old = this.oldImageList, newImage = this.imageList;
      if (old.length === newImage.length) {
        for (let i = 0; i < old.length; i++) {
          if (old[i].url !== newImage[i].url) {
            this.serviceFlag = true;
            this.onSubmit();
            break;
          }
        }
      } else {
        this.serviceFlag = true;
        this.onSubmit();
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../css/auth";

  .company_name {
    padding-bottom: 128px;
  }

  .upload_wrap {
    padding: $w_20 0;
    margin: 0 $w_30;
    border-bottom: 1px solid $c_ccc;

    .title {
      @include height(37px);
      font-size: 26px;
      margin-bottom: 23px;
    }

    .desc {
      @include height(28px);
      font-size: 20px;
      color: $c_999;
    }
  }
</style>
