<template>
  <div class="position-picker" :class="{ 'box-loading': isLoading }">
    <vue-element-loading
      :active="isLoading"
      color="#0099ff"
      is-full-screen
      :text-style="{ fontSize: '.36rem' }"
      spinner="spinner"
      :text="loadingText"
    />
    <van-row class="picker-header">
      <van-col span="12" align="left">公司员工选择</van-col>
      <van-col span="12" align="right">
        <van-button style="min-width:30px;margin-right:10px;" type="default" size="small" @click="$emit('close')"
          >关闭</van-button
        >
        <van-button style="min-width:30px;" type="primary" size="small" @click="selectBackHandle">返回上级</van-button>
      </van-col>
    </van-row>
    <van-row class="picker-header">
      <van-col span="4">当前：</van-col>
      <van-col span="20">
        <current-select-nav
          :searchBelongCompany="searchBelongCompany"
          :data="navList"
          @navClick="navToShow"
        ></current-select-nav>
      </van-col>
    </van-row>
    <div class="picker-items">
      <van-row
        class="picker-item"
        :class="[index == 0 ? 'picker-item-first' : '']"
        v-for="(item, index) in showList.employeeList || []"
        :key="'p_' + index"
      >
        <van-col class="item-radio" span="2" align="center">
          <div class="select-control-row" :key="index">
            <van-checkbox :value="item.id" v-model="item.picked" @click.native="usersSelect(item)"></van-checkbox>
          </div>
          <!-- <div class="select-control-row" :key="index" v-else>
            <van-radio :value="item.id" v-model="item.picked" @change="usersSelect(item)"></van-radio>
          </div>-->
        </van-col>
        <van-col
          style="padding-left:15px;"
          span="22"
          class="item-name"
          :class="[
            index + 1 != showList.employeeList.length ? 'picker-item-bottom' : '',
            item.id == selectedId ? 'selected' : ''
          ]"
          >{{ item.name }}</van-col
        >
      </van-row>
      <van-row
        class="picker-item"
        :class="[index == 0 ? 'picker-item-first' : '']"
        v-for="(item, index) in showList.deptList || []"
        :key="'d_' + index"
      >
        <van-col
          style="padding-left:15px;"
          span="20"
          class="item-name"
          :class="[index + 1 != showList.deptList.length ? 'picker-item-bottom' : '']"
          >{{ item.descShort }}</van-col
        >
        <van-col
          span="4"
          class="item-operate"
          :class="[index + 1 != showList.deptList.length ? 'picker-item-bottom' : '']"
          @click.native="showNextDept(item)"
          >下级</van-col
        >
      </van-row>
    </div>
    <van-row class="picker-footer">
      <van-col span="16">
        <span style="display:block;width:100%;overflow:auto;white-space:nowrap;-webkit-overflow-scrolling: touch;"
          >已选择{{ selectedUsers.length }}个</span
        >
      </van-col>
      <van-col span="8" style="text-align:right;">
        <van-button type="primary" size="small" @click="submit">确定</van-button>
      </van-col>
    </van-row>
  </div>
</template>

