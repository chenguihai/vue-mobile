<template>
  <div class="novicClick">
    <header>
      <div @click="histroyClick()">
        <img src="@/assets/arrowhead/zuo_nob.png" alt />
      </div>
      <h2>新人专享</h2>
      <MenuSlide @close="closeMenu" v-if="showMenu"></MenuSlide>
      <div class="dian" @click="onClickRight">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </header>
    <div>
        <img src="../../../assets/novicClick.jpg" alt="">
    </div>
  </div>
</template>
<script>
import MenuSlide from "@/components/common/MenuSlide";

export default {
  components: {
    MenuSlide
  },
  data() {
    return {
      showMenu: false,
    };
  },
  methods: {
    // 返回上一页
    histroyClick() {
      this.$router.go(-1);
    },
    onClickRight() {
      this.showMenu = true;
    },
    closeMenu() {
      this.showMenu = false;
    }
  }
};
</script>
<style lang="scss">
.novicClick {
  & > header {
    height: rem(88);
    width: 100%;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;

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
      margin-right: rem(44);

      & > div {
        width: rem(8);
        height: rem(8);
        border-radius: 50%;
        background: #999;
        margin-right: 6px;
      }
    }
  }
  &>div{
      &>img{
          display: block;
          width: 100%;
      }
  }
}
</style>