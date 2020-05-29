<template>
  <div class="m-news-wrap">
    <head-nav title="众媒头条"></head-nav>
    <div class="m-news-content" v-if="article">
      <h3 class="m-news-title">{{article.title}}</h3>
      <div class="m-news-info">
        <div class="m-time">
          {{article.created_at}}
          <span class="m-num">
            <img src="../../../static/images/news/icon-news-num.png" alt />
            {{article.click_num}}
          </span>
        </div>
        <div class="m-share" @click="sharePage">
          <img src="../../../static/images/clues/icon-share.png" alt />分享
        </div>
      </div>
      <div class="m-news-article" v-html="article.content"></div>
    </div>
  </div>
</template>

<script>
import HeadNav from '@/components/common/HeadNav'
import { newsCentreDetail } from '@/api/news'
import {wxShareCommon} from '@/utils/util'

export default {
  name: 'newsDetail',
  data () {
    return {
      showMenu: false,
      article: null
    }
  },
  components: {
    HeadNav
  },
  methods: {
    sharePage () {
            var img = 'https://ltzm1.oss-cn-shenzhen.aliyuncs.com/' +this.article.cover

      let obj = {
        title: this.article.title,
        link: window.location.href, // 网址，默认使用window.location.href
        // desc:'我在凌天众媒网发现一个不错资讯内容，赶快来看看',
        // imgUrl: img || 'https://m.zhongmei66.com/static/bitbug_favicon.ico',
        infoMap: {
          wx: {
            title: this.article.title,
            desc:'我在凌天众媒网发现一个不错资讯内容，赶快来看看',
            link: window.location.href,
            imgUrl: img || 'https://m.zhongmei66.com/static/bitbug_favicon.ico'
          }
        },
        fnDoShare: function (type) {
          console.log(1)
        }
      }
      Mshare.popup(obj)
    },
    async init () {
      let id = this.$route.params.id
      const dataDetail = await newsCentreDetail(id)
      if (!dataDetail.article) return  this.$router.push({
          path: "/closeData", query: { type: 6 }
        });
      this.article = dataDetail.article
      const {cover, title} = dataDetail.article
      document.title = title
      wxShareCommon(title, cover,'我在凌天众媒网发现一条不错的资讯内容，赶快来看看')
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped lang="scss">
.m-news-wrap {
  position: relative;
  min-height: 100vh;
  color: #333;
  .m-news-content {
    background: #fff;
    margin-top: 20px;
    padding: 20px 30px 50px;
    .m-news-title {
      font-size: 42px;
      line-height: 1.3em;
      color: #333;
    }
    .m-news-info {
      display: flex;
      justify-content: space-between;
      padding-top: 27px;
      padding-bottom: 52px;
      .m-share {
        color: #f3262d;
        font-size: 26px;
        img {
          width: 26px;
          height: 26px;
          vertical-align: bottom;
          margin-right: 5px;
        }
      }
      .m-time {
        color: #999;
        font-size: 26px;
        .m-num {
          margin-left: 60px;
          color: #999;
          img {
            width: 42px;
            height: 24px;
            margin-right: 10px;
            vertical-align: bottom;
          }
        }
      }
    }
    .m-news-article {
      text-align: justify;
      color: #333;
      font-size: 30px;
      line-height: 1.5em;
      div {
        width: 100%;
        max-width: 100%;
      }
    }
  }
}
.m-menu-btn {
  color: #999;
  font-size: rem(60);
}
</style>
