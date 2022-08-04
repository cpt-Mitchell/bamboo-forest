<template>
  <div class="quality-data-write-detail" style="height: 100%;">
    <div>
      <van-row>
        <van-col span="24">
          <h3 class="header-title">1、基本信息</h3>
        </van-col>
      </van-row>
      <div>
        <van-cell-group>
          <van-field
            v-model="form.procedureName"
            class="no-disabled_bgcolor"
            label="作业工序"
            placeholder="作业工序未录入"
            disabled
          />
          <van-field
            v-model="form.lbName"
            class="no-disabled_bgcolor"
            label="林班名称"
            placeholder="林班名称未录入"
            disabled
          />
          <van-field
            v-model="form.orderNo"
            class="no-disabled_bgcolor"
            label="订单编号"
            placeholder="订单编号未录入"
            disabled
          />
          <van-field
            v-model="form.qyNo"
            class="no-disabled_bgcolor"
            label="区域编号"
            placeholder="订单编号未录入"
            disabled
          />
          <van-field
            v-model="form.tree"
            class="no-disabled_bgcolor"
            label="树种"
            placeholder="树种未录入"
            disabled
          />
          <van-field
            v-model="form.checkPersonnel"
            class="no-disabled_bgcolor"
            label="验收人员"
            placeholder="验收人员未录入"
            disabled
          />
          <van-field
            v-model="form.checkDate"
            class="no-disabled_bgcolor"
            label="验收日期"
            placeholder="验收人员未录入"
            disabled
          />
        </van-cell-group>
      </div>
      <date-picker
        :show="showDatePicker"
        type="date"
        @result="getDateResult"
        @close="datePickerClose"
      />
      <van-row>
        <van-col span="24">
          <h3 class="header-title">2、验收数据</h3>
        </van-col>
      </van-row>
      <div style="padding:15px 0;">
        <van-cell-group>
          <template v-for="(item,index) in form.checkTablesDtos">
            <template v-if="item.show">
              <!-- :class="[item.fieldDesc === '样点小区域个数(个)'? 'samll-area-detail-text' :'']" -->
              <van-field
                v-if="!item.dropdownSrc"
                :key="index"
                style="color:#333"
                v-model="item.readData"
                :label="item.fieldDesc"
                :disabled="item.gray"
                :placeholder="item.gray?'': '请输入内容'"
                :type="getInputType(item)"
              >
                <a
                  slot="button"
                  v-if="item.fieldDesc === '样点小区域个数(个)'"
                  style="font-size:.32rem;margin-left:10px;color:#0099ff;"
                  @click="showSmallAreaDialog()"
                >添加小区域明细</a>
              </van-field>
              <!---->
              <div class="van-cell van-field" style="color: rgb(51, 51, 51);" :key="index" v-else>
                <div class="van-cell__title">
                  <span>{{item.fieldDesc}}</span>
                </div>
                <div class="van-cell__value">
                  <div class="van-field__body">
                    <select
                      type="text"
                      class="van-field__control"
                      :disabled="item.gray"
                      v-model="item.readData"
                    >
                      <option :value="null" selected>请选择</option>
                      <option
                        v-for="(option,idx) in (item.dropdownSrc.split('|'))"
                        :key="idx"
                        :value="option"
                      >{{option}}</option>
                    </select>
                  </div>
                </div>
              </div>
            </template>
          </template>
        </van-cell-group>
      </div>
      <van-row>
        <van-col span="24">
          <h3 class="header-title">3、拍照</h3>
        </van-col>
      </van-row>
      <div style="padding:15px 15px 45px;position:relative;">
        <van-row style="margin-bottom:5px;">
          <van-col span="24" align="left">
            <van-button
              type="info"
              :loading="photo1Isloading"
              loading-text="上传中..."
              style="width:240px"
              @click="TakePhoto('photo1')"
            >验收样点分布图拍照上传</van-button>
            <!-- <input
              ref="photo1"
              class="upload-input"
              type="file"
              accept="image/*"
              capture="camera"
              @change="_onChange($event, 'photo1')"
            >-->
          </van-col>
        </van-row>
        <van-row class="upload-row" style="margin-bottom:5px;" v-show="form.photo1">
          <van-col span="24" align="left">
            <div class="uploaded-file-box">
              <a
                class="photo-name"
              >{{((form.photo1 || '').substr((form.photo1||'').lastIndexOf('/')+1)).split('.')[0]}}</a>
              <a
                class="photo-ext"
              >.{{((form.photo1 || '').substr((form.photo1||'').lastIndexOf('/')+1)).split('.')[1]}}</a>
            </div>
            <a class="photo-show" @click="showFile(photo1)">查看</a>
            <a class="upload-tip" ref="upload-tip-photo1"></a>
          </van-col>
        </van-row>
        <van-row style="margin-bottom:5px;">
          <van-col span="24" align="left">
            <van-button
              type="info"
              :loading="photo2Isloading"
              loading-text="上传中..."
              style="width:240px"
              @click="TakePhoto('photo2')"
            >验收人现场自拍照上传
              <!-- <input
                class="upload-input"
                type="file"
                accept="image/*"
                capture="camera"
                @change="_onChange($event, 'photo2')"
              >-->
            </van-button>
          </van-col>
        </van-row>
        <van-row class="upload-row" style="margin-bottom:5px;" v-show="form.photo2">
          <van-col span="24" align="left">
            <div class="uploaded-file-box">
              <a
                class="photo-name"
              >{{((form.photo2 || '').substr((form.photo2||'').lastIndexOf('/')+1)).split('.')[0]}}</a>
              <a
                class="photo-ext"
              >.{{((form.photo2 || '').substr((form.photo2||'').lastIndexOf('/')+1)).split('.')[1]}}</a>
            </div>
            <a class="photo-show" @click="showFile(photo2)">查看</a>
            <a class="upload-tip" ref="upload-tip-photo2"></a>
          </van-col>
        </van-row>
        <van-row style="margin-bottom:5px;">
          <van-col span="24" align="left">
            <van-button
              type="info"
              :loading="photo3Isloading"
              loading-text="上传中..."
              style="width:240px"
              @click="TakePhoto('photo3')"
            >验收记录表拍照上传
              <!-- <input
                class="upload-input"
                type="file"
                accept="image/*"
                capture="camera"
                @change="_onChange($event, 'photo3')"
              >-->
            </van-button>
          </van-col>
        </van-row>
        <van-row class="upload-row" style="margin-bottom:5px;" v-show="form.photo3">
          <van-col span="24" align="left">
            <div class="uploaded-file-box">
              <a
                class="photo-name"
              >{{((form.photo3 || '').substr((form.photo3||'').lastIndexOf('/')+1)).split('.')[0]}}</a>
              <a
                class="photo-ext"
              >.{{((form.photo3 || '').substr((form.photo3||'').lastIndexOf('/')+1)).split('.')[1]}}</a>
            </div>
            <a class="photo-show" @click="showFile(photo3)">查看</a>
            <a class="upload-tip" ref="upload-tip-photo3"></a>
          </van-col>
        </van-row>
      </div>
    </div>
    <van-popup v-model="showSmallArea" position="right" :overlay="false">
      <small-area-dialog
        :title="form.checkItem"
        :data="form"
        :display="showSmallArea"
        @close="closeSmallArea"
        @result="getCalcResult"
      ></small-area-dialog>
    </van-popup>
    <footbar>
      <van-row>
        <van-col span="12">
          <van-button
            @click="calc()"
            :disabled="photo1Isloading || photo2Isloading || photo3Isloading"
            style="width:100%;height:40px;"
            type="warning"
          >运算</van-button>
        </van-col>
        <van-col span="12">
          <van-button
            @click="submit()"
            :disabled="photo1Isloading || photo2Isloading || photo3Isloading || !calcFlag"
            style="width:100%;height:40px;"
            type="primary"
          >提交</van-button>
        </van-col>
      </van-row>
    </footbar>
  </div>
