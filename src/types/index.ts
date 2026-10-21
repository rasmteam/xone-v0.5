export type NavigationTab = 
  | 'dashboard' 
  | 'constructionDashboard'
  | 'cde' 
  | 'bim' 
  | 'approvals' 
  | 'permissions' 
  | 'portfolio' 
  | 'roleSelect'
  | 'login';

export interface Project {
  id: string;
  code: string;
  name: string;
  location: string;
  stage: string;
  progress: number;
  baselineProgress: number;
  budget: string;
  status: 'onTrack' | 'critical' | 'atRisk' | 'finalizing';
  statusText: string;
  cdeSyncTime: string;
  activeAction?: string;
  image: string;
  usage?: string;
  floors?: string;
  area?: string;
  year?: string;
  landArea?: string;
  commonArea?: string;
  residentialArea?: string;
  unitsCount?: number | string;
  contractor?: string;
  bimCoordinator?: string;
  lod?: string;
  clashesCount?: number;
  documentsCount?: number;
  criticalIssues?: string;
  financialSpent?: string;
  stats?: { label: string; value: string; unit?: string }[];
}

export interface CdeFolder {
  id: string;
  name: string;
  path: string;
  filesCount: number;
  size?: string;
  badge?: string;
  children?: CdeFolder[];
  isExpanded?: boolean;
}

export interface CdeDocument {
  id: string;
  isoCode: string;
  title: string;
  format: 'RVT' | 'IFC' | 'NWD' | 'DWG' | 'XLSX' | 'PDF';
  discipline: string;
  author: string;
  authorRole?: string;
  revision: string;
  date: string;
  size: string;
  status: 'shared' | 'wip' | 'approved' | 'rejected' | 'pending' | 'revise';
  statusLabel: string;
  suitabilityCode: string; // e.g. Code A, S2, S3
  folderPath: string;
  folderId?: string;
}

export interface IpcItem {
  id: string;
  itemNo: string;
  description: string;
  unit: string;
  unitRate: number;
  prevQty: number;
  currentQty: number;
  totalQty: number;
  totalAmount: number;
  bimStatus: 'matched' | 'discrepancy' | 'verified';
  bimNote?: string;
}

export interface IpcCertificate {
  id: string;
  docCode: string;
  title: string;
  period: string;
  contractor: string;
  consultant: string;
  submissionDate: string;
  grossAmount: number;
  prevGrossAmount: number;
  totalGrossAmount: number;
  insuranceDeduction: number;
  retentionDeduction: number;
  advanceRepayment: number;
  netPayable: number;
  status: 'pending' | 'approved' | 'revision' | 'rejected';
  statusLabel: string;
  items: IpcItem[];
}

export interface ClashPreset {
  severity?: 'critical' | 'medium' | 'low' | 'all';
  status?: 'open' | 'resolved' | 'pending' | 'all';
  label?: string;
}

export interface ClashItem {
  id: string;
  code: string;
  title: string;
  description: string;
  type: 'Hard Clash' | 'Soft Clearance' | 'Resolved';
  discipline1: string;
  discipline2: string;
  element1: string;
  element1Id: string;
  element2: string;
  element2Id: string;
  location: string;
  zone: string;
  floorLevel?: string; // e.g. 'طبقات ۲۰ تا ۲۵', 'طبقات ۱۰ تا ۱۹', 'طبقات ۱ تا ۹', 'همکف و لابی', 'زیرزمین‌ها'
  disciplinePair?: string; // e.g. 'STR_MEP', 'STR_ARC', 'MEP_ELC', 'FAC_STR', 'ARC_MEP'
  assignedTo?: string;
  severity: 'critical' | 'medium' | 'low' | 'resolved';
  severityLabel: string;
  age: string;
  status: 'open' | 'resolved' | 'pending';
  statusLabel: string;
  penetration: string;
  coordinates: string;
  coordinatorNote: string;
}

export interface ApprovalItem {
  id: string;
  format: 'XLSX' | 'DWG' | 'RVT' | 'PDF' | 'IFC';
  code: string;
  title: string;
  discipline: string;
  sender: string;
  sla: string;
  slaUrgent: boolean;
  status: 'pending' | 'revision' | 'approved' | 'rejected';
  statusLabel: string;
  phase: string;
}

export interface RolePermission {
  code: string;
  roleName: string;
  description: string;
  permissionLevel: 'full' | 'contributor' | 'reviewer' | 'readonly' | 'none';
  levelLabel: string;
}

export interface UserOverride {
  id: string;
  initials: string;
  name: string;
  roleTitle: string;
  overrideType: string;
  accessLevel: string;
  email: string;
}

export interface Milestone {
  id: string;
  title: string;
  isCompleted: boolean;
  isCurrent?: boolean;
  targetDate?: string;
}
