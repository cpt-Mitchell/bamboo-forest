<template>
  <div ref="container">
    <van-pull-refresh v-model="$store.state.isLoading" @refresh="onRefresh">
      <div class="cantain">
        <template v-for="(item, index) in planTodoList">
          <div :key="index">
            <list-item :item="item">
              <van-row slot="summary">
                <van-col span="8">
                  <span style="font-size:.34rem;color:#666;">申请人：{{ item.creater }}</span>
                </van-col>
                <van-col span="8">
                  <span style="font-size:.34rem;color:#666;">时间：{{ (item.createTime || '').substring(0, 10) }}</span>
                </van-col>
                <van-col span="8" align="right">
                  <span style="font-size:.34rem;color:#666;">状态：{{ item.status }}</span>
                </van-col>
              </van-row>
            </list-item>
          </div>
        </template>
        <div
          v-if="planTodoList.length === 0 && !$store.state.isLoading"
          style="display:flex;justify-content:center;padding:1rem 0;height:calc(100vh - 76px);"
        >
          <span>暂无巡山计划...</span>
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
      planTodoList: [],
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
  components: {
    ListItem
  },
  methods: {
    initApp() {
      this.$loadingState(true, '数据查询中')
      request
        .get(API.FOREST_PLAN_AUDIT_PASS)
        .then(res => {
          this.$loadingState(false)
          if (res.data.errorCode === 1000) {
            this.planTodoList = []
            ;(res.data.data || []).forEach(item => {
              item.rowID = item.id
              item.title = `${item.lcName}${item.pqName}${item.year}年${item.month}月巡山计划申请`
              this.planTodoList.push(item)
            })
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
