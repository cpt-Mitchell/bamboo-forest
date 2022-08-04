<template>
  <div style="height: 100%;">
    <van-row
      style="padding: 5px 15px 0"
      @click.native="$router.push(`/patrol/assistant/detail/${todo.id}?type=${todo.type}`)"
      v-for="(todo,index) in todoList"
      :key="index"
    >
      <van-col span="24">
        <van-row style="margin-bottom:5px;border-bottom:1px dashed #ccc;">
          <van-col
            span="24"
            style="line-height:36px;height:36px;overflow:hidden;width:100%;white-space:nowrap;text-overflow:ellipsis;"
          >{{(todo.startTime||'').substring(0,16)}}{{todo.type}}</van-col>
        </van-row>
      </van-col>
    </van-row>
    <van-row v-if="todoList.length == 0&&!$store.state.isLoading" style="padding:10px 20px;">
      <van-col span="12" style="text-align:center">
        <p class="no-data-text">暂无待办记录...</p>
      </van-col>
    </van-row>
    <footbar>
      <van-col span="24">
        <van-button @click="addWorkRecord()" style="width:100%;height:40px;" type="primary">新增协管工作</van-button>
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
      this.$loadingState(true, '数据加载中')
      request
        .get(API.DINGTALK_PATROL_PADDINGMANAGEMENT)
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
        name: '新增协管巡山工作'
      })
    }
  },
  mounted() {
    this.getTodoList()
    this.$title('协管巡山工作')
  }
}
</script>

<style>
</style>
