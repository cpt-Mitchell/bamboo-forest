<template>
  <div style="height: 100%;" class="record-query">
    <van-row style="padding: 5px 10px">
      <van-col span="10" style="line-height: 33px;display:flex;">
        <div style="font-size:14px;">营林年度：</div>
        <div style="font-size:14px;">{{ '2021/2022' || '点击选择' }}</div>
      </van-col>
      <van-col span="10" style="line-height: 33px;display:flex;">
        <div style="font-size:14px;">审批状态：</div>
        <div style="font-size:14px;">{{ '已审批' || '点击选择' }}</div>
      </van-col>
      <van-col span="4">
        <van-button type="primary" style="width:100%;height:28px;">查询</van-button>
      </van-col>
    </van-row>
    <div style="margin-top:5px;">
      <div
        style="background-color: #76bed6;color:#fff;text-align: center;display:flex;flex-direction: row;height:32px;line-height:32px;"
      >
        <div style="width:75%" class="right-border top-border">申请单位名称</div>
        <div style="width:25%" class="top-border">审批状态</div>
      </div>
      <div style="height: calc(100vh - 165px);overflow: auto;">
        <div style="display:flex;flex-direction: row;line-height:1.5;" class="text-content" v-for="item in 30">
          <div style="width:75%" class="right-border top-border">
            申请单位名称申请单位名称申请单位名称申请单位名称申请单位名称申请单位名称
          </div>
          <div style="width:25%;display: flex;align-items: center;justify-content: center;" class="top-border">
            已审批(查看)
          </div>
        </div>
      </div>
    </div>
    <footbar>
      <van-col span="24">
        <van-button @click="addRecord()" style="width:100%;height:40px;" type="primary">新增</van-button>
      </van-col>
    </footbar>
  </div>
</template>

<script>
import Footbar from '@/components/Footbar'
import request from '@/utils/httpUtil'
import { API } from '@/api'
export default {
  data() {
    return {
      todoList: []
    }
  },
  components: {
    Footbar
  },
  methods: {
    getTodoList() {
      this.$loadingState(true)
      request
        .get(API.DINGTALK_FOREST_GETCURRENT)
        .then(resp => {
          this.$loadingState(false)
          if (resp.data.errorCode) {
            this.todoList = resp.data.data
          } else {
            this.todoList = []
          }
        })
        .catch(err => this.$loadingState(false))
    },
    addRecord() {
      this.$router.push({
        name: '记录申请表'
      })
    }
  },
  mounted() {
    // this.getTodoList()
    this.$title('申请记录查询')
  }
}
</script>

<style lang="less" scoped>
.record-query {
  * {
    font-size: 14px;
  }
  .text-content > div {
    padding: 3px 5px;
    box-sizing: border-box;
  }
  .text-content:last-child {
    border-bottom: 1px solid #ccc;
  }
}
</style>
