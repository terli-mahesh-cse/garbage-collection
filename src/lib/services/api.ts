import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  arrayUnion,
  increment
} from "firebase/firestore";
import * as geofire from "geofire-common";
import { db } from "../firebase";
import { mockStore } from "../data/mockStore";
import { reportSchema } from "../validations";
import { Report, CleanupEvent, Organization, GarbageType, ReportStatus, UserRole } from "@/types";

/**
 * Single Unified Data-Access Layer (DAL).
 * Real Firebase wiring is executed first whenever initialized.
 * Falls back to in-memory/localStorage mockStore if Firebase is offline or unconfigured.
 */
class ApiService {
  private hasLiveFirebase(): boolean {
    return !!db && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "AIzaSyDemoKeyForGarbageCollectionApp";
  }

  // --- REPORTS ---
  async getReports(cityId?: string): Promise<Report[]> {
    if (this.hasLiveFirebase()) {
      try {
        const reportsRef = collection(db, "reports");
        const q = cityId 
          ? query(reportsRef, where("cityId", "==", cityId.toLowerCase()), orderBy("createdAt", "desc"), limit(100))
          : query(reportsRef, orderBy("createdAt", "desc"), limit(100));

        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Report));
        }
      } catch (err) {
        console.warn("Firestore query fallback to reactive store:", err);
      }
    }
    // Fallback to reactive store
    return mockStore.getReports(cityId);
  }

  async getReportsNear(lat: number, lng: number, radiusInMeters: number = 5000): Promise<Report[]> {
    // Uses geofire-common query bounds
    const center: [number, number] = [lat, lng];
    const bounds = geofire.geohashQueryBounds(center, radiusInMeters);

    if (this.hasLiveFirebase()) {
      try {
        const matchingReports: Report[] = [];
        for (const b of bounds) {
          const q = query(
            collection(db, "reports"),
            where("geohash", ">=", b[0]),
            where("geohash", "<=", b[1])
          );
          const snap = await getDocs(q);
          snap.forEach(d => {
            const data = d.data();
            const distInKm = geofire.distanceBetween([data.lat, data.lng], center);
            if (distInKm * 1000 <= radiusInMeters) {
              matchingReports.push({ ...data, id: d.id } as Report);
            }
          });
        }
        if (matchingReports.length > 0) return matchingReports;
      } catch (err) {
        console.warn("Geohash query fallback:", err);
      }
    }

    // Local fallback near-me calculation
    const all = mockStore.getReports();
    return all.filter(r => {
      const dist = geofire.distanceBetween([r.lat, r.lng], center);
      return dist * 1000 <= radiusInMeters;
    });
  }

  async createReport(input: unknown): Promise<Report> {
    // 1. Zod input validation
    const validated = reportSchema.parse(input);
    const anyInput = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;

    // 2. Geohash calculation with geofire-common
    const hash = geofire.geohashForLocation([validated.lat, validated.lng]);

    const reportBase: Omit<Report, "id" | "createdAt" | "updatedAt" | "upvotes" | "stillDirtyCount" | "volunteerIds" | "flagged" | "geohash"> = {
      ...validated,
      userId: typeof anyInput.userId === "string" ? anyInput.userId : null,
      userName: typeof anyInput.userName === "string" ? anyInput.userName : (validated.anonymous ? "Anonymous Citizen" : "Active Citizen"),
      wardId: validated.wardId || "ward-central",
      wardName: validated.wardName || "Central Ward",
      status: "reported",
    };

    const fullPayload: Omit<Report, "id"> = {
      ...reportBase,
      geohash: hash,
      upvotes: 1,
      stillDirtyCount: 0,
      volunteerIds: [],
      flagged: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (this.hasLiveFirebase()) {
      try {
        const docRef = await addDoc(collection(db, "reports"), {
          ...fullPayload,
          serverTimestamp: serverTimestamp(),
        });
        const created: Report = { id: docRef.id, ...fullPayload };
        // Sync to mock store for offline client freshness
        mockStore.addReport(reportBase);
        return created;
      } catch (err) {
        console.warn("Firestore addDoc fallback to mockStore:", err);
      }
    }

    // Fallback store
    return mockStore.addReport(reportBase);
  }

  async upvoteReport(reportId: string, userId: string): Promise<{ upvoted: boolean; count: number }> {
    if (this.hasLiveFirebase()) {
      try {
        const reportRef = doc(db, "reports", reportId);
        await updateDoc(reportRef, {
          upvotes: increment(1),
          upvotedBy: arrayUnion(userId),
        });
      } catch (err) {
        console.warn("Firestore upvote fallback:", err);
      }
    }
    return mockStore.toggleUpvote(reportId, userId);
  }

  async updateReportStatus(
    reportId: string, 
    status: ReportStatus, 
    officerName: string, 
    note?: string
  ): Promise<boolean> {
    if (this.hasLiveFirebase()) {
      try {
        const reportRef = doc(db, "reports", reportId);
        await updateDoc(reportRef, {
          status,
          updatedAt: new Date().toISOString(),
        });
        // Log update in subcollection
        await addDoc(collection(db, `reports/${reportId}/updates`), {
          statusChange: status,
          updatedBy: officerName,
          note: note || "Status updated by authority",
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn("Firestore status update fallback:", err);
      }
    }
    return mockStore.updateReportStatus(reportId, status, officerName, note);
  }

  // --- EVENTS ---
  async getEvents(cityId?: string): Promise<CleanupEvent[]> {
    if (this.hasLiveFirebase()) {
      try {
        const eventsRef = collection(db, "events");
        const snap = await getDocs(eventsRef);
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as CleanupEvent));
        }
      } catch (err) {
        console.warn("Firestore events query fallback:", err);
      }
    }
    return mockStore.getEvents(cityId);
  }

  async rsvpEvent(eventId: string, userId: string): Promise<boolean> {
    if (this.hasLiveFirebase()) {
      try {
        const evRef = doc(db, "events", eventId);
        await updateDoc(evRef, {
          rsvpCount: increment(1),
          attendeeIds: arrayUnion(userId),
        });
      } catch (err) {
        console.warn("Firestore rsvp fallback:", err);
      }
    }
    return mockStore.rsvpEvent(eventId, userId);
  }

  // --- ORGANIZATIONS ---
  async getOrganizations(cityId?: string): Promise<Organization[]> {
    if (this.hasLiveFirebase()) {
      try {
        const orgsRef = collection(db, "organizations");
        const snap = await getDocs(orgsRef);
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as Organization));
        }
      } catch (err) {
        console.warn("Firestore orgs fallback:", err);
      }
    }
    return mockStore.getOrganizations(cityId);
  }
}

export const apiService = new ApiService();
