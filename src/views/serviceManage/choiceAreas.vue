<template>
  <div class="container">
    <head-nav title="选择地区"></head-nav>
    <ul class="select_area" ref="areaRefs">
      <li class="label">已选地区：</li>
      <!--      <li class="not">暂无</li>-->
      <li class="item" v-for="(item,index) in selectArea" :key="item.cityes">
        <span class="name">{{item.cityes}}</span>
        <i class="delete" @click="handleClosearea(index)"></i>
      </li>
    </ul>
    <div class="areas_wrap">
      <ul class="left">
        <li
          :class="['left_item',item.select || provinceIndex === index?'red':'']"
          v-for="(item,index) in arealist"
          :key="item.id"
          @click="selectProvince(index)"
        >{{item.name}}</li>
      </ul>
      <ul class="right">
        <li
          :class="['right_item',item.select || cityIndex === index?'active':'']"
          v-for="(item,index) in cityList"
          :key="item.id"
          @click="selectCity(index)"
        >
          <span class="name">{{item.name }}</span>
          <img class="img" src="@/assets/shop/hook.png" alt="选中" />
        </li>
      </ul>
    </div>
    <fixed-btn name="保存" @submit="onSubmit"></fixed-btn>
  </div>
</template>

<script>
import FixedBtn from "@/components/common/FixedBtn";
import citydata from "@/utils/city.json";

export default {
  name: "ChoiceArea",
  components: { FixedBtn },
  data() {
    return {
      selectArea: [],
      arealist: [],
      cityList: [],
      provinceIndex: 0,
      cityIndex: -1
    };
  },
  created() {
    let query = this.$route.query;
    const data = JSON.parse(JSON.stringify(citydata));
    for (let i = 0; i < data.length; i++) {
      if (data[i].id !== "100000" && Array.isArray(data[i].child)) {
        data[i].child.unshift({
          id: data[i].id,
          pid: data[i].id,
          name: "全部"
        });
      }
    }
    if (query.id) {
      let regions = query.id.split(",");
      this.selectArea = this.chooiceAreaList(regions);
    }
    this.arealist = data;
    this.cityList = data[0].child;
  },
  methods: {
    onSubmit() {
      let params = "";
      if (this.selectArea.length > 0) {
        let data = this.selectArea.map(item => item.id);
        params = data.toString();
      }
      this.$router.push({
        path: "/publishService",
        query: { regions: params }
      });
    },
    handleClosearea(index) {
      // 关闭服务地区数据
      const { pid, id } = this.selectArea[index];
      let item = [];
      for (let i = 0; i < this.arealist.length; i++) {
        //省
        if (this.arealist[i].id !== pid) {
          continue;
        }
        item = this.arealist[i].child;
        for (let j = 0; j < item.length; j++) {
          //市
          if (item[j].id === id) {
            let cityList = this.arealist[i];
            cityList.child[j].select = false;
            let flag = cityList.child.filter(item => item.select);
            cityList.select = !!flag.length;
            this.$set(this.arealist, i, cityList);
            break;
          }
        }
      }
      this.selectArea.splice(index, 1);
      this.cityIndex = -1;
    },
    selectProvince(index) {
      this.provinceIndex = index;
      this.cityIndex = -1;
      this.cityList = this.arealist[index].child;
    },
    selectCity(index) {
      if (this.cityIndex === index) {
        // 点击的是相同项，返回
        return;
      }
      const item = this.cityList[index];
      const area = JSON.parse(JSON.stringify(this.selectArea));
      let provinceItem = this.arealist[this.provinceIndex];
      if (index === 0) {
        // 点击全部
        const newArea = [];
        if (item.id === "100000") {
          //如果点击是全国
          let country = JSON.parse(JSON.stringify(this.arealist)),
            item = [];
          country[0].select = true;
          country[0].child[index].select = true;
          for (let i = 1; i < country.length; i++) {
            if (country[i].select) {
              country[i].select = false;
              item = country[i].child;
              for (let j = 0; j < item.length; j++) {
                if (item[j].select) {
                  item[j].select = false;
                }
              }
            }
          }
          this.arealist = country;
        } else {
          // 点击全部
          for (let i = 0; i < area.length; i++) {
            if (item.pid !== area[i].pid) {
              // 把相等的pid项去除掉
              newArea.push(area[i]);
            }
          }
        }
        newArea.push({
          cityes: this.arealist[this.provinceIndex].name,
          id: item.id,
          pid: item.pid
        });
        this.selectArea = newArea;

        provinceItem.child = provinceItem.child.map((item, index, arr) => {
          item.select = index === 0;
          return item;
        });
        provinceItem.select = true;
        this.$set(this.arealist, this.provinceIndex, provinceItem);
      } else {
        // 选择除全部以外的项
        if (area.length === 1 && area[0].id === "100000") {
          //如果上一步点击是全国
          area.splice(0, 1);
          area.push({
            // 添加新添加的一项
            cityes: item.name,
            id: item.id,
            pid: item.pid
          });
          this.selectArea = area;


          let contry = this.arealist[0];
          contry.select = false; //取消全国的样式
          contry.child[0].select = false;
          provinceItem.select = true;
          provinceItem.child[index].select = true;
          this.$set(this.arealist, 0, contry);
          this.$set(this.arealist, this.provinceIndex, provinceItem);
        } else if (this.cityIndex === 0) {
          // 如果上步点击的是全部
          for (let i = 0; i < area.length; i++) {
            if (this.cityList[0].pid === area[i].pid) {
              // 把全部那一项去掉
              area.splice(i, 1);
            }
          }
          area.push({
            // 添加新添加的一项
            cityes: item.name,
            id: item.id,
            pid: item.pid
          });
          this.selectArea = area;

          provinceItem.select = true; //设置选择高亮
          provinceItem.child[0].select = false;
          provinceItem.child[index].select = true;
          this.$set(this.arealist, this.provinceIndex, provinceItem);
        } else {
          // 点击的还是其他的单项
          const flag = this.selectArea.some(subItem => item.id === subItem.id);
          if (!flag) {
            // 判断之前是否选中过
            this.selectArea.push({
              cityes: item.name,
              id: item.id,
              pid: item.pid
            });
          }
          provinceItem.select = true;
          provinceItem.child[index].select = true;
          this.$set(this.arealist, this.provinceIndex, provinceItem);
        }
      }
      this.cityIndex = index;

      this.$nextTick(() => {
        //设置滚动条一直滚动到底部
        let areaRefs = this.$refs.areaRefs;
        areaRefs.scrollTop = areaRefs.scrollHeight;
      });
    },
    chooiceAreaList(regions) {
      // 返回城市的数据，选中数组
      const cityDatas = JSON.parse(JSON.stringify(citydata));
      // ["130000", "140000"]
      let cityItem = [];
      const selectArea = [];
      for (let i = 0; i < regions.length; i++) {
        // 服务地区
        for (let j = 0; j < cityDatas.length; j++) {
          if (regions[i] === cityDatas[j].id) {
            selectArea.push({
              id: cityDatas[j].id,
              cityes: cityDatas[j].name,
              pid: cityDatas[j].pid
            });
            break;
          } else {
            cityItem = Array.isArray(cityDatas[j].child)
              ? cityDatas[j].child
              : []; // 有些没有child属性
            for (let k = 0; k < cityItem.length; k++) {
              if (regions[i] === cityItem[k].id) {
                // 选中
                selectArea.push({
                  id: cityItem[k].id,
                  cityes: cityItem[k].name,
                  pid: cityItem[k].pid
                });
                break;
              }
            }
          }
        }
      }
      return selectArea;
    }
  }
};
</script>

