<template>
  <img class="to_top" src="@/assets/shop/to_top.png" alt="回到顶部">
</template>

<script>
    export default {
        name: "ToTop"
    }
</script>

<style scoped lang="scss">
  .to_top {
    position: fixed;
    right: 30px;
    bottom: 54px;
    z-index: 10;
    width: 50px;
    height: 50px;
  }
</style>
