#!/bin/bash

# Get the job status from the environment
JOB_STATUS=$1

# Get the GitHub event name from the environment
GITHUB_EVENT_NAME=$2

# Get the GitHub event head commit timestamp from the environment
GITHUB_EVENT_HEAD_COMMIT_TIMESTAMP=$3

# Get the GitHub event pull request updated_at from the environment
GITHUB_EVENT_PULL_REQUEST_UPDATED_AT=$4

# Get the GitHub event head commit URL from the environment
GITHUB_EVENT_HEAD_COMMIT_URL=$5

# Get the GitHub event pull request HTML URL from the environment
GITHUB_EVENT_PULL_REQUEST_HTML_URL=$6

# Set the description and color based on the job status
if [ "$JOB_STATUS" == "success" ]; then
  DESCRIPTION="The deployment runs successfully"
  COLOR="3066993"
else
  DESCRIPTION="The deployment runs failed"
  COLOR="15158332"
fi

# Set the timestamp and reference URL based on the GitHub event type
if [ "$GITHUB_EVENT_NAME" == "push" ]; then
  TIMESTAMP="$GITHUB_EVENT_HEAD_COMMIT_TIMESTAMP"
  REFERENCE_URL="$GITHUB_EVENT_HEAD_COMMIT_URL"
else
  TIMESTAMP="$GITHUB_EVENT_PULL_REQUEST_UPDATED_AT"
  REFERENCE_URL="$GITHUB_EVENT_PULL_REQUEST_HTML_URL"
fi

# Generate the discord_notification.json file
echo '{
  "content": "Deployment status for <@&1087630107537059880>",
  "embeds": [
    {
      "title": "Deployment Status",
      "description": "'${DESCRIPTION}'",
      "color": "'${COLOR}'",
      "fields": [
        {
          "name": "Timestamp",
          "value": "'${TIMESTAMP}'"
        },
        {
          "name": "GitHub References",
          "value": "'${REFERENCE_URL}'"
        }
      ]
    }
  ],
  "allowed_mentions": {
    "parse": ["roles"]
  }
}' > discord_notification.json
