export interface SessionUser {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  organization: string;
  token?: string;
  doctorFirstName?: string;
  doctorLastName?: string;
  doctorPhoto?: string;
  organizationIndustry?: string;
  hasAccessToken?: boolean;
  organizationLocation?: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface DoctorLoginResponse {
  token: string;
  is_admin: boolean;
  doctor_id: string;
  doctor_first_name?: string;
  doctor_last_name?: string;
  doctor_photo?: string;
  organization_industry?: string;
  has_access_token?: boolean;
  organization_location?: string[];
  message?: string;
}
