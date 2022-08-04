import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      hidden: true,
      component: () => import('@/views'),
      redirect: '/apps',
      children: [
        {
          path: '/apps',
          name: '竹林应用',
          hidden: true,
          meta: {
            keepAlive: true
          },
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "apps" */ '@/views/apps')
        },
        {
          path: '/clockin',
          name: '上下班',
          meta: {
            pRouteName: '竹林应用',
            background: 'on-clock'
          },
          component: () => import(/* webpackChunkName: "clockin" */ '@/views/clockin')
        },
        {
          path: '/duty',
          name: '值班',
          meta: {
            pRouteName: '竹林应用',
            background: 'on-duty'
          },
          component: () => import('../views/duty'),
          redirect: '/duty/home/apply',
          children: [
            {
              path: 'home/apply',
              name: '值班申请',
              meta: {
                pRouteName: '竹林应用'
              },
              component: () => import(/* webpackChunkName: "duty-home" */ '../views/duty/home')
            },
            {
              path: 'home/list',
              name: '值班申请列表',
              meta: {
                pRouteName: '竹林应用'
              },
              component: () => import(/* webpackChunkName: "duty-home" */ '../views/duty/home')
            },
            {
              path: 'view/:id',
              name: '值班申请查看',
              component: () => import(/* webpackChunkName: "duty-view" */ '../views/duty/duty/view')
            },
            {
              path: 'update/:id',
              name: '值班申请修改',
              component: () => import(/* webpackChunkName: "duty-change" */ '../views/duty/duty/change')
            },
            {
              path: 'cancel/:id',
              name: '值班申请取消',
              component: () => import(/* webpackChunkName: "duty-cancel" */ '../views/duty/duty/cancel')
            }
          ]
        },
        {
          path: '/rest',
          name: '休班',
          meta: {
            pRouteName: '竹林应用',
            background: 'off-duty'
          },
          component: () => import('../views/rest'),
          redirect: '/rest/home/apply',
          children: [
            {
              path: 'home/apply',
              name: '休班申请',
              meta: {
                pRouteName: '竹林应用'
              },
              component: () => import(/* webpackChunkName: "rest-home" */ '../views/rest/home')
            },
            {
              path: 'home/list',
              name: '休班申请列表',
              meta: {
                pRouteName: '竹林应用'
              },
              component: () => import(/* webpackChunkName: "rest-home" */ '../views/rest/home')
            },
            {
              path: 'view/:id',
              name: '休班申请查看',
              component: () => import(/* webpackChunkName: "rest-view" */ '../views/rest/rest/view')
            },
            {
              path: 'update/:id',
              name: '休班申请修改',
              component: () => import(/* webpackChunkName: "rest-change" */ '../views/rest/rest/change')
            },
            {
              path: 'cancel/:id',
              name: '休班申请取消',
              component: () => import(/* webpackChunkName: "rest-cancel" */ '../views/rest/rest/cancel')
            }
          ]
        },
        {
          path: '/leave',
          name: '请假',
          meta: {
            pRouteName: '竹林应用',
            background: 'for-leave'
          },
          component: () => import('../views/leave'),
          redirect: '/leave/home/apply',
          children: [
            {
              path: 'home/apply',
              name: '请假申请',
              meta: {
                pRouteName: '竹林应用'
              },
              component: () => import(/* webpackChunkName: "leave-home" */ '../views/leave/home')
            },
            {
              path: 'home/list',
              name: '请假申请列表',
              meta: {
                pRouteName: '竹林应用'
              },
              component: () => import(/* webpackChunkName: "leave-home" */ '../views/leave/home')
            },
            {
              path: 'view/:id',
              name: '请假申请查看',
              component: () => import(/* webpackChunkName: "leave-view" */ '../views/leave/leave/view')
            },
            {
              path: 'update/:id',
              name: '请假申请修改',
              component: () => import(/* webpackChunkName: "leave-change" */ '../views/leave/leave/change')
            },
            {
              path: 'cancel/:id',
              name: '请假申请取消',
              component: () => import(/* webpackChunkName: "leave-cancel" */ '../views/leave/leave/cancel')
            }
          ]
        },
        {
          path: '/fieldwork',
          name: '野外工作',
          meta: {
            background: 'field-work1'
          },
          component: () => import('@/views/fieldwork/index'),
          redirect: '/fieldwork/apps',
          children: [
            {
              path: 'apps',
              name: '野外工作应用',
              hidden: true,
              meta: {
                pRouteName: '竹林应用'
              },
              component: () => import(/* webpackChunkName: "fieldwork-apps" */ '@/views/fieldwork/apps')
            },
            {
              path: 'daywork',
              name: '林班工作',
              meta: {
                pRouteName: '野外工作应用',
                background: '#ff6500'
              },
              component: () => import(/* webpackChunkName: "fieldwork-daywork" */ '@/views/fieldwork/daywork')
            },
            {
              path: 'daywork/add',
              name: '新增林班工作',
              hidden: true,
              meta: {
                pRouteName: '林班工作'
              },
              component: () =>
                import(/* webpackChunkName: "fieldwork-daywork-detail" */ '@/views/fieldwork/daywork/detail')
            },
            {
              path: 'daywork/detail/:id',
              name: '离开林班工作',
              hidden: true,
              meta: {
                pRouteName: '林班工作'
              },
              component: () =>
                import(/* webpackChunkName: "fieldwork-daywork-detail" */ '@/views/fieldwork/daywork/detail')
            },
            {
              path: 'nightwork',
              name: '夜间工作',
              meta: {
                pRouteName: '野外工作应用',
                background: '#6699ff'
              },
              component: () => import(/* webpackChunkName: "fieldwork-nightwork" */ '@/views/fieldwork/nightwork')
            },
            {
              path: 'nightwork/add',
              name: '新增夜间工作',
              hidden: true,
              meta: {
                pRouteName: '夜间工作'
              },
              component: () =>
                import(/* webpackChunkName: "fieldwork-nightwork-detail" */ '@/views/fieldwork/nightwork/detail')
            },
            {
              path: 'nightwork/detail/:id',
              name: '夜间工作详情',
              hidden: true,
              meta: {
                pRouteName: '夜间工作'
              },
              component: () =>
                import(/* webpackChunkName: "fieldwork-nightwork-detail" */ '@/views/fieldwork/nightwork/detail')
            }
          ]
        },
        {
          path: '/patrol',
          name: '巡山协管',
          meta: {
            background: 'field-work2'
          },
          component: () => import('@/views/patrol/index'),
          redirect: '/patrol/apps',
          children: [
            {
              path: 'apps',
              name: '巡山协管应用',
              meta: {
                pRouteName: '竹林应用'
              },
              hidden: true,
              component: () => import(/* webpackChunkName: "patrol-apps" */ '@/views/patrol/apps')
            },
            {
              path: 'patrol',
              name: '巡山工作',
              meta: {
                pRouteName: '巡山协管应用',
                background: '#ff6500'
              },
              component: () => import(/* webpackChunkName: "patrol-patrol" */ '@/views/patrol/patrol')
            },
            {
              path: 'patrol/add',
              name: '新增巡山工作',
              hidden: true,
              meta: {
                pRouteName: '巡山工作'
              },
              component: () => import(/* webpackChunkName: "patrol-patrol-detail" */ '@/views/patrol/patrol/detail')
            },
            {
              path: 'patrol/detail/:id',
              name: '巡山定点操作',
              hidden: true,
              meta: {
                pRouteName: '巡山工作'
              },
              component: () => import(/* webpackChunkName: "patrol-patrol-detail" */ '@/views/patrol/patrol/detail')
            },
            {
              path: 'assistant',
              name: '协管工作',
              meta: {
                pRouteName: '巡山协管应用',
                background: '#6699ff'
              },
              component: () => import(/* webpackChunkName: "patrol-assistant" */ '@/views/patrol/assistant')
            },
            {
              path: 'assistant/add',
              name: '新增协管巡山工作',
              hidden: true,
              meta: {
                pRouteName: '协管工作'
              },
              component: () =>
                import(/* webpackChunkName: "patrol-assistant-detail" */ '@/views/patrol/assistant/detail')
            },
            {
              path: 'assistant/detail/:id',
              name: '协管巡山结束',
              hidden: true,
              meta: {
                pRouteName: '协管工作'
              },
              component: () =>
                import(/* webpackChunkName: "patrol-assistant-detail" */ '@/views/patrol/assistant/detail')
            },
            {
              path: '/exception-report',
              name: '巡山异常报到',
              meta: {
                pRouteName: '巡山协管应用',
                background: '#6699ff',
                iconTitle: '异常报到'
              },
              component: () =>
                import(/* webpackChunkName: "patrol-assistant" */ '@/views/patrol/patrol-exception-report')
            }
          ]
        },
        {
          path: '/cook',
          name: '炊事员考勤',
          meta: {
            background: 'cook'
          },
          component: () => import('../views/cook/index'),
          redirect: '/cook/apps',
          children: [
            {
              path: 'apps',
              name: '炊事员考勤应用',
              hidden: true,
              component: () => import(/* webpackChunkName: "cook-apps" */ '../views/cook/apps')
            },
            {
              path: 'duty',
              name: '考勤打卡',
              meta: {
                background: '#ff6500'
              },
              component: () => import(/* webpackChunkName: "cook-on-duty" */ '../views/cook/on-duty')
            },
            {
              path: 'rest',
              name: '休息登记',
              meta: {
                background: '#6699ff'
              },
              component: () => import(/* webpackChunkName: "cook-check-in" */ '../views/cook/check-in')
            }
          ]
        },
        {
          path: '/checkquality',
          name: '作业质量验收',
          meta: {
            background: 'check'
          },
          component: () => import('@/views/check-operation-quality/index'),
          redirect: '/checkquality/apps',
          children: [
            {
              path: 'apps',
              name: '作业质量验收首页',
              hidden: true,
              meta: {
                pRouteName: '竹林应用'
              },
              component: () =>
                import(/* webpackChunkName: "check-operation-quality-apps" */ '@/views/check-operation-quality/apps')
            },
            {
              path: 'apply',
              name: '验收区域申请',
              meta: {
                pRouteName: '作业质量验收首页',
                background: '#ff6500',
                text: '区域申请'
              },
              component: () =>
                import(/* webpackChunkName: "check-operation-quality-apply" */ '@/views/check-operation-quality/apply')
            },
            {
              path: 'approve',
              name: '验收区域列表',
              meta: {
                pRouteName: '作业质量验收首页',
                background: '#ff6500',
                text: '区域审核'
              },
              component: () =>
                import(
                  /* webpackChunkName: "check-operation-quality-approve" */ '@/views/check-operation-quality/approve'
                )
            },
            {
              path: 'approve/:id',
              name: '验收区域审核',
              hidden: true,
              meta: {
                pRouteName: '验收区域列表'
              },
              component: () =>
                import(
                  /* webpackChunkName: "check-operation-quality-approve/detail" */ '@/views/check-operation-quality/approve/detail'
                )
            },
            {
              path: 'write',
              name: '验收数据录入',
              meta: {
                pRouteName: '作业质量验收首页',
                background: '#ff6500',
                text: '数据录入'
              },
              component: () =>
                import(
                  /* webpackChunkName: "check-operation-quality-data-write" */ '@/views/check-operation-quality/data-write'
                )
            },
            {
              path: 'write/:id',
              name: '验收区域录入表单',
              meta: {
                pRouteName: '验收数据录入',
                background: '#ff6500',
                text: '验收区域录入'
              },
              hidden: true,
              component: () =>
                import(
                  /* webpackChunkName: "check-operation-quality-data-write-detail" */ '@/views/check-operation-quality/data-write/detail'
                )
            },
            {
              path: 'confirm',
              name: '验收记录确认',
              meta: {
                pRouteName: '作业质量验收首页',
                background: '#6699ff',
                text: '记录确认'
              },
              component: () =>
                import(
                  /* webpackChunkName: "check-operation-quality-record-confirm" */ '@/views/check-operation-quality/record-confirm'
                )
            },
            {
              path: 'confirm/:id',
              name: '验收记录确认表单',
              meta: {
                pRouteName: '验收记录确认',
                background: '#ff6500',
                text: '验收记录确认'
              },
              hidden: true,
              component: () =>
                import(
                  /* webpackChunkName: "check-operation-quality-data-write-detail" */ '@/views/check-operation-quality/record-confirm/detail'
                )
            }
          ]
        },
        {
          path: '/jobreport',
          name: '作业进度汇报',
          meta: {
            pRouteName: '竹林应用',
            background: 'work-record'
          },
          component: () => import('@/views/job-progress-report/index'),
          redirect: '/jobreport/apps',
          children: [
            {
              path: 'apps',
              name: '作业进度汇报首页',
              hidden: true,
              meta: {
                pRouteName: '竹林应用'
              },
              component: () =>
                import(/* webpackChunkName: "job-progress-report-apps" */ '@/views/job-progress-report/apps')
            },
            {
              path: 'start',
              name: '作业开工',
              meta: {
                pRouteName: '作业进度汇报首页'
              },
              component: () =>
                import(
                  /* webpackChunkName: "job-progress-report-operation-start" */ '@/views/job-progress-report/operation-start'
                )
            },
            {
              path: 'logging-complete',
              name: '采伐完工',
              meta: {
                pRouteName: '作业进度汇报首页'
              },
              component: () =>
                import(
                  /* webpackChunkName: "job-progress-report-logging-complete" */ '@/views/job-progress-report/logging-complete'
                )
            },
            {
              path: 'complete',
              name: '作业完工',
              meta: {
                pRouteName: '作业进度汇报首页'
              },
              component: () =>
                import(
                  /* webpackChunkName: "job-progress-report-operation-complete" */ '@/views/job-progress-report/operation-complete'
                )
            },
            {
              path: 'tendingprogress',
              name: '造林抚育作业进度',
              meta: {
                pRouteName: '作业进度汇报首页'
              },
              component: () =>
                import(
                  /* webpackChunkName: "job-progress-report-afforestation-tending-progress" */ '@/views/job-progress-report/afforestation-tending-progress'
                )
            },
            {
              path: 'tendingreport',
              name: '造林抚育作业量汇报',
              meta: {
                pRouteName: '作业进度汇报首页'
              },
              component: () =>
                import(
                  /* webpackChunkName: "job-progress-report-afforestation-tending-report" */ '@/views/job-progress-report/afforestation-tending-report'
                )
            },
            // {
            //   path: 'progressreport',
            //   name: '采伐作业进度汇报',
            //   meta: {
            //     pRouteName: '作业进度汇报首页'
            //   },
            //   component: () =>
            //     import(/* webpackChunkName: "job-progress-report-logging-progress-report" */ '@/views/job-progress-report/logging-progress-report')
            // },
            {
              path: 'progressreport',
              name: '采伐作业进度汇报',
              meta: {
                pRouteName: '作业进度汇报首页'
              },
              component: () =>
                import(
                  /* webpackChunkName: "job-progress-report-menu" */ '@/views/job-progress-report/logging-progress-report/index'
                ),
              redirect: '/jobreport/progressreport/menu',
              children: [
                {
                  path: 'menu',
                  name: '采伐作业方式',
                  meta: {
                    pRouteName: '作业进度汇报首页'
                  },
                  hidden: true,
                  component: () =>
                    import(
                      /* webpackChunkName: "job-progress-report-menu" */ '@/views/job-progress-report/logging-progress-report/menu'
                    )
                },
                {
                  path: 'artificial',
                  name: '人工采伐',
                  meta: {
                    pRouteName: '采伐作业进度汇报'
                  },
                  component: () =>
                    import(
                      /* webpackChunkName: "job-progress-report-logging-progress-report-artificial" */ '@/views/job-progress-report/logging-progress-report/artificial'
                    )
                },
                {
                  path: 'semi-mechanical',
                  name: '半机械采伐',
                  meta: {
                    pRouteName: '采伐作业进度汇报'
                  },
                  component: () =>
                    import(
                      /* webpackChunkName: "job-progress-report-logging-progress-report-semi-mechanical" */ '@/views/job-progress-report/logging-progress-report/semi-mechanical'
                    )
                }
              ]
            },
            {
              path: 'greenmountainsell',
              name: '卖青山作业进度汇报',
              meta: {
                pRouteName: '作业进度汇报首页'
              },
              component: () =>
                import(
                  /* webpackChunkName: "green-mountain-sell-report" */ '@/views/job-progress-report/green-mountain-sell-report'
                )
            },
            {
              path: 'progressreportor',
              name: '调整作业进度汇报人',
              meta: {
                pRouteName: '作业进度汇报首页'
              },
              component: () =>
                import(
                  /* webpackChunkName: "job-progress-adjustment-reportor" */ '@/views/job-progress-report/adjustment-reportor'
                )
            },
            {
              path: 'stoppagereport',
              name: '造林抚育作业停工汇报',
              meta: {
                pRouteName: '作业进度汇报首页'
              },
              component: () =>
                import(
                  /* webpackChunkName: "job-progress-report-afforestation-tending-stoppage-report" */ '@/views/job-progress-report/afforestation-tending-stoppage-report'
                )
            },
            {
              path: 'loggingstoppagereport',
              name: '采伐作业停工汇报',
              meta: {
                pRouteName: '作业进度汇报首页'
              },
              component: () =>
                import(
                  /* webpackChunkName: "job-progress-report-logging-stoppage-report" */ '@/views/job-progress-report/logging-stoppage-report'
                )
            },
            {
              path: 'plannotice',
              name: '木材装运计划通知',
              meta: {
                pRouteName: '作业进度汇报首页'
              },
              component: () =>
                import(
                  /* webpackChunkName: "job-progress-report-timber-transport-plan-notice" */ '@/views/job-progress-report/timber-transport-plan-notice'
                )
            }
          ]
        },
        {
          path: '/loggingforestryexception',
          name: '工作记录',
          meta: {
            background: 'field-record'
          },
          component: () => import('@/views/patrol-exception/index'),
          redirect: '/loggingforestryexception/apps',
          children: [
            {
              path: 'apps',
              name: '工作记录首页',
              meta: {
                pRouteName: '竹林应用'
              },
              hidden: true,
              component: () => import(/* webpackChunkName: "patrol-exception-apps" */ '@/views/patrol-exception/apps')
            },
            {
              path: 'problenreport',
              name: '护林员巡山发现问题汇报',
              meta: {
                pRouteName: '工作记录首页'
              },
              component: () =>
                import(
                  /* webpackChunkName: "patrol-exception-problemreport" */ '@/views/patrol-exception/problemreport'
                )
            },
            {
              path: 'weatherreport',
              name: '林班天气情况汇报',
              meta: {
                pRouteName: '工作记录首页'
              },
              hidden: true,
              component: () =>
                import(
                  /* webpackChunkName: "patrol-exception-weatherreport" */ '@/views/patrol-exception/weatherreport'
                )
            },
            {
              path: 'disasterReport',
              name: '核查任务安排表',
              meta: {
                pRouteName: '工作记录首页'
              },
              component: () =>
                import(
                  /* webpackChunkName: "patrol-exception-disasterDecompose" */ '@/views/patrol-exception/disasterDecompose'
                )
            }
          ]
        },
        {
          path: '/work-plan',
          name: '工作计划',
          meta: {
            pRouteName: '竹林应用',
            background: 'work-plan'
          },
          component: () => import('@/views/work-plan/index'),
          redirect: '/work-plan/apps',
          children: [
            {
              path: 'apps',
              name: '工作计划首页',
              hidden: true,
              meta: {
                pRouteName: '竹林应用'
              },
              component: () => import(/* webpackChunkName: "work-plan-apps" */ '@/views/work-plan/apps')
            },
            {
              path: 'plan',
              name: '林地工作计划',
              meta: {
                pRouteName: '工作计划首页'
              },
              component: () => import(/* webpackChunkName: "work-plan-plan" */ '@/views/work-plan/plan')
            },
            {
              path: 'day-record',
              name: '每天工作记录',
              meta: {
                pRouteName: '工作计划首页'
              },
              component: () => import(/* webpackChunkName: "work-plan-day-record" */ '@/views/work-plan/day-record')
            },
            {
              path: 'patrol-plan',
              name: '巡山计划表',
              meta: {
                pRouteName: '工作计划首页'
              },
              component: () => import(/* webpackChunkName: "work-plan-day-record" */ '@/views/work-plan/patrol-plan')
            },
            {
              path: 'patrol-plan-pass',
              name: '巡山计划备查表',
              meta: {
                pRouteName: '工作计划首页'
              },
              component: () => import(/* webpackChunkName: "patrol-list-record" */ '@/views/work-plan/patrol-list')
            },
            {
              path: 'patrol-plan-view/:id',
              name: '巡山计划查看',
              hidden: true,
              meta: {
                pRouteName: '巡山计划备查表'
              },
              component: () => import(/* webpackChunkName: "patrol-plan" */ '@/views/audit-home/approve/patrol-plan')
            }
          ]
        },
        {
          path: '/moto',
          name: '摩托车模块',
          meta: {
            pRouteName: '竹林应用',
            background: 'moto'
          },
          component: () => import('@/views/moto/index'),
          redirect: '/moto/apps',
          children: [
            {
              path: 'apps',
              name: '摩托车模块首页',
              hidden: true,
              meta: {
                pRouteName: '竹林应用'
              },
              component: () => import(/* webpackChunkName: "moto-apps" */ '@/views/moto/apps')
            },
            {
              path: 'work-mile',
              name: '工作里程拍照',
              meta: {
                pRouteName: '摩托车模块'
              },
              component: () =>
                import(/* webpackChunkName: "moto-work-mile-takePhoto" */ '@/views/moto/work-mile-takePhoto')
            },
            {
              path: 'private-mile',
              name: '私用里程拍照',
              meta: {
                pRouteName: '摩托车模块'
              },
              component: () =>
                import(/* webpackChunkName: "moto-private-miles-takePhoto" */ '@/views/moto/private-miles-takePhoto')
            },
            {
              path: 'travel',
              name: '搭乘拍照',
              meta: {
                pRouteName: '摩托车模块'
              },
              component: () =>
                import(/* webpackChunkName: "tmoto-ravel-and-takePhoto" */ '@/views/moto/travel-and-takePhoto')
            },
            {
              path: 'odometer-damaged',
              name: '里程表损坏拍照',
              meta: {
                pRouteName: '摩托车模块'
              },
              component: () =>
                import(/* webpackChunkName: "moto-odometer-damaged" */ '@/views/moto/odometer-damaged-takePhoto')
            }
          ]
        },
        {
          path: '/approve',
          name: '审核审批',
          meta: {
            background: 'approval'
          },
          component: () => import('@/views/audit-home/index'),
          redirect: '/approve/list',
          children: [
            {
              path: 'list',
              name: '审核审批首页',
              meta: {
                pRouteName: '竹林应用'
              },
              component: () => import(/* webpackChunkName: "approve" */ '@/views/audit-home/home')
            },
            {
              path: ':type/:id',
              name: '申请审批',
              component: () => import(/* webpackChunkName: "approve" */ '@/views/audit-home/approve')
            },
            {
              path: 'patrol-plan/:id',
              name: '巡山计划审批',
              meta: {
                pRouteName: '审核审批首页'
              },
              component: () => import(/* webpackChunkName: "patrol-plan" */ '@/views/audit-home/approve/patrol-plan')
            },
            {
              path: 'problemauditfirst/:id',
              name: '护林员巡山发现问题汇报审核',
              meta: {
                pRouteName: '审核审批首页'
              },
              component: () =>
                import(
                  /* webpackChunkName: "patrol-exception-audit-problemaudit" */ '@/views/patrol-exception-audit/problemauditfirst'
                )
            },
            {
              path: 'problemauditsecond/:id',
              name: '护林员巡山发现问题审批',
              meta: {
                pRouteName: '审核审批首页'
              },
              component: () =>
                import(
                  /* webpackChunkName: "patrol-exception-audit-problemaudit" */ '@/views/patrol-exception-audit/problemauditsecond'
                )
            },
            {
              path: 'disasterDecompose/:id',
              name: '核查任务安排',
              meta: {
                pRouteName: '审核审批首页'
              },
              component: () =>
                import(
                  /* webpackChunkName: "patrol-exception-audit-disasterDecompose" */ '@/views/patrol-exception-audit/disasterDecompose'
                )
            },
            {
              path: 'disasterAdd/:id',
              name: '受灾情况核查录入',
              meta: {
                pRouteName: '审核审批首页'
              },
              component: () =>
                import(
                  /* webpackChunkName: "patrol-exception-audit-disasterAdd" */ '@/views/patrol-exception-audit/disasterAdd'
                )
            },
            {
              path: 'disasterAudit/:id',
              name: '受灾情况核查记录审核',
              meta: {
                pRouteName: '审核审批首页'
              },
              component: () =>
                import(
                  /* webpackChunkName: "patrol-exception-audit-disasterAudit" */ '@/views/patrol-exception-audit/disasterAudit'
                )
            }
          ]
        },
        {
          path: '/labourer',
          name: '民工信息查询',
          meta: {
            pRouteName: '竹林应用',
            background: 'labourer-info'
          },
          component: () => import('@/views/labourer-info/index'),
          redirect: '/labourer/login',
          children: [
            {
              path: '/labourer/login',
              name: '信息查询登录',
              meta: {
                pRouteName: '竹林应用'
              },
              component: () => import(/* webpackChunkName: "labourer-login" */ '@/views/labourer-info/login')
            },
            {
              path: '/labourer/details',
              name: '民工信息明细',
              meta: {
                pRouteName: '信息查询登录'
              },
              component: () => import(/* webpackChunkName: "labourer-details" */ '@/views/labourer-info/details')
            }
          ]
        },
        {
          path: '/interview-photo',
          name: '民工面试拍照',
          meta: {
            pRouteName: '竹林应用',
            background: 'interview'
          },
          component: () => import('@/views/interview-photo/index')
        },
        {
          path: '/location',
          name: '考勤定位',
          meta: {
            pRouteName: '竹林应用',
            background: 'location'
          },
          component: () => import('@/views/location/index'),
          redirect: '/location/list',
          children: [
            {
              path: '/location/list',
              name: '定点列表',
              meta: {
                pRouteName: '竹林应用'
              },
              component: () => import(/* webpackChunkName: "location-list" */ '@/views/location/list')
            },
            {
              path: '/location/details',
              name: '定点提交',
              meta: {
                pRouteName: '定点列表'
              },
              component: () => import(/* webpackChunkName: "location-details" */ '@/views/location/details')
            }
          ]
        },
        {
          path: '/check-weeding-price',
          name: '除草核价计划',
          meta: {
            pRouteName: '竹林应用',
            background: 'location'
          },
          component: () => import(/* webpackChunkName: "check-weeding-price" */ '@/views/check-weeding-price/form')
        },
        {
          path: '/chemicals-demand',
          name: '药品需求',
          meta: {
            pRouteName: '竹林应用',
            background: 'interview'
          },
          component: () => import('@/views/chemicals-demand/index')
        },
        {
          path: '/insect-pest',
          name: '林木灾害汇报',
          meta: {
            background: 'weed',
            pRouteName: '竹林应用'
          },
          component: () => import('@/views/insect-pest/index'),
          redirect: '/insect-pest/apps',
          children: [
            {
              path: 'apps',
              name: '林木灾害汇报应用',
              meta: {
                pRouteName: '竹林应用'
              },
              hidden: true,
              component: () => import(/* webpackChunkName: "insect-pest-apps" */ '@/views/insect-pest/apps')
            },
            {
              path: 'pest-report',
              name: '汇报界面',
              meta: {
                pRouteName: '林木灾害汇报应用',
                background: '#ff6500'
              },
              component: () => import(/* webpackChunkName: "insect-pest-report" */ '@/views/insect-pest/detail')
            },
            {
              path: 'pest-staged',
              name: '未汇报暂存',
              // hidden: true,
              meta: {
                pRouteName: '林木灾害汇报应用',
                background: '#ff6500'
              },
              component: () => import(/* webpackChunkName: "insect-pest-list" */ '@/views/insect-pest/noReport')
            },
            {
              path: 'pest-staged/detailed',
              name: '未汇报暂存【详情】',
              hidden: true,
              meta: {
                pRouteName: '未汇报暂存'
              },
              component: () => import(/* webpackChunkName: "insect-pest-noReport" */ '@/views/insect-pest/noReport/detail')
            },
            {
              path: 'pest-query',
              name: '已汇报查询',
              // hidden: true,
              meta: {
                pRouteName: '林木灾害汇报应用',
                background: '#ff6500'
              },
              component: () => import(/* webpackChunkName: "insect-pest-list" */ '@/views/insect-pest/report')
            },
            {
              path: 'pest-query/detailed',
              name: '已汇报查询【详情】',
              hidden: true,
              meta: {
                pRouteName: '已汇报查询'
              },
              component: () => import(/* webpackChunkName: "insect-pest-report" */ '@/views/insect-pest/report/detail')
            }
          ]
        },
        {
          path: '/weeding',
          name: '除草核价记录',
          meta: {
            background: 'weed',
            pRouteName: '竹林应用'
          },
          component: () => import('@/views/weeding/index'),
          redirect: '/weeding/apps',
          children: [
            {
              path: 'apps',
              name: '除草核价记录',
              meta: {
                pRouteName: '竹林应用'
              },
              hidden: true,
              component: () => import(/* webpackChunkName: "weeding-apps" */ '@/views/weeding/apps')
            },
            {
              path: 'launch',
              name: '除草核价记录发起',
              meta: {
                pRouteName: '除草核价记录',
                background: '#ff6500',
                iconTitle: '记录发起'
              },
              component: () => import(/* webpackChunkName: "weeding-launch" */ '@/views/weeding/launch')
            },
            {
              path: 'review',
              name: '除草核价记录审核',
              meta: {
                pRouteName: '审核审批首页'
              },
              hidden: true,
              component: () => import(/* webpackChunkName: "weeding-review" */ '@/views/weeding/review')
            }
          ]
        },
        {
          path: '/system-info',
          name: '系统消息',
          meta: {
            pRouteName: '竹林应用',
            background: 'notice'
          },
          component: () => import('@/views/system-info/index')
        }
      ]
    },
    {
      path: '/login',
      name: '登录',
      component: () => import('@/views/login'),
      hidden: true
    },
    {
      path: '/updatePwd',
      name: '修改密码',
      component: () => import('@/views/login/updatePwd'),
      hidden: true
    },
    {
      path: '/updatePwdByPhone',
      name: '验证信息',
      // name: '图片验证码获取短信',
      component: () => import('@/views/login/updatePwdByPhone/step1'),
      hidden: true
    },
    {
      path: '/updatePwdByPhone/finally',
      name: '短信修改密码',
      component: () => import('@/views/login/updatePwdByPhone/step2'),
      hidden: true
    }
  ]
})
