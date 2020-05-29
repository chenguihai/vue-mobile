export default [
  {
    path: '/login', // 登录
    component: () => import('@/views/account/login')
  },
  {
    path: '/register', // 注册
    component: () => import('@/views/account/register')
  },
  {
    path: '/user/agreement', // 协议
    component: () => import('@/views/account/agreement')
  },
  {
    path: '/forget', // 忘记密码 提交测试注释
    component: () => import('@/views/account/forget')
  },
  {
    path: '/binding', // 绑定
    component: () => import('@/views/account/bind')
  }
]
