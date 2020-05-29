export default [
  {
    path: '/news/list',
    component: () => import('@/views/news/news')
  },
  {
    path: '/news/detail/:id',
    component: () => import('@/views/news/detail')
  }
]
