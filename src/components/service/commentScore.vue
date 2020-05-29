<template>
  <div class="top">
    <div class="title">
      <p>{{who}}综合评分</p>
      <p style="color:#F3262D;">{{score}}</p>
      <van-rate :readonly="true" gutter="0.08rem" size="0.33rem" v-model="score" color="#ee0a24"
                void-icon="star" void-color="#eee"/>
    </div>

    <div class="con-box">
      <div class="con">
        <p>工作质量<span :style="{color:commonColor(scoreDiff.quality)}">{{scoreData.quality}}</span></p>
        <p>比同类型{{scoreDiff.quality | serviceDiffText}}<span v-if="scoreDiff.quality !== 0"
          :style="{color:commonColor(scoreDiff.quality)}">{{scoreDiff.quality | abs}}%</span>
        </p>
      </div>
      <div class="con">
        <p>服务态度<span :style="{color:commonColor(scoreDiff.attitude)}">{{scoreData.attitude}}</span></p>
        <p>比同类型{{scoreDiff.attitude | serviceDiffText}}<span v-if="scoreDiff.attitude !== 0"
          :style="{color:commonColor(scoreDiff.attitude)}">{{scoreDiff.attitude | abs}}%</span>
        </p>
      </div>
      <div class="con">
        <p>完成速度<span :style="{color:commonColor(scoreDiff.speed)}">{{scoreData.speed}}</span></p>
        <p>比同类型{{scoreDiff.speed | serviceDiffText}}<span v-if="scoreDiff.speed !== 0"
          :style="{color:commonColor(scoreDiff.speed)}">{{scoreDiff.speed | abs}}%</span>
        </p>
      </div>
    </div>
  </div>

</template>

<script>
    import {serviceDiffText, abs} from '@/utils/filters'

    export default {
        name: 'commentScore',
        components: {},
        filters: {serviceDiffText, abs},
        props: {
            score: {
                type: Number,
                default: 0
            },
            scoreData: {
                type: Object,
                default: () => ({})
            },
            scoreDiff: {
                type: Object,
                default: () => ({})
            },
            who: {
                type: String,
                default: '服务'
            }
        },
        data() {
            return {}
        },
        methods: {
            commonColor(data) {
                let num = +data || 0;
                return num > 0 ? '#F3262D' : num === 0 ? '#FF9B2F' : '#A1DF2A';
            }
        }
    }
</script>

<style scoped lang="scss">
  .top {
    @include borderBox;
    padding: 20px 30px;
    background: #fff;
    margin-top: 20px;
    font-size: 24px;
    font-family: $font;
    font-weight: 400;
    color: #666;
    width: 100%;

    .title {
      @include flex(flex-start);

      .rate {
        margin-left: 10px;
      }
    }

    .con-box {
      margin-top: 30px;
      @include flex;

      .con {
        height: 130px;
        border-right: 1px solid #ccc;
        @include borderBox;
        @include flex(center);
        flex-direction: column;
        text-align: center;
        flex: 1;

        &:first-child {
          // align-items: flex-start;
        }

        &:last-child {
          border: none;
          // align-items: flex-end;
        }

        p {
          &:last-child {
            margin-top: 10px;
          }
        }
      }
    }
  }
</style>
