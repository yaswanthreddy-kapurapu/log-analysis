# Deployment Guidance — Portable Log Analysis (Air-Gapped)

This document summarizes deployment options, secure update procedures, and operational guidance for air-gapped environments.

## 1) USB-Bootable Image (Recommended for field or isolated installs)
- Create a minimal OS image with the application pre-installed (e.g., Ubuntu Server minimal + app binary). Use disk encryption and secure boot where applicable.
- Sign the image manifest and include a checksum file (SHA-256) and a detached signature (GPG or other organization-approved signing mechanism).
- Delivery: physically transfer the image via controlled media. Validate checksums and signatures before deployment.

## 2) Local Server Deployment
- Install the single binary or package onto an isolated machine (local file copy). Ensure strict host hardening and disable outbound network interfaces where required.
- Use local user accounts and optionally integrate hardware-backed keys (YubiKey/HSM) to sign export bundles and rule set updates.

## 3) Containerized Deployments (If allowed)
- Build a container image using a reproducible build environment. Store images in an offline registry or export and transfer `.tar` files.
- Verify image signatures locally prior to loading into the isolated runtime.

## 4) Update & Rule Distribution
- Use signed update bundles: rule updates, parser packages, and binary updates delivered as signed artifacts.
- Maintain an update manifest that includes artifact hashes and a signature chain for replay-resistant verification.

## 5) Key Management & Signing
- Use offline key storage for signing (HSM preferred). Keep signing keys separate from deployed runtimes; use ephemeral signing machines if necessary.
- Keep export verification tools and signature verification steps documented and audited.

## 6) Export & Transfer Procedures
- Exports should include: signed reports, audit logs, and optional sanitized datasets.
- Apply organizational transfer policies: encryption at rest, access control lists, and transport chain-of-custody documentation.

## 7) Operational Hardening
- Apply host-level hardening: firewall rules, minimal services, regular local audits.
- Keep an append-only audit trail to detect tampering and to maintain forensic provenance.

---

For bespoke deployment scripts or to generate a sample USB image, provide target OS and hardware constraints and I can prepare an example build script.
