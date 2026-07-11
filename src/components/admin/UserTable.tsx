'use client'

import { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { usersApi } from '@/lib/api'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import ConfirmModal, { Modal } from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'
import { useToast } from '@/components/ui/ToastProvider'

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

  const { toast } = useToast()

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
      setUsers(response.data as User[])
    } catch {
      toast('Failed to fetch users', 'error')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleToggleStatus = async (user: User) => {
    setActionLoading(user.user_id)
    try {
      await usersApi.updateStatus(user.user_id)
      toast('User status updated')
      fetchUsers()
    } catch {
      toast('Failed to update status', 'error')
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
      toast('User updated successfully')
      setEditModal(null)
      fetchUsers()
    } catch {
      toast('Failed to update user', 'error')
    }
  }

  const handleDelete = async () => {
    if (!deleteModal) return
    setDeleteLoading(true)

    try {
      await usersApi.delete(deleteModal.user_id)
      toast('User deleted successfully')
      setDeleteModal(null)
      fetchUsers()
    } catch {
      toast('Failed to delete user', 'error')
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
        <div className="overflow-hidden rounded-2xl border border-edge bg-surface shadow-card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-edge">
              <thead className="bg-white/3">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-fg-subtle">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-fg-subtle">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-fg-subtle">
                    Verified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-fg-subtle">
                    Role
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-fg-subtle">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-edge">
                {users.map((user) => (
                  <tr
                    key={user.user_id}
                    className="transition-colors hover:bg-white/3"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.full_name} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-fg">
                            {user.full_name}
                          </p>
                          <p className="text-sm text-fg-muted">{user.email}</p>
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
                      <span className="text-sm capitalize text-fg-muted">
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
      <Modal
        open={!!editModal}
        onClose={() => setEditModal(null)}
        title="Edit User"
      >
        <form onSubmit={handleSubmit(handleEditSubmit)} className="space-y-4">
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
      </Modal>

      {/* Delete Modal */}
      <ConfirmModal
        open={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteModal?.full_name}? This will permanently remove their account and all data.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        loading={deleteLoading}
        variant="danger"
      />
    </DashboardLayout>
  )
}
