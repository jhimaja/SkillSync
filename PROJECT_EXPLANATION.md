# SkillSync — Full Project Explanation (From Scratch)

This document explains **everything** about the SkillSync project in plain
language, from "what is the MERN stack" all the way to "how does one button
click travel through the whole application." It ends with a set of
**beginner practice questions with answers** you can use to test your own
understanding before a viva, interview, or project presentation.

---

## 1. What is SkillSync?

SkillSync is a web application for students. It lets a student:

1. **Register/Login** to a personal account.
2. **Maintain a profile** (name, college, branch, graduation year, bio).
3. **Add technical skills** they know (e.g., "React", "Python", "SQL").
4. **Upload a resume** file (PDF/Word) that is stored on the server.
5. **See a ranked list of career roles** (like "Frontend Developer" or
   "Data Analyst") based on how many of the required skills for that role
   the student already has.

The matching is done with **plain JavaScript comparison logic**, not AI.
The backend simply loops through a list of required skills for a role and
checks which ones exist in the student's skill list. This is fully
explainable and easy to demonstrate: *"6 out of 8 required skills matched
= 75% match."*

---

## 2. What is the MERN Stack?

MERN is an acronym for four technologies that work together to build a
full web application:

| Letter | Technology | Role |
|---|---|---|
| **M** | MongoDB | The database — stores all data (users, career roles) as JSON-like documents |
| **E** | Express.js | A framework that runs on Node.js and defines the backend's API routes |
| **R** | React.js | The frontend library used to build the user interface (what the student sees and clicks) |
| **N** | Node.js | The JavaScript runtime that lets us run JavaScript on the server (outside the browser) |

**Why MERN?** Because every layer of the application — frontend, backend,
and database logic — is written in **JavaScript**. A developer doesn't need
to learn a different language for the frontend (like Java or PHP) versus
the backend. This makes it one of the most beginner-friendly full-stack
combinations.

### How the four pieces connect

```
 ┌─────────────┐        HTTP requests        ┌──────────────┐        Mongoose        ┌─────────────┐
 │   React.js   │  ───────(via Axios)───────▶ │  Express.js  │  ───────queries───────▶ │  MongoDB    │
 │  (Frontend)  │ ◀────── JSON responses ──── │  + Node.js   │ ◀────── documents ───── │  Atlas      │
 └─────────────┘                              │  (Backend)   │                         │ (Database)  │
                                               └──────────────┘
```

- The **browser** runs the React app.
- React uses **Axios** to send HTTP requests (GET, POST, PUT, DELETE) to the
  Express server.
- Express receives the request, decides what to do (this logic lives in
  **controllers**), and uses **Mongoose** to read/write data in MongoDB.
- Express sends a **JSON response** back to React, which updates the screen.

---

## 3. Full Technology List and Why Each One Is Used

| Technology | Category | Why it's used in SkillSync |
|---|---|---|
| MongoDB Atlas | Database | Cloud-hosted NoSQL database. Stores users and career roles as flexible JSON-like "documents" instead of rigid SQL tables. |
| Mongoose | Backend | An "ODM" (Object Data Modeling) library. Lets us define a `Schema` (the shape of our data) and interact with MongoDB using simple JavaScript methods like `User.findById()` instead of writing raw database queries. |
| Express.js | Backend | A lightweight framework on top of Node.js that makes it easy to define API routes (`/api/auth/login`, `/api/skills`, etc.) and handle requests/responses. |
| Node.js | Backend | The engine that actually runs our JavaScript backend code outside of a web browser. |
| React.js | Frontend | A component-based library for building the user interface. Each page (Login, Dashboard, Skills...) is a separate, reusable "component." |
| Vite | Frontend tooling | A fast development server and build tool for React. It instantly reflects code changes in the browser during development (this is called "Hot Module Replacement"). |
| React Router DOM | Frontend | Lets us have multiple "pages" (like `/login`, `/dashboard`, `/skills`) inside a single-page React app, without the browser reloading the whole site each time. |
| Axios | Frontend | A library used to send HTTP requests from React to our Express backend, and receive responses. |
| JWT (JSON Web Token) | Security | After login, the server generates a signed token that proves "this request really comes from a logged-in user." The frontend stores this token and attaches it to every request that needs authentication. |
| bcrypt (bcryptjs) | Security | Converts (hashes) passwords into unreadable text before storing them in the database, so even if the database were leaked, the real passwords stay safe. |
| dotenv | Configuration | Loads secret values (database URL, JWT secret key) from a `.env` file into `process.env`, keeping secrets out of the source code. |
| Multer | Backend | Handles file uploads (resumes) sent from the browser and saves them to the server's file system. |
| Postman | Development tool | Used **during development** to manually test backend API routes (like `/api/auth/login`) before the frontend is connected. |
| Git/GitHub | Version control | Tracks every change made to the code and allows the project to be pushed to GitHub for backup, collaboration, or deployment. |

