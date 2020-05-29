<template>
  <div class="login-logo">
    <div class="inner">
      <img src="@/assets/login/logo.png" >
    </div>
  </div>
</template>

<script>
export default {
  name: 'loginLogo',
  data () {
    return {

    }
  }
}
</script>

<style scoped lang="scss">
.login-logo {
  @include square(231);
  @include round;
  @include flex(center, center);
  border: 1px solid rgba(243,38,45,0.2);
  margin: auto;
  .inner {
    @extend .login-logo;
    @include square(168);
    opacity: 1;
    img{
      @include square(92);
    }
  }
}
</style>
