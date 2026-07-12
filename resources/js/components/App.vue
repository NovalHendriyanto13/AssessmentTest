<template>
  <div class="app-container">
    <!-- Header/Navigation Bar (visible when logged in) -->
    <header v-if="token" class="app-header">
      <div class="header-content">
        <div class="brand" @click="navigateTo('movies')">
          <svg class="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="6" fill="url(#logo-grad)"/>
            <path d="M7 17V7H10L12 11L14 7H17V17H14V11.5L12 14.5L10 11.5V17H7Z" fill="white"/>
            <defs>
              <linearGradient id="logo-grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop stop-color="#E50914"/>
                <stop offset="1" stop-color="#B81D24"/>
              </linearGradient>
            </defs>
          </svg>
          <span class="brand-name">Flix<span class="red-text">Net</span></span>
        </div>

        <nav class="nav-links">
          <button 
            :class="['nav-btn', { active: page === 'movies' || page === 'detail' }]"
            @click="navigateTo('movies')"
          >
            {{ t('movies_list') }}
          </button>
          <button 
            :class="['nav-btn', { active: page === 'favorites' }]"
            @click="navigateTo('favorites')"
          >
            {{ t('favorites_list') }}
            <span v-if="favorites.length > 0" class="fav-count">{{ favorites.length }}</span>
          </button>
        </nav>

        <div class="header-right">
          <!-- Multi-language Toggle -->
          <div class="lang-switch">
            <button 
              :class="['lang-btn', { active: locale === 'en' }]" 
              @click="toggleLocale('en')"
            >
              EN
            </button>
            <span class="divider">|</span>
            <button 
              :class="['lang-btn', { active: locale === 'id' }]" 
              @click="toggleLocale('id')"
            >
              ID
            </button>
          </div>

          <!-- User Info & Logout -->
          <div class="user-menu" v-if="user">
            <span class="user-greeting">{{ t('welcome') }}, <strong>{{ user.name }}</strong></span>
            <button @click="logout" class="logout-btn">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
              {{ t('logout') }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="app-main">
      <!-- 1. LOGIN PAGE -->
      <section v-if="page === 'login'" class="login-section">
        <!-- Floating shapes for aesthetics -->
        <div class="glow-orb orb-1"></div>
        <div class="glow-orb orb-2"></div>
        
        <div class="login-card-container">
          <div class="login-header">
            <div class="login-logo">
              <span class="brand-name font-huge">Flix<span class="red-text">Net</span></span>
            </div>
            <p class="login-subtitle">{{ t('technical_test') }}</p>
            <div class="lang-switch-login">
              <button :class="['lang-btn', { active: locale === 'en' }]" @click="toggleLocale('en')">English</button>
              <span class="divider">/</span>
              <button :class="['lang-btn', { active: locale === 'id' }]" @click="toggleLocale('id')">Indonesia</button>
            </div>
          </div>

          <div class="login-card">
            <h2 class="card-title">{{ t('login') }}</h2>
            <p class="card-desc">{{ t('instructions') }}</p>

            <form @submit.prevent="login" class="login-form">
              <div v-if="errorMsg" class="error-banner">
                <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{{ errorMsg }}</span>
              </div>

              <div class="form-group">
                <label for="username">{{ t('username') }}</label>
                <div class="input-wrapper">
                  <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input 
                    type="text" 
                    id="username" 
                    v-model="loginData.username" 
                    placeholder="e.g. aldmic" 
                    required 
                    autocomplete="off"
                    :disabled="loading"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="password">{{ t('password') }}</label>
                <div class="input-wrapper">
                  <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input 
                    type="password" 
                    id="password" 
                    v-model="loginData.password" 
                    placeholder="••••••••" 
                    required 
                    :disabled="loading"
                  />
                </div>
              </div>

              <button type="submit" class="submit-btn" :disabled="loading">
                <span v-if="loading" class="spinner"></span>
                <span v-else>{{ t('login') }}</span>
              </button>
            </form>

            <div class="credentials-hint">
              <p>💡 <strong>Hint Kredensial:</strong></p>
              <p>Username: <code>aldmic</code></p>
              <p>Password: <code>123abc123</code></p>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. MOVIE LIST PAGE -->
      <section v-if="page === 'movies'" class="movies-section">
        <div class="movies-container">
          <!-- Filters & Search Bar -->
          <div class="search-bar-container">
            <form @submit.prevent="triggerSearch" class="search-form">
              <div class="search-input-group">
                <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input 
                  type="text" 
                  v-model="searchQuery" 
                  :placeholder="t('search_placeholder')"
                  class="search-input"
                />
              </div>

              <div class="filter-controls">
                <input 
                  type="text" 
                  v-model="searchYear" 
                  :placeholder="t('year_placeholder')"
                  class="year-input"
                  maxLength="4"
                />

                <select v-model="searchType" class="type-select">
                  <option value="">{{ t('type_all') }}</option>
                  <option value="movie">{{ t('type_movie') }}</option>
                  <option value="series">{{ t('type_series') }}</option>
                  <option value="episode">{{ t('type_episode') }}</option>
                </select>

                <button type="submit" class="search-submit-btn">
                  Cari
                </button>
              </div>
            </form>
          </div>

          <!-- Loading Indicator (Initial Search) -->
          <div v-if="loading && movies.length === 0" class="loading-state">
            <div class="spinner-large"></div>
            <p>Searching OMDb database...</p>
          </div>

          <!-- Movies Grid -->
          <div v-else-if="movies.length > 0" class="movies-grid">
            <div 
              v-for="movie in movies" 
              :key="movie.imdbID" 
              class="movie-card"
              @click="viewDetail(movie.imdbID)"
            >
              <!-- Image Lazy Loader Container -->
              <div class="movie-poster-wrapper">
                <lazy-image :src="movie.Poster" :alt="movie.Title"></lazy-image>
                <div class="movie-card-overlay">
                  <button 
                    class="fav-toggle-card-btn" 
                    @click.stop="toggleFavorite(movie)"
                    :title="isFav(movie.imdbID) ? t('remove_favorite') : t('add_favorite')"
                  >
                    <svg 
                      class="heart-icon" 
                      :class="{ 'is-fav': isFav(movie.imdbID) }" 
                      viewBox="0 0 24 24" 
                      fill="currentColor" 
                      stroke="currentColor" 
                      stroke-width="2"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                  <span class="movie-type-badge">{{ movie.Type }}</span>
                </div>
              </div>
              
              <div class="movie-info">
                <h3 class="movie-title">{{ movie.Title }}</h3>
                <span class="movie-year">{{ movie.Year }}</span>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="!loading" class="empty-state">
            <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
            <h3>{{ t('no_movies') }}</h3>
            <p>Cobalah mengetik judul film lain atau bersihkan filter pencarian.</p>
          </div>

          <!-- Bottom Infinite Scroll Loader -->
          <div v-if="loadingMore" class="infinite-loader">
            <div class="spinner-small"></div>
            <span>Loading more titles...</span>
          </div>

          <!-- Invisible detector div for infinite scroll -->
          <div id="infinite-scroll-trigger" class="scroll-trigger"></div>
        </div>
      </section>

      <!-- 3. DETAIL MOVIE PAGE -->
      <section v-if="page === 'detail'" class="detail-section">
        <div v-if="loading" class="loading-state">
          <div class="spinner-large"></div>
          <p>Fetching movie details...</p>
        </div>

        <div v-else-if="selectedMovie" class="detail-container">
          <button @click="navigateTo('movies')" class="back-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            {{ t('back_to_list') }}
          </button>

          <div class="detail-grid">
            <div class="detail-poster-sec">
              <div class="detail-poster-card">
                <lazy-image :src="selectedMovie.Poster" :alt="selectedMovie.Title"></lazy-image>
                <div class="detail-actions">
                  <button 
                    :class="['fav-action-btn', { 'is-favorite': isFav(selectedMovie.imdbID) }]"
                    @click="toggleFavorite(selectedMovie)"
                  >
                    <svg 
                      class="heart-icon" 
                      viewBox="0 0 24 24" 
                      fill="currentColor" 
                      stroke="currentColor" 
                      stroke-width="2"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    <span>
                      {{ isFav(selectedMovie.imdbID) ? t('remove_favorite') : t('add_favorite') }}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div class="detail-info-sec">
              <div class="detail-header-block">
                <span class="detail-type-badge">{{ selectedMovie.Type }}</span>
                <h1 class="detail-title">{{ selectedMovie.Title }}</h1>
                <div class="detail-meta">
                  <span class="meta-item">{{ selectedMovie.Year }}</span>
                  <span class="meta-separator">•</span>
                  <span class="meta-item">{{ selectedMovie.Rated }}</span>
                  <span class="meta-separator">•</span>
                  <span class="meta-item">{{ selectedMovie.Runtime }}</span>
                </div>
              </div>

              <!-- Ratings -->
              <div class="detail-ratings" v-if="selectedMovie.imdbRating && selectedMovie.imdbRating !== 'N/A'">
                <div class="rating-badge">
                  <svg class="star-icon" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <span class="rating-value">{{ selectedMovie.imdbRating }}</span>
                  <span class="rating-scale">/10</span>
                </div>
                <span class="rating-votes">{{ selectedMovie.imdbVotes }} {{ t('votes') }}</span>
              </div>

              <div class="detail-body">
                <div class="detail-info-row">
                  <span class="row-label">{{ t('genre') }}</span>
                  <span class="row-value">{{ selectedMovie.Genre }}</span>
                </div>
                <div class="detail-info-row">
                  <span class="row-label">{{ t('director') }}</span>
                  <span class="row-value">{{ selectedMovie.Director }}</span>
                </div>
                <div class="detail-info-row" v-if="selectedMovie.Writer && selectedMovie.Writer !== 'N/A'">
                  <span class="row-label">{{ t('writer') }}</span>
                  <span class="row-value">{{ selectedMovie.Writer }}</span>
                </div>
                <div class="detail-info-row">
                  <span class="row-label">{{ t('actors') }}</span>
                  <span class="row-value">{{ selectedMovie.Actors }}</span>
                </div>
                <div class="detail-info-row" v-if="selectedMovie.Language && selectedMovie.Language !== 'N/A'">
                  <span class="row-label">{{ t('language') }}</span>
                  <span class="row-value">{{ selectedMovie.Language }}</span>
                </div>
                <div class="detail-info-row" v-if="selectedMovie.Released && selectedMovie.Released !== 'N/A'">
                  <span class="row-label">{{ t('released') }}</span>
                  <span class="row-value">{{ selectedMovie.Released }}</span>
                </div>

                <div class="detail-plot-block">
                  <h3 class="plot-title">{{ t('plot') }}</h3>
                  <p class="plot-text">{{ selectedMovie.Plot }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. FAVORITES PAGE -->
      <section v-if="page === 'favorites'" class="favorites-section">
        <div class="favorites-container">
          <h2 class="section-title">{{ t('favorites_list') }}</h2>

          <div v-if="isFavoriteLoading" class="loading-state">
            <div class="spinner-large"></div>
            <p>Loading your favorite movies...</p>
          </div>

          <div v-else-if="favorites.length > 0" class="movies-grid">
            <div 
              v-for="movie in favorites" 
              :key="movie.imdb_id" 
              class="movie-card"
              @click="viewDetail(movie.imdb_id)"
            >
              <div class="movie-poster-wrapper">
                <lazy-image :src="movie.poster" :alt="movie.title"></lazy-image>
                <div class="movie-card-overlay">
                  <button 
                    class="fav-toggle-card-btn delete-btn" 
                    @click.stop="toggleFavorite({ imdbID: movie.imdb_id, Title: movie.title })"
                    :title="t('remove_favorite')"
                  >
                    <svg class="delete-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                  </button>
                  <span class="movie-type-badge">{{ movie.type }}</span>
                </div>
              </div>
              
              <div class="movie-info">
                <h3 class="movie-title">{{ movie.title }}</h3>
                <span class="movie-year">{{ movie.year }}</span>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="empty-state">
            <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <h3>{{ t('no_favorites') }}</h3>
            <p>Tambahkan film yang Anda suka ke daftar favorit Anda lewat halaman pencarian!</p>
          </div>
        </div>
      </section>
    </main>

    <footer class="app-footer">
      <div class="footer-content">
        <p>&copy; 2026 FlixNet Movie Database. Built with Laravel 5.8 & Vue.js.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import axios from 'axios';

// Inner Lazy Image Component for lazy loading poster images
const LazyImage = {
  name: 'LazyImage',
  props: {
    src: { type: String, required: true },
    alt: { type: String, default: '' }
  },
  data() {
    return {
      intersected: false,
      loaded: false
    };
  },
  template: `
    <div class="lazy-image-container">
      <div v-if="!loaded" class="lazy-image-placeholder">
        <svg class="lazy-image-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        <div class="image-shimmer"></div>
      </div>
      <img 
        v-if="intersected"
        :src="realSrc" 
        :alt="alt" 
        @load="onImageLoad"
        :class="['lazy-real-image', { 'is-loaded': loaded }]"
      />
    </div>
  `,
  computed: {
    realSrc() {
      if (!this.src || this.src === 'N/A') {
        // Fallback movie poster placeholder
        return 'https://via.placeholder.com/300x450/111827/FFFFFF?text=No+Poster';
      }
      return this.src;
    }
  },
  mounted() {
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.intersected = true;
        this.observer.disconnect();
      }
    }, {
      rootMargin: '100px' // Start loading image 100px before viewport entry
    });
    this.observer.observe(this.$el);
  },
  destroyed() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  methods: {
    onImageLoad() {
      this.loaded = true;
    }
  }
};

