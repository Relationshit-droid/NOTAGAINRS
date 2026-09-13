#!/usr/bin/env node
/**
 * Create Admin User Script
 * 
 * Run this locally with a service account key to create the first admin user.
 * 
 * Prerequisites:
 * 1. Download a service account key from Firebase Console > Project Settings > Service Accounts
 * 2. Save it as `service-account-key.json` in the admin folder (gitignored)
 * 3. Run: npm run create-admin -- --email=admin@example.com --password=securePass123 --name="Admin User"
 * 
 * Or set env vars:
 *   ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=securePass123 ADMIN_NAME="Admin User" npm run create-admin
 */

import * as admin from "firebase-admin";
import * as path from "path";
import * as fs from "fs";

// Load service account key
const SERVICE_ACCOUNT_PATH = path.join(__dirname, "..", "service-account-key.json");

if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error("❌ Service account key not found at:", SERVICE_ACCOUNT_PATH);
  console.error("\nPlease download a service account key from Firebase Console:");
  console.error("  Project Settings > Service Accounts > Generate New Private Key");
  console.error("Save it as 'service-account-key.json' in the admin folder.\n");
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, "utf8"));

// Initialize Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();
const db = admin.firestore();

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options: { email?: string; password?: string; name?: string } = {};
  
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--email=")) options.email = args[i].split("=")[1];
    else if (args[i].startsWith("--password=")) options.password = args[i].split("=")[1];
    else if (args[i].startsWith("--name=")) options.name = args[i].split("=")[1];
    else if (args[i] === "--email" && args[i + 1]) options.email = args[++i];
    else if (args[i] === "--password" && args[i + 1]) options.password = args[++i];
    else if (args[i] === "--name" && args[i + 1]) options.name = args[++i];
  }
  
  // Also check env vars
  options.email = options.email || process.env.ADMIN_EMAIL;
  options.password = options.password || process.env.ADMIN_PASSWORD;
  options.name = options.name || process.env.ADMIN_NAME;
  
  return options;
}

async function createAdminUser() {
  const options = parseArgs();
  
  if (!options.email || !options.password) {
    console.error("❌ Missing required arguments:");
    console.error("  --email=admin@example.com --password=securePass123 [--name=\"Admin User\"]");
    console.error("\nOr set env vars: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME");
    process.exit(1);
  }

  if (options.password.length < 6) {
    console.error("❌ Password must be at least 6 characters");
    process.exit(1);
  }

  const email = options.email;
  const password = options.password;
  const displayName = options.name || "Admin User";

  console.log(`\n🔐 Creating admin user: ${email}`);
  console.log(`   Display Name: ${displayName}`);

  try {
    // Check if user already exists
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
      console.log(`\n⚠️  User already exists with UID: ${userRecord.uid}`);
      console.log("   Updating custom claims to add admin role...");
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        // Create new user
        userRecord = await auth.createUser({
          email,
          password,
          displayName,
          emailVerified: true,
        });
        console.log(`\n✅ Created new user with UID: ${userRecord.uid}`);
      } else {
        throw error;
      }
    }

    // Set custom claim
    await auth.setCustomUserClaims(userRecord.uid, { admin: true });
    console.log("✅ Set custom claim: admin: true");

    // Update Firestore
    await db.collection("users").doc(userRecord.uid).set({
      email,
      displayName,
      role: "admin",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    console.log("✅ Updated Firestore user document");

    console.log(`\n🎉 Admin user ready!`);
    console.log(`   UID: ${userRecord.uid}`);
    console.log(`   Email: ${email}`);
    console.log(`   Role: admin`);
    console.log(`\n📝 Next steps:`);
    console.log(`   1. Sign in with this email/password in the app`);
    console.log(`   2. The admin panel will be available when ENABLE_ADMIN_PANEL=true`);
    console.log(`   3. Token will refresh automatically on next sign-in`);

  } catch (error: any) {
    console.error("\n❌ Error:", error.message);
    if (error.code === "auth/email-already-exists") {
      console.error("   A user with this email already exists. Try signing in instead.");
    }
    process.exit(1);
  }
}

createAdminUser();