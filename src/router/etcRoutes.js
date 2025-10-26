import AboutView from '@/views/AboutView.vue'
import HomeView from '@/views/HomeView.vue'
import PlaygroundView from '@/views/playground/PlaygroundView.vue'

const etcRoutes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
  },
  {
    path: '/playground',
    name: 'Playground',
    component: PlaygroundView,
  },
]

export default etcRoutes