export default {
  components: {
    'lazy-image': LazyImage
  },
  data() {
    return {
      page: 'login',
      locale: 'en',
      token: localStorage.getItem('jwt_token') || '',
      user: null,
      
      // Login Form Data
      loginData: {
        username: '',
        password: ''
      },

      // Movie Search & Listing
      searchQuery: 'Batman', // default search on loading
      searchYear: '',
      searchType: '',
      movies: [],
      pageNumber: 1,
      totalResults: 0,
      loading: false,
      loadingMore: false,

      // Detail Page
      selectedMovieId: '',
      selectedMovie: null,

      // Favorites List
      favorites: [],
      isFavoriteLoading: false,

      // Error/Success state
      errorMsg: '',
      successMsg: '',

      // Dictionary
      translations: {
        en: {
          login: 'Log In',
          username: 'Username',
          password: 'Password',
          login_error: 'Invalid username or password.',
          search_placeholder: 'Search movies, series...',
          year_placeholder: 'Year',
          type_all: 'All Types',
          type_movie: 'Movie',
          type_series: 'Series',
          type_episode: 'Episode',
          movies_list: 'Movies List',
          favorites_list: 'My Favorites',
          logout: 'Log Out',
          no_movies: 'No movies found. Try another search!',
          no_favorites: 'You have not added any favorites yet.',
          add_favorite: 'Add to Favorites',
          remove_favorite: 'Remove from Favorites',
          back_to_list: 'Back to List',
          detail_title: 'Movie Detail',
          genre: 'Genre',
          director: 'Director',
          writer: 'Writer',
          actors: 'Actors',
          plot: 'Plot',
          language: 'Language',
          released: 'Released',
          runtime: 'Runtime',
          rating: 'IMDb Rating',
          votes: 'Votes',
          welcome: 'Welcome back',
          technical_test: 'Web Developer Technical Test',
          instructions: 'Please enter your credentials to access FlixNet.'
        },
        id: {
          login: 'Masuk',
          username: 'Nama Pengguna',
          password: 'Kata Sandi',
          login_error: 'Nama pengguna atau kata sandi salah.',
          search_placeholder: 'Cari film, serial...',
          year_placeholder: 'Tahun',
          type_all: 'Semua Tipe',
          type_movie: 'Film',
          type_series: 'Serial',
          type_episode: 'Episode',
          movies_list: 'Daftar Film',
          favorites_list: 'Favorit Saya',
          logout: 'Keluar',
          no_movies: 'Film tidak ditemukan. Coba pencarian lain!',
          no_favorites: 'Anda belum menambahkan film favorit.',
          add_favorite: 'Tambah ke Favorit',
          remove_favorite: 'Hapus dari Favorit',
          back_to_list: 'Kembali ke Daftar',
          detail_title: 'Detail Film',
          genre: 'Genre',
          director: 'Sutradara',
          writer: 'Penulis',
          actors: 'Aktor',
          plot: 'Sinopsis',
          language: 'Bahasa',
          released: 'Rilis',
          runtime: 'Durasi',
          rating: 'Rating IMDb',
          votes: 'Suara',
          welcome: 'Selamat datang kembali',
          technical_test: 'Tes Teknis Pengembang Web',
          instructions: 'Silakan masukkan kredensial Anda untuk mengakses FlixNet.'
        }
      }
    };
  },
  methods: {
    t(key) {
      return this.translations[this.locale][key] || key;
    },
    toggleLocale(lang) {
      this.locale = lang;
    },
    navigateTo(pageName) {
      this.page = pageName;
      this.errorMsg = '';
      this.successMsg = '';

      if (pageName === 'movies') {
        // Automatically check/reset search query if empty
        if (this.movies.length === 0) {
          this.fetchMovies(false);
        }
        this.$nextTick(() => {
          this.initInfiniteScroll();
        });
      } else if (pageName === 'favorites') {
        this.fetchFavorites();
      }
    },
    setAxiosHeader() {
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      } else {
        delete axios.defaults.headers.common['Authorization'];
      }
    },
    login() {
      this.loading = true;
      this.errorMsg = '';

      axios.post('/api/login', {
        username: this.loginData.username,
        password: this.loginData.password
      })
      .then(response => {
        if (response.data && response.data.success) {
          const data = response.data.data;
          this.token = data.access_token;
          localStorage.setItem('jwt_token', this.token);
          this.setAxiosHeader();
          this.fetchUserProfile();
          this.fetchFavorites();
          this.navigateTo('movies');
        } else {
          this.errorMsg = this.t('login_error');
        }
      })
      .catch(error => {
        console.error(error);
        const errData = error.response?.data?.data;
        if (errData && errData.debug_info) {
          this.errorMsg = `${this.t('login_error')} (${errData.debug_info})`;
        } else if (error.response && error.response.status === 411) {
          this.errorMsg = this.t('login_error');
        } else {
          this.errorMsg = error.response?.data?.message || 'Login failed. Please try again.';
        }
      })
      .finally(() => {
        this.loading = false;
      });
    },
    logout() {
      this.token = '';
      this.user = null;
      this.movies = [];
      this.favorites = [];
      localStorage.removeItem('jwt_token');
      this.setAxiosHeader();
      this.navigateTo('login');
      this.loginData.password = '';
    },
    fetchUserProfile() {
      axios.get('/api/me')
        .then(response => {
          if (response.data && response.data.success) {
            this.user = response.data.data;
          }
        })
        .catch(err => {
          console.error('Failed to get user profile', err);
          // If token expired, log out
          if (err.response && (err.response.status === 401 || err.response.status === 400)) {
            this.logout();
          }
        });
    },
    fetchMovies(loadMore = false) {
      if (this.loading || this.loadingMore) return;

      if (loadMore) {
        this.loadingMore = true;
        this.pageNumber++;
      } else {
        this.loading = true;
        this.pageNumber = 1;
        this.movies = [];
      }

      axios.get('/api/movies', {
        params: {
          s: this.searchQuery,
          page: this.pageNumber,
          y: this.searchYear,
          type: this.searchType
        }
      })
      .then(response => {
        if (response.data && response.data.success) {
          const data = response.data.data;
          if (data.Search) {
            if (loadMore) {
              this.movies = [...this.movies, ...data.Search];
            } else {
              this.movies = data.Search;
            }
            this.totalResults = parseInt(data.totalResults) || 0;
          } else {
            this.totalResults = 0;
            if (!loadMore) this.movies = [];
          }
        }
      })
      .catch(error => {
        console.error(error);
        if (!loadMore) this.movies = [];
      })
      .finally(() => {
        this.loading = false;
        this.loadingMore = false;
      });
    },
    triggerSearch() {
      this.fetchMovies(false);
    },
    viewDetail(imdbId) {
      this.selectedMovieId = imdbId;
      this.selectedMovie = null;
      this.navigateTo('detail');
      this.loading = true;

      axios.get(`/api/movies/${imdbId}`)
        .then(response => {
          if (response.data && response.data.success) {
            this.selectedMovie = response.data.data;
          }
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    fetchFavorites() {
      if (!this.token) return;
      this.isFavoriteLoading = true;
      axios.get('/api/favorites')
        .then(response => {
          if (response.data && response.data.success) {
            this.favorites = response.data.data;
          }
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          this.isFavoriteLoading = false;
        });
    },
    isFav(imdbId) {
      return this.favorites.some(f => f.imdb_id === imdbId);
    },
    toggleFavorite(movie) {
      const imdbId = movie.imdbID || movie.imdb_id;
      const isCurrentlyFav = this.isFav(imdbId);

      if (isCurrentlyFav) {
        // Remove from favorite
        axios.delete(`/api/favorites/${imdbId}`)
          .then(response => {
            if (response.data && response.data.success) {
              this.favorites = this.favorites.filter(f => f.imdb_id !== imdbId);
            }
          })
          .catch(error => console.error(error));
      } else {
        // Add to favorite
        axios.post('/api/favorites', {
          imdb_id: movie.imdbID,
          title: movie.Title,
          year: movie.Year,
          type: movie.Type,
          poster: movie.Poster
        })
        .then(response => {
          if (response.data && response.data.success) {
            this.favorites.unshift(response.data.data);
          }
        })
        .catch(error => console.error(error));
      }
    },
    initInfiniteScroll() {
      // Setup intersection observer for bottom trigger
      if (this.scrollObserver) {
        this.scrollObserver.disconnect();
      }

      this.$nextTick(() => {
        const trigger = document.getElementById('infinite-scroll-trigger');
        if (!trigger) return;

        this.scrollObserver = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting && this.movies.length > 0 && this.movies.length < this.totalResults) {
            this.fetchMovies(true);
          }
        }, {
          root: null,
          rootMargin: '200px' // Load next page 200px before hitting bottom
        });

        this.scrollObserver.observe(trigger);
      });
    }
  },
  created() {
    this.setAxiosHeader();
    if (this.token) {
      this.fetchUserProfile();
      this.fetchFavorites();
      this.navigateTo('movies');
    } else {
      this.navigateTo('login');
    }
  },
  destroyed() {
    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
    }
  }
};
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
}

