<script setup>
import { ref, computed, onMounted } from 'vue'

const movies = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const searchTerm = ref('')
const statusFilter = ref('all')
const sortOrder = ref('year-asc')

const newMovie = ref({
  title: '',
  genre: '',
  releaseYear: '',
  status: 'Watchlist'
})

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL

const filteredMovies = computed(() => {
  let result = [...movies.value]

  if (searchTerm.value.trim()) {
    result = result.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }

  if (statusFilter.value !== 'all') {
    result = result.filter(movie => movie.status === statusFilter.value)
  }

  result.sort((a, b) => {
    if (sortOrder.value === 'year-asc') {
      return (a.releaseYear || 0) - (b.releaseYear || 0)
    }

    if (sortOrder.value === 'year-desc') {
      return (b.releaseYear || 0) - (a.releaseYear || 0)
    }

    if (sortOrder.value === 'title-asc') {
      return a.title.localeCompare(b.title)
    }

    return b.title.localeCompare(a.title)
  })

  return result
})

const watchedCount = computed(() =>
  movies.value.filter(movie => movie.status === 'Watched').length
)

const watchlistCount = computed(() =>
  movies.value.filter(movie => movie.status === 'Watchlist').length
)

async function loadMovies() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(`${baseUrl}/movies`)

    if (!response.ok) {
      throw new Error('Fehler beim Laden der Filme')
    }

    movies.value = await response.json()
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Backend nicht erreichbar.'
  } finally {
    isLoading.value = false
  }
}

