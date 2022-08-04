<template>
  <div class="check-user-picker">
    <!-- <van-row style="padding:0 10px;margin:0 10px;box-sizing: border-box;">
      <van-col span="24" style="height:42px;line-height:42px;">{{ title }}小区域明细</van-col>
    </van-row> -->
    <van-row class="user-container card card-part" style="padding:0;margin:0;">
      <van-col span="24">
        <div class="table-body">
          <table class="table" style="border:none;">
            <colgroup>
              <col style="width:10%" />
              <col style="width:30%" />
              <col style="width:20%" />
              <col style="width:20%" />
              <col style="width:15%" />
            </colgroup>
            <thead>
              <tr>
                <th>操作</th>
                <th>区域</th>
                <th>种植年度</th>
                <th>萌芽年度</th>
                <th>已追肥(次)</th>
              </tr>
            </thead>
          </table>
          <div style="max-height: calc(100% - 52px);overflow: auto;">
            <table class="table" style="border:none;">
              <colgroup>
                <col style="width:10%" />
                <col style="width:30%" />
                <col style="width:20%" />
                <col style="width:20%" />
                <col style="width:15%" />
              </colgroup>
              <tbody>
                <template v-for="(item, index) in list">
                  <tr>
                    <td style="padding: 0 10px;">
                      <van-checkbox shape="square" icon-size="20px" v-model="item.checked"></van-checkbox>
                    </td>
                    <td>{{ item['区域编号'] }}</td>
                    <td>{{ item['种植年度'] }}</td>
                    <td>{{ item['萌芽年度'] }}</td>
                    <td>{{ item['已追肥'] }}</td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </van-col>
    </van-row>
    <footbar>
      <van-row>
        <van-col span="12">
          <van-button style="width:100%;height:40px;" type="default" @click="close()">取消选择</van-button>
        </van-col>
        <van-col span="12">
          <van-button style="width:100%;height:40px;" type="primary" @click="doSubmit()">选择完成</van-button>
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
    dataList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      list: []
    }
  },
  methods: {
    inputChangeHandle(e, ...arr) {
      let value = e.target.value
      if (!isNaN(value)) {
        this.form[arr[0]][arr[1]] = value
      } else {
        dAlert('请输入数字！')
        e.target.value = e.target._value
      }
    },
    close() {
      this.$emit('closeDialog')
    },
    doSubmit() {
      let selected = this.list.filter(item => item.checked)
      this.$emit('result', selected)
    }
  },
  components: {
    Footbar
  },
  mounted() {
    this.list = this.dataList
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
    height: calc(100vh - 40px);
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
