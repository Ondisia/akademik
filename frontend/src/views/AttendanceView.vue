<template>
  <div class="attendance-view">
    <PageHeader
      title="Kehadiran / Presensi"
      subtitle="Catat dan pantau kehadiran harian siswa."
    >
      <template #actions v-if="authStore.isAdmin">
        <BaseButton variant="primary" @click="openCreateModal">
          <PlusIcon :size="16" class="mr-1" /> Catat Kehadiran
        </BaseButton>
      </template>
    </PageHeader>

    <!-- Student Stats Breakdown -->
    <div
      v-if="!authStore.isAdmin"
      class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
    >
      <div class="card p-4 text-center">
        <CheckCircleIcon :size="32" class="stat-icon-large text-success" />
        <h3 class="mt-2">{{ countStatus("Hadir") }}</h3>
        <p class="text-muted text-xs">Hadir</p>
      </div>
      <div class="card p-4 text-center">
        <MessageCircleIcon :size="32" class="stat-icon-large text-warning" />
        <h3 class="mt-2">{{ countStatus("Izin") }}</h3>
        <p class="text-muted text-xs">Izin</p>
      </div>
      <div class="card p-4 text-center">
        <ThermometerIcon :size="32" class="stat-icon-large text-info" />
        <h3 class="mt-2">{{ countStatus("Sakit") }}</h3>
        <p class="text-muted text-xs">Sakit</p>
      </div>
      <div class="card p-4 text-center">
        <XCircleIcon :size="32" class="stat-icon-large text-danger" />
        <h3 class="mt-2">{{ countStatus("Alpha") }}</h3>
        <p class="text-muted text-xs">Tanpa Keterangan</p>
      </div>
    </div>

    <!-- Attendance Table -->
    <div class="card p-6">
      <DataTable
        :columns="columns"
        :items="attendanceStore.attendances"
        :loading="attendanceStore.loading"
      >
        <template #cell-student="{ item }">
          {{ item.Student?.name || item.student?.name || "-" }}
        </template>
        <template #cell-date="{ item }">
          {{ formatDate(item.date) }}
        </template>
        <template #cell-status="{ item }">
          <BadgeStatus :type="getBadgeType(item.status)">
            {{ item.status }}
          </BadgeStatus>
        </template>
        <template #cell-actions="{ item }" v-if="authStore.isAdmin">
          <div class="action-buttons flex gap-2">
            <button
              class="btn btn-secondary btn-sm"
              @click="openEditModal(item)"
            >
              Edit
            </button>
            <button class="btn btn-danger btn-sm" @click="confirmDelete(item)">
              Hapus
            </button>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Presensi Form Modal -->
    <ModalDialog
      :show="showFormModal"
      :title="isEditMode ? 'Edit Presensi Siswa' : 'Catat Presensi Siswa'"
      @close="closeFormModal"
    >
      <form @submit.prevent="saveAttendance" class="attendance-form">
        <!-- Student Selection -->
        <div class="form-group" v-if="!isEditMode">
          <label for="student_id" class="form-label">Siswa</label>
          <select
            id="student_id"
            v-model="form.student_id"
            class="form-control"
            required
          >
            <option value="" disabled>Pilih Siswa</option>
            <option v-for="s in students" :key="s.id" :value="s.id">
              {{ s.nis }} - {{ s.name }}
            </option>
          </select>
        </div>

        <!-- Date Input -->
        <FormInput
          id="date"
          label="Tanggal Presensi"
          type="date"
          v-model="form.date"
          required
        />

        <!-- Status Select -->
        <div class="form-group">
          <label for="status" class="form-label">Status Kehadiran</label>
          <select
            id="status"
            v-model="form.status"
            class="form-control"
            required
          >
            <option value="" disabled>Pilih Status</option>
            <option value="Hadir">Hadir</option>
            <option value="Izin">Izin</option>
            <option value="Sakit">Sakit</option>
            <option value="Alpha">Alpha</option>
          </select>
        </div>
      </form>
      <template #footer>
        <BaseButton
          variant="secondary"
          @click="closeFormModal"
          :disabled="submitting"
        >
          Batal
        </BaseButton>
        <BaseButton
          variant="primary"
          @click="saveAttendance"
          :loading="submitting"
        >
          Simpan Kehadiran
        </BaseButton>
      </template>
    </ModalDialog>

    <!-- Delete Confirmation -->
    <ConfirmDialog
      :show="showDeleteConfirm"
      @confirm="deleteAttendance"
      @cancel="showDeleteConfirm = false"
      :loading="deleting"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../stores/authStore";
