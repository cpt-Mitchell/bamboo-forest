<template>
  <div style="height: 100%">
    <div class="card card-part">
      <van-cell-group>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>林班名称</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select class="van-field__control" v-model="form.lbName">
                <option value selected>请选择林班</option>
                <option v-for="(option, index) in lbList" :key="index" :value="option.lbName">{{
                  option.lbName
                }}</option>
              </select>
            </div>
          </div>
        </div>
        <van-field
          class="no-disabled_bgcolor"
          v-model="form.patrolDate"
          @click.native="datePickerShow('patrolDate')"
          label="巡山日期"
          placeholder="点击选择日期"
          disabled
        />

        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>问题类型</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select class="van-field__control" v-model="form.problemType">
                <option value selected>请选择问题类型</option>
                <option v-for="(option, index) in problemTypeList" :key="index" :value="option.quesTypeName">{{
                  option.quesTypeName
                }}</option>
              </select>
            </div>
          </div>
        </div>
        <van-field v-model="form.involveAccount" label="涉及数量" placeholder="请输入涉及数量" type="number" />

        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>单位</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select class="van-field__control" v-model="form.unit">
                <option value selected>请选择单位</option>
                <option v-for="(option, index) in unitList" :key="index" :value="option.unit">{{ option.unit }}</option>
              </select>
            </div>
          </div>
        </div>
        <van-field
          v-model="form.problemDesc"
          label="问题描述"
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
      <van-button @click="showPictureAction = true">发现问题拍照（最多三张）</van-button>
    </div>
    <date-picker :show="showDatePicker" type="date" @result="getDateResult" @close="datePickerClose" />
    <van-action-sheet
      :round="false"
      v-model="showPictureAction"
      :actions="actions"
      cancel-text="取消"
      @select="onSelect"
      @cancel="onCancel"
    />
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
import { parseTime } from '@/utils/index'
import { GetPhoto, TakePhoto } from '@/plugins/commonPlugins'
import { ImagePreview } from 'vant'

export default {
  name: 'problemreport',
  data() {
    return {
      tableData: [],
      datePickKey: '',
      showDatePicker: false,
      showPictureAction: false,
      actions: [
        {
          name: '从相册选择照片'
        },
        {
          name: '拍照'
        }
      ],
      form: {
        lbName: '',
        patrolDate: '',
        problemType: '',
        involveAccount: '',
        unit: '',
        problemDesc: '',
        photo1: '',
        photo2: '',
        photo3: ''
      },
      patrolDate: '',
      lbList: [],
      problemTypeList: [
        { id: 1, quesTypeName: '林木被盗' },
        { id: 2, quesTypeName: '林地被侵占' },
        { id: 3, quesTypeName: '林木火灾' },
        { id: 4, quesTypeName: '病虫害' },
        { id: 5, quesTypeName: '牛害' }
      ],
      unitList: [
        { id: 1, unit: '亩' },
        { id: 2, unit: '株' },
        { id: 3, unit: '方' }
      ],
      imgUrls: [],
      currentdate: ''
    }
  },
  mounted() {
    this.initPage()
    this.$title(this.$route.name)
  },
  methods: {
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
    datePickerClose() {
      this.showDatePicker = false
      this.datePickKey = ''
    },
    datePickerShow(key) {
      this.datePickKey = key
      this.showDatePicker = true
    },
    getDateResult(val) {
      this.showDatePicker = false
      this.form[this.datePickKey] = parseTime(val, '{y}-{m}-{d}')
    },
    initPage() {
      this.findLb()
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      this.currentdate = year + '-' + month + '-' + strDate
      this.patrolDate = this.currentdate
      this.form.patrolDate = this.currentdate
      // console.log(this.patrolDate)
    },
    dateValidate(val) {
      if (!val && !this.patrolDate) {
        return false
      }
      if (this.patrolDate) {
        // debugger
        let patrolTime = new Date(this.patrolDate.replace(/-/g, '/')).getTime()
        let nowTime = new Date(this.currentdate.replace(/-/g, '/')).getTime()
        if (patrolTime - nowTime > 0) {
          alert('巡山日期不可超过当前日期！')
          return false
        }
      }
      return true
    },
    findLb() {
      let that = this
      let url = API.DINGTALK_FORESTRY_EXCEPTION_FINDLB
      request
        .get(url)
        .then(res => {
          that.lbList = res.data.data || []
        })
        .catch(e => {
          this.$dAlert(e)
        })
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
              document.getElementById('bar-text-' + res.data.data.destination).innerText = ''
            }, 3000)
          })
        } else {
          console.log(res)
          this.$dAlert('上传失败' + JSON.stringify(res))
        }
      })
    },
    save() {
      if (!this.form.lbName) {
        this.$dAlert('请输入林班名称')
        return false
      }
      if (!this.form.patrolDate) {
        this.$dAlert('请输入巡山日期')
        return false
      }
      if (!this.form.problemType) {
        this.$dAlert('请选择问题类型')
        return false
      }
      if (!this.form.involveAccount) {
        this.$dAlert('请输入涉及数量')
        return false
      }
      if (!this.form.unit) {
        this.$dAlert('请选择单位')
        return false
      }
      if (this.imgUrls.length > 3) {
        this.$dAlert('问题拍照最多上传3张')
        return false
      } else if (this.imgUrls.length === 0) {
        this.$dAlert('未上传图片')
        return false
      }
      this.$dConfirm('确认提交当前信息吗？', () => {
        this.doSubmit()
      })
    },
    resetForm() {
      this.form = {
        lbName: '',
        patrolDate: '',
        problemType: '',
        involveAccount: '',
        unit: '',
        problemDesc: '',
        photo1: '',
        photo2: '',
        photo3: ''
      }
    },
    doSubmit() {
      for (let i = 1; i <= this.imgUrls.length; i++) {
        this.form['photo' + i] = this.imgUrls[i - 1].destination
      }
      let params = {
        lbName: this.form.lbName || '',
        patrolDate: this.form.patrolDate || '',
        problemType: this.form.problemType || '',
        involveAccount: this.form.involveAccount || '',
        unit: this.form.unit || '',
        problemDesc: this.form.problemDesc || '',
        photo1: this.form.photo1 || '',
        photo2: this.form.photo2 || '',
        photo3: this.form.photo3 || ''
      }
      this.$loadingState(true, '数据提交中')
      request
        .post(API.DINGTALK_FORESTRY_EXCEPTION_SAVE, params)
        .then(res => {
          this.$loadingState(false)
          // if (res.data) {
          //   this.tableData = res.data || []
          //   this.resetForm()
          //   this.$router.back()
          // }
          this.$dAlert(res.data ? '提交成功！' : '提交失败', () => {
            if (res.data) {
              this.tableData = res.data || []
              this.resetForm()
              this.$router.back()
            }
          })
        })
        .catch(err => this.$loadingState(false))
    },
    delete_img(i) {
      this.imgUrls.splice(i, 1)
    }
  },
  components: {
    Footbar,
    DatePicker
  }
}
</script>
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
  // background: rgba(0, 0, 0, 0.7);
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
