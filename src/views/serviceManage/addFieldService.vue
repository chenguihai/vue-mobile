<template>
  <div class="container">
    <head-nav title="选择领域"></head-nav>
    <div class="cate_wrap">
      <!--添加领域-->
      <h4 class="title">请选择您擅长的领域</h4>
      <ul class="field_wrap clearFix">
        <li :class="['field_item',item.checked? 'active':'']" v-for="(item,index) in realmLists" :key="item.id"
            @click="clickField(index)">
          {{item.sr_name}}
        </li>
      </ul>
    </div>
    <fixed-btn name="保存" :fixed="1" @submit="onSubmit"></fixed-btn>
  </div>
</template>

<script>
    import FixedBtn from "@/components/common/FixedBtn";
    import {mapState} from 'vuex'

    export default {
        name: "addFieldService",
        components: {FixedBtn},
        data() {
            return {
                realmLists: [],
                filterArr: []
            }
        },
        created() {
            let query = this.$route.query;
            let data = JSON.parse(JSON.stringify(this.realmList));
            if (query.id) {
                let selectData = query.id.split(',');
                for (let i = 0; i < selectData.length; i++) {
                    for (let j = 0; j < data.length; j++) {
                        if (selectData[i] == data[j].id) {
                            data[j].checked = true;
                            break
                        }
                    }
                }
            }
            this.realmLists = data;
            // this.$router.push({path: '/publishService'})
        },
        computed: mapState({
            realmList: state => state.serviceManage.realm,
        }),
        methods: {
            clickField(index) {
                let filterArr = this.realmLists.filter(item => item.checked);
                if (filterArr.length > 8) {
                    this.$toast('最多选择9个领域');
                    return
                }
                let data = this.realmLists[index];
                data.checked = !data.checked;
                this.filterArr = filterArr;
                this.$set(this.realmLists, index, data);
            },
            onSubmit() {
                let data = this.realmLists.filter(item => item.checked), params = '';
                if (data.length > 0) {
                    params = data.map(item => item.id).toString();
                }
                this.$router.push({path: "/publishService", query: {realm: params}});
            },
        }
    }
</script>


<style scoped lang="scss">
  .cate_wrap {
    padding: $w_20 50px;
    background: $white;
    color: $c_666;
    border-top: 1px solid $c_eee;

    .title {
      height: 37px;
      line-height: 37px;
      font-size: 26px;
    }

    .field_wrap {
      .field_item {
        float: left;
        width: 180px;
        height: 56px;
        line-height: 56px;
        text-align: center;
        background: $c_bg;
        margin-top: 30px;
        font-size: 24px;
        position: relative;

        &:not(:nth-child(3n)) {
          margin-right: 40px;
        }

        &.active {
          color: $red;
          background: $red_bg url("/static/images/bottom_hook.png") no-repeat bottom right;
          background-size: 26px 26px;
        }
      }
    }
  }
</style>
