'use client'

import React, { useState } from 'react'
import {
  Layout,
  Menu,
  Button,
  theme,
  Dropdown,
  Avatar,
  Space,
  Typography,
  Breadcrumb
} from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const { Header, Sider, Content, Footer } = Layout
const { Text } = Typography

interface AppLayoutProps {
  children: React.ReactNode
}

// Menu items configuration
const menuItems: MenuProps['items'] = [
  {
    key: '/',
    icon: <DashboardOutlined />,
    label: <Link href="/">Dashboard</Link>
  }
]

// User dropdown menu
const userMenuItems: MenuProps['items'] = [
  {
    key: 'profile',
    icon: <UserOutlined />,
    label: 'Profile'
  },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: 'Settings'
  },
  {
    type: 'divider'
  },
  {
    key: 'logout',
    icon: <LogoutOutlined />,
    label: 'Logout',
    danger: true
  }
]

// Breadcrumb mapping
const breadcrumbNameMap: Record<string, string> = {
  '/': 'Dashboard'
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  // Generate breadcrumb items
  const pathSnippets = pathname.split('/').filter(i => i)
  const breadcrumbItems = [
    {
      title: <Link href="/">Home</Link>
    },
    ...pathSnippets.map((snippet, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
      const isLast = index === pathSnippets.length - 1

      return {
        title: isLast ? (
          breadcrumbNameMap[url] || snippet
        ) : (
          <Link href={url}>{breadcrumbNameMap[url] || snippet}</Link>
        )
      }
    })
  ]

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'profile':
        console.log('Navigate to profile')
        break
      case 'settings':
        console.log('Navigate to settings')
        break
      case 'logout':
        console.log('Logout user')
        // Implement logout logic
        break
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: colorBgContainer,
          borderRight: '1px solid #f0f0f0'
        }}
      >
        <div
          style={{
            height: 64,
            margin: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start'
          }}
        >
          {!collapsed ? (
            <Text strong style={{ fontSize: '18px', color: '#1677ff' }}>
              Next.js App
            </Text>
          ) : (
            <Text strong style={{ fontSize: '18px', color: '#1677ff' }}>
              N
            </Text>
          )}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          style={{ border: 'none' }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: '0 16px',
            background: colorBgContainer,
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64
            }}
          />

          <Space size="middle">
            <Button
              type="text"
              icon={<BellOutlined />}
              style={{ fontSize: '16px' }}
            />

            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleUserMenuClick
              }}
              placement="bottomRight"
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <Text>John Doe</Text>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ margin: '16px' }}>
          <Breadcrumb
            items={breadcrumbItems}
            style={{ marginBottom: '16px' }}
          />

          <div
            style={{
              padding: 24,
              minHeight: 'calc(100vh - 180px)',
              background: colorBgContainer,
              borderRadius: borderRadiusLG
            }}
          >
            {children}
          </div>
        </Content>

        <Footer style={{ textAlign: 'center', background: colorBgContainer }}>
          Next.js Boilerplate ©{new Date().getFullYear()} Created with ❤️
          <br />
          @mfadlihs
        </Footer>
      </Layout>
    </Layout>
  )
}
