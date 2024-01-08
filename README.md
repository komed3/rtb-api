# Real-time billionaires API

This repository contains profile and list data from Forbes’ real-time billionaires. It will be updated few time a year.

This data can be used unlimited and without any limitation.

## API

Requests can be done by using jsDelivr:

``https://cdn.jsdelivr.net/gh/komed3/rtb-api@main{REQUEST}``

As ``{REQUEST}`` use one of the links below.

### Global

| REQUEST | Description | String | JSON | CSV |
|---------|-------------|:------:|:----:|:---:|
| ``/api/availableDays`` | Available days (real-time list) | | | x |
| ``/api/latest`` | Latest day (real-time list) | x | | |
| ``/api/updated`` | Latest update timestamp | x | | |

### Profiles

| REQUEST | Description | String | JSON | CSV |
|---------|-------------|:------:|:----:|:---:|
| ``/api/profile/_index`` | List of all profiles | | x | |
| ``/api/profile/_alias`` | List of profile aliases | | x | |

### Single profile

| REQUEST | Description | String | JSON | CSV |
|---------|-------------|:------:|:----:|:---:|
| ``/api/profile/{URI}/info`` | Profile info | | x | |
| ``/api/profile/{URI}/bio`` | Biography and about profile | | x | |
| ``/api/profile/{URI}/assets`` | Financial assets | | x | |
| ``/api/profile/{URI}/rank`` | Ranking | | x | |
| ``/api/profile/{URI}/latest`` | Latest rank / net worth | | x | |
| ``/api/profile/{URI}/history`` | Rank / net worth history data | | | x |
| ``/api/profile/{URI}/related`` | Related profiles | | x | |
| ``/api/profile/{URI}/annual`` | Annual report | | x | |
| ``/api/profile/{URI}/updated`` | Profile info update timestamp | x | | |

The ``{URI}`` argument is described in the profiles index and is unique to each profile.

### Lists

| REQUEST | Description | String | JSON | CSV |
|---------|-------------|:------:|:----:|:---:|
| ``/api/list/_index`` | Available lists index | | x | |
| ``/api/list/rtb/{DATE}`` | Real-time list as of passed date | | x | |
| ``/api/list/rtb/latest`` | Latest real-time list | | x | |

Use ``{DATE}`` format ``YYYY-MM-DD`` for available days.

### Stats

| REQUEST | Description | String | JSON | CSV |
|---------|-------------|:------:|:----:|:---:|
| ``/api/stats/count`` | Daily number of billionaires | | | x |
| ``/api/stats/total`` | Daily total net worth | | | x |
| ``/api/stats/woman`` | Daily number of woman billionaires | | | x |
| ``/api/stats/country/_index`` | Countries index | | | x |
| ``/api/stats/country/_list`` | List of countries by number, fortune and richest individual | | | x |
| ``/api/stats/country/{KEY}`` | Daily list with number, total net worth and richest individual | | | x |
| ``/api/stats/industry/_index`` | Industries index | | | x |
| ``/api/stats/industry/_list`` | List of industries by number, fortune and richest individual | | | x |
| ``/api/stats/industry/{KEY}`` | Daily list with number, total net worth and richest individual | | | x |
| ``/api/stats/agePyramid`` | Age pyramide (male/female) | | x | |
| ``/api/stats/children`` | Number of billionaires by their children | | x | |
| ``/api/stats/maritalStatus`` | Number of billionaires by their marital status | | x | |
| ``/api/stats/scatter`` | Scatter data by age and net worth | | x | |
| ``/api/stats/selfMade`` | Number of billionaires by their self-made score | | x | |

The ``{KEY}`` argument is a valid country code (ISO) or industry key. Both are described by their corresponding indices.

### Movers

| REQUEST | Description | String | JSON | CSV |
|---------|-------------|:------:|:----:|:---:|
| ``/api/movers/pct/winner/{DATE}`` | Winners in percent as of date | | x | |
| ``/api/movers/pct/winner/loser`` | Latest winners in percent | | x | |
| ``/api/movers/pct/loser/{DATE}`` | Losers in percent as of date | | x | |
| ``/api/movers/pct/loser/latest`` | Latest losers in percent | | x | |
| ``/api/movers/value/winner/{DATE}`` | Winners in net worth as of date | | x | |
| ``/api/movers/value/winner/loser`` | Latest winners in net worth | | x | |
| ``/api/movers/value/loser/{DATE}`` | Losers in net worth as of date | | x | |
| ``/api/movers/value/loser/latest`` | Latest losers in net worth | | x | |

Use ``{DATE}`` format ``YYYY-MM-DD`` for available days.

### Filter

| REQUEST | Description | String | JSON | CSV |
|---------|-------------|:------:|:----:|:---:|
| ``/api/filter/country/_index`` | Countries index | | x | |
| ``/api/filter/country/{KEY}`` | List of billionaires by country | | x | |
| ``/api/filter/industry/_index`` | Industries index | | x | |
| ``/api/filter/industry/{KEY}`` | List of billionaires by industry | | x | |
| ``/api/filter/woman`` | List of woman billionaires | | x | |
| ``/api/filter/young`` | List of young billionaires (under 50) | | x | |
| ``/api/filter/old`` | List of old billionaires (over 80) | | x | |
| ``/api/filter/deceased`` | List of deceased billionaires | | x | |
| ``/api/filter/selfMade`` | List of self-made billionaires | | x | |

The ``{KEY}`` argument is a valid country code (ISO) or industry key. Both are described by their corresponding indices.
