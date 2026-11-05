<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getRoleFromAuthResponse, getUserNameFromAuthResponse } from '../auth.js'

const username = ref('')
const password = ref('')
const errorMessage = ref('')

const router = useRouter()

async function login() {
  errorMessage.value = ''

  try {
    const response = await fetch(
      'http://localhost:5044/api/Auth/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username.value,
          password: password.value
        })
      }
    )

    if (!response.ok) {
      throw new Error('Invalid username or password')
    }

    const data = await response.json()
    const role = getRoleFromAuthResponse(data, data.token)
    const displayName = getUserNameFromAuthResponse(data, data.token, username.value)

    if (!['admin', 'manager', 'viewer'].includes(role)) {
      throw new Error('Your account does not have a supported role (admin, manager, or viewer).')
    }

    localStorage.setItem('token', data.token)
    localStorage.setItem('role', role)
    localStorage.setItem('userName', displayName)

    await router.push('/')
  }
  catch (error) {
    errorMessage.value = error.message
  }
}

</script>

<template>
  <main class="login-page container min-vh-100 d-flex align-items-center justify-content-center py-5">
    <div class="card login-card border-0 shadow-sm rounded-4 w-100" style="max-width: 420px">
      <div class="card-body p-4 p-md-5">
        <p class="login-eyebrow text-center mb-2">BRAND PORTAL</p>
        <h1 class="h3 fw-bold text-center mb-2">Welcome back</h1>
        <p class="text-secondary text-center mb-4">Sign in to manage your brands.</p>

        <form @submit.prevent="login">
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input
              id="username"
              v-model.trim="username"
              class="form-control"
              type="text"
              autocomplete="username"
              placeholder="Enter your username"
              required
            />
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              id="password"
              v-model="password"
              class="form-control"
              type="password"
              autocomplete="current-password"
              placeholder="Enter your password"
              required
            />
          </div>

          <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>

          <button class="btn btn-primary w-100" type="submit">
            Log in
          </button>
        </form>
      </div>
    </div>
  </main>
</template>
