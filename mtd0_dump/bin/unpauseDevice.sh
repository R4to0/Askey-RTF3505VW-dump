#!/bin/bash

FinalResult=1

#parsing input
macList=$(echo $1 | sed -e 's/,/ /g' -e 's/\[//g' -e 's/\]//g')

UndoList=""

for mac in $macList; do
	FinalResult=0
	case "$mac" in
	[0-9a-f][0-9a-f]:[0-9a-f][0-9a-f]:[0-9a-f][0-9a-f]:[0-9a-f][0-9a-f]:[0-9a-f][0-9a-f]:[0-9a-f][0-9a-f]) ;;

	\
		*)
		FinalResult=0
		break
		;;
	esac
	RuleExist=$(tefapp show firewall_exception | grep -i $mac)

	if [ -z "$RuleExist" ]; then
		FinalResult=1
		continue
	fi

	exceptRuleDel=$(tefapp set firewall_exception delete rule_name=DevPauseOUT_IPv4,originator_id=$mac,protocol=All)

	case "$exceptRuleDel" in
	*Error*)
		FinalResult=0
		break
		;;
	*error*)
		FinalResult=0
		break
		;;
	*)
		FinalResult=1
		UndoList="$UndoList $mac"
		;;
	esac
done

if [ $FinalResult -eq 1 ]; then
	echo "All devices Unpaused correctly"
else
	for macUndo in $UndoList; do
		UndoExceptRule=$(tefapp set firewall_exception add rule_name=DevPauseOUT_IPv4,action=Drop,originator_id=$macUndo)
	done
	echo "fail to perform Unpause on all devices, fail on device $mac"
fi