</template>

<script>
import Footbar from '@/components/Footbar'
import DatePicker from '@/components/DatePicker'
import SmallAreaDialog from '../components/small-area-dialog'
import request from '@/utils/httpUtil'
import { parseTime } from '@/utils/index'
import { API } from '@/api'
import { TakePhoto } from '@/plugins/cordovaplugin'
import { ImagePreview } from 'vant'

export default {
  data() {
    return {
      currentClickDateName: '',
      showDatePicker: false,
      form: {},
      photo1: '',
      photo2: '',
      photo3: '',
      photo1Isloading: false, // photo1
      photo2Isloading: false,
      photo3Isloading: false,
      showSmallArea: false,
      calcFlag: false,
      requireRule: [{
        validate: val => !!val,
        message: ' '
      }]
    }
  },
  methods: {
    TakePhoto(key) {
      TakePhoto((file) => {
        this._onChange(file, key)
      }, (e) => {
      })
    },
    showSmallAreaDialog() {
      this.showSmallArea = true
    },
    datePickerClose() {
      this.currentClickDateName = ''
      this.showDatePicker = false
    },
    datePickerShow(key) {
      this.currentClickDateName = key
      this.showDatePicker = true
    },
    getDateResult(val) {
      this.showDatePicker = false
      this.form[this.currentClickDateName] = parseTime(val, '{y}-{m}-{d}')
      this.currentClickDateName = ''
    },
    getInputType(formItem) {
      let type = 'text'
      switch (formItem.fieldType) {
        case 'nuber': type = 'number'; break
        case 'numberDecimal': type = 'number'; break
      }
      return type
    },
    showFile(link = '') {
      ImagePreview([link])
    },
    _onChange: function (file, key) {
      this[key] = file.name
      this.uploadImage(file.base64, key)
    },
    uploadImage(file, key) {
      const uploadReqeust = (params, cb) => {
        request.post(API.DINGTALK_BASE64FILEUPLOAD, params).then(res => {
          cb && cb(res)
          this[key + 'Isloading'] = false
        }).catch(err => {
          this[key + 'Isloading'] = false
          dAlert('上传异常!')
        })
      }

      // let formData = new FormData()
      // formData.append('file', file)
      this[key + 'Isloading'] = true
      this.$refs['upload-tip-' + key].className = 'upload-tip'
      this.$refs['upload-tip-' + key].innerText = '正在上传...'
      uploadReqeust({ base64: file }, (res) => {
        let errorCode = res.data.errorCode,
          text = '上传失败!'
        if (errorCode) {
          let name = (res.data.data.destination || '')
          // this.photoPreffix = res.data.data.url
          // this[key] = {
          //   link: res.data.data.url + name,
          //   name
          // }
          this[key] = res.data.data.url + name
          this.form[key] = name
          this.$refs['upload-tip-' + key].className += ' success'
          text = '上传成功!'
        } else {
          if (!errorCode) this.$refs['upload-tip-' + key].className += ' error'
        }
        this.$refs['upload-tip-' + key].innerText = text
      })
    },
    closeSmallArea() {
      this.showSmallArea = false
    },
    calc() {
      this.$loadingState(true, '正在计算')
      let params = this.form
      request.post(API.DINGTALK_QUALITY_VERIFY_PEDDING_TABLE_CALCULATE, params).then(res => {
        this.$loadingState(false)
        if (res.data.errorCode) {
          this.form = res.data.data
          this.calcFlag = true
        } else {
          thsi.calcFlag = false
        }
      }).catch(err => this.$loadingState(false))
    },
    getCalcResult(data) {
      this.form = data
      this.showSmallArea = false
    },
    getTableDetail() {
      this.$loadingState(true, '数据加载中')
      request.get(API.DINGTALK_QUALITY_VERIFY_PEDDING_TABLE_DETAIL + this.$route.params.id).then(res => {
        this.$loadingState(false)
        let data = res.data.data,
          errorCode = res.data.errorCode
        if (errorCode) {
          this.form = data
        } else {
          dAlert(res.data.msg || '数据查询出错了！')
        }
      }).catch(err => this.$loadingState(false))
    },
    submit() {
      if (!this.form.checkDate) {
        dAlert('请选择验收日期！')
        return
      }
      dConfirm(`确认提交?`, () => {
        this.loadingText = '数据提交中...'
        this.$loadingState(false)
        this.form.status = 2
        request.post(API.DINGTALK_QUALITY_VERIFY_SAVE, this.form).then(res => {
          this.$loadingState(false)
          this.$dAlert(res.data.msg, () => {
            if (res.data.code === '1000') {
              this.$router.back()
            }
          })
        }).catch(err => (this.$loadingState(false)))
      })
    }
  },
  components: {
    Footbar,
    SmallAreaDialog,
    DatePicker
  },
  mounted() {
    this.getTableDetail()
  }
}
</script>

<style lang="less">
.quality-data-write-detail {
  .van-field .van-cell__title {
    max-width: 150px;
    font-size: 0.36rem;
  }
  .van-field__body {
    font-size: 0.36rem;
  }
  .samll-area-detail-text {
    width: 60px;
    .mu-text-field-input {
      text-align: center;
    }
  }
  .mu-form-item-label {
    line-height: 20px;
    font-size: 15px;
    padding-top: 10px;
  }

  .mu-input-content {
    height: 40px;
  }

  .label-text {
    color: rgba(0, 0, 0, 0.54);
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
}
</style>
