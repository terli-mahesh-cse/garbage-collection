import { Report, Organization, CleanupEvent, City, User, Dustbin, AwarenessArticle, EcoChallenge, OrgMessage } from "@/types";
import { 
  SEED_CITIES, 
  SEED_REPORTS, 
  SEED_ORGANIZATIONS, 
  SEED_EVENTS, 
  SEED_USERS, 
  SEED_DUSTBINS, 
  SEED_ARTICLES, 
  SEED_CHALLENGES 
} from "./seedData";
import { encodeGeohash } from "../utils";

class DataStore {
  private reports: Report[] = [];
  private organizations: Organization[] = [];
  private events: CleanupEvent[] = [];
  private cities: City[] = [];
  private users: User[] = [];
  private dustbins: Dustbin[] = [];
  private articles: AwarenessArticle[] = [];
  private challenges: EcoChallenge[] = [];
  private messages: Record<string, OrgMessage[]> = {};
  private listeners: Set<() => void> = new Set();
  private initialized: boolean = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === "undefined") {
      this.reports = [...SEED_REPORTS];
      this.organizations = [...SEED_ORGANIZATIONS];
      this.events = [...SEED_EVENTS];
      this.cities = [...SEED_CITIES];
      this.users = [...SEED_USERS];
      this.dustbins = [...SEED_DUSTBINS];
      this.articles = [...SEED_ARTICLES];
      this.challenges = [...SEED_CHALLENGES];
      return;
    }

    try {
      const storedReports = localStorage.getItem("gc_reports");
      this.reports = storedReports ? JSON.parse(storedReports) : [...SEED_REPORTS];

      const storedOrgs = localStorage.getItem("gc_orgs");
      this.organizations = storedOrgs ? JSON.parse(storedOrgs) : [...SEED_ORGANIZATIONS];

      const storedEvents = localStorage.getItem("gc_events");
      this.events = storedEvents ? JSON.parse(storedEvents) : [...SEED_EVENTS];

      const storedCities = localStorage.getItem("gc_cities");
      this.cities = storedCities ? JSON.parse(storedCities) : [...SEED_CITIES];

      const storedUsers = localStorage.getItem("gc_users");
      this.users = storedUsers ? JSON.parse(storedUsers) : [...SEED_USERS];

      const storedMessages = localStorage.getItem("gc_messages");
      this.messages = storedMessages ? JSON.parse(storedMessages) : {
        "org-ckg": [
          {
            id: "msg-1",
            orgId: "org-ckg",
            userId: "user-citizen-1",
            userName: "Ravi Kumar",
            userRole: "Admin",
            text: "Welcome everyone! Reminder: Tank Bund cleanup drive is this Sunday at 7:00 AM.",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: "msg-2",
            orgId: "org-ckg",
            userId: "user-citizen-2",
            userName: "Anita S.",
            userRole: "Moderator",
            text: "We have 40 extra pairs of puncture-safe gloves arriving on Friday!",
            createdAt: new Date(Date.now() - 36000000).toISOString(),
          }
        ]
      };

      this.dustbins = [...SEED_DUSTBINS];
      this.articles = [...SEED_ARTICLES];
      this.challenges = [...SEED_CHALLENGES];
      this.initialized = true;
    } catch (e) {
      console.warn("Storage restore error:", e);
      this.reports = [...SEED_REPORTS];
      this.organizations = [...SEED_ORGANIZATIONS];
      this.events = [...SEED_EVENTS];
      this.cities = [...SEED_CITIES];
      this.users = [...SEED_USERS];
      this.dustbins = [...SEED_DUSTBINS];
      this.articles = [...SEED_ARTICLES];
      this.challenges = [...SEED_CHALLENGES];
    }
  }

  private persist() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("gc_reports", JSON.stringify(this.reports));
      localStorage.setItem("gc_orgs", JSON.stringify(this.organizations));
      localStorage.setItem("gc_events", JSON.stringify(this.events));
      localStorage.setItem("gc_cities", JSON.stringify(this.cities));
      localStorage.setItem("gc_users", JSON.stringify(this.users));
      localStorage.setItem("gc_messages", JSON.stringify(this.messages));
    } catch (e) {
      console.error("Local storage persist failed", e);
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  // --- Reports ---
  public getReports(cityId?: string): Report[] {
    if (!cityId) return this.reports;
    return this.reports.filter((r) => r.cityId.toLowerCase() === cityId.toLowerCase());
  }

  public getReportById(id: string): Report | undefined {
    return this.reports.find((r) => r.id === id);
  }

  public addReport(reportData: Omit<Report, "id" | "createdAt" | "updatedAt" | "upvotes" | "stillDirtyCount" | "volunteerIds" | "flagged" | "geohash">): Report {
    const id = `rep-${Date.now().toString().slice(-5)}`;
    const newReport: Report = {
      ...reportData,
      id,
      geohash: encodeGeohash(reportData.lat, reportData.lng),
      upvotes: 1,
      stillDirtyCount: 0,
      volunteerIds: [],
      flagged: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.reports = [newReport, ...this.reports];
    
    // Update city statistics
    const city = this.cities.find(c => c.id === reportData.cityId);
    if (city) {
      city.stats.totalReports += 1;
      city.stats.openReports += 1;
    }

    this.persist();
    return newReport;
  }

  public toggleUpvote(reportId: string, userId: string = "current-user"): { upvoted: boolean; count: number } {
    const report = this.reports.find((r) => r.id === reportId);
    if (!report) return { upvoted: false, count: 0 };

    if (!report.upvotedBy) report.upvotedBy = [];
    const idx = report.upvotedBy.indexOf(userId);

    let upvoted = false;
    if (idx >= 0) {
      report.upvotedBy.splice(idx, 1);
      report.upvotes = Math.max(0, report.upvotes - 1);
      upvoted = false;
    } else {
      report.upvotedBy.push(userId);
      report.upvotes += 1;
      upvoted = true;
    }

    this.persist();
    return { upvoted, count: report.upvotes };
  }

  public markStillDirty(reportId: string): number {
    const report = this.reports.find((r) => r.id === reportId);
    if (!report) return 0;
    report.stillDirtyCount = (report.stillDirtyCount || 0) + 1;
    report.updatedAt = new Date().toISOString();
    this.persist();
    return report.stillDirtyCount;
  }

  public volunteerToClean(reportId: string, userId: string = "user-citizen-1"): boolean {
    const report = this.reports.find((r) => r.id === reportId);
    if (!report) return false;
    if (!report.volunteerIds) report.volunteerIds = [];
    if (!report.volunteerIds.includes(userId)) {
      report.volunteerIds.push(userId);
      if (report.status === "reported") {
        report.status = "in_progress";
      }
      report.updatedAt = new Date().toISOString();
      this.persist();
      return true;
    }
    return false;
  }

  public updateReportStatus(
    reportId: string, 
    status: Report['status'], 
    officerName: string = "Authority Officer", 
    note?: string,
    afterUrl?: string
  ): boolean {
    const report = this.reports.find((r) => r.id === reportId);
    if (!report) return false;

    const prevStatus = report.status;
    report.status = status;
    report.updatedAt = new Date().toISOString();

    if (!report.updates) report.updates = [];
    report.updates.push({
      id: `upd-${Date.now()}`,
      reportId,
      statusChange: status,
      updatedBy: "officer",
      updaterName: officerName,
      updaterRole: "officer",
      note: note || `Status transitioned from ${prevStatus} to ${status}.`,
      afterUrl,
      createdAt: new Date().toISOString(),
    });

    // Update city counters
    const city = this.cities.find(c => c.id === report.cityId);
    if (city) {
      if (prevStatus === "reported") city.stats.openReports = Math.max(0, city.stats.openReports - 1);
      if (prevStatus === "in_progress") city.stats.inProgressReports = Math.max(0, city.stats.inProgressReports - 1);
      
      if (status === "in_progress") city.stats.inProgressReports += 1;
      if (status === "cleaned") {
        city.stats.cleanedReports += 1;
        city.stats.kgCleaned += (report.severity === 'large' ? 120 : report.severity === 'medium' ? 50 : 15);
        city.cleanlinessScore = Math.min(98, Math.round((city.stats.cleanedReports / city.stats.totalReports) * 100));
      }
    }

    this.persist();
    return true;
  }

  // --- Cities ---
  public getCities(): City[] {
    return this.cities;
  }

  public getCity(cityId: string): City | undefined {
    return this.cities.find((c) => c.id.toLowerCase() === cityId.toLowerCase()) || this.cities[0];
  }

  // --- Organizations ---
  public getOrganizations(cityId?: string): Organization[] {
    if (!cityId) return this.organizations;
    return this.organizations.filter((o) => o.cityId.toLowerCase() === cityId.toLowerCase());
  }

  public getOrganizationById(id: string): Organization | undefined {
    return this.organizations.find((o) => o.id === id);
  }

  public addOrganization(org: Omit<Organization, "id" | "memberCount" | "stats" | "inviteCode" | "foundedYear">): Organization {
    const id = `org-${Date.now().toString().slice(-4)}`;
    const newOrg: Organization = {
      ...org,
      id,
      memberCount: 1,
      foundedYear: 2026,
      inviteCode: `${org.name.replace(/\s+/g, "-").toUpperCase()}-2026`,
      stats: {
        kgCleaned: 0,
        eventsHeld: 0,
        volunteers: 1,
        spotsCleaned: 0,
      },
    };
    this.organizations = [newOrg, ...this.organizations];
    this.persist();
    return newOrg;
  }

  public getOrgMessages(orgId: string): OrgMessage[] {
    return this.messages[orgId] || [];
  }

  public addOrgMessage(orgId: string, text: string, userName: string = "Citizen", userRole: string = "Volunteer"): OrgMessage {
    const newMsg: OrgMessage = {
      id: `msg-${Date.now()}`,
      orgId,
      userId: "current-user",
      userName,
      userRole,
      text,
      createdAt: new Date().toISOString(),
    };
    if (!this.messages[orgId]) this.messages[orgId] = [];
    this.messages[orgId].push(newMsg);
    this.persist();
    return newMsg;
  }

  // --- Events ---
  public getEvents(cityId?: string): CleanupEvent[] {
    return this.events;
  }

  public getEventById(id: string): CleanupEvent | undefined {
    return this.events.find((e) => e.id === id);
  }

  public addEvent(eventData: Omit<CleanupEvent, "id" | "rsvpCount" | "attendeeIds" | "checkedInUserIds" | "status" | "galleryUrls">): CleanupEvent {
    const id = `event-${Date.now().toString().slice(-4)}`;
    const newEvent: CleanupEvent = {
      ...eventData,
      id,
      rsvpCount: 1,
      attendeeIds: ["user-citizen-1"],
      checkedInUserIds: [],
      status: "upcoming",
      galleryUrls: { before: [], after: [] },
    };
    this.events = [newEvent, ...this.events];
    this.persist();
    return newEvent;
  }

  public rsvpEvent(eventId: string, userId: string = "user-citizen-1"): boolean {
    const ev = this.events.find((e) => e.id === eventId);
    if (!ev) return false;
    if (!ev.attendeeIds) ev.attendeeIds = [];
    
    const idx = ev.attendeeIds.indexOf(userId);
    if (idx >= 0) {
      ev.attendeeIds.splice(idx, 1);
      ev.rsvpCount = Math.max(0, ev.rsvpCount - 1);
    } else {
      ev.attendeeIds.push(userId);
      ev.rsvpCount += 1;
    }
    this.persist();
    return true;
  }

  public checkInAttendee(eventId: string, userId: string): boolean {
    const ev = this.events.find((e) => e.id === eventId);
    if (!ev) return false;
    if (!ev.checkedInUserIds) ev.checkedInUserIds = [];
    if (!ev.checkedInUserIds.includes(userId)) {
      ev.checkedInUserIds.push(userId);
      this.persist();
      return true;
    }
    return false;
  }

  // --- Dustbins & Awareness ---
  public getDustbins(cityId?: string): Dustbin[] {
    return this.dustbins;
  }

  public getArticles(): AwarenessArticle[] {
    return this.articles;
  }

  public getChallenges(): EcoChallenge[] {
    return this.challenges;
  }

  // Reset to seed defaults
  public resetToSeed() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("gc_reports");
      localStorage.removeItem("gc_orgs");
      localStorage.removeItem("gc_events");
      localStorage.removeItem("gc_cities");
      localStorage.removeItem("gc_users");
      localStorage.removeItem("gc_messages");
    }
    this.init();
    this.notify();
  }
}

export const mockStore = new DataStore();
