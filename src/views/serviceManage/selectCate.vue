<template>
  <div class="container">
    <head-nav title="选择分类"></head-nav>
    <!--一级类目-->
    <ul class="cate_wrap">
      <li :class="['cate_item', index <(cateList.length- cateList.length%3) ? 'active':'']"
          v-for="(item,index) in cateList"
          :key="item.id"
          @click="clickOneCate(index)">
        <van-image class="img" :src="item.mobile_icon" :noOss="false" :lazy-load="true"></van-image>
        <span class="text">{{item.cate_name}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "selectCate",
        components: {},
        data() {
            return {}
        },
        created() {
            let length = this.cateList.length;
            if (length === 0) {
                this.$router.push({path: '/publishService'})
            }
        },
        computed: mapState({
            cateList: state => state.serviceManage.cate,
        }),
        methods: {
            clickOneCate(index) {
                this.$router.push({path: 'choiceCatethree', query: {index: index}})
            }
        }
    }
</script>

<style scoped lang="scss">
  .cate_wrap {
    display: flex;
    flex-wrap: wrap;

    .cate_item {
      display: inline-flex;
      align-items: flex-end;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      /*height: 200px;*/
      width: 33.3333%;
      padding: 36px 0;
    }

    .active {
      border-bottom: 1px solid $c_eee;
    }

    .img {
      display: block;
      width: 84px;
      margin: 0 auto $w_30;
    }

    .text {
      @include height(33px);
      font-size: 24px;
    }
  }

</style>
