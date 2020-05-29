<template>
  <div class="com-loading">
    <img src="@/assets/service/loading.gif">
  </div>
</template>

<script>
export default {
  name: 'comLoading'
}
</script>

<style scoped lang="scss">
.com-loading {
  @include flex(center);
  @include borderBox;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  background: rgba(0, 0, 0, 0.7);
  z-index:99;
  img{
    width:80px;
  }
}
</style>
