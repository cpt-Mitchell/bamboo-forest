<template>
  <div style="height: 100%">
    <div class="card-part">
      <van-cell-group>
        <van-field class="no-disabled_bgcolor" v-model="tableData.ranger" label="护林员" disabled/>
        <van-field class="no-disabled_bgcolor" v-model="tableData.lbName" label="林班名称" disabled/>
        <van-field
          class="no-disabled_bgcolor"
          v-model="tableData.patrolDate"
          label="巡山日期"
          disabled
        />
        <van-field
          class="no-disabled_bgcolor"
          v-model="tableData.problemType"
          label="问题类型"
          disabled
        />
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>涉及数量</span>
          </div>
          <div class="van-cell__value">
            <div
              class="van-field__body"
              style="color:#333"
            >{{tableData.involveAccount}}{{tableData.unit}}</div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>发现问题照片</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <van-button v-if="files.length>0" type="info" size="small" @click="watchFile">点击查看</van-button>
              <label style="font-size:.36rem;color:#333;" v-else>暂无问题照片</label>
            </div>
          </div>
        </div>

        <van-field
          class="no-disabled_bgcolor"
          v-model="tableData.problemDesc"
          label="问题描述"
          disabled
        />
        <van-field class="no-disabled_bgcolor" v-model="tableData.auditer2" label="下一审核人" disabled/>
        <!-- <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>下一审核人</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <p style="color:#f37011;margin:0;">
                <span style="font-size:.32rem">{{tableData.auditer2}}</span>
              </p>
            </div>
          </div>
        </div>-->
        <van-field
          v-model="form.remark1"
          label="审核意见"
          type="textarea"
          rows="1"
          autosize
          placeholder="请输入审批意见"
        />
        <van-field class="no-disabled_bgcolor" label disabled style="height:80px"/>
      </van-cell-group>
    </div>
    <footbar>
      <van-col span="24">
        <van-button @click="save()" style="width:100%;height:40px;" type="primary">提交</van-button>
      </van-col>
    </footbar>
  </div>
</template>
<script>
import Footbar from '@/components/Footbar'
import request from '@/utils/httpUtil'
import { API } from '@/api'
import { ImagePreview } from 'vant'

export default {
  name: 'exceptionaudit',
  data() {
    return {
      tableData: [],
      remark1: '',
      files: [],
      form: {
        fdId: '',
        ranger: '',
        lbName: '',
        patrolDate: '',
        problemType: '',
        remark1: '',
        auditer1: '',
        auditTime1: ''
      },
      showSubmitBtn: true
    }
  },
  watch: {

  },
  mounted() {
    this.initPage()
    this.$title(this.$route.name)
  },
  methods: {
    initPage() {
      this.exceptionDetail()
    },
    exceptionDetail() {
      let url = API.DINGTALK_FORESTRY_EXCEPTION_EXCEPTIONDETAIL
      let params = {
        id: this.$route.params.id
      }
      this.$loadingState(true, '数据加载中')
      request.get(url, { params }).then(res => {
        this.$loadingState(false)
        this.tableData = res.data.data || []
        // console.log(this.tableData)
        this.files.push(this.tableData.photo1)
        if (this.tableData.photo2) {
          this.files.push(this.tableData.photo2)
        }
        if (this.tableData.photo3) {
          this.files.push(this.tableData.photo3)
        }
      }).catch(err => this.$loadingState(false))
    },
    watchFile() {
      if (this.files.length === 0) return false
      ImagePreview(this.files)
    },
    save() {
      if (!this.form.remark1) {
        this.$dAlert('请输入审批意见')
        return false
      }
      this.$dConfirm('确认提交当前数据吗', () => {
        this.doSubmit()
      })
    },
    doSubmit() {
      let url = API.DINGTALK_FORESTRY_EXCEPTION_AUDITFIRST
      let params = {
        fdId: this.tableData.fdId,
        remark1: this.form.remark1
      }
      // console.log(params)
      this.$loadingState(true, '数据提交中')
      // debugger
      request.post(url, params).then(res => {
        this.$loadingState(false)
        this.$dAlert(res.data ? '审核成功！' : '审核失败', () => {
          if (res.data) {
            this.tableData = res.data || []
            this.$router.push({
              name: '审核审批首页'
            })
          }
        })
      }).catch(err => (this.$loadingState(false)))
    }
  },
  components: {
    Footbar
  }
}
</script>
<style scoped>
.detail-row {
  padding: 0px 10px;
}

.detail-row div {
  font-size: 13px;
}
.info-row {
  padding: 0px 10px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgba(0, 0, 0, 0.1);
}
.label-content {
  word-wrap: break-word;
  border-left-width: 0px;
  border-left-style: dashed;
  border-left-color: rgba(0, 0, 0, 0.1);
}
.card-body {
  padding: 5px 5px;
  background-color: #ffffff;
  border-bottom-width: 0px;
  border-bottom-style: dashed;
  border-bottom-color: rgba(0, 0, 0, 0.21);
  border-radius: 5px;
  line-height: 40px;
}
</style>