import { useAttendanceStore } from "../stores/attendanceStore";
import { useToastStore } from "../stores/toastStore";
import api from "../services/api";
import PageHeader from "../components/ui/PageHeader.vue";
import DataTable from "../components/ui/DataTable.vue";
import ModalDialog from "../components/ui/ModalDialog.vue";
import ConfirmDialog from "../components/ui/ConfirmDialog.vue";
import FormInput from "../components/ui/FormInput.vue";
import BaseButton from "../components/ui/BaseButton.vue";
import BadgeStatus from "../components/ui/BadgeStatus.vue";
import {
  CheckCircle as CheckCircleIcon,
  MessageCircle as MessageCircleIcon,
  Thermometer as ThermometerIcon,
  XCircle as XCircleIcon,
  Plus as PlusIcon,
} from "lucide-vue-next";

const authStore = useAuthStore();
const attendanceStore = useAttendanceStore();
const toastStore = useToastStore();

const students = ref([]);

const columns = [
  { key: "date", label: "Tanggal", sortable: true },
  { key: "status", label: "Status Kehadiran", sortable: true },
];

if (authStore.isAdmin) {
  columns.unshift({ key: "student", label: "Nama Siswa", sortable: true });
  columns.push({ key: "actions", label: "Aksi", width: "120px" });
}

// Helpers
const getBadgeType = (status) => {
  if (status === "Hadir") return "success";
  if (status === "Izin") return "warning";
  if (status === "Sakit") return "info";
  return "danger";
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const countStatus = (status) => {
  return attendanceStore.attendances.filter((a) => a.status === status).length;
};

// Modal and state
const showFormModal = ref(false);
const isEditMode = ref(false);
const showDeleteConfirm = ref(false);
const submitting = ref(false);
const deleting = ref(false);
const selectedAttendanceId = ref(null);

const form = ref({
  student_id: "",
  date: new Date().toISOString().substring(0, 10),
  status: "",
});

const resetForm = () => {
  form.value = {
    student_id: "",
    date: new Date().toISOString().substring(0, 10),
    status: "",
  };
};

const openCreateModal = () => {
  isEditMode.value = false;
  resetForm();
  showFormModal.value = true;
};

const openEditModal = (att) => {
  isEditMode.value = true;
  form.value = {
    student_id: att.student_id,
    date: att.date.substring(0, 10),
    status: att.status,
  };
  selectedAttendanceId.value = att.id;
  showFormModal.value = true;
};

const closeFormModal = () => {
  showFormModal.value = false;
  resetForm();
};

const confirmDelete = (att) => {
  selectedAttendanceId.value = att.id;
  showDeleteConfirm.value = true;
};

const saveAttendance = async () => {
  if (!form.value.date || !form.value.status) {
    toastStore.warning("Harap isi semua kolom wajib!");
    return;
  }

  submitting.value = true;
  try {
    if (isEditMode.value) {
      await attendanceStore.updateAttendance(selectedAttendanceId.value, {
        date: form.value.date,
        status: form.value.status,
      });
      toastStore.success("Kehadiran berhasil diperbarui.");
    } else {
      await attendanceStore.createAttendance(form.value);
      toastStore.success("Kehadiran berhasil dicatat.");
    }
    closeFormModal();
  } catch (err) {
    toastStore.error(err.message || "Gagal menyimpan kehadiran.");
  } finally {
    submitting.value = false;
  }
};

const deleteAttendance = async () => {
  deleting.value = true;
  try {
    await attendanceStore.deleteAttendance(selectedAttendanceId.value);
    toastStore.success("Kehadiran berhasil dihapus.");
    showDeleteConfirm.value = false;
  } catch (err) {
    toastStore.error(err.message || "Gagal menghapus data.");
  } finally {
    deleting.value = false;
  }
};

onMounted(async () => {
  attendanceStore.fetchAttendances().catch(() => {
    toastStore.error("Gagal memuat riwayat kehadiran.");
  });

  if (authStore.isAdmin) {
    try {
      const response = await api.get("/students");
      students.value = response.data?.data || response.data || [];
    } catch (e) {
      console.error("Gagal mengambil daftar siswa:", e);
    }
  }
});
</script>

<style scoped>
.stat-icon-large {
  font-size: var(--font-size-3xl);
}
.mt-2 {
  margin-top: var(--spacing-2);
}
</style>
