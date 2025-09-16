'use client'

import React, { useState } from 'react'
import {
  Table,
  Card,
  Button,
  Space,
  Typography,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Tag,
  Avatar
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser
} from '@/hooks/useUsers'
import { User } from '@/services/api'

const { Title } = Typography

interface UserFormData {
  name: string
  username: string
  email: string
  phone: string
  website: string
}

export default function UserList() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [form] = Form.useForm<UserFormData>()

  // React Query hooks
  const { data: users, isLoading, error, refetch } = useUsers()
  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()

  const handleCreate = () => {
    setEditingUser(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    form.setFieldsValue({
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      website: user.website
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (userId: number) => {
    try {
      await deleteUserMutation.mutateAsync(userId)
      message.success('User deleted successfully')
    } catch (error) {
      message.error('Failed to delete user')
    }
  }

  const handleSubmit = async (values: UserFormData) => {
    try {
      if (editingUser) {
        // Update existing user
        await updateUserMutation.mutateAsync({
          id: editingUser.id,
          userData: values
        })
        message.success('User updated successfully')
      } else {
        // Create new user
        await createUserMutation.mutateAsync(values)
        message.success('User created successfully')
      }
      setIsModalOpen(false)
      form.resetFields()
    } catch (error) {
      message.error(
        editingUser ? 'Failed to update user' : 'Failed to create user'
      )
    }
  }

  const columns: ColumnsType<User> = [
    {
      title: 'Avatar',
      dataIndex: 'name',
      key: 'avatar',
      width: 80,
      render: (name: string) => (
        <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }}>
          {name?.charAt(0)?.toUpperCase()}
        </Avatar>
      )
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (username: string) => <Tag color="blue">{username}</Tag>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
      render: (website: string) => (
        <a
          href={`https://${website}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {website}
        </a>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            loading={updateUserMutation.isPending}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete user"
            description="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              loading={deleteUserMutation.isPending}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  if (error) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Title level={4} type="danger">
            Failed to load users
          </Title>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div>
      <Card
        title={<Title level={3}>Users Management</Title>}
        extra={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => refetch()}
              loading={isLoading}
            >
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
              loading={createUserMutation.isPending}
            >
              Add User
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`
          }}
        />
      </Card>

      <Modal
        title={editingUser ? 'Edit User' : 'Create User'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: '20px' }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter name' }]}
          >
            <Input placeholder="Enter user name" />
          </Form.Item>

          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please enter username' }]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter valid email' }
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please enter phone number' }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item
            name="website"
            label="Website"
            rules={[{ required: true, message: 'Please enter website' }]}
          >
            <Input placeholder="Enter website" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={
                  createUserMutation.isPending || updateUserMutation.isPending
                }
              >
                {editingUser ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
