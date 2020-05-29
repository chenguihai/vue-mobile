<template>
  <ul class="upload_wrap">
    <li class="upload_item" v-for="(item,index) in uploadData" :key="index">
      <h4 class="title">{{item.title}}</h4>
      <div class="upload_content pr">
        <img v-if="fileList.length === 0" class="img" fit="conver" :src="item.src" alt="">
        <img v-else class="img" fit="conver" :src="aliApiHost+subItem.url" alt=""
             v-for="(subItem, idx) in fileList" :key="idx">
        <van-uploader class="btn" :max-count="1" :after-read="afterFile" :before-read="beforeRead">
          <span>{{ fileList.length === 0?item.btnText:item.btnReplace}}</span>
        </van-uploader>
      </div>
    </li>
  </ul>
</template>

<script>
    import {uploadMixin} from '@/utils/mixins'
    import {mapState} from 'vuex'
    import state from "../../store/state";

    export default {
        name: "uploadID",
        mixins: [uploadMixin()],
        props: {
            list: {
                type: Array,
                required: true
            },
            max: {
                type: Number,
                default: 1
            },
            types: {
                type: String,
                default: 'card'
            },
        },
        data() {
            return {
                uploadData: this.list,
            }
        },
        computed: mapState({
            aliApiHost: state => state.ali_api_host
        })
    }
</script>

<style scoped lang="scss">
  .upload_wrap {
    padding: $w_20 $w_30;
  }

  .upload_item {
    padding-top: $w_30;

    .title {
      @include height();
      font-size: 26px;
      margin-bottom: $w_20;
    }

    .img {
      display: block;
      margin: 0 auto;
      width: 500px;
      height: 300px;
    }

    .upload_content {
      border-radius: 20px;
      display: block;
      text-align: center;
    }

    .btn {
      @include centerLT();
      width: 341px;
      @include height(70px);
      opacity: .8;
      text-indent: 76px;
      z-index: 10;
      color: $white;
      text-align: left;
      font-size: 26px;
      border-radius: 35px;
      background: $c_888 url('/static/images/auth/photo.png') no-repeat 30px center;
      background-size: 30px 25px;
    }

    .del-icon {
      position: absolute;
      top: -13px;
      right: -13px;
      z-index: 2;
    }
  }
</style>
