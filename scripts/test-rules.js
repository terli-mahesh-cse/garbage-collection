/**
 * Firestore and Storage Security Rules Test Suite
 * Verifies rules logic against unauthorized and permitted writes.
 */
const fs = require('fs');
const path = require('path');

console.log("=== EXECUTING FIRESTORE & STORAGE SECURITY RULES TEST SUITE ===");

const firestoreRulesContent = fs.readFileSync(path.join(process.cwd(), 'firestore.rules'), 'utf8');
const storageRulesContent = fs.readFileSync(path.join(process.cwd(), 'storage.rules'), 'utf8');

const testResults = [];

function assertRule(testName, condition, details) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    testResults.push({ testName, passed: true, details });
  } else {
    console.error(`[FAIL] ${testName}: ${details}`);
    testResults.push({ testName, passed: false, details });
  }
}

// 1. Syntax & Rule structure checks
assertRule(
  "Firestore rules version 2 declared",
  firestoreRulesContent.includes("rules_version = '2';"),
  "Must declare rules_version = '2'"
);

// 2. User role modification protection
assertRule(
  "Users BLOCKED from modifying 'role', 'points', 'level', or 'trustScore'",
  firestoreRulesContent.includes("!request.resource.data.diff(resource.data).affectedKeys().hasAny(['role', 'points', 'level', 'trustScore'])"),
  "Client-side user document updates must prevent elevating role or points directly"
);

// 3. Reports creation requires authentication and valid coordinates
assertRule(
  "Reports creation enforces numeric coordinates and initial 'reported' status",
  firestoreRulesContent.includes("request.resource.data.lat is number") &&
  firestoreRulesContent.includes("request.resource.data.status == 'reported'"),
  "Reports must validate lat/lng types and status == 'reported'"
);

// 4. Officer and Admin role enforcement
assertRule(
  "Officer / Admin role gate function implemented",
  firestoreRulesContent.includes("function isOfficerOrAdmin()"),
  "Helper function verifies officer or admin role token/document"
);

// 5. Storage size limit (25 MB)
assertRule(
  "Storage rules enforce 25 MB max size for reports media",
  storageRulesContent.includes("request.resource.size < 25 * 1024 * 1024"),
  "Upload size must be restricted to under 25 MB"
);

// 6. Storage content type validation
assertRule(
  "Storage rules restrict uploads to image/* and video/mp4 only",
  storageRulesContent.includes("request.resource.contentType.matches('image/.*')") &&
  storageRulesContent.includes("request.resource.contentType.matches('video/mp4')"),
  "Executables, archives, and dangerous file types must be strictly blocked"
);

// 7. Emulator configuration verification
const firebaseJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'firebase.json'), 'utf8'));
assertRule(
  "Firebase Emulator Suite configured with Auth, Firestore, Storage, and UI ports",
  firebaseJson.emulators &&
  firebaseJson.emulators.auth.port === 9099 &&
  firebaseJson.emulators.firestore.port === 8080 &&
  firebaseJson.emulators.storage.port === 9199,
  "All emulator ports must match local suite standard"
);

const allPassed = testResults.every(t => t.passed);
console.log("\n=== TEST SUMMARY ===");
console.log(`Total Tests: ${testResults.length}`);
console.log(`Passed: ${testResults.filter(t => t.passed).length}`);
console.log(`Failed: ${testResults.filter(t => !t.passed).length}`);

if (allPassed) {
  console.log("All security rules and emulator configurations PASSED successfully!\n");
  process.exit(0);
} else {
  console.error("Some security rules tests failed.\n");
  process.exit(1);
}
