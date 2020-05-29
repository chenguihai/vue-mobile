<template>
  <div class="m-address-panel">
    <div class="m-address-title">投放区域</div>
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
    <!-- <div class="area_list">
      <ul class="province_list">
        <li
          v-for="(itemer,index) of arealist"
          :key="itemer.id"
          :class="['province_item',itemer.select ||provinceIndex === index?'active':'']"
          @click="selectProvince(index)"
        >{{ itemer.name }}</li>
      </ul>
      <ul class="city_list">
        <li
          v-for="(item,index) of cityList"
          :key="item.id"
          :class="['city_item',item.select ||cityIndex === index?'active':'']"
          :value="item.id"
          @click="selectCity(index)"
        >
          <span class="name">{{item.name }}</span>
          <img class="img" src="@/assets/shop/hook.png" alt="选中" />
        </li>
      </ul>
    </div>-->
    <div class="m-btn-wrap">
      <button class="m-btn-cancel" @click="closeThis">取消</button>
      <button class="m-btn-save" @click="save">确定</button>
    </div>
  </div>
</template>
<script>
import citydata from "@/utils/city.json";
export default {
  name: "ChoicePanel",
  props: ["list"],
  data() {
    return {
      arealist: [],
      cityList: [],
      selectArea: this.list || [],
      form: {},
      provinceIndex: 0,
      cityIndex: -1
    };
  },
  created() {
    const data = JSON.parse(JSON.stringify(citydata));
    for (let i = 0; i < data.length; i++) {
      if (Array.isArray(data[i].child) && data[i].id != "100000") {
        data[i].child.unshift({
          id: data[i].id,
          pid: data[i].id,
          name: "全部"
        });
      }
    }
    this.arealist = data;
    this.cityList = data[0].child;
  },
  methods: {
    selectProvince(index) {
      this.provinceIndex = index;
      this.cityIndex = -1;
      this.cityList = this.arealist[index].child;
    },
    submitForm() {
      this.$emit("submit", this.selectArea);
    },
    handleClose() {
      this.$emit("close");
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
    selectCitysss(index) {
      if (this.cityIndex === index) {
        // 点击的是相同项，返回
        return;
      }
      const item = this.cityList[index];
      if (item.id == 100000) {
        this.selectArea = [
          {
            cityes: "全国",
            id: 100000,
            pid: 100000
          }
        ];

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
        return;
      } else {
        let startNum = this.selectArea.findIndex(res => res.id == 100000);
        if (startNum >= 0) {
          this.selectArea.splice(startNum, 1);
        }
      }
      const area = JSON.parse(JSON.stringify(this.selectArea));
      let provinceItem = this.arealist[this.provinceIndex];
      if (index === 0) {
        // 点击全部
        const newArea = [];
        for (let i = 0; i < area.length; i++) {
          if (item.pid !== area[i].pid) {
            // 把相等的pid项去除掉
            newArea.push(area[i]);
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
        if (this.cityIndex === 0) {
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
    closeThis() {
      this.$emit("close");
    },
    save() {
      this.$emit("save", this.selectArea);
    }
  }
};
</script>
<style lang="scss" scoped>
.select_area {
  display: flex;
  flex-wrap: wrap;
  font-size: 26px;
  height: 140px;
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
.m-address-panel {
  position: relative;
  height: 100vh;
  overflow: hidden;
  background: #fff;
  .m-address-title {
    border-bottom: 1px solid #eee;
    text-align: center;
    height: rem(90);
    line-height: rem(90);
  }
}
.area_list {
  display: flex;
  height: calc(100vh - 348px);
  margin: 0 20px;
  .province_list,
  .city_list {
    overflow-y: auto;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .province_list {
    width: 240px;
    overflow-y: auto;
  }
  .province_item {
    height: 75px;
    line-height: 75px;
    overflow: hidden;
    cursor: pointer;
    text-indent: 10px;

    &:hover,
    &.active {
      color: $red;
    }
  }

  .city_list {
    flex: 1;
    font-size: 12px;
    border-left: 1px solid $c_eee;
    padding-left: 10px;
  }

  .city_item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    font-size: 24px;
    padding-left: rem(20);
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
.lister {
  border-radius: rem(20);
  margin-right: rem(12);
  margin-bottom: rem(12);
}
.m-btn-wrap {
  height: rem(90);
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  border-top: 1px solid #eee;
  display: flex;
  .m-btn-cancel {
    // width:50%;
    flex: 1;
    height: rem(90);
    background: #fff;
    color: #000;
    line-height: rem(90);
    text-align: center;
  }
  .m-btn-save {
    // width:50%;
    flex: 1;
    height: rem(90);
    background: $red;
    color: #fff;
    line-height: rem(90);
    text-align: center;
  }
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
    padding: 0 40px 0 20px;

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
