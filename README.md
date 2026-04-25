# VYOM VOID — Premium Dark Aesthetic Streetwear

> "Where the sky meets nothingness." — Sanskrit-inspired Gen Z streetwear from India.

## Stack

- **Backend**: Node.js + Express.js
- **Frontend**: Vanilla HTML/CSS/JS
- **Payments**: Razorpay
- **AI Design**: Pollinations + HuggingFace
- **Database**: JSON (current) → SQLite via Prisma (migration ready)

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your actual keys

# 3. Start development server
npm run dev

# 4. Open store
# http://localhost:3000
# http://localhost:3000/admin
# http://localhost:3000/admin/inventory
```

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 3000) |
| `RAZORPAY_KEY_ID` | Razorpay public key |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key |
| `EMAIL_ADMIN` | Admin email for order notifications |
| `EMAIL_SENDER` | Gmail sender address |
| `EMAIL_PASSWORD` | Gmail App Password |
| `DATABASE_URL` | SQLite DB path for Prisma |
| `HUGGINGFACE_API_KEY` | HuggingFace API key (optional) |
| `GEMINI_API_KEY` | Google Gemini API key (optional) |

## Pages

| URL | Description |
|---|---|
| `/` | Main storefront |
| `/admin` | Admin dashboard |
| `/admin/inventory` | Inventory management |
| `/health` | Server health check |

## Collections

| Name | Meaning | Theme |
|---|---|---|
| SHUNYA | The Void | Purple |
| NAKSHATRA | Star/Constellation | Cyan |
| KAAL | Time/Death | Red |
| PRALAY | Apocalypse | Orange |
| MAYA | Illusion | Purple |
| SRISHTI | Creation | Pink |
| NIRVANA | Liberation | Cyan |
| AATMA | Soul | Light |

## Email Notifications

Uses Gmail App Passwords. Setup:
1. Go to [Google Account → Security → App Passwords](https://myaccount.google.com/apppasswords)
2. Generate a password for "Mail"
3. Add to `.env` as `EMAIL_PASSWORD`
