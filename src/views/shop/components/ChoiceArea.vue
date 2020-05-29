<template>
  <van-popup
    v-model="showFlag"
    position="right"
    class="popup"
    :style="{ height: '100%' }"
    @close="$emit('close')"
  >
    <p class="addr_wrap"><span>地区</span><span :class="['right',{active:cityName}]">{{cityName || '暂无'}}</span></p>
    <div class="select_wrap">
      <ul class="left">
        <li :class="['left_item',index ===provinceIndex?'red':'']"
            v-for="(item,index) in provinceList" :key="item.id"
            @click="clickProvince(index)"
        >
          {{item.name}}
        </li>
      </ul>
      <ul class="right">
        <li class="right_item" v-for="(item) in cityList" :key="item.id"
            @click="clickCity(item.id,item.name)">{{item.name}}
          <i class="deleteIcon" v-if="region_id == item.id"></i>
        </li>
      </ul>
    </div>
    <div class="side-btn-box">
      <div class="side-btn" @click="$emit('close')">取消</div>
      <div class="side-btn" @click="onsubmit">确定</div>
    </div>
  </van-popup>
</template>

<script>
    import city from "@/utils/city.json";

    export default {
        name: "ChoiceArea",
        props: {
            item: {
                type: Object,
            }
        },
        data() {
            const {name = '', id = ''} = this.item;
            return {
                showFlag: true,
                provinceList: JSON.parse(JSON.stringify(city)),
                cityList: [],
                provinceIndex: -1,
                cityName: name,
                region_id: id
            }
        },
        created() {
            if (this.region_id) {
                let data = this.provinceList, cityData = [];
                for (let i = 0; i < data.length; i++) {
                    cityData = data[i].child || [];
                    for (let j = 0; j < cityData.length; j++) {
                        if (cityData[j].id == this.region_id) {
                            this.provinceIndex = i;
                            this.cityList = data[i].child
                            break;
                            return false;
                        }
                    }
                }
            }
        },
        methods: {
            onsubmit() {
                this.$emit('submit', this.region_id, this.cityName);
            },
            clickProvince(index) {
                this.provinceIndex = index;
                this.cityList = this.provinceList[index].child;
            },
            clickCity(id, name) {
                let flag = name === this.cityName;
                this.region_id = flag ? '' : id;
                this.cityName = flag ? '' : name;
            }
        }
    }
</script>

<style scoped lang="scss">
  .popup {
    width: 640px;
    padding: 0 $w_30;
  }

  .addr_wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 90px;
    border-bottom: 1px solid $c_eee;
    font-size: 30px;

    .right {
      font-size: 26px;
    }

    .active {
      color: $red;
    }
  }

  .select_wrap {
    display: flex;
    height: calc(100vh - 188px);

    .left {
      width: 230px;
      overflow-y: auto;
      border-right: 1px solid $c_eee;

      .left_item {
        font-size: 26px;
        line-height: 80px;
      }
    }

    .right {
      flex: 1;
      overflow-y: auto;
      padding-left: $w_20;
      padding-top: $w_10;

      .right_item {
        font-size: 24px;
        line-height: 60px;

        .deleteIcon {
          float: right;
          margin-top: 19px;
          width: 33px;
          height: 22px;
          background: url("/static/images/redcorrect.png") no-repeat center;
          background-size: 33px 22px;
        }
      }
    }
  }

  .custom_btn {
    font-size: 30px;
    width: 100%;
    height: 98px;
    line-height: 98px;
    background: $red;
    color: $white;
    text-align: center;
  }

  .side-btn-box {
    position: fixed;
    bottom: 0;
    right: 0;
    margin: auto;
    width: 640px;
    height: 88px;
    @include borderBox;
    @include flex;

    .side-btn {
      flex: 1;
      height: 100%;
      text-align: center;
      line-height: 88px;
      font-size: 30px;
      font-family: $font;
      font-weight: 400;
      background: $red;
      color: $white;

      &:first-child {
        background: $white;
        color: $c_333;
        box-shadow: -1px 0px 1px 0px rgba(0, 0, 0, 0.5);
      }
    }
  }
</style>
