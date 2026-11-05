<script setup>
defineProps({
  loading: { type: Boolean, required: true },
  filteredBrands: { type: Array, required: true },
  paginatedBrands: { type: Array, required: true },
  categories: { type: Array, required: true },
  searchTerm: { type: String, required: true },
  selectedCategory: { type: String, required: true },
  selectedStatus: { type: String, required: true },
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  pageSize: { type: Number, required: true },
  formatDate: { type: Function, required: true },
  canEdit: { type: Boolean, default: false },
  canDelete: { type: Boolean, default: false }
})

defineEmits(['refresh', 'clear-filters', 'edit', 'delete', 'previous-page', 'next-page', 'update:searchTerm', 'update:selectedCategory', 'update:selectedStatus'])
</script>

<template>
  <div class="card brand-list-card border-0 shadow-sm rounded-4">
    <div class="card-body p-4">
      <div class="brand-list-heading d-flex justify-content-between align-items-center mb-3">
        <h5 class="fw-bold mb-0">All Brands ({{ filteredBrands.length }})</h5>
        <button class="btn btn-outline-primary btn-sm" :disabled="loading" @click="$emit('refresh')">
          {{ loading ? 'Loading...' : 'Refresh' }}
        </button>
      </div>

      <div class="brand-filters row g-2 align-items-center">
        <div class="col-md-4">
          <input :value="searchTerm" type="text" class="form-control" placeholder="Search by brand name..." @input="$emit('update:searchTerm', $event.target.value)" />
        </div>
        <div class="col-md-3">
          <select :value="selectedCategory" class="form-select" @change="$emit('update:selectedCategory', $event.target.value)">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
        </div>
        <div class="col-md-3">
          <select :value="selectedStatus" class="form-select" @change="$emit('update:selectedStatus', $event.target.value)">
            <option value="">All Status</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>
        <div class="col-md-2">
          <button type="button" class="btn btn-outline-secondary w-100" @click="$emit('clear-filters')">Clear</button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>
        <p class="text-secondary mt-2 mb-0">Loading brands...</p>
      </div>
      <div v-else-if="filteredBrands.length === 0" class="text-center py-5">
        <h6>No brands found</h6>
        <p class="text-secondary mb-0">Add your first brand using the form.</p>
      </div>
      <div v-else class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th scope="col">Brand Name</th>
              <th scope="col">Category</th>
              <th scope="col">Status</th>
              <th scope="col">Created On</th>
              <th scope="col">Last Modified</th>
              <th v-if="canEdit || canDelete" scope="col" class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="brand in paginatedBrands" :key="brand.id ?? brand.ID">
              <td class="fw-semibold">{{ brand.name ?? brand.Name }}</td>
              <td>{{ brand.category ?? brand.Category ?? '—' }}</td>
              <td>
                <span v-if="(brand.isActive ?? brand.IsActive) === 1" class="badge bg-success">Active</span>
                <span v-else class="badge bg-danger">Inactive</span>
              </td>
              <td>{{ formatDate(brand.createdDate ?? brand.CreatedDate) }}</td>
              <td>{{ formatDate(brand.modifiedDate ?? brand.ModifiedDate) }}</td>
              <td v-if="canEdit || canDelete" class="text-end">
                <div class="d-inline-flex gap-2">
                  <button
                    v-if="canEdit"
                    type="button"
                    class="btn btn-icon btn-edit"
                    :aria-label="`Edit ${brand.name ?? brand.Name ?? 'brand'}`"
                    :title="`Edit ${brand.name ?? brand.Name ?? 'brand'}`"
                    @click="$emit('edit', brand)"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
                    </svg>
                  </button>
                  <button
                    v-if="canDelete"
                    type="button"
                    class="btn btn-icon btn-delete"
                    :aria-label="`Delete ${brand.name ?? brand.Name ?? 'brand'}`"
                    :title="`Delete ${brand.name ?? brand.Name ?? 'brand'}`"
                    @click="$emit('delete', brand)"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M3 6h18" />
                      <path d="M8 6V4h8v2" />
                      <path d="m19 6-1 14H6L5 6" />
                      <path d="M10 11v5M14 11v5" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="totalPages > 1" class="d-flex justify-content-center align-items-center gap-3 mt-4">
        <button class="btn btn-outline-primary" :disabled="currentPage === 1" @click="$emit('previous-page')">Previous</button>
        <span class="fw-semibold">Page {{ currentPage }} of {{ totalPages }}</span>
        <button class="btn btn-outline-primary" :disabled="currentPage === totalPages" @click="$emit('next-page')">Next</button>
      </div>

      <div v-if="!loading && filteredBrands.length > 0" class="text-secondary small mt-3">
        Showing {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, filteredBrands.length) }} of {{ filteredBrands.length }} brands.
      </div>
    </div>
  </div>
</template>