<script>
import CurrentSelectNav from './current-select-nav'
import { API } from '@/api'
import request from '@/utils/httpUtil'
export default {
  props: {
    currentCompany: {
      type: String,
      default: function() {
        return ''
      }
    },
    multiple: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    searchBelongCompany: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    selected: {
      type: Array,
      defaultValue: []
    },
    // 只查询岗位工
    justWorker: {
      type: Boolean,
      default: function() {
        return false
      }
    }
  },
  data() {
    return {
      isLoading: false,
      selectedDeptId: '', // 无意义，主要用于muse-ui的radio组件的v-model，不写东西会出错
      loadingText: '加载中...',
      selectedId: '',
      listArr: [],
      showList: {},
      selectedUsers: [],
      selectedUserIds: [],
      navList: []
    }
  },
  watch: {
    listArr(val) {
      if (val.length > 0) {
        this.showList = val[val.length - 1]
      }
    },
    selectedUsers(val) {
      this.selectedUserIds = (val || []).map(item => item.id)
    }
  },
  methods: {
    submit() {
      this.$emit('submit', {
        departments: this.navList,
        users: this.selectedUsers,
        names: this.selectedUsers.map(item => item.name)
      })
      this.$emit('close')
    },
    // 选择人员
    usersSelect(item = {}) {
      let flag = false,
        index = -1
      this.selectedUsers.forEach((it, i) => {
        if (item.id !== it.id) {
          flag = true
          index = i
        }
      })
      if (this.multiple) {
        item.picked = flag
        if (flag) {
          this.selectedUsers.push(item)
        } else if (index !== -1) {
          this.selectedUsers.splice(index, 1)
        }
      } else {
        if (this.selectedUsers.length !== 0) {
          this.selectedUsers[0].picked = false
        }
        item.picked = true
        this.selectedUsers = [item]
        // if (flag) {

        // } else {
        //   item.picked = false
        //   this.selectedUsers = []
        // }
      }
    },
    // 返回上一层
    selectBackHandle() {
      if (this.listArr.length > 1) {
        this.navList.pop()
        this.listArr.pop()
      }
    },
    // 点导航部门跳转显示
    navToShow(index) {
      if (this.searchBelongCompany) {
        if (index === 0) {
          this.listArr.splice(1, this.listArr.length - 1)
          this.navList = [
            {
              descShort: this.currentCompany,
              fdId: 0
            }
          ]
        } else {
          this.listArr.splice(index + 1, this.listArr.length - 1)
          this.navList.splice(index + 1, this.navList.length - 1)
        }
      } else {
        if (index === -1) {
          this.listArr.splice(1, this.listArr.length - 1)
          this.navList = []
        } else {
          this.listArr.splice(index + 2, this.listArr.length - 1)
          this.navList.splice(index + 1, this.navList.length - 1)
        }
      }
    },
    // 选择部门下级
    showNextDept(item) {
      this.navList.push(item) // 当前点击部门存入导航集合
      this.isLoading = true
      this.showList = []
      let api = ''
      if (this.searchBelongCompany) {
        if (item.fdId) {
          // 判断fdId存不存在，当只查本公司的时候fdId为空
          api = `${API.DINGTALK_DEPARTMENT_EMPLOYEE}default/${item.fdId}/${item.deptId}`
        } else {
          api = `${API.DINGTALK_DEPARTMENT_EMPLOYEE}default`
        }
      } else {
        // 非查本公司人员时
        api = `${this.justWorker ? API.DINGTALK_DEPARTMENT_WORKER : API.DINGTALK_DEPARTMENT_EMPLOYEE}${item.fdId}/${
          item.deptId
        }`
      }
      request
        .get(api)
        .then(res => {
          let errCode = res.data.errorCode
          if (errCode) {
            let data = res.data.data || []
            data.employeeList = (data.employeeList || []).map(item => {
              if (this.selectedUserIds.indexOf(item.id) !== -1) {
                item.picked = true
              }
              return item
            })
            this.listArr.push(data)
            this.isLoading = false
          } else {
            dAlert(res.data.msg || '查询错误！')
          }
        })
        .catch(err => (this.isLoading = false))
    },
    // 查询公司列表
    getList() {
      this.isLoading = true
      request
        .get(API.DINGTALK_DEPARTMENT_POSITION)
        .then(res => {
          let errCode = res.data.errorCode
          if (errCode) {
            let data = res.data.data || []
            this.listArr.push(data)
            this.isLoading = false
          } else {
            dAlert(res.data.msg || '查询错误！')
          }
        })
        .catch(err => (this.isLoading = false))
    }
  },
  mounted() {
    this.listArr = []
    this.searchBelongCompany
      ? this.showNextDept({
        descShort: this.currentCompany,
        fdId: 0
      })
      : this.getList()
    this.selectedUserIds = (this.selected || []).map(item => item.id)
    this.selectedUsers = this.selected || []
  },
  components: {
    CurrentSelectNav
  }
}
</script>

<style lang="less" scoped>
@list-item-height: 42px;

.position-picker {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f0f2f5;
  z-index: 8888;
  .van-col {
    font-size: 0.36rem;
  }
  .btn-link {
    text-decoration: none;
    color: #2196f3;
  }
  .select-control-row {
    padding: 10px 0;
  }
  .picker-header {
    margin-top: 10px;
    background: #fff;
    font-size: 0.32rem;
    color: #666;
    text-align: left;
    line-height: 1.2rem;
    padding: 0 10px;
  }

  .picker-items {
    height: calc(100vh - 156px);
    overflow: auto;
    -webkit-overflow-scrolling: touch;

    .picker-item {
      background: #fff;
      color: #333;
      padding: 0 10px;

      .col {
        padding: 10px 0;
      }

      .item-radio {
        padding-left: 10px;
      }

      .item-name {
        padding-right: 20px;
        height: @list-item-height;
        line-height: @list-item-height;
      }

      .item-operate {
        color: #2196f3;
        padding-left: 10px;
        border-left: 1px solid #efefef;
        height: @list-item-height;
        line-height: @list-item-height;
      }

      &.selected {
        .item-name {
          color: #2196f3;
        }
      }

      &.picker-item-first {
        // margin-top: 10px;
        border-top: 1px solid #efefef;
      }

      .picker-item-bottom {
        border-bottom: 1px solid #efefef;
      }
    }
  }

  .picker-footer {
    border-top: 1px solid #efefef;
    position: fixed;
    bottom: 0px;
    left: 0px;
    right: 0px;
    height: 46px;
    background: #fff;
    line-height: 46px;
    padding: 0 20px;
  }
}
</style>
