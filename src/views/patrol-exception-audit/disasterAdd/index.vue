<template>
  <div style="height: 100%">
    <div class="card-part">
      <van-cell-group>
        <van-field class="no-disabled_bgcolor" v-model="tableData.lbName" label="林班名称" disabled />
        <van-field class="no-disabled_bgcolor" v-model="tableData.disasterDate" label="受灾日期" disabled />
        <van-field
          class="no-disabled_bgcolor"
          v-model="form.reportDate"
          @click.native="datePickerShow('reportDate')"
          label="调查日期"
          placeholder="点击选择调查日期"
          disabled
        />
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title van-field__label">
            <span>受灾情况</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select class="van-field__control" v-model="form.disaster">
                <option value selected>请选择受灾情况</option>
                <option v-for="(option, index) in disasterList" :key="index" :value="option.disasterName">{{
                  option.disasterName
                }}</option>
              </select>
            </div>
          </div>
        </div>
        <van-field
          v-model="form.disasterExplain"
          label="受灾说明"
          rows="1"
          placeholder="请输入问题描述"
          autosize
          type="textarea"
        />
      </van-cell-group>
      <div style="margin:0 auto;text-align:center">
        <div class="images-box1" ref="img-box">
          <div class="mu-paper" v-for="(img, index) in imgUrls" :key="index">
            <div
              class="upload-masker"
              :ref="'upload-masker-' + img.index"
              @click="viewPic([img.url + img.destination])"
            >
              <div class="upload-progress-bar" :id="'bar-' + img.destination"></div>
              <div class="upload-progress-bar-text" :id="'bar-text-' + img.destination"></div>
            </div>
            <img style="height:100%;width:100%;" :src="img.url + img.destination" />
            <span class="file-delete" @click="delete_img(index)">x</span>
          </div>
        </div>
      </div>
      <van-button @click="showPictureAction = true">受灾情况拍照（最多三张）</van-button>
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
import { GetPhoto, TakePhoto } from '@/plugins/commonPlugins'

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
      //  if (this.imgUrls.length > 3) {
      //   this.$dAlert('问题拍照最多上传3张')
      //   return false
      // } else if (this.imgUrls.length === 0) {
      //   this.$dAlert('未上传图片')
      //   return false
      // }
      if (!this.form.disaster) {
        this.$dAlert('受灾情况必需录入')
        return false
      }
      if (!this.form.reportDate) {
        this.$dAlert('调查日期必需录入')
        return false
      }
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
        disaster: this.form.disaster || '',
        disasterExplain: this.form.disasterExplain || '',
        photo1: this.form.photo1 || '',
        photo2: this.form.photo2 || '',
        photo3: this.form.photo3 || '',
        status: '3' || ''
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
<style lang="less" scoped>
.images-box {
  width: 100%;
  display: flex;
  // flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  padding-top: 10px;

  .mu-paper {
    width: 2.2rem;
    height: 2rem;
    // margin-right: 0.31rem;
    // margin-bottom: 0.31rem;

    &:nth-child(4n) {
      margin-right: 0;
    }

    &.add-btn-paper {
      line-height: 2rem;
      // text-align: center;
      // font-size: 0.8rem;
      color: #000;
      position: relative;

      input[type='file'] {
        font-size: 0;
        opacity: 0;
        width: 100%;
        filter: alpha(opacity=0);
        position: absolute;
        height: 100%;
        right: 0;
        top: 1px;
        cursor: pointer;
      }
    }
  }
}
.images-box1 {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding-top: 15px;

  .mu-paper {
    width: 2rem;
    height: 2rem;
    margin-right: 0.31rem;
    margin-bottom: 0.31rem;
    text-align: center;
    position: relative;

    &:nth-child(4n) {
      margin-right: 0;
    }

    &.add-btn-paper {
      line-height: 2rem;
      text-align: center;
      font-size: 0.8rem;
      color: #888;
      position: relative;

      input[type='file'] {
        font-size: 0;
        opacity: 0;
        width: 100%;
        filter: alpha(opacity=0);
        position: absolute;
        height: 100%;
        right: 0;
        top: 1px;
        cursor: pointer;
      }
    }

    .file-delete {
      position: absolute;
      right: -5px;
      top: -5px;
      background: #f44333;
      border-radius: 50%;
      color: #fff;
      width: 15px;
      height: 15px;
      line-height: 13px;
      display: inline-block;
      font-size: 11px;
    }
  }
}

.upload-masker {
  width: 100%;
  height: 100%;
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  // justify-content: center;
  align-items: center;

  .upload-progress-bar {
    width: 0;
    height: 5px;
    background: #61affe;
    border-radius: 3px;
    transition: width 0.2s ease-in;
  }

  .upload-progress-bar-text {
    font-size: 0.32rem;
    color: #fff;
    text-align: center;
    width: 100%;
    position: absolute;

    // margin-top:0px;
    &.error {
      color: #f44333;
    }
  }
}
#container {
  width: 100%;
  height: 200px;
}

.option {
  padding: 0px 5px;
}
</style>
