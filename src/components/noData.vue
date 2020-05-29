<template>
  <div class="no-data">
    <img src="@/assets/no_data.png" />
    <p>{{desc}}</p>
  </div>
</template>

<script>
export default {
  name: 'noData',
  props: {
    name: {
      type: String,
      default: '暂无数据'
    }
  },
  data () {
    return {
      desc: this.name
    }
  }
}
</script>

<style scoped lang="scss">
.no-data {
  @include flex(center, center);
  flex-direction: column;
  margin: 200px 0;
  text-align: center;

  img {
    margin-bottom: 30px;
    width: 200px;
    height: 273px;
  }

  p {
    font-size: 26px;
    font-family: $font;
    font-weight: 400;
    color: #999;
  }
}
</style>
