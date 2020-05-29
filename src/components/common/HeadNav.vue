<template>
  <van-sticky class="wrap">
    <header class="head_nav">
      <div @click="histroyClick">
        <img src="@/assets/arrowhead/zuo_nob.png" alt/>
      </div>
      <h2 v-if="titles">{{titles}}</h2>
      <div v-else class="head_name_cell">
        <!--        <van-field v-model="keywords" clearable left-icon="search" @click-left-icon="$emit('search',keywords)"/>-->
        <van-field v-model="keywords" clearable left-icon="search" @click="jumpSearch"/>
      </div>
      <MenuSlide @close="closeMenu" v-if="showMenu"></MenuSlide>
      <slot name="right">
        <div v-if="!btn" class="dian" @click="onClickRight">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <span v-else class="rightBtn" @click="$emit('submit')">添加</span>
      </slot>
    </header>
    <!--    <li class="class_item" v-for="(item,index) in 18">sdfasfasdfasd</li>-->
  </van-sticky>
</template>

<script>
  import MenuSlide from '@/components/common/MenuSlide'

  const WHITE_LIST = ['/storeInfoPerson']
  export default {
    name: 'HeadNav',
    components: {MenuSlide},
    props: {
      title: {//名称
        type: String,
        reqirue: true
      },
      search: {
        type: String,
        default: ''
      },
      btnOpts: {
        type: Object,
        default: () => ({})
      },
      showBtn: {
        type: Boolean,
        default: false
      },
      btn: {
        type: String,
        default: ''
      },
    },
    data() {
      return {
        titles: this.title,
        showMenu: false,
        keywords: this.search
      }
    },
    methods: {
      histroyClick() { // 返回
        let pathname = location.pathname
        if (pathname === '/storeInfoPerson' || pathname === '/exampleManage' || pathname === '/serviceManage') { //店铺资料，客户示例，服务管理
          this.$router.push({path: "/userContent/homePage/homePage", query: {type: 2}});
        } else if (pathname === '/publishExample') {//发布合作示例
          this.$router.push({path: "/exampleManage"});
        } else if (pathname === '/publishService') { //发布服务
          this.$router.push({path: "/serviceManage"});
        } else if (pathname === '/clues/detail') {
          this.$router.push({path: "/clues"});
        } else {
          this.$router.go(-1)
        }
      },
      jumpSearch() {
        this.$router.push({path: "/serviceSearch", query: {type: 2, keywords: this.keywords}});
      },
      closeMenu() {
        this.showMenu = false
      },
      onClickRight() {
        this.showMenu = true
      }
    }
  }
</script>

<style scoped lang="scss">
  .wrap {
    width: 100%;
  }

  .rightBtn {
    color: $blue;
    font-size: 24px;
    padding-right: 30px;
  }

  .head_nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: rem(88);
    width: 100%;
    background: $white;

    & > div {
      & > img {
        display: block;
        width: rem(20);
        height: rem(36);
        margin-left: rem(20);
      }
    }

    & > h2 {
      font-size: rem(34);
      color: #030303;
    }

    & > .dian {
      display: flex;
      margin-right: rem(20);

      & > div {
        width: rem(8);
        height: rem(8);
        border-radius: 50%;
        background: #999;
        margin-right: 6px;
      }
    }
  }
</style>
<style lang="scss">
  .head_name_cell {
    flex: 1;
    margin: 0 $w_20;

    .van-cell {
      background-color: $c_bg;
      padding: 5px 16px;
      border-radius: $w_20;
    }
  }
</style>
