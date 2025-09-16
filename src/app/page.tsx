'use client'

import React from 'react'
import { Card, Row, Col, Typography, Space, Tag, Button, Divider } from 'antd'
import {
  ApiOutlined,
  DatabaseOutlined,
  DesktopOutlined,
  RocketOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons'
import AppLayout from '@/components/Layout/AppLayout'
import UserList from '@/components/Users/UserList'
import PostList from '@/components/Posts/PostList'

const { Title, Paragraph, Text } = Typography

const features = [
  {
    icon: <ApiOutlined style={{ fontSize: '24px', color: '#1677ff' }} />,
    title: 'Axios Integration',
    description:
      'Configured HTTP client with interceptors, error handling, and authentication support.',
    tags: ['HTTP', 'Interceptors', 'Error Handling']
  },
  {
    icon: <DatabaseOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
    title: 'React Query',
    description:
      'Powerful data synchronization with caching, background updates, and optimistic updates.',
    tags: ['Caching', 'Mutations', 'Optimistic Updates']
  },
  {
    icon: <DesktopOutlined style={{ fontSize: '24px', color: '#faad14' }} />,
    title: 'Ant Design',
    description:
      'Beautiful UI components with customizable themes and responsive design.',
    tags: ['UI Components', 'Theming', 'Responsive']
  },
  {
    icon: (
      <SafetyCertificateOutlined
        style={{ fontSize: '24px', color: '#f5222d' }}
      />
    ),
    title: 'Error Boundaries',
    description:
      'Comprehensive error handling with graceful fallbacks and recovery options.',
    tags: ['Error Handling', 'Fallbacks', 'Recovery']
  },
  {
    icon: (
      <ThunderboltOutlined style={{ fontSize: '24px', color: '#722ed1' }} />
    ),
    title: 'TypeScript',
    description:
      'Full TypeScript support with type-safe API calls and component props.',
    tags: ['Type Safety', 'IntelliSense', 'Developer Experience']
  },
  {
    icon: <RocketOutlined style={{ fontSize: '24px', color: '#13c2c2' }} />,
    title: 'Production Ready',
    description:
      'Optimized configuration with best practices for performance and maintainability.',
    tags: ['Performance', 'Best Practices', 'Scalable']
  }
]

export default function Home() {
  return (
    <AppLayout>
      <div>
        {/* Hero Section */}
        <Card style={{ marginBottom: '24px', textAlign: 'center' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Title level={1} style={{ margin: 0, color: '#1677ff' }}>
              Next.js Boilerplate
            </Title>
            <Paragraph
              style={{ fontSize: '18px', margin: 0, maxWidth: '600px' }}
            >
              A comprehensive starter template with React Query for state
              management, Ant Design for UI components, and Axios for HTTP
              requests. Built with TypeScript and best practices for modern web
              development.
            </Paragraph>
            <Space>
              <Tag color="blue">Next.js 14</Tag>
              <Tag color="purple">React 18</Tag>
              <Tag color="green">React Query 5</Tag>
              <Tag color="orange">Ant Design 5</Tag>
              <Tag color="cyan">TypeScript</Tag>
              <Tag color="geekblue">Axios</Tag>
            </Space>
          </Space>
        </Card>

        {/* Features Grid */}
        <Title level={2} style={{ marginBottom: '24px' }}>
          Features Overview
        </Title>
        <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <Card
                hoverable
                style={{ height: '100%' }}
                bodyStyle={{ padding: '20px' }}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  {feature.icon}
                  <Title level={4} style={{ margin: '8px 0' }}>
                    {feature.title}
                  </Title>
                  <Paragraph style={{ margin: 0, color: '#666' }}>
                    {feature.description}
                  </Paragraph>
                  <Space wrap>
                    {feature.tags.map(tag => (
                      <Tag key={tag} color="default" style={{ margin: '2px' }}>
                        {tag}
                      </Tag>
                    ))}
                  </Space>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        <Divider />

        {/* Demo Sections */}
        <Title level={2} style={{ marginBottom: '24px' }}>
          Live Demo Components
        </Title>

        <div style={{ marginBottom: '32px' }}>
          <UserList />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <PostList />
        </div>

        {/* Getting Started */}
        <Card title={<Title level={3}>Getting Started</Title>}>
          <Paragraph>
            This boilerplate includes everything you need to build a modern web
            application:
          </Paragraph>
          <ul>
            <li>
              <Text strong>Axios Configuration:</Text> Pre-configured HTTP
              client with interceptors for authentication and error handling
            </li>
            <li>
              <Text strong>React Query Hooks:</Text> Custom hooks for data
              fetching, caching, and mutations with optimistic updates
            </li>
            <li>
              <Text strong>Ant Design Setup:</Text> Customizable theme
              configuration and responsive layout components
            </li>
            <li>
              <Text strong>Error Boundaries:</Text> Comprehensive error handling
              with graceful fallbacks
            </li>
            <li>
              <Text strong>TypeScript Support:</Text> Full type safety across
              the entire application
            </li>
            <li>
              <Text strong>Best Practices:</Text> Code organization, naming
              conventions, and performance optimizations
            </li>
          </ul>

          <Divider />

          <Title level={4}>Quick Commands</Title>
          <Space direction="vertical">
            <Text code>npm run dev</Text> - Start development server
            <Text code>npm run build</Text> - Build for production
            <Text code>npm run lint</Text> - Run ESLint
          </Space>
        </Card>
      </div>
    </AppLayout>
  )
}
