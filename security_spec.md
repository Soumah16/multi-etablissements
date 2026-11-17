# SmartSchool ERP Guinée — Firestore Security Specification (Phase 0)

## 1. Data Invariants & Master Source of Truth

1. **Verified Identity Gate**: No anonymous or unverified (`email_verified != true`) user may ever read or write any business document.
2. **Master Gate Tenant Isolation**: `/workspaces/{workspaceId}` is the root tenant authority. Access to `/workspaces/{workspaceId}/syncStates/{stateKey}` and `/workspaces/{workspaceId}/members/{memberUid}` strictly requires an active membership document in `/workspaces/{workspaceId}/members/{uid}` (with `status == 'active'`) or verified bootstrapped Super Admin (`saidprince712@gmail.com`). Revoking a member's `status` to `'revoked'` immediately terminates subcollection read/write access.
3. **No JSON Strings & Bounded Native Payloads**: Synchronized ERP state slices use native Firestore Maps (`payload: { v: ... }`) rather than `JSON.stringify` blobs, bounded arrays (`memberUids` size `1..50`), strict string length caps (`<= 128` for IDs, `<= 140` for names, `<= 254` for emails), and client-side volumetric guards (`< 850KB`).
4. **PII Split Isolation**: User emails and device preferences live strictly inside `/users/{userId}/private/{profileDocId}` readable ONLY by `request.auth.uid == userId` or verified admins; `/users/{userId}/public/{infoDocId}` contains zero PII.
5. **Temporal & Ownership Immutability**: `createdAt` must equal `request.time` on creation and never change; `updatedAt` must equal `request.time` on every creation and update; `ownerUid`, `workspaceId`, and `key`/`id` are immutable after creation.
6. **Atomic Invite Redemption**: Accepting a workspace invite MUST atomically update `/invites/{inviteId}` to `status == 'accepted'`, create `/members/{uid}`, and append `uid` to `/workspaces/{workspaceId}.memberUids` in a single `writeBatch`, verified via `existsAfter`/`getAfter`.
7. **Terminal State Locking**: Once a Workspace reaches `status == 'archived'`, a Member reaches `status == 'revoked'`, or an Invite reaches `'accepted'`/`'revoked'`, non-admin clients cannot mutate or reopen it.
8. **Zero-Get List Queries**: Every `allow list` rule evaluates `resource.data` directly (`ownerUid == request.auth.uid || request.auth.uid in resource.data.memberUids` or bootstrapped admin email) without `get()`/`exists()` O(n) read amplification.

---

## 2. The "Dirty Dozen" Adversarial Payloads

| # | Attack Vector | Target Path | Adversarial Payload / Action | Expected Result |
|---|---------------|-------------|------------------------------|-----------------|
| 1 | **Identity Spoofing (Fake Owner)** | `/workspaces/ws-1` (`create`) | `{ id: "ws-1", name: "Fake", ownerUid: "victim_uid", memberUids: ["attacker_uid"], status: "active", createdAt: SERVER_TIME, updatedAt: SERVER_TIME }` | `PERMISSION_DENIED` |
| 2 | **Unverified Email Bypass** | `/workspaces/ws-1/syncStates/smartschool_schools` (`create`) | Valid payload signed in with `email_verified: false` (even with email `saidprince712@gmail.com`) | `PERMISSION_DENIED` |
| 3 | **Shadow / Ghost Field Injection** | `/workspaces/ws-1/syncStates/smartschool_schools` (`create`) | Valid payload plus extra `"isAdminOverride": true` ghost key | `PERMISSION_DENIED` |
| 4 | **Update-Gap Shadow Key Injection** | `/workspaces/ws-1/syncStates/smartschool_schools` (`update`) | Update `payload` + silently mutate `ownerUid` or inject `"ghost": 1` | `PERMISSION_DENIED` |
| 5 | **Self-Assigned Admin Escalation** | `/admins/attacker_uid` (`create`) | `{ uid: "attacker_uid", email: "attacker@gmail.com", role: "super_admin", grantedByUid: "attacker_uid", createdAt: SERVER_TIME, updatedAt: SERVER_TIME }` | `PERMISSION_DENIED` |
| 6 | **Self-Assigned Workspace Member Escalation** | `/workspaces/ws-1/members/attacker_uid` (`create`) | Creating member doc with `role: "owner"` without valid pending invite `getAfter` proof | `PERMISSION_DENIED` |
| 7 | **Terminal State Reopening** | `/workspaces/ws-1/invites/inv-1` (`update`) | Non-admin tries updating an already `'accepted'` invite back to `'pending'` | `PERMISSION_DENIED` |
| 8 | **Resource / ID Poisoning** | `/workspaces/bad$id..150chars...` (`create`) | Document ID containing invalid characters or length > 128 (`"bad/id!"` or `'a'.repeat(200)`) | `PERMISSION_DENIED` |
| 9 | **Client Timestamp Forgery** | `/workspaces/ws-1` (`create`) | Payload with `createdAt: Timestamp(1999-01-01)` instead of `request.time` | `PERMISSION_DENIED` |
| 10 | **PII Cross-Tenant Read Leak** | `/users/victim_uid/private/profile` (`get`) | Authenticated verified non-owner non-admin attempts `get()` on victim's private PII | `PERMISSION_DENIED` |
| 11 | **Blanket Collection Scraping** | `/workspaces/ws-1/syncStates` (`list`) | Non-member runs unfiltered `getDocs(collection(db, "workspaces/ws-1/syncStates"))` | `PERMISSION_DENIED` |
| 12 | **Value Poisoning on Update** | `/workspaces/ws-1/syncStates/smartschool_schools` (`update`) | Update `payload` with a string `"not-a-map"` or non-number `clientUpdatedAt: "9999"` | `PERMISSION_DENIED` |
