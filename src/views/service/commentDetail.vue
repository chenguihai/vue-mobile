<template>
  <div class="comment-detail">
    <HeadNav title="服务评价"></HeadNav>
    <!-- <div class="header"></div> -->
    <commentScore :score="value" :scoreDiff="scoreDiff" :scoreData="scoreData"
                  v-if="scoreData && scoreDiff"></commentScore>

    <div class="bottom">
      <div class="info-box" v-if="comments.commentCount">
        <commentIcon @emit="emitEvaluate" :type="1" events="click" style="color:#666;"
                     :showNum="comments.commentCount.good"
                     :showRate="false"></commentIcon>
        <commentIcon @emit="emitEvaluate" :type="2" events="click" style="color:#666;"
                     :showNum="comments.commentCount.middle"
                     :showRate="false"></commentIcon>
        <commentIcon @emit="emitEvaluate" :type="3" events="click" style="color:#666;"
                     :showNum="comments.commentCount.bad"
                     :showRate="false"></commentIcon>
      </div>
      <div class="comment-list">
        <listBox :refreshLoading.sync="isLoading" :listLoading.sync="listLoading" :dataArr="dataArr" :dataObj="comments"
                 @load="loadData">
          <commentCon :isViews="true" v-for="item in comments.data" :key="item.id" :comment="item"></commentCon>
        </listBox>
      </div>
    </div>
  </div>
</template>

<script>
  import {bodyColor} from '@/utils/mixins'
  import commentIcon from '@/components/service/detail/commentIcon'
  import listBox from '@/components/service/listBox'
  import commentCon from '@/components/service/detail/commentDetail'
  import {getServiceComments} from '@/api/service'
  import commentScore from '@/components/service/commentScore'

  export default {
    name: 'commentDetail',
    components: {commentIcon, listBox, commentCon, commentScore},
    mixins: [bodyColor('box100')],
    data() {
      const {sid = 0} = this.$route.query;
      return {
        value: 4.6,
        comments: {},
        scoreData: null,
        scoreDiff: null,
        dataArr: [],
        listLoading: false,
        isLoading: false,
        form: {
          sid: +sid,//	是	int	服务id
          evaluate: 'good',//	是	好评 good，中评 middle，差评 bad
          page: 1,//	否	int	分页数 默认1可不传
          per_page: 10,//	否	int	每页显示数量
        }
      }
    },
    methods: {
      emitEvaluate(type) {
        this.form.evaluate = type === 1 ? 'good' : type === 2 ? 'middle' : 'bad'
        this.getData(1)
        this.isLoading = false
      },
      loadData(page) {
        page === 1 ? this.onRefresh() : this.getData(page)
      },
      async onRefresh() {
        await this.getData(1)
        this.isLoading = false
      },
      async getData(page) {
        this.listLoading = true
        this.form.page = page;
        const data = await getServiceComments(this.form)
        this.listLoading = false
        if (!data) return
        this.comments = data
        this.dataArr = page === 1 ? data.data : [...this.dataArr, ...data.data]
        this.value = data.comments.avgScore
        this.scoreData = data.comments
        this.scoreDiff = data.serviceStatistic
      }
    }
  }
</script>

<style scoped lang="scss">
  .comment-detail {
    width: 100%;
    height: 100%;
    @include flex;
    @include borderBox;
    flex-direction: column;
    // padding-bottom:54px;
  }

  .header {
    height: 88px;
    width: 100%;
  }

  .bottom {
    @include borderBox;
    background: #fff;
    margin-top: 20px;
    font-size: 24px;
    font-family: $font;
    font-weight: 400;
    color: #666;
    padding: 30px;
    flex: 1;
    width: 100%;
    overflow-y: hidden;
    @include flex;
    flex-direction: column;

    .info-box {
      @include flex;
      padding-bottom: 30px;
      border-bottom: 1px solid #eee;
      width: 100%;
    }

    .comment-list {
      width: 100%;
      flex: 1;
      overflow-y: auto;
    }
  }
</style>
