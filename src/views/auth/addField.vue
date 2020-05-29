<template>
  <div class="container">
    <head-nav title="选择领域"></head-nav>
    <div class="cate_wrap">
      <!--添加领域-->
      <h4 class="title">请选择您擅长的领域</h4>
      <ul class="field_wrap clearFix">
        <li
          :class="['field_item',item.checked ? item.hasService===1? 'disabled':'active':'']"
          v-for="(item,index) in realmLists" :key="item.id"
          @click="clickField(index,item.hasService)">
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
    import {skillAdept} from '@/api/auth'

    export default {
        name: "addField",
        components: {FixedBtn},
        data() {
            return {
                realmLists: [],
                filterArr: []
            }
        },
        created() {
            let query = this.$route.query;
            // let data = JSON.parse(JSON.stringify(this.fieldList));
            let realmList = localStorage.getItem('realmList');
            let data = [];
            if (realmList) {
                data = JSON.parse(realmList);
            }
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
        },
        // computed: mapState({
        //     fieldList: state => state.field,
        // }),
        methods: {
            clickField(index, type) {
              if (type === 1) {
                    return;
                }
              let checked = this.realmLists[index].checked;
              let data = this.realmLists[index];
              let filterArr = this.realmLists.filter(item => item.checked);
              if(checked){//之前选中过

              }else{
                if (filterArr.length >= 9) {
                  this.$toast('最多选择9个领域');
                  return
                }
              }

              if (filterArr.length === 1 && data.checked) {
                this.$toast('至少选择1个领域');
                return
              }
              data.checked = !data.checked;
                this.$set(this.realmLists, index, data);
                this.filterArr = this.realmLists.filter(item => item.checked);

            },
            onSubmit() {
                // let data = this.realmLists.filter(item => item.checked), params = '';
                // if (data.length > 0) {
                //     params = data.map(item => item.id).toString();
                // }
                // this.$router.push({path: "/publishService", query: {realm: params}});
                this.getSkillAdept();
            },
            async getSkillAdept() {
                let adeptId = this.filterArr.map(item => item.id)
                const data = await skillAdept({adept_id: adeptId});
                if (!data) return
                this.$router.push({path: "/skillManage"});
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

        &.disabled {
          color: $red;
          background-color: $red_bg;
        }
      }
    }
  }
</style>
