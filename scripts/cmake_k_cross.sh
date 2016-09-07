#!/bin/sh

CXX=mpiFCCpx CC=mpifccpx /opt/local/bin/cmake -H. -Bbuild -DHIVE_BUILD_K_CROSS_COMPILE=On -DHIVE_BUILD_WITH_MPI=On -DHIVE_BUILD_WITH_CDMLIB=On -DHIVE_BUILD_WITH_HDMLIB=On -DHIVE_BUILD_WITH_PDMLIB=On -DHIVE_BUILD_WITH_UDMLIB=On -DHIVE_BUILD_WITH_COMPOSITOR=On -DBUILD_SHARED_LIBS=Off -DHIVE_BUILD_WITH_OPENGL=Off -DHIVE_BUILD_WITH_NANOMSG=Off -DBUILD_SHARED_LIBS=On
