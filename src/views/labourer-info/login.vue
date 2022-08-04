<template>
  <div class="labourer-login">
    <div class="card card-part">
      <van-cell-group>
        <van-field
          label-align="right"
          class="no-disabled_bgcolor"
          v-model="form.name"
          label="姓名："
          placeholder="请输入姓名"
          disabled
          @click="TakePhoto()"
        />
        <van-field
          label-align="right"
          class="no-disabled_bgcolor"
          v-model="form.idNo"
          label="身份证号码："
          placeholder="请输入身份证号码"
          @blur="idNoValid"
          @click="TakePhoto()"
          disabled
        />
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title van-field__label van-field__label--right">
            <span>年度：</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select type="text" class="van-field__control" v-model="form.year">
                <option value selected>请选择年度</option>
                <option v-for="(option, index) in yearOptions" :key="index" :value="option.value">{{
                  option.label
                }}</option>
              </select>
            </div>
          </div>
        </div>
        <div style="text-align:center;margin-top:40px;">
          <van-button style="width:60%;" type="info" @click="submit">查询</van-button>
        </div>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import request from '@/utils/httpUtil'
import { API } from '@/api'
import { TakePhoto } from '@/plugins/cordovaplugin'
export default {
  data() {
    return {
      form: {
        name: '廖老加',
        idNo: '452228197106023513',
        year: '2020/2021'
      },
      yearOptions: []
    }
  },
  methods: {
    yearOptionsGenerate() {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let arr = []
      this.form.year = month > 6 ? year + '/' + (year + 1) : year - 1 + '/' + year
      for (let _year = year - 8; _year < year + 2; _year++) {
        arr.push({
          label: _year + '/' + (_year + 1),
          value: _year + '/' + (_year + 1)
        })
        this.yearOptions = arr
      }
    },
    idNoValid() {
      if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.form.idNo)) {
        this.$dAlert('请输入正确的身份证号码')
        return false
      }
      return true
    },
    TakePhoto() {
      TakePhoto(
        file => {
          this._onChange(file)
        },
        e => {}
      )
    },
    _onChange: function(file) {
      function dataURLtoFile(dataurl) {
        var arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new Blob([u8arr], { type: mime })
      }
      this.uploadImage(dataURLtoFile('data:image/jpg;base64,' + file.base64))
    },
    uploadImage(file) {
      const uploadReqeust = (params, cb) => {
        request
          .post(API.DINGTALK_RECOGNITION, params)
          .then(res => {
            cb && cb(res)
          })
          .catch(err => {
            dAlert('上传异常!')
          })
      }
      let formData = new FormData()
      formData.append('file', file)
      uploadReqeust(formData, res => {
        let data = res.data.data
        if (res.data.success) {
          this.form.name = data.name || ''
          this.form.idNo = data.nid || ''
        } else {
          this.$dAlert(res.data.msg || '身份证识别失败')
        }
      })
    },
    submit() {
      if (!this.form.name) {
        this.$dAlert('姓名不能为空')
        return false
      }
      if (this.idNoValid() !== true) {
        this.$dAlert('身份证号码不正确')
        return false
      }
      if (!this.form.year) {
        this.$dAlert('请输入选择年度')
        return false
      }
      let params = {
        formid: '_',
        apvResult: '同意',
        module: '民工信息查询',
        task: '主体列表',
        payload: {
          name: this.form.name,
          idNumber: this.form.idNo,
          year: this.form.year
        }
      }
      this.$loadingState(true, '数据提交中')
      request
        .post(API.APP_COMMON_TRANSACTION_SUBMIT, params)
        .then(res => {
          this.$loadingState(false)
          let data = res.data || {}
          if (data.errorCode !== 0) {
            this.$dAlert(data.msg || '')
            return false
          }
          let result = data.data.data
          if (result) {
            // debugger
            this.$dAlert(`您的保单号为:[${result.保险单号}]`)
            // this.$router.push({ path: '/labourer/details', query: { id: result.ID } })
          } else {
            this.$dAlert('未查询到民工保单号')
          }
        })
        .catch(err => this.$loadingState(false))
    }
  },
  mounted() {
    this.yearOptionsGenerate()
  }
}
</script>

<style lang="less">
.labourer-login {
  .van-field__label--right {
    padding-right: 0;
  }
  .van-field .van-cell__title {
    width: 96px;
    max-width: 115px;
  }
  [class*='van-hairline']::after {
    border: none;
  }
}
</style>
