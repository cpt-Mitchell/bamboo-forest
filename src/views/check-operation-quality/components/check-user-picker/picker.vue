<template>
  <div class="check-user-picker" style="height: 100%;">
    <van-row style="padding:5px 10px;margin:0 10px;">
      <van-col span="4" style="height:42px;line-height:42px;">查询：</van-col>
      <van-col span="20">
        <van-field v-model="searchText" placeholder="请输入姓名查询" />
      </van-col>
    </van-row>
    <van-row class="user-container card card-part">
      <van-col span="24">
        <div class="fixed-table-header">
          <table class="table">
            <colgroup>
              <col style="width:12%" />
              <col style="width:40%" />
              <col style="width:20%" />
              <col style="width:28%" />
            </colgroup>
            <thead>
              <tr>
                <th>选择</th>
                <th>机构名称</th>
                <th>姓名</th>
                <th>职务</th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="table-body">
          <table class="table">
            <colgroup>
              <col style="width:12%" />
              <col style="width:40%" />
              <col style="width:20%" />
              <col style="width:28%" />
            </colgroup>
            <tbody>
              <tr :key="index" v-for="(item, index) in copyList">
                <td>
                  <van-row class="select-control-row" :key="index">
                    <van-col class="item-radio" span="24" align="center">
                      <div class="select-control-row" :key="index">
                        <van-checkbox v-model="item.picked" @click.native="usersSelect(item)"></van-checkbox>
                      </div>
                    </van-col>
                  </van-row>
                </td>
                <td>{{ item.orgName }}</td>
                <td style="text-align:center;">{{ item.username }}</td>
                <td>
                  <span>{{ item.position }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </van-col>
    </van-row>
    <footbar>
      <van-row>
        <van-col span="12">
          <van-button @click="$emit('close')" style="width:100%;height:40px;" type="default">取消</van-button>
        </van-col>
        <van-col span="12">
          <van-button @click="doSubmit()" style="width:100%;height:40px;" type="primary"
            >提交(已选{{ selectedUsers.length }}人)</van-button
          >
        </van-col>
      </van-row>
    </footbar>
  </div>
</template>

<script>
import Footbar from '@/components/Footbar'
import { API } from '@/api'
import request from '@/utils/httpUtil'

export default {
  props: {
    limit: {
      type: Number,
      default: () => 0
    },
    lcId: {
      type: Number,
      required: true
    },
    selected: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      searchText: '',
      copyList: [],
      originList: '',
      selectedUsers: [],
      selectedUserIds: [],
      searchTimout: null
    }
  },
  watch: {
    searchText(val) {
      if (this.searchTimout) {
        clearTimeout(this.searchTimout)
      }
      this.searchTimout = setTimeout(() => {
        this.copyList = JSON.parse(this.originList || '[]').filter(item => {
          if (item.username.indexOf(val) !== -1) {
            if (this.selectedUserIds.indexOf(item.fdId) !== -1) {
              item.picked = true
            }
            return item
          }
        }, 500)
      })
    },
    selectedUsers(val) {
      this.selectedUserIds = val.map(item => item.fdId)
    }
  },
  methods: {
    usersSelect(user) {
      let flag = true,
        index = -1
      this.selectedUsers.forEach((it, i) => {
        if (user.fdId === it.fdId) {
          flag = false
          index = i
        }
      })
      user.picked = flag
      if (flag) {
        this.selectedUsers.push(user)
      } else if (index !== -1) {
        this.selectedUsers.splice(index, 1)
      }
    },
    findVerifiersList() {
      this.$loadingState(true, '数据加载中')
      request
        .get(API.DINGTALK_QUALITY_VERIFIERS + this.lcId)
        .then(res => {
          this.$loadingState(false)
          let errorCode = res.data.errorCode
          if (errorCode) {
            let data = res.data.data || []
            this.originList = JSON.stringify(data)
            this.copyList = data.map(item => {
              if (this.selectedUserIds.indexOf(item.fdId) !== -1) {
                item.picked = true
              }
              return item
            })
          } else {
            dAlert(res.data.msg)
          }
        })
        .catch(err => this.$loadingState(false))
    },
    doSubmit() {
      if (this.limit && this.limit !== 0 && this.selectedUsers.length < this.limit) {
        this.$dAlert(`请至少选择${this.limit}个人员`)
      }
      this.$emit('result', {
        users: this.selectedUsers,
        ids: this.selectedUserIds
      })
    }
  },
  components: {
    Footbar
  },
  mounted() {
    this.selectedUsers = this.selected || []
    this.findVerifiersList()
  }
}
</script>

<style lang="less" scoped>
.check-user-picker {
  position: relative;

  .user-container {
    position: relative;
    top: 15px;

    .fixed-table-header {
      position: fixed;
      top: 53px;
      width: calc(100% - 22px);

      table {
        border-left: 1px solid #ccc;
        border-right: 1px solid #ccc;
      }
    }
  }

  .table-body {
    height: calc(100vh - 38px - 110px);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    margin-top: 12px;
    border: 1px solid #ccc;
  }

  .table {
    text-align: center;
    border-collapse: collapse;
    width: 100%;
    font-size: 0.32rem;
    // border: 1px solid #ccc;

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

        &:focus {
          color: #8b8791;
        }
      }
    }

    th,
    td {
      // padding: 5px;
      line-height: 1.5;
      border-right: 1px solid #ccc;
      border-top: 1px solid #ccc;
      height: 36px;

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
