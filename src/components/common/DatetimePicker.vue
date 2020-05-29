<template>
  <van-popup v-model="show" position="bottom" @close="onCancel">
    <van-datetime-picker
      type="date"
      v-model="currentDate"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
  </van-popup>
</template>

<script>
    import moment from 'moment'

    export default {
        name: "datetimePicker",
        props: {
            type: {
                type: String,
                default: 'mix'
            },
            date: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                show: true,
                minDate: this.type === 'min' ? new Date() : undefined,
                maxDate: this.type === 'max' ? new Date(new Date().getTime()- 1000 * 60 * 60 * 24) : undefined,
                currentDate: this.date ? new Date(this.date) : new Date()
            }
        },
        methods: {
            onCancel() {
                this.$emit('close')
            },
            onConfirm(val) {
                let time = moment(val).format('YYYY-MM-DD');
                this.$emit('submit', time)
            }
        }
    }
</script>

<style scoped>

</style>
