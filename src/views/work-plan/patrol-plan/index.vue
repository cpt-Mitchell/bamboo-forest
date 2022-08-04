<template>
  <div class="patrol-plan-box">
    <div style="padding:0 10px;">
      <van-cell-group>
        <van-field
          class="no-disabled_bgcolor"
          v-model="planDate"
          @click.native="datePickerShow()"
          label="巡山月份"
          placeholder="点击选择日期"
          disabled
        />
        <van-field class="no-disabled_bgcolor" v-model="plan.lcName" label="林场名称" placeholder="自动带出" disabled />
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>片区名称</span>
          </div>
          <div class="van-cell__value" style="padding-left:0;">
            <div class="van-field__body">
              <select
                type="text"
                class="van-field__control"
                :disabled="areas.length == 0"
                v-model="plan.pqName"
                style="padding-left:0;"
                @change="getPlanInfo(plan.lcName, $event.target.value)"
              >
                <option :value="''" selected>请选择片区</option>
                <option v-for="(option, index) in areas" :key="index" :value="option.pqName">{{
                  option.pqName
                }}</option>
              </select>
            </div>
          </div>
        </div>
        <van-field class="no-disabled_bgcolor" v-model="plan.creater" label="制表人" placeholder="自动带出" disabled />
        <div class="card" v-if="details.length != 0">
          <div class="card-header">
            <van-row>
              <van-col span="24">
                <span style="font-size: 15px;color: #1db5e6">巡山计划表</span>
                <!-- <span style="font-size:12px;margin-left: 5px;">(注:表格可左右滑动查看)</span> -->
              </van-col>
            </van-row>
          </div>
        </div>
      </van-cell-group>
      <div class="card-part" style="overflow-x: auto;" v-if="details.length != 0">
        <div style="width: calc(100vw - 30px)">
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
              <tr v-for="(item, index) in details" :key="index">
                <td style="text-align:center">{{ item.lbName || '-' }}</td>
                <td style="text-align:center">
                  <select v-model="item.planTime" @change="changeDateHandle(item)">
                    <option :value="null">选择时间</option>
                    <option value="不计划巡山">不计划巡山</option>
                    <option :value="dateItem" v-for="dateItem in planDateOption" :key="dateItem">{{ dateItem }}</option>
                  </select>
                </td>
                <td style="text-align:center">
                  <select v-model="item.planPerson" :disabled="item.planTime === '不计划巡山'">
                    <option :value="null">选择巡山人</option>
                    <option
                      :value="personItem.planPerson"
                      v-for="personItem in planPersonList"
                      :key="personItem.planPerson"
                      >{{ personItem.planPerson }}</option
                    >
                  </select>
                </td>
                <td>{{ item.remark || '' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <date-picker
      :minDate="new Date()"
      :show="showDatePicker"
      type="year-month"
      @result="getDateResult"
      @close="datePickerClose"
    />
    <footbar>
      <van-col span="24">
        <van-button @click="doSubmit()" style="width:100%;height:40px;" type="primary">提交</van-button>
      </van-col>
    </footbar>
  </div>
</template>

<script>
import Footbar from '@/components/Footbar'
import DatePicker from '@/components/DatePicker'
import request from '@/utils/httpUtil'
import { API } from '@/api'
import { parseTime } from '@/utils/index'
export default {
  data() {
    return {
      areas: [],
      // parseTime(new Date(), '{y}-{m}')
      planDate: '',
      details: [],
      planPersonList: [],
      plan: {
        lcName: '',
        pqName: ''
      },
      showDatePicker: false
    }
  },
  watch: {
    planDate(val) {
      if (val) {
        const date = new Date(this.planDate)
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        this.plan.year = year
        this.plan.month = month
      }
    }
  },
  computed: {
    planDateOption() {
      let options = []
      if (this.planDate) {
        const date = new Date(this.planDate)
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        if (year === new Date().getFullYear() && month === new Date().getMonth() + 1) {
          let days = this.computedMonthDays(year, month)
          let today = new Date().getDate()
          for (let i = 1; i <= days - today; i++) {
            options.push(year + '-' + month + '-' + (today + i))
          }
        } else {
        }
      }
      return options
    }
  },
  methods: {
    computedMonthDays(year, month) {
      if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
        return 31
      } else if (month === 2) {
        if (year % 4 === 0) {
          return 29
        }
        return 28
      } else {
        return 30
      }
    },
    changeDateHandle(data) {
      if (data.planTime === '不计划巡山') {
        data.remark = '当月计划有民工作业，不需要安排巡山'
        data.planPerson = ''
      } else {
        data.remark = ''
      }
    },
    datePickerClose() {
      this.showDatePicker = false
    },
    datePickerShow(key) {
      this.showDatePicker = true
    },
    getDateResult(val) {
      this.showDatePicker = false
      this.planDate = parseTime(val, '{y}-{m}')
    },
    selectChangeHandle(taskName, e) {
      let result = this.getQueryObject(taskName, e.target.value)
      if (!result.params) return
      this.querySelector(result.params, result.arrKey)
    },
    getPlanPersonList() {
      let params = {
        lcName: this.plan.lcName
      }
      request.get(API.FOREST_PLAN_PERSONS, { params }).then(res => {
        if (res.data.errorCode === 1000) {
          this.planPersonList = res.data.data || []
        }
      })
    },
    getBackPlanInfo() {
      let params = {
        id: this.$route.query.id
      }
      this.$loadingState(true, '数据查询中')
      request
        .get(API.FOREST_PLAN_AUDIT_ONE, { params })
        .then(res => {
          this.$loadingState(false)
          if (res.data.errorCode === 1000) {
            this.plan = res.data.data
            this.planDate = parseTime(this.plan.createTime, '{y}-{m}')
            this.plan.creater = this.$store.state.appUser ? this.$store.state.appUser.userName : ''
            this.details = this.plan.detail
            this.getPlanPersonList()
            this.getPlanInfo(this.plan.lcName)
          }
        })
        .catch(err => this.$loadingState(false))
    },
    getPlanInfo(lc, pq, cb) {
      let params = {}
      if (lc) {
        params.lcName = lc
      }
      if (pq) {
        params.pqName = pq
      }
      this.$loadingState(true, '数据查询中')
      request
        .get(API.FOREST_PLAN_LC, { params })
        .then(res => {
          this.$loadingState(false)
          if (res.data.errorCode === 1000) {
            if (!cb) {
              if (lc && !pq) {
                this.areas = res.data.data || []
              } else if (pq && lc) {
                this.details = res.data.data.detail || []
              }
            } else {
              let data = res.data || {}
              this.plan = data.data
              this.plan.pqName = this.pqName || ''
              this.plan.creater = this.$store.state.appUser ? this.$store.state.appUser.userName : ''
              cb && cb(this.plan.lcName)
              this.getPlanPersonList()
            }
          } else {
            this.$dAlert(res.data.msg, () => {
              this.$router.push({
                name: '工作计划首页'
              })
            })
          }
        })
        .catch(err => {
          this.$loadingState(false)
        })
    },
    doSubmit() {
      if (!this.planDate) {
        this.$dAlert('请选择计划日期')
        return false
      }
      if (!this.plan.pqName) {
        this.$dAlert('请选择片区')
        return false
      }
      let flag = true
      let msgArr = []
      this.details.forEach((item, i) => {
        if (!item.planTime) {
          flag = false
          msgArr.push(`${item.lbName}计划巡山时间未选择`)
        }
        if (!item.planPerson && item.planTime !== '不计划巡山') {
          flag = false
          msgArr.push({
            type: `${item.lbName}计划巡山人未选择`,
            lb: item.lbName
          })
        }
      })
      if (!flag) {
        this.$dAlert(msgArr[0])
        return false
      }
      this.plan.detail = this.details
      this.$dConfirm('确定提交表单内容吗？', () => {
        this.$loadingState(true, '数据提交中')
        let params = this.plan
        request
          .post(API.FOREST_PLAN_SAVE, params)
          .then(res => {
            this.$loadingState(false)
            dAlert(res.data.msg, () => {
              if (res.data.errorCode === 1000) {
                this.$router.back()
              }
            })
          })
          .catch(err => this.$loadingState(false))
      })
    }
  },
  components: {
    Footbar,
    DatePicker
  },
  mounted() {
    if (this.$route.query.id) {
      this.getBackPlanInfo()
    } else {
      this.getPlanInfo(null, null, lc => {
        this.getPlanInfo(lc)
      })
    }
    this.$title(this.$route.name)
  }
}
</script>

<style scoped lang="less">
select {
  outline: none;
  border: none;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none; // 这个是去除下箭头的
  // color: #277de2;
  text-align: center;
}
.van-field .van-cell__title {
  max-width: 110px;
  input[type='number'] {
    font-size: 0.32rem;
  }
}
</style>
