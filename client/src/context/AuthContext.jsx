import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [agent, setAgent] = useState(() => {
    try {
      const saved = localStorage.getItem('vault_agent');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('vault_token') || null;
  });

  const [loading, setLoading] = useState(true);

  // Restore and verify session from backend on startup
  useEffect(() => {
    const verifyExistingSession = async () => {
      const storedToken = localStorage.getItem('vault_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      // If session is a guest session, restore immediately without backend check
      if (storedToken === 'guest-session-token') {
        try {
          const saved = localStorage.getItem('vault_agent');
          if (saved) setAgent(JSON.parse(saved));
        } catch {
          // ignore
        }
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.agent) {
            setAgent(data.agent);
            localStorage.setItem('vault_agent', JSON.stringify(data.agent));
          } else {
            logout();
          }
        } else {
          logout();
        }
      } catch (err) {
        console.warn('[AUTH] Could not verify session with backend, keeping cached state:', err);
      } finally {
        setLoading(false);
      }
    };

    verifyExistingSession();
  }, []);

  const login = async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Login authentication failed.');
    }

    setToken(data.token);
    setAgent(data.agent);
    localStorage.setItem('vault_token', data.token);
    localStorage.setItem('vault_agent', JSON.stringify(data.agent));

    return data;
  };

  const register = async (formData) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Registration failed.');
    }

    setToken(data.token);
    setAgent(data.agent);
    localStorage.setItem('vault_token', data.token);
    localStorage.setItem('vault_agent', JSON.stringify(data.agent));

    return data;
  };

  // Play as guest immediately without database credentials
  const playAsGuest = () => {
    const guestAgent = {
      id: 9999,
      full_name: 'Guest Infiltrator',
      nick_name: 'GUEST_OPERATIVE',
      email: 'guest@vaultcracker.internal',
      score: 0,
      unlocked_badges: 'RECRUIT',
      isGuest: true,
    };
    setToken('guest-session-token');
    setAgent(guestAgent);
    localStorage.setItem('vault_token', 'guest-session-token');
    localStorage.setItem('vault_agent', JSON.stringify(guestAgent));
    return guestAgent;
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    }
    setToken(null);
    setAgent(null);
    localStorage.removeItem('vault_token');
    localStorage.removeItem('vault_agent');
  };

  return (
    <AuthContext.Provider
      value={{
        agent,
        token,
        loading,
        login,
        register,
        playAsGuest,
        logout,
        isAuthenticated: !!agent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
