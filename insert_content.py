#!/usr/bin/env python3
"""
Script to insert index.html main content into program pages after Hero section
"""

import re

# Read the backup index.html
with open('index_backup.html', 'r', encoding='utf-8') as f:
    backup_content = f.read()

# Extract only the main content sections (Hero to Consultation CTA)
# Find the start: after header closing tag and hero opening
start_pattern = r'<!-- Hero Section -->.*?</section>'
end_pattern = r'<!-- Consultation CTA Section -->.*?</section>'

start_match = re.search(start_pattern, backup_content, re.DOTALL)
end_match = re.search(end_pattern, backup_content, re.DOTALL)

if start_match and end_match:
    # Extract content from Hero to Consultation CTA (inclusive)
    content_to_insert = backup_content[start_match.start():end_match.end()]
    print(f"Extracted {len(content_to_insert)} characters to insert")

    # List of program files to update
    program_files = [
        'program-job-leave.html',
        'program-admission.html',
        'program-employment.html',
        'program-startup.html'
    ]

    for filename in program_files:
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                file_content = f.read()

            # Find the end of the Hero section
            # Look for the first closing </section> after "Hero Section" or "program-hero"
            hero_pattern = r'(<!-- Hero Section -->.*?</section>)'
            hero_match = re.search(hero_pattern, file_content, re.DOTALL)

            if hero_match:
                # Insert content after Hero section
                insert_position = hero_match.end()
                new_content = (
                    file_content[:insert_position] +
                    '\n\n    ' + content_to_insert + '\n\n    ' +
                    file_content[insert_position:]
                )

                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"✓ Updated {filename}")
            else:
                print(f"✗ Could not find Hero section in {filename}")

        except FileNotFoundError:
            print(f"✗ File not found: {filename}")
        except Exception as e:
            print(f"✗ Error processing {filename}: {e}")
else:
    print("Could not extract content from backup file")
