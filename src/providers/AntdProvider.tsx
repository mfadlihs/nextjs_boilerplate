'use client'

import React from 'react'
import { ConfigProvider, theme, App } from 'antd'
import type { ThemeConfig } from 'antd'

// Custom theme configuration
const customTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    // Primary colors
    colorPrimary: '#1677ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',

    // Layout
    borderRadius: 8,
    wireframe: false,

    // Typography
    fontSize: 14,
    fontFamily:
      'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',

    // Spacing
    sizeUnit: 4,
    sizeStep: 4
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40
    },
    Select: {
      borderRadius: 8,
      controlHeight: 40
    },
    Card: {
      borderRadius: 12
    },
    Modal: {
      borderRadius: 12
    },
    Table: {
      borderRadius: 8
    }
  }
}

// Dark theme configuration
const darkTheme: ThemeConfig = {
  ...customTheme,
  algorithm: theme.darkAlgorithm
}

interface AntdProviderProps {
  children: React.ReactNode
  darkMode?: boolean
}

export default function AntdProvider({
  children,
  darkMode = false
}: AntdProviderProps) {
  return (
    <ConfigProvider
      theme={darkMode ? darkTheme : customTheme}
      componentSize="middle"
    >
      <App>{children}</App>
    </ConfigProvider>
  )
}
