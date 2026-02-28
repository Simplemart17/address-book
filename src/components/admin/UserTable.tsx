'use client'

import { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { usersApi } from '@/config/v3Api.config'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import Toast from '@/components/ui/Toast'
import Spinner from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react'
import { Fragment } from 'react'

interface User {
  id: string
  user_id: string
  email: string
  full_name: string
  verified: boolean
  status: boolean
  user_type: string
  created_at: string
}

const editUserSchema = z.object({
  full_name: z.string().min(1, 'Name is required'),
})

type EditUserFormData = z.infer<typeof editUserSchema>

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const [deleteModal, setDeleteModal] = useState<User | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [editModal, setEditModal] = useState<User | null>(null)

  const [toast, setToast] = useState({
    show: false,
    message: '',
    variant: 'success' as 'success' | 'error',
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
  })

  const fetchUsers = useCallback(async () => {
    try {
      const response = await usersApi.getAll()
      setUsers(response.data)
    } catch {
      showToast('Failed to fetch users', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const showToast = (
    message: string,
    variant: 'success' | 'error' = 'success',
  ) => {
    setToast({ show: true, message, variant })
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000)
  }

  const handleToggleStatus = async (user: User) => {
    setActionLoading(user.user_id)
    try {
      await usersApi.updateStatus(user.user_id)
      showToast(`User status updated`)
      fetchUsers()
    } catch {
      showToast('Failed to update status', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleEditOpen = (user: User) => {
    reset({ full_name: user.full_name })
    setEditModal(user)
  }

  const handleEditSubmit = async (data: EditUserFormData) => {
    if (!editModal) return

    try {
      await usersApi.updateUser(editModal.user_id, data.full_name)
      showToast('User updated successfully')
      setEditModal(null)
      fetchUsers()
    } catch {
      showToast('Failed to update user', 'error')
    }
  }

  const handleDelete = async () => {
    if (!deleteModal) return
    setDeleteLoading(true)

    try {
      await usersApi.delete(deleteModal.user_id)
      showToast('User deleted successfully')
      setDeleteModal(null)
      fetchUsers()
    } catch {
      showToast('Failed to delete user', 'error')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <DashboardLayout title="Admin Panel">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : users.length === 0 ? (
        <EmptyState title="No users" description="No users have registered yet" />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Verified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Role
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.user_id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.full_name} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {user.full_name}
                          </p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Badge variant={user.status ? 'success' : 'danger'}>
                        {user.status ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Badge variant={user.verified ? 'success' : 'warning'}>
                        {user.verified ? 'Verified' : 'Pending'}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="text-sm text-slate-600 capitalize">
                        {user.user_type}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(user)}
                          loading={actionLoading === user.user_id}
                        >
                          {user.status ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEditOpen(user)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setDeleteModal(user)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Transition show={!!editModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setEditModal(null)}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/25 backdrop-blur-sm" />
          </TransitionChild>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all">
                  <DialogTitle className="text-lg font-semibold text-slate-900">
                    Edit User
                  </DialogTitle>
                  <form
                    onSubmit={handleSubmit(handleEditSubmit)}
                    className="mt-4 space-y-4"
                  >
                    <Input
                      label="Full name"
                      error={errors.full_name?.message}
                      {...register('full_name')}
                    />
                    <div className="flex justify-end gap-3">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setEditModal(null)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" loading={isSubmitting}>
                        Save
                      </Button>
                    </div>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Modal */}
      <Modal
        open={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteModal?.full_name}? This will permanently remove their account and all data.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        loading={deleteLoading}
        variant="danger"
      />

      {/* Toast */}
      <Toast
        show={toast.show}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        message={toast.message}
        variant={toast.variant}
      />
    </DashboardLayout>
  )
}
