import { createApp } from 'vue'
import App from '@/App'
import { createPinia } from 'pinia'
import router from '@/router/routes'


const app = createApp(App)

app.use(createPinia())

app.use(router)

app.mount('#app')
