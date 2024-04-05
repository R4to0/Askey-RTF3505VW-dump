#!/bin/sh
(
sleep 1
echo "logrepcli off"
sleep 1
echo "exit"
) | telnet 1.1.1.2
