#!/bin/bash

FinalResult=1

#parsing input
macList=$(echo $1 | sed -e 's/,/ /g' -e 's/\[//g' -e 's/\]//g')

RuleCreate=$(tefapp show firewall_rule | grep 'DevPauseOUT_IPv4')

if [ -z "$RuleCreate" ]; then
	tefapp set firewall_rule add name=DevPauseOUT_IPv4,interface=Internet, type=Out, default_action=Permit
fi

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
		true
	else
		FinalResult=1
		continue
	fi

	exceptRule=$(tefapp set firewall_exception add rule_name=DevPauseOUT_IPv4,action=Drop,originator_id=$mac)

	case "$exceptRule" in
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
	echo "All devices Paused correctly"
else
	for macUndo in $UndoList; do
		UndoExceptRule=$(tefapp set firewall_exception delete rule_name=DevPauseOUT_IPv4,originator_id=$macUndo,protocol=All)
	done
	echo "fail to perform Pause on all devices, fail on device $mac"
fi
