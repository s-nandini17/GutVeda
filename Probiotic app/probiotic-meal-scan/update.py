import sys
import io

file_path = r'd:\BIOINFO - PROJECTS\REACT\Probiotic app\probiotic-meal-scan\app\page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace fonts
content = content.replace(
    "url('https://fonts.google.com/specimen/Felipa?categoryFilters=Feeling:%2FExpressive%2FSophisticated');", 
    "url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap');"
)

content = content.replace("'Felipa', sans-serif", "'Inter', sans-serif")
content = content.replace("'Felipa', cursive", "'Inter', sans-serif")
content = content.replace("'Cinzel Decorative', serif", "'Playfair Display', serif")
content = content.replace("'Pacifico', cursive", "'Inter', sans-serif")
content = content.replace("'Poppins', sans-serif", "'Inter', sans-serif")
content = content.replace("'Cinzel', serif", "'Playfair Display', serif")
content = content.replace("'Felipa',", "'Inter',")

# Replace remaining slang
content = content.replace("bestie!", "!")
content = content.replace("bestie", "")
content = content.replace("rn", "right now")
content = content.replace("fr fr", "truly")
content = content.replace("slay", "enhance")
content = content.replace("no meals logged yet ! go scan something 🍛", "No meals logged yet! Start by scanning a meal. 🍛")
content = content.replace("ur gut is in its MAIN CHARACTER ERA 👑", "Your gut is in its Optimal Health Zone 👑")
content = content.replace("ur gut needs some love right now — let's fix it! 🫶", "Your gut needs some attention — let's fix it! 🫶")
content = content.replace("loading ur gut … 🦠✨", "Loading your profile... 🦠✨")
content = content.replace("snap your thali  and we'll do the rest ✨", "Snap a picture of your meal and we'll analyze it for you ✨")
content = content.replace("analysing ur meal right now 🔬✨", "Analyzing your meal right now 🔬✨")
content = content.replace("here's the probiotic verdict truly 🧬", "Here is your probiotic analysis 🧬")
content = content.replace("we'll spill the probiotic tea ☕", "we'll provide a detailed probiotic analysis 🥗")
content = content.replace("Yoo! ", "Excellent! ")
content = content.replace("carrying ur gut right now 💅🏽", "supporting your gut health immensely ✨")
content = content.replace("solid choice ngl!", "Solid choice!")
content = content.replace("it's giving okay… could be more probiotic tho 💀", "Acceptable, though incorporating more probiotics would be beneficial. 🌱")
content = content.replace("no cap", "truly")
content = content.replace("fr!", "indeed!")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated fonts and slang')
