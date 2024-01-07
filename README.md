# Real-time billionaires API

This repository contains profile and list data from Forbes real-time billionaires. It will be updated few time a year.

This data can be used unlimited and without any limitation.

## API

* ``/api/availableDays`` Available days (real-time list) (CSV)
* ``/api/latest`` Latest day (real-time list) (String)
* ``/api/updated`` Latest update timestamp (String)

### Profiles

* ``/api/profile/_index`` List of all profiles (JSON)
* ``/api/profile/_alias`` List of profile aliases (JSON)

### Profile

* ``/api/profile/{URI}/info`` Profile info (JSON)
* ``/api/profile/{URI}/bio`` Biography and about profile (JSON)
* ``/api/profile/{URI}/assets`` Financial assets (JSON)
* ``/api/profile/{URI}/rank`` Ranking (JSON)
* ``/api/profile/{URI}/latest`` Latest rank / net worth (JSON)
* ``/api/profile/{URI}/history`` Rank / net worth history data (CSV)
* ``/api/profile/{URI}/related`` Related profiles (JSON)
* ``/api/profile/{URI}/annual`` Annual report (JSON)
* ``/api/profile/{URI}/updated`` Profile info update timestamp (String)

### Filter

* ``/api/filter/woman`` List of woman billionaires (CSV)
* ``/api/filter/young`` List of young billionaires (under 50) (CSV)
* ``/api/filter/old`` List of old billionaires (over 80) (CSV)
* ``/api/filter/country/_index`` Countries index (CSV)
* ``/api/filter/country/{KEY}`` List of billionaires in country (CSV)
* ``/api/filter/industry/_index`` Industries index (CSV)
* ``/api/filter/industry/{KEY}`` List of billionaires in industry (CSV)
