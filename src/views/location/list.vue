<template>
  <div>
    <div ref="container">
      <van-pull-refresh v-model="$store.state.isLoading" @refresh="onRefresh">
        <div class="cantain">
          <template v-for="(item, index) in todoList">
            <div>
              <van-row>
                <van-col span="24">
                  <div
                    @click="$router.push('/location/details?id=' + item['ID'])"
                    style="font-size:.34rem;color:#666;height: 40px;line-height: 40px;padding: 0 15px;"
                  >
                    {{ item['StatusName'] }} - {{ item['LocationName'] }}考勤点
                  </div>
                </van-col>
              </van-row>
            </div>
          </template>
          <div
            v-if="todoList.length === 0 && !$store.state.isLoading"
            style="display: flex;justify-content: center;padding: 1rem 15px;height:calc(100vh - 200px);"
          >
            <span style="text-align: center;">暂无记录...</span>
          </div>
        </div>
      </van-pull-refresh>
    </div>

    <div
      v-if="!$store.state.isLoading"
      style="position:fixed;bottom:20px;padding: 0 15px;font-size: 14px;margin-top: 40px;color: red;"
    >
      提示：每个考勤点请定点提交三次，每个定点之间直线距离50米以上，100米以内。本界面任务消失即为定点成功。
    </div>
  </div>
</template>

<script>
import request from '@/utils/httpUtil'
import { API } from '@/api'
export default {
  data() {
    return {
      todoList: [],
      refreshing: false,
      loading: false,
      loadedAll: true
    }
  },
  computed: {},
  mounted: function() {
    this.refreshing = true
    this.$title(this.$route.name)
    this.initApp()
  },
  methods: {
    initApp() {
      this.$loadingState(true, '数据加载中')
      request
        .post(API.DINGTALK_OA_COMMON_GETINITAPV, {
          formid: '_',
          apvResult: '同意',
          module: '竹林考勤定点',
          task: '查询列表',
          payload: {
            keyword: ''
          }
        })
        .then(res => {
          this.$loadingState(false)
          if (res.data.errorCode === 0) {
            let data = res.data || {}
            if (data && data.errorCode === 0) {
              console.log(data.data)
              this.todoList = data.data.data || []
              this.$toast('刷新成功')
            }
          }
        })
        .catch(err => this.$loadingState(false))
    },
    onRefresh() {
      this.initApp()
    }
  }
}
</script>

<style lang="less">
body,
html {
  margin: 0;
  padding: 0;
}

.center {
  height: 100%;
  background-color: white;
  /*overflow: hidden;*/
}

.cantain {
  background-color: white;
}

.container {
  height: 100%;
  /*overflow: scroll;*/
  /*-webkit-overflow-scrolling: touch;*/
  padding-top: 3px;
  padding-left: 3px;
  padding-right: 3px;
}

.frequse {
  background-color: white;
}

.row-list {
  padding: 5px;
}

.list-icon {
  width: 45px;
  height: 45px;
  border-radius: 15px;
}

.list-icon i {
  padding-left: 3px;
}
</style>
