<template>
  <div style="height: 100%">
    <div class="card-part">
      <van-cell-group>
        <van-field class="no-disabled_bgcolor" v-model="tableData.lbName" label="林班名称" disabled />
        <van-field class="no-disabled_bgcolor" v-model="tableData.reportDate" label="调查日期" disabled />
        <van-field class="no-disabled_bgcolor" v-model="tableData.disaster" label="受灾情况" disabled />
        <van-field class="no-disabled_bgcolor" v-model="tableData.disasterExplain" label="受灾说明" disabled />
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>受灾情况拍照</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <van-button v-if="files.length > 0" type="info" size="small" @click="watchFile">点击查看</van-button>
              <label style="font-size:.36rem;color:#333;" v-else>暂无问题照片</label>
            </div>
          </div>
        </div>
      </van-cell-group>
    </div>
    <van-action-sheet
      :round="false"
      v-model="showPictureAction"
      :actions="actions"
      cancel-text="取消"
      @select="onSelect"
      @cancel="onCancel"
    />
    <date-picker :show="showDatePicker" type="date" @result="getDateResult" @close="datePickerClose" />
    <footbar>
      <van-col span="24">
        <van-button @click="save()" style="width:100%;height:40px;" type="primary">提交</van-button>
      </van-col>
    </footbar>
  </div>
</template>
<script>
import DatePicker from '@/components/DatePicker'
import Footbar from '@/components/Footbar'
import request from '@/utils/httpUtil'
import { API } from '@/api'
import { ImagePreview } from 'vant'
import { parseTime } from '@/utils/index'
import { GetPhoto, TakePhoto } from '@/plugins/cordovaplugin'

export default {
  name: 'exceptionaudit',
  data() {
    return {
      showDatePicker: false,
      showPictureAction: false,
      checkerList: [],
      tableData: [],
      remark1: '',
      files: [],
      imgUrls: [],
      actions: [
        {
          name: '从相册选择照片'
        },
        {
          name: '拍照'
        }
      ],
      disasterList: [
        { id: 1, disasterName: '可能造成小树冻死' },
        { id: 2, disasterName: '可能造成树梢结冰折断' },
        { id: 3, disasterName: '可能造成道路损坏' },
        { id: 4, disasterName: '可能造成风吹断小树' },
        { id: 5, disasterName: '其它' }
      ],
      form: {
        fdId: '',
        disaster: '',
        disasterExplain: '',
        photo1: '',
        photo2: '',
        photo3: ''
      }
    }
  },
  watch: {},
  mounted() {
    this.initPage()
    this.$title(this.$route.name)
  },
  methods: {
    initPage() {
      this.exceptionDetail()
    },
    viewPic(links) {
      ImagePreview(links)
    },
    onCancel() {},
    onSelect(item) {
      this.showPictureAction = false
      if (this.imgUrls.length >= 3) {
        this.$dAlert('问题拍照最多上传3张')
        return false
      }
      if (item.name === '拍照') {
        TakePhoto(
          file => {
            this._onChange(file)
          },
          e => {}
        )
      } else if (item.name === '从相册选择照片') {
        GetPhoto(
          file => {
            this._onChange(file)
          },
          e => {}
        )
      }
    },
    getDateResult(val) {
      this.showDatePicker = false
      this.form[this.datePickKey] = parseTime(val, '{y}-{m}-{d}')
    },
    datePickerShow(key) {
      this.datePickKey = key
      this.showDatePicker = true
    },
    datePickerClose() {
      this.showDatePicker = false
      this.datePickKey = ''
    },
    exceptionDetail() {
      let url = API.DINGTALK_DISASTERREPORT_FINDONE
      let params = {
        fdId: this.$route.params.id
      }
      this.$loadingState(true, '数据加载中')
      request
        .get(url, { params })
        .then(res => {
          this.$loadingState(false)
          this.tableData = res.data.data || []
          this.files.push(this.tableData.photo1)
          if (this.tableData.photo2) {
            this.files.push(this.tableData.photo2)
          }
          if (this.tableData.photo3) {
            this.files.push(this.tableData.photo3)
          }
        })
        .catch(err => this.$loadingState(false))
    },
    watchFile() {
      if (this.files.length === 0) return false
      ImagePreview(this.files)
    },
    _onChange: function(file) {
      this.uploadImage(file.base64)
    },
    uploadImage(file) {
      const uploadReqeust = (params, cb) => {
        request
          .post(API.DINGTALK_BASE64FILEUPLOAD, params)
          .then(res => {
            cb && cb(res)
          })
          .catch(err => {
            this.$loadingState(false)
            dAlert('上传异常!')
          })
      }
      this.$loadingState(true, '正在上传')
      uploadReqeust({ base64: file }, res => {
        this.$loadingState(false)
        let errorCode = res.data.errorCode
        if (errorCode) {
          this.imgUrls.push(res.data.data)
          this.$nextTick(() => {
            document.getElementById('bar-text-' + res.data.data.destination).innerText = '上传成功'
            setTimeout(() => {
              document.getElementById('bar-text-' + res.data.data.destination).innerText = '查看'
            }, 3000)
          })
        } else {
          this.$dAlert('上传失败')
        }
      })
    },
    save() {
      this.$dConfirm('确认提交当前数据吗', () => {
        this.doSubmit()
      })
    },
    doSubmit() {
      for (let i = 1; i <= this.imgUrls.length; i++) {
        this.form['photo' + i] = this.imgUrls[i - 1].destination
      }
      // let url = API.DINGTALK_DISASTERREPORT_UPDATE
      let params = {
        fdId: this.tableData.fdId,
        status: '4' || ''
      }
      this.$loadingState(true, '数据提交中')
      request
        .post(API.DINGTALK_DISASTERREPORT_UPDATE, params)
        .then(res => {
          this.$loadingState(false)
          if (res.data) {
            this.tableData = res.data || []
            this.$router.push({
              name: '审核审批首页'
            })
          }
        })
        .catch(err => this.$loadingState(false))
    }
  },
  components: {
    Footbar,
    DatePicker
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
