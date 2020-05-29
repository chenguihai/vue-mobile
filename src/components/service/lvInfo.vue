<template>
  <div class="level-info">
    <p class="level" v-if="oblig.shopLevel">{{oblig.shopLevel.bl_name}}</p>
    <p class="level" v-if="oblig.shop_level && oblig.shop_level.bl_name">{{oblig.shop_level.bl_name}}</p>
    <p class="type" :class="{typey:oblig.type_id !== 2}">{{oblig.type_id === 2 ? '企业' : '个人'}}</p>
    <!--vip等级-->
    <van-image v-if="oblig.vipLevel" class="vip_level" :noOss="false" :src="oblig.vipLevel" lazy-load/>
    <van-image v-else-if="oblig.vip_level" class="vip_level" :noOss="false"
               :src="oblig.vip_level &&(oblig.vip_level.icon || oblig.vip_level)" lazy-load/>
    <p class="vip" v-if="oblig.vipLevel">{{oblig.vipLevel.bl_name}}</p>
    <!--保证金-->
    <template v-if="type">
      <p class="bond_warp" v-if="oblig.unpaidMargin">
        <span class="bond">{{parseInt(oblig.unpaidMargin)}}</span></p>
      <p class="bond_warp" v-else-if="oblig.marginsum">
        <span class="bond">{{parseInt(oblig.marginsum)}}</span></p>
    </template>
  </div>
</template>

<script>
    export default {
        name: 'lvInfo',
        props: ['oblig', 'type']
    }
</script>

<style scoped lang="scss">
  .level-info {
    margin-top: 16px;
    margin-left: 10px;
    color: #fff;
    font-size: 20px;
    font-family: $font;
    font-weight: 500;
    @include flex(flex-start);

    .level,
    .type {
      margin-right: 10px;
      @include borderBox;
      padding: 3px 5px;
      @include round(4px);
    }

    .level {
      background: #ffa24f;
      /*width: 90px;*/
      text-align: center;
    }

    .type {
      background: #9eadfe;

      &.typey {
        background: #ffa24f;
      }
    }

    .vip_icon {
      img {
        width: rem(78);
        height: rem(32);
      }
    }

    .vip_level {
      margin-right: 10px;
    }

    .bond_warp {
      display: inline-flex;
      align-items: center;
      height: 34px;
      border-radius: 10px;
      overflow: hidden;
      background: $green url("/static/images/bond.png") no-repeat left center;
      background-size: auto 34px;
      border-radius: 2px;

      .bond {
        font-size: 22px;
        padding: 0 6px 0 42px;
      }
    }
  }
</style>
<style lang="scss">
  .vip_level {
    height: 34px;

    .van-image__img {
      height: 100%;
      width: auto;
      display: inline-block;
    }
  }
</style>
