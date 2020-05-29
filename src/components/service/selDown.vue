<template>
  <!-- 未实现 请勿使用 -->
  <div class="sel-down-box">
    <span>服务</span>
    <van-icon name="arrow-down" color="#666" size="0.186rem" />
    <ul class="sel-down">
      <slot name="sel-item"></slot>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'selDown',
  props: ['sel'],
  model: {
    prop: 'sel',
    event: 'change'
  }
}
</script>

<style scoped lang="scss">
.sel-down-box {
  width: 100%;
  height: 100%;
  @include flex;
  span {
    margin-right: 10px;
    margin-left: 20px;
  }
  position: relative;
  .sel-down {
    @include borderBox;
    padding: 0 15px;
    color: #fff;
    background: rgba(0, 0, 0, 0.8);
    top: 90px;
    position: absolute;
    @include round(10px);
    &::after {
      position: absolute;
      content: " ";
      margin: auto;
      left: 0;
      right: 0;
      top: -14px;
      width: 0;
      height: 0;
      border-left-width: 10px;
      border-bottom-width: 14px;
      border-right-width: 10px;
      border-top-width: 0;
      border-style: solid;
      border-left-color: transparent;
      border-right-color: transparent;
      border-bottom-color: rgba(0, 0, 0, 0.8);
      border-top-color: transparent;
    }
    .sel-items {
      @include borderBox;
      padding: 20px 25px;
      border-bottom: 1px solid #eee;
      width: 150px;
      &:last-child {
        border: none;
      }
      @include flex;
      font-size: 26px;
      font-family: $font;
      font-weight: 400;
      line-height: 1;
    }
  }
}
</style>
