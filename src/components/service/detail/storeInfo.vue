<template>
  <div class="store-info">
    <div class="top">
      <van-image class="logo" :noOss="!info.logo" :src="info.logo || require('@/assets/service/ser_ava.png')" />
      <div class="text-info">
        <div class="name">
          <p class="van-ellipsis">{{info.store_name}}</p>
          <van-icon name="arrow" size="0.4rem"/>
        </div>
        <lvInfo style="margin-left:0;" :oblig="info"></lvInfo>
        <div class="position">
          <van-icon name="location" color="#F3262D" />
          <span>{{info.name}}</span>
        </div>
        <div class="rate">
          <p>服务态度<span style="color:#F3262D">{{info.attitude}}</span>分</p>
          <p>工作速度<span style="color:#FF9B2F">{{info.speed}}</span>分</p>
          <p>完成质量<span style="color:#A1DF2A">{{info.quality}}</span>分</p>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="items">
        <p>{{origin.cpy || '无'}}</p>
        <p>隶属媒体公司</p>
      </div>
      <div class="items">
        <p>{{origin.type || '无'}}</p>
        <p>所属媒介资质</p>
      </div>
      <div class="items">
        <p>{{origin.num}}个</p>
        <p>拥有证书</p>
      </div>
    </div>
  </div>
</template>

<script>
import lvInfo from '@/components/service/lvInfo'
export default {
  name: 'storeInfo',
  props: ['info', 'origin'],
  components: { lvInfo }
}
</script>

<style scoped lang="scss">
.store-info {
  width: 100%;
  font-family: $font;
  @include borderBox;
  .top,
  .text-info,
  .name,
  .position,
  .rate,
  .bottom,
  .items {
    @include flex;
  }
  .top {
    @include borderBox;
    .logo {
      @include square(180);
      margin-right: 20px;
    }
    .text-info {
      flex-direction: column;
      align-items: flex-start;
      flex: 1;
      .name {
        font-size: 24px;
        font-weight: 400;
        color: #333;
        width: 100%;
      }
      .position {
        justify-content: flex-start;
        font-size: 20px;
        font-weight: 400;
        margin-top: 16px;
        color: #666;
        span {
          margin-left: 10px;
        }
      }
      .rate {
        width: 100%;
        font-size: 20px;
        font-weight: 400;
        color: #999;
        margin-top: 16px;
        // p {
        //   flex: 1;
        //   transform: scale(0.833);
        // }
      }
    }
  }
  .items {
    flex-direction: column;
    height: 68px;
    border-right: 1px solid #dfdfdf;
    flex: 1;
    @include borderBox;
    margin-top: 30px;
    &:last-child {
      border: none;
    }
    p {
      // text-align: center;
      font-size: 26px;
      font-weight: 400;
      color: #333;
      &:last-child {
        color: #666;
        font-size: 22px;
      }
    }
  }
}
</style>
