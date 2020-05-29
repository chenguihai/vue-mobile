<template>
  <ul class="sort_wrap">
    <li class="sort_item" :class="{active:sort.order === item.order}" v-for="(item, idx) in sortList" :key="idx"
        @click="changeSort(item)">
      {{item.name}}
      <img v-if="item.order !== 'default'" :src="sort.order === item.order ? topr : topc" class="sort-icon"
           :class="sort.order === item.order ? item.sort === 'desc' ? 'icon-down' : 'icon-up' : 'icon-down'">
    </li>
  </ul>
</template>
<script>
  const DESC = 'desc'
  const ASC = 'asc'
  const topr = require('@/assets/service/topr.png')
  const topc = require('@/assets/service/topc.png')
  export default {
    name: 'sortCpn',
    props: {
      isStore: {
        type: Boolean,
        default: false
      },
      sort: {type: Object},
      list: {type: Array, reqirue: true}
    },
    data() {
      return {
        sortList: this.list,
        topr,
        topc,
        selecetType: 'sales',
      }
    },
    model: {
      prop: 'sort',
      event: 'change'
    },
    methods: {
      changeSort(sorts) {
        const {sort, order} = sorts
        if (order === 'default') {
          if(this.selecetType === 'default'){
            return
          }
          sorts.sort = '';
          this.selecetType = order;
        } else if (this.selecetType === order) {
          if (Object.is(order, this.sort.order)) sorts.sort = Object.is(sort, DESC) ? ASC : DESC;
        } else {
          sorts.sort = ASC;
          this.selecetType = order;
        }
        this.$emit('change', sorts)
      }
    }
  }
</script>

<style scoped lang="scss">
  .sort_wrap {
    display: inline-flex;
    justify-content: space-around;
    font-size: 24px;
    color: $c_333;
    flex: 1;
    height: 100%;

    .sort_item {
      /*padding: 0 26px;*/
      flex: 1;
      @include flex(center);
      @include borderBox;
      height: 100%;

      .sort-icon {
        margin-left: 10px;
        width: 14px;
        height: 20px;

        &.icon-down {
          transform: rotate(180deg);
        }
      }
    }
  }

  .active {
    color: $red;
  }
</style>
