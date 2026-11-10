/**
 * CHALLENGE BANK
 * ---------------------------------------------------------------------------
 * This is where the "verify the skill" part of SkillSync gets its content.
 *
 *  1. quizBank      - for every skill: 3 practical questions (scenario /
 *                     "what does this code do" / "which command" style).
 *                     Each question has the correct option index stored HERE
 *                     on the server. It is never sent to the browser, so a
 *                     student cannot read the answers from the network tab.
 *
 *  2. codeChallenges - real programming tasks for JavaScript. The student
 *                     writes a function; the server runs it against hidden
 *                     test cases (see utils/codeRunner.js).
 *
 * To add questions: copy one q(...) line and change the text.
 *   q(questionText, [option0, option1, option2, option3], correctIndex, explanation, optionalCodeSnippet)
 */

const q = (text, options, answer, explanation, code = "") => ({
  text,
  options,
  answer, // index of the correct option (0-3) - stays on the server
  explanation,
  code,
});

const quizBank = {
  HTML: [
    q("Which element is the best choice for the main navigation links of a page?", ['<div class="links">', "<nav>", "<section>", "<span>"], 1, "<nav> is the semantic element for major navigation blocks and helps screen readers."),
    q("What is the purpose of the alt attribute on an <img> tag?", ["It shows a tooltip on hover only", "It gives a text alternative for screen readers and for when the image fails to load", "It sets the image file path", "It adds a caption below the image"], 1, "alt provides a text alternative, which is essential for accessibility."),
    q("Which link opens the page in a new browser tab?", ['<a href="x" new>', '<a href="x" target="_blank">', '<a href="x" open="tab">', '<a href="x" window="new">'], 1, 'target="_blank" opens a new tab (add rel="noopener" for safety).'),
  ],
  CSS: [
    q("Which selector has the HIGHEST specificity?", ["p", ".box", "#box", "div p"], 2, "An id selector (#box) beats class, element and descendant selectors."),
    q("A flex container needs its children centred along the MAIN axis. Which property do you use?", ["align-items: center", "justify-content: center", "text-align: center", "place-self: center"], 1, "justify-content controls the main axis; align-items controls the cross axis."),
    q("With box-sizing: content-box, an element has width: 100px, padding: 10px and border: 5px. What is its total rendered width?", ["100px", "110px", "130px", "115px"], 2, "100 + (10 x 2 padding) + (5 x 2 border) = 130px."),
  ],
  JavaScript: [
    q("What does this code print?", ["null", "undefined", "object", "number"], 2, "typeof null is \"object\" - a famous historical quirk of JavaScript.", "console.log(typeof null);"),
    q("What does this code print?", ["[1,2,3] [1,2,3]", "[1,2,3] [2,4,6]", "[2,4,6] [2,4,6]", "undefined [2,4,6]"], 1, "map() returns a NEW array and does not change the original.", "const a = [1, 2, 3];\nconst b = a.map(x => x * 2);\nconsole.log(a, b);"),
    q("What does this code print?", ["true", "false", "undefined", "It throws a TypeError"], 1, "Floating-point rounding makes 0.1 + 0.2 equal 0.30000000000000004.", "console.log(0.1 + 0.2 === 0.3);"),
  ],
  React: [
    q("Which hook is used to run a side effect (like fetching data) after a component renders?", ["useState", "useEffect", "useRef", "useMemo"], 1, "useEffect runs after render and is the place for side effects."),
    q("Why must items in a rendered list have a stable, unique key?", ["It makes the list look better", "So React can tell which items changed, moved or were removed", "Keys are sent to the server", "It is required only for numbered lists"], 1, "Keys let React's reconciliation match old and new items correctly."),
    q("After ONE click, what is the value of n on the next render?", ["0", "1", "3", "undefined"], 1, "All three calls use the same stale value of n (0), so each one sets it to 1.", "const [n, setN] = useState(0);\nfunction onClick() {\n  setN(n + 1);\n  setN(n + 1);\n  setN(n + 1);\n}"),
  ],
  Git: [
    q("Which command shows the line-by-line changes you have NOT staged yet?", ["git status", "git diff", "git log", "git show"], 1, "git diff compares your working directory with the staging area."),
    q("Which command creates a new branch AND switches to it?", ["git branch feature", "git checkout -b feature", "git new feature", "git switch feature"], 1, "git checkout -b (or git switch -c) creates and switches in one step."),
    q("What does git pull do?", ["Only downloads remote changes without merging", "Uploads your commits", "Fetches remote changes and merges them into your current branch", "Deletes the local branch"], 2, "git pull is a git fetch followed by a merge."),
  ],
  "Responsive Design": [
    q("What does <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> do?", ["Sets the page title", "Makes the page layout width match the device screen width on mobile", "Blocks zooming", "Loads the mobile stylesheet only"], 1, "Without it, phones render a zoomed-out desktop layout."),
    q("Which media query applies styles only on screens up to 600px wide?", ["@media screen < 600px", "@media (max-width: 600px)", "@responsive 600px", "@media (width: max 600px)"], 1, "(max-width: 600px) matches widths of 600px and below."),
    q("What does a \"mobile-first\" approach mean?", ["Design only for phones", "Write base styles for small screens, then add min-width queries for larger screens", "Hide desktop content", "Use only pixel units"], 1, "Mobile-first starts small and progressively enhances for wider screens."),
  ],
  "Node.js": [
    q("How does Node.js handle many simultaneous I/O requests with a single main thread?", ["It creates one thread per request", "Non-blocking I/O and the event loop", "It runs requests one at a time and waits", "It uses the browser engine"], 1, "The event loop hands I/O to the system and runs callbacks when ready."),
    q("Which line loads the built-in 'fs' module in CommonJS?", ["const fs = include('fs')", "const fs = require('fs')", "using fs from 'fs'", "const fs = load.fs()"], 1, "CommonJS uses require()."),
    q("What is the output order?", ["A B C D", "A D B C", "A D C B", "A C D B"], 2, "Synchronous logs run first (A, D), then the promise microtask (C), then the timer (B).", "console.log('A');\nsetTimeout(() => console.log('B'), 0);\nPromise.resolve().then(() => console.log('C'));\nconsole.log('D');"),
  ],
  "Express.js": [
    q("What must a middleware call to pass control to the next handler?", ["res.next()", "next()", "continue()", "app.next()"], 1, "Calling next() moves on to the next middleware or route."),
    q("For the route /users/:id, how do you read the id inside the handler?", ["req.query.id", "req.body.id", "req.params.id", "req.id"], 2, "Route parameters are available on req.params."),
    q("Which line lets Express read JSON request bodies?", ["app.use(express.json())", "app.json()", "app.use(json.parse)", "app.enable('json')"], 0, "express.json() is the built-in JSON body-parsing middleware."),
  ],
  MongoDB: [
    q("In MongoDB, what is a single record called?", ["Row", "Document", "Tuple", "Table"], 1, "MongoDB stores JSON-like documents inside collections."),
    q("Which query finds all users older than 18?", ["db.users.find({ age: { $gt: 18 } })", "db.users.find({ age > 18 })", "db.users.select(age > 18)", "db.users.where('age', 18)"], 0, "$gt is the 'greater than' operator."),
    q("Why would you add an index to a field?", ["To make queries on that field faster", "To make the field required", "To encrypt the field", "To make documents smaller"], 0, "Indexes speed up reads on the indexed field at a small cost to writes."),
  ],
  "REST API": [
    q("Which HTTP method is meant to fully REPLACE an existing resource and is idempotent?", ["POST", "PUT", "PATCH", "CONNECT"], 1, "PUT replaces the whole resource; repeating it gives the same result."),
    q("Which status code should a successful 'create' request return?", ["200", "201", "204", "302"], 1, "201 Created tells the client a new resource was made."),
    q("Which URL best follows REST conventions to get the orders of user 5?", ["GET /getOrders?user=5", "POST /users/5/getOrders", "GET /users/5/orders", "GET /orders/getByUser/5"], 2, "REST uses nouns and nesting; the HTTP method is the verb."),
  ],
  Excel: [
    q("Which function finds a value in the first column of a range and returns a value from another column of the same row?", ["SUMIF", "VLOOKUP", "COUNTA", "CONCAT"], 1, "VLOOKUP (or the newer XLOOKUP) is the lookup function."),
    q("What does the reference $A$1 mean when you copy the formula to another cell?", ["It changes both column and row", "It always stays pointing at A1", "It only changes the column", "It becomes a text value"], 1, "The $ signs lock the column and row (absolute reference)."),
    q("Which feature summarises large data by grouping and totals without writing formulas?", ["Conditional Formatting", "PivotTable", "Data Validation", "Freeze Panes"], 1, "PivotTables group and aggregate data interactively."),
  ],
  SQL: [
    q("What does HAVING do in this query?", ["Filters rows before grouping", "Filters groups after aggregation", "Sorts the result", "Joins two tables"], 1, "WHERE filters rows before grouping; HAVING filters the groups.", "SELECT department, COUNT(*)\nFROM employees\nGROUP BY department\nHAVING COUNT(*) > 5;"),
    q("Which JOIN returns ALL rows from the left table plus matching rows from the right table?", ["INNER JOIN", "LEFT JOIN", "CROSS JOIN", "SELF JOIN"], 1, "LEFT JOIN keeps every left-table row; unmatched right columns are NULL."),
    q("Which keyword removes duplicate rows from a result?", ["UNIQUE", "DISTINCT", "SINGLE", "REMOVE"], 1, "SELECT DISTINCT returns only unique rows."),
  ],
  Python: [
    q("What does this print?", ["4", "3", "2", "It raises an error"], 1, "A set removes duplicates, leaving {1, 2, 3}.", "print(len({1, 2, 2, 3}))"),
    q("What does this print?", ["[0, 1, 2, 3]", "[0, 1, 4, 9]", "[1, 4, 9, 16]", "[0, 2, 4, 6]"], 1, "range(4) gives 0..3, and each value is squared.", "print([x * x for x in range(4)])"),
    q("Which of these is MUTABLE in Python?", ["tuple", "str", "list", "int"], 2, "Lists can be changed in place; tuples, strings and ints cannot."),
  ],
  "Data Visualization": [
    q("Which chart is usually best for showing a trend over time?", ["Pie chart", "Line chart", "Treemap", "Radar chart"], 1, "Line charts make change over time easy to follow."),
    q("What is the main risk of starting a bar chart's y-axis at a value above zero?", ["It exaggerates differences between bars", "It hides the labels", "It makes bars thinner", "There is no risk"], 0, "Bars encode length from zero, so truncating misleads the viewer."),
    q("Which chart shows the relationship between two numeric variables?", ["Histogram", "Scatter plot", "Stacked bar chart", "Donut chart"], 1, "A scatter plot places each observation by its two values."),
  ],
  Statistics: [
    q("What is the median of [3, 1, 9, 7, 5, 100]?", ["5", "6", "20.83", "7"], 1, "Sorted: 1,3,5,7,9,100. The middle two are 5 and 7, so the median is 6."),
    q("What does standard deviation measure?", ["The middle value", "How spread out the values are around the mean", "The most common value", "The total of all values"], 1, "It describes the typical distance from the mean."),
    q("A p-value of 0.03 most nearly means:", ["The hypothesis is 97% true", "If the null hypothesis were true, results this extreme would occur about 3% of the time", "The effect is large", "The experiment failed"], 1, "A p-value is about the data under the null hypothesis, not the probability a hypothesis is true."),
  ],
  "Power BI": [
    q("Which language is used to write calculated measures in Power BI?", ["SQL", "DAX", "M only", "Python only"], 1, "DAX (Data Analysis Expressions) is used for measures and calculated columns."),
    q("What is Power Query mainly used for?", ["Designing report themes", "Connecting to data and cleaning/transforming it", "Publishing to email", "Drawing shapes"], 1, "Power Query is the data-prep layer."),
    q("What does a slicer do on a report page?", ["Deletes rows", "Lets viewers filter the other visuals", "Exports data", "Adds a new table"], 1, "Slicers are on-page filters."),
  ],
  "Machine Learning": [
    q("A model has 99% accuracy on training data but 60% on new data. What is this called?", ["Underfitting", "Overfitting", "Normalisation", "Regularisation"], 1, "It memorised the training data instead of learning general patterns."),
    q("Why do we split data into training and test sets?", ["To make training faster", "To estimate how the model performs on unseen data", "To remove outliers", "To balance the classes"], 1, "The test set simulates new, unseen data."),
    q("Which task is an example of supervised learning?", ["Grouping customers with no labels", "Predicting house prices from labelled past sales", "Compressing images", "Detecting random noise"], 1, "Supervised learning learns from labelled examples."),
  ],
  Pandas: [
    q("What does df.head() return by default?", ["The column names", "The first 5 rows", "The last 5 rows", "A summary of statistics"], 1, "head() shows the first 5 rows unless you pass a number."),
    q("Which expression selects rows where age is greater than 30?", ["df.age > 30", "df[df['age'] > 30]", "df.select(age > 30)", "df.filter('age', 30)"], 1, "Boolean indexing: pass a True/False mask inside the brackets."),
    q("Which expression counts missing values in each column?", ["df.isna().sum()", "df.count_missing()", "df.null()", "df.empty()"], 0, "isna() marks missing cells and sum() counts them per column."),
  ],
  NumPy: [
    q("What does this print?", ["[1 2 3 1 2 3]", "[2 4 6]", "[1 2 3]", "Error"], 1, "NumPy multiplies element-by-element (vectorised).", "import numpy as np\nprint(np.array([1, 2, 3]) * 2)"),
    q("What is the shape of np.zeros((3, 4))?", ["(4, 3)", "(3, 4)", "(12,)", "(3,)"], 1, "3 rows and 4 columns."),
    q("Adding arrays of shape (3, 1) and (1, 4) gives an array of which shape (broadcasting)?", ["(3, 1)", "(1, 4)", "(3, 4)", "It raises an error"], 2, "Broadcasting stretches size-1 dimensions to match."),
  ],
  TensorFlow: [
    q("What is a tensor?", ["A single number only", "A multi-dimensional array of numbers", "A type of loss function", "A training dataset"], 1, "Tensors generalise scalars, vectors and matrices."),
    q("What is Keras in relation to TensorFlow?", ["A competing library", "A high-level API for building and training models", "A database", "A GPU driver"], 1, "tf.keras is TensorFlow's high-level model API."),
    q("What is one 'epoch' in training?", ["One batch of data", "One full pass over the training dataset", "One weight update", "One layer"], 1, "An epoch means the model has seen every training sample once."),
  ],
  Java: [
    q("Which collection does NOT allow duplicate elements?", ["ArrayList", "LinkedList", "HashSet", "Vector"], 2, "A Set holds unique elements."),
    q("What does this print?", ["true", "false", "Compile error", "null"], 1, "== compares object references; two separate String objects are different references.", 'String s1 = new String("a");\nString s2 = new String("a");\nSystem.out.println(s1 == s2);'),
    q("What does the javac command produce?", ["Machine code for your CPU", "Bytecode (.class files) for the JVM", "A JAR file", "Source code"], 1, "javac compiles .java source into bytecode that runs on the JVM."),
  ],
  Kotlin: [
    q("What is the difference between val and var in Kotlin?", ["No difference", "val is a read-only reference, var can be reassigned", "val is for numbers only", "var is a constant"], 1, "val cannot be reassigned; var can."),
    q("What does the type String? mean?", ["A string that may be null", "A string array", "An optional import", "A private string"], 0, "The ? marks a nullable type, which is how Kotlin gives null safety."),
    q("What does a data class generate automatically?", ["Only getters", "equals(), hashCode(), toString() and copy()", "A database table", "A UI layout"], 1, "data classes generate these useful members for you."),
  ],
  "React Native": [
    q("Which component efficiently renders a long scrollable list?", ["ScrollView with 1000 children", "FlatList", "View", "Text"], 1, "FlatList renders only the visible items."),
    q("What does React Native render on screen?", ["A WebView", "Real native UI components", "Canvas drawings", "HTML elements"], 1, "React Native maps components to native views."),
    q("How do you style components in React Native?", ["External .css files", "StyleSheet.create / JavaScript style objects", "Inline HTML <style> tags", "Sass only"], 1, "Styles are JavaScript objects, usually made with StyleSheet.create."),
  ],
  Flutter: [
    q("Which language is used to build Flutter apps?", ["Kotlin", "Swift", "Dart", "JavaScript"], 2, "Flutter uses Dart."),
    q("What is the basic building block of a Flutter UI?", ["Fragment", "Widget", "View", "Component class"], 1, "In Flutter, almost everything is a widget."),
    q("When should you use a StatefulWidget?", ["When the UI never changes", "When the widget's data changes over time and the UI must update with setState", "Only for images", "Only for the root widget"], 1, "StatefulWidgets hold mutable state and rebuild when it changes."),
  ],
  Linux: [
    q("Which command lists files with details (permissions, size, date)?", ["ls", "ls -l", "dir /w", "list -all"], 1, "ls -l gives the long listing format."),
    q("What does chmod 755 script.sh set?", ["Owner: read/write/execute; group and others: read/execute", "Everyone: full access", "Owner: read only", "Only root can run it"], 0, "7 = rwx for owner; 5 = r-x for group and others."),
    q("What is grep mainly used for?", ["Compressing files", "Searching text for patterns", "Changing permissions", "Starting services"], 1, "grep searches input for lines matching a pattern."),
  ],
  Docker: [
    q("What is the difference between a Docker image and a container?", ["They are the same", "A container is a running instance of an image", "An image is a running container", "A container is a type of volume"], 1, "Images are read-only templates; containers are the running instances."),
    q("Which Dockerfile instruction sets the base image?", ["BASE", "FROM", "IMAGE", "START"], 1, "Every Dockerfile begins with FROM."),
    q("Which flag publishes container port 80 on host port 8080?", ["-p 80:8080", "-p 8080:80", "-h 8080:80", "--open 8080"], 1, "The format is -p HOST_PORT:CONTAINER_PORT."),
  ],
  Kubernetes: [
    q("What is the smallest deployable unit in Kubernetes?", ["Container", "Pod", "Node", "Deployment"], 1, "A Pod wraps one or more containers."),
    q("What does a Deployment manage?", ["DNS records", "A set of identical Pods, including rolling updates", "Physical servers", "Docker images"], 1, "Deployments keep the desired number of replicas running and handle updates."),
    q("Which command lists the Pods in the current namespace?", ["kubectl list pods", "kubectl get pods", "kubectl show pods", "kubectl pods"], 1, "kubectl get <resource> lists resources."),
  ],
  "CI/CD": [
    q("What is the main goal of Continuous Integration?", ["Deploy manually every month", "Automatically build and test every change merged into the shared branch", "Write documentation", "Monitor servers"], 1, "CI catches integration problems early by testing every change."),
    q("What is the difference between Continuous Delivery and Continuous Deployment?", ["None", "Continuous Deployment releases to production automatically; Delivery keeps it release-ready with a manual approval", "Delivery is only for mobile", "Deployment is only for testing"], 1, "Deployment removes the manual approval step."),
    q("Where are GitHub Actions workflows defined?", ["package.json", ".github/workflows/*.yml", "actions.config.js", "Dockerfile"], 1, "Workflow files live in .github/workflows."),
  ],
  AWS: [
    q("What is Amazon S3?", ["A virtual server", "Object storage", "A relational database", "A DNS service"], 1, "S3 stores objects (files) in buckets."),
    q("What is Amazon EC2?", ["Resizable virtual servers in the cloud", "A queue service", "A CDN", "A code editor"], 0, "EC2 provides virtual machines."),
    q("What is AWS IAM used for?", ["Billing alerts only", "Managing users, roles and permissions", "Hosting websites", "Training models"], 1, "IAM controls who can do what in your AWS account."),
  ],
  Azure: [
    q("Which Azure service provides virtual machines?", ["Azure Functions", "Azure Virtual Machines", "Azure Monitor", "Azure DevOps"], 1, "Azure Virtual Machines are IaaS compute."),
    q("What is Azure Blob Storage designed for?", ["Relational tables", "Storing large amounts of unstructured data like files and images", "Sending email", "DNS hosting"], 1, "Blob = binary large object storage."),
    q("Which service manages identities and sign-in (formerly Azure Active Directory)?", ["Microsoft Entra ID", "Azure Blob", "Azure Cosmos DB", "Azure Bastion"], 0, "Azure AD was renamed Microsoft Entra ID."),
  ],
  Networking: [
    q("What does DNS do?", ["Encrypts traffic", "Translates domain names into IP addresses", "Assigns MAC addresses", "Blocks malware"], 1, "DNS is the internet's phone book."),
    q("Which port does HTTPS use by default?", ["21", "80", "443", "8080"], 2, "HTTPS uses TCP port 443."),
    q("At which OSI layer does TCP operate?", ["Network (3)", "Transport (4)", "Session (5)", "Application (7)"], 1, "TCP and UDP are transport-layer protocols."),
  ],
  Terraform: [
    q("Which language are Terraform configuration files written in?", ["YAML only", "HCL (HashiCorp Configuration Language)", "Python", "Bash"], 1, "Terraform uses HCL (.tf files)."),
    q("What does terraform plan do?", ["Creates the resources immediately", "Shows what changes would be made without applying them", "Deletes the state file", "Formats the code"], 1, "plan is a safe preview; apply makes the changes."),
    q("What does the Terraform state file track?", ["Your git history", "The mapping between your configuration and the real resources it created", "Your passwords", "Cloud billing"], 1, "State lets Terraform know what already exists."),
  ],
  Figma: [
    q("Which Figma feature lets you create reusable UI elements such as a button?", ["Components", "Prototype arrows", "Plugins only", "Comments"], 0, "Components keep copies (instances) in sync with a main version."),
    q("What does Auto Layout do?", ["Exports code automatically", "Makes frames resize and space their children automatically", "Colours the design", "Adds animations"], 1, "Auto Layout builds responsive, self-adjusting frames."),
    q("What are Styles/Variables used for?", ["Sharing files", "Defining reusable colours, text and spacing values across a design", "Recording video", "Version control"], 1, "They keep a design consistent and easy to update."),
  ],
  Wireframing: [
    q("What is the main purpose of a wireframe?", ["Final visual design with brand colours", "Showing page structure and layout without visual detail", "Writing production code", "Testing server speed"], 1, "Wireframes focus on structure and content placement."),
    q("Which describes a low-fidelity wireframe?", ["Pixel-perfect with real photos", "Simple boxes, lines and placeholder text", "A coded prototype", "A style guide"], 1, "Low-fi means quick, simple and cheap to change."),
    q("Why make wireframes before high-fidelity designs?", ["To get early, cheap feedback on layout and flow", "Because clients dislike colour", "To avoid user testing", "To reduce page count"], 0, "Fixing structure early saves rework later."),
  ],
  "User Research": [
    q("Which method mainly gives qualitative insight into WHY users behave a certain way?", ["Analytics dashboard", "User interviews", "A/B test of button colour", "Server logs"], 1, "Interviews reveal motivations and context."),
    q("Which is a LEADING question?", ["How do you usually book travel?", "Don't you think our checkout is easy to use?", "What was frustrating about checkout?", "Walk me through the last time you bought something."], 1, "It pushes the participant toward a particular answer."),
    q("Roughly how many users can reveal most major usability problems in one round of testing?", ["1", "About 5", "About 50", "Exactly 500"], 1, "Small rounds of around 5 users surface the biggest problems; repeat after fixes."),
  ],
  "Adobe XD": [
    q("What does Repeat Grid do?", ["Exports to PDF", "Duplicates an element or group into a grid you can edit together", "Adds voice commands", "Locks layers"], 1, "It is ideal for lists, cards and galleries."),
    q("In Adobe XD, an artboard represents:", ["A single screen or page of the design", "A colour palette", "A plugin", "A version"], 0, "Each artboard is one screen."),
    q("What is Prototype mode used for?", ["Drawing icons", "Linking artboards with interactions and transitions", "Writing code", "Exporting fonts"], 1, "Prototype mode connects screens into a clickable flow."),
  ],
  Prototyping: [
    q("What is the key difference between a wireframe and a prototype?", ["None", "A prototype is interactive and simulates how the product behaves", "A wireframe is always coded", "A prototype has no screens"], 1, "Prototypes can be clicked through."),
    q("Why test a prototype before development?", ["To find usability problems while changes are still cheap", "To avoid hiring developers", "To pick the database", "To set the price"], 0, "Fixing design is far cheaper than fixing built software."),
    q("What is a user flow?", ["A server log", "The path of steps a user takes to complete a task", "A colour scheme", "A database diagram"], 1, "User flows map the journey from start to goal."),
  ],
  "Manual Testing": [
    q("What is a smoke test?", ["A deep performance test", "A quick check that the most critical functions work after a new build", "A security audit", "A test of only the UI colours"], 1, "Smoke tests decide whether a build is stable enough for further testing."),
    q("What is regression testing?", ["Testing a brand-new feature only", "Re-testing existing functionality to confirm new changes did not break it", "Testing on old phones", "Removing bugs from code"], 1, "It protects what already worked."),
    q("Which item is ESSENTIAL in a good bug report?", ["Steps to reproduce plus expected vs actual result", "The tester's opinion of the developer", "A screenshot of the desktop", "The project budget"], 0, "Reproducible steps and the expected/actual difference let developers fix quickly."),
  ],
  Selenium: [
    q("What is Selenium WebDriver used for?", ["Writing SQL queries", "Automating actions in a web browser", "Load testing APIs only", "Designing UIs"], 1, "WebDriver controls real browsers programmatically."),
    q("Which locator is generally the most reliable when available?", ["Absolute XPath", "ID", "Link text of a long sentence", "Index of the element in the page"], 1, "IDs are meant to be unique and are stable."),
    q("Tests fail randomly because elements load slowly. What is the best fix?", ["Add Thread.sleep(30000) everywhere", "Use explicit waits for the specific condition", "Run the test twice", "Remove the assertion"], 1, "Explicit waits pause only until the condition is true."),
  ],
  "Test Case Design": [
    q("A field accepts ages 1 to 100. Which set is the best boundary-value selection?", ["5, 50, 95", "0, 1, 100, 101", "1, 2, 3", "1000"], 1, "Boundary testing checks values on and just outside each limit."),
    q("What is equivalence partitioning?", ["Testing every possible input", "Grouping inputs that should behave the same and testing one from each group", "Splitting the team", "Dividing code into files"], 1, "It reduces the number of tests while keeping coverage."),
    q("Which belongs in a well-written test case?", ["Preconditions, steps and expected result", "Only the title", "The developer's name and mood", "The release date"], 0, "Clear preconditions, steps and expected results make a test repeatable."),
  ],
  Postman: [
    q("What is a Postman Collection?", ["A set of saved, organised requests", "A browser extension list", "A type of server", "A database"], 0, "Collections group related requests, tests and docs."),
    q("How do you use an environment variable called baseUrl in a request URL?", ["$baseUrl", "{{baseUrl}}", "<baseUrl>", "%baseUrl%"], 1, "Postman uses double curly braces."),
    q("What language do you use to write tests in the Tests tab?", ["Python", "JavaScript (pm.test)", "Java", "SQL"], 1, "Postman test scripts are JavaScript."),
  ],
  "Ethical Hacking": [
    q("What must an ethical hacker have BEFORE testing a system?", ["A fast computer", "Written authorisation and a defined scope", "A new IP address", "Source code"], 1, "Without permission, testing is illegal even if the intent is good."),
    q("What is Nmap mainly used for?", ["Editing images", "Network scanning and port discovery", "Writing reports", "Cracking Wi-Fi only"], 1, "Nmap discovers hosts and open ports."),
    q("What is the best defence against SQL injection?", ["Hiding the login page", "Parameterised queries / prepared statements", "Longer URLs", "Disabling the keyboard"], 1, "Parameterised queries keep user input separate from SQL code."),
  ],
  "SIEM Tools": [
    q("What does SIEM stand for?", ["Secure Internet Email Manager", "Security Information and Event Management", "System Integrity and Error Monitor", "Server Infrastructure and Event Map"], 1, "SIEM = Security Information and Event Management."),
    q("What is the core job of a SIEM?", ["Edit documents", "Collect and correlate logs from many sources to detect threats", "Host websites", "Compile code"], 1, "SIEMs aggregate logs and raise alerts on suspicious patterns."),
    q("Which of these is a SIEM platform?", ["Photoshop", "Splunk", "Jenkins", "Nginx"], 1, "Splunk (like Microsoft Sentinel or QRadar) is a SIEM."),
  ],
};

