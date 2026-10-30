export type UserRole = 'citizen' | 'volunteer' | 'officer' | 'admin';

export interface User {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  photoURL?: string;
  cityId: string;
  cityName?: string;
  place?: string;
  stateCode?: string;
  stateName?: string;
  countryCode?: string;
  countryName?: string;
  role: UserRole;
  points: number;
  level: string; // 'Reporter' | 'Cleaner' | 'Eco Hero' | 'Green Champion'
  streak: number;
  trustScore: number;
  badges: string[];
  fcmTokens?: string[];
  lang: 'en' | 'hi' | 'te';
  createdAt: string;
}

export type GarbageType = 
  | 'plastic'
  | 'household'
  | 'debris'
  | 'medical'
  | 'e-waste'
  | 'dead_animal'
  | 'drain_block';

export type ReportSeverity = 'small' | 'medium' | 'large';

export type ReportStatus = 'reported' | 'in_progress' | 'cleaned';

export interface ReportUpdate {
  id: string;
  reportId: string;
  beforeUrl?: string;
  afterUrl?: string;
  statusChange: ReportStatus;
  updatedBy: string;
  updaterName?: string;
  updaterRole?: UserRole;
  note?: string;
  createdAt: string;
}

export interface ReportComment {
  id: string;
  reportId: string;
  userId: string;
  userName: string;
  userRole?: UserRole;
  text: string;
  createdAt: string;
}

export interface Report {
  id: string;
  userId: string | null;
  userName?: string;
  anonymous: boolean;
  mediaUrls: string[];
  mediaType: 'image' | 'video';
  lat: number;
  lng: number;
  geohash: string;
  address: string;
  cityId: string;
  cityName: string;
  wardId: string;
  wardName: string;
  types: GarbageType[];
  severity: ReportSeverity;
  status: ReportStatus;
  description: string;
  upvotes: number;
  upvotedBy?: string[];
  stillDirtyCount: number;
  volunteerIds: string[];
  flagged: boolean;
  updates?: ReportUpdate[];
  commentsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface City {
  id: string;
  name: string;
  stateCode: string;
  stateName: string;
  countryCode: string;
  lat: number;
  lng: number;
  cleanlinessScore: number; // 0-100
  officerEmails: string[];
  stats: {
    totalReports: number;
    cleanedReports: number;
    inProgressReports: number;
    openReports: number;
    volunteersCount: number;
    kgCleaned: number;
  };
  wards: { id: string; name: string }[];
}

export interface Organization {
  id: string;
  name: string;
  cityId: string;
  cityName: string;
  description: string;
  logo: string;
  adminId: string;
  adminName: string;
  memberCount: number;
  foundedYear: number;
  inviteCode: string;
  stats: {
    kgCleaned: number;
    eventsHeld: number;
    volunteers: number;
    spotsCleaned: number;
  };
}

export interface OrgMember {
  userId: string;
  userName: string;
  userRole: 'Admin' | 'Moderator' | 'Volunteer';
  avatar?: string;
  joinedAt: string;
}

export interface OrgMessage {
  id: string;
  orgId: string;
  userId: string;
  userName: string;
  userRole?: string;
  text: string;
  createdAt: string;
}

export interface CleanupEvent {
  id: string;
  orgId: string;
  orgName: string;
  title: string;
  description: string;
  startAt: string; // ISO date string
  formattedDate: string; // e.g. "27 SEP"
  formattedTime: string; // e.g. "7:00 AM"
  lat: number;
  lng: number;
  address: string;
  cityName: string;
  capacity: number;
  rsvpCount: number;
  attendeeIds: string[];
  checkedInUserIds: string[];
  bring: string[];
  provided: string[];
  coverUrl?: string;
  galleryUrls: { before: string[]; after: string[] };
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface EventRsvp {
  eventId: string;
  userId: string;
  userName: string;
  checkedIn: boolean;
  checkedInAt?: string;
  certificateIssued: boolean;
}

export interface Dustbin {
  id: string;
  lat: number;
  lng: number;
  address: string;
  cityId: string;
  type: 'wet' | 'dry' | 'both' | 'recycling_center';
}

export interface AwarenessArticle {
  id: string;
  title: string;
  category: 'segregation' | 'composting' | 'plastic_free' | 'guidelines';
  summary: string;
  content: string;
  readTimeMinutes: number;
  imageUrl: string;
  badge?: string;
}

export interface EcoChallenge {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  pointsReward: number;
  duration: string;
  badgeReward: string;
  isCompleted?: boolean;
}
