<template>
  <div>
    <div class="split_line"></div>
    <div class="archive" v-if="archive">
      <!--关于我们-->
      <div class="archive_wrap">
        <h3 class="title">关于我们</h3>
        <p class="desc">
          {{archive.about_us}}
        </p>
      </div>
      <!--一级赋能技能-->
      <item-skill v-if="archive.skillList" :oblig="archive.skillList"></item-skill>
      <!--擅长领域-->
      <item-skill v-if="archive.realmList" title="擅长领域" :flag="true" :oblig="archive.realmList"></item-skill>
      <!--媒介资质-->
      <circle-skill v-if="archive.mediaAptitudeList" :oblig="archive.mediaAptitudeList"></circle-skill>
      <!--自传资质-->
      <circle-skill v-if="archive.selfHonorList.length && archive.selfHonorList[0].list.length"
                    :oblig="archive.selfHonorList" :self="true"></circle-skill>
      <!--隶属媒体公司  个人才有-->
      <div class="archive_wrap" v-if="archive.mediaCompanyList">
        <h3 class="title">隶属媒体公司</h3>
        <p class="desc">{{archive.mediaCompanyList &&archive.mediaCompanyList.company_name}}</p>
      </div>
      <!--工作经历  个人才有-->
      <div class="archive_wrap" v-if="archive.experienceList.length">
        <h3 class="title">工作经历</h3>
        <div v-for="item in archive.experienceList" :key="item.id">
          <p class="desc">{{item.company_name}}/{{item.department}}</p>
          <p class="desc"><span class="time">{{item.begin_time | timeFilter}}-{{item.end_time |timeFilter}}</span><span>{{item.position}}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CircleSkill from './components/circleSkill'
  import ItemSkill from './components/itemSkill'
  import {getStoreArchive} from '@/api/shop'

  export default {
    name: 'storeArchive',
    components: {CircleSkill, ItemSkill},
    data() {
      return {
        storeId: this.$route.params.id,
        archive: null,
      }
    },
    methods: {
      async getArchive() {
        const data = await getStoreArchive(this.storeId)
        if (!data) return
        this.archive = data
        localStorage.setItem('archiveObj', JSON.stringify(data));
      }
    },
    created() {
      this.getArchive()
    },
    filters: {
      timeFilter(val = '') {
        return val.split(' ')[0].replace(/-/g, '.');
      },
    }
  }
</script>

<style scoped lang="scss">
  .archive {
    padding: 0 $w_30 $w_30;
    background: $white;
  }

  .archive_wrap {
    padding-top: 50px;

    .title {
      @include height(42px);
      font-size: 30px;
      font-weight: bold;
    }

    .desc {
      font-size: 22px;
      line-height: 30px;
      margin-top: $w_10;
      color: $c_666;

      .time {
        width: 283px;
        display: inline-block;
      }
    }
  }
</style>
