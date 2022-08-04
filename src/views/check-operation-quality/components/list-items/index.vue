<template>
  <div class="list-items" v-if="dataList.length>0">
    <van-row
      style="margin-bottom:5px;border-bottom:1px solid #efefef"
      v-for="(item,index) in dataList"
      :key="index"
    >
      <van-col span="24" @click.native="$router.replace({name:routeName,params:{id:item.fdId}})">
        <van-row class="item-content">
          <van-col span="16" class="left-content">
            <van-row>
              <van-col
                span="24"
                class="item-title"
              >{{item.checkItem}} {{(item.qyNo === '无区域' ? '' : (item.qyNo+ '区')).substr(12) }}</van-col>
            </van-row>
            <van-row>
              <van-col span="24" class="item-sub-title">{{item.lbName}}: {{item.orderNo}}</van-col>
            </van-row>
          </van-col>
          <van-col
            span="8"
            class="right-content"
            align="center"
          >{{(item.createTime||'').substring(0,10)}}</van-col>
        </van-row>
      </van-col>
    </van-row>
  </div>
</template>

<script>
export default {
  props: {
    dataList: {
      type: Array,
      default: () => []
    },
    routeName: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
.list-items {
  padding-top: 10px;
  .item-content {
    .item-title {
      padding: 0 10px;
      font-size: 0.38rem;
      color: #333;
    }
    .item-sub-title {
      padding: 0 10px;
      font-size: 0.34rem;
      color: #666;
    }
    .right-content {
      font-size: 0.36rem;
      height: 46px;
      padding: 8px 0;
      color: #333;
    }
  }
}
</style>
