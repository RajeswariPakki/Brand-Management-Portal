<script setup>
import { ref } from 'vue'
import { getCurrentUserName } from '../auth.js'
import BrandForm from './BrandForm.vue'
import BrandList from './BrandList.vue'
import { useBrandManagement } from './useBrandManagement.js'

const {
  role, canManageBrands, canDeleteBrands, loading, saving, errorMessage, successMessage, nameError, categoryError,
  searchTerm, selectedCategory, selectedStatus, currentPage, isEditing, form,
  filteredBrands, categories, totalPages, paginatedBrands, PAGE_SIZE,
  loadBrands, resetForm, logout, formatDate, editBrand, previousPage, nextPage,
  saveBrand, deleteBrand
} = useBrandManagement()

const showForm = ref(false)
const userName = (getCurrentUserName() || 'there').replace(/^./, (firstLetter) => firstLetter.toUpperCase())

function openAddForm() {
  resetForm()
  showForm.value = true
}

function cancelForm() {
  resetForm()
  showForm.value = false
}

function openEditForm(brand) {
  editBrand(brand)
  showForm.value = true
}

async function handleSave() {
  if (await saveBrand()) showForm.value = false
}
</script>

<template>
  <div class="app-background min-vh-100 py-4 py-lg-5">
    <div class="container">
      <header class="portal-header mb-4">
        <div class="portal-hero-copy">
          <p class="portal-eyebrow mb-1">BRAND PORTAL</p>
          <div class="portal-welcome mb-3">
            <p class="portal-greeting mb-1">Welcome back, {{ userName }}!</p>
            <p class="portal-welcome-copy mb-0">Your workspace is ready. Let’s build brands people remember.</p>
          </div>
          <h1 class="fw-bold mb-1">Brand Management</h1>
          <p class="text-secondary mb-0">Manage your brands in one place.</p>
        </div>
        <div class="portal-header-actions">
          <span class="role-chip" :aria-label="`Signed in as ${role}`">
            <span class="role-chip-dot" aria-hidden="true"></span>
            <span class="role-chip-label">{{ role }} account</span>
          </span>
          <button v-if="canManageBrands" class="btn btn-primary" @click="openAddForm">+ Add Brand</button>
          <button class="btn btn-outline-danger" @click="logout">Logout</button>
        </div>
      </header>

      <div v-if="errorMessage" class="alert alert-danger alert-dismissible" role="alert">
        {{ errorMessage }}
        <button type="button" class="btn-close" aria-label="Close" @click="errorMessage = ''"></button>
      </div>
      <div v-if="successMessage" class="alert alert-success alert-dismissible" role="alert">
        {{ successMessage }}
        <button type="button" class="btn-close" aria-label="Close" @click="successMessage = ''"></button>
      </div>

      <div class="row g-4">
        <div v-if="showForm && canManageBrands" class="col-lg-4">
          <BrandForm
            :form="form"
            :is-editing="isEditing"
            :saving="saving"
            :name-error="nameError"
            :category-error="categoryError"
            @save="handleSave"
            @reset="cancelForm"
            @clear-name-error="nameError = ''"
            @clear-category-error="categoryError = ''"
          />
        </div>
        <div :class="showForm ? 'col-lg-8' : 'col-12'">
          <BrandList
            :loading="loading"
            :filtered-brands="filteredBrands"
            :paginated-brands="paginatedBrands"
            :categories="categories"
            :search-term="searchTerm"
            :selected-category="selectedCategory"
            :selected-status="selectedStatus"
            :current-page="currentPage"
            :total-pages="totalPages"
            :page-size="PAGE_SIZE"
            :format-date="formatDate"
            :can-edit="canManageBrands"
            :can-delete="canDeleteBrands"
            @update:search-term="searchTerm = $event"
            @update:selected-category="selectedCategory = $event"
            @update:selected-status="selectedStatus = $event"
            @refresh="loadBrands"
            @clear-filters="searchTerm = ''; selectedCategory = ''; selectedStatus = ''"
            @edit="openEditForm"
            @delete="deleteBrand"
            @previous-page="previousPage"
            @next-page="nextPage"
          />
        </div>
      </div>

      <p class="text-center text-secondary small mt-4">Vue 3 · Bootstrap 5 · ASP.NET Core Web API</p>
    </div>
  </div>
</template>
