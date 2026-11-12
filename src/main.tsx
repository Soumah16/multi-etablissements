import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('SmartSchool Uncaught Error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      sessionStorage.removeItem('smartschool_current_user');
      localStorage.removeItem('smartschool_mode_demo_flag');
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          color: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'sans-serif'
        }}>
          <div style={{
            maxWidth: '560px',
            width: '100%',
            backgroundColor: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛡️</div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#60a5fa', marginBottom: '8px' }}>
              SmartSchool ERP · Initialisation Sécurisée
            </h1>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '24px' }}>
              Une session précédente nécessite une réinitialisation des caches locaux pour afficher l'interface.
            </p>
            <div style={{
              backgroundColor: '#1e293b',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '11px',
              fontFamily: 'monospace',
              color: '#f43f5e',
              marginBottom: '24px',
              textAlign: 'left',
              wordBreak: 'break-all'
            }}>
              {this.state.error?.message || 'Erreur de rendu React interceptée'}
            </div>
            <button
              onClick={this.handleReset}
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.4)'
              }}
            >
              🔄 Réinitialiser la session & Ouvrir l'application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
