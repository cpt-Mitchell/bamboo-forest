<template>
  <div class="check-user-picker">
    <van-row style="padding:0 10px;margin:0 10px;box-sizing: border-box;">
      <van-col span="24" style="height:42px;line-height:42px;">{{title}}小区域明细</van-col>
    </van-row>
    <van-row class="user-container card card-part" style="margin-top:0;padding-top:0">
      <van-col span="24">
        <div class="table-body">
          <table class="table">
            <colgroup>
              <col style="width:35%">
              <col
                v-for="(col, index) in headerCols"
                :key="index"
                :style="{width:(65/headerCols.length) + '%'}"
              >
            </colgroup>
            <thead>
              <tr>
                <th>项目名称</th>
                <th v-for="(colNo,index) in headerCols" :key="index">{{colNo}}</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item,index) in dataList">
                <tr v-if="index !== 0" :key="index">
                  <td>{{item.fieldDesc}}</td>
                  <td v-for="(it,idx) in headerCols" :key="idx">
                    <input
                      style="text-align:center"
                      type="text"
                      :disabled="item.gray"
                      @change="inputChangeHandle($event,item.fieldName,'val'+idx,item.gray)"
                      v-model="form[item.fieldName]['val'+idx]"
                    >
                    <!-- <van-text-field style="width:40px;" @change="(val) => inputChangeHandle(item.fieldName,'val'+idx,val)"></van-text-field> -->
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </van-col>
    </van-row>
    <footbar>
      <van-row>
        <van-col span="12">
          <van-button style="width:100%;height:40px;" type="default" @click="close()">取消</van-button>
        </van-col>
        <van-col span="12">
          <van-button style="width:100%;height:40px;" type="primary" @click="doSubmit()">保存</van-button>
        </van-col>
      </van-row>
    </footbar>
  </div>
</template>

<script>
import Footbar from '@/components/Footbar'
import request from '@/utils/httpUtil'
import { API } from '@/api'

export default {
  props: {
    title: {
      type: String,
      default: () => ''
    },
    dataObj: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dataList: [],
      headerCols: []
    }
  },
  computed: {
    form() {
      let form = {}
      this.dataList.forEach(item => {
        let arr = (item.readData || '').split(',')
        arr.forEach((a, i) => {
          form[item.fieldName] = form[item.fieldName] || {}
          form[item.fieldName]['val' + i] = a
          form[item.fieldName].gray = item.gray
        })
      })
      return form
    }
  },
  methods: {
    inputChangeHandle(e, ...arr) {
      let value = e.target.value
      if (!isNaN(value)) {
        this.form[arr[0]][arr[1]] = value
        // this.form[arr[0]].gray = arr[2]
      } else {
        dAlert('请输入数字！')
        e.target.value = e.target._value
      }
    },
    close() {
      this.$emit('closeDialog')
    },
    calc(cb) {
      this.$loadingState(true, '正在计算')
      request.post(API.DINGTALK_QUALITY_VERIFY_PEDDING_TABLE_CALCULATE + 'calc', this.dataObj).then(res => {
        this.$loadingState(false)
        if (res.data.errorCode) {
          cb && cb(res.data.data)
        }
      }).catch(err => this.$loadingState(false))
    },
    doSubmit() {
      let that = this
      let keys = [], flag = true
      for (let key in that.form) {
        if (key !== 's_small_area' && that.form[key].gray === false) {
          keys.push(key)
        }
      }
      let values = [], singleValues = [], valuesLength = -1
      for (let i = 0; i < keys.length; i++) {
        // keys.forEach((item, i) => {
        let item = keys[i]
        for (let k in that.form[item]) {
          if (that.form[item][k]) {
            singleValues.push(that.form[item][k])
          }
        }

        if (valuesLength === 0) {
          dAlert('填写不完整')
          flag = false
          return null
        } else if (valuesLength === -1) {
          valuesLength = singleValues.length
        } else if (valuesLength !== singleValues.length) {
          dAlert('填写不完整')
          flag = false
          return null
        }
        values.push(singleValues)
        singleValues = []
        // })
      }
      if (!flag) {
        return
      }
      keys.forEach((item, i) => {
        this.dataObj.smallCheckTablesDtos.forEach(it => {
          if (it.fieldName === item) {
            it.readData = values[i].join(',')
          }
        })
      })
      that.calc((data) => {
        this.$emit('result', data)
      })
    }
  },
  components: {
    Footbar
  },
  mounted() {
    this.dataList = [].concat(this.dataObj.smallCheckTablesDtos || [])
    this.headerCols = this.dataList.length > 0 ? (this.dataList[0].readData || '').split(',') : []
  }
}
</script>

<style lang="less" scoped>
.check-user-picker {
  position: relative;

  .user-container {
    position: relative;
    // top: -25px;
  }

  .table-body {
    height: calc(100vh - 100px);
    overflow-y: auto;
    // -webkit-overflow-scrolling: touch;
    // margin-top: 12px;
    // border: 1px solid #ccc;
  }

  .table {
    text-align: center;
    border-collapse: collapse;
    width: 100%;
    font-size: 0.32rem;
    border: 1px solid #ccc;

    thead {
      color: #fff;
      background: #409eff;
    }

    td {
      padding-left: 2px;
      padding-right: 2px;
      line-height: 0.46rem;
      word-break: break-all;

      input {
        width: 100%;
        padding: 5px;
        border: 1px solid #a3a3a3;
        outline: none;
        background: transparent;
        line-height: 26px;
        box-shadow: none;
        border-radius: 3px;
        height: 28px;
        box-sizing: border-box;
        &:focus {
          color: #8b8791;
        }
      }
    }

    th,
    td {
      padding: 5px;
      border-right: 1px solid #ccc;
      border-top: 1px solid #ccc;
      height: 28px;

      &:last-child {
        border-right: none;
      }
    }

    tbody > tr:last-child {
      border-bottom: 1px solid #ccc;
    }
  }
}
</style>
