<template>
  <div class="m-search-box">
    <div class="m-search-arrow" @click="goBack"></div>
    <div class="m-search-input">
      <form action="" onsubmit="onKeywordConfirm">
        <input name="keywords" :value="searchValue" type="search" @click="onKeywordConfirm"/>
      </form>
    </div>
    <a class="m-search-link" href="/clues/release">免费发布需求</a>
  </div>
</template>
<script>
  export default {
    name: 'SearchBar',
    props: ['searchValue'],
    data() {
      let {keywords=''} = this.$route.query;
      return {
        search:keywords
      };
    },
    mounted() {
      this.getSearchResult();
    },
    methods: {
      goBack() {
        if(location.pathname === '/clues'){
          this.$router.push({path: "/"});
        }else{
          this.$router.go(-1);
        }
      },
      onKeywordConfirm() {
        this.$router.push({path: "/serviceSearch", query: {type: 3, keywords:this.search}});
      },
      getSearchResult() {
        const obj = {
          keywords: this.search,
          page: 1
        }
        this.$emit('getSearchResult', obj)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .m-search-box {
    height: rem(96);
    position: fixed;
    background: #fff;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 200;

    .m-search-arrow {
      width: rem(25);
      height: rem(25);
      position: absolute;
      border-top: 1px solid #666;
      border-left: 1px solid #666;
      transform: rotate(-45deg);
      top: 50%;
      left: rem(30);
      margin-top: rem(-13);
    }

    .m-search-input {
      width: rem(375);
      padding-left: rem(50);
      height: rem(56);
      border: 1px solid #ccc;
      background: #F4F6F8;
      -webkit-border-radius: rem(28);
      -moz-border-radius: rem(28);
      border-radius: rem(28);
      position: absolute;
      left: rem(80);
      top: rem(22);
      background: #f4f6f8 url("../../../static/images/clues/icon_search.png") no-repeat rem(18) center;
      -webkit-background-size: rem(28) rem(28);
      background-size: rem(28) rem(28);

      form {
        padding: 0;
        margin: 0;
        font-size: 0;
      }

      input {
        background: none;
        width: rem(375);
        height: rem(30);
        font-size: rem(26);
        color: #666;
        margin-top: rem(13);
      }
    }

    .m-search-link {
      position: absolute;
      top: rem(24);
      right: rem(32);
      width: rem(180);
      height: rem(54);
      line-height: rem(54);
      text-align: center;
      color: #fff;
      background: $red;
      font-size: rem(24);
      -webkit-border-radius: rem(5);
      -moz-border-radius: rem(5);
      border-radius: rem(5);

    }
  }

</style>
