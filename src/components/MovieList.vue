<script setup>
import { ref, onMounted } from 'vue'

const movies = ref([])

const newMovie = ref({
  title: '',
  genre: '',
  releaseYear: '',
  status: ''
})

async function loadMovies() {
  const response = await fetch('http://localhost:8081/movies')
  movies.value = await response.json()
}

async function addMovie() {
  await fetch('http://localhost:8081/movies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: newMovie.value.title,
      genre: newMovie.value.genre,
      releaseYear: Number(newMovie.value.releaseYear),
      status: newMovie.value.status
    })
  })

  newMovie.value = {
    title: '',
    genre: '',
    releaseYear: '',
    status: ''
  }

  await loadMovies()
}

onMounted(loadMovies)
</script>

<template>
  <div class="movie-container">

    <h2>Neuen Film hinzufügen</h2>

    <input
      v-model="newMovie.title"
      placeholder="Titel"
    />

    <input
      v-model="newMovie.genre"
      placeholder="Genre"
    />

    <input
      v-model="newMovie.releaseYear"
      placeholder="Jahr"
      type="number"
    />

    <input
      v-model="newMovie.status"
      placeholder="Status"
    />

    <button @click="addMovie">
      Speichern
    </button>

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

input {
  display: block;
  margin-bottom: 10px;
  padding: 8px;
  width: 250px;
}

button {
  padding: 10px;
  margin-bottom: 20px;
  cursor: pointer;
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
