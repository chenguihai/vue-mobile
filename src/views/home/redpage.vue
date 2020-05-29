<template>
  <div>
    <header>
      <div @click="histroyClick()">
        <img src="@/assets/arrowhead/zuo_nob.png" alt />
      </div>
      <a class="search" href="/serviceSearch">
        <van-cell-group>
          <van-field v-model="value" disabled />
        </van-cell-group>
        <div class="arrowhead">
          <img src="../../assets/arrowhead/search.png" alt />
        </div>
      </a>
      <MenuSlide @close="closeMenu" v-if="showMenu"></MenuSlide>
      <div class="dian" @click="onClickRight">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </header>
    <div class="img">
      <img src="../../assets/redPage/red_1.jpg" alt />
      <img src="../../assets/redPage/red_2.jpg" alt />
      <img src="../../assets/redPage/red_3.jpg" alt />
    </div>
  </div>
</template>
<script>
  import MenuSlide from "@/components/common/MenuSlide";

export default {
      components: {
      MenuSlide,
  },
    data() {
        return {
            showMenu:false,
            value:'',
        }
    },
    methods: {
        histroyClick() {
      this.$router.go(-1);
    },
       onClickRight() {
      this.showMenu = true;
    },
    closeMenu() {
      this.showMenu = false;
    },
    },
};
</script>
<style lang="scss" scoped>
header {
  position: fixed;
  height: rem(88);
  width: 100%;
  z-index: 1;
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

  & > .search {
    width: rem(574);
    height: rem(58);
    border-radius: rem(29);
    overflow: hidden;
    position: relative;

    & > .van-cell-group {
      background: #f4f6f8;

      & > .van-cell {
        background: #f4f6f8;
        padding: 0;
        width: rem(574);
        height: rem(58);

        /deep/ .van-cell__value {
          color: #333;

          .van-field__body {
            .van-field__control {
              height: rem(58);
              font-size: rem(22);
              padding-left: rem(77);
            }
          }
        }
      }
    }

    & > .arrowhead {
      position: absolute;
      top: 0;
      left: rem(10);
      width: rem(58);
      height: rem(58);
      z-index: 1;

      & > img {
        display: block;
        width: rem(27);
        height: rem(29);
        margin-left: rem(15);
        margin-top: rem(15);
      }
    }
  }

  & > .dian {
    display: flex;
    margin-right: rem(30);

    & > div {
      width: rem(8);
      height: rem(8);
      border-radius: 50%;
      background: #ccc;
      margin-right: 6px;
    }
  }
}
.img{
    width: rem(750);
    padding-top:rem(88);
    &>img{
           width: 100%;
           display: block;
    }
}
</style>
