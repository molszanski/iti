import React, { useState, useTransition, useActionState, useOptimistic } from 'react';
import './RegistrationForm.css';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface RegistrationFormProps {
  initialUsers?: User[];
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormState {
  message: string;
  errors: Record<string, string>;
  success: boolean;
}

// Mock async function to simulate API call
async function registerUser(formData: FormData): Promise<FormState> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Validation
  const errors: Record<string, string> = {};
  
  if (!formData.name.trim()) {
    errors.name = 'Name is required';
  }
  
  if (!formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Email is invalid';
  }
  
  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  if (Object.keys(errors).length > 0) {
    return {
      message: 'Please fix the errors below',
      errors,
      success: false
    };
  }
  
  // Simulate successful registration
  return {
    message: 'Registration successful! Welcome aboard!',
    errors: {},
    success: true
  };
}

export default function RegistrationForm({ initialUsers = [] }: RegistrationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isPending, startTransition] = useTransition();
  
  // Using React 19's useActionState for form state management
  const [state, formAction, isPendingAction] = useActionState<FormState, FormData>(
    async (prevState: FormState, formData: FormData) => {
      return await registerUser(formData);
    },
    { message: '', errors: {}, success: false }
  );
  
  // Using React 19's useOptimistic for optimistic updates
  const [optimisticUsers, addOptimisticUser] = useOptimistic(
    users,
    (state: User[], newUser: User) => [...state, newUser]
  );
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(async () => {
      // Optimistic update
      const newUser: User = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        createdAt: new Date().toISOString()
      };
      
      addOptimisticUser(newUser);
      
      // Perform the actual registration
      const result = await registerUser(formData);
      
      if (result.success) {
        setUsers(prev => [...prev, newUser]);
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      }
    });
  };
  
  return (
    <div className="registration-container">
      <div className="registration-form-wrapper">
        <h1 className="form-title">Join Our Community</h1>
        <p className="form-subtitle">Create your account to get started</p>
        
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`form-input ${state.errors.name ? 'error' : ''}`}
              placeholder="Enter your full name"
              disabled={isPending || isPendingAction}
            />
            {state.errors.name && (
              <span className="error-message">{state.errors.name}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${state.errors.email ? 'error' : ''}`}
              placeholder="Enter your email"
              disabled={isPending || isPendingAction}
            />
            {state.errors.email && (
              <span className="error-message">{state.errors.email}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`form-input ${state.errors.password ? 'error' : ''}`}
              placeholder="Create a password"
              disabled={isPending || isPendingAction}
            />
            {state.errors.password && (
              <span className="error-message">{state.errors.password}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`form-input ${state.errors.confirmPassword ? 'error' : ''}`}
              placeholder="Confirm your password"
              disabled={isPending || isPendingAction}
            />
            {state.errors.confirmPassword && (
              <span className="error-message">{state.errors.confirmPassword}</span>
            )}
          </div>
          
          <button
            type="submit"
            className={`submit-button ${isPending || isPendingAction ? 'loading' : ''}`}
            disabled={isPending || isPendingAction}
          >
            {isPending || isPendingAction ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
          
          {state.message && (
            <div className={`message ${state.success ? 'success' : 'error'}`}>
              {state.message}
            </div>
          )}
        </form>
      </div>
      
      <div className="users-section">
        <h2 className="users-title">Recent Registrations</h2>
        <div className="users-list">
          {optimisticUsers.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-info">
                <h3 className="user-name">{user.name}</h3>
                <p className="user-email">{user.email}</p>
                <p className="user-date">
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}