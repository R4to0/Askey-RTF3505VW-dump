#!/bin/sh

#############################################################################
#
# MCAFEE CONFIDENTIAL
# Copyright ©2018 McAfee, LLC
#
# The source code contained or described herein and all documents related
# to the source code ("Material") are owned by McAfee or its
# suppliers or licensors. Title to the Material remains with McAfee
# or its suppliers and licensors. The Material contains trade
# secrets and proprietary and confidential information of McAfee or its
# suppliers and licensors. The Material is protected by worldwide copyright
# and trade secret laws and treaty provisions. No part of the Material may
# be used, copied, reproduced, modified, published, uploaded, posted,
# transmitted, distributed, or disclosed in any way without McAfee's prior
# express written permission.
#
# No license under any patent, copyright, trade secret or other intellectual
# property right is granted to or conferred upon you by disclosure or
# delivery of the Materials, either expressly, by implication, inducement,
# estoppel or otherwise. Any license under such intellectual property rights
# must be express and approved by McAfee in writing.
#
##############################################################################


. /etc/shgw/shgw.constants
. /etc/shgw/shgw.common

SCAN_FILE="${SHGW_TMPFS_PATH}/ndp_scan_file"
NDP_LOCK_FILE="${SHGW_TMPFS_PATH}/ndp_lock_file"

ping_on_multicast() {
	local _LAN_IFACES=$(fn_get_lan_ifaces)
	local _IFACE=""
	for _IFACE in ${_LAN_IFACES}; do
		${PING6} -I ${_IFACE} -c 2 ${LOCAL_MULTICAST_ADDRESS} > /dev/null 2>&1
	done
}

parse_ndp_cache() {
	local _LAN_IFACES=$(fn_get_lan_ifaces)
	local _IFACE=""
	for _IFACE in ${_LAN_IFACES}; do
		${IP} -6 neigh 															\
			| ${GREP} ${_IFACE}										\
			| ${GREP} -vi fail 													\
			| ${AWK} '{print $5,$1}' >> ${SCAN_FILE} 2> /dev/null
	done
}

empty_scan_file() {
	> ${SCAN_FILE}
}

exit_if_running() {
	if  [ -f "$NDP_LOCK_FILE" ]; then
		${ECHO} "Already running" && exit 127
	fi
	${ECHO} $$ > ${NDP_LOCK_FILE}
}

remove_ndp_lock_file() {
	${RM} ${NDP_LOCK_FILE}
}

#
# Main
exit_if_running
empty_scan_file
ping_on_multicast
parse_ndp_cache
remove_ndp_lock_file

