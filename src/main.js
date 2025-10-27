import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import { createPinia } from 'pinia'
import globalComponents from './plugins/global-components'
import globalDirectives from './plugins/global-directives'
import dayjs from './plugins/dayjs'
import './api/interceptor'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(globalComponents)
app.use(globalDirectives)
app.use(dayjs)
app.mount('#app')
import 'bootstrap/dist/js/bootstrap.js'
