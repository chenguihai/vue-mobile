export default [
  {  //客户合作示例管理
    path: '/exampleManage',
    component: () => import('@/views/customer/exampleManage')
  },
  {  //发布客户示例
    path: '/publishExample',
    component: () => import('@/views/customer/publishExample')
  },
  {  //示例详情介绍
    path: '/exampleIntroduce',
    component: () => import('@/views/customer/exampleIntroduce')
  },
  {  //选择分类
    path: '/customer/selectCate',
    component: () => import('@/views/customer/selectCate')
  },
  {  //选择分类
    path: '/customer/choiceCatethree',
    component: () => import('@/views/customer/choiceCatethree')
  }
]
