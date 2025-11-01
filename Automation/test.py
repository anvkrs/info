import requests


url = "https://scholar.google.com/citations?user=zG6UkeYAAAAJ&hl=en"

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/123.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

try:
    # response = requests.get(url, headers=headers, timeout=10)
    
    if response.status_code == 200:
        print("✅ Success! Data received.")
    else:
        print(f" code {response.status_code}")
        
except requests.exceptions.RequestException as e:
    print(f"ERROR: {e}")
