# Portable Log Analysis — Air-Gapped Networks (Prototype)

This repository contains a prototype/marketing website for a Portable Log Analysis tool designed for air-gapped networks.

## Preview

1. Open `index.html` in your browser. For full feature parity, run a local file server (recommended):
   - Python 3: `python -m http.server 8000`
   - Then visit `http://localhost:8000/`

2. The site is static and requires no backend to preview, but a lightweight Go backend is provided in `/server` for prototype functionality (query endpoint, downloads, and manifest verification).

### Run the demo backend

1. Install Go (1.20+), then in the `server` folder run:
   - `go build -o pla-server .`
   - `./pla-server`
2. The server listens on port 8080. Example requests:
   - `GET http://localhost:8080/api/v1/status`
   - `POST http://localhost:8080/api/v1/query` with body `{ "query": "severity:high AND service:auth" }` and header `Authorization: Token demo-token`
   - `GET http://localhost:8080/api/v1/manifest/reference-build-1.0.0`
   - `GET http://localhost:8080/api/v1/manifest/verify/reference-build-1.0.0` (requires `keys/public.pem`)

3. To create signing keys and perform offline signing (run on a secure, offline machine):
   - `chmod +x scripts/*.sh`
   - `./scripts/generate_keys.sh` (creates `keys/private.pem` and `keys/public.pem` — run on an offline machine)
   - Build the release packer and use it to create a release and optionally sign it with your private key:
     - `go build -o bin/pack_release tools/pack_release.go`
     - `./bin/pack_release --source releases/source --out assets/releases/reference-build-1.0.0.tar.gz --version 1.0.0 --sign keys/private.pem`
   - Or use the wrapper: `./scripts/generate_release.sh --version 1.0.0 --sign keys/private.pem`
   - Verify with: `go run tools/verify_release.go --file assets/releases/reference-build-1.0.0.tar.gz --sig assets/releases/reference-build-1.0.0.sig --key keys/public.pem`

### Users & local auth
- Add a local user with: `go run scripts/add_user.go admin 'your-password'` — this updates `server/config/users.json` with a bcrypt hash.

### Running the server as a service (example)
- Build the server: `cd server && go build -o pla-server .`
- Copy `server/pla.service` to `/etc/systemd/system/pla.service` and adjust `ExecStart` and `WorkingDirectory` to your install path. The service will log to `/var/log/pla/pla.log` and should be owned by root or a dedicated service account.
- Enable and start: `systemctl daemon-reload && systemctl enable pla && systemctl start pla`.

### Log rotation and permissions
- Copy `scripts/logrotate/pla.conf` to `/etc/logrotate.d/pla` to rotate logs weekly with compression.
- Run `scripts/setup_permissions.sh` on the target host during installation to set safe permissions on directories and keys.
- Create a dedicated service user and set ownership for installation directories: `sudo bash scripts/setup_service_user.sh`. Adjust paths and UIDs as required by your environment.

### Building a USB image & CI
- Use `scripts/packer/ubuntu-22.04-pla.pkr.hcl` as a starting point to create a repeatable ISO with packer.
- A sample GitHub Actions workflow is available at `.github/workflows/packer-ci.yml`, but building images requires a self-hosted runner with virtualization (QEMU/KVM) and Packer installed.
- Test a built ISO with `scripts/test_iso.sh <iso-file>` (run on a host with sudo privileges to mount the iso).

## Files
- `index.html` — Main single-page site with architecture diagrams and technical content.
- `styles.css` — Enterprise-grade minimal theme.
- `scripts.js` — Minimal interactivity (nav toggle, download placeholder).

## Next steps for a production-ready site
- Replace placeholder/download actions with signed package endpoints (applied via local delivery in isolated environments).
- Add higher-fidelity SVG diagrams / PNG exports for documentation packages.
- Enhance accessibility: ARIA roles for complex components and keyboard interactions.
- Add sample signed export bundle and verification tooling (for demonstration).

## Deployment suggestions for isolated networks
- USB-bootable image with signed distribution and hashed metadata.
- Local server deployment with pre-seeded rule bundles and signed updates.
- Container image for environments allowing container runtimes (pull images externally and transfer via air-gapped media).

## Security & Compliance Notes
- Do not enable outbound networking in air-gapped deployments.
- Use hardware-backed keys or HSM when available to sign export bundles.
- Maintain strict key management policies and offline key stores.

---

For more detailed documentation or to request custom assets (diagrams or design variations), provide requirements and I will update the site content accordingly.
