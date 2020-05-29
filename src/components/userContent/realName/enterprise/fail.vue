<template>
  <div class="fail">
    <header>
      <div @click="histroyClick()">
        <img width="44" height="42" src="@/assets/arrowhead/zuo_nob.png" alt />
      </div>
      <h2>实名认证</h2>
      <MenuSlide @close="closeMenu" v-if="showMenu"></MenuSlide>
      <div class="dian" @click="onClickRight">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </header>
    <div class="failData">
      <img src="../../../../assets/default/no_data.png" alt />
      <span>您的实名认证申请审核未通过！</span>
      <span>未通过原因：法人身份证照片信息有误，请重新提交。</span>
      <span @click="click()">重新申请</span>
    </div>
  </div>
</template>
<script>
import MenuSlide from "@/components/common/MenuSlide";
import { bodyColor } from "@/utils/mixins";
export default {
  mixins: [bodyColor("fff")],
  components: {
    MenuSlide
  },

  data() {
    return {
      showMenu: false
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
    },
    // 重新申请
    click() {
      this.$router.push({ path: "/userContent/homePage/enterprise" });
    }
  }
};
</script>
<style lang="scss">
.fail {
  & > header {
    height: rem(88);
    width: 100%;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
    & > div {
      & > img {
        display: block;
        width: rem(20);
        height: rem(36);
        margin-left: rem(30);
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
  & > .failData {
    display: flex;
    flex-direction: column;
    align-items: center;
    & > img {
      width: rem(151);
      height: rem(207);
      margin: rem(152) 0 rem(28) 0;
    }
    & > span {
      font-size: rem(30);
      color: #333;
    }
    & > :nth-child(2) {
      font-weight: 600;
    }
    & > :nth-child(3) {
      font-size: rem(26);
      color: #333;
      margin: rem(11) 0 rem(49) 0;
    }
    & > :nth-child(4) {
      color: #fff;
      width: rem(300);
      height: rem(88);
      text-align: center;
      line-height: rem(88);
      background: #f3262d;
      border-radius: rem(8);
    }
  }
}
</style>