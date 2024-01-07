# Real-time billionaires API

This repository contains profile and list data from Forbes’ real-time billionaires. It will be updated few time a year.

This data can be used unlimited and without any limitation.

## API

* ``/api/availableDays`` Available days (real-time list) (CSV)
* ``/api/latest`` Latest day (real-time list) (String)
* ``/api/updated`` Latest update timestamp (String)

### Profiles

* ``/api/profile/_index`` List of all profiles (JSON)
* ``/api/profile/_alias`` List of profile aliases (JSON)

### Single profile

* ``/api/profile/{URI}/info`` Profile info (JSON)
* ``/api/profile/{URI}/bio`` Biography and about profile (JSON)
* ``/api/profile/{URI}/assets`` Financial assets (JSON)
* ``/api/profile/{URI}/rank`` Ranking (JSON)
* ``/api/profile/{URI}/latest`` Latest rank / net worth (JSON)
* ``/api/profile/{URI}/history`` Rank / net worth history data (CSV)
* ``/api/profile/{URI}/related`` Related profiles (JSON)
* ``/api/profile/{URI}/annual`` Annual report (JSON)
* ``/api/profile/{URI}/updated`` Profile info update timestamp (String)

### Lists

* ``/api/list/_index`` Available lists index (JSON)
* ``/api/list/rtb/{DATE}`` Real-time list as of passed date (JSON)
* ``/api/list/rtb/latest`` Latest real-time list (JSON)

### Stats

* ``/api/stats/count`` Daily count of billionaires (CSV)
* ``/api/stats/total`` Daily total net worth (CSV)
* ``/api/stats/woman`` Daily count of woman billionaires (CSV)
* ``/api/stats/country/_index``  (CSV)
* ``/api/stats/country/_list``  (CSV)
* ``/api/stats/country/{KEY}``  (CSV)
* ``/api/stats/industry/_index``  (CSV)
* ``/api/stats/industry/_list``  (CSV)
* ``/api/stats/industry/{KEY}``  (CSV)
* ``/api/stats/agePyramid``  (JSON)
* ``/api/stats/children``  (JSON)
* ``/api/stats/maritalStatus``  (JSON)
* ``/api/stats/scatter``  (JSON)
* ``/api/stats/selfMade``  (JSON)

### Movers

* ``/api/movers/pct/winner/{DATE}`` Winners in percent as of date (JSON)
* ``/api/movers/pct/winner/loser`` Latest winners in percent (JSON)
* ``/api/movers/pct/loser/{DATE}`` Losers in percent as of date (JSON)
* ``/api/movers/pct/loser/latest`` Latest losers in percent (JSON)
* ``/api/movers/value/winner/{DATE}`` Winners in net worth as of date (JSON)
* ``/api/movers/value/winner/loser`` Latest winners in net worth (JSON)
* ``/api/movers/value/loser/{DATE}`` Losers in net worth as of date (JSON)
* ``/api/movers/value/loser/latest`` Latest losers in net worth (JSON)

### Filter

* ``/api/filter/woman`` List of woman billionaires (CSV)
* ``/api/filter/young`` List of young billionaires (under 50) (CSV)
* ``/api/filter/old`` List of old billionaires (over 80) (CSV)
* ``/api/filter/country/_index`` Countries index (CSV)
* ``/api/filter/country/{KEY}`` List of billionaires in country (CSV)
* ``/api/filter/industry/_index`` Industries index (CSV)
* ``/api/filter/industry/{KEY}`` List of billionaires in industry (CSV)
