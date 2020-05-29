<template>
  <div>
    <table class="record-table" :border="border ? 1 : 0">
      <tr>
        <th :class="[border ? 'has-b' : '']" v-for="(item, index) in tableHead" :key="index">{{item.name}}</th>
      </tr>
      <tr v-if="tableData.length === 0">
        <td class='no-data'>暂无数据</td>
      </tr>
      <tr v-else v-for="(item, index) in tableData" :key="index">
        <td :class="[border ? 'has-b' : '']" v-for="(items, indexs) in tableHead" :key="indexs">
          <slot :name="items.field || items.props" :row="item">{{item[items.props]}}</slot>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'RecordTable',
  data () {
    return {}
  },
  props: ['tableData', 'tableHead', 'border'],
  computed: {},
  created () { },
  mounted () { },
  watch: {},
  methods: {},
  components: {}
}
</script>

<style scoped lang="scss" src='./record-table.scss'>
</style>
