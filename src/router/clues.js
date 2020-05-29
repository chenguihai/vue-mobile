export default [
  {
    path: '/clues',
    component: () => import('@/views/clues/clues')
  },
  {
    path: '/clues/release',
    component: () => import('@/views/clues/release')
  },
  {
    path: '/clues/detail/:id',
    component: () => import('@/views/clues/detail')
  },
  {
    path: '/clues/tmed',
    component: () => import('@/views/clues/tmed')
  }
]
