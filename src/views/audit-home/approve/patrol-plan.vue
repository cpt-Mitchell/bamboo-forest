<template>
  <div :style="`height:calc(100vh - ${$route.name !== '巡山计划查看' ? 90 : 60}px);overflow: auto;`">
    <van-cell-group>
      <van-field class="no-disabled_bgcolor" v-model="plan.planDate" label="巡山月份" disabled />
      <van-field class="no-disabled_bgcolor" v-model="plan.lcName" label="林场名称" disabled />
      <van-field class="no-disabled_bgcolor" v-model="plan.pqName" label="林场名称" disabled />
      <van-field class="no-disabled_bgcolor" v-model="plan.creater" label="制表人" disabled />
    </van-cell-group>
    <div class="card">
      <div class="card-header">
        <van-row>
          <van-col span="24">
            <span style="font-size: 15px;color: #1db5e6">巡山计划表</span>
            <!-- <span style="font-size:12px;margin-left: 5px;">(注:表格可左右滑动查看)</span> -->
          </van-col>
        </van-row>
      </div>
    </div>
    <div class="card-part" style="overflow-x: auto;">
      <div style="width: calc(100vw - 30px);margin:0 auto;">
        <table class="table">
          <colgroup>
            <col width="80px" />
            <col width="100px" />
            <col width="90px" />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th style="text-align:center">林班</th>
              <th>计划巡山时间</th>
              <th>计划巡山人</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in plan.detail" :key="index">
              <td style="text-align:center">{{ item.lbName || '-' }}</td>
              <td style="text-align:center">
                {{ item.planTime }}
              </td>
              <td style="text-align:center">
                {{ item.planPerson }}
              </td>
              <td>{{ item.remark || '' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <footbar v-if="$route.name !== '巡山计划查看'">
      <van-col span="12">
        <van-button @click="submit('退回')" style="width:100%;height:40px;" type="warning">退回</van-button>
      </van-col>
      <van-col span="12">
        <van-button @click="submit('通过')" style="width:100%;height:40px;" type="primary">通过</van-button>
      </van-col>
    </footbar>
  </div>
</template>

<script>
import Footbar from '@/components/Footbar'
import request from '@/utils/httpUtil'
import { API } from '@/api'

export default {
  name: 'approve',
  data() {
    return {
      plan: {}
    }
  },
  mounted() {
    this.getDetail()
    this.$title('巡山计划申请')
  },
  methods: {
    getDetail() {
      let params = {
        id: this.$route.params.id
      }
      this.$loadingState(true, '数据查询中')
      request
        .get(API.FOREST_PLAN_AUDIT_ONE, { params })
        .then(res => {
          this.$loadingState(false)
          if (res.data.errorCode === 1000) {
            this.plan = res.data.data
            this.plan.planDate = `${this.plan.year}年${this.plan.month}月`
          }
        })
        .catch(err => this.$loadingState(false))
    },
    submit(apvResult) {
      let msg = `确定提交【${apvResult}】吗？`
      this.$dConfirm(msg || '确认提交吗？', data => {
        let params = {
          id: this.$route.params.id,
          status: apvResult
        }
        this.$loadingState(true, '数据提交中')
        request
          .get(API.FOREST_PLAN_AUDIT, { params })
          .then(resp => {
            this.$loadingState(false)
            let errCode = resp.data.errorCode
            this.$dAlert(resp.data.msg, () => {
              if (errCode === 1000) {
                this.$router.push({
                  name: '审核审批首页'
                })
              }
            })
          })
          .catch(errr => this.$loadingState(false))
      })
    }
  },
  components: {
    Footbar
  }
}
</script>

<style scoped></style>
