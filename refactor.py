import os
import shutil

base_dir = r"E:\DSA3\Project"
src_base = os.path.join(base_dir, "src", "com", "finserve")

# Create module directories
for i in range(1, 7):
    mod_dir = os.path.join(src_base, f"module{i}")
    os.makedirs(os.path.join(mod_dir, "algorithms"), exist_ok=True)
    os.makedirs(os.path.join(mod_dir, "service"), exist_ok=True)
    os.makedirs(os.path.join(mod_dir, "tests"), exist_ok=True)

# Create doc directories
docs_dir = os.path.join(base_dir, "docs")
doc_folders = [
    "M1_String_Algorithms",
    "M2_Suffix_Structures",
    "M3_Advanced_DP",
    "M4_Network_Flow",
    "M5_NP_Completeness",
    "M6_Randomized_Parallel"
]
for folder in doc_folders:
    os.makedirs(os.path.join(docs_dir, folder), exist_ok=True)

# Move docs
if os.path.exists(os.path.join(base_dir, "Module1_Documentation.md")):
    shutil.move(os.path.join(base_dir, "Module1_Documentation.md"), os.path.join(docs_dir, "M1_String_Algorithms", "Module1_Documentation.md"))
if os.path.exists(os.path.join(base_dir, "Module2_Documentation.md")):
    shutil.move(os.path.join(base_dir, "Module2_Documentation.md"), os.path.join(docs_dir, "M2_Suffix_Structures", "Module2_Documentation.md"))

# Move files to Module 1
m1_files = {
    "algorithms": ["KMP.java", "ZFunction.java", "RabinKarp.java", "AhoCorasick.java"],
    "service": ["StringAnalyticsService.java"],
    "tests": ["AlgorithmTests.java"]
}

for folder, files in m1_files.items():
    for f in files:
        src = os.path.join(src_base, folder, f)
        if os.path.exists(src):
            dst = os.path.join(src_base, "module1", folder, f)
            shutil.move(src, dst)

if os.path.exists(os.path.join(src_base, "Demo.java")):
    shutil.move(os.path.join(src_base, "Demo.java"), os.path.join(src_base, "module1", "Demo.java"))

# Move files to Module 2
m2_files = {
    "algorithms": ["SuffixArray.java", "SAIS.java", "LCPKasai.java", "SuffixTree.java", "SuffixAutomaton.java"],
    "service": ["SuffixAnalyticsService.java"],
    "tests": ["SuffixStructureTests.java"]
}

for folder, files in m2_files.items():
    for f in files:
        src = os.path.join(src_base, folder, f)
        if os.path.exists(src):
            dst = os.path.join(src_base, "module2", folder, f)
            shutil.move(src, dst)

if os.path.exists(os.path.join(src_base, "SuffixDemo.java")):
    shutil.move(os.path.join(src_base, "SuffixDemo.java"), os.path.join(src_base, "module2", "Demo.java"))

# Update package and imports in Module 1
def replace_in_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    for old, new in replacements:
        content = content.replace(old, new)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, _, files in os.walk(os.path.join(src_base, "module1")):
    for f in files:
        if f.endswith(".java"):
            path = os.path.join(root, f)
            replacements = [
                ("package com.finserve.algorithms;", "package com.finserve.module1.algorithms;"),
                ("package com.finserve.service;", "package com.finserve.module1.service;"),
                ("package com.finserve.tests;", "package com.finserve.module1.tests;"),
                ("package com.finserve;", "package com.finserve.module1;"),
                ("import com.finserve.algorithms", "import com.finserve.module1.algorithms"),
                ("import com.finserve.service", "import com.finserve.module1.service")
            ]
            replace_in_file(path, replacements)

# Update package and imports in Module 2
for root, _, files in os.walk(os.path.join(src_base, "module2")):
    for f in files:
        if f.endswith(".java"):
            path = os.path.join(root, f)
            replacements = [
                ("package com.finserve.algorithms;", "package com.finserve.module2.algorithms;"),
                ("package com.finserve.service;", "package com.finserve.module2.service;"),
                ("package com.finserve.tests;", "package com.finserve.module2.tests;"),
                ("package com.finserve;", "package com.finserve.module2;"),
                ("import com.finserve.algorithms", "import com.finserve.module2.algorithms"),
                ("import com.finserve.service", "import com.finserve.module2.service")
            ]
            replace_in_file(path, replacements)
