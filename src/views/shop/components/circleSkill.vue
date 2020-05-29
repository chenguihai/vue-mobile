<template>
  <div class="archive_wrap">
    <h4 class="title">{{self ? '自传' : '媒介'}}资质</h4>
    <ul class="item_wrap mt_20">
      <template v-if="!self">
        <a tag="li" :href="'/qualifyDetail'" v-for="(item,index) of oblig" :key="index"
                     class="circle_item">
          <span class="num">{{item.length}}个</span>
          <span class="name">{{+index | mediaLevel}}</span>
        </a>
      </template>
      <template v-else>
        <!--      <template v-for="(item) in archive.selfHonorList">      </template>-->
        <a tag="li" :href="'/certificateDetail'" v-if="item.list.length > 0" v-for="item in oblig"
                     :key="item.id"
                     class="circle_item">
          <span class="num">{{item.list.length}}个</span>
          <span class="name">{{item.type_name}}</span>
        </a>
      </template>
    </ul>
  </div>
</template>

<script>
    import {mediaLevel} from '@/utils/filters'

    export default {
        name: 'circleSkill',
        props: ['oblig', 'self'],
        filters: {mediaLevel},
        created() {
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

    .mt_20 {
      margin-top: $w_20;
    }

    .item_wrap {
      display: flex;
      flex-wrap: wrap;
      color: $c_666;
    }

    .circle_item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 150px;
      height: 150px;
      background: $white;
      border: 1px solid $c_ddd;
      border-radius: 50%;

      &:not(:last-child) {
        margin-right: $w_30;
      }

      .num,
      .name {
        display: block;
      }

      .num {
        @include height(42px);
        font-size: 30px;
        color: $red;
        margin-bottom: $w_10;
      }

      .name {
        @include height();
        font-size: 26px;
      }
    }
  }
</style>
