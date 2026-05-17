import sys

file_path = r'd:\BIOINFO - PROJECTS\REACT\Probiotic app\probiotic-meal-scan\app\page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace import URL
content = content.replace(
    "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap');",
    "@import url('https://fonts.googleapis.com/css2?family=Rozha+One&family=Montserrat:wght@400;500;600;700&display=swap');"
)

# Replace font families
content = content.replace("'Playfair Display', serif", "'Rozha One', serif")
content = content.replace("'Inter', sans-serif", "'Montserrat', sans-serif")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated fonts to Rozha One and Montserrat')
