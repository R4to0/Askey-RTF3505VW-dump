#!/bin/sh

#set -x

LAN_IFACE="br0" #Change the interface accordingly
TPROXY_MARK="0x3/0xFFFFFFFF"

setup_iptables_rules(){
	iptables -w -t mangle -N RTF_DNS
	iptables -w -t mangle -A RTF_DNS -i ${LAN_IFACE} -p udp --dport 53 -j TPROXY --tproxy-mark ${TPROXY_MARK} --on-port $1
	iptables -w -t mangle -I PREROUTING -j RTF_DNS
}

set_iproute4_rules(){
	ip rule add fwmark ${TPROXY_MARK} lookup 100
	ip route add local 0.0.0.0/0 dev lo table 100
}


remove_iproute4_rules(){
	ip route del local 0.0.0.0/0 dev lo table 100
	ip rule del fwmark ${TPROXY_MARK} lookup 100
}

remove_iptables_rules(){
	iptables -w -t mangle -D RTF_DNS -i ${LAN_IFACE} -p udp --dport 53 -j TPROXY --tproxy-mark ${TPROXY_MARK} --on-port $1
	iptables -w -t mangle -D PREROUTING -j RTF_DNS
	iptables -w -t mangle -X RTF_DNS
}

setup_ip6tables_rules(){
	ip6tables -w -t mangle -N RTF_DNS
	ip6tables -w -t mangle -A RTF_DNS -i ${LAN_IFACE} -p udp --dport 53 -j TPROXY --tproxy-mark ${TPROXY_MARK} --on-port $1
	ip6tables -w -t mangle -A PREROUTING -j RTF_DNS
}

set_iproute6_rules(){
	ip -6 rule add fwmark ${TPROXY_MARK} lookup 101 pref 1
	ip -6 route add local ::/0 dev lo table 101
}


remove_iproute6_rules(){
	ip -6 route del local ::/0 dev lo table 101
	ip -6 rule del fwmark ${TPROXY_MARK} lookup 101 pref 1
}

remove_ip6tables_rules(){
	ip6tables -w -t mangle -D RTF_DNS -i ${LAN_IFACE} -p udp --dport 53 -j TPROXY --tproxy-mark ${TPROXY_MARK} --on-port $1
	ip6tables -w -t mangle -D PREROUTING -j RTF_DNS
	ip6tables -w -t mangle -X RTF_DNS
}

set_rules() {
	#IPv4
	set_iproute4_rules
	setup_iptables_rules $1

	#IPv6
	set_iproute6_rules
	setup_ip6tables_rules $1
}

delete_rules() {
    #IPv4
	remove_iproute4_rules
	remove_iptables_rules $1

	#IPv6
	remove_iproute6_rules
	remove_ip6tables_rules $1
}

if [ "$2" == "" ]; then
    echo "Usage:$0 <set|del> <proxy_port>"
else
    mode=$1
    port=$2
    if [ X"$mode" == X"set" ]; then
        set_rules $port
    elif [ X"$mode" == X"del" ]; then
        delete_rules $port
    else
        echo "Usage:$0 <set|del> <proxy_port>"
    fi
fi
