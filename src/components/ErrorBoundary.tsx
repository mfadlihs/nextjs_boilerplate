'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Result, Button } from 'antd'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo)
    }

    // Here you can also log the error to an error reporting service
    // logErrorToService(error, errorInfo);

    this.setState({ error, errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div style={{ padding: '50px', minHeight: '400px' }}>
          <Result
            status="error"
            title="Something went wrong"
            subTitle="An unexpected error occurred. Please try refreshing the page or contact support if the problem persists."
            extra={[
              <Button type="primary" key="reset" onClick={this.handleReset}>
                Try Again
              </Button>,
              <Button key="reload" onClick={this.handleReload}>
                Reload Page
              </Button>
            ]}
          />

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details
              style={{
                marginTop: '20px',
                padding: '10px',
                background: '#f5f5f5',
                borderRadius: '4px'
              }}
            >
              <summary
                style={{
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  marginBottom: '10px'
                }}
              >
                Error Details (Development Only)
              </summary>
              <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

// Hook version for functional components
export const useErrorHandler = () => {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught:', error, errorInfo)
    // You can also trigger a state update or call an error reporting service here
  }
}
