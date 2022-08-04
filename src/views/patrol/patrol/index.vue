<template>
  <div style="height: 100%;">
    <van-row
      style="padding: 5px 15px 0"
      @click.native="$router.push(`patrol/detail/${todo.id}`)"
      v-for="(todo,index) in todoList"
      :key="index"
    >
      <van-col span="24">
        <van-row style="margin-bottom:5px;">
          <van-col span="24">{{todo.title}}</van-col>
        </van-row>
        <van-row style="border-bottom:1px dashed #ccc;margin-bottom:5px;padding-bottom: 5px;">
          <van-col
            span="24"
            style="font-size:.36rem;color:#333;"
          >{{parseTime((todo.arriveTime||'').replace(/-/g,"/"),"{m}月{d}日 {h}时{i}分")}}</van-col>
        </van-row>
      </van-col>
    </van-row>
    <van-row v-if="todoList.length == 0&&!$store.state.isLoading" style="padding:10px 20px;">
      <van-col span="24" style="text-align:center">
        <p class="no-data-text">暂无待办记录...</p>
      </van-col>
    </van-row>
    <footbar>
      <van-col span="24">
        <van-button @click="addWorkRecord()" style="width:100%;height:40px;" type="primary">新增巡山到达</van-button>
      </van-col>
    </footbar>
  </div>
</template>

<script>
import Footbar from '@/components/Footbar'
import request from '@/utils/httpUtil'
import { API } from '@/api'
import {
  parseTime
} from '@/utils/index'
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
    parseTime(date, format) {
      return parseTime(date, format)
    },
    getTodoList() {
      this.$loadingState(true, '数据加载中')
      request
        .get(API.DINGTALK_PATROL_GETCURRENT)
        .then(resp => {
          this.$loadingState(false)
          if (resp.data.errorCode) {
            this.todoList = resp.data.data
          } else {
            this.todoList = []
          }
        })
        .catch(err => (this.$loadingState(false)))
    },
    addWorkRecord() {
      this.$router.push({
        name: '新增巡山工作'
      })
    }
  },
  mounted() {
    this.getTodoList()
    this.$title('巡山工作列表')
  }
}
</script>

<style>
</style>
