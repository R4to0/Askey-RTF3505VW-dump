#!/bin/bash

FinalResult=1

#parsing input
macList=$(echo $1 | sed -e 's/,/ /g' -e 's/\[//g' -e 's/\]//g')

UndoList=""

for mac in $macList; do
    FinalResult=0

    case "$mac" in
    [0-9a-f][0-9a-f]:[0-9a-f][0-9a-f]:[0-9a-f][0-9a-f]:[0-9a-f][0-9a-f]:[0-9a-f][0-9a-f]:[0-9a-f][0-9a-f])
        ;;
    *)
        FinalResult=0
        break
        ;;
    esac

    RuleExist=$(tefapp show blacklist | grep -i $mac)

    if [ -z "$RuleExist" ]; then
        continue
    fi

    exceptRuleDel=$(tefapp remove mac_blocked $mac)
    case "$exceptRuleDel" in
    *mac_blocked*)
        FinalResult=1
        UndoList="$UndoList $mac"
        ;;
    *)
        FinalResult=0
        break
        ;;
    esac
done

if [ $FinalResult -eq 1 ]; then
    echo "All devices Unblocked correctly"
else
    for macUndo in $UndoList; do
        UndoExceptRule=$(tefapp add mac_blocked $macUndo)
    done
    echo "fail to perform Unblock on all devices, fail on device $mac"
fi
