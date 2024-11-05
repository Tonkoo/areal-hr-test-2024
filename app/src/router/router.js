import { createRouter, createWebHashHistory } from "vue-router"
import Home from "../components/Home.vue"
import Organizations from "../components/Organizations.vue"
import Departments from "../components/Departments.vue"
import Positions from "../components/Positions.vue"

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        {path: '/Home', component: Home},
        {path: '/Organizations', component: Organizations},
        {path: '/Departments', component: Departments},
        {path: '/Positions', component: Positions}
    ]
})