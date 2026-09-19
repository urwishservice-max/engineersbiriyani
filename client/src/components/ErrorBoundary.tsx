import React, { Component, ErrorInfo, ReactNode } from 'react';

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
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled React Error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleClearCache = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.error(e);
    }
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-[#121212] border border-[#FFB800]/40 rounded-2xl p-8 shadow-2xl">
            <div className="w-16 h-16 bg-[#FFB800]/10 border border-[#FFB800]/40 rounded-full flex items-center justify-center mx-auto mb-4 text-[#FFB800] font-bold text-2xl">
              !
            </div>
            <h1 className="text-2xl font-bold text-[#FFB800] mb-2">Engineer's Biriyani</h1>
            <p className="text-sm text-gray-300 mb-6">
              Something went wrong loading this page. Please tap reload or refresh your browser.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReload}
                className="w-full bg-[#FFB800] hover:bg-[#e0a200] text-black font-bold py-3 px-6 rounded-xl transition text-sm"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleClearCache}
                className="w-full bg-[#18181B] hover:bg-[#27272A] text-gray-400 font-medium py-3 px-6 rounded-xl transition text-xs border border-[#27272A]"
              >
                Clear Cache & Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
