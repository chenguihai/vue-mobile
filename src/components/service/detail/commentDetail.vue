<template>
  <div class="comment-detail">
    <div class="header">
      <div class="left-box">
        <!-- 头像 -->
        <div class="avatar">
          <van-image class="avatar-img" :noOss="ava.noOss" round :src="ava.src" lazy-load/>
          <p class="van-ellipsis">{{comment.nick_name}}</p>
        </div>
        <!-- 评价 -->
        <commentIcon :type="+comment.evaluate" :value="+comment.avgScore"></commentIcon>
      </div>
      <div class="time">{{comment.u_time | timeFormat}}</div>
    </div>
    <!-- 内容 -->
    <div class="con-box">
      <p :class="showAll">{{comment.u_content}}</p>
      <p :class="showAll" v-if="comment.explain" class="text">
        服务商解释：{{comment.explain}}
      </p>
    </div>
  </div>
</template>

<script>
  import commentIcon from './commentIcon'

  const defaultAva = require('@/assets/service/icon_sign_mobile.png')
  export default {
    name: 'commentCon',
    props: {
      'isViews': {
        type: Boolean,
        default: false
      },
      'comment': Object
    },
    data() {
      return {}
    },
    filters: {
      timeFormat(time) {
        return time.split(' ')[0]
      }
    },
    components: {
      commentIcon
    },
    computed: {
      showAll() {
        return this.isViews ? '' : 'van-multi-ellipsis--l3'
      },
      ava() {
        return {
          src: this.comment.avatar || defaultAva,
          noOss: !this.comment.avatar
        }
      }
    },
    created() {

    },
    mounted() {

    },
    watch: {},
    methods: {}
  }
</script>

<style scoped lang="scss">
  .comment-detail {
    @include borderBox;
    padding: 20px 0;
    border-bottom: 1px solid #eee;
  }

  /*=============================================
  =            基本信息            =
  =============================================*/

  .header {
    @include flex;
    width: 100%;
  }

  .left-box,
  .avatar {
    @include flex(flex-start);
    font-family: $font;
  }

  .avatar {
    margin-right: 30px;

    .avatar-img {
      @include square(60);
    }

    p {
      margin-left: 10px;
      width: 170px;
      font-size: 20px;
      font-weight: 400;
    }
  }

  .time {
    font-size: 20px;
    font-weight: 400;
    color: #999;
  }

  /*=====  End of 基本信息  ======*/

  /*=============================================
  =            内容            =
  =============================================*/

  .con-box {
    font-size: 20px;
    font-weight: 400;
    color: #333;
    line-height: 28px;
    width: 100%;

    p {
      margin-top: 12px;
    }

    .text {
      color: $orange;
    }
  }

  /*=====  End of 内容  ======*/
</style>
