#!/bin/bash
git tag -a "$1" -m "Version $1"
npm version "$1"
git push origin master
git push origin --tags
npm publish
ember github-pages:commit --message "gh pages."
git checkout master
