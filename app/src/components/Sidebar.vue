<script>
    export default {
        data() {
            return {
                drawer: true,
                menuItems: [
                    { id: 1, name: 'Главная', route: '/' },
                    { id: 2, name: 'Организации', route: '/Organizations' },
                    { id: 3, name: 'Отделы', route: '/Departments' },
                    { id: 4, name: 'Должности', route: '/Positions' }
                ]
            };
        }
    };
</script>

<template>
    <v-navigation-drawer app v-model="drawer" permanent>
        <v-list>
            <v-list-item
                v-for="item in menuItems"
                :key="item.id"
                :to="item.route"
                router
            >
                <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<style scoped>
</style>