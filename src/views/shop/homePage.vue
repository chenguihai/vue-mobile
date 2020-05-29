<template>
  <!--列表-->
  <div class="home_page">
    <listBox :refreshLoading.sync="isLoading" :listLoading.sync="listLoading" :dataArr="dataArr" :dataObj="dataObj"
             @load="loadData">
      <shop-item class="customer_link" v-for="item in dataArr" :key="item.id" :item="item"></shop-item>
    </listBox>
  </div>
</template>

<script>
  import listBox from '@/components/service/listBox'
  import ShopItem from '@/components/common/shopItem'
  import {getStoreService} from '@/api/shop'

  export default {
    name: 'homePage',
    components: {listBox, ShopItem},
    props: ['sorts', 'claid'],
    data() {
      return {
        store_id: this.$route.params.id,
        value: 2.5,
        list: [],
        finished: false,
        listLoading: false,//false
        isLoading: false,//false
        error: false,
        dataArr: [],
        dataObj: {}
      }
    },
    computed: {
      reqOpts() {
        return {
          store_id: this.store_id,
          store_class: this.claid,
          ...this.sorts
        }
      }
    },
    methods: {
      async loadData(page) {
        page === 1 ? await this.onRefresh() : await this.getData(page)
      },
      async onRefresh() {
        await this.getData(1)
        this.isLoading = false
      },
      async getData(page) {
        this.listLoading = true
        const opts = Object.assign(this.reqOpts, {page})
        const data = await getStoreService(opts)
        this.listLoading = false
        if (!data) return
        this.dataObj = data
        this.dataArr = page === 1 ? data.data : [...this.dataArr, ...data.data]
      }
    },
    watch: {
      reqOpts: {
        handler: function (val, oval) {
          this.loadData(1)
        },
        deep: true
      }
    }
  }
</script>

<style scoped lang="scss">
  .home_page {
    padding: 0 $w_30;
    background-color: $white;

    .customer_link {
      width: 49%;//340px;

      &:not(:nth-child(2n+2)) {
        margin-right: $w_10;
      }
    }
  }
</style>
<style lang="scss">
  .home_page {
    .list {
      display: flex;
      flex-wrap: wrap;

      .van-list__finished-text {
        margin: 0 auto;
        width: 100%;
      }

      .van-list__loading {
        width: 100%;
      }
    }
  }
</style>
