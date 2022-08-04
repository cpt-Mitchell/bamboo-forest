<template>
  <div style="height: 100%">
    <van-row
      style="padding: 5px 15px 0"
      @click.native="goDetailed(todo)"
      v-for="(todo, index) in todoList"
      :key="index"
    >
      <van-col span="24">
        <van-row style="margin-bottom: 5px; border-bottom: 1px dashed #ccc">
          <van-col
            span="24"
            style="
              line-height: 36px;
              height: 36px;
              overflow: hidden;
              width: 100%;
              white-space: nowrap;
              text-overflow: ellipsis;
            "
            >{{ (todo['林班名称'] || '') + (todo['区域名称'] ? '【' + todo['区域名称'] + '】' : '') + todo['病虫害名称'] }}</van-col
          >
        </van-row>
      </van-col>
    </van-row>
    <van-row v-if="todoList.length == 0 && !$store.state.isLoading" style="padding: 10px 20px">
      <van-col span="12" style="text-align: center">
        <p class="no-data-text">暂无待办记录...</p>
      </van-col>
    </van-row>
    <!-- <footbar> -->
      <!-- <van-col span="24">
        <van-button @click="addRecord()" style="width:100%;height:40px;" type="primary">新增汇报</van-button>
      </van-col> -->
      <!-- <van-col span="24">
        <van-button @click="$router.back()" style="width: 100%; height: 40px" type="info">返回</van-button>
      </van-col>
    </footbar> -->
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
    goDetailed(val) {
      this.$router.push({
        path: 'pest-query/detailed',
        query: val
      })
    },
    getTodoList() {
      this.$loadingState(true, '数据加载中')
      let params = {
        formid: '_',
        apvResult: '同意',
        module: '病虫害',
        task: '查询病虫_反馈查询',
        payload: {
          reportor: this.$store.state.appUser.userName || ''
        }
      }
      request
        .post(API.DISEASES_INFO, params)
        .then(res => {
          this.$loadingState(false)
          if (res.data.errorCode || res.data.errorCode === 0) {
            this.todoList = res.data.data.bill || []
          } else {
            this.todoList = []
          }
        })
        .catch(err => this.$loadingState(false))
    }
    // addRecord() {
    //   this.$router.push({
    //     name: '新增协管巡山工作'
    //   })
    // }
  },
  mounted() {
    this.getTodoList()
    this.$title(this.$route.name)
  }
}
</script>

<style></style>
