# Real-time billionaires API

This repository contains profile and list data from Forbes real-time billionaires. It will be updated few time a year.

This data can be used unlimited and without any limitation.

## API

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