async function addMovie() {
  try {
    const response = await fetch(`${baseUrl}/movies`, {
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

    if (!response.ok) {
      throw new Error('Fehler beim Speichern')
    }

    newMovie.value = {
      title: '',
      genre: '',
      releaseYear: '',
      status: 'Watchlist'
    }

    await loadMovies()
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Film konnte nicht gespeichert werden.'
  }
}

async function deleteMovie(id) {
  const confirmed = confirm('Möchtest du diesen Film wirklich löschen?')

  if (!confirmed) {
    return
  }

  try {
    const response = await fetch(`${baseUrl}/movies/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Fehler beim Löschen')
    }

    movies.value = movies.value.filter(movie => movie.id !== id)
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Film konnte nicht gelöscht werden.'
  }
}

onMounted(loadMovies)
</script>

<template>
  <main class="page">
    <section class="hero">
      <p class="eyebrow">Movie Tracker</p>
      <h1>Filmverwaltung</h1>
      <p class="subtitle">
        Verwalte, suche und sortiere deine Filme übersichtlich an einem Ort.
      </p>
    </section>

    <section class="stats-grid">
      <div class="stat-card">
        <span>Gesamt</span>
        <strong>{{ movies.length }}</strong>
      </div>

      <div class="stat-card">
        <span>Watched</span>
        <strong>{{ watchedCount }}</strong>
      </div>

      <div class="stat-card">
        <span>Watchlist</span>
        <strong>{{ watchlistCount }}</strong>
      </div>
    </section>

    <section class="card">
      <h2>Neuen Film hinzufügen</h2>

      <form @submit.prevent="addMovie" class="movie-form">
        <input
          v-model="newMovie.title"
          placeholder="Titel"
          required
        />

        <input
          v-model="newMovie.genre"
          placeholder="Genre"
          required
        />

        <input
          v-model="newMovie.releaseYear"
          type="number"
          placeholder="Erscheinungsjahr"
          required
        />

        <select v-model="newMovie.status" required>
          <option value="Watchlist">Watchlist</option>
          <option value="Watched">Watched</option>
          <option value="Favorite">Favorite</option>
        </select>

        <button type="submit" class="primary-button">
          Film hinzufügen
        </button>
      </form>

      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>
    </section>

    <section class="card">
      <div class="list-header">
        <div>
          <h2>Filmliste</h2>
          <p>{{ filteredMovies.length }} von {{ movies.length }} Filmen angezeigt</p>
        </div>
      </div>

      <div class="controls">
        <input
          v-model="searchTerm"
          placeholder="Nach Titel suchen..."
        />

        <select v-model="statusFilter">
          <option value="all">Alle Status</option>
          <option value="Watchlist">Watchlist</option>
          <option value="Watched">Watched</option>
          <option value="Favorite">Favorite</option>
        </select>

        <select v-model="sortOrder">
          <option value="year-asc">Jahr: älteste zuerst</option>
          <option value="year-desc">Jahr: neueste zuerst</option>
          <option value="title-asc">Titel: A–Z</option>
          <option value="title-desc">Titel: Z–A</option>
        </select>
      </div>

      <p v-if="isLoading" class="empty-state">
        Filme werden geladen ...
      </p>

      <p v-else-if="filteredMovies.length === 0" class="empty-state">
        Keine passenden Filme gefunden.
      </p>

      <ul v-else class="movie-list">
        <li
          v-for="movie in filteredMovies"
          :key="movie.id"
          class="movie-item"
        >
          <div class="movie-info">
            <strong>{{ movie.title }}</strong>
            <span>
              {{ movie.genre || 'Kein Genre' }}
              <template v-if="movie.releaseYear">
                · {{ movie.releaseYear }}
              </template>
              <template v-if="movie.status">
                · {{ movie.status }}
              </template>
            </span>
          </div>

          <button
            class="delete-button"
            @click="deleteMovie(movie.id)"
          >
            Löschen
          </button>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.page {
  min-height: 100vh;
  padding: 48px 20px;
  background:
    linear-gradient(135deg, #eef2ff 0%, #f8fafc 45%, #ecfeff 100%);
  font-family: Inter, Arial, sans-serif;
  color: #111827;
}

.hero,
.card,
.stats-grid {
  max-width: 760px;
  margin: 0 auto 24px;
}

.hero {
  padding: 20px 4px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #2563eb;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

h1 {
  margin: 0;
  font-size: 42px;
  color: #0f172a;
}

.subtitle {
  margin-top: 10px;
  color: #64748b;
  font-size: 17px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.stat-card,
.card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e5e7eb;
  border-radius: 22px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
}

.stat-card {
  padding: 18px;
}

.stat-card span {
  display: block;
  color: #64748b;
  font-size: 14px;
  font-weight: 700;
}

.stat-card strong {
  display: block;
  margin-top: 6px;
  color: #0f172a;
  font-size: 30px;
}

.card {
  padding: 28px;
}

h2 {
  margin: 0 0 18px;
  font-size: 24px;
  color: #0f172a;
}

.movie-form,
.controls {
  display: grid;
  gap: 14px;
}

.controls {
  grid-template-columns: 1.5fr 1fr 1fr;
  margin-bottom: 18px;
}

input,
select {
  width: 100%;
  box-sizing: border-box;
  padding: 14px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  background: #ffffff;
  font-size: 15px;
  outline: none;
}

input:focus,
select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}

button {
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.primary-button {
  padding: 14px 18px;
  background: #2563eb;
  color: white;
  font-size: 15px;
}

.primary-button:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.error-message {
  margin: 16px 0 0;
  padding: 12px 14px;
  border-radius: 12px;
  background: #fee2e2;
  color: #991b1b;
  font-weight: 600;
}

.list-header p {
  margin: -10px 0 18px;
  color: #64748b;
}

.empty-state {
  margin: 0;
  padding: 18px;
  border-radius: 14px;
  background: #f8fafc;
  color: #64748b;
}

.movie-list {
  display: grid;
  gap: 12px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.movie-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
}

.movie-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.movie-info strong {
  font-size: 17px;
  color: #0f172a;
}

.movie-info span {
  color: #64748b;
  font-size: 14px;
}

.delete-button {
  padding: 10px 14px;
  background: #fee2e2;
  color: #b91c1c;
}

.delete-button:hover {
  background: #ef4444;
  color: white;
}

@media (max-width: 700px) {
  h1 {
    font-size: 34px;
  }

  .card {
    padding: 22px;
  }

  .stats-grid,
  .controls {
    grid-template-columns: 1fr;
  }

  .movie-item {
    align-items: stretch;
    flex-direction: column;
  }

  .delete-button {
    width: 100%;
  }
}
</style>
