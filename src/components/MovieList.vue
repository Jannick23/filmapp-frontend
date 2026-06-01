<script setup>
import { ref, onMounted } from 'vue'

const movies = ref([])

const newMovie = ref({
  title: '',
  genre: '',
  releaseYear: '',
  status: ''
})

const baseUrl =
  import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:8081'

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
