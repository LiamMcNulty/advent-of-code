#!/bin/bash

usage() {
    echo "Usage: $0 -a <value> -b <value>"
    exit 1
}

ERROR='\033[0;31m' # Red
SUCCESS='\033[0;32m' # Green
INFO='\033[0;34m' # Blue
COMMAND='\033[0;35m' # Purple
NC='\033[0m' # No Color
NL="\n" # New Line

while getopts ":y:d:" opt; do
    case $opt in
        y) year="$OPTARG" ;;
        d) day="$OPTARG" ;;
        :) echo "Option -$OPTARG requires an argument." ; usage ;;
        \?) echo "Invalid option: -$OPTARG" ; usage ;;
    esac
done

echo "Selected:"
echo " - Year: $year"
echo " - Day: $day"
echo ""

echo "Running solution ./$year/$day/solution.js"
node ./$year/$day/solution.js

