# InterfacesForRanking

To run, replace all instances of "XXX" in app.js with appropriate database access information and run app.js

Database schema can be seen in Schema.png


To access the official server, you can use WinSCP or another SCP client. You can find WinSCP here https://winscp.net/eng/index.php
Upon opening WinSCP, you will be prompted for a host name and a username. I will give you the host name, the username is "bitnami". You will then need to click Advanced and navigate to Authentication. Enter your private key file here.

The remote terminal can be accessed through Putty. Putty is an SSH client. It can be found here. https://putty.org/. Putty will also ask you for a host name, it is the same. Then go to SSH, Auth, and credentials. Enter the private key into the top slot. You can then press "open". After this, you will be prompted for a username. It is also "bitnami". /opt/bitnami/allMethods is the path you need to get to the correct folder.
