import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

/**
 * Trigger 1: On Report Created
 * - Awards +10 points to user
 * - Updates city open reports counter
 * - Sends automated notification email to municipal authorities
 * - Runs optional AI verification
 */
export const onReportCreated = functions.firestore
  .document("reports/{reportId}")
  .onCreate(async (snap, context) => {
    const reportData = snap.data();
    const reportId = context.params.reportId;
    if (!reportData) return;

    // 1. Award +10 points to reporter
    if (reportData.userId && !reportData.anonymous) {
      const userRef = db.collection("users").doc(reportData.userId);
      await db.runTransaction(async (t) => {
        const userDoc = await t.get(userRef);
        if (userDoc.exists) {
          const currentPoints = userDoc.data()?.points || 0;
          const newPoints = currentPoints + 10;
          let level = userDoc.data()?.level || "Reporter";
          if (newPoints >= 2000) level = "Green Champion";
          else if (newPoints >= 1000) level = "Eco Hero";
          else if (newPoints >= 400) level = "Cleaner";

          t.update(userRef, {
            points: newPoints,
            level,
            "stats.reportsPosted": admin.firestore.FieldValue.increment(1),
          });
        }
      });
    }

    // 2. Update City statistics counter
    if (reportData.cityId) {
      const cityRef = db.collection("cities").doc(reportData.cityId);
      await cityRef.update({
        "stats.totalReports": admin.firestore.FieldValue.increment(1),
        "stats.openReports": admin.firestore.FieldValue.increment(1),
      }).catch((err) => functions.logger.warn("City stat update skipped", err));

      // 3. Auto-Forward complaint to Municipal Officers
      const cityDoc = await cityRef.get();
      const officerEmails: string[] = cityDoc.data()?.officerEmails || [];
      if (officerEmails.length > 0) {
        // Enqueue to Firebase "Trigger Email" extension mail collection
        await db.collection("mail").add({
          to: officerEmails,
          message: {
            subject: `[Swachh Alert] New Garbage Hotspot Reported: ${reportData.address}`,
            html: `
              <h2>Garbage Collection Platform - Hotspot Alert</h2>
              <p><strong>Location:</strong> ${reportData.address}</p>
              <p><strong>Ward:</strong> ${reportData.wardName || 'Ward Area'}</p>
              <p><strong>Waste Types:</strong> ${reportData.types?.join(', ')}</p>
              <p><strong>Severity:</strong> ${reportData.severity}</p>
              <p><strong>GPS Coordinates:</strong> ${reportData.lat}, ${reportData.lng}</p>
              <p><a href="https://garbagecollection.in/authority">Open Municipal Action Dashboard</a></p>
            `,
          },
        }).catch((err) => functions.logger.warn("Mail queue skipped", err));
      }
    }

    // 4. AI Garbage Detection Hook (Gemini API Integration)
    const enableAI = process.env.ENABLE_GEMINI_AI_VERIFY === "true";
    if (enableAI && reportData.mediaUrls && reportData.mediaUrls.length > 0) {
      functions.logger.info(`Running AI garbage classification for report ${reportId}`);
      // Stub: in production, calls Google Generative AI SDK to verify waste presence
    }
  });

/**
 * Trigger 2: On Report Status Transition
 * When an officer marks a report 'cleaned':
 * - Updates city cleaned counters and cleanliness score
 * - Sends FCM notification to the reporter
 */
export const onReportStatusUpdated = functions.firestore
  .document("reports/{reportId}")
  .onUpdate(async (change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();
    if (!beforeData || !afterData) return;

    if (beforeData.status !== "cleaned" && afterData.status === "cleaned") {
      // 1. Update city statistics
      if (afterData.cityId) {
        const cityRef = db.collection("cities").doc(afterData.cityId);
        await cityRef.update({
          "stats.openReports": admin.firestore.FieldValue.increment(-1),
          "stats.cleanedReports": admin.firestore.FieldValue.increment(1),
        }).catch(() => {});
      }

      // 2. Send FCM notification to reporter
      if (afterData.userId) {
        const userDoc = await db.collection("users").doc(afterData.userId).get();
        const fcmTokens = userDoc.data()?.fcmTokens || [];
        if (fcmTokens.length > 0) {
          await admin.messaging().sendEachForMulticast({
            tokens: fcmTokens,
            notification: {
              title: "Spot Cleaned! ✨",
              body: `Your reported garbage spot at ${afterData.address} has been resolved.`,
            },
            data: {
              reportId: context.params.reportId,
            },
          }).catch((err) => functions.logger.warn("FCM push failed", err));
        }
      }
    }
  });

/**
 * Trigger 3: On Event Volunteer Check-In
 * Awards +50 points when scanned via QR code
 */
export const onEventCheckIn = functions.firestore
  .document("events/{eventId}/rsvps/{userId}")
  .onWrite(async (change, context) => {
    const after = change.after.data();
    const before = change.before.data();
    if (!after) return;

    if (!before?.checkedIn && after.checkedIn) {
      const userId = context.params.userId;
      const userRef = db.collection("users").doc(userId);
      await userRef.update({
        points: admin.firestore.FieldValue.increment(50),
        "stats.eventsJoined": admin.firestore.FieldValue.increment(1),
      }).catch(() => {});
    }
  });
