<template>
  <div class="service-side">
    <van-overlay :show="show" @click="close" z-index="99" />
    <div class="side-con">
      <sideItem v-if="screeningData.brandList" :oblig="screeningData.brandList" v-model="oblig.brand" :isStrech.sync="strech" @open="itemOpen"></sideItem>
      <sideItem v-if="screeningData.realmList" :oblig="screeningData.realmList" v-model="oblig.field" :isStrech.sync="strech" @open="itemOpen"></sideItem>
      <sideItem v-if="screeningData.getRegion" :oblig="screeningData.getRegion" v-model="oblig.region" :isStrech.sync="strech" @open="itemOpen"></sideItem>
      <sideItem v-if="screeningData.priceInterval" :oblig="screeningData.priceInterval" v-model="oblig.price" :priceMin.sync="oblig.priceMin" :priceMax.sync="oblig.priceMax" :isStrech.sync="strech"></sideItem>
      <!-- <sideItem v-if="screeningData.filterSpec" :oblig="screeningData.filterSpec" v-model="oblig.traffic" :isStrech.sync="strech"></sideItem> -->
      <div class="side-btn-box">
        <div class="side-btn" @click="close">取消</div>
        <div class="side-btn" @click="sure">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import sideItem from '@/components/service/sideItem'
import { getScreeningList } from '@/api/service'
export default {
  name: 'serviceSide',
  props: ['cid', 'show', 'sideOblig'],
  data () {
    return {
      oblig: {
        brand: undefined, // 品牌
        field: undefined, // 领域
        region: undefined, // 地区
        price: undefined, // 价格
        traffic: undefined, // 流量
        priceMin: undefined,
        priceMax: undefined
      },
      oldOblig: null,
      strech: '',
      screeningData: {}
    }
  },
  components: {
    sideItem
  },
  created () {
    this.claInit()
  },
  watch: {
    show: function (val) {
      if (val === true) this.oblig = { ...this.oblig, ...this.sideOblig }
    }
  },
  methods: {
    close (update) {
      if (this.strech !== '') {
        // 子项正展开
        this.oblig = Object.assign({}, this.oldOblig)
        this.oldOblig = null
        this.strech = ''
        return
      }
      this.$emit('close', update === true ? Object.assign({}, this.oblig) : undefined)
    },
    sure () {
      if (this.strech !== '') {
        // 子项正展开
        this.oldOblig = null
        this.strech = ''
        return
      }
      this.close(true)
    },
    itemOpen (over) {
      this.oldOblig = Object.assign({}, this.oblig)
    },
    async claInit () {
      // 筛选分类初始化
      const data = await getScreeningList(this.cid)
      if (!data) return
      this.screeningData = data
    }
  }
}
</script>

<style scoped lang="scss">
.service-side {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  @include flex(flex-end);
  z-index: 101;
  .side-con {
    width: 640px;
    height: 100%;
    overflow-y: auto;
    background: #f4f6f8;
    z-index: 100;
    padding-bottom: 143px;
    position: relative;
    @include borderBox;
    // padding-top:88px;
    .side-btn-box {
      position: fixed;
      bottom: 0;
      right: 0;
      margin: auto;
      width: 640px;
      height: 88px;
      @include borderBox;
      @include flex;
      z-index:10;
      .side-btn {
        flex: 1;
        height: 100%;
        text-align: center;
        line-height: 88px;
        font-size: 30px;
        font-family: $font;
        font-weight: 400;
        background: $red;
        color: #fff;
        &:first-child {
          background: #fff;
          color: #333;
          box-shadow:-1px 0px 1px 0px rgba(0,0,0,0.5);
        }
      }
    }
  }
}
</style>
