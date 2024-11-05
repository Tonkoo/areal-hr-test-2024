<script>
import Sidebar from './components/Sidebar.vue';

export default{
  components:
  {
    Sidebar
  }
};
</script>

<template>
    <v-app>
      <Sidebar />
      <v-app-bar app>
        <v-toolbar-title>Hr отдел</v-toolbar-title>
      </v-app-bar>
      <v-main>
        <RouterView/>
      </v-main>
    </v-app>
</template>

<style>

</style>
