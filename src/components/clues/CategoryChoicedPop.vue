<template>
  <div class="m-category-chioced">
    <van-nav-bar title="查看类目" left-arrow @click-left="onClickLeft" />

    <h3 class="m-title">
      <b v-if="isDetail">该雇主已选择一级类目</b>
      <b v-else>您已选择一级类目</b>
      <span>{{showList.cate_name}}</span> 下如下类目：
    </h3>
    <div :class="moreShow ? 'm-choiced-ul-wrap' : 'm-choiced-hidde'">
      <div class="m-ul-choiced" v-if="list.length>0">
        <ul>
          <li
            v-for="(itemSon,idx) in list"
            v-if="itemSon.selected==true"
            :key="idx"
          >{{itemSon.cate_name}}</li>
        </ul>
      </div>
      <div v-if="!moreShow" class="m-more-category-btn" @click="moreShow = true">查看更多</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "CategoryChoicedPop",
  props: ["showList", "index", "isDetail"],
  data() {
    return {
      moreShow: false,
      list: []
    };
  },
  methods: {
    onClickLeft() {
      this.$emit("close");
      document.body.removeAttribute("class", "m-fixed-body");
    }
  },
  beforeDestroy() {
    document.body.removeAttribute("class", "m-fixed-body");
  },
  mounted() {
    let num = 0;
    this.showList.child.forEach(res => {

      let showListChild = res.child.filter(item => item.selected == true);
      this.list = [...this.list, ...showListChild];
      let childLen = showListChild.length;
      do {
        num++;
        childLen -= 3;
      } while (childLen > 0);
    });
    if (num > 5) {
      this.moreShow = false;
    } else {
      this.moreShow = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.m-category-chioced {
  overflow-y: auto;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: #fff;
  z-index: 28000;
  .m-title {
    height: rem(100);
    line-height: rem(100);
    font-size: rem(28);
    border-bottom: 1px solid #eee;
    padding-left: rem(45);
    span {
      font-weight: bold;
    }
  }
  .m-choiced-ul-wrap,
  .m-choiced-hidde {
    padding-top: rem(25);
    ul {
      display: flex;
      flex-wrap: wrap;
      padding-left: rem(28);
    }
    li {
      width: 30.5%;//rem(220);
      height: rem(56);
      line-height: rem(56);
      text-align: center;
      background: #f4f6f8;
      font-size: 24px;
      font-weight: normal;
      margin-right: rem(17);
      margin-bottom: rem(38);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .m-choiced-hidde {
    position: relative;
    overflow: hidden;
    padding-bottom: rem(77);
    .m-ul-choiced {
      max-height: rem(364);
      overflow: hidden;
    }
  }
  .m-more-category-btn {
    position: absolute;
    left: 50%;
    margin-left: rem(-85);
    top: rem(386);
    width: rem(170);
    height: rem(50);
    background: #f4f4f4;
    line-height: rem(50);
    text-align: center;
    border: 1px solid #dfdfdf;
    border-radius: rem(25);
    color: #666;
    font-size: rem(24);
  }
  .m-choiced-content {
    background: #f2f3f5;
    dl {
      background: #fff;
      display: flex;
      flex-wrap: wrap;
      margin-bottom: rem(9);
      padding: rem(40) 0 rem(9) rem(45);
      overflow: hidden;
      dt {
        color: #333;
        width: 100%;
        font-size: rem(28);
        padding-bottom: rem(28);
      }
      dd {
        width: rem(220);
        line-height: rem(56);
        text-align: center;
        white-space: nowrap;
        text-overflow: ellipsis;
        height: rem(56);
        background: #f4f6f8;
        margin-right: rem(17);
        margin-bottom: rem(38);
      }
    }
  }
}
</style>
