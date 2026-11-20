import type {LoginCredentials, SessionUser} from '../types';

const delay = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

// Mock only. Any valid email plus a 6+ character password signs in.
// An email starting with "admin" previews the Admin view.
export async function mockLogin({
  email,
  password,
}: LoginCredentials): Promise<SessionUser> {
  await delay(700);

  if (password.length < 6) {
    throw new Error('Invalid email or password.');
  }

  const isAdmin = email.toLowerCase().startsWith('admin');

  return {
    id: 'mock-user-001',
    name: isAdmin ? 'Admin Demo' : 'Dr. Demo Staff',
    email,
    isAdmin,
    organization: 'Demo Rehabilitation Centre',
  };
}