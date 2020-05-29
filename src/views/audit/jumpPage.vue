<template>
    <div class="container">
      <head-nav title="实名认证"></head-nav>

    </div>
</template>

<script>
    export default {
        name: "jumpPage",
      created() {
        this.$router.push({path: '/companyInfo'})
      }
    }
</script>
<style scoped>

</style>
