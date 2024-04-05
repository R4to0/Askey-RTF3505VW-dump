#!/bin/sh
# commented by weichen, 20150916. This script will be called by other script which will re-mount rootfs to read/write first.
#mount -o remount,rw  /dev/mtdblock0 /
if [ ! -e /usr/local/auxfs ]
then
    mkdir -p /usr/local/auxfs
fi

if [ ! -e /usr/local/auxfs/wifi2_4G ]
then
    mkdir -p /usr/local/auxfs/wifi2_4G
fi
if  [ ! -e /usr/local/auxfs/wifi5G ]
then
    mkdir -p /usr/local/auxfs/wifi5G
fi
if  [ ! -e /usr/local/auxfs/bin ]
then
    mkdir -p /usr/local/auxfs/bin
fi

if [ ! -e /topaz-linux.lzma.img ]
then
    # if the file doesn't exist in rootfs, link it to file in auxfs.
    echo "link topaz-linux.lzma.img to auxfs"
    ln -s /usr/local/auxfs/wifi5G/topaz-linux.lzma.img /topaz-linux.lzma.img
else
    if [ ! -e /usr/local/auxfs/wifi5G/topaz-linux.lzma.img ]; then
        # if the file in auxfs is empty, copy it from rootfs.
        echo "copy topaz-linux.lzma.img to auxfs"
        cp -a /topaz-linux.lzma.img /usr/local/auxfs/wifi5G/
        cp -a /etc/rtf_version /usr/local/auxfs/
        sync
    fi
fi
if [ ! -e /lib/modules/3.4.11-rt19+/extra/wl.ko ]
then
    # if the file doesn't exist in rootfs, link it to file in auxfs.
    echo "link wl.ko to auxfs"
    ln -s /usr/local/auxfs/wifi2_4G/wl.ko /lib/modules/3.4.11-rt19+/extra/wl.ko
else
    if [ ! -e /usr/local/auxfs/wifi2_4G/wl.ko ]; then
        # if the file in auxfs is empty, copy it from rootfs.
        echo "copy wl.ko to auxfs"
        cp -a /lib/modules/3.4.11-rt19+/extra/wl.ko /usr/local/auxfs/wifi2_4G/
        cp -a /etc/rtf_version /usr/local/auxfs/
        sync
    fi
fi
if [ ! -e /bin/tcpdump ]
then
    # if the file doesn't exist in rootfs, link it to file in auxfs.
    echo "link /bin/tcpdump to auxfs"
    ln -s /usr/local/auxfs/bin/tcpdump /bin/tcpdump
else
    if [ ! -e /usr/local/auxfs/bin/tcpdump ]; then
        # if the file in auxfs is empty, copy it from rootfs.
        echo "copy /bin/tcpdump to auxfs"
        cp -a /bin/tcpdump /usr/local/auxfs/bin/
        cp -a /etc/rtf_version /usr/local/auxfs/
        sync
    fi
fi
if [ ! -e /bin/openssl ]
then
    # if the file doesn't exist in rootfs, link it to file in auxfs.
    echo "link /bin/openssl to auxfs"
    ln -s /usr/local/auxfs/bin/openssl /bin/openssl
else
    if [ ! -e /usr/local/auxfs/bin/openssl ]; then
        # if the file in auxfs is empty, copy it from rootfs.
        echo "copy /bin/openssl to auxfs"
        cp -a /bin/openssl /usr/local/auxfs/bin/
        cp -a /etc/rtf_version /usr/local/auxfs/
        sync
    fi
fi
# added by Scheng
if [ ! -e /bin/curl ]
then
    if [ -e /usr/local/auxfs/bin/curl ]; then
        # if the file doesn't exist in rootfs, link it to file in auxfs.
        echo "link /bin/curl to auxfs"
        ln -s /usr/local/auxfs/bin/curl /bin/curl
    fi
else
    if [ ! -e /usr/local/auxfs/bin/curl ]; then
        # if the file in auxfs is empty, copy it from rootfs.
        echo "copy /bin/curl to auxfs"
        cp -a /bin/curl /usr/local/auxfs/bin/
        cp -a /etc/rtf_version /usr/local/auxfs/
        sync
    fi
fi
if [ ! -e /bin/reset ]
then
    if [ -e /usr/local/auxfs/bin/reset ]; then
        # if the file doesn't exist in rootfs, link it to file in auxfs.
        echo "link /bin/reset to auxfs"
        ln -s /usr/local/auxfs/bin/reset /bin/reset
    fi
else
    if [ ! -e /usr/local/auxfs/bin/reset ]; then
        # if the file in auxfs is empty, copy it from rootfs.
        echo "copy /bin/reset to auxfs"
        cp -a /bin/reset /usr/local/auxfs/bin/
        cp -a /etc/rtf_version /usr/local/auxfs/
        sync
    fi
