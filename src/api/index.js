export const DINTALK_API = true
export const CORP_ID = 'dingc44594930dc9ab4635c2f4657eb6378f'
export const API = {
  DINGTALK_JSAPI: 'dingtalk/jsApi/getJsApiConf', // 鉴权
  APP_COMMON_TRANSACTION_SUBMIT: 'dingtalk/oa/common/transaction/submit', // app公共查询\提交接口，交由后端处理业务

  DINGTALK_USERID: 'dingtalk/user/getUserId',
  DINGTALK_USERINFO: 'dingtalk/user/getUserInfo',
  HWAGAIN_LOGIN: 'auth/auth/login',
  HWAGAIN_UPDATE_PWD: 'auth/auth/updatePassword',
  DINGTALK_CAPTCHA_IMG: '/sso-api/captcha/img',
  DINGTALK_GET_SMS_CODE: '/sso-api/captcha/mobile',
  DINGTALK_RESETPWD_BY_PHONE: '/sso-api/sys/org/resetPasswordByPhone',
  DINGTALK_DEPARTMENT_POSITION: 'dingtalk/common/position', // 职位/部门选择器接口
  DINGTALK_DEPARTMENT_EMPLOYEE: 'dingtalk/common/employee/', // 人员选择器接口：获取下属部门以及员工：第一个参数 部门的fdId 第二个参数是部门的deptId
  DINGTALK_DEPARTMENT_WORKER: 'dingtalk/common/worker/', // 人员选择器查岗位工
  DINGTALK_FIND_USER_BY_CODE: 'dingtalk/common/person/detail/', // 根据员工号查找员工详情
  DINGTALK_FILEUPLOAD: 'dingtalk/common/fileupload', // 上传文件
  DINGTALK_BASE64FILEUPLOAD: 'dingtalk/common/base64upload', // 上传文件base64
  DINGTALK_RECOGNITION: '/eagle/upload/singlefile?type=IDCARD', // 鹰眼身份证识别

  DINGTALK_PERSONAL_INFO: 'dingtalk/common/person/detail', // 根据员工ID查询信息

  DINGTALK_PERSONALMSG: 'dingtalk/notic/sendPersonalNotic',
  DINGTALK_MSGPROGRESS: 'dingtalk/msg/getNoticProgress',

  DINGTALK_MICROAPP: 'dingtalk/micro/listMicroapp',

  // 出差定位
  DINGTALK_ERRAND_ADDLOCATE: 'dingtalk/errand/addLocation',
  DINGTALK_ERRAND_GETCURRENT: 'dingtalk/errand/getCurrentErrand',
  DINGTALK_ERRAND_GETNODES: 'dingtalk/errand/getNodes',
  DINGTALK_ERRAND_GETRECENT: 'dingtalk/errand/getRecent',
  DINGTALK_ERRAND_GETVISITLIST: 'dingtalk/errand/getVisitList',

  DINGTALK_DUTY_SUBMITDUTY: 'dingtalk/onDuty/toAndFromWork', // 上下班考勤
  DINGTALK_DUTY_SUBMITEXCEPTIONDUTY: 'dingtalk/onDuty/exceptionApply', // 上下班考勤异常申请
  DINGTALK_DUTY_APPLYDUTY: 'dingtalk/onDuty/onDutyApply', //  值班申请
  DINGTALK_DUTY_FINDONEDUTY: 'dingtalk/onDuty/findOnDutyOne', // 根据ID获取我的值班申请
  DINGTALK_DUTY_FINDLISTDUTY: 'dingtalk/onDuty/findOnDutyList', // 我的值班申请列表
  DINGTALK_DUTY_UPDATEDUTY: 'dingtalk/onDuty/changeOnDutyApply', // 修改我的值班申请
  DINGTALK_DUTY_CANCELDUTY: 'dingtalk/onDuty/removeOnDutyApply', // 取消我的值班申请

  DINGTALK_DUTY_SUBMITOFFDUTY: 'dingtalk/onDuty/offDutyApply', // 休班申请
  DINGTALK_DUTY_CANRESTDAYS: 'dingtalk/onDuty/getCanRestDutyDays', // 获取可休班天数
  DINGTALK_DUTY_FINDOFFONEDUTY: 'dingtalk/onDuty/findOffDutyOne', // 根据ID获取我的休班申请
  DINGTALK_DUTY_FINDOFFLISTDUTY: 'dingtalk/onDuty/findOffDutyList', // 我的休班申请列表
  DINGTALK_DUTY_UPDATEOFFDUTY: 'dingtalk/onDuty/changeOffDutyApply', // 修改我的休班申请
  DINGTALK_DUTY_CANCELOFFDUTY: 'dingtalk/onDuty/removeOffDutyApply', // 取消我的休班申请

  DINGTALK_DUTY_SUBMITLEAVEDUTY: 'dingtalk/onDuty/askForLeaveApply', // 请假申请
  DINGTALK_DUTY_FINDLEAVEONEDUTY: 'dingtalk/onDuty/findAskForLeaveOne', // 根据ID获取我的请假申请
  DINGTALK_DUTY_FINDLEAVELISTDUTY: 'dingtalk/onDuty/findAskForLeaveList', // 获取我的请假申请列表
  DINGTALK_DUTY_UPDATELEAVEDUTY: 'dingtalk/onDuty/changeAskForLeaveApply', // 修改请假天数
  DINGTALK_DUTY_CANCELLEAVEDUTY: 'dingtalk/onDuty/removeAskForLeaveApply', // 取消请假天数

  DINGTALK_DUTY_COOKONDUTYADD: 'dingtalk/onDuty/cookerGotoWorkAdd', // 炊事员上下班打卡
  DINGTALK_DUTY_COOKCHECKINADD: 'dingtalk/onDuty/cookerRestAdd', // 炊事员休息登记(有参数)/ 查询炊事员今天打卡记录

  DINGTALK_FOREST_GETCURRENT: 'dingtalk/fieldwork/forest/getCurrent', // 获取当前用户林班工作历史
  DINGTALK_FOREST_GETRECORD: 'dingtalk/fieldwork/forest/record/', // 通过ID获取林班详情
  DINGTALK_FOREST_ENTERORLEAVE: 'dingtalk/fieldwork/forest/enterOrLeave', // 巡山 进入 离开
  DINGTALK_FOREST_GETUSERINFO: 'dingtalk/forestry/userinfo', // 野外工作获取个人信息

  DINGTALK_PATROL_PADDINGMANAGEMENT: 'dingtalk/patrol/pendingManagement', // 协管历史
  DINGTALK_PATROL_ENTERORLEAVE: 'dingtalk/patrol/enterOrLeave', // 巡山 进入 离开
  DINGTALK_PATROL_ENTERRECORD: 'dingtalk/patrol/record/', // 巡山 进入 离开
  DINGTALK_PATROL_GETCURRENT: 'dingtalk/patrol/getCurrent', // 获取当前用户林班工作历史
  DINGTALK_PATROL_ADDITION: 'dingtalk/patrol/addition', // 获取下属护林员，协管的内容
  DINGTALK_PATROL_ADDPATROL: 'dingtalk/patrol/addManagement', // 协管开始保存
  DINGTALK_PATROL_FINISHPATROL: 'dingtalk/patrol/finishManagement', // 协管结束保存

  DINGTALK_FOREST_PADDINGLIST: 'dingtalk/forestry/position/pendingList', // 待定位的列表
  DINGTALK_FOREST_ADDLOCATION: 'dingtalk/forestry/position/addLocation', // 定位操作

  DINGTALK_FOREST_NIGHTTODOLIST: 'dingtalk/fieldwork/night/getPendingHistory', // 夜间出发获取历史未完成列表
  DINGTALK_FOREST_NIGHTDETAIL: 'dingtalk/fieldwork/night/current/', // 夜间出发详情

  DINGTALK_FOREST_NIGHTSETOUT: 'dingtalk/fieldwork/night/setOut', // 夜间出发
  DINGTALK_FOREST_NIGHTJOBLIST: 'dingtalk/fieldwork/night/getJobContent',
  DINGTALK_FOREST_NIGHTWORKTYPE: 'dingtalk/fieldwork/night/getWorkType', // 获取工作类型
  DINGTALK_FOREST_NIGHTSAVE: 'dingtalk/fieldwork/night/saveRecord', // 工作保存工作记录
  DINGTALK_FOREST_AUDITLIST: 'dingtalk/forestry/auditList', // 审核审批列表

  // 竹林审核审批详情
  DINGTALK_APPROVE_NIGHT_DETAIL: 'dingtalk/fieldwork/night/detail/',
  DINGTALK_APPROVE_PATROL_DETAIL: 'dingtalk/patrol/detail/',
  DINGTALK_APPROVE_LEAVE_DETAIL: 'dingtalk/onDuty/leave/detail/',
  DINGTALK_APPROVE_OFFDUTY_DETAIL: 'dingtalk/onDuty/offDuty/detail/',
  DINGTALK_APPROVE_SIGNIN_DETAIL: 'dingtalk/onDuty/signIn/detail/',
  DINGTALK_APPROVE_FOREST_DETAIL: 'dingtalk/fieldwork/forest/detail/',
  DINGTALK_APPROVE_MANAGE_DETAIL: 'dingtalk/patrol/manage/detail/',

  // 竹林审核审批提交
  DINGTALK_APPROVE_OFFDUTY_VERIFY: 'dingtalk/onDuty/offDuty/verify', // 休班审核提交
  DINGTALK_APPROVE_SIGNIN_VERIFY: 'dingtalk/onDuty/signIn/verify', // 上下班异常报到审核提交
  DINGTALK_APPROVE_LEAVE_VERIFY: 'dingtalk/onDuty/leave/verify', // 请假审核提交
  DINGTALK_APPROVE_PATROL_VERIFY: 'dingtalk/patrol/verify', // 巡山异常审核提交
  DINGTALK_APPROVE_NIGHT_VERIFY: 'dingtalk/fieldwork/night/verify', // 夜间工作审核提交
  DINGTALK_APPROVE_FOREST_VERIFY: 'dingtalk/fieldwork/forest/verify', // 林地工作审核提交
  DINGTALK_APPROVE_MANAGE_VERIFY: 'dingtalk/patrol/manage/verify', // 协管记录详细审核提交
  DINGTALK_APPROVE_OFFDUTY_AUDIT: 'dingtalk/onDuty/offDuty/audit', // 休班审批提交
  DINGTALK_APPROVE_LEAVE_AUDIT: 'dingtalk/onDuty/leave/audit', // 请假审批提交

  // 产品设计图案
  // DINGTALK_PRODUCT_DESIGN_AUTHORIZATION: 'dingtalk/design_pattern/authorization', // 当前审批列表
  // DINGTALK_PRODUCT_DESIGN_CURRENTLIST: 'dingtalk/design_pattern/current', // 当前审批列表
  // DINGTALK_PRODUCT_DESIGN_HISTORYLIST: 'dingtalk/design_pattern/history', // 当前审批列表
  // DINGTALK_PRODUCT_DESIGN_FINISHLIST: 'dingtalk/design_pattern/finish', // 当前审批列表
  // DINGTALK_PRODUCT_DESIGN_AUDIT: 'dingtalk/design_pattern/audit', // 审批
  // DINGTALK_PRODUCT_DESIGN_CURRENT_FINISH: 'dingtalk/design_pattern/currentFinish', // 审批

  FOREST_INFORMATION: 'dingtalk/forestry/information', // 系统消息

  // 作业质量验收
  DINGTALK_QUALITY_QUERY: 'forestry/quality/query', // 验收区域申请表级联查询
  DINGTALK_QUALITY_VERIFIERS: 'forestry/quality/verifiers/', // 查询验收申请人列表
  // DINGTALK_QUALITY_SAVE: 'forestry/quality/save', // 提交区域申请表

  // DINGTALK_QUALITY_VERIFY_LIST: 'forestry/quality/verify/list', // 获取区域审核列表
  DINGTALK_QUALITY_VERIFY_SAVE: 'forestry/quality/save', // 区域审核提交
  DINGTALK_QUALITY_VERIFY_QUERY_BY_ID: 'forestry/quality/verify/detail/', // 获取区域审核详情

  DINGTALK_QUALITY_VERIFY_DETAIL: 'forestry/quality/verify/detail/', // 验收记录确认详情查看
  DINGTALK_QUALITY_VERIFY_PEDDING_LIST: 'forestry/quality/verify/pending/list/', // 验收记录列表
  DINGTALK_QUALITY_VERIFY_PEDDING_TABLE_DETAIL: 'forestry/quality/verify/table/', // 验收记录详情查看
  DINGTALK_QUALITY_VERIFY_PEDDING_TABLE_CALCULATE: 'forestry/quality/verify/calculate/', // 计算

  DINGTALK_OA_COMMON_SUBMITAPV: 'dingtalk/oa/common/transaction/submit', // 审核审批详情公共审批接口
  DINGTALK_OA_COMMON_GETINITAPV: 'dingtalk/oa/common/transaction/submit', // 2019年10月15日19:02:05 新的公共查询接口

  /**
   * 作业进度汇报
   */
  FOREST_JOB_APPLY_START_QUERY_SELECT_ITEMS: 'forestry-job/work/apply/start', // 开工级联查询
  FOREST_JOB_APPLY_START_SAVE: 'forestry-job/work/save/start', // 开工保存

  FOREST_JOB_APPLY_OVER_QUERY_SELECT_ITEMS: 'forestry-job/work/apply/over', // 完工级联查询
  FOREST_JOB_APPLY_OVER_SAVE: 'forestry-job/work/save/over', // 完工保存

  FOREST_JOB_APPLY_FORSTATION_QUERY_SELECT_ITEMS: 'forestry-job/work/apply/forestation', // 抚育造林作业进度汇报级联查询
  FOREST_JOB_FORESTATION_SAVE: 'forestry-job/work/save/forestation', // 抚育造林作业进汇报度保存

  FOREST_JOB_QUANTITY_QUERY_SELECT_ITEMS: 'forestry-job/work/apply/quantity', // 造林、抚育作业量级联查询
  FOREST_JOB_QUANTITY_SAVE: 'forestry-job/work/save/quantity', // 造林、抚育作业量汇报提交保存

  FOREST_JOB_MACHINERY_QUERY_SELECT_ITEMS: 'forestry-job/work/apply/machinery', // 采伐作业进度级联查询(机械)
  FOREST_JOB_MACHINERY_SAVE: 'forestry-job/work/save/machinery', // 采伐作业进度汇报提交保存(机械)

  FOREST_JOB_FELLING_QUERY_SELECT_ITEMS: 'forestry-job/work/apply/felling', // 采伐作业进度级联查询(人工)
  FOREST_JOB_FELLING_SAVE: 'forestry-job/work/save/felling', // 采伐作业进度汇报提交保存(人工)

  FOREST_JOB_FORESTATION_STOP_QUERY_SELECT_ITEMS: 'forestry-job/work/apply/forestation/stop', // 造林、抚育停工级联查询
  FOREST_JOB_FORESTATION_STOP_SAVE: 'forestry-job/work/save/forestation/stop', // 造林、抚育停工汇报提交保存

  FOREST_JOB_REPORTER_QUERY_SELECT_ITEMS: 'forestry-job/work/apply/reporter', // 调整进度汇报人级联查询
  FOREST_JOB_REPORTER_SAVE: 'forestry-job/work/save/reporter', // 调整进度汇报人提交保存

  FOREST_JOB_FELLING_STOP_QUERY_SELECT_ITEMS: 'forestry-job/work/apply/felling/stop', // 采伐作业停工级联查询
  FOREST_JOB_FELLING_STOP_SAVE: 'forestry-job/work/save/forestation/stop', // 采伐作业停工提交保存

  FOREST_JOB_LODING_APPLY_SELECT_ITEMS: 'forestry-job/work/apply/loading', // 木材装运计划级联查询
  FOREST_JOB_LODING_APPLY_SAVE: 'forestry-job/work/save/loading', // 调整进度汇报人提交保存

  /* end 工作任务 */

  /** start 工作计划 */
  FOREST_PLAN_LC: 'forestry-exception/forestry/plan/lc', // 查询是否可发起巡山计划申请
  FOREST_PLAN_PERSONS: 'forestry-exception/forestry/plan/planPersons', // 巡山计划巡视人
  FOREST_PLAN_SAVE: 'forestry-exception/forestry/plan/save', // 保存巡山计划
  FOREST_PLAN_AUDIT_LIST: 'forestry-exception/forestry/plan/audit/list', // 巡山计划待审列表
  FOREST_PLAN_AUDIT_ONE: 'forestry-exception/forestry/plan/one', // 查询单个审批巡山计划
  FOREST_PLAN_AUDIT: 'forestry-exception/forestry/plan/audit', // 审批巡山计划
  FOREST_PLAN_AUDIT_PASS: 'forestry-exception/forestry/plan/pass/list', // 已审批的巡山计划

  /** end 工作计划 */
  /* 巡山异常反馈 */
  DINGTALK_FORESTRY_EXCEPTION_SAVE: 'forestry-exception/forestry/log-patrolproblem/save', // 护林员反馈巡山异常情况
  DINGTALK_FORESTRY_EXCEPTION_AUDITFIRST: 'forestry-exception/forestry/log-patrolproblem/updateFirst', // 片区主任一审
  DINGTALK_FORESTRY_EXCEPTION_AUDITSECOND: 'forestry-exception/forestry/log-patrolproblem/updateSecond', // 林场主管二审
  DINGTALK_FORESTRY_EXCEPTION_FINDEXCEPTION: 'forestry-exception/forestry/log-patrolproblem/findException', // 异常列表
  DINGTALK_FORESTRY_EXCEPTION_FINDLB: 'forestry/exception/forestry/log-patrolproblem/findLbByEmployeeNo', // 林班列表
  DINGTALK_FORESTRY_EXCEPTION_EXCEPTIONDETAIL: 'forestry-exception/forestry/log-patrolproblem/exceptionDetail', // 异常详情
  /* 天气预报 */
  DINGTALK_WEATHERREPORT_SAVE: 'forestry-exception/weather/log-weatherreport/addOne', // 林班天气情况汇报
  DINGTALK_WEATHERREPORT_FINDLBLIST: 'forestry-exception/weather/log-weatherreport/getLbByUserId', // 获取林管员对应林班列表
  DINGTALK_WEATHERREPORT_FINDONE: 'forestry-exception/weather/log-weatherreport/findOne', // 根据ID查询一条
  DINGTALK_WEATHERREPORT_FINDAllBYLCNAME: 'forestry-exception/org/check-personnel/findOne', // 根据ID查询一条

  DINGTALK_DISASTERREPORT_GETDISSALB: 'forestry-exception/weather/log-disasterreport/getDisaLb', // 获取受灾林班
  DINGTALK_DISASTERREPORT_SAVE: 'forestry-exception/weather/log-disasterreport/addOne', // 保存数据
  DINGTALK_DISASTERREPORT_UPDATE: 'forestry-exception/weather/log-disasterreport/updateOne', // 保存数据
  DINGTALK_DISASTERREPORT_UPDATECHECKSTATUS: 'forestry-exception/weather/log-disasterreport/updateCheckStatus', // 审核数据
  DINGTALK_DISASTERREPORT_FINDEXCEPTION: 'forestry-exception/weather/log-disasterreport/findException', // 异常列表
  DINGTALK_DISASTERREPORT_FINDCHECKEXCEPTION: 'forestry-exception/weather/log-disasterreport/findcheckException', // 异常列表
  DINGTALK_DISASTERREPORT_FINDCHECKEXCEPTIONAUDIT:
    'forestry-exception/weather/log-disasterreport/findCheckExceptionAudit', // 异常列表
  DINGTALK_DISASTERREPORT_FINDONE: 'forestry-exception/weather/log-disasterreport/findOne', // 根据ID查询一条
  DINGTALK_DISASTERREPORT_GETQYNO: 'forestry-exception/forestry/bas-qy/getQy', // 获取林班区域
  DINGTALK_COMMON_QUERY_OR_SUBMIT: 'dingtalk/oa/common/transaction/submit'
}

export default {
  DINTALK_API,
  CORP_ID,
  API
}
