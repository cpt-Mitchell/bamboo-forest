<template>
  <div style="height: 100%">
    <van-row style="padding: 5px 15px 0" v-for="(todo, index) in todoList" :key="index">
      <van-col span="20" @click.native="goDetailed(todo)">
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
            >{{ (todo.lbName || '') + (todo.region ? '【' + todo.region + '】' : '') + todo.typeName }}</van-col
          >
        </van-row>
      </van-col>
      <van-col span="4">
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
          >
            <van-button style="float: right" type="danger" size="mini" @click="deleteInfo(todo)">删除</van-button>
          </van-col>
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
// import request from '@/utils/httpUtil'
// import { API } from '@/api'
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
    deleteInfo(val) {
      console.log(val)
      // let that = this
      var back = window.indexedDB.open('noReport')
      back.onerror = function (event) {
        console.log('数据库打开报错')
      }
      back.onsuccess = function (event) {
        console.log('数据库打开成功')
        var db = event.target.result
        if (db.objectStoreNames.length !== 0) {
          const id = Number(val.deleteId)
          console.log(val.deleteId)
          const backInfo = db.transaction(['noReport'], 'readwrite').objectStore('noReport').delete(id)
          backInfo.onsuccess = function () {
            console.log('删除暂存数据成功')
            setTimeout(window.location.reload(), 100)
          }
          backInfo.onerror = function (err) {
            console.error(err)
          }
        }
      }
    },
    goDetailed(val) {
      this.$router.push({
        path: 'pest-staged/detailed',
        query: val
      })
    },
    getTodoList() {
      this.readAll()
      setTimeout(() => {
        if (this.todoList.length > 0) {
          this.todoList.forEach((item, index) => {
            item.id = index + 1
          })
        }
        console.log(this.todoList)
      }, 100)
    },
    readAll() {
      let that = this
      var request = window.indexedDB.open('noReport')
      request.onerror = function (event) {
        console.log('数据库打开报错')
      }
      request.onsuccess = function (event) {
        console.log('数据库打开成功')
        var db = event.target.result
        if (db.objectStoreNames.length !== 0) {
          var objectStore = db.transaction(['noReport'], 'readwrite').objectStore('noReport').getAll()
          objectStore.onsuccess = function (e) {
            var cursor = e.target.result
            that.todoList = cursor
            // if (cursor) {
            //   let newArr = {}
            //   newArr = cursor.value || {}
            //   newArr.id = cursor.key
            //   cursor.continue()
            // } else {
            //   console.log('没有更多数据了！')
            // }
          }
        } else {
          setTimeout(function () {
            db.close()
            indexedDB.deleteDatabase('noReport')
          }, 500)
        }
      }
    }
  },
  mounted() {
    this.getTodoList()
    this.$title(this.$route.name)
  }
}
</script>

<style></style>