/* Header & Nav Styling */
.app-header {
  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
}
.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.8rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}
.logo-icon {
  width: 2.2rem;
  height: 2.2rem;
}
.brand-name {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: #fff;
}
.red-text {
  color: #E50914;
}
.nav-links {
  display: flex;
  gap: 1.5rem;
}
.nav-btn {
  background: none;
  border: none;
  color: #9CA3AF;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.5rem 0.8rem;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  position: relative;
}
.nav-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}
.nav-btn.active {
  color: #fff;
}
.nav-btn.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 15%;
  width: 70%;
  height: 3px;
  background: #E50914;
  border-radius: 2px;
}
.fav-count {
  background: #E50914;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.1rem 0.4rem;
  border-radius: 99px;
  margin-left: 0.3rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* Language switch */
.lang-switch {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #4B5563;
}
.lang-btn {
  background: none;
  border: none;
  color: #6B7280;
  cursor: pointer;
  font-weight: 700;
  padding: 0.2rem 0.4rem;
  transition: color 0.2s ease;
}
.lang-btn:hover, .lang-btn.active {
  color: #fff;
}
.divider {
  user-select: none;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.user-greeting {
  font-size: 0.9rem;
  color: #D1D5DB;
}
.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(229, 9, 20, 0.1);
  color: #EF4444;
  border: 1px solid rgba(229, 9, 20, 0.2);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.logout-btn:hover {
  background: #E50914;
  color: white;
  border-color: #E50914;
  box-shadow: 0 0 12px rgba(229, 9, 20, 0.3);
}
.btn-icon {
  width: 1.1rem;
  height: 1.1rem;
}

/* Main Area */
.app-main {
  flex: 1;
  width: 100%;
}

/* --- LOGIN SCREEN --- */
.login-section {
  position: relative;
  min-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow: hidden;
}
/* Background ambient glow */
.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  z-index: 0;
  opacity: 0.15;
}
.orb-1 {
  background: #E50914;
  width: 350px;
  height: 350px;
  top: 10%;
  left: 15%;
}
.orb-2 {
  background: #2563EB;
  width: 400px;
  height: 400px;
  bottom: 10%;
  right: 15%;
}

.login-card-container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.login-header {
  text-align: center;
}
.font-huge {
  font-size: 2.8rem;
}
.login-subtitle {
  color: #9CA3AF;
  font-size: 0.95rem;
  margin-top: 0.5rem;
  font-weight: 500;
}
.lang-switch-login {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.8rem;
}

.login-card {
  background: rgba(17, 24, 30, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}
.card-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #fff;
}
.card-desc {
  color: #9CA3AF;
  font-size: 0.88rem;
  margin: 0 0 1.8rem 0;
  line-height: 1.4;
}
.error-banner {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #F87171;
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 0.85rem;
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.error-icon {
  width: 1.2rem;
  height: 1.2rem;
  flex-shrink: 0;
}

.form-group {
  margin-bottom: 1.2rem;
}
.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #D1D5DB;
}
.input-wrapper {
  position: relative;
}
.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.1rem;
  height: 1.1rem;
  color: #6B7280;
}
.input-wrapper input {
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 0.8rem 1rem 0.8rem 2.6rem;
  color: #fff;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  box-sizing: border-box;
}
.input-wrapper input:focus {
  outline: none;
  border-color: #E50914;
  box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.15);
  background: rgba(255, 255, 255, 0.06);
}

