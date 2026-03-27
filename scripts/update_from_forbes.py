"""
Update rtb-api data from Forbes real-time billionaires API.

Generates:
  - api/list/rtb/{date}     — daily ranked list
  - api/profile/{uri}/history — appends today's entry
  - api/profile/{uri}/info  — updates profile info
  - api/profile/{uri}/rank  — updates current rank
  - api/profile/{uri}/assets — updates financial assets
  - api/latest              — latest date
  - api/updated             — last update timestamp
  - api/filter/country/{cc} — country filter lists
"""

import json
import os
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

FORBES_API = "https://www.forbes.com/forbesapi/person/rtb/0/position/true.json"
API_DIR = Path(__file__).parent.parent / "api"


def fetch_all():
    url = f"{FORBES_API}?limit=3000"
    req = urllib.request.Request(url, headers={"User-Agent": "rtb-api-updater"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read())


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w") as f:
        json.dump(data, f, indent=2)


def write_text(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w") as f:
        f.write(text)


def compute_age(birth_ts):
    if not birth_ts or birth_ts <= 0:
        return None
    birth = datetime.fromtimestamp(birth_ts / 1000, tz=timezone.utc)
    return int((datetime.now(timezone.utc) - birth).days / 365.25)


def country_code(name):
    """Map Forbes country name to 2-letter code."""
    mapping = {
        "United States": "us", "China": "cn", "India": "in",
        "Germany": "de", "France": "fr", "United Kingdom": "gb",
        "Canada": "ca", "Russia": "ru", "Brazil": "br",
        "Japan": "jp", "South Korea": "kr", "Australia": "au",
        "Italy": "it", "Spain": "es", "Mexico": "mx",
        "Switzerland": "ch", "Sweden": "se", "Israel": "il",
        "Hong Kong": "hk", "Taiwan": "tw", "Singapore": "sg",
        "Indonesia": "id", "Thailand": "th", "Malaysia": "my",
        "Turkey": "tr", "Nigeria": "ng", "South Africa": "za",
        "Egypt": "eg", "Chile": "cl", "Colombia": "co",
        "Argentina": "ar", "Peru": "pe", "Philippines": "ph",
        "Poland": "pl", "Netherlands": "nl", "Belgium": "be",
        "Austria": "at", "Norway": "no", "Denmark": "dk",
        "Ireland": "ie", "New Zealand": "nz", "Portugal": "pt",
        "Czech Republic": "cz", "Greece": "gr", "Romania": "ro",
        "Ukraine": "ua", "Vietnam": "vn", "Kazakhstan": "kz",
        "United Arab Emirates": "ae", "Saudi Arabia": "sa",
        "Lebanon": "lb", "Georgia": "ge", "Nepal": "np",
        "Monaco": "mc", "Liechtenstein": "li", "Luxembourg": "lu",
    }
    return mapping.get(name, name[:2].lower() if name else "xx")


def main():
    print("Fetching Forbes real-time data...")
    data = fetch_all()
    people = data["personList"]["personsLists"]
    print(f"  {len(people)} billionaires")

    ts = people[0]["timestamp"]
    date_str = datetime.fromtimestamp(ts / 1000, tz=timezone.utc).strftime("%Y-%m-%d")
    now_iso = datetime.now(timezone.utc).isoformat()
    print(f"  Date: {date_str}")

    # Check if we already have this date
    list_path = API_DIR / "list" / "rtb" / date_str
    if list_path.exists():
        print(f"  Already have {date_str}, skipping")
        return

    # --- Daily list ---
    woman_count = sum(1 for p in people if p.get("gender") == "F")
    total_worth = sum(p["finalWorth"] for p in people)

    list_entries = []
    country_lists = {}

    for i, p in enumerate(people):
        uri = p["uri"]
        age = compute_age(p.get("birthDate", 0))
        cc = country_code(p.get("countryOfCitizenship", ""))
        networth = round(p["finalWorth"], 3)

        list_entries.append({
            "rank": i + 1,
            "uri": uri,
            "name": p["personName"],
            "gender": p.get("gender", "").lower()[:1],
            "age": age,
            "networth": networth,
            "citizenship": cc,
            "industry": [ind.lower() for ind in p.get("industries", [])],
            "source": p.get("source", "").split(", ") if isinstance(p.get("source"), str) else [],
        })

        # Country filter
        if cc:
            country_lists.setdefault(cc, []).append(uri)

        # --- Per-profile updates ---
        profile_dir = API_DIR / "profile" / uri

        # Append to history
        hist_path = profile_dir / "history"
        hist_line = f"{date_str} {i + 1} {networth} 0 0\n"
        hist_path.parent.mkdir(parents=True, exist_ok=True)
        existing = ""
        if hist_path.exists():
            existing = hist_path.read_text()
            if date_str in existing:
                pass  # already has today
            else:
                existing += hist_line
        else:
            existing = hist_line
        write_text(hist_path, existing)

        # Rank
        prev_uri = people[i - 1]["uri"] if i > 0 else None
        next_uri = people[i + 1]["uri"] if i < len(people) - 1 else None
        write_json(profile_dir / "rank", {
            "rtb": {
                "date": date_str,
                "rank": i + 1,
                "prev": prev_uri,
                "next": next_uri,
            }
        })

        # Assets
        assets = p.get("financialAssets", [])
        if assets:
            write_json(profile_dir / "assets", assets)

    # Write list
    write_json(list_path, {
        "date": date_str,
        "count": len(people),
        "woman": woman_count,
        "total": round(total_worth, 3),
        "list": list_entries,
    })

    # Write country filters
    for cc, uris in country_lists.items():
        write_json(API_DIR / "filter" / "country" / cc, uris)

    # Write metadata
    write_text(API_DIR / "latest", date_str)
    write_text(API_DIR / "updated", now_iso)

    print(f"  Wrote list for {date_str}")
    print(f"  Updated {len(people)} profiles")
    print(f"  Updated {len(country_lists)} country filters")


if __name__ == "__main__":
    main()