<style scoped lang="scss">
.select_area {
  display: flex;
  flex-wrap: wrap;
  font-size: 26px;
  // max-height: 160px;
  height: 160px;
  overflow-x: hidden;
  overflow-y: auto;
  padding: $w_10 $w_20;
  border-bottom: 1px solid $c_eee;

  .not,
  .label {
    @include height(50px);
    margin: $w_10;
  }

  .not {
    color: $c_666;
  }

  .label {
    font-size: 30px;
  }

  .item {
    display: inline-flex;
    padding-right: 18px;
    height: 50px;
    line-height: 50px;
    background: $c_bg;
    border-radius: 25px;
    margin: $w_10;
    color: $red;

    .name {
      flex: 1;
      text-align: center;
      margin: 0 $w_20;
    }

    .delete {
      width: 18px;
      height: 18px;
      margin-top: $w_10;
      background: url("/static/images/red_delete.png") no-repeat center;
      background-size: 18px;
    }
  }
}

.active {
  font-size: 26px;
  color: $red;
}

.areas_wrap {
  display: flex;
  // height: calc(100vh - 188px);
  height: calc(100vh - 348px);

  .left {
    width: 240px;
    overflow-y: auto;
    border-right: 1px solid $c_eee;

    .left_item {
      text-align: center;
      font-size: 26px;
      line-height: 80px;
    }

    .active {
      color: $red;
    }
  }

  .right {
    flex: 1;
    overflow-y: auto;
    padding: 0 80px 0 40px;

    .right_item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 24px;
      height: 60px;

      .img {
        width: 33px;
        height: 22px;
        visibility: hidden;
      }
    }

    .active {
      color: $red;

      .img {
        visibility: visible;
      }
    }
  }
}
</style>
