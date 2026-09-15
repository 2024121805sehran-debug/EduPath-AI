import json
import re

with open('src/data/coursesData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove 'import type ...' and 'export const COURSES_DATA: Course[] ='
json_str = content.split('export const COURSES_DATA: Course[] =')[1].strip()
if json_str.endswith(';'):
    json_str = json_str[:-1].strip()

courses_data = json.loads(json_str)

print(f"Total Courses in application: {len(courses_data)}")

sql_lines = []
sql_lines.append("-- ==========================================")
sql_lines.append("-- EDUPATH AI — ALL COURSES SEED DATA SCRIPT")
sql_lines.append("-- ==========================================")
sql_lines.append("")

# 1. COURSES
sql_lines.append("-- 1. COURSES")
sql_lines.append("INSERT INTO public.courses (id, name, description, duration) VALUES")
course_vals = []
for c in courses_data:
    cid = c['id']
    name = c['name'].replace("'", "''")
    desc = c.get('description', '').replace("'", "''")
    dur = f"{c.get('totalSemesters', 8) // 2} Years"
    course_vals.append(f"  ('{cid}', '{name}', '{desc}', '{dur}')")

sql_lines.append(",\n".join(course_vals) + "\nON CONFLICT (id) DO NOTHING;\n")

# 2. SUBJECTS
sql_lines.append("-- 2. SUBJECTS")
sql_lines.append("INSERT INTO public.subjects (id, course_id, year, semester, name, code, description) VALUES")
subject_vals = []
unit_vals = []
topic_vals = []
resource_vals = []

for c in courses_data:
    cid = c['id']
    for yr in c.get('years', []):
        year_num = yr.get('yearNumber', 1)
        for sem in yr.get('semesters', []):
            sem_num = sem.get('semesterNumber', sem.get('semNumber', 1))
            for sub in sem.get('subjects', []):
                sid = sub['id']
                sname = sub['name'].replace("'", "''")
                scode = sub.get('code', 'GEN101').replace("'", "''")
                sdesc = sub.get('description', '').replace("'", "''")
                subject_vals.append(f"  ('{sid}', '{cid}', {year_num}, {sem_num}, '{sname}', '{scode}', '{sdesc}')")

                for u in sub.get('units', []):
                    uid = u['id']
                    unum = u.get('unitNumber', 1)
                    utitle = u['title'].replace("'", "''")
                    udesc = u.get('description', '').replace("'", "''")
                    unit_vals.append(f"  ('{uid}', '{sid}', {unum}, '{utitle}', '{udesc}')")

                    for top in u.get('topics', []):
                        tid = top['id']
                        ttitle = top['title'].replace("'", "''")
                        tdesc = top.get('description', '').replace("'", "''")
                        diff = top.get('difficulty', 'Intermediate').replace("'", "''")
                        est = top.get('estimatedMinutes', 25)
                        topic_vals.append(f"  ('{tid}', '{uid}', '{ttitle}', '{tdesc}', '{diff}', {est})")

                        for r in top.get('resources', []):
                            rid = r['id']
                            rtype = r.get('type', 'Article').replace("'", "''")
                            rtitle = r['title'].replace("'", "''")
                            rurl = r.get('url', 'https://wikipedia.org').replace("'", "''")
                            rdesc = r.get('source', '').replace("'", "''")
                            resource_vals.append(f"  ('{rid}', '{tid}', '{rtype}', '{rtitle}', '{rurl}', '{rdesc}')")

sql_lines.append(",\n".join(subject_vals) + "\nON CONFLICT (id) DO NOTHING;\n")

# 3. UNITS
sql_lines.append("-- 3. UNITS")
sql_lines.append("INSERT INTO public.units (id, subject_id, unit_number, title, description) VALUES")
sql_lines.append(",\n".join(unit_vals) + "\nON CONFLICT (id) DO NOTHING;\n")

# 4. TOPICS
sql_lines.append("-- 4. TOPICS")
sql_lines.append("INSERT INTO public.topics (id, unit_id, title, description, difficulty, estimated_minutes) VALUES")
sql_lines.append(",\n".join(topic_vals) + "\nON CONFLICT (id) DO NOTHING;\n")

# 5. RESOURCES
sql_lines.append("-- 5. RESOURCES")
sql_lines.append("INSERT INTO public.resources (id, topic_id, type, title, url, description) VALUES")
sql_lines.append(",\n".join(resource_vals) + "\nON CONFLICT (id) DO NOTHING;\n")

# 6. ACHIEVEMENTS
sql_lines.append("-- 6. ACHIEVEMENTS")
sql_lines.append("INSERT INTO public.achievements (id, name, description, icon, requirement_type, requirement_value, xp_reward) VALUES")
sql_lines.append("  ('ach-first-step', 'First Step', 'Complete your first topic in any college course subject.', 'BookOpen', 'topics_completed', 1, 50),")
sql_lines.append("  ('ach-first-quiz', 'First Quiz', 'Attempt and pass your first topic assessment quiz.', 'CheckCircle2', 'quizzes_passed', 1, 30),")
sql_lines.append("  ('ach-quiz-master', 'Quiz Master', 'Score a perfect 100% accuracy on any module assessment.', 'Target', 'perfect_quizzes', 1, 50),")
sql_lines.append("  ('ach-coding-beginner', 'Coding Beginner', 'Solve your first programming challenge with all test cases passing.', 'Code', 'problems_solved', 1, 75),")
sql_lines.append("  ('ach-coding-master', 'Coding Master', 'Solve 5 coding problems across arrays, searching, or algorithms.', 'Terminal', 'problems_solved', 5, 150),")
sql_lines.append("  ('ach-streak-7', '7 Day Streak', 'Maintain an active daily study streak for 7 consecutive days.', 'Flame', 'streak_days', 7, 100),")
sql_lines.append("  ('ach-streak-30', '30 Day Streak', 'Demonstrate elite consistency by maintaining a 30-day study streak.', 'Zap', 'streak_days', 30, 300),")
sql_lines.append("  ('ach-subject-completed', 'Subject Completed', 'Complete 100% of all syllabus units and topics in a subject.', 'Award', 'subjects_completed', 1, 500),")
sql_lines.append("  ('ach-sem-completed', 'Semester Completed', 'Complete all subjects and modules for an academic semester.', 'Trophy', 'semesters_completed', 1, 750)")
sql_lines.append("ON CONFLICT (id) DO NOTHING;")

final_sql = "\n".join(sql_lines)

with open('supabase/seed.sql', 'w', encoding='utf-8') as sf:
    sf.write(final_sql)

print(f"Successfully generated supabase/seed.sql! Subjects: {len(subject_vals)}, Units: {len(unit_vals)}, Topics: {len(topic_vals)}")
