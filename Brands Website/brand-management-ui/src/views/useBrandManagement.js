import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentRole } from '../auth.js'

const API_URL = 'http://localhost:5044/api/Brand'
const PAGE_SIZE = 5

export function useBrandManagement() {
  const router = useRouter()
  const role = ref(getCurrentRole())
  const canManageBrands = computed(() => ['admin', 'manager'].includes(role.value))
  const canDeleteBrands = computed(() => role.value === 'admin')
  const brands = ref([])
  const loading = ref(false)
  const saving = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')
  const nameError = ref('')
  const categoryError = ref('')
  const searchTerm = ref('')
  const selectedCategory = ref('')
  const selectedStatus = ref('')
  const currentPage = ref(1)
  const isEditing = ref(false)
  const editingId = ref(null)
  const form = ref({ name: '', category: '', isActive: true })

  watch([searchTerm, selectedCategory, selectedStatus], () => {
    currentPage.value = 1
  })

  const filteredBrands = computed(() => brands.value.filter((brand) => {
    const name = (brand.name ?? brand.Name ?? '').toLowerCase()
    const category = (brand.category ?? brand.Category ?? '').toLowerCase()
    const status = brand.isActive ?? brand.IsActive
    return name.includes(searchTerm.value.toLowerCase()) &&
      (!selectedCategory.value || category === selectedCategory.value.toLowerCase()) &&
      (selectedStatus.value === '' || String(status) === selectedStatus.value)
  }))

  const categories = computed(() => [...new Set(
    brands.value.map((brand) => brand.category ?? brand.Category).filter(Boolean)
  )].sort())

  const totalPages = computed(() => Math.max(1, Math.ceil(filteredBrands.value.length / PAGE_SIZE)))
  const paginatedBrands = computed(() => {
    const start = (currentPage.value - 1) * PAGE_SIZE
    return filteredBrands.value.slice(start, start + PAGE_SIZE)
  })

  async function readResponse(response) {
    if (!response.ok) {
      const message = await response.text()
      throw new Error(message || `Request failed (${response.status})`)
    }
    if (response.status === 204) return null
    const text = await response.text()
    return text ? JSON.parse(text) : null
  }

  async function loadBrands() {
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      })
      brands.value = (await readResponse(response)) ?? []
    } catch (error) {
      errorMessage.value = 'Could not load brands. Check that your API is running, the API URL is correct, and CORS is configured. ' + error.message
    } finally {
      loading.value = false
    }
  }

  function resetForm() {
    form.value = { name: '', category: '', isActive: true }
    nameError.value = ''
    categoryError.value = ''
    errorMessage.value = ''
    successMessage.value = ''
    isEditing.value = false
    editingId.value = null
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('userName')
    router.push('/login')
  }

  function formatDate(value) {
    return value ? new Date(value).toLocaleDateString('en-IN') : '-'
  }

  function editBrand(brand) {
    editingId.value = brand.id ?? brand.ID
    form.value = {
      name: brand.name ?? brand.Name ?? '',
      category: brand.category ?? brand.Category ?? '',
      isActive: (brand.isActive ?? brand.IsActive) === 1
    }
    isEditing.value = true
    errorMessage.value = ''
    successMessage.value = ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function previousPage() {
    if (currentPage.value > 1) currentPage.value--
  }

  function nextPage() {
    if (currentPage.value < totalPages.value) currentPage.value++
  }

  async function saveBrand() {
    if (!canManageBrands.value) {
      errorMessage.value = 'Your role does not have permission to add or edit brands.'
      return false
    }
    nameError.value = ''
    categoryError.value = ''
    errorMessage.value = ''
    successMessage.value = ''
    const name = form.value.name.trim()
    const category = form.value.category.trim()
    if (!name) nameError.value = 'Brand name is required.'
    if (!category) categoryError.value = 'Category is required.'
    if (nameError.value || categoryError.value) return

    saving.value = true
    const editing = isEditing.value
    const body = {
      ...(editing ? { id: editingId.value } : {}),
      name,
      category,
      isActive: form.value.isActive ? 1 : 0
    }
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(editing ? `${API_URL}/${editingId.value}` : API_URL, {
        method: editing ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      await readResponse(response)
      resetForm()
      await loadBrands()
      currentPage.value = 1
      successMessage.value = editing ? 'Brand updated successfully.' : 'Brand added successfully.'
      return true
    } catch (error) {
      errorMessage.value = `Could not ${editing ? 'update' : 'add'} brand. ${error.message}`
      return false
    } finally {
      saving.value = false
    }
  }

  async function deleteBrand(brand) {
    if (!canDeleteBrands.value) {
      errorMessage.value = 'Only admins can delete brands.'
      return
    }
    const id = brand.id ?? brand.ID
    const name = brand.name ?? brand.Name ?? 'this brand'
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return
    errorMessage.value = ''
    successMessage.value = ''
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      await readResponse(response)
      successMessage.value = 'Brand deleted successfully.'
      if (editingId.value === id) resetForm()
      await loadBrands()
      currentPage.value = 1
    } catch (error) {
      errorMessage.value = 'Could not delete brand. ' + error.message
    }
  }

  onMounted(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login')
      return
    }
    loadBrands()
  })

  return {
    role, canManageBrands, canDeleteBrands, brands, loading, saving, errorMessage, successMessage, nameError,
    categoryError, searchTerm, selectedCategory, selectedStatus, currentPage,
    isEditing, editingId, form, filteredBrands, categories, totalPages,
    paginatedBrands, PAGE_SIZE, loadBrands, resetForm, logout, formatDate,
    editBrand, previousPage, nextPage, saveBrand, deleteBrand
  }
}
