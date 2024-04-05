#!/bin/bash

FinalResult=1

#parsing input
macList=$(echo $1 | sed -e 's/,/ /g' -e 's/\[//g' -e 's/\]//g')

RuleCreate=$(tefapp show blacklist | grep -i 'mac_blacklist on')

if [ -z "$RuleCreate" ]; then
	tefapp set mac_blacklist on
fi

UndoList=""

for mac in $macList; do
	FinalResult=0
	case "$mac" in
	[0-9a-f][0-9a-f]:[0-9a-f][0-9a-f]:[0-9a-f][0-9a-f]:[0-9a-f][0-9a-f]:[0-9a-f][0-9a-f]:[0-9a-f][0-9a-f]) ;;

	*)
		FinalResult=0
		break
		;;
	esac

	RuleExist=$(tefapp show blacklist | grep -i $mac)

	if [[ ! -z "$RuleExist" ]]; then
		FinalResult=1
		continue
	fi

	exceptRule=$(tefapp add mac_blocked $mac)

	case "$exceptRule" in
	*mac_blocked*)
		UndoList="$UndoList $mac"
		FinalResult=1
		;;
	*)
		FinalResult=0
		break
		;;
	esac
done

if [ $FinalResult -eq 1 ]; then
	echo "All devices Blocked correctly"
else
	for macUndo in $UndoList; do
		UndoExceptRule=$(tefapp remove mac_blocked $macUndo)
	done
	echo "fail to perform Block on all devices, fail on device $mac"
fi
