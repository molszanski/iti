import { Auth } from './store.auth';

export interface AuthContainer {
  auth: Auth;
}

export async function provideAuthContainer(): Promise<AuthContainer> {
  const auth = new Auth();
  await auth.getToken();
  return {
    auth: auth,
  };
}
