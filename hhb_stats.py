import requests
import json
from datetime import datetime
from pathlib import Path
import os

working_directory = f'{Path.home()}/scoreboard_wigle_api/2024'

now = datetime.now()
date = now.strftime("%Y%m%d%H%M")

event_start_time = '2024-10-19T07:00:01Z'
event_end_time = '2024-10-20T07:00:01Z'

wigle_api_name = os.environ["wigle_api_name"]
wigle_api_token = os.environ["wigle_api_token"]

print(wigle_api_token)

groups = list()
non_hhb_users = list()
participents = list()

#HHB is GID 20210121-00918
def get_group_stats(group_id = '20210121-00918'):

    stats_url = f"https://api.wigle.net/api/v2/group/groupEventStats/{group_id}?startDateTime={event_start_time}&endDateTime={event_end_time}"
    r = requests.get(stats_url, auth=(wigle_api_name, wigle_api_token))

    if r.ok:
        results = r.json()
        #print(results)

        for member in results['eventMemberStats']:
            user = member['userName']
            wifi_with_location =  member['wifiDiscoveredWithLocation']

            this_member = { "user": user, "wifi_count": wifi_with_location }
            
            if user in non_hhb_users or group_id == '20210121-00918':
                if wifi_with_location > 0:
                    participents.append(this_member)

# #wardriving, Minnesota WarDriviers, New Zealand Wardrivers,
groups = ['20211008-01234','20070407-00031','20050708-00037']
non_hhb_users = ['pejacoby','TiredSpud','f4r']

get_group_stats()
for group in groups:
    get_group_stats(group)


filename = f'{working_directory}/stats-{date}.json'
live_filename = f'{working_directory}/stats-latest.json'

with open(filename, "w") as outfile:
    outfile.write(json.dumps(participents))

with open(live_filename, "w") as outfile:
    outfile.write(json.dumps(participents))
