import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Bill } from '../types'
import { useApi } from '../composables/useApi'

export const useBillingStore = defineStore('billing', () => {
    const bills = ref<Bill[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)
    const { fetchWithAuth } = useApi()

    const fetchBills = async (studentId?: string) => {
        loading.value = true
        error.value = null

        const query = studentId ? `?studentId=${encodeURIComponent(studentId)}` : ''
        const { data, error: fetchError } = await fetchWithAuth(`/bills${query}`)

        if (fetchError) {
            error.value = fetchError
        } else if (data) {
            bills.value = data.map((b: any) => ({
                id: b.id,
                studentId: b.student_id,
                studentName: b.student_name,
                amount: b.amount,
                period: b.period,
                description: b.description,
                status: b.status,
                paymentProof: b.payment_proof,
                proofFilename: b.proof_filename,
                createdAt: b.created_at,
                updatedAt: b.updated_at
            }))
        }

        loading.value = false
    }

    const addBill = async (payload: {
        studentId: string
        amount: number
        period: string
        description?: string
    }) => {
        loading.value = true
        error.value = null

        const { data, error: fetchError } = await fetchWithAuth('/bills', {
            method: 'POST',
            body: JSON.stringify({
                studentId: payload.studentId,
                amount: payload.amount,
                period: payload.period,
                description: payload.description
            })
        })

        if (fetchError) {
            error.value = fetchError
            loading.value = false
            return false
        }

        if (data) {
            bills.value.unshift({
                id: data.id,
                studentId: data.student_id,
                studentName: data.student_name,
                amount: data.amount,
                period: data.period,
                description: data.description,
                status: data.status,
                paymentProof: data.payment_proof,
                proofFilename: data.proof_filename,
                createdAt: data.created_at,
                updatedAt: data.updated_at
            })
        }

        loading.value = false
        return true
    }

    const updateBill = async (id: string, updates: Record<string, any>) => {
        loading.value = true
        error.value = null

        const { data, error: fetchError } = await fetchWithAuth(`/bills/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        })

        if (fetchError) {
            error.value = fetchError
            loading.value = false
            return false
        }

        if (data) {
            const index = bills.value.findIndex(b => b.id === id)
            if (index !== -1) {
                bills.value[index] = {
                    id: data.id,
                    studentId: data.student_id,
                    studentName: data.student_name,
                    amount: data.amount,
                    period: data.period,
                    description: data.description,
                    status: data.status,
                    paymentProof: data.payment_proof,
                    proofFilename: data.proof_filename,
                    createdAt: data.created_at,
                    updatedAt: data.updated_at
                }
            }
        }

        loading.value = false
        return true
    }

    return {
        bills,
        loading,
        error,
        fetchBills,
        addBill,
        updateBill
    }
})