.submit-btn {
  width: 100%;
  background: #E50914;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.9rem;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.submit-btn:hover {
  background: #F43F5E;
  box-shadow: 0 4px 15px rgba(229, 9, 20, 0.4);
}
.submit-btn:disabled {
  background: #6B7280;
  cursor: not-allowed;
  box-shadow: none;
}

.credentials-hint {
  margin-top: 1.5rem;
  padding-top: 1.2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.8rem;
  color: #9CA3AF;
}
.credentials-hint p {
  margin: 0.2rem 0;
}
.credentials-hint code {
  color: #E50914;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.1rem 0.3rem;
  border-radius: 4px;
}

/* Spinner */
.spinner {
  width: 1.2rem;
  height: 1.2rem;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* --- MOVIE SEARCH & LIST --- */
.movies-section, .favorites-section, .detail-section {
  padding: 2rem 1.5rem;
}
.movies-container, .favorites-container, .detail-container {
  max-width: 1200px;
  margin: 0 auto;
}

.search-bar-container {
  background: rgba(17, 24, 39, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.2rem;
  margin-bottom: 2rem;
}
.search-form {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
}
@media (max-width: 768px) {
  .search-form {
    grid-template-columns: 1fr;
  }
}
.search-input-group {
  position: relative;
}
.search-icon {
  position: absolute;
  left: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.2rem;
  height: 1.2rem;
  color: #9CA3AF;
}
.search-input {
  width: 100%;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 0.8rem 1rem 0.8rem 3rem;
  color: #fff;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}
.search-input:focus {
  outline: none;
  border-color: #E50914;
  box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.15);
}

.filter-controls {
  display: flex;
  gap: 0.8rem;
}
@media (max-width: 480px) {
  .filter-controls {
    flex-direction: column;
  }
}
.year-input, .type-select, .search-submit-btn {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 0.8rem 1rem;
  color: #fff;
  font-size: 0.9rem;
  outline: none;
  box-sizing: border-box;
  transition: all 0.2s ease;
}
.type-select option {
  background: #111827;
  color: #fff;
}
.year-input {
  width: 80px;
  text-align: center;
}
@media (max-width: 480px) {
  .year-input {
    width: 100%;
  }
}
.year-input:focus, .type-select:focus {
  border-color: #E50914;
}

.search-submit-btn {
  background: #E50914;
  border: none;
  font-weight: 700;
  cursor: pointer;
}
.search-submit-btn:hover {
  background: #F43F5E;
}

/* Movies Grid Layout */
.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 2rem;
  margin-top: 1rem;
}
@media (max-width: 480px) {
  .movies-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1rem;
  }
}

