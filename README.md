CRM Project — Start Instructions

Prerequisites
- Python 3.10+ installed
- Node.js 18+ and npm/yarn/pnpm installed (for the Next.js frontend)
- MySQL server running and accessible (credentials in `back/.env`)

Backend (Django)

1. Create and activate a virtual environment (from the `back` directory):

```bash
cd back
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
# source venv/bin/activate
```

2. Install Python dependencies:

```bash
pip install -r requirements.txt
```

3. Ensure database credentials are set in `back/.env` (DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME).

4. Apply migrations and run the development server:

```bash
python manage.py migrate
python manage.py runserver
```

Frontend (Next.js)

1. Install Node dependencies and run the dev server (from project root):

```bash
cd front
npm install
npm run dev
```

2. Open the app in your browser at the address printed by Next.js (usually `http://localhost:3000`).