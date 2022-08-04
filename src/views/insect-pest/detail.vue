<!-- 林木灾害汇报界面 -->
<template>
  <div class="logging-progress-report-box">
    <div :style="style + 'padding-left: 10px; padding-right: 10px'">
      <van-cell-group>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51)">
          <div class="van-cell__title">
            <span>林场名称</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select
                type="text"
                class="van-field__control"
                :disabled="forestries.length == 0"
                v-model="form.lcName"
                @change="selectChangeHandle('lcName', 'forestries', 'areas', 'lcId', 'lcName', 'lcId')"
              >
                <option :value="null" selected>请选择林场</option>
                <option v-for="(option, index) in forestries" :key="index" :value="option.lcName">
                  {{ option.lcName }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51)">
          <div class="van-cell__title">
            <span>片区名称</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select
                type="text"
                class="van-field__control"
                :disabled="areas.length == 0"
                v-model="form.areaName"
                @change="selectChangeHandle('areaName', 'areas', 'forestClasses', 'areaId', 'pqName', 'pqId')"
              >
                <option :value="null" selected>请选择片区</option>
                <option v-for="(option, index) in areas" :key="index" :value="option.pqName">
                  {{ option.pqName }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51)">
          <div class="van-cell__title">
            <span>林班名称</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select
                type="text"
                class="van-field__control"
                :disabled="forestClasses.length == 0"
                v-model="form.lbName"
                @change="selectChangeHandle('lbName', 'forestClasses', 'regionArr', 'lbId', 'lbName', 'lbId')"
              >
                <option :value="null" selected>请选择林班</option>
                <option v-for="(option, index) in forestClasses" :key="index" :value="option.lbName">
                  {{ option.lbName }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51)">
          <div class="van-cell__title">
            <span>区域名称</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body" @click="showDialog" style="color: black">
              <span style="padding-left: 8px">{{ areaId2 || '点击选择区域名称' }}</span>
              <!-- <select
                @change="changeRegion(regionNoArr)"
                multiple="multiple"
                type="text"
                class="van-field__control"
                :disabled="regionArr.length == 0"
                v-model="regionNoArr"
              >
                <option :value="null" selected>请选择区域名称</option>
                <option v-for="(option, index) in regionArr" :key="index" :value="option['区域编号']">
                  {{ option['区域编号'] }}
                </option>
              </select> -->
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51)">
          <div class="van-cell__title">
            <span>林木灾害类型</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select
                type="text"
                class="van-field__control"
                :disabled="diseasesTypeArr.length == 0"
                v-model="form.type"
                @change="formSetProdurceValue(form.type)"
              >
                <option :value="null" selected>请选择林木灾害类型</option>
                <option v-for="(option, index) in diseasesTypeArr" :key="index" :value="option">
                  {{ option }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51)">
          <div class="van-cell__title">
            <span>林木灾害名称</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select
                type="text"
                class="van-field__control"
                :disabled="diseasesArr.length == 0"
                v-model="form.typeName"
              >
                <option :value="null" selected>请选择林木灾害名称</option>
                <option v-for="(option, index) in diseasesArr" :key="index" :value="option['名称']">
                  {{ option['名称'] }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <van-field
          class="no-disabled_bgcolor"
          v-model="form.infectedArea"
          label="受灾面积"
          type="number"
          placeholder="请输入受灾面积"
        >
          <template #button>
            <div style="width: 40px; text-align: center">亩</div>
          </template>
        </van-field>
        <van-field
          class="no-disabled_bgcolor"
          v-model="form.infectedNumber"
          label="受灾株数"
          type="number"
          placeholder="请输入受灾株数"
        >
          <template #button>
            <div style="width: 40px; text-align: center">株</div>
          </template>
        </van-field>
        <van-field
          class="no-disabled_bgcolor"
          v-model="form.infectedRate"
          label="受灾率"
          type="number"
          placeholder="请输入受灾率"
        >
          <template #button>
            <div style="width: 40px; text-align: center">%</div>
          </template>
        </van-field>
      </van-cell-group>
      <div style="margin: 0 auto; text-align: center">
        <div class="images-box1" ref="img-box">
          <div
            style="width: 30%; float: left; margin-right: 5px"
            class="mu-paper"
            v-for="(img, index) in imgUrls"
            :key="index"
          >
            <!-- <div
              class="upload-masker"
              :ref="'upload-masker-' + img.index"
              @click="viewPic([img.url.replace(/com/, 'cn') + img.destination])"
            >
              <div class="upload-progress-bar" :id="'bar-' + img.destination"></div>
              <div class="upload-progress-bar-text" :id="'bar-text-' + img.destination"></div>
            </div> -->
            <img
              style="height: 100%; width: 100%"
              :src="img.url.replace(/com/, 'cn') + img.destination"
              @click="viewPic([img.url.replace(/com/, 'cn') + img.destination])"
            />
            <!-- <img style="height: 100%; width: 100%" :src="img" @click="viewPic([img])" /> -->
            <!-- <span class="file-delete" @click="delete_img(index)">x</span> -->
            <van-button class="file-delete" type="danger" size="mini" @click="delete_img(index)">删除</van-button>
          </div>
        </div>
      </div>
      <van-col span="24" style="margin-top: 5px">
        <van-button style="width: 100%" @click="showPictureAction = true" color="#f7d127">
          <span style="color: #fff">受灾情况拍照</span>
        </van-button>
      </van-col>
    </div>
    <van-action-sheet
      :round="false"
      v-model="showPictureAction"
      :actions="actions"
      cancel-text="取消"
      @select="onSelect"
      @cancel="onCancel"
    />
    <m-selector :data="regionArr" :show="show" @cancel="hideDialog" @submit="getResult"></m-selector>
    <footbar>
      <van-col span="12">
        <van-button @click="doSave()" style="width: 100%; height: 40px" type="info">暂存,返回</van-button>
      </van-col>
      <van-col span="12">
        <van-button @click="doSubmit()" style="width: 100%; height: 40px" type="primary">提交</van-button>
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
import MSelector from '@/components/MultipleSelector'
import { ImagePreview } from 'vant'
export default {
  data() {
    return {
      style: '',
      userCompany: '',
      show: false,
      showPictureAction: false,
      files: [],
      // imgUrls: [
      //   require('@/assets/WashCar-barcode.jpg'),
      //   require('@/assets/WashCar-barcode.jpg'),
      //   require('@/assets/WashCar-barcode.jpg'),
      //   require('@/assets/WashCar-barcode.jpg'),
      //   require('@/assets/WashCar-barcode.jpg')
      // ],
      imgUrls: [],
      regionNoArr: [],
      imgBase64: '',
      areaId2: null,
      actions: [
        {
          name: '从相册选择照片'
        },
        {
          name: '拍照'
        }
      ],
      forestries: [],
      areas: [],
      forestClasses: [],
      regionArr: [],
      diseasesTypeArr: ['病害', '虫害', '自然灾害', '火灾'],
      diseasesArr: [],
      isPhoto: false,
      id: '',
      form: {
        companyName: null,
        companyId: null,
        lcName: null,
        lcId: null,
        areaName: null,
        areaId: null,
        areaId2: null,
        lbName: null,
        lbId: null,
        lbNo: null,
        feedbackNo: null,
        reportor: null,
        reportTime: null,
        inputor: null,
        inputTime: null,
        type: null,
        typeName: null,
        infectedNumber: null,
        infectedRate: null,
        infectedArea: null,
        areaArr: [],
        remake: '竹林APP发送'
      },
      showDatePicker: false
    }
  },
  watch: {
    'imgUrls.length'(val) {
      if (val) {
        if (Math.ceil(val / 3) > 0) {
          this.style = 'padding-bottom: ' + (Math.ceil(val / 3) * 160 + 100) + 'px;'
        }
      } else {
        this.style = 'padding-bottom: 0;'
      }
    }
  },
  methods: {
    getResult(data) {
      if (data) {
        this.areaId2 = null
        this.form.areaId2 = null
        data.forEach(item => {
          this.form.areaArr = data
          if (!this.form.areaNo) {
            this.form.areaNo = item.qyNo.substring(12)
          } else {
            this.form.areaNo = this.form.areaNo + ',' + item.qyNo.substring(12)
          }
          if (!this.areaId2) {
            this.areaId2 = item.qyNo.substring(12)
          } else {
            this.areaId2 = this.areaId2 + ',' + item.qyNo.substring(12)
          }
          if (!this.form.areaId2) {
            this.form.areaId2 = item.qyNo
          } else {
            this.form.areaId2 = this.form.areaId2 + ',' + item.qyNo
          }
          if (!this.form.lbNo) {
            this.form.lbNo = item.qyNo.slice(0, 11)
          }
        })
        console.log(this.form.areaNo)
        this.show = false
      }
    },
    showDialog() {
      if (this.regionArr.length > 0) {
        this.show = true
      }
    },
    hideDialog() {
      this.show = false
    },
    delete_img(index) {
      this.imgUrls.splice(index, 1)
    },
    viewPic(links) {
      ImagePreview(links)
    },
    onCancel() {},
    changeRegion(val) {
      if (val) {
        this.form.lbNo = val.slice(0, 11)
      }
    },
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
    // watchFile() {
    //   if (this.files.length === 0) return false
    //   ImagePreview(this.files)
    // },
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
          let name = res.data.data.destination || ''
          this.form.photoUrl = res.data.data.url.replace(/com/, 'cn') + name
          this.form.photoName = name
          this.imgUrls.push(res.data.data)
          this.isPhoto = true
          this.$nextTick(() => {
            document.getElementById('bar-text-' + res.data.data.destination).innerText = '上传成功'
            setTimeout(() => {
              document.getElementById('bar-text-' + res.data.data.destination).innerText = '点击图片查看'
            }, 3000)
          })
        } else {
          this.$dAlert('上传失败')
        }
      })
    },
    formSetProdurceValue(val) {
      // let produreItem = this.diseasesTypeArr.find(item => item.workPactProcedureId === this.form.workPactProcedureId)
      // if (produreItem) {
      //   let params = Object.assign(this.form, produreItem)
      //   request.post(API.FOREST_JOB_SELL_APPLY_SELECT_ITEMS, params).then(res => {
      //     this.$loadingState(false)
      //     let errorCode = res.data.code
      //     if (errorCode === 1000) {
      //       let data = res.data.data || []
      //       if (data && data.length !== 0) {
      //         let { totalCutArea, totalTransArea } = data[0] || {}
      //         this.form = Object.assign(this.form, { totalCutArea, totalTransArea })
      //       }
      //     }
      //   })
      // }
      this.form.typeName = null
      this.diseasesArr = []
      this.$loadingState(true)
      let params = {
        formid: '_',
        apvResult: '同意',
        module: `病虫害（${this.userCompany}）`,
        task: '查询' + val + '名称',
        payload: {}
      }
      request.post(API.DISEASES_INFO, params).then(res => {
        this.$loadingState(false)
        if (res.data.errorCode === 0) {
          this.diseasesArr = res.data.data.bill || []
        } else {
          this.$dAlert(res.data.msg || '查询林木灾害名称失败')
        }
      })
    },
    datePickerClose() {
      this.showDatePicker = false
    },
    datePickerShow(key) {
      this.showDatePicker = true
    },
    getDateResult(val) {
      this.showDatePicker = false
      this.form.inputTime = parseTime(val, '{y}-{m}-{d} {h}:{i}:{s}')
      this.form.reportTime = parseTime(date, '{y}-{m}-{d} {h}:{i}:{s}')
    },
    resetForm(index) {
      let formItemNames = ['areaName', 'lbName', 'areaId2']
      formItemNames.splice(0, index)
      let obj = {}
      formItemNames.forEach(item => {
        obj[item] = null
      })
      this.areaId2 = ''
      this.form = Object.assign({}, this.form, obj)
    },
    resetDataArr(index) {
      let arr = ['areas', 'forestClasses', 'regionArr']
      arr.splice(0, index)
      arr.forEach(item => {
        this[item] = []
      })
    },
    getQueryObject(formKey, arrKey) {
      let arrItemKey = ''
      switch (formKey) {
        case 'lcName':
          this.resetForm(0)
          this.resetDataArr(0)
          arrItemKey = 'lcName'
          break
        case 'areaName':
          this.resetDataArr(1)
          this.resetForm(1)
          arrItemKey = 'pqName'
          break
        case 'lbName':
          this.resetDataArr(2)
          this.resetForm(2)
          arrItemKey = 'lbName'
          break
        case 'areaId2':
          this.resetDataArr(3)
          this.resetForm(3)
          arrItemKey = 'areaId2'
          break
      }
      return (this[arrKey] || []).find(item => item[arrItemKey] === this.form[formKey])
    },
    selectChangeHandle(formKey, arrKey, nextArrKey, idName, checkName, checkIdName) {
      this[arrKey].forEach(item => {
        if (this.form[formKey] === item[checkName]) {
          this.form[idName] = item[checkIdName]
        }
      })
      let params = this.getQueryObject(formKey, arrKey)
      if (idName === 'lbId') {
        this.selectRegion(this.form.lbId)
      } else {
        this.querySelector(params, nextArrKey)
      }
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
    selectRegion(lbId) {
      this.$loadingState(true)
      let params = {
        formid: '_',
        apvResult: '同意',
        module: `病虫害（${this.userCompany}）`,
        task: '查询病虫害区域',
        payload: {
          lb: lbId.toString()
        }
      }
      request.post(API.DISEASES_INFO, params).then(res => {
        this.$loadingState(false)
        if (res.data.errorCode === 0) {
          this.regionArr = res.data.data.bill || []
          this.regionArr.forEach(item => {
            item.qyNo = item['区域编号']
          })
        } else {
          this.$dAlert(res.data.msg || '查询区域失败')
        }
      })
    },
    doSave() {
      this.form.deleteId = Math.round(Math.random() * 999999)
      var request = window.indexedDB.open('noReport')
      // localStorage.setItem('id', localStorage.getItem('id') ? Number(localStorage.getItem('id')) + 1 : 0)
      // this.form.id = localStorage.getItem('id')
      var that = this
      request.onerror = function (event) {
        console.log('数据库打开报错')
        dAlert('暂存数据库打开失败')
      }
      request.onsuccess = function (event) {
        console.log('数据库打开成功')
        dAlert('暂存数据库打开成功')
        function add() {
          var db = event.target.result
          var request = db.transaction(['noReport'], 'readwrite').objectStore('noReport').add(that.form)
          request.onsuccess = function (event) {
            console.log('数据写入成功')
            dAlert('暂存成功')
            that.back()
          }
          request.onerror = function (event) {
            console.log('数据写入失败')
            dAlert('暂存失败')
          }
        }
        add()
      }
      request.onupgradeneeded = function (event) {
        var db = event.target.result
        var objectStore
        if (!db.objectStoreNames.contains('noReport')) {
          objectStore = db.createObjectStore('noReport', { keyPath: 'deleteId' })
          objectStore.createIndex('noReport', 'arr', { unique: true })
        }
      }
    },
    back() {
      setTimeout(this.$router.go(-1), 2000)
    },
    // add() {
    //   var request = window.indexedDB.open('noReport')
    //   request.onupgradeneeded = function (event) {
    //     var db = event.target.result
    //     var request = db.transaction(['noReport'], 'readwrite').objectStore('noReport').add(this.form)
    //     request.onsuccess = function (event) {
    //       console.log('数据写入成功')
    //       this.$router.back()
    //     }
    //     request.onerror = function (event) {
    //       console.log('数据写入失败')
    //     }
    //   }
    // },
    postArea2() {
      this.form.areaArr.forEach(item => {
        let params = {
          formid: '_',
          apvResult: '同意',
          module: `病虫害（${this.userCompany}）`,
          task: '保存病虫_反馈区域',
          payload: {
            feedBackId: this.id,
            areaId: item.qyNo || ''
          }
        }
        request.post(API.DISEASES_INFO, params).then(res => {
          this.$loadingState(false)
          if (res.data.errorCode === 0) {
            this.$dAlert(res.data.msg || '提交成功')
          } else {
            this.$dAlert(res.data.msg || '提交失败')
            return false
          }
        })
      })
      setTimeout(this.$router.back(), 3000)
    },
    doSubmit() {
      this.form.remake = '竹林APP发送'
      this.form.companyName = this.userCompany
      this.form.companyId = '1'
      let date = new Date()
      this.form.status = '0'
      this.form.handleStatus = '0'
      this.form.inputTime = parseTime(date, '{y}-{m}-{d} {h}:{i}:{s}')
      this.form.reportTime = parseTime(date, '{y}-{m}-{d} {h}:{i}:{s}')
      this.form.inputor = this.$store.state.appUser.userName || ''
      this.form.reportor = this.$store.state.appUser.userName || ''
      this.form.feedbackNo = 'A' + Math.round(Math.random() * 999999)
      this.$dConfirm('确定提交表单内容吗？', () => {
        if (
          this.form.lcName &&
          this.form.areaName &&
          this.form.lbName &&
          this.form.areaId2 &&
          this.form.type &&
          this.form.typeName &&
          this.form.infectedArea &&
          this.form.infectedNumber &&
          this.form.infectedRate
        ) {
          this.$loadingState(true)
          let params = {
            formid: '_',
            apvResult: '同意',
            module: `病虫害（${this.userCompany}）`,
            task: '病虫_反馈保存',
            payload: this.form
          }
          request.post(API.DISEASES_INFO, params).then(res => {
            this.$loadingState(false)
            if (res.data.errorCode === 0) {
              // this.diseasesArr = res.data.data.bill || []
              this.id = res.data.data.audit.ID || ''
              if (this.id) {
                this.postArea2()
                this.imgUrls.forEach(item => {
                  this.saveImg(item.url.replace(/com/, 'cn') + item.destination, item.destination)
                })
              } else {
                console.log('未返回主键ID')
              }
            } else {
              this.$dAlert(res.data.msg || '提交失败')
            }
          })
        } else {
          this.$dAlert('请确定表单是否填写完整后再进行提交')
        }
      })
    },
    saveImg(imgUrl, name) {
      this.$loadingState(true)
      let params = {
        formid: '_',
        apvResult: '同意',
        module: `病虫害（${this.userCompany}）`,
        task: '保存病虫_反馈图片',
        payload: {
          backId: this.id,
          imgUrl: imgUrl.replace(/com/, 'cn')
        }
      }
      request.post(API.DISEASES_INFO, params).then(res => {
        this.$loadingState(false)
        if (res.data.errorCode === 0) {
          this.$dAlert(res.data.msg || '保存图片' + name + '成功')
        } else {
          this.$dAlert(res.data.msg || '保存图片失败')
        }
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
    Footbar,
    MSelector
  },
  mounted() {
    console.log(this.$store.state.appUser)
    this.getPersonalInfo()
    this.querySelector({}, 'forestries')
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
