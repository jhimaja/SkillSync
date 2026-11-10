# SkillSync – Skill Assessment and Career Readiness Platform

SkillSync is a MERN stack (MongoDB, Express.js, React.js, Node.js) web
application that helps students become **job-ready**, not just informed.

> Most existing platforms tell students what skills they need. SkillSync goes
> one step further: it **identifies the skill gap**, **creates a personalised
> learning roadmap**, and **verifies the student's skills through practical
> challenges**. So instead of just recommending skills, SkillSync helps the
> student actually become job-ready.

## What makes SkillSync different

| Step | What happens | Where in the code |
|---|---|---|
| 1. Find the gap | Pick a target role; every required skill is marked **verified / claimed / missing** and a Job Readiness score is calculated | `backend/utils/matchSkills.js` |
| 2. Personal roadmap | Missing skills are ordered by prerequisites, with study hours, free resources, a practice project, and an estimated finish date based on the student's weekly hours | `backend/utils/roadmap.js`, `backend/data/skillCatalog.js` |
| 3. Verify with challenges | 43 skills have 3 practical questions each; JavaScript also has coding tasks graded on the server against hidden tests. Passing marks the skill **verified** | `backend/data/challengeBank.js`, `backend/utils/codeRunner.js`, `backend/controllers/challengeController.js` |
| 4. Skill Passport | A shareable page listing only proven skills, with a privacy switch | `backend/controllers/passportController.js`, `frontend/src/pages/Passport.jsx` |

**Why the score is honest:** a skill the student only *claims* is worth 40%,
a skill they *proved* is worth 100%, and a missing skill is worth 0%. A roadmap
step turns green only when the challenge is passed, never by ticking a box.

> No AI is used anywhere in this project. Career matching, readiness scoring,
> roadmap ordering and challenge grading are all done using
> plain JavaScript logic that compares the user's skills against a
> predefined list of required skills for each role (see
> `backend/utils/matchSkills.js`).

## Folder Structure

```
skillsync/
├── backend/            Express + MongoDB REST API
│   ├── config/         Database connection
│   ├── controllers/    Business logic for each feature
│   ├── data/           Skill catalog (roadmap info) + challenge bank (questions)
│   ├── middleware/     JWT auth guard + Multer file upload
│   ├── models/         Mongoose schemas (User, CareerRole)
│   ├── routes/         API endpoint definitions
│   ├── seed/           Script to load starter career-role data
│   ├── utils/          Skill-matching logic
│   └── server.js       App entry point
│
├── frontend/           React (Vite) client
│   └── src/
│       ├── api/        Central Axios instance
│       ├── components/ Navbar, ProtectedRoute
│       ├── context/    Global auth state (AuthContext)
│       ├── pages/      Home, Login, Register, Dashboard, Profile,
│       │               Skills, Resume, Careers, Roadmap, Challenge, Passport
│       └── styles/     Global CSS
│
└── PROJECT_EXPLANATION.md   Full walkthrough + beginner Q&A
```

## How to Run This Project

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# open .env and paste your own MongoDB Atlas connection string
npm run seed     # loads 12 predefined career roles into the database
npm run dev      # starts the server on http://localhost:5000
```

### 2. Frontend Setup

Open a **second terminal**:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev      # starts React on http://localhost:5173
```

Then open **http://localhost:5173** in your browser.

## Getting a Free MongoDB Atlas Connection String

1. Go to https://www.mongodb.com/cloud/atlas and create a free account.
2. Create a free "M0" cluster.
3. Under **Database Access**, create a database user with a username/password.
4. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`) for development.
5. Click **Connect → Drivers**, copy the connection string, and paste it into
   `backend/.env` as `MONGO_URI` (replace `<username>` and `<password>`).

## Core Features

| Feature | Description |
|---|---|
| Authentication | Register/Login using JWT tokens; passwords hashed with bcrypt |
| Profile | Update name, college, branch, graduation year, bio |
| Skills | Add/remove technical skills from your profile |
| Resume | Upload/replace/download a resume file (PDF or Word, stored via Multer) |
| Career Matching | Compare your skills against 12 predefined career roles using JS logic; ranked by Job Readiness |
| **Learning Roadmap** | Ordered plan for the chosen role with hours, resources, projects and a finish date |
| **Skill Verification** | Practical questions and server-graded coding tasks that mark skills as verified |
| **Skill Passport** | Shareable page of verified skills (public only if the student turns it on) |
| Dashboard | Job readiness, verified skills, next step and top career matches |

## New API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/roadmap` | Roadmap for the student's target role |
| PUT | `/api/roadmap/target` | Set target role and weekly study hours |
| GET | `/api/challenges` | Skills that have a challenge + verified status |
| GET | `/api/challenges/:skill` | Questions for a skill (answers are NOT sent) |
| POST | `/api/challenges/:skill/submit` | Grade an attempt and verify the skill |
| GET | `/api/passport/:userId` | Skill Passport (public only if shared) |
| PUT | `/api/passport/visibility` | Turn Passport sharing on or off |

## Adding more skills or questions

* New skill for roadmaps: add an entry in `backend/data/skillCatalog.js`.
* New questions: add `q(...)` lines in `backend/data/challengeBank.js`.
* New coding task: add an object to `codeChallenges` in the same file.

## Important note about coding challenges

Coding challenges run student code on the server using Node's `vm` module with
a timeout. That is fine for a project demo, but `vm` is not a perfect sandbox.
Before deploying publicly, either run the code in an isolated container or set
`ENABLE_CODE_CHALLENGES=false` in `backend/.env` (the quiz part keeps working).

Learning-resource links in `skillCatalog.js` point to official docs and free
courses; check them occasionally because websites move their pages.

## Full Explanation & Beginner Questions

See **PROJECT_EXPLANATION.md** for a from-scratch explanation of every part
of this project, how data flows from the database to the screen, and a set
of practice questions (with answers) for someone learning MERN for the
first time.
