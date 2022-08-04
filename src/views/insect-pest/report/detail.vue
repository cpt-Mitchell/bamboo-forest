<!-- 林木灾害已汇报【查询】明细界面 -->
<template>
  <div class="logging-progress-report-box">
    <div style="padding: 0 10px">
      <van-cell-group>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51)">
          <div class="van-cell__title">
            <span>林场名称</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body" style="color: black">
              <span>{{ form['林场名称'] }}</span>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51)">
          <div class="van-cell__title">
            <span>片区名称</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body" style="color: black">
              <span>{{ form['片区名称'] }}</span>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51)">
          <div class="van-cell__title">
            <span>林班名称</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body" style="color: black">
              <span>{{ form['林班名称'] }}</span>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51)">
          <div class="van-cell__title">
            <span>区域名称</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body" style="color: black">
              <span>{{ area }}</span>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51)">
          <div class="van-cell__title">
            <span>林木灾害类型</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body" style="color: black">
              <span>{{ form['林木灾害类型'] }}</span>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51)">
          <div class="van-cell__title">
            <span>林木灾害名称</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body" style="color: black">
              <span>{{ form['林木灾害名称'] }}</span>
            </div>
          </div>
        </div>
        <van-field
          class="no-disabled_bgcolor"
          v-model="form['受灾面积']"
          label="受灾面积"
          :readonly="true"
          type="number"
        >
          <template #button>
            <div style="width: 40px; text-align: center">亩</div>
          </template>
        </van-field>
        <van-field
          class="no-disabled_bgcolor"
          v-model="form['受灾株数']"
          label="受灾株数"
          :readonly="true"
          type="number"
        >
          <template #button>
            <div style="width: 40px; text-align: center">株</div>
          </template>
        </van-field>
        <van-field
          class="no-disabled_bgcolor"
          v-model="form['受灾率']"
          label="受灾率"
          :readonly="true"
          type="number"
        >
          <template #button>
            <div style="width: 40px; text-align: center">%</div>
          </template>
        </van-field>
      </van-cell-group>
      <!-- <div style="margin: 0 auto; text-align: center">
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
            <img style="height: 100%; width: 100%" :src="img.url + img.destination" />
          </div>
        </div>
      </div> -->
      <van-col span="24">
        <van-button style="width: 100%" @click="watchFile" color="#f7d127">
          <span style="color: #21bcfa">点击查看照片</span>
        </van-button>
      </van-col>
    </div>
    <footbar>
      <van-col span="24">
        <van-button @click="$router.back()" style="width: 100%; height: 40px" type="info">返回</van-button>
      </van-col>
    </footbar>
  </div>
</template>

