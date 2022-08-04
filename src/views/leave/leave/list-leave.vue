<template>
  <div style="padding:0 0 0 5px;max-height:calc(100vh - 120px);overflow:auto;">
    <div v-for="(leave,indx) in leaveList" :key="indx">
      <slide-item
        :disableSlider="true"
        path-name="请假申请查看"
        :paramId="leave.id"
        :isLast="indx==leaveList.length-1"
      >
        <div slot="content">
          <van-row>
            <van-col span="18" style="font-size:.36rem;color:#333;">
              <div class="content-title">{{leave.caption}}</div>
            </van-col>
            <van-col
              span="6"
              style="font-size:.36rem;color:#333;text-align:right;line-height:1.6rem;padding: 0 .1rem"
            >{{leave.createDate}}</van-col>
          </van-row>
        </div>
        <div slot="options">
          <van-row>
            <van-col span="12" class="opt-col-cancel" @click.native="cancel(leave)">取消</van-col>
            <van-col span="12" class="opt-col-change" @click.native="change(leave)">变更</van-col>
          </van-row>
        </div>
      </slide-item>
    </div>
    <div v-if="leaveList.length == 0 && !$store.state.isLoading">
      <p class="no-data-text">暂无申请记录...</p>
    </div>
  </div>
</template>

<script>
import SlideItem from '@/components/SlideItem'
import request from '@/utils/httpUtil'
import { API } from '@/api'
export default {
  data() {
    return {
      leaveList: []
    }
  },
  methods: {
    findList() {
      this.$loadingState(true, '数据加载中')
      request.post(API.DINGTALK_DUTY_FINDLEAVELISTDUTY).then(res => {
        this.$loadingState(false)
        if (res.data && res.data.errorCode) {
          this.leaveList = res.data.data || []
        }
      }).catch(err =>
        this.$loadingState(false)
      )
    },
    change(item) {
      this.$router.push({
        name: '请假申请修改',
        params: {
          id: item.id
        }
      })
    },
    cancel(item) {
      this.$router.push({
        name: '请假申请取消',
        params: {
          id: item.id
        }
      })
    }
  },
  components: {
    SlideItem
  },
  mounted() {
    this.$title(this.$route.name)
    this.findList()
  }
}
</script>

<style scoped>
.opt-col-cancel {
  background-color: #aba8a8;
}

.opt-col-change {
  background-color: #3dab3d;
}
.content-title {
  height: 100%;
  line-height: 1.6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
