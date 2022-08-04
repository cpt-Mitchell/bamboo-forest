<!-- 调整作业进度汇报人 -->
<template>
  <div class="logging-progress-reportor-box">
    <div style="padding:0 10px;">
      <van-cell-group>
        <van-field
          class="no-disabled_bgcolor"
          v-model="form.dtDate"
          @click.native="datePickerShow()"
          label="工作日期"
          placeholder="点击选择日期"
          disabled
        />
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>工作地点</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select
                type="text"
                class="van-field__control"
                :disabled="forestries.length == 0"
                v-model="form.workPlace"
              >
                <option :value="null" selected>请选择林场</option>
                <option v-for="(option, index) in forestries" :key="index" :value="option['林场名称']">{{
                  option['林场名称']
                }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>工作类型</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select type="text" class="van-field__control" v-model="form.workType">
                <option :value="null" selected>请选择工作类型</option>
                <option v-for="(option, index) in workTypes" :key="index" :value="option.WorkType">{{
                  option.WorkType
                }}</option>
              </select>
            </div>
          </div>
        </div>
        <van-field
          v-model="form.workContent"
          label="具体工作内容"
          rows="1"
          autosize
          type="textarea"
          placeholder="请输入具体工作内容"
        />
      </van-cell-group>
      <van-row>
        <van-col span="24">
          <h3 class="header-title">自拍</h3>
        </van-col>
      </van-row>
      <div style="padding:15px 15px 45px;position:relative;">
        <van-row style="margin-bottom:5px;">
          <van-col span="24" align="left">
            <van-button
              type="info"
              :loading="photoLoading"
              loading-text="上传中..."
              style="width:240px"
              @click="TakePhoto('photo')"
              >点击拍照上传</van-button
            >
          </van-col>
        </van-row>
        <van-row class="upload-row" style="margin-bottom:5px;" v-show="form.photo">
          <van-col span="24" align="left">
            <div class="uploaded-file-box">
              <a class="photo-name">{{
                (form.photo || '').substr((form.photo || '').lastIndexOf('/') + 1).split('.')[0]
              }}</a>
              <a class="photo-ext"
                >.{{ (form.photo || '').substr((form.photo || '').lastIndexOf('/') + 1).split('.')[1] }}</a
              >
            </div>
            <a class="photo-show" @click="showFile((photo.url || '') + (photo.destination || ''))">查看</a>
            <a class="upload-tip" ref="upload-tip-photo"></a>
          </van-col>
        </van-row>
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
import Footbar from '@/components/Footbar'
import DatePicker from '@/components/DatePicker'
import request from '@/utils/httpUtil'
import { API } from '@/api'
import { parseTime } from '@/utils/index'
import { ImagePreview } from 'vant'
import { TakePhoto } from '@/plugins/cordovaplugin'
export default {
  data() {
    return {
      forestries: [],
      areas: [],
      forestClasses: [],
      form: {
        workType: null,
        workPlace: null,
        dtDate: null
      },
      photo: {},
      photoLoading: false,
      showDatePicker: false
    }
  },
  methods: {
    TakePhoto(key) {
      TakePhoto(
        file => {
          this._onChange(file, key)
        },
        e => {}
      )
    },
    _onChange: function(file, key) {
      this.uploadImage(file.base64, key)
    },
    uploadImage(file, key) {
      const uploadReqeust = (params, cb) => {
        request
          .post(API.DINGTALK_BASE64FILEUPLOAD, params)
          .then(res => {
            cb && cb(res)
            this[key + 'Loading'] = false
          })
          .catch(err => {
            this[key + 'Loading'] = false
            dAlert('上传异常!')
          })
      }
      this[key + 'Loading'] = true
      this.$refs['upload-tip-' + key].className = 'upload-tip'
      this.$refs['upload-tip-' + key].innerText = '正在上传...'
      uploadReqeust({ base64: file }, res => {
        let errorCode = res.data.errorCode,
          text = '上传失败!'
        if (errorCode) {
          let name = res.data.data.destination || ''
          // this[key] = res.data.data.url + name
          this[key] = res.data.data
          this.form[key] = name
          this.$refs['upload-tip-' + key].className += ' success'
          text = '上传成功!'
        } else {
          if (!errorCode) this.$refs['upload-tip-' + key].className += ' error'
          this.$dAlert(res.data.msg || '上传失败')
        }
        this.$refs['upload-tip-' + key].innerText = text
      })
    },
    showFile(link = '') {
      ImagePreview([link])
    },
    datePickerClose() {
      this.showDatePicker = false
    },
    datePickerShow(key) {
      this.showDatePicker = true
    },
    getDateResult(val) {
      this.showDatePicker = false
      this.form.dtDate = parseTime(val, '{y}-{m}-{d}')
    },
    querySelector(params, nextArrKey) {
      this.$loadingState(true, '数据查询中')
      request
        .post(API.DINGTALK_COMMON_QUERY_OR_SUBMIT, params)
        .then(res => {
          this.$loadingState(false)
          let errorCode = res.data.errorCode
          if (errorCode === 0) {
            this[nextArrKey] = res.data.data.lc || []
          }
        })
        .then(err => this.$loadingState(false))
    },
    queryWorkType(params) {
      request
        .post(API.DINGTALK_COMMON_QUERY_OR_SUBMIT, params)
        .then(res => {
          let errorCode = res.data.errorCode
          if (errorCode === 0) {
            this.workTypes = res.data.data.types || []
          }
        })
        .then(err => this.$loadingState(false))
    },
    doSubmit() {
      if (!this.form.dtDate) {
        this.$dAlert('请选择工作日期')
        return false
      }
      if (!this.form.workPlace) {
        this.$dAlert('请选择工作地点')
        return false
      }
      if (!this.form.workType) {
        this.$dAlert('请选择工作类型')
        return false
      }
      if (!this.form.workContent) {
        this.$dAlert('请输入工作内容')
        return false
      }
      if (!this.photo || !this.photo.url) {
        this.$dAlert('请上传自拍照')
        return false
      }
      this.$dConfirm('确定提交表单内容吗？', () => {
        this.$loadingState(true, '数据提交中')
        let params = {
          formid: '_',
          apvResult: '_',
          module: '林场工作计划',
          task: '林场工作记录提交',
          payload: {
            workType: this.form.workType,
            workPlace: this.form.workPlace,
            photo: this.photo,
            photoTime: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
            workContent: this.form.workContent,
            dtDate: this.form.dtDate
          }
        }
        request
          .post(API.DINGTALK_COMMON_QUERY_OR_SUBMIT, params)
          .then(res => {
            let errorCode = res.data.errorCode
            this.$loadingState(false)
            dAlert(res.data.msg, () => {
              if (errorCode === 0) {
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
    this.querySelector(
      {
        formid: '_',
        apvResult: '_',
        module: '林场工作计划',
        task: '林场联动查询'
      },
      'forestries'
    )
    this.queryWorkType({
      formid: '_',
      apvResult: '_',
      module: '林场工作计划',
      task: '林场工作类型'
    })
    this.$title(this.$route.name)
  }
}
</script>

<style scoped lang="less">
.van-field .van-cell__title {
  max-width: 110px;
  input[type='number'] {
    font-size: 0.32rem;
  }
}

.upload-row {
  a {
    color: #0099ff;
    font-size: 0.36rem;
  }
  .uploaded-file-box {
    width: 65%;
    display: inline-block;
    .photo-name {
      max-width: 80%;
      overflow: hidden;
      white-space: nowrap;
      word-break: break-all;
      // display: inline-block;
      text-overflow: ellipsis;
      float: left;
    }
    .photo-ext {
      position: relative;
      top: -4px;
    }
  }
  .photo-show {
    padding-left: 10px;
  }
  .upload-tip {
    padding-left: 20px;
    font-size: 0.32rem;
    &.success {
      color: #11ce11;
    }
    &.error {
      color: red;
    }
  }
}

.upload-input {
  // font-size: 0;
  // opacity: 0;
  // width: 100%;
  filter: alpha(opacity=0);
  // position: absolute;
  // height: 100%;
  // right: 0;
  // top: 1px;
  cursor: pointer;
}
</style>