---

## 4. Backend — Folder by Folder

The backend lives inside the `backend/` folder. Here's what each folder does:

### `server.js`
The starting point of the whole backend. It:
1. Loads environment variables (`.env`).
2. Connects to MongoDB.
3. Sets up middleware (CORS, JSON parsing).
4. Registers all the routes (`/api/auth`, `/api/profile`, etc.).
5. Starts listening for requests on a port (default `5000`).

### `config/db.js`
Contains the `connectDB()` function that uses Mongoose to connect to the
MongoDB Atlas cluster using the connection string from `.env`.

### `models/`
Defines the **shape** of our data using Mongoose Schemas.
- `User.js` — name, email, hashed password, college, branch, bio, skills
  array, and resume file info.
- `CareerRole.js` — title, description, category, list of required skills,
  and average salary.

### `middleware/`
Functions that run **before** the main route logic.
- `authMiddleware.js` — checks that a valid JWT token was sent; if not,
  blocks the request with a `401 Unauthorized` response.
- `uploadMiddleware.js` — configures Multer: where to save uploaded resume
  files, what to name them, and which file types are allowed.

### `controllers/`
The actual **business logic** for each feature — what happens when a
particular route is called.
- `authController.js` — register and login logic (hashing passwords,
  creating JWT tokens).
- `profileController.js` — get/update profile details.
- `skillController.js` — add/remove/list skills.
- `resumeController.js` — upload/download resume files.
- `careerController.js` — list career roles and calculate skill matches.

### `routes/`
Maps a URL + HTTP method (e.g., `POST /api/auth/login`) to the controller
function that should handle it.

### `utils/matchSkills.js`
The heart of the "career matching" feature. Contains plain JavaScript
functions that compare two arrays of skills and calculate a match
percentage — no AI or machine learning involved.

### `seed/seedCareerRoles.js`
A script you run once (`npm run seed`) that fills the database with 12
starter career roles (Frontend Developer, Data Analyst, DevOps Engineer,
etc.) so the app has real data to match against.

---

## 5. Frontend — Folder by Folder

The frontend lives inside the `frontend/` folder, built with React + Vite.

### `src/main.jsx`
The entry point. Wraps the whole app in `BrowserRouter` (for page
navigation) and `AuthProvider` (for shared login state), then renders
`<App />` into the page.

### `src/App.jsx`
Defines all the **routes** (URLs) of the app using React Router DOM, e.g.
`/`, `/login`, `/dashboard`, `/skills`. Protected routes are wrapped in
`<ProtectedRoute>` so only logged-in users can see them.

### `src/api/axios.js`
A single, shared Axios instance. Every API call in the app goes through
this file, which automatically attaches the JWT token to every request
using an **interceptor**.

### `src/context/AuthContext.jsx`
Uses React's **Context API** to store "is the user logged in, and who are
they" in one place, so any page/component can access it with
`useAuth()` instead of passing login data through props manually.

### `src/components/`
Reusable UI pieces used across multiple pages.
- `Navbar.jsx` — top navigation bar; shows different links depending on
  whether the user is logged in.
- `ProtectedRoute.jsx` — redirects to `/login` if there is no logged-in
  user.

### `src/pages/`
Each file here is a full "page" the user can visit:
`Home`, `Login`, `Register`, `Dashboard`, `Profile`, `Skills`, `Resume`,
`Careers`.

### `src/styles/index.css`
All CSS styling for the entire app — colors, spacing, buttons, cards,
responsive layout for mobile devices.

---

## 6. Step-by-Step: What Happens When a Student Logs In?

This is the best way to understand how the MERN stack pieces connect.

1. Student opens `/login` and types their email + password, then clicks
   **Login**.
