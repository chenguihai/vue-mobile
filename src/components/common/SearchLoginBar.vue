<template>
  <div :style="pos>0?'background:#f3262d':''" class="m-search-box" id="search-box">
    <div :class="['search-main',showInCategory?'m-bg-white':'']">
      <div class="m-search-arrow" v-if="showInCategory" @click="goBack"></div>
      <a href="/serviceClaList" v-else class="icon-category"></a>
      <a href="/serviceSearch" :style="showInCategory ? 'background-color:#F4F6F8':''" class="m-search-input">
      </a>
      <div @click="goto('/userContent/homePage/allNews')" :class="showInCategory ? 'm-category-msg-icon' : 'm-message-icon'">
        <a href="javascript:void(0)" v-if="msgAmount>0" :style="msgAmount>9 ? 'padding:0 0.10667rem':''" class="m-message-num">{{msgAmount}}</a>
      </div>
      <a href="/userContent/homePage/homePage" class="m-login-head" v-if="$store.state.userInfo">
        <img :src="showInCategory ? '../../../static/images/icon-category-head.png' : '../../../static/images/home/index-user-head.png'" alt="">
      </a>
      <a v-else href="/login" class="m-login-text" :style="{color:showInCategory ? ' #666' : '#fff' }">
        登录
      </a>
    </div>
  </div>
</template>

<script>
import { msgupdate } from '@/api/home'
export default {
  name: 'SearchLoginBar',
  props: {
    showInCategory: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isLogin: false,
      msgAmount: 0,
      pos: 0,
      timeFix: null
    }
  },
  methods: {
    async getMsgupdate () {
      let _this = this
      const dataS = await msgupdate('S');
      const dataT = await msgupdate('T');
      if(!dataS || !dataT) return
      _this.$store.state.allNewsNum = dataS.count + dataT.count
      _this.msgAmount = dataS.count + dataT.count
    },
    goBack () {
      this.$router.go(-1)
    },
    goto(url) {
      this.$router.push(url)
    },
    handleScroll: function () {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      this.pos = scrollTop
      this.$parent.transition = false
      this.timeFix = setTimeout(() => {
        this.$parent.transition = true
      }, 1400)
    }
  },
  destroyed: function () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  watch: {
    '$route' () {
      this.msgAmount = this.$store.state.allNewsNum
    }
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll, true)
    let userInf = this.$store.state.userInfo
    this.msgAmount = this.$store.state.allNewsNum
    if (userInf) {
      this.isLogin = true
      this.getMsgupdate()
    }
  }

}
</script>

<style scoped lang="scss">
.m-search-box {
  height: rem(74);
  position: fixed;
  top: rem(0);
  left: 0;
  z-index: 10;
  width: 100%;
  padding-top: rem(14);
  line-height: rem(60);
  .search-main{
    width: 100%;
  }
  .m-bg-white {
    background: #fff;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: rem(88);
  }
  .m-search-arrow {
    width: rem(25);
    height: rem(25);
    position: absolute;
    border-top: 1px solid #666;
    border-left: 1px solid #666;
    transform: rotate(-45deg);
    top: 50%;
    left: rem(30);
    margin-top: rem(-13);
  }
  .icon-category {
    width: 6.28%;//rem(47);
    height: rem(40);
    background: url("/static/images/home/icon_link_category.png") no-repeat left
      top;
    -webkit-background-size: 100% 100%;
    background-size: 100% 100%;
    position: absolute;
    left: rem(20);
    top: rem(23);
  }
  .m-search-input {
    width: 64.89%;//rem(486);
    height: rem(60);
    border-radius: rem(30);
    position: absolute;
    left: rem(98);
    top: rem(14);
    background: #fff url("/static/images/home/icon_search.png") no-repeat
      rem(25) center;
    -webkit-background-size: rem(24) rem(24);
    background-size: rem(24) rem(24);
  }
  .m-message-icon,
  .m-category-msg-icon {
    width: 5.34%;//rem(40);
    height: rem(40);
    position: absolute;
    right: rem(99);
    top: rem(24);
    background: url("/static/images/home/icon_message_top.png") no-repeat left
      top;
    -webkit-background-size: 100% 100%;
    background-size: 100% 100%;
    .m-message-num {
      background: #f52222;
      border-radius: rem(15);
      color: #fff;
      text-align: center;
      position: absolute;
      min-width: rem(30);
      height: rem(30);
      line-height: rem(30);
      top: rem(-16);
      right: rem(-12);
      font-size: rem(20);
      transform: scale(0.7);
      font-weight: 700;
    }
  }
  .m-category-msg-icon {
    background: url("/static/images/icon-category-msg.png") no-repeat left top;
    -webkit-background-size: 100% 100%;
    background-size: 100% 100%;
  }
  .m-login-text {
    display: inline-block;
    color: #fff;
    font-size: rem(26);
    position: absolute;
    top:14px;
    right: rem(21);
    height: rem(60);
    img {
      width: rem(36);
      height: rem(38);
    }
  }
  .m-login-head {
    position: absolute;
    right: rem(36);
    height: rem(38);
    top: rem(24);
    display: block;
    img {
      display: block;
      width: rem(36);
      height: rem(38);
    }
  }
}
</style>