/**
 * CODING CHALLENGES (JavaScript)
 * The student writes a function with the given name. The server calls it with
 * each test's `args` and compares the result with `expected`.
 * The first 2 tests are shown to the student as examples; the rest stay hidden.
 */
const codeChallenges = {
  JavaScript: [
    {
      id: "js-sum-evens",
      title: "Sum of even numbers",
      prompt: "Write a function sumOfEvens(nums) that returns the sum of all EVEN numbers in the array. Return 0 for an empty array.",
      functionName: "sumOfEvens",
      starterCode: "function sumOfEvens(nums) {\n  // write your code here\n}\n",
      tests: [
        { args: [[1, 2, 3, 4]], expected: 6 },
        { args: [[]], expected: 0 },
        { args: [[7, 9, 11]], expected: 0 },
        { args: [[-2, -4, 5, 10]], expected: 4 },
      ],
    },
    {
      id: "js-reverse-words",
      title: "Reverse the words",
      prompt: 'Write a function reverseWords(str) that reverses the ORDER of the words in a sentence (words are separated by single spaces). Example: "hello big world" becomes "world big hello".',
      functionName: "reverseWords",
      starterCode: "function reverseWords(str) {\n  // write your code here\n}\n",
      tests: [
        { args: ["hello big world"], expected: "world big hello" },
        { args: ["one"], expected: "one" },
        { args: ["a b c d"], expected: "d c b a" },
        { args: [""], expected: "" },
      ],
    },
    {
      id: "js-palindrome",
      title: "Palindrome check",
      prompt: 'Write a function isPalindrome(str) that returns true if the text reads the same forwards and backwards, IGNORING upper/lower case and any character that is not a letter or number. Example: "A man, a plan, a canal: Panama" is a palindrome.',
      functionName: "isPalindrome",
      starterCode: "function isPalindrome(str) {\n  // write your code here\n}\n",
      tests: [
        { args: ["racecar"], expected: true },
        { args: ["A man, a plan, a canal: Panama"], expected: true },
        { args: ["hello"], expected: false },
        { args: ["No lemon, no melon"], expected: true },
        { args: ["ab"], expected: false },
      ],
    },
    {
      id: "js-fizzbuzz",
      title: "FizzBuzz",
      prompt: 'Write a function fizzBuzz(n) that returns an ARRAY of strings for the numbers 1..n. Use "Fizz" for multiples of 3, "Buzz" for multiples of 5, "FizzBuzz" for multiples of both, otherwise the number as a string.',
      functionName: "fizzBuzz",
      starterCode: "function fizzBuzz(n) {\n  // write your code here\n}\n",
      tests: [
        { args: [5], expected: ["1", "2", "Fizz", "4", "Buzz"] },
        { args: [1], expected: ["1"] },
        { args: [15], expected: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"] },
      ],
    },
    {
      id: "js-flatten",
      title: "Flatten a nested array",
      prompt: "Write a function flatten(arr) that takes an array which may contain nested arrays (at any depth) and returns a single flat array. Example: [1, [2, [3, 4]], 5] becomes [1, 2, 3, 4, 5].",
      functionName: "flatten",
      starterCode: "function flatten(arr) {\n  // write your code here\n}\n",
      tests: [
        { args: [[1, [2, [3, 4]], 5]], expected: [1, 2, 3, 4, 5] },
        { args: [[]], expected: [] },
        { args: [[[[["deep"]]]]], expected: ["deep"] },
        { args: [[1, 2, 3]], expected: [1, 2, 3] },
      ],
    },
  ],
};

/**
 * SHUFFLE THE OPTIONS
 * Above, most correct answers were written as option B for speed. If we sent
 * them like that, a student could simply always pick B. So when the server
 * starts, we shuffle the options of every question and move the `answer`
 * index along with the correct option. A seeded random generator is used so
 * the order is the same every time the server restarts (easy to debug).
 */
const seededRandom = (seed) => {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

let questionCounter = 1;
Object.values(quizBank)
  .flat()
  .forEach((question) => {
    const random = seededRandom(questionCounter++ * 7919);
    const correctText = question.options[question.answer];
    // Fisher-Yates shuffle
    for (let i = question.options.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [question.options[i], question.options[j]] = [question.options[j], question.options[i]];
    }
    question.answer = question.options.indexOf(correctText);
  });

module.exports = { quizBank, codeChallenges };
