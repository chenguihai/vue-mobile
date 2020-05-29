export default [
  {  //实名认证 类型选择
    path: '/authType',
    component: () => import('@/views/audit/authType')
  },
  {  //填写开票信息 第一步
    path: '/invoiceInfo1',
    component: () => import('@/views/audit/invoiceInfo1')
  },
  {  //填写法人信息 第二步
    path: '/corporateInfo2',
    component: () => import('@/views/audit/corporateInfo2')
  },
  {  //填写对公账户信息 第三步
    path: '/accountInfo3',
    component: () => import('@/views/audit/accountInfo3')
  },
  {  //填写对公账户信息 第四步
    path: '/paymentReview4',
    component: () => import('@/views/audit/paymentReview4')
  },
  // {  //审核不通过/待审核
  //   path: '/auditFail',
  //   component: () => import('@/views/audit/auditFail')
  // },
  {  //审核通过
    path: '/auditPass',
    component: () => import('@/views/audit/auditPass')
  },
  {  //个人信息
    path: '/personalInfo',
    component: () => import('@/views/audit/personalInfo')
  },
  {  //企业信息
    path: '/companyInfo',
    component: () => import('@/views/audit/companyInfo')
  },
  {  //跳转页面
    path: '/jumpPage',
    component: () => import('@/views/audit/jumpPage')
  },
]