.movie-card {
  background: rgba(31, 41, 55, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
}
.movie-card:hover {
  transform: translateY(-8px);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.3);
  background: rgba(31, 41, 55, 0.5);
}

.movie-poster-wrapper {
  position: relative;
  aspect-ratio: 2/3;
  width: 100%;
  background: #111827;
  overflow: hidden;
}

/* Card Overlay Details */
.movie-card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 40%, rgba(0,0,0,0.8) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.8rem;
  pointer-events: none;
}
.movie-card:hover .movie-card-overlay {
  opacity: 1;
}

.fav-toggle-card-btn {
  background: rgba(17, 24, 39, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
  align-self: flex-end;
  transition: all 0.2s ease;
}
.fav-toggle-card-btn:hover {
  transform: scale(1.1);
  background: #111827;
}
.heart-icon {
  width: 1.1rem;
  height: 1.1rem;
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.2s ease;
}
.heart-icon.is-fav {
  color: #E50914;
  fill: #E50914;
  filter: drop-shadow(0 0 4px rgba(229, 9, 20, 0.5));
}
.delete-icon {
  width: 1.1rem;
  height: 1.1rem;
  color: #EF4444;
}

.movie-type-badge {
  background: rgba(229, 9, 20, 0.9);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  align-self: flex-start;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.movie-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
}
.movie-title {
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0;
  color: #fff;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.movie-year {
  font-size: 0.8rem;
  color: #9CA3AF;
  font-weight: 600;
}

/* Loading & Empty States */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
  gap: 1.5rem;
  color: #9CA3AF;
}
.spinner-large {
  width: 3rem;
  height: 3rem;
  border: 4px solid rgba(229, 9, 20, 0.15);
  border-top-color: #E50914;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.spinner-small {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid rgba(229, 9, 20, 0.15);
  border-top-color: #E50914;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.empty-state {
  text-align: center;
  padding: 5rem 2rem;
  background: rgba(31, 41, 55, 0.15);
  border: 1px dashed rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  color: #9CA3AF;
  max-width: 500px;
  margin: 2rem auto;
}
.empty-icon {
  width: 3.5rem;
  height: 3.5rem;
  color: #4B5563;
  margin-bottom: 1.2rem;
}
.empty-state h3 {
  font-size: 1.3rem;
  color: #fff;
  margin: 0 0 0.5rem 0;
}
.empty-state p {
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.5;
}

