from bs4 import BeautifulSoup
import json

# Read your saved HTML file
with open(r"Automation\data.html", "r", encoding="utf-8") as file:
    html = file.read()

soup = BeautifulSoup(html, "html.parser")

# Find all rows (each publication entry)
rows = soup.find_all("tr", class_="gsc_a_tr")

data = []

for row in rows:
    # TITLE + LINK
    title_tag = row.find("a", class_="gsc_a_at")
    title = " ".join(title_tag.get_text(" ", strip=True).split()) if title_tag else ""
    link = "https://scholar.google.com" + title_tag["href"] if title_tag and title_tag.get("href") else ""

    # AUTHOR and JOURNAL INFO
    info_divs = row.find_all("div", class_="gs_gray")
    author = " ".join(info_divs[0].get_text(strip=True).split()) if len(info_divs) > 0 else ""
    journal = " ".join(info_divs[1].get_text(" ", strip=True).split()) if len(info_divs) > 1 else ""

    # CITED COUNT (if exists)
    cited_tag = row.find("a", class_="gsc_a_ac")
    cited = cited_tag.get_text(strip=True) if cited_tag and cited_tag.get_text(strip=True) else "0"

    # YEAR
    year_tag = row.find("span", class_="gsc_a_h")
    year = year_tag.get_text(strip=True) if year_tag else ""

    # Append to list
    data.append({
        "title": title,
        "author": author,
        "journal": journal,
        "cited": cited,
        "year": year,
        "link": link
    })

# Save to JSON
with open(r"Automation\data.json", "w", encoding="utf-8") as file:
    json.dump(data, file, indent=4, ensure_ascii=False)

print("File saved ")
