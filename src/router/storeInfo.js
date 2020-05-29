export default [
  {  //店铺资料-个人/企业
    path: '/storeInfoPerson',
    component: () => import('@/views/storeInfo/storeInfoPerson')
  },
  {  //工作经历
    path: '/workExperience',
    component: () => import('@/views/storeInfo/workExperience')
  },
  {  //添加工作经历
    path: '/addExperience',
    component: () => import('@/views/storeInfo/addExperience')
  },
  { //媒介资质
    path: '/mediaQualify',
    component: () => import('@/views/storeInfo/mediaQualify')
  },
  { //添加媒介资质
    path: '/addMedia',
    component: () => import('@/views/storeInfo/addMedia')
  },
  { //自传资质列表
    path: '/certificate',
    component: () => import('@/views/storeInfo/certificate')
  },
  { //添加自传资质
    path: '/addCertificate',
    component: () => import('@/views/storeInfo/addCertificate')
  },
  { //添加隶属媒体公司
    path: '/addCompany',
    component: () => import('@/views/storeInfo/addCompany')
  },
  { //隶属媒体公司
    path: '/belongCompany',
    component: () => import('@/views/storeInfo/belongCompany')
  },
  { //隶属媒体公司
    path: '/settleIntroduce',
    component: () => import('@/views/storeInfo/settleIntroduce')
  }
]
