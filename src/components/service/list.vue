<template>
  <div class="service-lists">
    <comLoading v-if="once && isLoading"></comLoading>
    <listBox :refreshLoading.sync="isLoading" :listLoading.sync="listLoading" :dataArr="dataArr" :dataObj="dataObj" @load="loadData">
      <listItems :oblig="item" class="items" v-for="item in dataArr" :key="item.id" />
    </listBox>
    <upBack></upBack>
  </div>
</template>
<script>
import listItems from '@/components/service/listItems'
import listBox from '@/components/service/listBox'
import upBack from '@/components/service/upBack'
import comLoading from '@/components/service/comLoading'
import { getServiceList } from '@/api/service'

export default {
  name: 'list',
  props: ['oblig', 'sideOblig', 'sorts'],
  components: { listItems, upBack, listBox, comLoading },
  data () {
    return {
      listLoading: false,
      isLoading: true,
      error: false,
      once: true,
      dataArr: [],
      dataObj: {},
      tag: this.$route.query.tag
    }
  },
  computed: {
    sortsCopy () {
      return this.sorts
    },
    reqOpts () {
      let tmp = {}
      let k = ''
      for (let [key, val] of Object.entries(this.sideOblig)) {
        if (!val) continue
        // 领域,价格特殊处理
        k = key === 'field' ? 'realm_id' : ['priceMin', 'priceMax'].includes(key) ? key : `${key}_id`
        tmp[k] = val.id || val
      }
      return { ...this.sorts, ...this.oblig, ...tmp, tag: this.tag }
    }
  },
  methods: {
    loadData (page) {
      page === 1 ? this.onRefresh() : this.getData(page)
    },
    async onRefresh () {
      await this.getData(1)
      // this.$toast('刷新成功')
      this.isLoading = false
      this.once = false
    },
    async getData (page) {
      this.listLoading = true
      const opts = {
        ...this.reqOpts,
        page
      }
      const data = await getServiceList(opts)
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

<style lang="scss">
.service-lists {
  background: #f4f6f8;
  position: relative;
  width: 100%;
  padding-top: 20px;
  .list {
    @include borderBox;
    width: 100%;
    transform: translate(2.5%, 0);
  }
  .items {
    margin-bottom: 20px;
    padding-bottom: 20px;
    display: inline-block;
    
    &:nth-child(odd){
      margin-right: 20px;
    }
  }
}
</style>
