<script setup>
import MovieList from './components/MovieList.vue'
</script>

<template>
  <div class="app">
    <h1>Movie Tracker Frontend</h1>

    <MovieList />
  </div>
</template>

<style scoped>
.app {
  font-family: Arial, sans-serif;
  padding: 30px;
}

h1 {
  margin-bottom: 30px;
}
</style>
