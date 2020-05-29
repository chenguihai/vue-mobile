<template>
  <div class="evaluate">
    <div class="split_line"></div>
    <!--店铺综合评分-->
    <commentScore :score="score" :scoreData="scoreData" :scoreDiff="scoreDiff" who="店铺"
                  v-if="scoreData && scoreDiff"></commentScore>
    <div>
      <div class="split_line"></div>
      <!--评论-->
      <div class="evaluate_head" v-if="dataObj.commentCount">
        <commentIcon @emit="emitEvaluate" events="click" :type="1"
                     :style="{color:form.evaluate === 'good'?'#f3262d':'#666'}"
                     :showNum="dataObj.commentCount.good" :showRate="false"></commentIcon>
        <commentIcon @emit="emitEvaluate" events="click" :type="2"
                     :style="{color:form.evaluate === 'middle'?'#f3262d':'#666'}"
                     :showNum="dataObj.commentCount.middle"
                     :showRate="false"></commentIcon>
        <commentIcon @emit="emitEvaluate" events="click" :type="3"
                     :style="{color:form.evaluate === 'bad'?'#f3262d':'#666'}"
                     :showNum="dataObj.commentCount.bad" :showRate="false"></commentIcon>
      </div>
      <!--评论列表-->
      <div class="evaluate_list">
        <listBox :refreshLoading.sync="isLoading" :listLoading.sync="listLoading" :dataArr="dataArr" :dataObj="dataObj"
                 @load="loadData">
          <evaluate-item v-for="item in dataArr" :key="item.id" :comment="item"></evaluate-item>
        </listBox>
      </div>
    </div>
  </div>
</template>

<script>
  import listBox from '@/components/service/listBox'
  import EvaluateItem from './components/evaluateItem'
  import commentScore from '@/components/service/commentScore'
  import commentIcon from '@/components/service/detail/commentIcon'
  import {getStoreComments} from '@/api/shop'

  export default {
    name: 'transactionEvaluate',
    props: ['score', 'scoreData', 'scoreDiff'],
    components: {listBox, EvaluateItem, commentScore, commentIcon},
    data() {
      return {
        list: [],
        finished: false,
        listLoading: false,
        isLoading: false,
        error: false,
        dataArr: [],
        dataObj: {},
        storeId: this.$route.params.id,
        form: {
          page: 1,
          evaluate: 'good',
        }
      }
    },
    methods: {
      emitEvaluate(type) {
        this.form.evaluate = type === 1 ? 'good' : type === 2 ? 'middle' : 'bad'
        this.getData(1)
        this.isLoading = false
      },
      async loadData(page) {
        page === 1 ? await this.onRefresh() : await this.getData(page)
      },
      async onRefresh() {
        await this.getData(1)
        this.isLoading = false
      },
      async getData(page) {
        this.listLoading = true
        this.form.page = page;
        const data = await getStoreComments(this.storeId, this.form)
        this.listLoading = false
        if (!data) return
        this.dataObj = data
        this.dataArr = page === 1 ? data.data : [...this.dataArr, ...data.data]
      }
    },
    computed: {
      // finished () {
      //     return this.dataArr.length >= this.total
      // }
    }
  }
</script>

<style scoped lang="scss">
  .evaluate_wrap {
    color: $c_666;
    padding: $w_20 $w_30 $w_30;
    background: $white;

    .red {
      color: $red;
    }

    .title {
      display: flex;
      align-items: center;
      @include height(33px);
      font-size: 24px;
      margin-bottom: $w_30;
    }
  }

  .shop_evaluate {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 130px;

    .green {
      color: $green;
    }

    .orange {
      color: $orange;
    }

    .item {
      /*height: 130px;*/
      flex: 1;
      padding: 27px 0;
      text-align: center;

      .txt {
        display: block;
        @include height(33px);
        font-size: 24px;
        margin: $w_10 0;
      }

      &:not(:last-child) {
        border-right: 1px solid $c_ccc;
      }
    }
  }

  .evaluate_head {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 96px;
    background: $white;

    .item {
      display: inline-flex;
      align-items: center;
    }

    .icon {
      width: 36px;
      height: 36px;
      margin-right: $w_10;
    }

    .text {
      font-size: 24px;
      color: $c_666;
    }
  }

  .evaluate_list {
    padding: 0 $w_30;
    background-color: $white;
  }
</style>
