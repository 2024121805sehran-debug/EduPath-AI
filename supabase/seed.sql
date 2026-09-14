-- ==========================================
-- EDUPATH AI — SUPABASE SEED DATA SCRIPT
-- ==========================================

-- 1. SEED COURSES
INSERT INTO public.courses (id, name, description, duration) VALUES
  ('btech-cse', 'B.Tech Computer Science & Engineering', 'Core engineering degree covering software development, systems programming, and algorithms.', '4 Years'),
  ('btech-cse-aiml', 'B.Tech CSE (AI & Machine Learning)', 'Specialized engineering degree focused on Artificial Intelligence, Neural Networks, and Data Engineering.', '4 Years'),
  ('btech-cse-ds', 'B.Tech CSE (Data Science)', 'Specialized degree in statistical data modeling, big data analytics, and cloud computing.', '4 Years'),
  ('btech-it', 'B.Tech Information Technology', 'Focused on enterprise software engineering, web technology, and network administration.', '4 Years'),
  ('btech-cybersecurity', 'B.Tech Cyber Security', 'Specialized degree in network defense, ethical hacking, cryptography, and digital forensics.', '4 Years')
ON CONFLICT (id) DO NOTHING;

-- 2. SEED SUBJECTS (B.Tech CSE AI & ML - Year 3, Semester 5)
INSERT INTO public.subjects (id, course_id, year, semester, name, code, description) VALUES
  ('sub-ml-301', 'btech-cse-aiml', 3, 5, 'Machine Learning & Neural Networks', 'CS501', 'Supervised and unsupervised learning, decision trees, backpropagation, and deep learning architectures.'),
  ('sub-dbms-302', 'btech-cse-aiml', 3, 5, 'Database Management Systems & SQL', 'CS502', 'Relational data modeling, SQL query optimization, 3NF normalization, and transaction processing.'),
  ('sub-cn-303', 'btech-cse-aiml', 3, 5, 'Computer Networks & Security', 'CS503', 'OSI layers, TCP/IP protocol suite, IP subnetting, routing algorithms, and network security.'),
  ('sub-daa-304', 'btech-cse-aiml', 3, 5, 'Design & Analysis of Algorithms', 'CS504', 'Asymptotic complexity analysis, divide-and-conquer, dynamic programming, and greedy algorithms.'),
  ('sub-os-305', 'btech-cse-aiml', 3, 5, 'Operating Systems & Concurrency', 'CS505', 'Process synchronization, thread scheduling, virtual memory management, and deadlock handling.')
ON CONFLICT (id) DO NOTHING;

-- 3. SEED UNITS (Referencing valid subject IDs: sub-ml-301, sub-dbms-302, sub-cn-303, sub-daa-304, sub-os-305)
INSERT INTO public.units (id, subject_id, unit_number, title, description) VALUES
  ('unit-ml-1', 'sub-ml-301', 1, 'Unit 1: Supervised Learning & Regression', 'Linear regression, cost functions, gradient descent optimization, and evaluation metrics.'),
  ('unit-ml-2', 'sub-ml-301', 2, 'Unit 2: Classification & Decision Trees', 'Logistic regression, Support Vector Machines (SVM), entropy, and random forest ensembles.'),
  ('unit-dbms-1', 'sub-dbms-302', 1, 'Unit 1: Relational Model & SQL Fundamentals', 'ER diagrams, relational algebra, table constraints, and complex multi-table JOINs.'),
  ('unit-dbms-2', 'sub-dbms-302', 2, 'Unit 2: Database Normalization (1NF to 3NF)', 'Functional dependencies, 1NF, 2NF, 3NF, BCNF, and anomaly elimination.'),
  ('unit-cn-1', 'sub-cn-303', 1, 'Unit 1: Network Layer & IP Subnetting', 'IP addressing, CIDR notation, ICMP protocol, and distance-vector routing.'),
  ('unit-daa-1', 'sub-daa-304', 1, 'Unit 1: Dynamic Programming & Greedy Strategy', 'Knapsack problem, longest common subsequence, and optimal substructure.'),
  ('unit-os-1', 'sub-os-305', 1, 'Unit 1: Process Synchronization & Concurrency', 'Mutex locks, semaphores, producer-consumer problem, and deadlock prevention.')
ON CONFLICT (id) DO NOTHING;

-- 4. SEED TOPICS
INSERT INTO public.topics (id, unit_id, title, description, difficulty, estimated_minutes) VALUES
  ('topic-lin-reg', 'unit-ml-1', 'Linear Regression & Cost Functions', 'Mathematical derivation of Mean Squared Error (MSE) and gradient descent updating rules.', 'Beginner', 25),
  ('topic-overfitting', 'unit-ml-1', 'Overfitting & Regularization (L1/L2)', 'Understanding bias-variance tradeoff, Lasso (L1), and Ridge (L2) penalties.', 'Intermediate', 30),
  ('topic-logistic-reg', 'unit-ml-2', 'Logistic Regression & Sigmoid Function', 'Binary classification using log-odds, cross-entropy loss, and decision boundaries.', 'Intermediate', 35),
  ('topic-sql-joins', 'unit-dbms-1', 'Advanced SQL INNER, LEFT, and FULL JOINs', 'Writing high-performance multi-table queries with filtering and aggregation.', 'Beginner', 20),
  ('topic-normalization', 'unit-dbms-2', 'Database Normalization (1NF, 2NF, 3NF)', 'Step-by-step decomposition of unnormalized relations to 3rd Normal Form.', 'Advanced', 40)
ON CONFLICT (id) DO NOTHING;

