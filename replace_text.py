#!/usr/bin/env python3
"""
Script to replace '커리어브릿지' with '컨설팅프로' in all HTML files
"""

import glob
import os

# Find all HTML files
html_files = glob.glob('*.html')

total_replacements = 0

for filename in html_files:
    try:
        # Read the file
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()

        # Count occurrences before replacement
        count = content.count('커리어브릿지')

        if count > 0:
            # Replace all occurrences
            new_content = content.replace('커리어브릿지', '컨설팅프로')

            # Write back to file
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(new_content)

            total_replacements += count
            print(f"✓ {filename}: {count} replacements")
        else:
            print(f"- {filename}: no matches")

    except Exception as e:
        print(f"✗ Error processing {filename}: {e}")

print(f"\nTotal replacements: {total_replacements}")
