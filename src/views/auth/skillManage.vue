<template>
  <div class="container bg">
    <head-nav title="技能管理"></head-nav>
    <!--技能类目-->
    <div class="skill_cate" v-if="categoryList.length > 0">
      <h4 class="title">技能类目</h4>
      <p class="info">您已入驻<em class="red">{{settledIn.enteredNum}}</em>个一级类目，还可以继续入驻<em class="blue">{{settledIn.remain}}</em>个一级类目。
      </p>
      <ul class="skill_wrap">
        <a tag="li" :href="`/viewCategory?id=${item.id}&type=skill`" class="skill_item"
                     v-for="item in categoryList" :key="item.id">
          <span class="name">{{item.cate_name}}</span>
          <img class="arrow" src="@/assets/auth/arrow_up.png" alt="">
        </a>
      </ul>
      <div class="btn_wrap">
        <van-button :to="{path:'/selectCategory',query:settledIn}" class="custom_btn" plain type="danger" size="small">
          添加技能类目
        </van-button>
      </div>
    </div>
    <!--添加技能类目-->
    <add-attribute name="添加技能类目" v-else @submit="emitSubmit('cate')">
      <p class="desc">完善您擅长的技能类目，让雇主更快匹配您。</p>
    </add-attribute>
    <!--擅长领域-->
    <div class="skill_cate" v-if="realmList.length > 0">
      <h4 class="title">擅长领域</h4>
      <ul class="field_wrap clearFix">
        <li class="field_item" v-for="(item,index) in realmList" :key="item.id">
          {{item.sr_name}}
          <i v-if="item.hasService === 0" class="deleteIcon" @click="deleteField(index)"></i>
        </li>
      </ul>
      <div class="btn_wrap">
        <van-button @click="routerJump('field')" class="custom_btn" plain type="danger" size="small">添加领域</van-button>
      </div>
    </div>
    <!--添加领域-->
    <add-attribute name="添加领域" v-else @submit="emitSubmit('filed')">
      <p class="desc">完善您擅长的领域，让雇主更快匹配您。</p>
    </add-attribute>
  </div>
</template>

<script>
    import AddAttribute from '@/components/common/AddAttribute'
    import {getRealm, getCategory, skillAdept} from '@/api/auth'
    import {mapMutations, mapState} from 'vuex'

    export default {
        name: "skillManage",
        components: {AddAttribute},
        data() {
            return {
                realmList: [],
                categoryList: [],
                settledIn: {
                    enteredNum: 0,
                    remain: 0,
                }
            }
        },
        created() {
            this.getRealms();
            this.getCategorys();
        },
        methods: {
            ...mapMutations(['GET_CATEGORY_ENTER', 'GET_FIELD']),
            deleteField(index) {
                this.deleteSkill(index);
            },
            async deleteSkill(index) {
                let params = JSON.parse(JSON.stringify(this.realmList));
                params.splice(index, 1);
                let adeptId = params.map(item => item.id)
                const data = await skillAdept({adept_id: adeptId});
                if (!data) return
                this.realmList.splice(index, 1);
                // this.$router.push({path: "/skillManage"});
                // this.getRealms();
            },
            routerJump(type) {
                if (type === 'field') {
                    this.$router.push({path: '/addField', query: {id: this.realmList.map(item => item.id).toString()}});
                } else {

                }
            },
            emitSubmit(val) {
                if (val === 'filed') {
                    this.$router.push({path: '/addField'})
                } else if (val === 'cate') {
                    this.$router.push({path: '/selectCategory', query: this.settledIn})
                }
            },
            async getRealms() {
                const data = await getRealm();
                if (!data) return
                // this.realm = data;
                this.settledIn = {
                    enteredNum: data.enteredNum,
                    remain: data.remain,
                }
              localStorage.setItem('realmList', JSON.stringify(data.realmList))
                this.realmList = data.realmList.filter(item => item.selected === 1);
                // this.$store.commit('GET_FIELD', data.realmList)
            },
            async getCategorys() {
                const data = await getCategory();
                if (!data) return
                this.category = data;
                this.categoryList = data.filter(item => item.entered === 1);
                // this.$store.commit('GET_CATEGORY_ENTER', data)
              localStorage.setItem('categoryList', JSON.stringify(data))
            },
        },
    }
</script>

<style scoped lang="scss">
  .skill_cate {
    padding: $w_20;
    margin: $w_20 $w_15;
    background: $white;

    .title {
      height: 40px;
      line-height: 40px;
      font-size: 28px;
      color: $c_333;
      font-weight: 500;
    }

    .info {
      line-height: 45px;
      font-size: 24px;
      color: $c_666;
      margin: $w_10 0 $w_30;

      > em {
        font-size: 32px;
        font-weight: 500;
      }
    }

    .skill_wrap {
      color: $c_666;

      .skill_item {
        display: flex;
        align-items: center;
        font-size: 30px;
        height: 70px;
        background: $c_bg;
        padding: 0 $w_20;
        margin-bottom: $w_20;
      }

      .name {
        flex: 1;
      }

      .arrow {
        height: 16px;
        width: 30px;
        transform: rotate(90deg);
      }
    }

    .field_wrap {
      padding: $w_20 0;
      color: $c_666;

      .field_item {
        float: left;
        width: 180px;
        height: 56px;
        line-height: 56px;
        text-align: center;
        background: $c_bg;
        margin: 0 40px 34px 0;
        font-size: 24px;
        position: relative;
      }

      .deleteIcon {
        position: absolute;
        top: 6px;
        right: 6px;
        z-index: 10;
        width: 20px;
        height: 20px;
        background: url("/static/images/gray_delete.png") no-repeat center;
        background-size: 20px;
      }
    }

    .btn_wrap {
      padding: 40px 0;
      text-align: center;
    }

    .custom_btn {
      height: 56px;
      line-height: 56px;
      padding: 0 28px;
      background: $white;
      font-size: 24px;
      border-radius: 4px;
      border: 1px solid $red;
    }
  }

  .not_skill {
    margin: $w_20 $w_15;
    background: $white;
    height: 329px;
    border-radius: 8px;
    color: $c_333;
    padding-top: 50px;
    text-align: center;

    .desc {
      height: 33px;
      line-height: 33px;
      font-size: 24px;
      margin-bottom: 90px;
    }
  }
</style>
