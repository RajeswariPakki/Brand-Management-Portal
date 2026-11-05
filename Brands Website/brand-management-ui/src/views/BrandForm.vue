<script setup>
defineProps({
  form: { type: Object, required: true },
  isEditing: { type: Boolean, required: true },
  saving: { type: Boolean, required: true },
  nameError: { type: String, default: '' },
  categoryError: { type: String, default: '' }
})

defineEmits(['save', 'reset', 'clear-name-error', 'clear-category-error'])
</script>

<template>
  <div class="card border-0 shadow-sm rounded-4">
    <div class="card-body p-4">
      <h5 class="fw-bold mb-4">{{ isEditing ? 'Edit Brand' : 'Add Brand' }}</h5>
      <form @submit.prevent="$emit('save')">
        <div class="mb-3">
          <label for="brandName" class="form-label">Brand Name <span class="text-danger">*</span></label>
          <input
            id="brandName"
            v-model.trim="form.name"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': nameError }"
            placeholder="Enter brand name"
            maxlength="100"
            required
            @input="$emit('clear-name-error')"
          />
          <div v-if="nameError" class="invalid-feedback d-block">{{ nameError }}</div>
        </div>

        <div class="mb-4">
          <label for="brandCategory" class="form-label">Category <span class="text-danger">*</span></label>
          <input
            id="brandCategory"
            v-model.trim="form.category"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': categoryError }"
            placeholder="Enter category"
            maxlength="100"
            @input="$emit('clear-category-error')"
          />
          <div v-if="categoryError" class="invalid-feedback d-block">{{ categoryError }}</div>
        </div>

        <div class="mb-4">
          <label class="form-label" for="brandStatus">Status</label>
          <div class="form-check form-switch">
            <input id="brandStatus" v-model="form.isActive" class="form-check-input" type="checkbox" />
            <label class="form-check-label" for="brandStatus">{{ form.isActive ? 'Active' : 'Inactive' }}</label>
          </div>
        </div>

        <button type="submit" class="btn btn-primary w-100 mb-2" :disabled="saving">
          {{ saving ? 'Saving...' : isEditing ? 'Update Brand' : 'Save Brand' }}
        </button>
        <button v-if="isEditing" type="button" class="btn btn-outline-secondary w-100" @click="$emit('reset')">
          Cancel Edit
        </button>
      </form>
    </div>
  </div>
</template>
