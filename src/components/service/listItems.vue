<template>
  <div class="service-items" @click="goDetail">
    <van-image class="ser-img" :src="oblig.img+'?x-oss-process=image/resize,m_fill,h_207,w_355'" :noOss="false" :lazy-load="true"></van-image>
    <p class="ser-name van-multi-ellipsis--l2">{{oblig.name}}</p>
    <div class="ser-market">
      <p class="ser-price">￥{{oblig.price}}/{{oblig.unit_name}}</p>
      <p class="ser-amount">成交量 <span>{{oblig.deal_num}}</span></p>
    </div>
    <div @click.stop="goStore" class="store" v-if="showStore">
      <p class="store-name van-ellipsis" v-if="!is_hot">{{oblig.store_name}}</p>
      <p class="store-name van-ellipsis" v-if="is_hot">{{oblig.shop_info && oblig.shop_info.store_name}}</p>
      <van-icon name="arrow" size="12" color="#999" />
    </div>
    <lvInfo :oblig="oblig" v-if="showLv"></lvInfo>
    <lvInfo :oblig="oblig.shop_info" v-if="is_hot"></lvInfo>
  </div>
</template>

<script>
import lvInfo from './lvInfo'
export default {
  name: 'serviceListItems',
  props: {
    is_hot: {
      type: Boolean,
      default: false
    },
    oblig: Object,
    showLv: {
      type: Boolean,
      default: true
    },
    showStore: {
      type: Boolean,
      default: true
    }
  },
  components: { lvInfo },
  methods: {
    goDetail () {
      // this.$router.push({ path: '/serviceDetail/'+this.oblig.id, query: {id: this.oblig.store_id } })
      window.location.href = `${location.origin}/serviceDetail/${this.oblig.id}?id=${this.oblig.store_id}`;
    },
    goStore () {
      // this.$router.push({ path: '/shopDetail/'+this.oblig.store_id})
      window.location.href = location.origin+"/shopDetail/"+this.oblig.store_id;
    }
  }
}
</script>

<style scoped lang="scss">
.service-items {
  width: 100%;
  max-width: 46.13%;//345px;
  // height: 426px;
  @include round(8px);
  background: #fff;
  @include borderBox;
  padding-bottom: 20px;
  overflow: hidden;
  .ser-img {
    width: 100%;
    height: 207px;
  }
  .ser-name {
    width:94%;// 310px;
    padding: 0 10px;
    font-size: 24px;
    font-family: $font;
    font-weight: 500;
    color: #333;
    height: 66px;
    line-height: 33px;
    overflow: hidden;
  }
  .ser-market,
  .store,
  .info {
    @include flex;
    margin-top: 6px;
    margin-left: 10px;
    @include borderBox;
    padding-right: 25px;
  }
   .store{
     padding-right: 50px;
   }
  .ser-price {
    font-size: 24px;
    font-family: $font;
    font-weight: 500;
    color: $red;
  }
  .ser-amount,
  .store-name,
  .info {
    font-size: 20px;
    font-family: $font;
    font-weight: 500;
    color: #999;
    span {
      color: #0066cc;
      margin-left: 10px;
    }
  }
  .store-name {
    width: 277px;
  }
}
</style>
