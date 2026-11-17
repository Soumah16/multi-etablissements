/**
 * Phase 0: Security Rules Adversarial Test Specification ("Dirty Dozen")
 *
 * Run against Firebase Local Emulator Suite when @firebase/rules-unit-testing is installed:
 *   firebase emulators:exec --only firestore "npx tsx firestore.rules.test.ts"
 */

export interface DirtyDozenCase {
  id: number;
  name: string;
  targetPath: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  authContext: {
    uid: string | null;
    email?: string;
    email_verified?: boolean;
  };
  payload?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_TEST_CASES: DirtyDozenCase[] = [
  {
    id: 1,
    name: 'Identity Spoofing: setting ownerUid to another user on create',
    targetPath: 'workspaces/ws-spoof',
    operation: 'create',
    authContext: { uid: 'attacker_uid', email: 'attacker@example.com', email_verified: true },
    payload: {
      id: 'ws-spoof',
      name: 'Spoofed School',
      ownerUid: 'victim_uid',
      memberUids: ['attacker_uid'],
      status: 'active',
      createdAt: 'REQUEST_TIME',
      updatedAt: 'REQUEST_TIME',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Email Spoofing: admin email with email_verified = false',
    targetPath: 'workspaces/smartschool-guinee-main/syncStates/smartschool_schools',
    operation: 'create',
    authContext: { uid: 'spoof_uid', email: 'saidprince712@gmail.com', email_verified: false },
    payload: {
      key: 'smartschool_schools',
      workspaceId: 'smartschool-guinee-main',
      ownerUid: 'spoof_uid',
      updatedByUid: 'spoof_uid',
      memberUids: ['spoof_uid'],
      payload: { v: [] },
      clientUpdatedAt: 1700000000000,
      createdAt: 'REQUEST_TIME',
      updatedAt: 'REQUEST_TIME',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Shadow Field Injection on create',
    targetPath: 'workspaces/ws-1/syncStates/smartschool_schools',
    operation: 'create',
    authContext: { uid: 'owner_uid', email: 'owner@example.com', email_verified: true },
    payload: {
      key: 'smartschool_schools',
      workspaceId: 'ws-1',
      ownerUid: 'owner_uid',
      updatedByUid: 'owner_uid',
      memberUids: ['owner_uid'],
      payload: { v: [] },
      clientUpdatedAt: 1700000000000,
      isAdminOverride: true,
      createdAt: 'REQUEST_TIME',
      updatedAt: 'REQUEST_TIME',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Update-Gap Shadow Key / Immutable ownerUid Mutation',
    targetPath: 'workspaces/ws-1/syncStates/smartschool_schools',
    operation: 'update',
    authContext: { uid: 'editor_uid', email: 'editor@example.com', email_verified: true },
    payload: {
      ownerUid: 'editor_uid',
      payload: { v: [{ name: 'Hijacked' }] },
      clientUpdatedAt: 1700000000001,
      updatedByUid: 'editor_uid',
      updatedAt: 'REQUEST_TIME',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Privilege Escalation: non-bootstrapped user creating /admins/{uid}',
    targetPath: 'admins/attacker_uid',
    operation: 'create',
    authContext: { uid: 'attacker_uid', email: 'attacker@example.com', email_verified: true },
    payload: {
      uid: 'attacker_uid',
      email: 'attacker@example.com',
      role: 'super_admin',
      grantedByUid: 'attacker_uid',
      createdAt: 'REQUEST_TIME',
      updatedAt: 'REQUEST_TIME',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Orphaned / Unauthorized Self-Membership Creation without valid invite',
    targetPath: 'workspaces/ws-1/members/attacker_uid',
    operation: 'create',
    authContext: { uid: 'attacker_uid', email: 'attacker@example.com', email_verified: true },
    payload: {
      uid: 'attacker_uid',
      workspaceId: 'ws-1',
      ownerUid: 'owner_uid',
      displayName: 'Intruder',
      role: 'owner',
      status: 'active',
      inviteCode: 'FAKE-CODE',
      createdAt: 'REQUEST_TIME',
      updatedAt: 'REQUEST_TIME',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Terminal State Reopening: resetting accepted invite back to pending',
    targetPath: 'workspaces/ws-1/invites/inv-100',
    operation: 'update',
    authContext: { uid: 'member_uid', email: 'member@example.com', email_verified: true },
    payload: {
      status: 'pending',
      acceptedByUid: '',
      updatedAt: 'REQUEST_TIME',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'ID Poisoning: oversized / invalid-charset document ID',
    targetPath: `workspaces/${'X'.repeat(180)}`,
    operation: 'create',
    authContext: { uid: 'attacker_uid', email: 'attacker@example.com', email_verified: true },
    payload: {
      id: 'X'.repeat(180),
      name: 'Poison',
      ownerUid: 'attacker_uid',
      memberUids: ['attacker_uid'],
      status: 'active',
      createdAt: 'REQUEST_TIME',
      updatedAt: 'REQUEST_TIME',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Temporal Forgery: setting backdated createdAt timestamp',
    targetPath: 'workspaces/ws-time',
    operation: 'create',
    authContext: { uid: 'attacker_uid', email: 'attacker@example.com', email_verified: true },
    payload: {
      id: 'ws-time',
      name: 'Backdated',
      ownerUid: 'attacker_uid',
      memberUids: ['attacker_uid'],
      status: 'active',
      createdAt: '1999-01-01T00:00:00.000Z',
      updatedAt: 'REQUEST_TIME',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'PII Leak: reading another user private profile',
    targetPath: 'users/victim_uid/private/profile',
    operation: 'get',
    authContext: { uid: 'attacker_uid', email: 'attacker@example.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Query Trust Leak: unfiltered list query by non-member',
    targetPath: 'workspaces/ws-1/syncStates',
    operation: 'list',
    authContext: { uid: 'outsider_uid', email: 'outsider@example.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Value Poisoning: replacing native Map payload with JSON string on update',
    targetPath: 'workspaces/ws-1/syncStates/smartschool_schools',
    operation: 'update',
    authContext: { uid: 'owner_uid', email: 'owner@example.com', email_verified: true },
    payload: {
      payload: '{"v":"poison-json-string"}',
      clientUpdatedAt: 'not-a-number',
      updatedByUid: 'owner_uid',
      updatedAt: 'REQUEST_TIME',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
];

export async function assertDirtyDozenSpec(): Promise<void> {
  if (DIRTY_DOZEN_TEST_CASES.length !== 12) {
    throw new Error('Dirty Dozen suite must contain exactly 12 adversarial payloads.');
  }
  for (const tc of DIRTY_DOZEN_TEST_CASES) {
    if (tc.expectedResult !== 'PERMISSION_DENIED') {
      throw new Error(`Invalid expectation on case ${tc.id}`);
    }
  }
}
