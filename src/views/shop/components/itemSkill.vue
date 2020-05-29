<template>
  <div class="archive_wrap">
    <h4 class="title">{{titles}}</h4>
    <ul class="item_wrap">
      <li v-for="item in oblig" :key="item[showFlag ? 'id' : 'cat_one']" :class="[showFlag?'item3':'item']">
        {{item[showFlag ? 'sr_name' : 'cate_name']}}
      </li>
    </ul>
  </div>
</template>

<script>
    export default {
        name: 'itemSkill',
        props: {
            flag: {
                type: Boolean,
                default: false
            },
            oblig: {
                type: Array,
                default: []
            },
            title: {
                type: String,
                default: '一级赋能技能'
            }
        },
        data() {
            return {
                showFlag: this.flag,
                titles: this.title
            }
        }
    }
</script>

<style scoped lang="scss">
  .archive_wrap {
    padding-top: $w_30;

    .title {
      @include height(42px);
      font-size: 30px;
    }

    .item_wrap {
      display: flex;
      flex-wrap: wrap;
      color: $c_666;
    }

    .item,
    .item3 {
      @include height(56px);
      text-align: center;
      font-size: 24px;
      background: $c_bg;
      margin: $w_20 $w_20 0 0;
    }

    .item {
      width: 280px;
      border-radius: 28px;
    }

    .item3 {
      width: 180px;
    }
  }
</style>
