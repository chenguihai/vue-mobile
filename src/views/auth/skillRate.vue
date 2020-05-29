<template>
  <div>
    <head-nav title="技术费率规则"></head-nav>
    <div class="skill_rate">
      <p>
        订单结算时，凌天众媒网会按照实际成交金额，向服务商按照类目收取一定比例的技术服务费。<br>
        入驻类目时可查看对应的服务类目技术费率。
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "skillRate"
  }
</script>

<style scoped lang="scss">
  .skill_rate {
    height: calc(100vh - 128px);
    padding: 20px;
    background-color: #fff;
    font-size: 24px;

    h4 {
      font-size: 28px;
    }

    p {
      line-height: 40px;
    }
  }
</style>
