<template>
  <div class="info-con">
    <van-image class="logo" :noOss="false" :src="orderInfo.img" lazy-load />
    <div class="right">
      <div class="con-item">
        <p class="price">￥{{orderInfo.price}}</p>
        <p class="van-ellipsis name">{{orderInfo.name}}</p>
      </div>
      <div class="con-item">
        <p>{{orderInfo.spec}}</p>
      </div>
      <div class="con-item">
        <p>{{orderInfo.employee && orderInfo.employee.store_name}}</p>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @Description: 服务信息概览
 * @Date: 2019-11-21 10:30:34
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export default {
  name: 'serInfoCon',
  props: ['orderInfo']
}
</script>

<style scoped lang="scss">
.info-con {
  @include flex;
  align-items: stretch;
  margin-top: 20px;
  width:100%;
  .logo {
    width: 200px;
    height: 120px;
    margin-right: 15px;
  }
  .right {
    @include flex;
    align-items: flex-start;
    flex-direction: column;
    width:460px;
    flex:1;
    .con-item {
      @include flex;
      font-size: 24px;
      font-family: $font;
      font-weight: 400;
      margin-top: 11px;
      width:100%;
      &:first-child {
        margin-top: 0;
      }
      .price {
        font-size: 30px;
        font-weight: 600;
        color: $red;
        margin-right:10px;
      }
      .name {
        font-size: 26px;
        font-weight: 400;
        flex: 1;
        // width:307px;
      }
    }
  }
}
</style>
