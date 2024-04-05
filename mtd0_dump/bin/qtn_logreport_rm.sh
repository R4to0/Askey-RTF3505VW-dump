#!/bin/sh
(
sleep 1
echo "logrepcli rm"
sleep 1
echo "exit"
) | telnet 1.1.1.2