fi
if [ ! -e /bin/netper ]
then
    if [ -e /usr/local/auxfs/bin/netper ]; then
        # if the file doesn't exist in rootfs, link it to file in auxfs.
        echo "link /bin/netper to auxfs"
        ln -s /usr/local/auxfs/bin/netper /bin/netper
    fi
else
    if [ ! -e /usr/local/auxfs/bin/netper ]; then
        # if the file in auxfs is empty, copy it from rootfs.
        echo "copy /bin/netper to auxfs"
        cp -a /bin/netper /usr/local/auxfs/bin/
        cp -a /etc/rtf_version /usr/local/auxfs/
        sync
    fi
fi
if [ ! -e /bin/netinf ]
then
    if [ -e /usr/local/auxfs/bin/netinf ]; then
        # if the file doesn't exist in rootfs, link it to file in auxfs.
        echo "link /bin/netinf to auxfs"
        ln -s /usr/local/auxfs/bin/netinf /bin/netinf
    fi
else
    if [ ! -e /usr/local/auxfs/bin/netinf ]; then
        # if the file in auxfs is empty, copy it from rootfs.
        echo "copy /bin/netinf to auxfs"
        cp -a /bin/netinf /usr/local/auxfs/bin/
        cp -a /etc/rtf_version /usr/local/auxfs/
        sync
    fi
fi
if [ ! -e /bin/getigmptables ]
then
    if [ -e /usr/local/auxfs/bin/getigmptables ]; then
        # if the file doesn't exist in rootfs, link it to file in auxfs.
        echo "link /bin/getigmptables to auxfs"
        ln -s /usr/local/auxfs/bin/getigmptables /bin/getigmptables
    fi
else
    if [ ! -e /usr/local/auxfs/bin/getigmptables ]; then
        # if the file in auxfs is empty, copy it from rootfs.
        echo "copy /bin/getigmptables to auxfs"
        cp -a /bin/getigmptables /usr/local/auxfs/bin/
        cp -a /etc/rtf_version /usr/local/auxfs/
        sync
    fi
fi
if [ ! -e /bin/devinf ]
then
    if [ -e /usr/local/auxfs/bin/devinf ]; then
        # if the file doesn't exist in rootfs, link it to file in auxfs.
        echo "link /bin/devinf to auxfs"
        ln -s /usr/local/auxfs/bin/devinf /bin/devinf
    fi
else
    if [ ! -e /usr/local/auxfs/bin/devinf ]; then
        # if the file in auxfs is empty, copy it from rootfs.
        echo "copy /bin/devinf to auxfs"
        cp -a /bin/devinf /usr/local/auxfs/bin/
        cp -a /etc/rtf_version /usr/local/auxfs/
        sync
    fi
fi
if [ ! -e /bin/loadfw ]
then
    if [ -e /usr/local/auxfs/bin/loadfw ]; then
        # if the file doesn't exist in rootfs, link it to file in auxfs.
        echo "link /bin/loadfw to auxfs"
        ln -s /usr/local/auxfs/bin/loadfw /bin/loadfw
    fi
else
    if [ ! -e /usr/local/auxfs/bin/loadfw ]; then
        # if the file in auxfs is empty, copy it from rootfs.
        echo "copy /bin/loadfw to auxfs"
        cp -a /bin/loadfw /usr/local/auxfs/bin/
        cp -a /etc/rtf_version /usr/local/auxfs/
		sync
    fi
fi
if [ ! -e /bin/getimage ]
then
    if [ -e /usr/local/auxfs/bin/getimage ]; then
        # if the file doesn't exist in rootfs, link it to file in auxfs.
        echo "link /bin/getimage to auxfs"
        ln -s /usr/local/auxfs/bin/getimage /bin/getimage
    fi
else
    if [ ! -e /usr/local/auxfs/bin/getimage ]; then
        # if the file in auxfs is empty, copy it from rootfs.
        echo "copy /bin/getimage to auxfs"
        cp -a /bin/getimage /usr/local/auxfs/bin/
        cp -a /etc/rtf_version /usr/local/auxfs/
        sync
    fi
fi
if [ ! -e /bin/stats ]
then
    if [ -e /usr/local/auxfs/bin/stats ]; then
        # if the file doesn't exist in rootfs, link it to file in auxfs.
        echo "link /bin/stats to auxfs"
        ln -s /usr/local/auxfs/bin/stats /bin/stats
    fi
else
    if [ ! -e /usr/local/auxfs/bin/stats ]; then
        # if the file in auxfs is empty, copy it from rootfs.
        echo "copy /bin/stats to auxfs"
        cp -a /bin/stats /usr/local/auxfs/bin/
        cp -a /etc/rtf_version /usr/local/auxfs/
        sync
    fi
