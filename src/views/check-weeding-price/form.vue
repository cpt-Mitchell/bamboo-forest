<template>
  <div class="weed-form-container">
    <div style="padding:0 10px;">
      <van-cell-group>
        <van-field
          v-model="fieldValue"
          is-link
          readonly
          label="林班名称"
          placeholder="请选择林班名称"
          @click="show = true"
        />
        <van-popup v-model="show" round position="bottom">
          <van-cascader
            v-model="cascaderValue"
            title="请选择林班名称"
            :options="options"
            @close="show = false"
            @change="onChange"
            @finish="onFinish"
          />
        </van-popup>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>树种名称</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select type="text" class="van-field__control" v-model="form.SzMc">
                <option value selected>请选择树种</option>
                <option v-for="(treeeName, index) in SzMcs" :key="index" :value="treeeName">{{ treeeName }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>种植年度</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select type="text" class="van-field__control" v-model="form.ZzNd">
                <option value selected>请选择种植年度</option>
                <option v-for="(ZzNd, index) in ZzNds" :key="index" :value="ZzNd">{{ ZzNd }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>萌芽年度</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select type="text" class="van-field__control" v-model="form.MyNd">
                <option value selected>请选择萌芽年度</option>
                <option v-for="(MyNd, index) in ZzNds" :key="index" :value="MyNd">{{ MyNd }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>抚育次数</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select type="text" class="van-field__control" v-model="form.FyCs">
                <option value selected>请选择抚育次数</option>
                <option v-for="item in 9" :key="item" :value="item">{{ item }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>作业方式</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select type="text" class="van-field__control" v-model="form.WorkMode">
                <option value selected>请选择作业方式</option>
                <option v-for="(WorkModeName, index) in WorkModes" :key="index" :value="WorkModeName">{{
                  WorkModeName
                }}</option>
              </select>
            </div>
          </div>
        </div>
        <van-field v-model="form.JhZyMj" type="number" placeholder="请输入计划作业面积" label="计划作业面积" />

        <van-field
          class="no-disabled_bgcolor"
          v-model="form.PlanStartDate"
          @click.native="datePickerShow('PlanStartDate')"
          label="计划开工日期"
          placeholder="点击选择日期"
          disabled
        />
        <van-field
          class="no-disabled_bgcolor"
          v-model="form.PlanFinishDate"
          @click.native="datePickerShow('PlanFinishDate')"
          label="计划完工日期"
          placeholder="点击选择日期"
          disabled
        />

        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>除草方法</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select type="text" class="van-field__control" v-model="form.WeedMethod">
                <option value selected>请选择除草方法</option>
                <option v-for="(WeedMethodName, index) in WeedMethods" :key="index" :value="WeedMethodName">{{
                  WeedMethodName
                }}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>组织核价类别</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select type="text" class="van-field__control" v-model="form.CheckPriceType">
                <option value selected>请选择组织核价类别</option>
                <option
                  v-for="(CheckPriceTypeName, index) in CheckPriceTypes"
                  :key="index"
                  :value="CheckPriceTypeName"
                  >{{ CheckPriceTypeName }}</option
                >
              </select>
            </div>
          </div>
        </div>

        <van-field
          class="no-disabled_bgcolor"
          v-model="form.CheckPriceFinishDate"
          @click.native="datePickerShow('CheckPriceFinishDate')"
          label="要求核价完成时间"
          placeholder="点击选择日期"
          disabled
        />
        <van-field v-model="form.TreeHeight" type="number" label="目估平均树高" placeholder="请输入树高" />

        <div class="van-cell van-field" style="color: rgb(51, 51, 51);padding-bottom:50px">
          <div class="van-cell__title" style="width: 100%">
            <span>主要草类、所占比例、覆盖度及杂草高度</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <van-field
                type="textarea"
                autosize
                v-model="form.MainGrassType"
                placeholder="主要草类、所占比例、覆盖度及杂草高度"
              />
            </div>
          </div>
        </div>
      </van-cell-group>
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
import request from '@/utils/httpUtil'
import DatePicker from '@/components/DatePicker'
import { parseTime } from '@/utils/index'
import { API } from '@/api'
export default {
  data() {
    let years = []
    let start = 1990
    let end = new Date().getFullYear()
    for (let i = end; i >= start; i--) {
      if (i === start) {
        years.push(i + '年前')
      } else {
        years.push(`${i - 1}/${i}`)
      }
    }
    return {
      showDatePicker: false,
      show: false,
      fieldValue: '',
      cascaderValue: '',
      options: [],
      form: {
        LbID: '',
        SzMc: '',
        ZzNd: '',
        MyNd: '',
        FyCs: '',
        WorkMode: '',
        JhZyMj: '',
        PlanStartDate: '',
        PlanFinishDate: '',
        WeedMethod: '',
        CheckPriceType: '',
        CheckPriceFinishDate: '',
        TreeHeight: '',
        MainGrassType: ''
      },
      currPickerKey: '',
      SzMcs: ['桉树', '竹子', '松树', '荷木', '杉树', '西南桦', '阔叶树', '竹子苗圃', '其他树种'],
      ZzNds: years,
      WorkModes: [
        '喷除草剂',
        '喷除草剂（人工）',
        '喷除草剂（机械）',
        '全砍',
        '全砍（人工）',
        '全砍（机械）',
        '幼林保除草',
        '铲光除草',
        '带状除草',
        '带状砍草',
        '全挖丛生草砍杂',
        '带挖丛生草砍杂',
        '喷除草剂（药费）',
        '喷除草剂（作业单价）',
        '砍杂草杂灌',
        '挖草根砍杂',
        '带状砍草（新）'
      ],
      WeedMethods: ['人工', '机械'],
      CheckPriceTypes: ['劳务组织核价', '林场自行核价']
    }
  },
  methods: {
    onChange({ value, selectedOptions, tabIndex }) {
      console.log(value, selectedOptions, tabIndex)
      const params = {
        formid: '_',
        apvResult: '同意',
        module: '林场工作计划',
        payload: {}
      }
      if (tabIndex === 0) {
        params.task = '片区联动查询'
        params.payload.name = selectedOptions[tabIndex].text
      } else if (tabIndex === 1) {
        params.task = '林班联动查询'
        params.payload.name = selectedOptions[tabIndex].text
      }
      this.$loadingState(true, '数据加载中')
      request
        .post(API.APP_COMMON_TRANSACTION_SUBMIT, params)
        .then(res => {
          this.$loadingState(false)
          if (res.data.errorCode === 0) {
            if (tabIndex === 0) {
              // selectedOptions.children = res.data.data.lc
              let lcObj = this.options.find(it => it.value === value)
              if (lcObj) {
                lcObj.children = (res.data.data.lc || []).map(it => ({
                  text: it['片区名称'],
                  value: it['ID'],
                  children: []
                }))
                console.log(this.options)
              }
            } else if (tabIndex === 1) {
              let lcObj = this.options.find(it => it.value === selectedOptions[0].value)
              if (lcObj) {
                let pqObj = lcObj.children.find(item => item.value === value)
                if (pqObj) {
                  pqObj.children = (res.data.data.lc || []).map(it => ({
                    text: it['林班名称'],
                    value: it['ID']
                  }))
                }
              }
            }
          }
        })
        .catch(err => this.$loadingState(false))
    },
    onFinish({ selectedOptions }) {
      this.show = false
      // this.fieldValue = selectedOptions.map(option => option.text).join('/')
      this.fieldValue = selectedOptions[selectedOptions.length - 1].text
      this.form.LbID = selectedOptions[selectedOptions.length - 1].value
    },
    getAllLC() {
      this.$loadingState(true, '数据加载中')
      let params = {
        formid: '_',
        apvResult: '同意',
        module: '林场工作计划',
        task: '林场联动查询',
        payload: {
          keyword: ''
        }
      }
      request
        .post(API.APP_COMMON_TRANSACTION_SUBMIT, params)
        .then(resp => {
          this.$loadingState(false)
          if (resp.data.errorCode === 0) {
            this.options = (resp.data.data.lc || []).map(it => ({
              text: it['林场名称'],
              value: it['ID'],
              children: []
            }))
            console.log(this.options)
          } else {
            this.options = []
          }
        })
        .catch(err => this.$loadingState(false))
    },
    datePickerClose() {
      this.showDatePicker = false
      this.currPickerKey = ''
    },
    datePickerShow(key) {
      this.showDatePicker = true
      this.currPickerKey = key
    },
    getDateResult(val) {
      this.showDatePicker = false
      this.form[this.currPickerKey] = parseTime(val, '{y}-{m}-{d}')
      this.$nextTick(() => {
        this.currPickerKey = ''
      })
    },
    checkInput() {
      let desc = {
        LbID: '林班名称',
        SzMc: '树种名称',
        ZzNd: '种植年度',
        MyNd: '萌芽年度',
        FyCs: '抚育次数',
        WorkMode: '作业方式',
        JhZyMj: '计划作业面积',
        PlanStartDate: '计划开工日期',
        PlanFinishDate: '计划完工日期',
        WeedMethod: '除草方法',
        CheckPriceType: '组织核价类别',
        CheckPriceFinishDate: '要求核价完成时间',
        TreeHeight: '目估平均树高',
        MainGrassType: '主要草类、所占比例、覆盖度及杂草高度'
      }
      let result = true
      for (let key in this.form) {
        if ((this.form[key] + '').length === 0) {
          result = false
          this.$dAlert(desc[key] + '不能为空')
          return result
        }
      }
      return result
    },
    doSubmit() {
      if (!this.checkInput()) {
        return false
      }
      this.$dConfirm('确定提交表单内容吗？', () => {
        this.$loadingState(true, '数据提交中')
        let params = {
          formid: 0,
          apvResult: '同意',
          module: '林班除草核价计划录入',
          task: '林班除草核价计划录入',
          payload: this.form
        }
        request
          .post(API.APP_COMMON_TRANSACTION_SUBMIT, params)
          .then(res => {
            this.$loadingState(false)
            this.$dAlert(res.data.msg || '', () => {
              if (res.data.errorCode === 0) {
                this.$router.back()
              }
            })
          })
          .catch(err => {})
      })
    }
  },
  components: {
    Footbar,
    DatePicker
  },
  mounted() {
    this.getAllLC()
    this.$title('验收区域申请表')
  }
}
</script>

<style lang="less">
.weed-form-container {
  .van-field .van-cell__title,
  .van-cell__title.van-field__label {
    width: 110px;
  }
  .van-field__body {
    .van-cell {
      padding: 0;
    }
    .van-cell__value {
      padding-left: 0;
    }
  }
}
</style>
