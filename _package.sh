#!/bin/bash
glib-compile-schemas ./worksets@blipk.xyz/schemas
#glib-compile-resources ./res/org.kronosoul.worksets.xml
#mv ./res/org.kronosoul.worksets.gresource ./worksets@blipk.xyz
cd notification-dismiss@kronosoul.xyz
zip -r ../notification-dismiss@kronosoul.xyz *
cd ..
zip notification-dismiss@kronosoul.xyz install.sh