fi
if [ ! -e /bin/noisetest ]
then
    if [ -e /usr/local/auxfs/bin/noisetest ]; then
        # if the file doesn't exist in rootfs, link it to file in auxfs.
        echo "link /bin/noisetest to auxfs"
        ln -s /usr/local/auxfs/bin/noisetest /bin/noisetest
    fi
else
    if [ ! -e /usr/local/auxfs/bin/noisetest ]; then
        # if the file in auxfs is empty, copy it from rootfs.
        echo "copy /bin/noisetest to auxfs"
        cp -a /bin/noisetest /usr/local/auxfs/bin/
        cp -a /etc/rtf_version /usr/local/auxfs/
        sync
    fi
fi
# added by Scheng end
# added by weichen, 20160711. #8999, move qharvestd to auxfs for small size f/w. 
if [ ! -e /bin/qharvestd ]
then
    if [ -e /usr/local/auxfs/bin/qharvestd ]; then
        # if the file doesn't exist in rootfs, link it to file in auxfs.
        echo "link /bin/qharvestd to auxfs"
        ln -s /usr/local/auxfs/bin/qharvestd /bin/qharvestd
    fi
else
    if [ ! -e /usr/local/auxfs/bin/qharvestd ]; then
        # if the file in auxfs is empty, copy it from rootfs.
        echo "copy /bin/qharvestd to auxfs"
        cp -a /bin/qharvestd /usr/local/auxfs/bin/
        cp -a /etc/rtf_version /usr/local/auxfs/
        sync
    fi
fi
# added by weichen end
# added by weichen, 20171006,F#12251, move vodsl to auxfs for small size f/w. 
if [ ! -e /bin/vodsl ]
then
    if [ -e /usr/local/auxfs/bin/vodsl ]; then
        # if the file doesn't exist in rootfs, link it to file in auxfs.
        echo "link /bin/vodsl to auxfs"
        ln -s /usr/local/auxfs/bin/vodsl /bin/vodsl
    fi
else
    if [ ! -e /usr/local/auxfs/bin/vodsl ]; then
        # if the file in auxfs is empty, copy it from rootfs.
        echo "copy /bin/vodsl to auxfs"
        cp -a /bin/vodsl /usr/local/auxfs/bin/
        cp -a /etc/rtf_version /usr/local/auxfs/
        sync
    fi
fi
# 20160930-weichen-#9646, check routerPassword exists in /data/scratchpad otherwise copy scratchpad from /usr/local/auxfs/ if there is a backup scratchpad.
pspctl dump routerPassword > /dev/null
if [ $? == 255 ] 
then
    if [ -f /usr/local/auxfs/scratchpad ]; then
       # the scratchpad backup during production exists
       echo "psp routePassword is not configured or corrupted, copy /usr/local/auxfs/scratchpad to /data"
       cat /etc/rtf_version >> /usr/local/auxfs/scratchpad.log
       echo "" >> /usr/local/auxfs/scratchpad.log
       echo "psp routePassword is not configured or corrupted, copy /usr/local/auxfs/scratchpad to /data" >> /usr/local/auxfs/scratchpad.log
       cp -a /usr/local/auxfs/scratchpad /data/scratchpad
       sync
    elif [ -f /usr/local/auxfs/scratchpad_bak ]; then
       # the scratchpad backup by firmware update exists
       echo "psp routePassword is not configured or corrupted, copy /usr/local/auxfs/scratchpad_bak to /data/scratchpad"
       cat /etc/rtf_version >> /usr/local/auxfs/scratchpad.log
       echo "" >> /usr/local/auxfs/scratchpad.log
       echo "psp routePassword is not configured or corrupted, copy /usr/local/auxfs/scratchpad_bak to /data/scratchpad" >> /usr/local/auxfs/scratchpad.log
       cp -a /usr/local/auxfs/scratchpad_bak /data/scratchpad
       sync
    else
       echo "psp routePassword is not configured or corrupted but there is also no backup scratchpad"
    fi
fi
# 20160930-weichen-#9646, end

if [ -e /usr/bin/fullimage ]
then
    # update the files in auxfs
    echo "/usr/bin/fullimage exists, update the files to auxfs"

    echo "copy topaz-linux.lzma.img to auxfs"
    cp -a /topaz-linux.lzma.img /usr/local/auxfs/wifi5G/

    echo "copy wl.ko to auxfs"
    cp -a /lib/modules/3.4.11-rt19+/extra/wl.ko /usr/local/auxfs/wifi2_4G/

    echo "copy /bin/tcpdump to auxfs"
    cp -a /bin/tcpdump /usr/local/auxfs/bin/

    echo "copy /bin/openssl to auxfs"
    cp -a /bin/openssl /usr/local/auxfs/bin/

