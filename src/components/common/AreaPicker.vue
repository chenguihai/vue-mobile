<template>
  <!--选择省市区-->
  <van-popup class="bounced" v-model="areaFlag" position="bottom">
    <van-area
      class="selected"
      :area-list="areaList"
      :columns-placeholder="['请选择', '请选择', '请选择']"
      @cancel="onclose"
      @confirm="onsubmit"
    />
  </van-popup>
</template>

<script>
    import area from "@/assets/js/area";

    export default {
        name: "AreaPicker",
        data() {
            return {
                areaFlag: true,
                areaList: JSON.parse(JSON.stringify(area)),
            }
        },
        methods: {
            onclose() {
                this.$emit('close')
            },
            onsubmit(val) {
                this.$emit('submit', val)
            }

        }
    }
</script>

<style scoped>

</style>
