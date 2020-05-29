<template>
  <van-popup v-model="show" position="bottom" @close="onCancel">
    <van-picker class="picker"
                show-toolbar
                :columns="columns"
                @cancel="onCancel"
                @confirm="onConfirm"
    />
  </van-popup>
</template>

<script>
    /*
        1、 需要传入  [{text: '杭州', disabled: true}]
        2、 需要包裹在van-popup标签中 <van-popup v-model="showPicker" position="bottom"></van-popup>
     */
    export default {
        name: "popupPicker",
        props: {
            list: {
                type: Array,
                require: true
            }
        },
        data() {
            return {
                show: true,
                columns: this.list
            }
        },
        methods: {
            onCancel() {
                this.$emit('close')
            },
            onConfirm(val) {
                this.$emit('submit', val)
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