<script>
import Footbar from '@/components/Footbar'
import request from '@/utils/httpUtil'
import { API } from '@/api'
import { parseTime } from '@/utils/index'
import { GetPhoto, TakePhoto } from '@/plugins/commonPlugins'
import { ImagePreview } from 'vant'
export default {
  data() {
    return {
      showPictureAction: false,
      userCompany: '',
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
      area: null,
      forestries: [],
      areas: [],
      forestClasses: [],
      orderNumbers: [],
      workProdures: [],
      form: {
        workPactProcedureId: null,
        forestName: null,
        areaName: null,
        compartment: null,
        orderNo: null,
        procedureName: null,
        totalTransArea: null,
        addTransArea: null,
        totalCutArea: null,
        addCutArea: null,
        reportTime: null
      },
      showDatePicker: false
    }
  },
  methods: {
    viewPic(links) {
      ImagePreview(links)
    },
    onCancel() {},
    onSelect(item) {
      this.showPictureAction = false
      // if (this.imgUrls.length >= 3) {
      //   this.$dAlert('问题拍照最多上传3张')
      //   return false
      // }
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
    getArea() {
      this.$loadingState(true)
      let params = {
        formid: '_',
        apvResult: '同意',
        module: `病虫害（${this.userCompany}）`,
        task: '查询前一百条病虫_反馈区域',
        payload: {
          id: this.form['ID']
        }
      }
      request.post(API.DISEASES_INFO, params).then(res => {
        this.$loadingState(false)
        if (res.data.errorCode === 0) {
          console.log(res)
          let data = res.data.data.bill || []
          if (data.length > 0) {
            data.forEach(item => {
              if (!this.area) {
                this.area = item['区域编号'].substring(12)
              } else {
                this.area = this.area + ',' + item['区域编号'].substring(12)
              }
            })
          }
        } else {
          this.$dAlert(res.data.msg || '查询区域失败')
        }
      })
    },
    getFiles() {
      this.$loadingState(true)
      let params = {
        formid: '_',
        apvResult: '同意',
        module: `病虫害（${this.userCompany}）`,
        task: '查询病虫_反馈图片',
        payload: {
          baskId: this.form['ID']
        }
      }
      request.post(API.DISEASES_INFO, params).then(res => {
        this.$loadingState(false)
        if (res.data.errorCode === 0) {
          let photoArr = res.data.data.bill || []
          this.files = []
          if (photoArr.length > 0) {
            photoArr.forEach(item => {
              item['图片URL'] = item['图片URL'].replace(/com/, 'cn')
              this.files.push(item['图片URL'])
            })
          }
          console.log(this.files)
        } else {
          this.$dAlert(res.data.msg || '获取图片失败')
        }
      })
    },
    watchFile() {
      if (this.files.length === 0) return false
      ImagePreview(this.files)
    },
    _onChange: function (file) {
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
    formSetProdurceValue() {
      let produreItem = this.workProdures.find(item => item.workPactProcedureId === this.form.workPactProcedureId)
      if (produreItem) {
        // this.form.procedureName = produreItem.procedureName
        // this.form = Object.assign(this.form, produreItem)
        let params = Object.assign(this.form, produreItem)
        request.post(API.FOREST_JOB_SELL_APPLY_SELECT_ITEMS, params).then(res => {
          this.$loadingState(false)
          let errorCode = res.data.code
          if (errorCode === 1000) {
            let data = res.data.data || []
            if (data && data.length !== 0) {
              let { totalCutArea, totalTransArea } = data[0] || {}
              this.form = Object.assign(this.form, { totalCutArea, totalTransArea })
            }
          }
        })
      }
    },
    datePickerClose() {
      this.showDatePicker = false
    },
    datePickerShow(key) {
      this.showDatePicker = true
    },
    getDateResult(val) {
      this.showDatePicker = false
      this.form.reportTime = parseTime(val, '{y}-{m}-{d}')
    },
    resetForm(index) {
      let formItemNames = ['areaName', 'compartment', 'orderNo', 'procedureName']
      formItemNames.splice(0, index)
      let obj = {}
      formItemNames.forEach(item => {
        obj[item] = null
      })
      this.form = Object.assign({}, this.form, obj)
      console.log(this.form)
    },
    resetDataArr(index) {
      let arr = ['areas', 'forestClasses', 'orderNumbers', 'workProdures']
      arr.splice(0, index)
      arr.forEach(item => {
        this[item] = []
      })
    },
    getQueryObject(formKey, arrKey) {
      let arrItemKey = ''
      switch (formKey) {
        case 'forestName':
          this.resetForm(0)
          this.resetDataArr(0)
          arrItemKey = 'lcName'
          break
        case 'areaName':
          this.resetDataArr(1)
          this.resetForm(1)
          arrItemKey = 'pqName'
          break
        case 'compartment':
          this.resetDataArr(2)
          this.resetForm(2)
          arrItemKey = 'lbName'
          break
        case 'orderNo':
          this.resetDataArr(3)
          this.resetForm(3)
          arrItemKey = 'orderNo'
          break
      }
      return (this[arrKey] || []).find(item => item[arrItemKey] === this.form[formKey])
    },
    selectChangeHandle(formKey, arrKey, nextArrKey) {
      let params = this.getQueryObject(formKey, arrKey)
      if (!params) return
      this.querySelector(params, nextArrKey)
    },
    querySelector(params, nextArrKey) {
      this.$loadingState(true, '数据查询中')
      request.post(API.FOREST_JOB_SELL_APPLY_SELECT_ITEMS, params).then(res => {
        this.$loadingState(false)
        let errorCode = res.data.code
        if (errorCode === 1000) {
          this[nextArrKey] = res.data.data || []
        }
      })
    },
    doSave() {},
    doSubmit() {
      this.$dConfirm('确定提交表单内容吗？', () => {
        this.$loadingState(true, '数据提交中')
        request
          .post(API.FOREST_JOB_SELL_HILL_SAVE, this.form)
          .then(res => {
            this.$loadingState(false)
            let errorCode = res.data.code
            dAlert(res.data.msg, () => {
              if (errorCode + '' === '1000') {
                this.$router.back()
              }
            })
          })
          .catch(err => this.$loadingState(false))
      })
    },
    getPersonalInfo() {
      request.get(API.DINGTALK_PERSONAL_INFO + `/${this.$store.state.appUser.id}`).then(res => {
        if (res.data.errorCode) {
          let data = res.data.data || {}
          this.userCompany =
            data.deptNameLong.indexOf('赣竹') !== -1 ? '赣竹' : data.deptNameLong.indexOf('广竹') !== -1 ? '广竹' : ''
        } else {
          this.$dAlert(res.data.msg || '获取登录人信息失败')
        }
      })
    }
  },
  components: {
    Footbar
  },
  mounted() {
    this.getPersonalInfo()
    console.log(this.$route.query)
    this.form = this.$route.query
    this.getArea()
    this.getFiles()
    // this.querySelector({}, 'forestries')
    this.$title(this.$route.name)
  }
}
</script>

<style scoped lang="less">
.van-field .van-cell__title {
  max-width: 110px;
  font-size: 16px;
  input[type='number'] {
    font-size: 0.32rem;
    color: #21bcfa;
  }
}
</style>
