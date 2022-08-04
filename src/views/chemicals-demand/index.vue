<template>
  <div class="chemical-form">
    <div style="height: calc(100vh - 100px);">
      <van-cell-group>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>采购单位</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select class="van-field__control" v-model="form.corporation">
                <option value selected>请选择采购单位</option>
                <option v-for="(option, index) in ['林场场部', '片区']" :key="index" :value="option">{{
                  option
                }}</option>
              </select>
            </div>
          </div>
        </div>
        <van-field
          class="no-disabled_bgcolor"
          v-model="form.date"
          @click.native="datePickerShow('date')"
          label="计划开工日期"
          placeholder="点击选择日期"
          disabled
        />
      </van-cell-group>

      <div class="card-part" style="overflow-x: auto;">
        <div style="width: calc(100vw - 30px);margin:0 auto 50px;">
          <table class="table">
            <colgroup>
              <col />
              <col width="110px" />
              <col width="50px" />
              <col width="75px" />
            </colgroup>
            <thead>
              <tr>
                <th style="text-align:center">药品名称</th>
                <th>规格型号</th>
                <th>单位</th>
                <th>数量</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in chemicalsList" :key="index">
                <td style="text-align:center">{{ item.LeechdomName || '-' }}</td>
                <td style="text-align:center">
                  {{ item.Spec }}
                </td>
                <td style="text-align:center">
                  {{ item.Unit }}
                </td>
                <td style="padding:0">
                  <van-field v-model="item.Qty" type="number" label="" placeholder="请输入数量" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <date-picker :show="showDatePicker" type="date" @result="getDateResult" @close="datePickerClose" />
    <footbar>
      <van-col span="24">
        <van-button @click="doSubmit()" style="width:100%;height:40px;" type="primary">提交</van-button>
      </van-col>
    </footbar>
  </div>
</template>
<script>
import request from '@/utils/httpUtil'
import DatePicker from '@/components/DatePicker'
import Footbar from '@/components/Footbar'
import { parseTime } from '@/utils/index'
import { API } from '@/api'
export default {
  data() {
    return {
      showDatePicker: false,
      chemicalsList: [],
      form: {
        corporation: '',
        date: parseTime(new Date(), '{y}-{m}-{d}')
      }
    }
  },
  components: {
    Footbar,
    DatePicker
  },
  methods: {
    datePickerClose() {
      this.showDatePicker = false
      this.currPickerKey = ''
    },
    datePickerShow(key) {
      this.showDatePicker = true
      this.currPickerKey = key
    },
    getDateResult(val) {
      this.showDatePicker = false
      this.form.date = parseTime(val, '{y}-{m}-{d}')
    },
    getChemicalsList() {
      let params = {
        formid: '_',
        apvResult: '-',
        module: '竹林药品下拉列表',
        task: '竹林药品下拉列表',
        payload: {}
      }
      this.$loadingState(true, '正在查询')
      request
        .post(API.APP_COMMON_TRANSACTION_SUBMIT, params)
        .then(res => {
          this.$loadingState(false)
          let data = res.data || {}
          if (data.errorCode !== 0) {
            this.$dAlert(data.msg || '')
            return false
          }
          let result = data.data.data
          this.chemicalsList = result
        })
        .catch(err => this.$loadingState(false))
    },
    doSubmit() {
      if (!this.form.corporation) {
        this.$dAlert('请选择采购单位')
        return false
      }
      if (!this.form.corporation) {
        this.$dAlert('请选择采购完成期限')
        return false
      }
      let arr = []
      this.chemicalsList.forEach(item => {
        if (item.Qty && parseInt(item.Qty)) {
          arr.push(item)
        }
      })
      if (arr.length === 0) {
        this.$dAlert('至少填写一项药品的数量')
        return false
      }
      let funcs = arr.map(item => {
        return new Promise((resolve, reject) => {
          let params = {
            formid: '_',
            apvResult: '-',
            module: '竹林药品需求录入',
            task: '竹林药品需求录入',
            payload: {
              PurchaseUnit: this.form.corporation, // 单位
              PurchaseTerm: this.form.date, // 采购完成期限
              LeechdomName: item.LeechdomName, // 药品名称
              Spec: item.Spec,
              Unit: item.Unit,
              Qty: parseInt(item.Qty)
            }
          }
          request
            .post(API.APP_COMMON_TRANSACTION_SUBMIT, params)
            .then(res => {
              this.$loadingState(false)
              let data = res.data || {}
              resolve({ success: data.errorCode === 0, msg: data.msg, name: item.LeechdomName })
            })
            .catch(err => {})
        })
      })
      this.$loadingState(true, '正在提交')
      Promise.all(funcs)
        .then(result => {
          this.$loadingState(false)
          let msg = []
          result.forEach(item => {
            if (!item.success) {
              msg.push(item.name + '保存失败,' + item.msg)
            }
          })
          dAlert(
            msg.length === 0
              ? '提交成功'
              : msg.join(`,
          `),
            () => {
              if (msg.length === 0) {
                this.$router.back()
              }
            }
          )
        })
        .catch(error => {
          this.$loadingState(false)
          console.log(error)
        })
    }
  },
  created() {
    this.getChemicalsList()
  }
}
</script>
<style lang="less">
.chemical-form {
  .van-field .van-cell__title,
  .van-cell__title.van-field__label {
    width: 110px;
  }
  .table td {
    input {
      border: none;
      text-align: center;
    }
    .van-cell__value {
      padding-left: 0;
    }
    .van-cell {
      height: 30px;
    }
  }
}
</style>
