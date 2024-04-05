#!/bin/bash

unpause=$(sh /usr/local/auxfs/devices/unpauseDevice.sh $1)
	if [ -z "$unpause" ]; 
	then
		echo "unpause fail"
	else
		echo $unpause
	fi

unblock=$(sh /usr/local/auxfs/devices/unblockDevices.sh $1)
	if [ -z "$unblock" ]; 
	then
		echo "unblock fail"
	else
		echo $unblock
	fi


