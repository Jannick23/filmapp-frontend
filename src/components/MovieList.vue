<script setup>
import { ref, onMounted } from 'vue'

const movies = ref([])

onMounted(async () => {
  const response = await fetch('http://localhost:8080/movies')
  movies.value = await response.json()
})
</script>

<template>
  <div class="movie-container">
    <h2>Filmliste</h2>

    <div
      v-for="movie in movies"
      :key="movie.id"
      class="movie-card"
    >
      <h3>{{ movie.title }}</h3>

      <p>Genre: {{ movie.genre }}</p>

      <p>Jahr: {{ movie.releaseYear }}</p>

      <p>Status: {{ movie.status }}</p>
    </div>
  </div>
</template>

<style scoped>
.movie-container {
  padding: 20px;
}

.movie-card {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
}

h2 {
  margin-bottom: 20px;
}
</style>
