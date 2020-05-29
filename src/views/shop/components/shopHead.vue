<template>
  <div class="fixed_container">
    <div class="fixed_head">
      <div class="box" @click="histroyClick">
        <img v-if="type==='shop'" class="left" src="@/assets/shop/arrow_left_white.png" alt="返回箭头">
        <img v-else class="gray" src="@/assets/shop/arrow_left_gray.png" alt="返回箭头">
      </div>
      <div class="box" @click="showMenu = true">
        <img v-if="type==='shop'" class="right" src="@/assets/shop/three_point_white.png" alt="更多">
        <img v-else class="gray" src="@/assets/shop/three_point_gray.png" alt="更多">
      </div>
      <MenuSlide @close="closeThis()" v-if="showMenu"></MenuSlide>
    </div>
  </div>
</template>

<script>
    import MenuSlide from '@/components/common/MenuSlide'

    export default {
        name: 'shopHead',
        components: {MenuSlide},
        props: {
            type: {
                type: String,
                default: 'shop'
            }
        },
        data() {
            return {
                showMenu: false
            }
        },
        methods: {
            closeThis() {
              console.log(222)
              this.showMenu = false
            },
            histroyClick() { // 返回
                this.$router.go(-1)
            },
        }
    }
</script>

<style scoped lang="scss">
  .fixed_container {
    position: fixed;
    top: $w_20;
    left: 0;
    right: 0;
    z-index: 10;
  }

  .fixed_head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    padding: 0 $w_20;

    .left {
      width: 20px;
      height: 36px;
    }

    .right {
      width: 36px;
      height: 8px;
    }

    .box {
      display: inline-flex;
    }

    .gray {
      width: 50px;
      height: 50px;
    }
  }
</style>
