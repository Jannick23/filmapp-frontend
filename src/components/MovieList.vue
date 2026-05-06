<script setup>
const movies = [
  {
    id: 1,
    title: "Inception",
    genre: "Sci-Fi",
    releaseYear: 2010,
    status: "WATCHED"
  },
  {
    id: 2,
    title: "The Dark Knight",
    genre: "Action",
    releaseYear: 2008,
    status: "WATCHED"
  },
  {
    id: 3,
    title: "Interstellar",
    genre: "Sci-Fi",
    releaseYear: 2014,
    status: "WATCHLIST"
  },
  {
    id: 4,
    title: "Parasite",
    genre: "Thriller",
    releaseYear: 2019,
    status: "WATCHLIST"
  }
]
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
