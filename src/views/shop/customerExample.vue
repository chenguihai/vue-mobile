<template>
  <div class="customer">
    <div class="split_line"></div>
    <div class="customer_list">
      <listBox :refreshLoading.sync="isLoading" :listLoading.sync="listLoading" :dataArr="dataArr" :dataObj="dataObj"
               @load="loadData">
        <a tag="div" :href="`/caseDetail?id=${item.id}`" class="customer_link"
                     v-for="item in dataArr" :key="item.id">
          <div class="customer_item">
            <van-image fit="cover" class="img" :src="item.image_url+'?x-oss-process=image/resize,m_fill,h_192,w_320'" :noOss="false"/>
            <p class="name">{{item.case_name}}</p>
          </div>
        </a>
      </listBox>
    </div>
  </div>
</template>

<script>
    import listBox from '@/components/service/listBox'
    import {getStoreCase} from '@/api/shop'

    export default {
        name: 'customerExample',
        components: {listBox},
        data() {
            return {
                value: 2.5,
                list: [],
                finished: false,
                listLoading: false,
                isLoading: false,
                error: false,
                dataArr: [],
                dataObj: {},
                storeId: this.$route.params.id
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
                const opts = {
                    // ...this.oblig,
                    // ...this.sideOblig,
                    // ...this.sorts,
                    page
                }
                const data = await getStoreCase(this.storeId, opts)
                this.listLoading = false
                if (!data) return
                this.dataObj = data
                this.dataArr = page === 1 ? data.data : [...this.dataArr, ...data.data]
            }
        }
    }
</script>

<style scoped lang="scss">
  .customer {
    background: $white;
  }

  .customer_link {
    width: 340px;
  display: block;
    &:not(:nth-child(2n+2)) {
      margin-right: $w_10;
    }
  }

  .customer_item {
    flex: 1;
    margin-top: 20px;
    padding: $w_10 $w_10 $w_20;
    border: 1px solid $c_eee;

    .img {
      width: 320px;
      height: 192px;
      background: $d8d8d8;
    }

    .name {
      height: 66px;
      font-size: 24px;
      font-weight: 500;
      line-height: 33px;
    }
  }
</style>
<style lang="scss">
  .customer_list {
    padding: 0 $w_30 $w_20;

    .list {
      display: flex;
      flex-wrap: wrap;
    }
  }
</style>
