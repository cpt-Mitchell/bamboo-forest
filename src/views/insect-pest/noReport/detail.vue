<!-- 未汇报暂存【详情】界面 -->
<template>
  <div class="logging-progress-report-box">
    <div :style="style + ' padding-left: 10px; padding-right: 10px'">
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
                @change="changeRegion"
                type="text"
                class="van-field__control"
                :disabled="regionArr.length == 0"
                v-model="form.areaId2"
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
      <div style="margin: 0 auto; text-align: center; margin-bottom: 5px">
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
            <!-- <span class="file-delete" @click="delete_img(index)">x</span> -->
            <van-button class="file-delete" type="danger" size="mini" @click="delete_img(index)">删除</van-button>
          </div>
        </div>
      </div>
      <van-col span="24">
        <van-button style="width: 100%" @click="showPictureAction = true" color="#f7d127">
          <span style="color: #21bcfa">受灾情况拍照</span>
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
    <footbar>
      <m-selector :data="regionArr" :show="show" @cancel="hideDialog" @submit="getResult"></m-selector>
      <van-col span="12">
        <van-button @click="$router.back()" style="width: 100%; height: 40px" type="info">返回</van-button>
      </van-col>
      <van-col span="12">
        <van-button @click="doSubmit()" style="width: 100%; height: 40px" type="primary">确认提交</van-button>
      </van-col>
    </footbar>
  </div>
</template>

<script>
import Footbar from '@/components/Footbar'
import request from '@/utils/httpUtil'
import { API } from '@/api'
import { parseTime } from '@/utils/index'
import { GetPhoto, TakePhoto } from '@/plugins/cordovaplugin'
import { ImagePreview } from 'vant'
import MSelector from '@/components/MultipleSelector'
export default {
  data() {
    return {
      show: false,
      userCompany: '',
      style: '',
      areaId2: '',
      showPictureAction: false,
      allData: [],
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
      forestries: [],
      areas: [],
      forestClasses: [],
      regionArr: [],
      diseasesTypeArr: ['病害', '虫害'],
      diseasesArr: [],
      orderNumbers: [],
      workProdures: [],
      isPhoto: false,
      id: '',
      form: {
        type: null,
        typeName: null,
        workPactProcedureId: null,
        lcName: null,
        lbNo: null,
        areaName: null,
        areaId2: null,
        compartment: null,
        orderNo: null,
        inputor: null,
        inputTime: null,
        reportor: null,
        reportTime: null,
        procedureName: null,
        totalTransArea: null,
        addTransArea: null,
        totalCutArea: null,
        addCutArea: null,
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
        this.form.areaArr = data
        this.areaId2 = null
        this.form.areaId2 = null
        data.forEach(item => {
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
      console.log(val)
      if (val) {
        this.form.lbNo = val.slice(0, 11)
      }
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
          this.$message.error(res.data.msg || '查询病虫害名称失败')
        }
      })
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
          .post(/* 'http://platform.hwagain.com/api/base-file/file/upload' */ API.DINGTALK_BASE64FILEUPLOAD, params)
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
          this.form.photoUrl = res.data.data.url + name
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
        case 'compartment':
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
        console.log(res.data)
        if (res.data.errorCode === 0) {
          this.$loadingState(false)
          this.regionArr = res.data.data.bill || []
          this.regionArr.forEach(item => {
            item.qyNo = item['区域编号']
          })
        } else {
          this.$loadingState(false)
          this.$dAlert(res.data.msg || '查询区域失败')
        }
      })
    },
    querySelector(params, nextArrKey) {
      this.$loadingState(true, '数据查询中')
      request.post(API.FOREST_JOB_SELL_APPLY_SELECT_ITEMS, params).then(res => {
        this.$loadingState(false)
        let errorCode = res.data.code
        if (errorCode === 1000) {
          this[nextArrKey] = res.data.data || []
          if (this.form.areaName && this.areas.length === 0) {
            this.checkareas()
          }
          if (this.form.lbName && this.forestClasses.length === 0 && this.areas.length !== 0) {
            this.checkForestClasses()
          }
          if (this.form.lbName && this.regionArr.length === 0 && this.areas.length !== 0 && this.forestClasses !== 0) {
            this.checkRegionArr()
          }
        }
      })
    },
    checkRegionArr() {
      //   let regionArr = {}
      //   this.forestClasses.forEach(item => {
      //     if (item.lbName === this.form.lbName) {
      //       regionArr = item
      //     }
      //   })
      //   this.querySelector(regionArr, 'regionArr')
    },
    checkForestClasses() {
      let lbArr = {}
      this.areas.forEach(item => {
        if (item.pqName === this.form.areaName) {
          lbArr = item
        }
      })
      this.querySelector(lbArr, 'forestClasses')
    },
    checkareas() {
      let areaArr = {}
      this.forestries.forEach(item => {
        if (item.lcName === this.form.lcName) {
          areaArr = item
        }
      })
      this.querySelector(areaArr, 'areas')
    },
    doSave() {},
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
      let that = this
      var back = window.indexedDB.open('noReport')
      back.onerror = function (event) {
        console.log('数据库打开报错')
      }
      back.onsuccess = function (event) {
        console.log('数据库打开成功')
        var db = event.target.result
        if (db.objectStoreNames.length !== 0) {
          const id = Number(that.form.deleteId)
          console.log(that.form.deleteId)
          const backInfo = db.transaction(['noReport'], 'readwrite').objectStore('noReport').delete(id)
          backInfo.onsuccess = function () {
            console.log('删除暂存数据成功')
            that.back()
          }
          backInfo.onerror = function (err) {
            console.error(err)
          }
        }
      }
    },
    back() {
      this.$router.back()
    },
    doSubmit() {
      this.form.remake = '竹林APP发送'
      this.form.companyName = '广西竹林公司'
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
            console.log(res.data)
            if (res.data.errorCode === 0) {
              // this.diseasesArr = res.data.data.bill || []
              this.id = res.data.data.audit.ID || ''
              if (this.id) {
                this.postArea2()
                this.imgUrls.forEach(item => {
                  this.saveImg(item.url.replace(/com/, 'cn') + item.destination, item.destination)
                })
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
    this.getPersonalInfo()
    this.form = JSON.parse(JSON.stringify(this.$route.query || {}))
    console.log(this.form)
    this.areaId2 = this.form.areaNo
    if (this.form.type) {
      this.formSetProdurceValue(this.form.type)
      if (this.$route.query.typeName) {
        this.form.typeName = this.$route.query.typeName
      }
    }
    if (this.form.lbId) {
      setTimeout(this.selectRegion(this.form.lbId), 100)
    }
    this.querySelector({}, 'forestries')
    this.$title(this.$route.name)
  },
  created() {
    // console.log(1)
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
