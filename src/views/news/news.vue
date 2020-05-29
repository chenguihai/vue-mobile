<template>
  <div class="m-news-wrap">
    <head-nav title="众媒头条"></head-nav>
    <div class="m-tabs" v-if="newsList.length>0">
      <ul>
        <li @click="switchTab(item.id)" :class="{active:id==item.id}" v-for="(item,index) in newsList" :key="index">
          {{item.name}}
        </li>
      </ul>
    </div>
    <listBox :refreshLoading.sync="isLoading" :listLoading.sync="listLoading" :dataArr="dataArr" :dataObj="dataObj" @load="loadData">
      <news-item v-for="(item,i) in dataArr" :key="i" :newsInfo="item"></news-item>
    </listBox>
  </div>
</template>

<script>
import { newsCentre, newsCentreList } from '@/api/news'
import listBox from '@/components/service/listBox'
import upBack from '@/components/service/upBack'
import comLoading from '@/components/service/comLoading'
import HeadNav from '@/components/common/HeadNav'
import NewsItem from '@/components/common/NewsItem'
export default {
  name: 'news',
  data () {
    return {
      id: '',
      showMenu: false,
      listLoading: false,
      isLoading: true,
      error: false,
      once: true,
      newsList: [],
      dataArr: [],
      dataObj: {}
    }
  },
  components: {
    HeadNav,
    upBack,
    listBox,
    comLoading,
    NewsItem
  },
  methods: {
    loadData (page) {
      if(this.id=='') return
      page === 1 ? this.onRefresh() : this.getData(page)
    },
    async onRefresh () {
      await this.getData(1)
      this.isLoading = false
      this.once = false
    },
    switchTab (id) {
      this.id = id
      this.loadData(1)
    },
    async getData (page) {
      this.listLoading = true
      let id = this.id
      const data = await newsCentreList(id, page)
      this.listLoading = false
      if (!data) return
      this.dataObj = data
      this.dataArr = page === 1 ? data.data : [...this.dataArr, ...data.data]
    },
    async init() {
      const res = await newsCentre()
      if(!res) return
      this.newsList = res.nav;
      this.newest = res.newest;
      this.id = this.newsList&&this.newsList[0].id;
      this.getData(1)
    }
  },
  mounted () {
    this.init()
    document.title = '众媒头条'
  }
}
</script>

<style scoped lang="scss">
  .m-news-wrap {
    position: relative;
    min-height:100vh;
    color:#333;
    .m-tabs{
      height:77px;
      width:100%;//750px;
      overflow-x: auto;
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
      background: #fff;
    }
    .m-tabs ul{
      padding-left:20px;
      white-space: nowrap;
      height:77px;
      width:auto;
      padding-right:20px;
      li{
        text-align: center;
        height:77px;
        display: inline-block;
        line-height:77px;
        padding:0 20px;
        font-size:28px;
        color:#333;
      }
      li.active{
        color:#F3262D
      }
    }
  .m-news-item{
    width: 100%;
    box-sizing: border-box;
    height: unset;
  }
  }
  .m-menu-btn{
    color:#999;
    font-size:rem(60);
  }
</style>
