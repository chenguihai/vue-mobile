<template>
  <div class="demand">
    <HeadNav title="服务需求详情"></HeadNav>
    <div class="ser-dem">
      <h3>服务需求</h3>
      <div class="dem-con" v-html="orderDetail.service_demand">
        <!-- <p>一，颜色活泼 ，学习在人们心中永远是一种快乐的事，不能采用过于沉稳或是偏冷的色调，需要将整体颜色风格处理得明快活泼一些，带给人们一种美好的视觉感观。</p>
        <p>二，简单大气 对于幼儿园来说，始终是一个相对干净单纯的培养幼儿的环境，因此不适合使用过多的繁复华丽的图案或是花纹，简单、鲜明、主题突出、大气是设计的宗旨。主要有学生
          校服、书包、教职人员工服、校旗、校车大堂背景墙。</p> -->
      </div>
      <template v-if="orderDetail.demand_files && orderDetail.demand_files.length > 0">
        <h3>服务需求附件</h3>
        <div class="files">
          <a v-for="(file, idx) in orderDetail.demand_files" :key="idx" :href="$store.state.ali_api_host + file.url" :download="file.name">{{file.name}}</a>
        </div>
      </template>
    </div>
    <div class="additional" v-if="orderDetail.supplement.length > 0">
      <h3>补充需求</h3>
      <div class="dem-con" v-for="con in orderDetail.supplement" :key="con.id">
        <p class="audit" :class="{un: con.status !== 1 }">{{con.created_at | created_time}} {{con.status | UIstatus}}</p>
        <p class="audit un" v-if="con.status === 2">未通过原因：{{con.reason}}</p>
        <div v-html="con.require"></div>
        <div class="files" v-if="con.files.length > 0">
          <a v-for="(file, idx) in con.files" :key="idx" :href="$store.state.ali_api_host + file.url" :download="file.name">{{file.name}}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { downloadMixin } from '@/utils/mixins'
import { getOrderDetail } from '@/api/service'
import moment from 'moment'
const suppleStatusList = new Map([
  [0, '等待客服审核'],
  [1, '客服审核通过'],
  [2, '客服审核未通过']
])
export default {
  name: 'demand',
  mixins: [downloadMixin()],
  filters: {
    UIstatus (status) {
      return suppleStatusList.get(status)
    },
    created_time (created_at) {
      return moment(created_at).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  data () {
    return {
      orderSn: this.$route.query.sn,
      orderDetail: {
        supplement: []
      }
    }
  },
  created () {
    this.dataInit()
  },
  methods: {
    async dataInit () {
      const data = await getOrderDetail(this.orderSn)
      if (!data) return
      this.orderDetail = data
    }
  }
}
</script>

<style scoped lang="scss">
.demand {
  // height: 100%;
  // @include flex;
  // flex-direction: column;
  .header {
    height: 88px;
  }
  .ser-dem,
  .additional {
    background: #fff;
    @include borderBox;
    padding: 20px 30px;
    margin-top: 20px;
  }
  h3 {
    font-size: 28px;
    font-family: $font;
    font-weight: 400;
    color: #333;
  }
  .dem-con {
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 24px;
    font-family: $font;
    font-weight: 400;
    line-height: 33px;
    .audit {
      font-size: 22px;
      line-height: 30px;
      color: #28962c;
      &.un {
        color: #f3262d;
        margin-top: 5px;
      }
    }
  }
  .files {
    font-size: 22px;
    font-family: $font;
    font-weight: 400;
    @include flex;
    flex-wrap: wrap;
    margin-top: 10px;
    color: #0066cc;
    p {
      margin-right: 50px;
    }
  }
}
</style>
