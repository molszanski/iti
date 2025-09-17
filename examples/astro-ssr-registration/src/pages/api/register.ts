import type { APIRoute } from 'astro';

interface RegistrationData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface APIResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
  user?: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
}

// In-memory storage for demo purposes
// In a real application, you would use a database
let users: Array<{
  id: string;
  name: string;
  email: string;
  password: string; // In real app, this would be hashed
  createdAt: string;
}> = [];

export const POST: APIRoute = async ({ request }) => {
  try {
    const data: RegistrationData = await request.json();
    
    // Validation
    const errors: Record<string, string> = {};
    
    if (!data.name?.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!data.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Email is invalid';
    } else if (users.some(user => user.email === data.email)) {
      errors.email = 'Email already exists';
    }
    
    if (!data.password) {
      errors.password = 'Password is required';
    } else if (data.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(errors).length > 0) {
      const response: APIResponse = {
        success: false,
        message: 'Please fix the errors below',
        errors
      };
      
      return new Response(JSON.stringify(response), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password, // In real app, hash this
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    const response: APIResponse = {
      success: true,
      message: 'Registration successful! Welcome aboard!',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt
      }
    };
    
    return new Response(JSON.stringify(response), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    
    const response: APIResponse = {
      success: false,
      message: 'An unexpected error occurred. Please try again.'
    };
    
    return new Response(JSON.stringify(response), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const GET: APIRoute = async () => {
  // Return list of users (without passwords)
  const publicUsers = users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  }));
  
  return new Response(JSON.stringify({
    success: true,
    users: publicUsers
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};