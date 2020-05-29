<template>
  <div class="container">
    <head-nav title="选择分类"></head-nav>
    <!--一级类目-->
    <ul class="cate_wrap">
      <li :class="['cate_item', index <(categoryList.length- categoryList.length%3) ? 'active':'']"
          v-for="(item,index) in categoryList"
          :key="item.id"
          @click="clickOneCate(index)">
        <van-image class="img" :src="item.mobile_icon" :noOss="false" :lazy-load="true"></van-image>
        <span class="text">{{item.cate_name}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
    export default {
        name: "selectCate",
        data() {
            return {
                selectId: '',
                categoryList: []
            }
        },
        created() {
            const {id} = this.$route.query;
            this.selectId = id;
            let categoryExample = localStorage.getItem('categoryExample');
            if (categoryExample) {
                let data = JSON.parse(categoryExample);
                if (data.length === 1) {
                    this.$router.push({path: '/customer/choiceCatethree', query: {id}})
                } else {
                    this.categoryList = data;
                }
            }
        },
        methods: {
            clickOneCate(index) {
                this.$router.push({path: '/customer/choiceCatethree', query: {index: index, id: this.selectId}})
            },
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
