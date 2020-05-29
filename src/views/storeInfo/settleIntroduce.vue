<template>
  <div class="settle">
    <head-nav title="入驻介绍"></head-nav>
    <div class="pr">
      <img class="img" src="@/assets/settle/1.jpg" alt="立即入驻" />
      <div class="small_btn" @click="inviClick">
        <!-- <img class="img" src="@/assets/settle/small_btn.png" alt /> -->
      </div>
    </div>
    <img class="img" src="@/assets/settle/2.jpg" alt />
    <img class="img" src="@/assets/settle/3.jpg" alt />
    <img class="img" src="@/assets/settle/4.jpg" alt />
    <div class="pr">
      <img class="img" src="@/assets/settle/5.jpg" alt />
      <div @click="inviClick" class="large_btn">
        <!-- <img class="img" src="@/assets/settle/large_btn.png" alt /> -->
      </div>
    </div>
  </div>
</template>

<script>
import { requestCode } from "@/api/commonApi";
export default {
  name: "settleIntroduce",
  data() {
    const { inviteUserId } = this.$route.query;
    return {
      inviteId: inviteUserId,
      token: ""
    };
  },
  mounted() {
    let token = localStorage.getItem("token");
    if (token) {
      this.token = token;
      this.getList();
    }
  },
  methods: {
    inviClick() {
      if (this.token) {
        this.$router.push("/newbieTask");
      } else {
        // if (this.inviteId) {
        //   sessionStorage.setItem("newbieTask", "/newbieTask");
        // }
        this.$router.push(`/login?inviteUserId=${this.inviteId}&type=1`);
      }
    },
    async getList() {
      const res = await requestCode(this.inviteId);
    }
  }
};
</script>

<style scoped lang="scss">
.settle {
  .img {
    display: block;
    width: 100%;
    pointer-events: auto;
  }

  .large_btn,
  .small_btn {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    width: rem(688);
    height: rem(82);
  }

  .small_btn {
    top: 159%;
    &>img{
      height: rem(86);
    }
  }

  .large_btn {
    bottom: rem(144);
    &>img{
      height: rem(86);
    }
  }
}
</style>
