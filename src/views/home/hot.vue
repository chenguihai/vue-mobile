<template>
  <div class="m-hot-wrap">
    <head-nav title="热卖媒体"></head-nav>
    <div class="m-hot-brand">
      <div class="m-brand-title">
        热卖品牌
      </div>
      <ul>
        <li v-for="(item,index) in brandList" :key="index">
          <a :href="'/serviceList?bid='+item.id+';'+item.name">
            <img :src="$store.state.ali_api_host + item.logo" alt="" />
            <p>{{item.name}}</p>
          </a>
        </li>

      </ul>
    </div>
    <div class="service-li">
      <h3 class="m-brand-title">热卖媒体</h3>
      <listBox :refreshLoading.sync="isLoading" :listLoading.sync="listLoading" :dataArr="dataArr" :dataObj="dataObj" @load="loadData">
        <listItems :showLv="false" :is_hot="true" :oblig="item" class="items" v-for="(item,index) in dataArr" :key="index" />
      </listBox>
      <upBack></upBack>
    </div>

  </div>
</template>

<script>
import listItems from '@/components/service/listItems'
import listBox from '@/components/service/listBox'
import upBack from '@/components/service/upBack'
import HeadNav from '@/components/common/HeadNav'
import { cateInfo } from '@/api/home'
export default {
  name: 'hot',
  data () {
    return {
      showMenu: false,
      brandList: [],
      listLoading: false,
      isLoading: false,
      error: false,
      dataArr: [],
      dataObj: {}
    }
  },
  components: {
    HeadNav, listItems, upBack, listBox
  },
  methods: {
    loadData (page) {
      page === 1 ? this.onRefresh() : this.getData(page)
    },
    async onRefresh () {
      await this.getData(1)
      // this.$toast('刷新成功')
      this.isLoading = false
    },
    async getData (page) {
      this.listLoading = true
      const opts = {
        page
      }
      const data = await cateInfo(opts)
      console.log(666, data)
      this.listLoading = false
      if (!data) return
      this.brandList = data.brand
      this.dataObj = data.service
      this.dataArr = page === 1 ? data.service.data : [...this.dataArr, ...data.service.data]
      console.log(777, this.dataArr)
      // this.dataArr = data.service;
    }
  },

  created () {
    // this.loadData()
  }
}
</script>

<style scoped lang="scss">
  .m-hot-wrap {
    position: relative;
    .m-menu-btn{
      color:#999;
      font-size:rem(60);
    }
    .m-brand-title{
      font-size:rem(26);
      color:#333;
      padding-left:rem(16);
      height:rem(60);
      line-height:rem(60);
    }
    .m-hot-brand{
      width:rem(710);
      margin:rem(16) auto;
      background:#fff;

      ul{
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        li{
          width:rem(142);
          text-align: center;
          padding:0 rem(15) rem(38);
          img{
            width:rem(142);
            height:rem(63);
            display: block;
            background: #ccc;
          }
          p{
            margin-top:rem(6);
            font-size:rem(24);
            color:#333;
          }
        }
      }
    }
    .m-hot-list-box{
      width:rem(750);
      margin:0 auto;
      .m-brand-title{
        padding-left:0;
      }
    }
  }

</style>
<style lang="scss">
  .service-li {
    background: #f4f6f8;
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
