<template>
  <div class="patrol-exception-app-box">
    <div class="mu-paper">
      <van-list>
        <template v-for="(item,index) in tableData">
          <van-row
            v-if="!item.hidden"
            :key="index"
            @click.native="$router.push({name:appPath,params:{id:item.fdId}})"
          >
            <van-col span="24">
              <p class="list-item-p van-hairline--bottom">
                <span style="display:block;">{{item.ranger+pathName}}</span>
                <span style="display:block;">林班名称：{{item.lbName}}</span>
              </p>
            </van-col>
          </van-row>
        </template>
      </van-list>
    </div>
    <div class="mu-paper">
      <van-list>
        <template v-for="(item,index) in tableDisasterData">
          <van-row
            v-if="!item.hidden"
            :key="index"
            @click.native="$router.push({name:'受灾情况核查录入',params:{id:item.fdId}})"
          >
            <van-col span="24">
              <p class="list-item-p van-hairline--bottom">
                <span style="display:block;">{{item.reporter+'受灾情况核查录入'}}</span>
                <span style="display:block;">林班名称：{{item.lbName}} 受灾日期：{{item.disasterDate}}</span>
              </p>
            </van-col>
          </van-row>
        </template>
      </van-list>
    </div>
    <div class="mu-paper">
      <van-list>
        <template v-for="(item1,index) in tableCheckDisasterData">
          <van-row
            v-if="!item1.hidden"
            :key="index"
            @click.native="$router.push({name:'核查任务安排表',params:{id:item1.fdId}})"
          >
            <van-col span="24">
              <p class="list-item-p van-hairline--bottom">
                <span style="display:block;">{{item1.reporter+'核查任务安排表'}}</span>
                <span style="display:block;">林班名称：{{item1.lbName}} 受灾日期：{{item1.disasterDate}}</span>
              </p>
            </van-col>
          </van-row>
        </template>
      </van-list>
    </div>
    <div class="mu-paper">
      <van-list>
        <template v-for="(item3,index) in tableCheckAuditDisasterData">
          <van-row
            v-if="!item3.hidden"
            :key="index"
            @click.native="$router.push({name:'受灾情况核查记录审核',params:{id:item3.fdId}})"
          >
            <van-col span="24">
              <p class="list-item-p van-hairline--bottom">
                <span style="display:block;">{{item3.reporter+'受灾情况核查记录审核'}}</span>
                <span style="display:block;">林班名称1：{{item3.lbName}} 受灾日期：{{item3.disasterDate}}</span>
              </p>
            </van-col>
          </van-row>
        </template>
        <van-row
          v-if="tableCheckAuditDisasterData.length === 0 && tableDisasterData.length === 0 && tableCheckDisasterData.length === 0  && !$store.state.isLoading"
        >
          <van-col span="24">
            <p class="no-data-text">暂无异常反馈记录...</p>
          </van-col>
        </van-row>
      </van-list>
    </div>
  </div>
</template>

<script>
import request from '@/utils/httpUtil'
import { API } from '@/api'
export default {
  data() {
    return {
      routes: [],
      pathName: '',
      pathName1: '',
      tableData: [],
      tableDisasterData: [],
      tableCheckDisasterData: [],
      tableCheckAuditDisasterData: [],
      lb: [],
      appPath: ''
    }
  },
  mounted() {
    this.initPage()

    this.$title(this.$router.name)
  },
  methods: {
    initPage() {
      this.findAuditList()
      this.findexception()
      this.findDisasterException()
      this.findCheckDisasterException()
      this.findCheckAuditDisasterException()
    },
    findAuditList() {
      let url = API.DINGTALK_FOREST_AUDITLIST
      this.$loadingState(true, '数据加载中')
      request.get(url).then(res => {
        console.log(res.data)
      })
    },

    findexception() {
      let url = API.DINGTALK_FORESTRY_EXCEPTION_FINDEXCEPTION
      this.$loadingState(true, '数据加载中')
      request
        .get(url)
        .then(res => {
          this.tableData = res.data.data || []
          this.$loadingState(false)
          if (this.tableData.length > 0) {
            if (this.tableData[0].status === 0) {
              let route = this.$route.matched
              this.$router.options.routes[0].children.forEach(r => {
                if (r.path === route[route.length - 1].parent.path) {
                  this.routes.push(r.children[1])
                  this.appPath = this.routes[0].name
                  this.pathName = '巡山发现问题汇报审核'
                }
              })
            }
            if (this.tableData[0].status === 1) {
              let route = this.$route.matched
              this.$router.options.routes[0].children.forEach(r => {
                if (r.path === route[route.length - 1].parent.path) {
                  this.routes.push(r.children[2])
                  this.appPath = this.routes[0].name
                  this.pathName = '巡山发现问题汇报审批'
                }
              })
            }
          }
        })
        .catch(err => (this.$loadingState(false)))
    },
    findDisasterException() {
      let url = API.DINGTALK_DISASTERREPORT_FINDEXCEPTION
      this.$loadingState(true, '数据加载中')
      request
        .get(url)
        .then(res => {
          this.tableCheckDisasterData = res.data.data || []
          this.$loadingState(false)
        })
        .catch(err => (this.$loadingState(false)))
    },
    findCheckDisasterException() {
      let url = API.DINGTALK_DISASTERREPORT_FINDCHECKEXCEPTION
      this.$loadingState(true, '数据加载中')
      request
        .get(url)
        .then(res => {
          this.tableDisasterData = res.data.data || []
          this.$loadingState(false)
        })
        .catch(err => (this.$loadingState(false)))
    },
    findCheckAuditDisasterException() {
      let url = API.DINGTALK_DISASTERREPORT_FINDCHECKEXCEPTIONAUDIT
      this.$loadingState(true, '数据加载中')
      request
        .get(url)
        .then(res => {
          this.tableCheckAuditDisasterData = res.data.data || []
          this.$loadingState(false)
        })
        .catch(err => (this.$loadingState(false)))
    }
  }
}
</script>

<style lang="less">
.patrol-exception-app-box {
  // background: #fff;
  // padding: 0.25rem 0;
  // width: 100%;
  // display: flex;
  // flex-wrap: wrap;
  // align-items: center;
  // padding: 15px;
  .list-item-p {
    // line-height: 46px;
    padding: 5px 20px;
    margin: 0;
    width: 100vw;
    box-sizing: border-box;
    span {
      line-height: 1.5;
      height: 24px;
      &:first-child {
        font-size: 0.38rem;
      }
      &:last-child {
        font-size: 0.32rem;
        color: #666;
      }
    }
  }
}
</style>
