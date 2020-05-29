<template>
  <van-pull-refresh v-model="rLoading" @refresh="onRefresh" v-if="dataArraa">
    <template slot="loading">
      <loading></loading>
    </template>
    <van-list
      class="list"
      ref="list"
      v-model="lLoading"
      :finished="finished"
      finished-text="没有更多了"
      v-if="dataArr && dataArr.length > 0"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="goLoad"
      :immediate-check="false"
    >
      <slot></slot>
      <template slot="loading">
        <loading></loading>
      </template>
    </van-list>
    <div v-if="dataArr.length ===0 && !lLoading">
      <div v-if="this.$route.query.keywords" class="no-data">
        <img src="@/assets/no_data.png" />
        <div v-if="this.$route.query.keywords">
          <span>抱歉，没有找到</span>
          <span>“{{this.$route.query.keywords}}”</span>
          <span>对应的{{nameY}}，请试试其他关键词试试</span>
        </div>
      </div>
      <noData v-else :name="text"></noData>
    </div>
  </van-pull-refresh>
</template>

<script>
import loading from "@/components/service/loading";
import noData from '@/components/noData'
import { pageMixin } from "@/utils/mixins";

export default {
  name: "listBox",
  mixins: [pageMixin("dataObj")],
  data() {
    return {
      error: false,
      nameY: "",
      dataArraa:null
    };
  },
  components: {
    loading,
    noData,
  },
  props: {
    /* 列表数据 */
    dataArr: {
      type: Array,
      default: () => []
    },
    /* 列表父级数据 包含页码 条数 */
    dataObj: {
      type: Object,
      default: () => ({})
    },
    // Loading做请求锁
    refreshLoading: {
      type: Boolean,
      default: false
    },
    listLoading: {
      type: Boolean,
      default: false
    },
    text: {
        type: String,
        default: '暂无数据'
    }
  },
  computed: {
    finished() {
      return this.dataArr.length >= this.total;
    },
    rLoading: {
      get() {
        return this.refreshLoading;
      },
      set(v) {
        this.$emit("update:refreshLoading", v);
      }
    },
    lLoading: {
      get() {
        return this.listLoading;
      },
      set(v) {
        this.$emit("update:listLoading", v);
      }
    }
  },
  created() {
    console.log(this.$route);
    this.dataArraa = this.dataArr ||''
    if (this.$route.path == "/shopList") {
      this.nameY = "店铺";
    } else if (this.$route.path == "/clues") {
      this.nameY = "线索";
    } else if (this.$route.path == "/serviceList") {
      this.nameY = "服务";
    }
  },
  methods: {
    async onRefresh() {
      console.log(1111);
      this.$emit("load", 1);
    },
    async getData(page) {
      this.$emit("load", page);
    },
    goLoad() {
      this.lLoading = true;
      this.nextPage();
    }
  }
};
</script>

<style scoped lang="scss">
.list {
  /deep/ .van-list__finished-text {
    margin: 0 auto;
    width: 100%;
  }
}
.no-data {
  @include flex(center, center);
  flex-direction: column;
  margin: 200px 0;
  text-align: center;
  padding: 0 rem(130);
  img {
    margin-bottom: 30px;
    width: 200px;
    height: 273px;
  }

  & > div {
    font-size: rem(24);
    font-family: $font;
    font-weight: 400;
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    & > span {
      margin-bottom: rem(10);
    }
    & > span:nth-child(2) {
      color: #0066cc;
    }
  }
}
</style>
