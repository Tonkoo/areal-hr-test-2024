<script>
export default {
  name: 'Home',
};
</script>

<template>
  <v-container class="home-container" fluid>
    <v-row justify="center" align="center" class="home-row">
      <v-col cols="12" md="6" class="text-center">
        <h1 class="home-title">Добро пожаловать!!!</h1>
        <img src="../assets/images/icon.png" alt="Icon" class="home-image" />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

.home-row {
  text-align: center;
}

.home-title {
  font-size: 3rem;
  color: #1976D2;
  margin-bottom: 30px;
  font-weight: bold;
  text-transform: uppercase;
}

.home-image {
  max-width: 100%;
  height: auto;
  max-height: 350px;
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

.home-image:hover {
  transform: scale(1.05);
}
</style>