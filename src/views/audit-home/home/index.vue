<template>
  <div ref="container">
    <van-pull-refresh v-model="$store.state.isLoading" @refresh="onRefresh">
      <div class="cantain">
        <template v-for="(item, index) in todoList">
          <div :key="index">
            <list-item :item="item" :path-name="routerPath(item)">
              <van-row slot="summary">
                <van-col span="12">
                  <span style="font-size: 0.34rem; color: #666">{{ item.node }}人：{{ item.disposer }}</span>
                </van-col>
                <van-col span="11" align="right">
                  <span style="font-size: 0.34rem; color: #666">当前节点：{{ item.node }}</span>
                </van-col>
              </van-row>
            </list-item>
          </div>
        </template>
        <template v-for="(item, index) in weedingList">
          <div :key="index" @click="goReview(item)">
            <list-item :item="item">
              <van-row slot="summary">
                <van-col span="12">
                  <span style="font-size: 0.34rem; color: #666">录入人：{{ item['录入人'] }}</span>
                </van-col>
                <van-col span="11" align="right">
                  <span style="font-size: 0.34rem; color: #666">作业方式：{{ item['作业方式'] }}</span>
                </van-col>
              </van-row>
            </list-item>
          </div>
        </template>
        <template v-for="(item, index) in planTodoList">
          <div :key="index">
            <list-item :item="item" path-name="巡山计划审批">
              <van-row slot="summary">
                <van-col span="12">
                  <span style="font-size: 0.34rem; color: #666">申请人：{{ item.creater }}</span>
                </van-col>
                <van-col span="11" align="right">
                  <span style="font-size: 0.34rem; color: #666">当前节点：审批</span>
                </van-col>
              </van-row>
            </list-item>
          </div>
        </template>
        <div
          v-if="
            todoList.length === 0 && planTodoList.length === 0 && weedingList.length === 0 && !$store.state.isLoading
          "
          style="display: flex; justify-content: center; padding: 1rem 0; height: calc(100vh - 76px)"
        >
          <span>暂无审核审批记录...</span>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import request from '@/utils/httpUtil'
import ListItem from './list-item'
import { API } from '@/api'
export default {
  data() {
    return {
      todoList: [],
      planTodoList: [],
      weedingList: [],
      refreshing: false,
      loading: false,
      loadedAll: true,
      positionName: ''
    }
  },
  computed: {},
  mounted: function () {
    this.refreshing = true
    this.getPersonalInfo()
    this.$title(this.$route.name)
  },
  components: {
    ListItem
  },
  methods: {
    goReview(item) {
      this.$router.push({
        name: '除草核价记录审核',
        query: item
      })
    },
    getPersonalInfo() {
      request.get(API.DINGTALK_PERSONAL_INFO + `/${this.$store.state.appUser.id}`).then(res => {
        let data = res.data || {}
        this.positionName = data.data.positionName || ''
        this.initApp()
      })
    },
    routerPath({ tableName = '', node = '' }) {
      let type = tableName
      if (
        [
          '休班',
          '请假',
          '巡山异常报到',
          '上下班异常报到',
          '夜间工作时间明细',
          '协管记录',
          '林地工作计划',
          '林班工作时间明细'
        ].indexOf(type) !== -1
      ) {
        return '申请审批'
      } else if ((type === 'log_patrolProblem' || type === '巡山异常') && node === '审核') {
        return '护林员巡山发现问题汇报审核'
      } else if ((type === 'log_patrolProblem' || type === '巡山异常') && node === '审批') {
        return '护林员巡山发现问题审批'
      } else if (type === '受灾情况核查录入') {
        return '受灾情况核查录入'
      } else if (type === '核查任务安排') {
        return '核查任务安排'
      } else if (type === '受灾情况核查记录审核') {
        return '受灾情况核查记录审核'
      }
    },
    initApp() {
      request.get(API.FOREST_PLAN_AUDIT_LIST).then(res => {
        if (res.data.errorCode === 1000) {
          this.planTodoList = []
          ;(res.data.data || []).forEach(item => {
            item.rowID = item.id
            item.title = `${item.lcName}${item.pqName}${item.year}年${item.month}月巡山计划申请`
            this.planTodoList.push(item)
          })
        }
      })
      console.log(this.positionName)
      if (this.positionName === '劳务专员' || this.positionName === '劳务经理') {
        let params = {
          formid: '_',
          apvResult: '同意',
          module: '劳务审核查询列表',
          task: '劳务审核查询列表',
          payload: {}
        }
        request
          .post(API.DISEASES_INFO, params)
          .then(res => {
            if (res.data.errorCode === 0) {
              this.weedingList = res.data.data.data || []
            } else {
              this.$toast(res.data.msg || '获取除草核价审批列表失败')
            }
          })
          .catch(err => this.$loadingState(false))
      }
      this.$loadingState(true, '数据加载中')
      request
        .get(API.DINGTALK_FOREST_AUDITLIST, {})
        .then(res => {
          this.$loadingState(false)
          let data = res.data
          if (data.errorCode) {
            this.todoList = data.data || []
            this.$toast('刷新成功')
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