2. React's `Login.jsx` calls `login(email, password)` from `AuthContext`.
3. `AuthContext` sends `POST /api/auth/login` using **Axios**, with the
   email/password in the request body.
4. The request reaches the Express backend. The route
   `routes/authRoutes.js` sends it to `authController.js`'s `loginUser`
   function.
5. `loginUser` uses **Mongoose** (`User.findOne({ email })`) to look up the
   user in **MongoDB Atlas**.
6. If found, **bcrypt** compares the entered password against the stored
   hashed password.
7. If correct, the backend creates a **JWT token** using the secret key
   from `.env`, and sends it back as a JSON response along with basic user
   info.
8. React receives the response, stores the token + user info in
   `localStorage`, and updates `AuthContext`'s state.
9. React Router redirects the student to `/dashboard`.
10. From now on, every request (like "get my skills") automatically
    includes the JWT token in its headers (thanks to the Axios
    interceptor), so the backend's `authMiddleware.js` can verify "yes,
    this is really that logged-in student" before responding.

---

## 7. Step-by-Step: How Career Matching Works

1. Student adds skills like `["HTML", "CSS", "JavaScript", "React"]` on the
   Skills page. Each addition sends a `POST /api/skills` request that
   pushes the new skill into the `skills` array on their User document in
   MongoDB.
2. Student visits the Careers page, which sends `GET /api/careers/match`.
3. `careerController.js`'s `getCareerMatches` function:
   - Fetches the logged-in student's `skills` array.
   - Fetches **all** career roles from MongoDB (each with its own
     `requiredSkills` array, e.g. Frontend Developer needs
     `["HTML","CSS","JavaScript","React","Git","Responsive Design"]`).
   - Calls `findBestCareerMatches()` from `utils/matchSkills.js`.
4. For each role, the utility function:
   - Counts how many of the role's `requiredSkills` also appear in the
     student's `skills` (case-insensitive comparison).
   - Calculates `matchPercentage = (matchedSkills / totalRequiredSkills) * 100`.
   - Also returns which skills are missing, so the student knows what to
     learn next.
5. All roles are sorted from **highest match % to lowest**, and sent back
   as JSON.
6. React's `Careers.jsx` renders each role as a card with a progress bar
   showing the match percentage, and an expandable section showing matched
   vs missing skills.

---

## 8. Security Concepts Used in This Project

- **Password Hashing (bcrypt):** Passwords are never stored as plain text.
  `bcrypt.hash()` turns `"mypassword123"` into a long scrambled string
  that cannot practically be reversed.
- **JWT Authentication:** Instead of the server "remembering" who is
  logged in (a session), the server gives the client a signed token. The
  client sends this token with every request, and the server just verifies
  its signature — this is called being "stateless," and it's why JWT
  scales well for modern web apps.
- **Protected Routes (Backend):** Middleware like `authMiddleware.js` runs
  before sensitive routes, rejecting any request without a valid token.
- **Protected Routes (Frontend):** `ProtectedRoute.jsx` prevents a logged
  out user from even seeing pages like `/dashboard`, redirecting them to
  `/login` instead.
- **File Type Validation (Multer):** The resume upload only accepts PDF or
  Word documents and rejects anything else (like `.exe` files), with a 5MB
  size limit.
- **Environment Variables (dotenv):** Secrets like the database connection
  string and JWT signing key are kept in a `.env` file that is **never**
  committed to GitHub (see `.gitignore`).

---

## 9. Beginner Practice Questions (With Answers)

Use these to prepare for a viva, interview, or project demo. Try answering
them yourself first before checking the answer.

### Basics

**Q1. What does MERN stand for?**
> MongoDB, Express.js, React.js, Node.js.

**Q2. Why is MERN considered beginner-friendly compared to other stacks?**
> Because the entire application — frontend, backend, and database
> interaction logic — is written in a single language: JavaScript.

**Q3. What is the difference between Node.js and Express.js?**
> Node.js is the runtime environment that lets JavaScript run outside a
> browser (e.g., on a server). Express.js is a framework built on top of
> Node.js that makes it much easier to create API routes and handle HTTP
> requests/responses.

