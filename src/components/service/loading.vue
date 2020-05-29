<template>
  <div class="loading">
    <img src="@/assets/service/loading.gif" class="gif">
    <span>加载中...</span>
  </div>
</template>

<script>
export default {
  name: 'loading'
}
</script>

<style scoped lang="scss">
.loading {
  width:100%;
  @include flex(center);
  height: 100%;
  max-height:159px;
  .gif {
    margin-right: 17px;
    height: 100%;
    max-height:159px;
  }
}
</style>
