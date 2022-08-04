<!-- 调整作业进度汇报人 -->
<template>
  <div class="interview-box">
    <div style="padding:0 10px;">
      <van-cell-group>
        <van-field
          class="no-disabled_bgcolor"
          v-model="form.no"
          label="编号"
          placeholder="自动加载"
          disabled
        />
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>拍照</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <van-button
                type="info"
                :loading="$store.state.photoLoading"
                loading-text="上传中..."
                size="small"
                style="width:140px"
                @click="TakePhoto('photo')"
              >民工拍照</van-button>
            </div>
          </div>
        </div>
      </van-cell-group>
      <van-image style="padding:10px 20px;" src="https://img.yzcdn.cn/vant/cat.jpeg"/>
    </div>
    <footbar>
      <van-col span="24">
        <van-button @click="doSubmit()" style="width:100%;height:40px;" type="primary">提交</van-button>
      </van-col>
    </footbar>
  </div>
</template>

<script>
import Footbar from '@/components/Footbar'
import request from '@/utils/httpUtil'
import { API } from '@/api'
import { TakePhoto } from '@/plugins/cordovaplugin'
export default {
  data() {
    return {
      photoLoading: false,
      form: {
        no: null,
        photo: null
      }
    }
  },
  methods: {
    TakePhoto(key) {
      TakePhoto((file) => {
        this._onChange(file, key)
      }, (e) => {
      })
    },
    _onChange: function (file, key) {
      this.uploadImage(file.base64, key)
    },
    uploadImage(file, key) {
      const uploadReqeust = (params, cb) => {
        request.post(API.DINGTALK_BASE64FILEUPLOAD, params).then(res => {
          this.$loadingState(false)
          cb && cb(res)
          this[key + 'Loading'] = false
        }).catch(err => {
          this.$loadingState(false)
          this[key + 'Loading'] = false
          dAlert('上传异常!')
        })
      }
      this[key + 'Loading'] = true
      this.$loadingState(true, '正在上传...')
      uploadReqeust({ base64: file }, (res) => {
        let errorCode = res.data.errorCode,
          text = '上传失败!'
        if (errorCode) {
          let name = (res.data.data.destination || '')
          // this[key] = res.data.data.url + name
          this[key] = res.data.data
          this.form[key] = name
          text = '上传成功!'
        }
        this.$dAlert(text)
      })
    },
    doSubmit() {
      this.$dConfirm('确定提交表单内容吗？', () => {
        this.$loadingState(true, '数据提交中')
        request
          .post(API.FOREST_JOB_REPORTER_SAVE, this.form)
          .then(res => {
            let errorCode = res.data.code
            this.$loadingState(false)
            dAlert(res.data.msg, () => {
              if (errorCode === '1000') {
                this.$router.back()
              }
            })
          })
          .catch(err => this.$loadingState(false))
      })
    }
  },
  components: {
    Footbar
  },
  mounted() {
    this.$title(this.$route.meta.title)
  }
}
</script>

<style lang="less">
.interview-box {
  .van-field .van-cell__title {
    max-width: 100px;
    input[type='number'] {
      font-size: 0.32rem;
    }
  }
}
</style>
