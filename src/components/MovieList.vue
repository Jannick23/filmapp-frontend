<script setup>
import { ref, onMounted } from 'vue'

const movies = ref([])

const newMovie = ref({
  title: '',
  genre: '',
  releaseYear: '',
  status: ''
})

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL

async function loadMovies() {
  const response = await fetch(`${baseUrl}/movies`)
  movies.value = await response.json()
}

async function addMovie() {
  await fetch(`${baseUrl}/movies`, {
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
  <div>
    <h2>Neuen Film hinzufügen</h2>

    <form @submit.prevent="addMovie">
      <input
        v-model="newMovie.title"
        placeholder="Titel"
        required
      />

      <input
        v-model="newMovie.genre"
        placeholder="Genre"
      />

      <input
        v-model="newMovie.releaseYear"
        type="number"
        placeholder="Erscheinungsjahr"
      />

      <input
        v-model="newMovie.status"
        placeholder="Status"
      />

      <button type="submit">
        Film hinzufügen
      </button>
    </form>

    <h2>Filmliste</h2>

    <ul>
      <li
        v-for="movie in movies"
        :key="movie.id"
      >
        {{ movie.title }}
        ({{ movie.genre }})
        - {{ movie.releaseYear }}
        - {{ movie.status }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
  margin-bottom: 30px;
}

input,
button {
  padding: 8px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
}
</style>
