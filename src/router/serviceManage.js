export default [
  { //服务管理
    path: '/serviceManage',
    component: () => import('@/views/serviceManage/serviceManage')
  },
  { //发布服务 1
    path: '/publishService',
    component: () => import('@/views/serviceManage/publishService')
  },
  { //发布服务 2
    path: '/perfectService',
    component: () => import('@/views/serviceManage/perfectService')
  },
  { //服务详情介绍/相关案例介绍/相关传记介绍
    path: '/serviceIntroduce',
    component: () => import('@/views/serviceManage/serviceIntroduce')
  },
  { //选择分类
    path: '/selectCate',
    component: () => import('@/views/serviceManage/selectCate')
  },
  { //选择分类
    path: '/choiceCatethree',
    component: () => import('@/views/serviceManage/choiceCatethree')
  },
  {//选择领域
    path: '/addFieldService',
    component: () => import('@/views/serviceManage/addFieldService')
  },
  { //选择品牌
    path: '/selectBrand',
    component: () => import('@/views/serviceManage/selectBrand')
  },
  { //选择地区
    path: '/choiceAreas',
    component: () => import('@/views/serviceManage/choiceAreas')
  },
  { //添加规格
    path: '/addSpecs',
    component: () => import('@/views/serviceManage/addSpecs')
  },
  { //添加属性
    path: '/addAttribute',
    component: () => import('@/views/serviceManage/addAttribute')
  },
  { //店铺分类
    path: '/storeClassify',
    component: () => import('@/views/serviceManage/storeClassify')
  },
  { //demo
    path: '/uploadVideoDemo',
    component: () => import('@/views/demo/uploadVideoDemo')
  }
]
