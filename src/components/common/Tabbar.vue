<template>
<div>
  <div class="m-tabbar-pop-bg" v-if="showLinkClues">
    <div class="m-pop-div"></div>
    <div class="m-item-wrap">
      <!--div-- class="m-item" @click="cartTips()">
        <img src="../../../static/images/icon-pub-service.png" alt="" />
        <h3 class="m-name">发布任务需求</h3>
        <p class="m-content">自由发布自主定价</p>
      </!--div-->
      <div class="m-item" @click="goto('/clues/release')">
        <img src="../../../static/images/icon-pub-clues.png" alt="" />
        <h3 class="m-name">发布广告线索</h3>
        <p class="m-content">自由发布自主定价</p>
      </div>
    </div>
    <div class="m-close" @click="hideLinkClues()"></div>
  </div>
  <van-tabbar class="m-van-tabbar" v-model="active" active-color="#f3262d">
    <van-tabbar-item to="/">
      首页
      <img
        slot="icon"
        slot-scope="props"
        :src="active==0 ? icon_home.active : icon_home.inactive"
      />
    </van-tabbar-item>
    <van-tabbar-item to="/serviceClaList">
      分类
      <img
        slot="icon"
        slot-scope="props"
        :src="active==1 ? icon_category.active : icon_category.inactive"
      />
    </van-tabbar-item>
    <van-tabbar-item @click="showLinkCluesEvent()">
      发布
      <img slot="icon" class="icon_plus" slot-scope="props" :src="icon_plus" />
    </van-tabbar-item>
    <van-tabbar-item @click="cartTips">
      购物车
      <img
        slot="icon"
        slot-scope="props"
        :src="active==3 ? icon_cart.active : icon_cart.inactive"
      />
    </van-tabbar-item>
    <van-tabbar-item icon="setting-o" to="/userContent/homePage/homePage">
      我的
      <img slot="icon" slot-scope="props" :src="active==4 ? icon_my.active : icon_my.inactive" />
    </van-tabbar-item>
  </van-tabbar>
</div>
</template>
<script>
import {Toast} from 'vant'
export default {
  name: "Tabbar",
  data() {
    return {
      showLinkClues:false,
      active: 0,
      icon_home: {
        active: "../../../static/images/icon_home_active.png",
        inactive: "../../../static/images/icon_home.png"
      },
      icon_category: {
        active: "../../../static/images/icon_category_active.png",
        inactive: "../../../static/images/icon_category.png"
      },
      icon_my: {
        active: "../../../static/images/icon_my_active.png",
        inactive: "../../../static/images/icon_my.png"
      },
      icon_cart: {
        active: "../../../static/images/icon_cart_active.png",
        inactive: "../../../static/images/icon_cart.png"
      },
      icon_plus: "../../../static/images/icon_plus.png"
    };
  },
  methods: {
    // histroyClick() {
    //   this.$router.push({ path: "userContent/homePage/homePage" });
    // }
    cartTips() {
      Toast('功能暂未开放，敬请期待！')
    },
    goto(url) {
      document.body.removeAttribute("class","m-fixed-body");
      this.$router.push(url)
    },
    showLinkCluesEvent() {
      this.showLinkClues = true;
      document.getElementsByTagName("body")[0].className="m-fixed-body";
    },
    hideLinkClues() {
      this.showLinkClues = false;
      document.body.removeAttribute("class","m-fixed-body");
    }
  },
  mounted() {
    let thisPath = this.$route.path;
    if (thisPath.indexOf("serviceClaList") > -1) {
      this.active = 1;
    } else if (thisPath.indexOf("/userContent/homePage/homePage") > -1) {
      this.active = 4;
    } else if (thisPath.indexOf("cart") > -1) {
      this.active = 3;
    } else {
      this.active = 0;
    }
  }
};
</script>
<style>
  .m-fixed-body{
    position: fixed;
  }
</style>
<style lang="scss" scoped>
.m-tabbar-pop-bg{
  position: fixed;
  left:0;
  top:0;
  right:0;
  bottom:0;
  z-index: 2000;
  .m-pop-div{
    position: absolute;
    left:0;
    top:0;
    right:0;
    bottom:0;
    background: #fff;
    z-index: 1;
    opacity: 0.94;
    
  }
  @keyframes mymove
  {
    0% {
        transform: translate(0px, 0px);
    }
    90% {
      transform: translate(0px, -250px);
    }
    93% {
      transform: translate(0px, -210px);
    }
    96% {
      transform: translate(0px, -250px);
    }
    100% {
      transform: translate(0px, -230px);
    } 
  }

  @-webkit-keyframes mymove
  {
      0% {
          -webkit-transform: translate(0px, 0px);
      }
      90% {
        -webkit-transform: translate(0px, -250px);
      }
      93% {
        -webkit-transform: translate(0px, -210px);
      }
      96% {
        -webkit-transform: translate(0px, -250px);
      }
      100% {
        -webkit-transform: translate(0px, -230px);
      }
  }
  .m-item-wrap{
    z-index: 2;
    width:100%;
    height:241px;
    position: absolute;
    bottom:0;
    left:0;
    animation:mymove 0.4s normal;
    -webkit-animation:mymove 0.4s normal; /*Safari and Chrome*/
    transform: translate(0, -230px);
    display: flex;
    justify-content: space-around;
    .m-item{
      width:49%;
      text-align: center;
      height:241px;
      img{
        display: block;
        width:116px;
        height:116px;
        margin:0 auto;
      }
      .m-name{
        padding-top:26px;
        font-size:28px;
        color:#333;
      }
      .m-content{
        color:#666;
        padding-top:6px;
        font-size:25px;
        line-height:36px;
      }
    }
  }
  .m-close{
    width:36px;
    height:36px;
    position: absolute;
    bottom:73px;
    left:50%;
    background:url('/static/images/icon-close.png') no-repeat left top;
    background-size:100% 100%;
    margin-left:-19px;
    z-index: 2000
  }
}
.m-van-tabbar {
  height: rem(98) !important;
  box-shadow: 0px -2px 4px 0px rgba(209, 209, 209, 0.5);
}
.icon_plus {
  margin-top: rem(-48);
  width: rem(90);
  height: rem(90);
}
/deep/ .van-tabbar-item__icon {
  z-index: 10;
}

</style>
