<template>
  <div class="order-comment">
    <!-- 雇主评价完成 -->
    <template v-if="employerEnd">
      <div class="flex-box">
        <span>{{evaluationOfSer}}的评价</span>
        <commentIcon class="icon-alone" :type="comments.evaluate" :showRate="false"></commentIcon>
        <span>{{comments.u_time}}</span>
      </div>
      <div class="flex-box">
        <van-rate v-model="comments.attitude" color="#F3262D" void-icon="star" readonly size="0.4rem" gutter="0.146rem" />
        <span class="rate-txt">服务态度：{{comments.attitude}}分</span>
      </div>
      <div class="flex-box">
        <van-rate v-model="comments.speed" color="#F3262D" void-icon="star" readonly size="0.4rem" gutter="0.146rem" />
        <span class="rate-txt">工作速度：{{comments.speed}}分</span>
      </div>
      <div class="flex-box">
        <van-rate v-model="comments.quality" color="#F3262D" void-icon="star" readonly size="0.4rem" gutter="0.146rem" />
        <span class="rate-txt">完成质量：{{comments.quality}}分</span>
      </div>
      <div class="flex-box">
        {{comments.u_content}}
      </div>
      <!-- 服务商已经解释 -->
      <div class="flex-box" v-if="explainEnd">
        {{nowExplainRole}}的解释：{{comments.explain}}
      </div>
      <div class="contract-btn" v-else-if="role === 1" @click="goExp">我要解释</div>
    </template>
    <!-- 雇主评价完成 -->
    <!--div class="split"></!--div>
    <!-- 服务商评价完成 -->
    <template v-if="serviceEnd">
      <div class="flex-box" style="padding-top:20px;">
        <span>{{evaluationOfBoss}}的评价</span>
        <commentIcon class="icon-alone" :type="comments.s_evaluate" :showRate="false"></commentIcon>
        <span>{{comments.s_time}}</span>
      </div>
      <div class="flex-box">
        {{comments.s_content}}
      </div>
    </template>
    <!-- 服务商评价完成 -->
    <template v-if="showCanComment">
      <p class="m-comment-top">项目完成后可评价对方</p>
      <div class="contract-btn" :class="{'dis-btn':orderInfo.order_status !== 6}" @click="goEval">评价{{evaluationOfWho}}</div>
    </template>
  </div>
</template>

<script>
import commentIcon from '@/components/service/detail/commentIcon'
export default {
  name: 'orderComment',
  props: ['role', 'orderInfo'], // 1 服务商 2雇主
  components: {
    commentIcon
  },
  computed: {
    evaluationOfWho () {
      // 评价谁
      return this.role === 1 ? '雇主' : '服务商'
    },
    evaluationOfBoss () {
      // 评价雇主的
      return this.role === 1 ? '您对雇主' : '服务商对您'
    },
    evaluationOfSer () {
      // 评价服务商的
      return this.role === 1 ? '雇主对您' : '您对服务商'
    },
    nowExplainRole () {
      // 解释的主角
      return this.role === 1 ? '您' : '服务商'
    },
    showCanComment () {
      // 验收后可以评价话语
      return !this.comments ||
        (this.role === 2 && !this.employerEnd) ||
        (this.role === 1 && !this.serviceEnd)
    },
    comments () {
      return this.orderInfo.comments
    },
    employerEnd () {
      // 雇主是否评价
      if (this.comments) {
        return this.comments.u_status === 1
      } else {
        return false
      }
    },
    serviceEnd () {
      // 服务商是否评价
      if (this.comments) {
        return this.comments.s_status === 1
      } else {
        return false
      }
    },
    explainEnd () {
      // 服务商是否解释
      if (this.comments) {
        return this.comments.explain !== ''
      } else {
        return false
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
    goEval () {
      this.$router.push({ path: '/serviceComment', query: { sn: this.orderInfo.order_sn, role: this.role } })
    },
    goExp () {
      this.$router.push({ path: '/serviceExplain', query: { sn: this.orderInfo.order_sn, role: this.role } })
    }
  }
}
</script>

<style scoped lang="scss">
.order-comment {
  // color: #666;
  .icon-alone {
    margin-left: 20px;
    margin-right: 30px;
  }
  .m-comment-top{
    margin-top:20px;
    padding-top:20px;
    border-top:1px solid #eee;
  }
  .flex-box {
    @include flex(flex-start);
    margin-bottom: 10px;
    line-height: 33px;
  }
  .rate-txt {
    margin-left: 21px;
  }
  .split {
    height: 1px;
    background: #eee;
    margin: 20px auto;
    @include borderBox;
  }
}
</style>
