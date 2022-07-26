#!/usr/bin/env bash
error_msg="Unsupported commit prefix, please use from following prefix:
[init], [config], [config], [doc], [feature], [fix], [refactor], [wip]

Check guidelines and examples on QMS.
https://git.sa-labs.info/qms/qms-docs/-/wikis/Git-Best-Practices#commit-message
"

# Check commit messages contains standard message validation only or not
git_msg=$1
msg=`head -n1 $git_msg`
pattern="^(\[?((init|config|doc|feature|fix|refactor|wip)))?\][[:space:]]+"

if ! [[ "$msg" =~ $pattern ]]; then
  echo "$error_msg"
  exit 1
fi

