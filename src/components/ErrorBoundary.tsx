import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Error captured by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 text-slate-900 font-sans">
          <div className="max-w-xl w-full bg-white rounded-2xl p-6 shadow-xl border border-red-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 bg-red-100 rounded-xl font-bold text-xl">⚠️</div>
              <div>
                <h2 className="text-lg font-bold">Une erreur est survenue sur l'application</h2>
                <p className="text-xs text-slate-500">Un composant React a provoqué un dysfonctionnement.</p>
              </div>
            </div>

            <div className="bg-slate-900 text-red-400 p-4 rounded-xl text-xs font-mono overflow-x-auto space-y-2 border border-slate-800">
              <p className="font-bold">{this.state.error?.toString()}</p>
              {this.state.errorInfo?.componentStack && (
                <pre className="text-[10px] text-slate-400 opacity-80 whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline"
              >
                Vider le cache local
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-sm"
              >
                Recharger la page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