**Q4. What is MongoDB, and how is it different from a traditional SQL database?**
> MongoDB is a NoSQL, document-based database. Instead of storing data in
> rigid rows/tables like MySQL, it stores data as flexible JSON-like
> documents (called BSON internally), which is a natural fit for
> JavaScript objects.

**Q5. What is Mongoose used for?**
> Mongoose is an ODM (Object Data Modeling) library that sits between our
> Node.js code and MongoDB. It lets us define Schemas (the expected shape
> of our data) and provides simple methods like `.find()`, `.create()`,
> `.findByIdAndUpdate()` instead of writing raw MongoDB queries.

### Authentication

**Q6. Why do we hash passwords instead of storing them as plain text?**
> If the database is ever leaked or accessed by an attacker, plain-text
> passwords would immediately expose every user's real password. A
> hashed password is a one-way scrambled version that cannot practically
> be reversed back to the original.

**Q7. What is a JWT and why do we use it?**
> JWT (JSON Web Token) is a signed piece of data the server gives to the
> client after a successful login. It proves the client's identity on
> every future request without the server needing to store session data,
> making the backend stateless and easy to scale.

**Q8. Where is the JWT token stored on the frontend, and how is it sent
back to the server?**
> It's stored in the browser's `localStorage`. On every API call, an
> Axios interceptor automatically attaches it to the request's
> `Authorization` header in the format `Bearer <token>`.

**Q9. What happens if someone tries to access `/api/profile` without a
valid token?**
> The `authMiddleware.js` function checks for the token before the
> request reaches the controller. If it's missing or invalid, it
> immediately responds with a `401 Unauthorized` error and the request
> never touches the database.

### Career Matching Logic

**Q10. Does SkillSync use AI to recommend careers?**
> No. It uses plain JavaScript array-comparison logic. Each career role
> in the database has a predefined list of required skills. The backend
> checks how many of those required skills the student already has and
> calculates a percentage — a fully deterministic, explainable
> calculation.

**Q11. How is the match percentage calculated?**
> `matchPercentage = (number of matched skills / total required skills for
> that role) * 100`, rounded to the nearest whole number.

**Q12. Why is the skill comparison case-insensitive (e.g., "react" matches
"React")?**
> Because students might type skill names with different capitalization.
> The matching function normalizes both sides to lowercase before
> comparing, so the comparison isn't affected by capitalization
> differences.

### Frontend Concepts

**Q13. What is React Router DOM used for in this project?**
> It allows the app to show different "pages" (Login, Dashboard, Skills,
> etc.) based on the browser's URL, without doing a full page reload —
> this is what makes it a Single Page Application (SPA).

**Q14. What is the purpose of the `AuthContext`?**
> It stores the currently logged-in user's data and login/logout
> functions in one central place using React's Context API, so any
> component in the app can access "is someone logged in?" without
> passing that data manually through every parent-child component chain.

**Q15. What is Axios, and why not just use the built-in `fetch()`
function?**
> Axios is an HTTP client library. While `fetch()` works too, Axios makes
> things like setting default headers (via interceptors), handling JSON
> automatically, and managing errors more convenient — which is why we
> use one shared Axios instance for the whole app.

**Q16. What is an Axios interceptor, and how is it used here?**
> An interceptor is a function that runs automatically before every
> request (or after every response). In this project, a request
> interceptor automatically attaches the saved JWT token to every
> outgoing API call, so we don't have to manually add it every time.

### File Uploads

**Q17. What is Multer, and why do we need it?**
> Multer is a Node.js middleware that handles `multipart/form-data`,
> which is the format used when uploading files from a browser form.
> Express cannot parse file uploads on its own — Multer does that job and
> saves the file to a folder on the server.

**Q18. How does SkillSync prevent someone from uploading a virus/exe file
as a "resume"?**
> The `uploadMiddleware.js` file defines a `fileFilter` that only allows
> specific MIME types (PDF and Word documents) and rejects everything
> else, plus a maximum file size limit of 5MB.

### General / Architecture

**Q19. What is CORS, and why does the backend need it configured?**
> CORS (Cross-Origin Resource Sharing) is a browser security feature that
> blocks a webpage from making requests to a different origin (domain or
> port) unless that server explicitly allows it. Since our React app
> (port 5173) and Express server (port 5000) run on different ports
> during development, we configure `cors()` in `server.js` to allow the
> frontend's origin.