-- 5. SEED RESOURCES
INSERT INTO public.resources (id, topic_id, type, title, url, description) VALUES
  ('res-1', 'topic-lin-reg', 'YouTube', 'Linear Regression Explained Visually', 'https://youtube.com/watch?v=linreg_demo', 'Step-by-step visual intuition behind line fitting and MSE cost minimization.'),
  ('res-2', 'topic-lin-reg', 'Documentation', 'Scikit-Learn LinearRegression API Guide', 'https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html', 'Official Scikit-Learn documentation and code usage.'),
  ('res-3', 'topic-normalization', 'Article', 'Database Normalization Explained from 1NF to 3NF', 'https://geeksforgeeks.org/dbms-normalization', 'Complete tutorial explaining functional dependency and normalization steps.')
ON CONFLICT (id) DO NOTHING;

-- 6. SEED QUIZZES
INSERT INTO public.quizzes (id, topic_id, title, passing_percentage, xp_reward) VALUES
  ('quiz-lin-reg', 'topic-lin-reg', 'Linear Regression Self-Test Assessment', 70, 30),
  ('quiz-normalization', 'topic-normalization', 'DBMS 3NF Normalization Quiz', 70, 30)
ON CONFLICT (id) DO NOTHING;

-- 7. SEED QUIZ QUESTIONS
INSERT INTO public.quiz_questions (id, quiz_id, question, options, correct_answer, explanation) VALUES
  ('q-1', 'quiz-lin-reg', 'What is the primary loss function used in standard Ordinary Least Squares (OLS) linear regression?', '["Mean Squared Error (MSE)", "Binary Cross-Entropy", "Hinge Loss", "Kullback-Leibler Divergence"]', 'Mean Squared Error (MSE)', 'OLS linear regression minimizes the sum of squared vertical distances between data points and the fitted line.'),
  ('q-2', 'quiz-lin-reg', 'Which hyperparameter controls the step size taken during gradient descent optimization?', '["Batch Size", "Learning Rate (alpha)", "Regularization Strength (lambda)", "Number of Epochs"]', 'Learning Rate (alpha)', 'The learning rate determines how far parameters are adjusted along the negative gradient vector at each step.'),
  ('q-3', 'quiz-normalization', 'A table is in 2nd Normal Form (2NF) if it is in 1NF and contains no:', '["Transitive dependencies", "Partial functional dependencies", "Multivalued attributes", "Duplicate rows"]', 'Partial functional dependencies', '2NF requires every non-prime attribute to be fully functionally dependent on the primary key.')
ON CONFLICT (id) DO NOTHING;

-- 8. SEED CODING PROBLEMS
INSERT INTO public.coding_problems (id, topic_id, title, description, difficulty, starter_code, test_cases, solution_explanation) VALUES
  ('prob-lin-reg-step', 'topic-lin-reg', 'Compute Gradient Descent Step for Linear Regression', 'Given current slope `m`, intercept `b`, learning rate `alpha`, and data points `(x, y)`, compute the updated slope `m_new` after one gradient step.', 'Easy', '{"python": "def compute_gradient_step(m, b, x, y, alpha):\n    # Write logic to compute updated m\n    return m\n", "cpp": "double computeGradientStep(double m, double b, double x, double y, double alpha) {\n    return m;\n}\n"}', '[{"input": "m=1.0, b=0.0, x=2.0, y=3.0, alpha=0.01", "expectedOutput": "1.02"}]', 'The derivative of MSE with respect to m is -2*x*(y - (m*x + b)). Multiply by alpha and subtract from m.'),
  ('prob-two-sum', 'topic-sql-joins', 'Two Sum Target Index Pair', 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.', 'Easy', '{"python": "def twoSum(nums, target):\n    # Write your solution here\n    pass\n", "cpp": "vector<int> twoSum(vector<int>& nums, int target) {\n    return {};\n}\n"}', '[{"input": "nums = [2,7,11,15], target = 9", "expectedOutput": "[0,1]"}]', 'Use a hash map to store each complement `target - num` along with its index.')
ON CONFLICT (id) DO NOTHING;

-- 9. SEED ACHIEVEMENTS DEFINITIONS
INSERT INTO public.achievements (id, name, description, icon, requirement_type, requirement_value, xp_reward) VALUES
  ('ach-first-step', 'First Step', 'Complete your first topic in any college course subject.', 'BookOpen', 'topics_completed', 1, 50),
  ('ach-first-quiz', 'First Quiz', 'Attempt and pass your first topic assessment quiz.', 'CheckCircle2', 'quizzes_passed', 1, 30),
  ('ach-quiz-master', 'Quiz Master', 'Score a perfect 100% accuracy on any module assessment.', 'Target', 'perfect_quizzes', 1, 50),
  ('ach-coding-beginner', 'Coding Beginner', 'Solve your first programming challenge with all test cases passing.', 'Code', 'problems_solved', 1, 75),
  ('ach-coding-master', 'Coding Master', 'Solve 5 coding problems across arrays, searching, or algorithms.', 'Terminal', 'problems_solved', 5, 150),
  ('ach-streak-7', '7 Day Streak', 'Maintain an active daily study streak for 7 consecutive days.', 'Flame', 'streak_days', 7, 100),
  ('ach-streak-30', '30 Day Streak', 'Demonstrate elite consistency by maintaining a 30-day study streak.', 'Zap', 'streak_days', 30, 300),
  ('ach-subject-completed', 'Subject Completed', 'Complete 100% of all syllabus units and topics in a subject.', 'Award', 'subjects_completed', 1, 500),
  ('ach-sem-completed', 'Semester Completed', 'Complete all subjects and modules for an academic semester.', 'Trophy', 'semesters_completed', 1, 750)
ON CONFLICT (id) DO NOTHING;
