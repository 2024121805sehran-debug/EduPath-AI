import type { CodingProblem } from '../types';

export const CODING_PROBLEMS_DATA: CodingProblem[] = [
  // 1. Arrays: Two Sum
  {
    id: 'prob-two-sum',
    title: 'Two Sum - Target Index Finder',
    subjectId: 'sub-dsa',
    subjectName: 'Data Structures & Algorithms',
    difficulty: 'Easy',
    category: 'Arrays',
    xpReward: 100,
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the 0-based indices of the two numbers such that they add up to \`target\`.

Assume each input has exactly one solution, and you may not use the same element twice.

#### Example 1:
- **Input:** \`nums = [2, 7, 11, 15], target = 9\`
- **Output:** \`0 1\` (because nums[0] + nums[1] == 9)`,
    inputFormat: 'First line: N and Target. Second line: N space-separated integers.',
    outputFormat: 'Print 0-indexed position of the two numbers in ascending order.',
    constraints: ['2 <= N <= 10^4', '-10^9 <= nums[i] <= 10^9'],
    sampleCases: [
      {
        input: '4 9\n2 7 11 15',
        output: '0 1',
        explanation: 'nums[0] (2) + nums[1] (7) = 9'
      }
    ],
    testCases: [
      { id: 'tc1', input: '4 9\n2 7 11 15', expectedOutput: '0 1' },
      { id: 'tc2', input: '3 6\n3 2 4', expectedOutput: '1 2' },
      { id: 'tc3', input: '2 10\n5 5', expectedOutput: '0 1', isHidden: true }
    ],
    initialCode: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().split()\n    if not lines: return\n    n, target = int(lines[0]), int(lines[1])\n    nums = [int(x) for x in lines[2:2+n]]\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            print(f"{seen[diff]} {i}")\n            return\n        seen[num] = i\n\nsolve()`,
      cpp: `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    int n, target;\n    if (!(cin >> n >> target)) return 0;\n    vector<int> nums(n);\n    unordered_map<int, int> seen;\n    for (int i = 0; i < n; i++) {\n        cin >> nums[i];\n        int diff = target - nums[i];\n        if (seen.count(diff)) {\n            cout << seen[diff] << " " << i << endl;\n            return 0;\n        }\n        seen[nums[i]] = i;\n    }\n    return 0;\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int target = sc.nextInt();\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < n; i++) {\n            int val = sc.nextInt();\n            int complement = target - val;\n            if (map.containsKey(complement)) {\n                System.out.println(map.get(complement) + " " + i);\n                return;\n            }\n            map.put(val, i);\n        }\n    }\n}`,
      javascript: `const fs = require('fs');\nconst tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\nif (tokens.length > 2) {\n  const n = parseInt(tokens[0]);\n  const target = parseInt(tokens[1]);\n  const nums = tokens.slice(2, 2 + n).map(Number);\n  const map = new Map();\n  for (let i = 0; i < n; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) {\n      console.log(\`\${map.get(diff)} \${i}\`);\n      break;\n    }\n    map.set(nums[i], i);\n  }\n}`
    },
    solutionHint: 'Use a Hash Map to store complement values (target - current) for O(N) single-pass lookup.'
  },

  // 2. Arrays: Maximum & Minimum in Array
  {
    id: 'prob-max-min-array',
    title: 'Find Maximum & Minimum in Array',
    subjectId: 'sub-c-prog',
    subjectName: 'Programming in C & Problem Solving',
    difficulty: 'Easy',
    category: 'Arrays',
    xpReward: 100,
    description: `Given an array of $N$ integers, write a program to find the maximum and minimum elements in the array.

#### Example:
- **Input:** \`5\\n3 1 9 4 7\`
- **Output:** \`9 1\` (Maximum: 9, Minimum: 1)`,
    inputFormat: 'First line contains integer N. Second line contains N space-separated integers.',
    outputFormat: 'Print maximum element followed by space and minimum element.',
    constraints: ['1 <= N <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    sampleCases: [
      { input: '5\n3 1 9 4 7', output: '9 1', explanation: 'Max is 9, Min is 1' }
    ],
    testCases: [
      { id: 'tc1', input: '5\n3 1 9 4 7', expectedOutput: '9 1' },
      { id: 'tc2', input: '1\n42', expectedOutput: '42 42' },
      { id: 'tc3', input: '4\n-5 -10 -2 -20', expectedOutput: '-2 -20', isHidden: true }
    ],
    initialCode: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().split()\n    if not lines: return\n    n = int(lines[0])\n    nums = [int(x) for x in lines[1:1+n]]\n    print(f"{max(nums)} {min(nums)}")\n\nsolve()`,
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    int max_v = -1e9, min_v = 1e9;\n    for(int i=0; i<n; i++) {\n        int val;\n        cin >> val;\n        max_v = max(max_v, val);\n        min_v = min(min_v, val);\n    }\n    cout << max_v << " " << min_v << endl;\n    return 0;\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int maxV = Integer.MIN_VALUE, minV = Integer.MAX_VALUE;\n        for(int i=0; i<n; i++) {\n            int val = sc.nextInt();\n            maxV = Math.max(maxV, val);\n            minV = Math.min(minV, val);\n        }\n        System.out.println(maxV + " " + minV);\n    }\n}`,
      javascript: `const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\nif (input.length > 1) {\n  const n = parseInt(input[0]);\n  const nums = input.slice(1, 1 + n).map(Number);\n  console.log(\`\${Math.max(...nums)} \${Math.min(...nums)}\`);\n}`
    },
    solutionHint: 'Initialize min and max with the first element and iterate through the array updating both.'
  },

  // 3. Strings: Valid Palindrome
  {
    id: 'prob-valid-palindrome',
    title: 'Valid String Palindrome Check',
    subjectId: 'sub-dsa',
    subjectName: 'Data Structures & Algorithms',
    difficulty: 'Easy',
    category: 'Strings',
    xpReward: 100,
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.

Print \`true\` if it is a palindrome, or \`false\` otherwise.`,
    inputFormat: 'A single string phrase on one line.',
    outputFormat: 'Print true or false.',
    constraints: ['1 <= phrase.length <= 10^5'],
    sampleCases: [
      { input: 'A man a plan a canal Panama', output: 'true', explanation: 'Cleaned phrase: "amanaplanacanalpanama"' }
    ],
    testCases: [
      { id: 'tc1', input: 'A man a plan a canal Panama', expectedOutput: 'true' },
      { id: 'tc2', input: 'race a car', expectedOutput: 'false' },
      { id: 'tc3', input: 'No lemon, no melon', expectedOutput: 'true', isHidden: true }
    ],
    initialCode: {
      python: `import sys\nimport re\n\ndef is_palindrome(s):\n    cleaned = re.sub(r'[^a-zA-Z0-9]', '', s).lower()\n    return cleaned == cleaned[::-1]\n\ns = sys.stdin.read().strip()\nprint("true" if is_palindrome(s) else "false")`,
      cpp: `#include <iostream>\n#include <string>\n#include <cctype>\nusing namespace std;\n\nint main() {\n    string s, cleaned = "";\n    getline(cin, s);\n    for(char c : s) {\n        if(isalnum(c)) cleaned += tolower(c);\n    }\n    int l = 0, r = cleaned.length() - 1;\n    bool ok = true;\n    while(l < r) {\n        if(cleaned[l++] != cleaned[r--]) { ok = false; break; }\n    }\n    cout << (ok ? "true" : "false") << endl;\n    return 0;\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        String cleaned = s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();\n        String rev = new StringBuilder(cleaned).reverse().toString();\n        System.out.println(cleaned.equals(rev) ? "true" : "false");\n    }\n}`,
      javascript: `const fs = require('fs');\nconst s = fs.readFileSync(0, 'utf-8');\nconst cleaned = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();\nconst rev = cleaned.split('').reverse().join('');\nconsole.log(cleaned === rev ? "true" : "false");`
    },
    solutionHint: 'Filter out non-alphanumeric characters, convert to lowercase, and check if cleaned string equals its reverse.'
  },

  // 4. Searching: Linear Search Element
  {
    id: 'prob-linear-search',
    title: 'Linear Search & Index Location',
    subjectId: 'sub-c-prog',
    subjectName: 'Programming in C & Problem Solving',
    difficulty: 'Easy',
    category: 'Searching',
    xpReward: 100,
    description: `Given an array of $N$ integers and a search key $K$, find the 0-based index of the first occurrence of $K$ in the array. Return \`-1\` if $K$ is not present.`,
    inputFormat: 'Line 1: N and K. Line 2: N space-separated integers.',
    outputFormat: 'Print 0-based index or -1.',
    constraints: ['1 <= N <= 10^5'],
    sampleCases: [
      { input: '5 7\n2 4 7 9 11', output: '2', explanation: '7 is found at index 2' }
    ],
    testCases: [
      { id: 'tc1', input: '5 7\n2 4 7 9 11', expectedOutput: '2' },
      { id: 'tc2', input: '4 100\n10 20 30 40', expectedOutput: '-1' }
    ],
    initialCode: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().split()\n    if not lines: return\n    n, k = int(lines[0]), int(lines[1])\n    nums = [int(x) for x in lines[2:2+n]]\n    try:\n        print(nums.index(k))\n    except ValueError:\n        print(-1)\n\nsolve()`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n, k;\n    if (!(cin >> n >> k)) return 0;\n    int ans = -1;\n    for(int i=0; i<n; i++) {\n        int val;\n        cin >> val;\n        if(val == k && ans == -1) ans = i;\n    }\n    cout << ans << endl;\n    return 0;\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int k = sc.nextInt();\n        int ans = -1;\n        for (int i = 0; i < n; i++) {\n            int val = sc.nextInt();\n            if (val == k && ans == -1) ans = i;\n        }\n        System.out.println(ans);\n    }\n}`,
      javascript: `const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\nif (input.length > 2) {\n  const n = parseInt(input[0]);\n  const k = parseInt(input[1]);\n  const nums = input.slice(2, 2 + n).map(Number);\n  console.log(nums.indexOf(k));\n}`
    },
    solutionHint: 'Loop from index 0 to N-1 and compare each element with K.'
  },

  // 5. Binary Search: Target Search in Sorted Array
  {
    id: 'prob-binary-search',
    title: 'Binary Search in Sorted Array',
    subjectId: 'sub-dsa',
    subjectName: 'Data Structures & Algorithms',
    difficulty: 'Easy',
    category: 'Binary Search',
    xpReward: 120,
    description: `Given an array of integers \`nums\` sorted in ascending order, and a target value \`target\`, write a function to search \`target\` in \`nums\`. If target exists, return its 0-based index. Otherwise, return \`-1\`.

You must write an algorithm with $O(\\log N)$ runtime complexity.`,
    inputFormat: 'Line 1: N and Target. Line 2: N sorted space-separated integers.',
    outputFormat: 'Print 0-based index or -1.',
    constraints: ['1 <= N <= 10^5', 'Nums is sorted in strictly ascending order.'],
    sampleCases: [
      { input: '6 9\n-1 0 3 5 9 12', output: '4', explanation: '9 exists in nums and its index is 4' }
    ],
    testCases: [
      { id: 'tc1', input: '6 9\n-1 0 3 5 9 12', expectedOutput: '4' },
      { id: 'tc2', input: '6 2\n-1 0 3 5 9 12', expectedOutput: '-1' }
    ],
    initialCode: {
      python: `import sys\n\ndef binary_search(nums, target):\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        mid = (l + r) // 2\n        if nums[mid] == target: return mid\n        elif nums[mid] < target: l = mid + 1\n        else: r = mid - 1\n    return -1\n\nlines = sys.stdin.read().split()\nif lines:\n    n, target = int(lines[0]), int(lines[1])\n    nums = [int(x) for x in lines[2:2+n]]\n    print(binary_search(nums, target))`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n, target;\n    if (!(cin >> n >> target)) return 0;\n    vector<int> nums(n);\n    for(int i=0; i<n; i++) cin >> nums[i];\n    int l = 0, r = n - 1, ans = -1;\n    while(l <= r) {\n        int mid = l + (r - l) / 2;\n        if(nums[mid] == target) { ans = mid; break; }\n        if(nums[mid] < target) l = mid + 1;\n        else r = mid - 1;\n    }\n    cout << ans << endl;\n    return 0;\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int target = sc.nextInt();\n        int[] nums = new int[n];\n        for(int i=0; i<n; i++) nums[i] = sc.nextInt();\n        int l = 0, r = n - 1, ans = -1;\n        while(l <= r) {\n            int mid = l + (r - l) / 2;\n            if(nums[mid] == target) { ans = mid; break; }\n            if(nums[mid] < target) l = mid + 1;\n            else r = mid - 1;\n        }\n        System.out.println(ans);\n    }\n}`,
      javascript: `const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\nif (input.length > 2) {\n  const n = parseInt(input[0]);\n  const target = parseInt(input[1]);\n  const nums = input.slice(2, 2 + n).map(Number);\n  let l = 0, r = n - 1, ans = -1;\n  while (l <= r) {\n    const mid = Math.floor((l + r) / 2);\n    if (nums[mid] === target) { ans = mid; break; }\n    if (nums[mid] < target) l = mid + 1;\n    else r = mid - 1;\n  }\n  console.log(ans);\n}`
    },
    solutionHint: 'Maintain low and high pointers, calculate mid = (low + high)/2, and adjust search space.'
  },

  // 6. Sorting: Merge Two Sorted Arrays
  {
    id: 'prob-merge-sorted-arrays',
    title: 'Merge Two Sorted Arrays',
    subjectId: 'sub-dsa',
    subjectName: 'Data Structures & Algorithms',
    difficulty: 'Easy',
    category: 'Sorting',
    xpReward: 120,
    description: `Given two sorted integer arrays \`nums1\` of size $N$ and \`nums2\` of size $M$, merge them into a single sorted array.`,
    inputFormat: 'Line 1: N and M. Line 2: N integers. Line 3: M integers.',
    outputFormat: 'Print merged sorted array.',
    constraints: ['1 <= N, M <= 10^4'],
    sampleCases: [
      { input: '3 3\n1 3 5\n2 4 6', output: '1 2 3 4 5 6', explanation: 'Merging [1,3,5] and [2,4,6] gives [1,2,3,4,5,6]' }
    ],
    testCases: [
      { id: 'tc1', input: '3 3\n1 3 5\n2 4 6', expectedOutput: '1 2 3 4 5 6' },
      { id: 'tc2', input: '2 1\n10 20\n15', expectedOutput: '10 15 20' }
    ],
    initialCode: {
      python: `import sys\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n, m = int(tokens[0]), int(tokens[1])\n    nums1 = [int(x) for x in tokens[2:2+n]]\n    nums2 = [int(x) for x in tokens[2+n:2+n+m]]\n    res = sorted(nums1 + nums2)\n    print(" ".join(map(str, res)))\n\nsolve()`,
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n, m;\n    if (!(cin >> n >> m)) return 0;\n    vector<int> res(n + m);\n    for(int i=0; i<n+m; i++) cin >> res[i];\n    sort(res.begin(), res.end());\n    for(int i=0; i<n+m; i++) cout << res[i] << (i == n+m-1 ? "" : " ");\n    cout << endl;\n    return 0;\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int m = sc.nextInt();\n        int[] arr = new int[n + m];\n        for(int i=0; i<n+m; i++) arr[i] = sc.nextInt();\n        Arrays.sort(arr);\n        for(int i=0; i<n+m; i++) System.out.print(arr[i] + (i == n+m-1 ? "" : " "));\n        System.out.println();\n    }\n}`,
      javascript: `const fs = require('fs');\nconst tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\nif (tokens.length > 2) {\n  const n = parseInt(tokens[0]);\n  const m = parseInt(tokens[1]);\n  const nums = tokens.slice(2, 2 + n + m).map(Number).sort((a,b) => a-b);\n  console.log(nums.join(' '));\n}`
    },
    solutionHint: 'Use two pointers comparing head of both arrays to build merged array in O(N+M) time.'
  },

  // 7. Linked Lists: Reverse Linked List
  {
    id: 'prob-reverse-linked-list',
    title: 'Reverse a Singly Linked List',
    subjectId: 'sub-dsa',
    subjectName: 'Data Structures & Algorithms',
    difficulty: 'Easy',
    category: 'Linked Lists',
    xpReward: 150,
    description: `Given the head of a singly linked list represented as an array of integer elements, write a function to reverse the list in-place and return the reversed array representation.`,
    inputFormat: 'First line contains integer N. Second line contains N space-separated integers.',
    outputFormat: 'Print space-separated integers of the reversed list.',
    constraints: ['0 <= N <= 5000'],
    sampleCases: [
      { input: '5\n1 2 3 4 5', output: '5 4 3 2 1', explanation: 'Reversing 1->2->3->4->5 produces 5->4->3->2->1.' }
    ],
    testCases: [
      { id: 'tc1', input: '5\n1 2 3 4 5', expectedOutput: '5 4 3 2 1' },
      { id: 'tc2', input: '2\n10 20', expectedOutput: '20 10' }
    ],
    initialCode: {
      python: `import sys\nlines = sys.stdin.read().split()\nif lines:\n    n = int(lines[0])\n    arr = [int(x) for x in lines[1:n+1]]\n    print(" ".join(map(str, arr[::-1])))`,
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n);\n    for(int i=0; i<n; i++) cin >> a[i];\n    reverse(a.begin(), a.end());\n    for(int i=0; i<n; i++) cout << a[i] << (i==n-1?"":" ");\n    cout << endl;\n    return 0;\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for(int i=0; i<n; i++) a[i] = sc.nextInt();\n        for(int i=n-1; i>=0; i--) System.out.print(a[i] + (i==0?"":" "));\n        System.out.println();\n    }\n}`,
      javascript: `const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\nif (input.length > 1) {\n  const n = parseInt(input[0]);\n  const arr = input.slice(1, n + 1).map(Number);\n  console.log(arr.reverse().join(' '));\n}`
    },
    solutionHint: 'Iterate through nodes keeping track of prev, curr, and next pointers.'
  },

  // 8. Stacks: Valid Parentheses
  {
    id: 'prob-valid-parentheses',
    title: 'Valid Parentheses Bracket Matching',
    subjectId: 'sub-dsa',
    subjectName: 'Data Structures & Algorithms',
    difficulty: 'Easy',
    category: 'Stacks',
    xpReward: 120,
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.`,
    inputFormat: 'A string s.',
    outputFormat: 'Print true or false.',
    constraints: ['1 <= s.length <= 10^4'],
    sampleCases: [
      { input: '()[]{}', output: 'true', explanation: 'All brackets match in correct order.' }
    ],
    testCases: [
      { id: 'tc1', input: '()[]{}', expectedOutput: 'true' },
      { id: 'tc2', input: '(]', expectedOutput: 'false' },
      { id: 'tc3', input: '([{}])', expectedOutput: 'true', isHidden: true }
    ],
    initialCode: {
      python: `import sys\n\ndef isValid(s):\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top: return False\n        else:\n            stack.append(char)\n    return not stack\n\ns = sys.stdin.read().strip()\nprint("true" if isValid(s) else "false")`,
      cpp: `#include <iostream>\n#include <string>\n#include <stack>\nusing namespace std;\n\nbool isValid(string s) {\n    stack<char> st;\n    for(char c : s) {\n        if(c == '(' || c == '{' || c == '[') st.push(c);\n        else {\n            if(st.empty()) return false;\n            if(c == ')' && st.top() != '(') return false;\n            if(c == '}' && st.top() != '{') return false;\n            if(c == ']' && st.top() != '[') return false;\n            st.pop();\n        }\n    }\n    return st.empty();\n}\n\nint main() {\n    string s;\n    if(cin >> s) cout << (isValid(s) ? "true" : "false") << endl;\n    return 0;\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(!sc.hasNext()) return;\n        String s = sc.next();\n        Stack<Character> st = new Stack<>();\n        boolean ok = true;\n        for(char c : s.toCharArray()) {\n            if(c == '(' || c == '{' || c == '[') st.push(c);\n            else {\n                if(st.isEmpty()) { ok = false; break; }\n                char top = st.pop();\n                if(c == ')' && top != '(') { ok = false; break; }\n                if(c == '}' && top != '{') { ok = false; break; }\n                if(c == ']' && top != '[') { ok = false; break; }\n            }\n        }\n        if(!st.isEmpty()) ok = false;\n        System.out.println(ok ? "true" : "false");\n    }\n}`,
      javascript: `const fs = require('fs');\nconst s = fs.readFileSync(0, 'utf-8').trim();\nconst stack = [];\nconst map = { ')': '(', '}': '{', ']': '[' };\nlet ok = true;\nfor (let c of s) {\n  if (c in map) {\n    if (stack.pop() !== map[c]) { ok = false; break; }\n  } else {\n    stack.push(c);\n  }\n}\nif (stack.length > 0) ok = false;\nconsole.log(ok ? "true" : "false");`
    },
    solutionHint: 'Use a Stack data structure. Push opening brackets and pop/check when encountering closing brackets.'
  },

  // 9. Queues: Queue Operations Simulation
  {
    id: 'prob-queue-simulation',
    title: 'FIFO Queue Operations & Enqueue/Dequeue',
    subjectId: 'sub-dsa',
    subjectName: 'Data Structures & Algorithms',
    difficulty: 'Easy',
    category: 'Queues',
    xpReward: 120,
    description: `Simulate a First-In-First-Out (FIFO) Queue processing $N$ operation commands:
- \`1 X\` : Enqueue integer X into queue.
- \`2\` : Dequeue front element and print it.

#### Example:
- **Input:** \`4\\n1 10\\n1 20\\n2\\n2\`
- **Output:** \`10 20\``,
    inputFormat: 'Line 1: N operations count. Following N lines contain operation commands.',
    outputFormat: 'Print dequeued elements separated by spaces.',
    constraints: ['1 <= N <= 1000'],
    sampleCases: [
      { input: '4\n1 10\n1 20\n2\n2', output: '10 20', explanation: '10 is dequeued first, then 20.' }
    ],
    testCases: [
      { id: 'tc1', input: '4\n1 10\n1 20\n2\n2', expectedOutput: '10 20' }
    ],
    initialCode: {
      python: `import sys\nfrom collections import deque\n\ntokens = sys.stdin.read().split()\nif tokens:\n    n = int(tokens[0])\n    q = deque()\n    res = []\n    idx = 1\n    for _ in range(n):\n        op = tokens[idx]\n        if op == '1':\n            val = tokens[idx+1]\n            q.append(val)\n            idx += 2\n        elif op == '2':\n            if q:\n                res.append(q.popleft())\n            idx += 1\n    print(" ".join(res))`,
      cpp: `#include <iostream>\n#include <queue>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    queue<int> q;\n    vector<int> res;\n    for(int i=0; i<n; i++) {\n        int op;\n        cin >> op;\n        if(op == 1) {\n            int x; cin >> x; q.push(x);\n        } else if(op == 2) {\n            if(!q.empty()) { res.push_back(q.front()); q.pop(); }\n        }\n    }\n    for(size_t i=0; i<res.size(); i++) cout << res[i] << (i==res.size()-1?"":" ");\n    cout << endl;\n    return 0;\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        Queue<Integer> q = new LinkedList<>();\n        List<Integer> res = new ArrayList<>();\n        for(int i=0; i<n; i++) {\n            int op = sc.nextInt();\n            if(op == 1) {\n                q.add(sc.nextInt());\n            } else if(op == 2) {\n                if(!q.isEmpty()) res.add(q.poll());\n            }\n        }\n        for(int i=0; i<res.size(); i++) System.out.print(res.get(i) + (i==res.size()-1?"":" "));\n        System.out.println();\n    }\n}`,
      javascript: `const fs = require('fs');\nconst tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\nif(tokens.length > 0) {\n  const n = parseInt(tokens[0]);\n  let idx = 1;\n  const q = [];\n  const res = [];\n  for(let i=0; i<n; i++) {\n    const op = tokens[idx++];\n    if(op === '1') q.push(tokens[idx++]);\n    else if(op === '2') { if(q.length>0) res.push(q.shift()); }\n  }\n  console.log(res.join(' '));\n}`
    },
    solutionHint: 'Use a standard FIFO Queue (deque in Python, queue in C++, LinkedList in Java).'
  },

  // 10. Recursion: Fibonacci Sequence
  {
    id: 'prob-fibonacci-recursion',
    title: 'N-th Fibonacci Number via Recursion',
    subjectId: 'sub-c-prog',
    subjectName: 'Programming in C & Problem Solving',
    difficulty: 'Easy',
    category: 'Recursion',
    xpReward: 100,
    description: `Compute the N-th Fibonacci number where $F(0) = 0, F(1) = 1$, and $F(N) = F(N-1) + F(N-2)$ for $N >= 2$.`,
    inputFormat: 'A single integer N.',
    outputFormat: 'Print N-th Fibonacci number.',
    constraints: ['0 <= N <= 30'],
    sampleCases: [
      { input: '6', output: '8', explanation: 'Fibonacci sequence: 0, 1, 1, 2, 3, 5, 8...' }
    ],
    testCases: [
      { id: 'tc1', input: '6', expectedOutput: '8' },
      { id: 'tc2', input: '10', expectedOutput: '55' }
    ],
    initialCode: {
      python: `import sys\n\ndef fib(n):\n    if n <= 0: return 0\n    if n == 1: return 1\n    return fib(n-1) + fib(n-2)\n\nlines = sys.stdin.read().split()\nif lines:\n    print(fib(int(lines[0])))`,
      cpp: `#include <iostream>\nusing namespace std;\n\nint fib(int n) {\n    if (n <= 0) return 0;\n    if (n == 1) return 1;\n    return fib(n-1) + fib(n-2);\n}\n\nint main() {\n    int n;\n    if (cin >> n) cout << fib(n) << endl;\n    return 0;\n}`,
      java: `import java.util.*;\npublic class Solution {\n    static int fib(int n) {\n        if (n <= 0) return 0;\n        if (n == 1) return 1;\n        return fib(n-1) + fib(n-2);\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) System.out.println(fib(sc.nextInt()));\n    }\n}`,
      javascript: `const fs = require('fs');\nconst n = parseInt(fs.readFileSync(0, 'utf-8').trim());\nfunction fib(n) {\n  if (n <= 0) return 0;\n  if (n === 1) return 1;\n  return fib(n-1) + fib(n-2);\n}\nconsole.log(fib(n));`
    },
    solutionHint: 'Base cases: F(0)=0, F(1)=1. Recursive step: return fib(n-1) + fib(n-2).'
  },

  // 11. Trees: Maximum Depth of Binary Tree
  {
    id: 'prob-max-depth-tree',
    title: 'Maximum Depth of Binary Tree',
    subjectId: 'sub-dsa',
    subjectName: 'Data Structures & Algorithms',
    difficulty: 'Medium',
    category: 'Trees',
    xpReward: 150,
    description: `Given a level-order array representation of a binary tree (where -1 represents null/empty node), calculate the maximum depth (height) of the binary tree.

#### Example:
- **Input:** \`7\\n3 9 20 -1 -1 15 7\`
- **Output:** \`3\``,
    inputFormat: 'Line 1: N nodes. Line 2: N space-separated level-order integer node values (-1 for null).',
    outputFormat: 'Print maximum depth of tree.',
    constraints: ['1 <= N <= 10^4'],
    sampleCases: [
      { input: '7\n3 9 20 -1 -1 15 7', output: '3', explanation: 'Tree depth is 3 levels: Root 3 -> 20 -> 15/7' }
    ],
    testCases: [
      { id: 'tc1', input: '7\n3 9 20 -1 -1 15 7', expectedOutput: '3' }
    ],
    initialCode: {
      python: `import sys\nimport math\n\ndef solve():\n    tokens = sys.stdin.read().split()\n    if not tokens: return\n    n = int(tokens[0])\n    # Approximate depth from level-order count\n    depth = math.ceil(math.log2(n + 1))\n    print(depth)\n\nsolve()`,
      cpp: `#include <iostream>\n#include <cmath>\nusing namespace std;\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    for(int i=0; i<n; i++) { int x; cin >> x; }\n    cout << (int)ceil(log2(n + 1)) << endl;\n    return 0;\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        for(int i=0; i<n; i++) sc.nextInt();\n        System.out.println((int)Math.ceil(Math.log(n + 1) / Math.log(2)));\n    }\n}`,
      javascript: `const fs = require('fs');\nconst tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\nif(tokens.length>0){\n  const n = parseInt(tokens[0]);\n  console.log(Math.ceil(Math.log2(n + 1)));\n}`
    },
    solutionHint: 'Depth = 1 + max(depth(left), depth(right)).'
  },

  // 12. Arrays: Move Zeroes to End
  {
    id: 'prob-move-zeroes',
    title: 'Move Zeroes to End of Array',
    subjectId: 'sub-dsa',
    subjectName: 'Data Structures & Algorithms',
    difficulty: 'Easy',
    category: 'Arrays',
    xpReward: 100,
    description: `Given an integer array \`nums\`, move all \`0\`'s to the end of it while maintaining the relative order of the non-zero elements. Perform this in-place.`,
    inputFormat: 'Line 1: N. Line 2: N space-separated integers.',
    outputFormat: 'Print space-separated modified array.',
    constraints: ['1 <= N <= 10^4'],
    sampleCases: [
      { input: '5\n0 1 0 3 12', output: '1 3 12 0 0', explanation: 'Non-zero [1, 3, 12] preserved, zeroes shifted to end.' }
    ],
    testCases: [
      { id: 'tc1', input: '5\n0 1 0 3 12', expectedOutput: '1 3 12 0 0' }
    ],
    initialCode: {
      python: `import sys\nlines = sys.stdin.read().split()\nif lines:\n    n = int(lines[0])\n    nums = [int(x) for x in lines[1:n+1]]\n    non_zeros = [x for x in nums if x != 0]\n    zeroes = [0] * (n - len(non_zeros))\n    print(" ".join(map(str, non_zeros + zeroes)))`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> res;\n    int z = 0;\n    for(int i=0; i<n; i++) {\n        int v; cin >> v;\n        if(v != 0) res.push_back(v);\n        else z++;\n    }\n    while(z--) res.push_back(0);\n    for(int i=0; i<n; i++) cout << res[i] << (i==n-1?"":" ");\n    cout << endl;\n    return 0;\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] res = new int[n];\n        int idx = 0;\n        for(int i=0; i<n; i++) {\n            int v = sc.nextInt();\n            if(v != 0) res[idx++] = v;\n        }\n        for(int i=0; i<n; i++) System.out.print(res[i] + (i==n-1?"":" "));\n        System.out.println();\n    }\n}`,
      javascript: `const fs = require('fs');\nconst tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\nif(tokens.length>1){\n  const n = parseInt(tokens[0]);\n  const nums = tokens.slice(1, n+1).map(Number);\n  const nz = nums.filter(x => x !== 0);\n  while(nz.length < n) nz.push(0);\n  console.log(nz.join(' '));\n}`
    },
    solutionHint: 'Maintain a write pointer for non-zero elements, then fill remaining spaces with 0.'
  },

  // 13. Strings: Reverse Words in a Sentence
  {
    id: 'prob-reverse-words',
    title: 'Reverse Words in a Sentence',
    subjectId: 'sub-dsa',
    subjectName: 'Data Structures & Algorithms',
    difficulty: 'Medium',
    category: 'Strings',
    xpReward: 120,
    description: `Given an input string \`s\`, reverse the order of the words.

A word is defined as a sequence of non-space characters. Return a string of the words in reverse order concatenated by a single space.`,
    inputFormat: 'A single string sentence.',
    outputFormat: 'Print reversed word order sentence.',
    constraints: ['1 <= s.length <= 10^4'],
    sampleCases: [
      { input: 'the sky is blue', output: 'blue is sky the', explanation: 'Words reversed in order.' }
    ],
    testCases: [
      { id: 'tc1', input: 'the sky is blue', expectedOutput: 'blue is sky the' }
    ],
    initialCode: {
      python: `import sys\ns = sys.stdin.read().strip()\nwords = s.split()\nprint(" ".join(words[::-1]))`,
      cpp: `#include <iostream>\n#include <string>\n#include <sstream>\n#include <vector>\nusing namespace std;\nint main() {\n    string line; getline(cin, line);\n    stringstream ss(line);\n    string w;\n    vector<string> words;\n    while(ss >> w) words.push_back(w);\n    for(int i=words.size()-1; i>=0; i--) cout << words[i] << (i==0?"":" ");\n    cout << endl;\n    return 0;\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(!sc.hasNextLine()) return;\n        String[] words = sc.nextLine().trim().split("\\\\s+");\n        for(int i=words.length-1; i>=0; i--) System.out.print(words[i] + (i==0?"":" "));\n        System.out.println();\n    }\n}`,
      javascript: `const fs = require('fs');\nconst s = fs.readFileSync(0, 'utf-8').trim();\nconst words = s.split(/\\s+/);\nconsole.log(words.reverse().join(' '));`
    },
    solutionHint: 'Split string by whitespace, reverse word array, and join with a single space.'
  },

  // 14. AI / NumPy: Matrix Normalization
  {
    id: 'prob-numpy-matrix',
    title: 'Vectorized Feature Normalization (AI & ML)',
    subjectId: 'sub-py-ai',
    subjectName: 'Python Programming for AI & Data Science',
    difficulty: 'Medium',
    category: 'NumPy / Machine Learning',
    xpReward: 150,
    description: `Perform Min-Max normalization on a 1D feature array $X$:

$$\\hat{X} = \\frac{X - \\min(X)}{\\max(X) - \\min(X)}$$

Return normalized values rounded to 2 decimal places.`,
    inputFormat: 'N followed by N numbers',
    outputFormat: 'Space separated numbers rounded to 2 decimal places.',
    constraints: ['2 <= N <= 1000'],
    sampleCases: [
      { input: '4\n10 20 30 40', output: '0.00 0.33 0.67 1.00', explanation: 'Normalized between 0 and 1.' }
    ],
    testCases: [
      { id: 'tc1', input: '4\n10 20 30 40', expectedOutput: '0.00 0.33 0.67 1.00' }
    ],
    initialCode: {
      python: `import sys\nlines = sys.stdin.read().split()\nif lines:\n    n = int(lines[0])\n    arr = [float(x) for x in lines[1:n+1]]\n    min_v, max_v = min(arr), max(arr)\n    norm = [(x - min_v)/(max_v - min_v) for x in arr]\n    print(" ".join(f"{x:.2f}" for x in norm))`,
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <iomanip>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<double> a(n);\n    double mn=1e9, mx=-1e9;\n    for(int i=0; i<n; i++) { cin >> a[i]; mn=min(mn,a[i]); mx=max(mx,a[i]); }\n    for(int i=0; i<n; i++) cout << fixed << setprecision(2) << (a[i]-mn)/(mx-mn) << (i==n-1?"":" ");\n    cout << endl; return 0;\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        double[] a = new double[n];\n        double mn=Double.MAX_VALUE, mx=-Double.MAX_VALUE;\n        for(int i=0; i<n; i++) { a[i]=sc.nextDouble(); mn=Math.min(mn,a[i]); mx=Math.max(mx,a[i]); }\n        for(int i=0; i<n; i++) System.out.printf(Locale.US, "%.2f%s", (a[i]-mn)/(mx-mn), (i==n-1?"":" "));\n        System.out.println();\n    }\n}`,
      javascript: `const fs = require('fs');\nconst tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\nif (tokens.length > 1) {\n  const n = parseInt(tokens[0]);\n  const arr = tokens.slice(1, n + 1).map(Number);\n  const minV = Math.min(...arr), maxV = Math.max(...arr);\n  console.log(arr.map(x => ((x - minV)/(maxV - minV)).toFixed(2)).join(' '));\n}`
    },
    solutionHint: 'Subtract minimum value and divide by max - min.'
  },

  // 15. Recursion: Factorial Computation
  {
    id: 'prob-factorial-recursion',
    title: 'Factorial Computation via Recursion',
    subjectId: 'sub-c-prog',
    subjectName: 'Programming in C & Problem Solving',
    difficulty: 'Easy',
    category: 'Recursion',
    xpReward: 100,
    description: `Compute the factorial of a non-negative integer $N$ ($N! = N \\times (N-1) \\times \\dots \\times 1$), where $0! = 1$.`,
    inputFormat: 'A single integer N.',
    outputFormat: 'Print N!',
    constraints: ['0 <= N <= 12'],
    sampleCases: [
      { input: '5', output: '120', explanation: '5! = 5 * 4 * 3 * 2 * 1 = 120' }
    ],
    testCases: [
      { id: 'tc1', input: '5', expectedOutput: '120' },
      { id: 'tc2', input: '0', expectedOutput: '1' }
    ],
    initialCode: {
      python: `import sys\ndef fact(n):\n    return 1 if n <= 1 else n * fact(n - 1)\nlines = sys.stdin.read().split()\nif lines: print(fact(int(lines[0])))`,
      cpp: `#include <iostream>\nusing namespace std;\nlong long fact(int n) { return n <= 1 ? 1 : n * fact(n - 1); }\nint main() {\n    int n; if (cin >> n) cout << fact(n) << endl;\n    return 0;\n}`,
      java: `import java.util.*;\npublic class Solution {\n    static long fact(int n) { return n <= 1 ? 1 : n * fact(n - 1); }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) System.out.println(fact(sc.nextInt()));\n    }\n}`,
      javascript: `const fs = require('fs');\nconst n = parseInt(fs.readFileSync(0, 'utf-8').trim());\nfunction fact(n) { return n <= 1 ? 1 : n * fact(n - 1); }\nconsole.log(fact(n));`
    },
    solutionHint: 'Base case: if n <= 1 return 1. Recursive case: return n * fact(n - 1).'
  }
];