**Q20. What is the purpose of the `.env` file, and why is it excluded
from GitHub?**
> The `.env` file stores sensitive configuration values (database
> connection strings, JWT secret keys) outside the source code. It's
> excluded from GitHub (via `.gitignore`) so these secrets are never
> exposed publicly in the repository.

**Q21. Explain the full request lifecycle for adding a new skill, from
button click to database update.**
> 1. User types a skill name and clicks "Add Skill" on the Skills page.
> 2. React calls `api.post("/skills", { skill })` using Axios.
> 3. The Axios interceptor attaches the JWT token to the request header.
> 4. The request hits the Express route `POST /api/skills`.
> 5. `authMiddleware.js` verifies the token and attaches `req.user.id`.
> 6. `skillController.js`'s `addSkill` function checks for duplicates,
>    then pushes the new skill into the user's `skills` array using
>    Mongoose, and saves the document to MongoDB Atlas.
> 7. The updated skills array is sent back as a JSON response.
> 8. React updates its local state with the new list, and the new skill
>    tag appears on screen instantly.

**Q22. Why are controllers, routes, and models kept in separate folders
instead of one big file?**
> This follows the **separation of concerns** principle: routes only
> define "which URL maps to which function," controllers only contain
> the actual logic for what to do, and models only define the shape of
> the data. This makes the codebase easier to read, test, debug, and
> extend as the project grows.

---

## 10. Possible Future Improvements (Good Talking Points)

If asked "what would you add next?" in a viva, here are honest, realistic
answers:
- Email verification during registration.
- Admin panel to add/edit career roles through a UI instead of the seed script.
- Pagination for the career roles list as it grows.
- Unit tests for the `matchSkills.js` logic using Jest.
- Deploying the backend (e.g., Render/Railway) and frontend (e.g.,
  Vercel/Netlify) so the project is live and shareable.
- Password reset via email (forgot password flow).

---

**End of document.** Refer back to `README.md` for setup instructions.

---

## Extra Section: The Unique Feature (Gap → Roadmap → Verification)

### The question a judge will ask
*"Many apps already recommend skills. What is special about yours?"*

**Short answer:** "Most platforms stop at telling you what skills you need.
SkillSync identifies the skill gap, creates a personalised learning roadmap,
and then **verifies** the student's skills through practical challenges. So
the student doesn't just get a recommendation, they get proof and become
job-ready."

### How each part works (plain language)

1. **Skill gap.** For the target role, every required skill gets one of three
   statuses: *verified* (proved), *claimed* (student says they know it), or
   *missing*. Verified = 1 point, claimed = 0.4 point, missing = 0. The
   Job Readiness score is the points divided by the number of required skills.
   Example: 8 skills, 2 verified, 2 claimed → (2 + 0.8) / 8 = 35%.
2. **Roadmap.** `utils/roadmap.js` takes the unverified skills and sorts them
   so prerequisites come first (HTML before CSS before React). Hours come from
   `skillCatalog.js`; weeks = hours remaining ÷ weekly hours.
3. **Verification.** Questions live on the server with their answers. The
   browser only receives the question text, so answers can't be read from the
   network tab. Options are shuffled when the server starts. For JavaScript,
   the student's function is run against hidden test cases in a VM with a
   1-second timeout. Pass = 2 of 3 questions right (and all code tests).
4. **Skill Passport.** A page of verified skills that the student can share.
   It is private by default.

### Viva questions and answers

**Q: Why not just let students tick "I know this"?**
A: Self-rating is unreliable. Our score gives only partial credit for claimed
skills and full credit for verified ones.

**Q: How do you stop students from cheating on the quiz?**
A: Answers never leave the server, options are shuffled, retries have a
30-second cool-down, and coding tasks use hidden tests. It is not
proctored, so we describe it as "verified by practical challenge", not
"certified". More questions per skill would make it stronger.

**Q: Is any AI used?**
A: No. Matching, scoring, ordering and grading are plain, explainable
JavaScript logic.

**Q: What is the limitation of code execution?**
A: Node's `vm` is not a perfect sandbox. For public deployment, run it in an
isolated container or turn coding challenges off with
`ENABLE_CODE_CHALLENGES=false`.

**Q: How would you extend it?**
A: More question banks, more coding languages, mentor review of projects,
and an employer view of Skill Passports.
