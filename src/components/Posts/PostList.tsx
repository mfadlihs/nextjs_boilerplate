'use client'

import React, { useState } from 'react'
import {
  Card,
  List,
  Button,
  Space,
  Typography,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Avatar,
  Tag
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  ReloadOutlined,
  EyeOutlined
} from '@ant-design/icons'
import {
  usePosts,
  useCreatePost,
  useUpdatePost,
  useDeletePost
} from '@/hooks/usePosts'
import { useUsers } from '@/hooks/useUsers'
import { Post, CreatePostRequest } from '@/services/api'

const { Title, Paragraph } = Typography
const { TextArea } = Input

interface PostFormData {
  title: string
  body: string
  userId: number
}

export default function PostList() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [viewingPost, setViewingPost] = useState<Post | null>(null)
  const [form] = Form.useForm<PostFormData>()

  // React Query hooks
  const { data: posts, isLoading, error, refetch } = usePosts()
  const { data: users } = useUsers()
  const createPostMutation = useCreatePost()
  const updatePostMutation = useUpdatePost()
  const deletePostMutation = useDeletePost()

  const handleCreate = () => {
    setEditingPost(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (post: Post) => {
    setEditingPost(post)
    form.setFieldsValue({
      title: post.title,
      body: post.body,
      userId: post.userId
    })
    setIsModalOpen(true)
  }

  const handleView = (post: Post) => {
    setViewingPost(post)
    setIsViewModalOpen(true)
  }

  const handleDelete = async (postId: number) => {
    try {
      await deletePostMutation.mutateAsync(postId)
      message.success('Post deleted successfully')
    } catch (error) {
      message.error('Failed to delete post')
    }
  }

  const handleSubmit = async (values: PostFormData) => {
    try {
      if (editingPost) {
        // Update existing post
        await updatePostMutation.mutateAsync({
          id: editingPost.id,
          postData: {
            ...values,
            id: editingPost.id
          }
        })
        message.success('Post updated successfully')
      } else {
        // Create new post
        await createPostMutation.mutateAsync(values as CreatePostRequest)
        message.success('Post created successfully')
      }
      setIsModalOpen(false)
      form.resetFields()
    } catch (error) {
      message.error(
        editingPost ? 'Failed to update post' : 'Failed to create post'
      )
    }
  }

  const getUserName = (userId: number) => {
    const user = users?.find(u => u.id === userId)
    return user?.name || 'Unknown User'
  }

  if (error) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Title level={4} type="danger">
            Failed to load posts
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
        title={<Title level={3}>Posts Management</Title>}
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
              loading={createPostMutation.isPending}
            >
              Add Post
            </Button>
          </Space>
        }
      >
        <List
          loading={isLoading}
          itemLayout="vertical"
          size="large"
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`
          }}
          dataSource={posts}
          renderItem={post => (
            <List.Item
              key={post.id}
              actions={[
                <Button
                  key="view"
                  type="link"
                  icon={<EyeOutlined />}
                  onClick={() => handleView(post)}
                >
                  View
                </Button>,
                <Button
                  key="edit"
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(post)}
                  loading={updatePostMutation.isPending}
                >
                  Edit
                </Button>,
                <Popconfirm
                  key="delete"
                  title="Delete post"
                  description="Are you sure you want to delete this post?"
                  onConfirm={() => handleDelete(post.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    loading={deletePostMutation.isPending}
                  >
                    Delete
                  </Button>
                </Popconfirm>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    icon={<UserOutlined />}
                    style={{ backgroundColor: '#52c41a' }}
                  >
                    {getUserName(post.userId)?.charAt(0)?.toUpperCase()}
                  </Avatar>
                }
                title={
                  <Space>
                    <span>{post.title}</span>
                    <Tag color="blue">ID: {post.id}</Tag>
                  </Space>
                }
                description={
                  <Space>
                    <span>By: {getUserName(post.userId)}</span>
                    <Tag color="green">User ID: {post.userId}</Tag>
                  </Space>
                }
              />
              <Paragraph
                ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
                style={{ marginTop: '10px' }}
              >
                {post.body}
              </Paragraph>
            </List.Item>
          )}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingPost ? 'Edit Post' : 'Create Post'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: '20px' }}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter post title' }]}
          >
            <Input placeholder="Enter post title" />
          </Form.Item>

          <Form.Item
            name="userId"
            label="Author"
            rules={[{ required: true, message: 'Please select an author' }]}
          >
            <Select
              placeholder="Select author"
              loading={!users}
              showSearch
              optionFilterProp="children"
            >
              {users?.map(user => (
                <Select.Option key={user.id} value={user.id}>
                  {user.name} ({user.username})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="body"
            label="Content"
            rules={[{ required: true, message: 'Please enter post content' }]}
          >
            <TextArea
              rows={6}
              placeholder="Enter post content"
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={
                  createPostMutation.isPending || updatePostMutation.isPending
                }
              >
                {editingPost ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title="View Post"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>
        ]}
        width={600}
      >
        {viewingPost && (
          <div style={{ marginTop: '20px' }}>
            <Title level={4}>{viewingPost.title}</Title>
            <Space style={{ marginBottom: '16px' }}>
              <Tag color="blue">Post ID: {viewingPost.id}</Tag>
              <Tag color="green">Author: {getUserName(viewingPost.userId)}</Tag>
              <Tag color="orange">User ID: {viewingPost.userId}</Tag>
            </Space>
            <Paragraph>{viewingPost.body}</Paragraph>
          </div>
        )}
      </Modal>
    </div>
  )
}
