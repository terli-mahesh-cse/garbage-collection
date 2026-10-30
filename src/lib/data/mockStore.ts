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
    const found = this.cities.find((c) => c.id.toLowerCase() === cityId.toLowerCase());
    if (found) return found;
    const formattedName = cityId.charAt(0).toUpperCase() + cityId.slice(1).replace(/-/g, " ");
    return this.addOrGetCity({
      id: cityId.toLowerCase(),
      name: formattedName,
    });
  }

  public addOrGetCity(cityInput: {
    id: string;
    name: string;
    countryCode?: string;
    countryName?: string;
    stateCode?: string;
    stateName?: string;
    lat?: number;
    lng?: number;
  }): City {
    const existing = this.cities.find((c) => c.id.toLowerCase() === cityInput.id.toLowerCase());
    if (existing) {
      if (cityInput.lat && cityInput.lng && (!existing.lat || !existing.lng || (existing.lat === 17.4435 && existing.id !== "hyderabad"))) {
        existing.lat = cityInput.lat;
        existing.lng = cityInput.lng;
      }
      if (cityInput.countryCode) existing.countryCode = cityInput.countryCode;
      if (cityInput.stateCode) existing.stateCode = cityInput.stateCode;
      if (cityInput.stateName) existing.stateName = cityInput.stateName;
      this.persist();
      return existing;
    }

    const lat = cityInput.lat || 20.5937;
    const lng = cityInput.lng || 78.9629;
    const newCity: City = {
      id: cityInput.id.toLowerCase(),
      name: cityInput.name,
      stateCode: cityInput.stateCode || "",
      stateName: cityInput.stateName || "",
      countryCode: cityInput.countryCode || "IN",
      lat,
      lng,
      cleanlinessScore: Math.floor(Math.random() * 20) + 75,
      officerEmails: [`sanitation.${cityInput.id.toLowerCase()}@civic-authority.gov`],
      stats: {
        totalReports: 14,
        cleanedReports: 9,
        inProgressReports: 3,
        openReports: 2,
        volunteersCount: 65,
        kgCleaned: 2450,
      },
      wards: [
        { id: `ward-${cityInput.id}-1`, name: `Ward 1 - ${cityInput.name} Central` },
        { id: `ward-${cityInput.id}-2`, name: `Ward 2 - ${cityInput.name} North` },
        { id: `ward-${cityInput.id}-3`, name: `Ward 3 - ${cityInput.name} South` },
        { id: `ward-${cityInput.id}-4`, name: `Ward 4 - ${cityInput.name} West` },
      ],
    };

    this.cities.unshift(newCity);

    // Seed initial realistic pins for this city anywhere on earth
    const sampleReports: Report[] = [
      {
        id: `rep-${cityInput.id}-1`,
        userId: "user-citizen-1",
        userName: "Community Watch",
        anonymous: false,
        mediaUrls: ["https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80"],
        mediaType: "image",
        lat: lat + 0.007,
        lng: lng + 0.005,
        geohash: encodeGeohash(lat + 0.007, lng + 0.005),
        address: `Central Plaza & Main St, ${cityInput.name}`,
        cityId: newCity.id,
        cityName: newCity.name,
        wardId: newCity.wards[0].id,
        wardName: newCity.wards[0].name,
        types: ["plastic", "household"],
        severity: "medium",
        status: "reported",
        description: `Discarded single-use packaging and litter reported near pedestrian walkway.`,
        upvotes: 16,
        stillDirtyCount: 0,
        volunteerIds: [],
        flagged: false,
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
      {
        id: `rep-${cityInput.id}-2`,
        userId: "user-citizen-1",
        userName: "Eco Volunteer",
        anonymous: false,
        mediaUrls: ["https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"],
        mediaType: "image",
        lat: lat - 0.005,
        lng: lng + 0.007,
        geohash: encodeGeohash(lat - 0.005, lng + 0.007),
        address: `Transit Station Park, ${cityInput.name}`,
        cityId: newCity.id,
        cityName: newCity.name,
        wardId: newCity.wards[1].id,
        wardName: newCity.wards[1].name,
        types: ["plastic"],
        severity: "small",
        status: "in_progress",
        description: `Weekend cleanup volunteers actively collecting and sorting plastic waste.`,
        upvotes: 24,
        stillDirtyCount: 0,
        volunteerIds: ["user-citizen-1"],
        flagged: false,
        createdAt: new Date(Date.now() - 3600000 * 7).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      },
      {
        id: `rep-${cityInput.id}-3`,
        userId: "user-officer-1",
        userName: "Zonal Sanitation Lead",
        anonymous: false,
        mediaUrls: ["https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80"],
        mediaType: "image",
        lat: lat + 0.003,
        lng: lng - 0.006,
        geohash: encodeGeohash(lat + 0.003, lng - 0.006),
        address: `Community Greenbelt, ${cityInput.name}`,
        cityId: newCity.id,
        cityName: newCity.name,
        wardId: newCity.wards[2].id,
        wardName: newCity.wards[2].name,
        types: ["debris", "plastic"],
        severity: "large",
        status: "cleaned",
        description: `Spot cleared and certified clean. Bins emptied and area sanitized.`,
        upvotes: 42,
        stillDirtyCount: 0,
        volunteerIds: [],
        flagged: false,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 7200000).toISOString(),
      }
    ];

    this.reports.push(...sampleReports);
    this.persist();
    return newCity;
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
