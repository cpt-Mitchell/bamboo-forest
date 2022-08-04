<template>
  <div class="system-info-box">
    <van-collapse v-model="activeName" accordion>
      <template v-for="(item, index) in list">
        <van-collapse-item :name="item['ID']" :key="index">
          <div slot="title">
            <van-row>
              <van-col span="16">{{item['模块']}}模块</van-col>
              <van-col span="8" align="center">{{(item['录入时间']||'').substr(0,11)}}</van-col>
            </van-row>
          </div>
          <van-row>
            <van-col style="font-size:14px" span="12">姓名：{{item['姓名']}}</van-col>
            <van-col style="font-size:14px" span="12">用户号：{{item['用户号']}}</van-col>
          </van-row>
          <van-row>
            <van-col style="font-size:14px" span="12">录入时间：{{(item['录入时间']||'').substr(11)}}</van-col>
            <van-col style="font-size:14px" span="12">模块：{{item['模块']}}</van-col>
          </van-row>
          <van-row>
            <van-col style="font-size:14px" span="12">公司：{{item['公司']}}</van-col>
            <van-col style="font-size:14px" span="12">机构名称：{{item['机构名称']}}</van-col>
          </van-row>
          <van-row>
            <van-col style="font-size:14px" span="24">内容：{{item['内容']}}</van-col>
          </van-row>
        </van-collapse-item>
      </template>
    </van-collapse>
    <van-row v-if="!list || list.length === 0">
      <van-col span="24">
        <p class="no-data-text">暂无系统消息...</p>
      </van-col>
    </van-row>
  </div>
</template>

<script>
import request from '@/utils/httpUtil'
import { API } from '@/api'
import { parseTime } from '@/utils/index'
export default {
  data() {
    return {
      activeName: '',
      list: []
    }
  },
  methods: {
    parseTime(value, fmt) {
      return parseTime(new Date(value), fmt)
    },
    initInfo() {
      this.$loadingState(true, '数据加载中')
      request(API.FOREST_INFORMATION).then(res => {
        this.$loadingState(false)
        if (res.data.errorCode) {
          this.list = res.data.data || []
        } else {
          this.$dAlert('查询信息失败')
        }
      }).catch(err => {
        this.$loadingState(false)
      })
    }
  },
  created() {
    this.initInfo()
  }
}
</script>

<style>
.system-info-box {
  width: 98vw;
  margin: 0 auto;
}
</style>