# added by Scheng
    if [ -e /bin/curl ]
    then
        echo "copy /bin/curl to auxfs"
	cp -a /bin/curl /usr/local/auxfs/bin/
    fi

    if [ -e /bin/reset ]
    then
        echo "copy /bin/reset to auxfs"
	cp -a /bin/reset /usr/local/auxfs/bin/
    fi
	
    if [ -e /bin/netper ]
    then
        echo "copy /bin/netper to auxfs"
	cp -a /bin/netper /usr/local/auxfs/bin/
    fi

    if [ -e /bin/netinf ]
    then
        echo "copy /bin/netinf to auxfs"
	cp -a /bin/netinf /usr/local/auxfs/bin/
    fi

    if [ -e /bin/getigmptables ]
    then
        echo "copy /bin/getigmptables to auxfs"
	cp -a /bin/getigmptables /usr/local/auxfs/bin/
    fi

    if [ -e /bin/devinf ]
    then
        echo "copy /bin/devinf to auxfs"
	cp -a /bin/devinf /usr/local/auxfs/bin/
    fi

    if [ -e /bin/loadfw ]
    then
        echo "copy /bin/loadfw to auxfs"
	cp -a /bin/loadfw /usr/local/auxfs/bin/
    fi

    if [ -e /bin/getimage ]
    then
        echo "copy /bin/getimage to auxfs"
	cp -a /bin/getimage /usr/local/auxfs/bin/
    fi

    if [ -e /bin/stats ]
    then
        echo "copy /bin/stats to auxfs"
	cp -a /bin/stats /usr/local/auxfs/bin/
    fi

    if [ -e /bin/noisetest ]
    then
        echo "copy /bin/noisetest to auxfs"
	cp -a /bin/noisetest /usr/local/auxfs/bin/
    fi
# added by Scheng end
# added by weichen, 20160711. #8999, move qharvestd to auxfs for small size f/w.
    if [ -e /bin/qharvestd ]
    then
        echo "copy /bin/qharvestd to auxfs"
        cp -a /bin/qharvestd /usr/local/auxfs/bin/
    fi
# added by weichen end
# added by weichen, 20171006,F#12251, move vodsl to auxfs for small size f/w. 
    if [ -e /bin/vodsl ]
    then
        echo "copy /bin/vodsl to auxfs"
        cp -a /bin/vodsl /usr/local/auxfs/bin/
    fi
# added by weichen end

#20170717-weichen-#11722, remove enableTelnet psp value for AR profile when FW is upgraded.
RTF_PROFILE=`version |grep 'RTF Profile:'|awk '{print $3}'`
if [ "${RTF_PROFILE}" == "NV" ]; then
    ENABLE_TELNET=`pspctl list |grep enableTelnet`
    if [ "${ENABLE_TELNET}" == "enableTelnet" ]; then
        echo "psp enableTelnet exists, delete it"
        pspctl delete enableTelnet
        # we should update /usr/local/auxfs/scratchpad_bak. (backup by fimrware update)
        pspctl dump routerPassword > /dev/null
        if [ $? != 255 ]
        then
            echo "cp -a /data/scratchpad /usr/local/auxfs/scratchpad_bak"
            cat /etc/rtf_version >> /usr/local/auxfs/scratchpad.log
            echo "" >> /usr/local/auxfs/scratchpad.log
            echo "cp -a /data/scratchpad /usr/local/auxfs/scratchpad_bak" >> /usr/local/auxfs/scratchpad.log
            cp -a /data/scratchpad /usr/local/auxfs/scratchpad_bak
        fi
    fi
fi

# 20160930-weichen-#9646, if routerPassword exists in /data/scratchpad and there is no scratchpad backup in /usr/local/auxfs/, we backup /data/scratchpad to /usr/local/auxfs/scratchpad_bak. (backup by fimrware update)
    pspctl dump routerPassword > /dev/null
    if [ $? != 255 ] 
    then
        if [ ! -f /usr/local/auxfs/scratchpad ] && [ ! -f /usr/local/auxfs/scratchpad_bak ]; then
            echo "cp -a /data/scratchpad /usr/local/auxfs/scratchpad_bak"
            cat /etc/rtf_version >> /usr/local/auxfs/scratchpad.log
            echo "" >> /usr/local/auxfs/scratchpad.log
            echo "cp -a /data/scratchpad /usr/local/auxfs/scratchpad_bak" >> /usr/local/auxfs/scratchpad.log
            cp -a /data/scratchpad /usr/local/auxfs/scratchpad_bak
        fi
    fi
# 20160930-weichen-#9646, end

    echo "copy /etc/rtf_version to auxfs"
    cp -a /etc/rtf_version /usr/local/auxfs/

    echo "remove /usr/bin/fullimage"
    rm -f /usr/bin/fullimage
    sync
fi
# commented by weichen, 20150916. This script will be called by other script which will re-mount rootfs to read-only after this script is done.
#mount -o remount,ro  /dev/mtdblock0 /

