export enum PatientStatus {
  STABLE = "stable",
  MONITORING = "monitoring",
  CRITICAL = "critical"
}

export enum MRCStage {
  STAGE_1 = "1",
  STAGE_2 = "2",
  STAGE_3A = "3A",
  STAGE_3B = "3B",
  STAGE_4 = "4",
  STAGE_5 = "5"
}

export type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  phoneNumber: string;
  email: string;
  address: string;
  status: PatientStatus;
  mrcStage: MRCStage;
  created: string;
  lastVisit: string;
  nextAppointment?: string;
  medicalHistory: {
    conditions: string[];
    allergies: string[];
    surgeries: string[];
    medications: {
      name: string;
      dosage: string;
      frequency: string;
    }[];
  };
};

export type MedicalRecord = {
  id: string;
  patientId: string;
  date: string;
  type: string;
  results: MedicalResult[];
  notes: string;
  doctor: string;
};

export type MedicalResult = {
  key: string;
  name: string;
  value: number;
  unit: string;
  normalRange: {
    min: number;
    max: number;
  };
  isNormal: boolean;
};

export type Appointment = {
  id: string;
  patientId: string;
  date: string;
  time: string;
  duration: number; // In minutes
  type: string;
  status: "scheduled" | "completed" | "cancelled" | "missed";
  notes: string;
  doctor: string;
};

export type Alert = {
  id: string;
  patientId: string;
  type: "danger" | "warning" | "info" | "success";
  message: string;
  date: string;
  isRead: boolean;
  relatedTo?: string; // ID of related entity (medical record, appointment, etc.)
};

export type MetricHistory = {
  patientId: string;
  metric: string;
  unit: string;
  values: {
    date: string;
    value: number;
  }[];
};

export type Workflow = {
  id: string;
  name: string;
  description: string;
  mrcStage: MRCStage;
  tasks: WorkflowTask[];
};

export type WorkflowTask = {
  id: string;
  name: string;
  type: "test" | "appointment" | "medication" | "monitoring";
  frequency: string;
  description: string;
  alertThresholds?: {
    metric: string;
    min?: number;
    max?: number;
  }[];
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "doctor" | "nurse" | "patient";
  profileImage?: string;
};
