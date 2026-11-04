import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '../composables/useApi'

export const useHelpContactsStore = defineStore('helpContacts', () => {
    const wa = ref<string[]>(['', ''])
    const ig = ref<string[]>(['', ''])
    const loading = ref(false)
    const error = ref<string | null>(null)
    const { fetchWithAuth } = useApi()

    const fetchHelpContacts = async () => {
        loading.value = true
        error.value = null

        const { data, error: fetchError } = await fetchWithAuth('/settings/help-contacts')

        if (fetchError) {
            error.value = fetchError
        } else if (data) {
            wa.value = Array.isArray(data.wa) ? data.wa.slice(0, 2) : ['', '']
            ig.value = Array.isArray(data.ig) ? data.ig.slice(0, 2) : ['', '']
        }

        loading.value = false
    }

    const updateHelpContacts = async (payload: { wa: string[]; ig: string[] }) => {
        loading.value = true
        error.value = null

        const { data, error: fetchError } = await fetchWithAuth('/settings/help-contacts', {
            method: 'PUT',
            body: JSON.stringify(payload)
        })

        if (fetchError) {
            error.value = fetchError
            loading.value = false
            return false
        }

        if (data) {
            wa.value = Array.isArray(data.wa) ? data.wa.slice(0, 2) : ['', '']
            ig.value = Array.isArray(data.ig) ? data.ig.slice(0, 2) : ['', '']
        }

        loading.value = false
        return true
    }

    return {
        wa,
        ig,
        loading,
        error,
        fetchHelpContacts,
        updateHelpContacts
    }
})
