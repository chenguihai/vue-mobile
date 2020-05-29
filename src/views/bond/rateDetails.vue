<template>
  <div class="container">
    <head-nav title="技术费率详情"></head-nav>
    <h4 class="rate_title">入驻类目技术费率详情</h4>
    <div class="table">
      <table class="table_wrap">
        <tr class="head">
          <th class="oneCate">一级分类名称</th>
          <th>三级分类名称</th>
          <th class="threeCate">技术费率</th>
        </tr>
        <tr class="content" v-for="(item,index) in rateList" :key="index">
          <td class="oneCate">{{item.cate_name}}</td>
          <td>
            <div class="twoCate" v-for="(subItem,subIndex) in item.cat_three.split(',')" :key="subIndex">{{subItem}}
            </div>
          </td>
          <td class="threeCate">{{item.tech_rate}}</td>
        </tr>
      </table>
      <div>
        <a :href="'/tollMarketData?id=1'"><span class="link">升级会员等级，享受更低技术费率&gt;</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
    import {techRateList} from '@/api/bond'

    export default {
        name: "rateDetails",
        data() {
            return {
                rateList: []
            }
        },
        created() {
            this.getList();
        },
        methods: {
            async getList() {
                let data = await techRateList();
                if (!data) return
                this.rateList = data;
            }
        }
    }
</script>

<style scoped lang="scss">
  table,
  table tr th,
  table tr td {
    border: 1px solid $c_ccc;
  }

  .rate_title {
    @include height(78px);
    background: $c_bg;
    font-size: 28px;
    font-weight: bold;
    text-indent: $w_20;
  }

  .table {
    padding: $w_30 $w_20 $w_20;
    font-size: 28px;
  }

  .table_wrap {
    width: 100%;
    margin-bottom: $w_20;

    .oneCate {
      /*width: 180px;*/
    }

    .threeCate {
      /*width: 120px;*/
    }

    .twoCate {
      line-height: 40px;
    }

    .head {
      > th {
        font-weight: bold;
        padding: $w_30 $w_20;
      }
    }

    .content {
      color: $c_666;

      > td {
        padding: $w_30 $w_20;
        text-align: center;
        line-height: 37px;
      }
    }
  }

  .link {
    color: $blue;
  }

</style>
