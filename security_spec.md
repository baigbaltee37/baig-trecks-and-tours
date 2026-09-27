# Security Specification — Baig Trecks & Tours (`security_spec.md`)

## 1. Data Invariants
1. **Default-Deny Catch-All**: No document in any collection may be read or written unless explicitly permitted by a hardened collection match block.
2. **PII Isolation (Split Collection)**: User sensitive PII (`email`, `phone`, `status`) is strictly isolated in `/users/{userId}/private/{docId}` and can only be read or written by the verified owner (`request.auth.uid == userId`) or a verified administrator (`isAdmin()`).
3. **Self-Assigned Role Prevention**: Customers creating their profile at `/users/{userId}` can ONLY set `role == 'customer'` unless they are the bootstrapped verified admin (`baigbaltee37@gmail.com` with `email_verified == true`). Customers can never escalate `role` to `'admin'` during profile updates.
4. **Strict Temporal Integrity**: Every `create` operation must set `createdAt == request.time` (and `updatedAt == request.time` where present). Every `update` operation must preserve `createdAt == resource.data.createdAt` and set `updatedAt == request.time`.
5. **Query Enforcer on List Operations**: `allow list` on `/inquiries` and `/bookings` strictly enforces `resource.data.userId == request.auth.uid || isAdmin()` so no client can scrape other customers' inquiries or bookings.
6. **Terminal State Locking**: Once an `Inquiry` reaches `status == 'archived'` or a `Booking` reaches `bookingStatus == 'completed'` or `'cancelled'`, non-admin users cannot mutate the document.
7. **Admin-Only CMS Collections**: Only verified administrators (`isAdmin()`) can create, update, or delete documents in `/tours`, `/destinations`, `/reviews`, `/blogPosts`, `/gallery`, and `/settings`.

## 2. The "Dirty Dozen" Payloads
1. **Shadow Field Injection on UserProfile Create**: Adding `"isSuperAdmin": true` to `/users/{userId}` — rejected by `.keys().hasOnly(...)`.
2. **Privilege Escalation on UserProfile Create**: A standard user setting `"role": "admin"` on `/users/{userId}` — rejected by role gate.
3. **Unverified Admin Email Spoof**: User with `email == "baigbaltee37@gmail.com"` but `email_verified == false` attempting to create a tour — rejected by `request.auth.token.email_verified == true`.
4. **Cross-User PII Read**: Authenticated user `userA` attempting `get` on `/users/userB/private/info` — rejected by `isOwner(userId) || isAdmin()`.
5. **ID Poisoning Attack**: Creating a document with a 300-character or special-character ID — rejected by `isValidId(id)`.
6. **Unbounded Array Exhaustion**: Updating `savedTourIds` with 50 items — rejected by `data.savedTourIds.size() <= 20`.
7. **Timestamp Forgery on Create**: Supplying a past or future client timestamp for `createdAt` instead of `request.time` — rejected by `incoming().createdAt == request.time`.
8. **Immutable Field Mutation**: Attempting to mutate `uid` or `createdAt` during an `update` on `/users/{userId}` — rejected by `incoming().uid == existing().uid && incoming().createdAt == existing().createdAt`.
9. **Inquiry Scraping via Unfiltered List Query**: Authenticated user running `getDocs(collection(db, 'inquiries'))` without `.where('userId', '==', uid)` — rejected by `resource.data.userId == request.auth.uid`.
10. **Customer Self-Confirming Booking Payment**: Customer attempting to update `paymentStatus` to `'confirmed_by_admin'` on `/bookings/{bookingId}` — rejected by tiered update action allowlist.
11. **Terminal State Bypass on Booking**: Customer attempting to update a booking whose `bookingStatus` is already `'completed'` — rejected by terminal state lock.
12. **Unauthorized CMS Mutation**: Non-admin authenticated user attempting to modify `/settings/main` or `/tours/hunza-tour` — rejected by `isAdmin()`.