.infinite-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  padding: 2.5rem 0;
  color: #9CA3AF;
  font-size: 0.9rem;
}
.scroll-trigger {
  height: 40px;
}

/* --- DETAIL PAGE --- */
.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #fff;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 2rem;
}
.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(-4px);
}

.detail-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 3rem;
}
@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.detail-poster-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.5);
  background: #111827;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.detail-poster-card img {
  width: 100%;
  display: block;
}
.detail-actions {
  padding: 1.2rem;
}
.fav-action-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #fff;
}
.fav-action-btn:hover {
  background: rgba(255, 255, 255, 0.10);
}
.fav-action-btn.is-favorite {
  background: rgba(229, 9, 20, 0.15);
  border-color: rgba(229, 9, 20, 0.3);
  color: #F87171;
}
.fav-action-btn.is-favorite:hover {
  background: #E50914;
  color: white;
  border-color: #E50914;
  box-shadow: 0 4px 15px rgba(229, 9, 20, 0.3);
}

.detail-header-block {
  margin-bottom: 1.5rem;
}
.detail-type-badge {
  background: #E50914;
  color: white;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  display: inline-block;
  margin-bottom: 0.8rem;
}
.detail-title {
  font-size: 2.8rem;
  font-weight: 800;
  margin: 0 0 0.8rem 0;
  line-height: 1.2;
  color: #fff;
  letter-spacing: -0.5px;
}
@media (max-width: 480px) {
  .detail-title {
    font-size: 2rem;
  }
}
.detail-meta {
  display: flex;
  gap: 0.8rem;
  align-items: center;
  color: #9CA3AF;
  font-size: 0.95rem;
  font-weight: 500;
}

