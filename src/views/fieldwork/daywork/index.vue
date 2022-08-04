<template>
  <div style="height: 100%;">
    <van-row
      style="padding: 0 10px"
      @click.native="$router.push(`/fieldwork/daywork/detail/${todo.id}`)"
      v-for="(todo,index) in todoList"
      :key="index"
    >
      <van-col span="24">
        <van-row style="margin-bottom:5px;">
          <van-col span="24">{{todo.title}}</van-col>
        </van-row>
        <van-row style="border-bottom:1px dashed #ccc;margin-bottom:5px;">
          <van-col span="24" style="font-size:.36rem;color:#333;">{{todo.enterTime}}</van-col>
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
        <van-button @click="addWorkRecord()" style="width:100%;height:40px;" type="primary">新增林班工作</van-button>
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
        .catch(err => (this.$loadingState(false)))
    },
    addWorkRecord() {
      this.$router.push({
        name: '新增林班工作'
      })
    }
  },
  mounted() {
    this.getTodoList()
    this.$title('林班工作')
  }
}
</script>

<style>
</style>
