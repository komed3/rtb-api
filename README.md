# Real-time billionaires API

[![GitHub last commit](https://img.shields.io/github/last-commit/komed3/rtb-api?style=for-the-badge)](https://github.com/komed3/rtb-api/activity)
[![GitHub License](https://img.shields.io/github/license/komed3/rtb-api?style=for-the-badge)](LICENSE)
[![GitHub repo size](https://img.shields.io/github/repo-size/komed3/rtb-api?style=for-the-badge)](https://github.com/komed3/rtb-api/archive/refs/heads/main.zip)
[![Static Badge](https://img.shields.io/badge/uptime-100%25-green?style=for-the-badge)](https://status.jsdelivr.com/)

> [!WARNING]
> **There will be a major update for this API soon.**
> Additional details and which changes will occur as well as changed API endpoints / request queries will be announced as soon as known.
>
> Use `https://cdn.jsdelivr.net/gh/komed3/rtb-api@v1/api/{REQUEST}` to fetch data in unchanged format beyond the upcomming update.

This repository contains profile and list data from Forbes’ real-time billionaires. It will mostly be updated once a month.

Take a look on how the API data can be used by visiting [realtimebillionaires.de](https://realtimebillionaires.de).

## Download

If you intend to use this data yourself, please note that the API consists of over 50,000 individual files in more than 4,500 directories and that the total size of the unpacked files is around two gigabytes.

Download the files as ZIP archive directly from GitHub using [this link](https://github.com/komed3/rtb-api/archive/refs/heads/main.zip).

## Copyright

This data can be used unlimited and without any limitation.

The project is available under the [MIT license](LICENSE).

Thank you to everyone who shows interest in the real-time billionaires API. Extracting, compiling and maintaining this data is very time consuming. Linking to the author or this project is not mandatory, but would help to increase its reach. If you want to help out, simply link to the GitHub repository under `https://github.com/komed3/rtb-api`, its author `https://github.com/komed3` or the `realtimebillionaires.de` website.

## Disclaimer

This project makes no claim to accuracy or completeness of its information. Data is based on the daily updated Forbes list and calculated and analyzed by own scripts. Errors or inaccuracies may occur at Forbes as well as internal data processing.

## API

Requests can be done by using jsDelivr:

`https://cdn.jsdelivr.net/gh/komed3/rtb-api@main/api/{REQUEST}`

As `{REQUEST}` use one of the paths below.

### Global

| REQUEST | Description | String | JSON | CSV |
|---------|-------------|:------:|:----:|:---:|
| `availableDays` | Available days (real-time list) | | | x |
| `latest` | Latest day (real-time list) | x | | |
| `updated` | Latest update timestamp | x | | |

### Profiles

| REQUEST | Description | String | JSON | CSV |
|---------|-------------|:------:|:----:|:---:|
| `profile/_index` | List of all profiles | | x | |
| `profile/_alias` | List of profile aliases | | x | |

### Single profile

| REQUEST | Description | String | JSON | CSV |
|---------|-------------|:------:|:----:|:---:|
| `profile/{URI}/info` | Profile info | | x | |
| `profile/{URI}/bio` | Biography and about profile | | x | |
| `profile/{URI}/assets` | Financial assets | | x | |
| `profile/{URI}/rank` | Ranking | | x | |
| `profile/{URI}/latest` | Latest rank / net worth | | x | |
| `profile/{URI}/history` | Rank / net worth history data | | | x |
| `profile/{URI}/related` | Related profiles | | x | |
| `profile/{URI}/annual` | Annual report | | x | |
| `profile/{URI}/updated` | Profile info update timestamp | x | | |

The `{URI}` argument is described in the profiles index and is unique to each profile.

### Lists

| REQUEST | Description | String | JSON | CSV |
|---------|-------------|:------:|:----:|:---:|
| `list/_index` | Available lists index | | x | |
| `list/{LIST}/{DATE}` | Real-time list as of passed date | | x | |
| `list/{LIST}/latest` | Latest real-time list | | x | |

The `{LIST}` argument is described in the lists index. Use `{DATE}` format `YYYY-MM-DD` for available days.

### Stats

| REQUEST | Description | String | JSON | CSV |
|---------|-------------|:------:|:----:|:---:|
| `stats/count` | Daily number of billionaires | | | x |
| `stats/total` | Daily total net worth | | | x |
| `stats/woman` | Daily number of woman billionaires | | | x |
| `stats/country/_index` | Countries index | | | x |
| `stats/country/_list` | List of countries by number, fortune and richest individual | | | x |
| `stats/country/{KEY}` | Daily list with number, total net worth and richest individual | | | x |
| `stats/industry/_index` | Industries index | | | x |
| `stats/industry/_list` | List of industries by number, fortune and richest individual | | | x |
| `stats/industry/{KEY}` | Daily list with number, total net worth and richest individual | | | x |
| `stats/agePyramid` | Age pyramide (male/female) | | x | |
| `stats/children` | Number of billionaires by their children | | x | |
| `stats/maritalStatus` | Number of billionaires by their marital status | | x | |
| `stats/selfMade` | Number of billionaires by their self-made score | | x | |
| `stats/map` | Addresses and coordinates of billionaires known homes | | x | |
| `stats/top10` | Top 10 richest billionaires list for each month | | x | |

The `{KEY}` argument is a valid country code (ISO) or industry key. Both are described by their corresponding indices.

### Movers

| REQUEST | Description | String | JSON | CSV |
|---------|-------------|:------:|:----:|:---:|
| `movers/pct/winner/{DATE}` | Winners in percent as of date | | x | |
| `movers/pct/winner/latest` | Latest winners in percent | | x | |
| `movers/pct/winner/_list` | List of daily top winners in percent | | | x |
| `movers/pct/loser/{DATE}` | Losers in percent as of date | | x | |
| `movers/pct/loser/latest` | Latest losers in percent | | x | |
| `movers/pct/loser/_list` | List of daily top losers in percent | | | x |
| `movers/value/winner/{DATE}` | Winners in net worth as of date | | x | |
| `movers/value/winner/latest` | Latest winners in net worth | | x | |
| `movers/value/winner/_list` | List of daily top winners in net worth | | | x |
| `movers/value/loser/{DATE}` | Losers in net worth as of date | | x | |
| `movers/value/loser/latest` | Latest losers in net worth | | x | |
| `movers/value/loser/_list` | List of daily top losers in net worth | | | x |

Use `{DATE}` format `YYYY-MM-DD` for available days.

### Filter

| REQUEST | Description | String | JSON | CSV |
|---------|-------------|:------:|:----:|:---:|
| `filter/_index` | Global filter index | | x | |
| `filter/country/_index` | Countries index | | x | |
| `filter/country/{KEY}` | List of billionaires by country | | x | |
| `filter/industry/_index` | Industries index | | x | |
| `filter/industry/{KEY}` | List of billionaires by industry | | x | |
| `filter/woman` | List of woman billionaires | | x | |
| `filter/young` | List of young billionaires (under 50) | | x | |
| `filter/old` | List of old billionaires (over 80) | | x | |
| `filter/selfMade` | List of self-made billionaires | | x | |
| `filter/dropped` | List of dropped off billionaires | | x | |
| `filter/deceased` | List of deceased billionaires | | x | |

The `{KEY}` argument is a valid country code (ISO) or industry key. Both are described by their corresponding indices.
