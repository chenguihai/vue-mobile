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
      <div>
        <img src="../../assets/redPage/ban_01.png" alt />
        <img src="../../assets/redPage/ban_02.png" alt />
        <div class="imgBut">
          <span>保证金劲爆价 最低¥199起</span>
          <a href="/newbieTask">立即免费入驻</a>
          <span>活动时间：5月11日 - 6月30日</span>
        </div>
      </div>
      <div class="newbie">
         <img src="../../assets/redPage/ban_03.png" alt />
          <a href="/newbieTask"></a>
      </div>

      <img src="../../assets/redPage/ban_04.png" alt />
      <div class="more_ser">
        <img src="../../assets/redPage/ban_05.png" alt />
        <a href='/clues'>更多需求等你来接单>></a>
      </div>
      <img src="../../assets/redPage/ban_06.png" alt />
      <div class="ban_login">
        <img src="../../assets/redPage/ban_07.png" alt />
        <a href="/newbieTask">立即免费入驻</a>
      </div>
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
      value: ""
    };
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
    }
  }
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
.img {
  width: rem(750);
  padding-top: rem(88);
  img {
    width: 100%;
    display: block;
  }
  & > div {
    position: relative;
    & > .imgBut {
      width: rem(680);
      height: rem(218);
      background: #fff;
      // border: 1px solid #e52d1e;
      border-radius: rem(20);
      position: absolute;
      top: rem(535);
      left: 50%;
      margin-left: rem(-340);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      & > :nth-child(1) {
        font-size: rem(32);
        line-height: rem(32);
        color: #f93223;
      }
      & > :nth-child(2) {
        width: rem(350);
        height: rem(78);
        font-size: rem(40);
        color: #fff;
        background: linear-gradient(
          270deg,
          rgba(250, 58, 43, 1) 0%,
          rgba(255, 134, 125, 1) 100%,
          rgba(255, 255, 255, 1) 100%,
          rgba(255, 131, 122, 1) 100%
        );
        border-radius: rem(39);
        margin: rem(24) 0 rem(13) 0;
        text-align: center;
        line-height: rem(78);
      }
      & > :nth-child(3) {
        font-size: rem(20);
        line-height: rem(20);
        color: #666666;
      }
    }
  }
  &>.newbie{
    &>a{
      position: absolute;
      width: rem(350);
      height: rem(78);
      bottom: rem(94);
      left: 50%;
      margin-left: rem(-175);
    }
  }
  & > .more_ser {
    & > a {
      position: absolute;
      bottom: rem(112);
      right: rem(28);
      color: #f3262d;
      font-size: rem(24);
       font-family: simsun;
    }
  }
  &>.ban_login{
    &>a{
      position: absolute;
      width: rem(586);
      height: rem(80);
      background: #FFE63C;
      color: #915800;
      font-size: rem(32);
      bottom: rem(127);
      left: 50%;
      margin-left: rem(-293);
      text-align: center;
      line-height: rem(80);
    }
  }
}
</style>