.detail-ratings {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: inline-flex;
}
.rating-badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.star-icon {
  width: 1.3rem;
  height: 1.3rem;
  color: #FBBF24;
}
.rating-value {
  font-size: 1.3rem;
  font-weight: 800;
  color: #fff;
}
.rating-scale {
  font-size: 0.9rem;
  color: #6B7280;
}
.rating-votes {
  font-size: 0.85rem;
  color: #9CA3AF;
}

.detail-body {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.detail-info-row {
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 0.8rem;
}
@media (max-width: 480px) {
  .detail-info-row {
    flex-direction: column;
    gap: 0.3rem;
  }
}
.row-label {
  width: 140px;
  font-weight: 700;
  color: #6B7280;
  flex-shrink: 0;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}
.row-value {
  color: #E5E7EB;
  font-size: 0.95rem;
  line-height: 1.4;
}

.detail-plot-block {
  margin-top: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
}
.plot-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 0.8rem 0;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.plot-text {
  font-size: 1rem;
  color: #D1D5DB;
  line-height: 1.6;
  margin: 0;
}

/* --- FAVORITES PAGE SPECIFIC --- */
.section-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 1.5rem 0;
}

/* Footer */
.app-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: 2rem 0;
  text-align: center;
  color: #4B5563;
  font-size: 0.85rem;
  background: #090C15;
  position: relative;
  z-index: 10;
}
.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

/* --- LAZY IMAGE COMPONENT STYLES --- */
</style>

<style>
/* Global unscoped helper classes for the inner LazyImage component */
.lazy-image-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0B0F19;
}
.lazy-image-placeholder {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #111827;
  color: #374151;
}
.lazy-image-icon {
  width: 2.5rem;
  height: 2.5rem;
}
.image-shimmer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.02) 20%,
    rgba(255, 255, 255, 0.04) 60%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.lazy-real-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.4s ease;
}
.lazy-real-image.is-loaded {
  opacity: 1;
}
</style>
