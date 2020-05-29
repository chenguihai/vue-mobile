<template>
  <div class="service_item">
    <div class="top_wrap" @click="handleService('edit',itemData.id)">
      <van-image class="logo" :src="itemData.image_url+'?x-oss-process=image/resize,m_fill,h_150,w_250'" :noOss="false" :lazy-load="true"></van-image>
      <h4 class="name">{{itemData.case_name}}</h4>
      <p class="cate">{{itemData.cate_name}}</p>
      <p class="price">￥{{itemData.price}}</p>
    </div>
    <div class="btn_wrap" :key="itemData.id">
      <van-button plain class="btn" @click="handleService('edit',itemData.id)">编辑</van-button>
      <van-button v-if="itemData.is_added === 1" plain class="btn" @click="handleService('shelf',0)">下架</van-button>
      <van-button plain class="btn active" v-else-if="itemData.is_added === 0"
                  @click="handleService('shelf',1)">上架
      </van-button>
      <van-button plain class="btn active" @click="handleService('delete')">删除</van-button>
    </div>
    <!--弹出框-->
  </div>
</template>

<script>
    import {changeAdded, caseDelete} from '@/api/customer'

    export default {
        name: "ListManage",
        props: {
            item: {
                type: Object,
                reqirue: true
            },
            index: {
                type: Number,
                reqirue: true
            }
        },
        data() {
            return {
                itemData: this.item,
                selectIndex: this.index,
                form: {
                    id: this.item.id + '',//	是	integer	服务id,多个值用逗号隔开
                    status: '',//	是	integer	上架状态:0下架，1上架
                },
            }
        },
        methods: {
            handleService(type, value) {
                if (type === 'shelf') {
                    this.handleShelf(value);
                } else if (type === 'delete') {
                    this.delete();
                } else if (type === 'edit') {
                    this.$router.push({path: '/publishExample', query: {id: value}})
                }
            },
            async handleShelf(value) {
                let params = {
                    id: this.itemData.id,//	是	int	客户合作示例id
                    is_added: value,//	是	int	上架状态 0下架 1上架
                }
                const data = await changeAdded(params);
                if (!data) return
                this.$emit('refresh', 'shelf', {is_added: value, index: this.selectIndex})
            },
            async delete() {
                const data = await caseDelete(this.itemData.id);
                if (!data) return
                this.$toast('删除成功');
                this.$emit('refresh', 'delete', this.selectIndex)
            },
        }
    }
</script>

<style scoped lang="scss">
  .service_item {
    padding: 0 $w_30;
    margin: $w_20 0;
    background: $white;
    border-radius: $w_20;

    .top_wrap {
      padding: $w_20 0;
      border-bottom: 1px solid $c_eee;

      .logo {
        float: left;
        width: 250px;
        height: 150px;
        margin-right: $w_20;
      }

      .name {
        height: 66px;
        line-height: 33px;
        font-size: 24px;
        @include ellipsis(2);
      }

      .cate {
        @include height(30px);
        font-size: 22px;
        color: $c_999;
        margin: $w_10 0;
        @include ellipsis();
      }

      .price {
        @include height(33px);
        font-size: 24px;
        font-weight: 500;
        color: $price;
      }
    }
  }

  .btn_wrap {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 90px;

    .btn {
      margin-left: $w_20;
      width: 135px;
      height: 50px;
      font-size: 24px;
      border-radius: 25px;
      text-align: center;
      line-height: 50px;
      color: $c_666;
      background: $white;
      border: 1px solid $c_ccc;
    }

    .active {
      color: $red;
      background: $white;
      border: 1px solid $red;
    }
  }
</style>
