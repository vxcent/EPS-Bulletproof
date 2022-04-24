# EPS-Bulletproof
This is Bulletproof Chrome extension that can protect user's privacy right of CCPA.

### Web Scraping
1. Generate a list of top 1000 websites based on their traffic
2. Extract links to each website's privacy policy page
3. Search if CCPA or California Consumer Privacy Act is stated in each privacy policy page
4. Export a list of 1000 websites and result of checking CCPA compliance

### Features
1. Detection of CCPA/GPC Compliance (Current demo list of complaince is hardcoded)
2. Fine-grained configuration of privacy preference
3. Sending GPC-style request to service provide to indicate user's privacy preference
4. Location Protection (not finished yet because Chrome restrict extension's accessibility of location Manifest V3)

### Set up
1. Clone this project
2. Visit the management page of Chrome Extension through [chrome://extensions/](chrome://extensions/)
3. Click the *Load Unpacked* to load the folder *bulletproof*


![image](https://github.com/vxcent/EPS-Bulletproof/blob/main/demo/setup.png)

### Demo
1. When visiting a new url, our extension will show whether this host is CCPA/GPC Compliance. The current detection result might be incorrect, but we can easily configure the list of complaint websites.

![image](https://github.com/vxcent/EPS-Bulletproof/blob/main/demo/demo_detection.png)

2. User can configure the privacy preference. After configuration, our extensions will send a POST request to the host to indicate user's preference. The service provider should treat user's data based on this preference

![image](https://github.com/vxcent/EPS-Bulletproof/blob/main/demo/demo_fine_grained.png)

The request can be click the *service worker*, right click "inspect", and then switch to the network. The current request will receive a 404 response becasue no service provider follow our protocol yet :joy:.

![image](https://github.com/vxcent/EPS-Bulletproof/blob/main/demo/demo_request.png)

![image](https://github.com/vxcent/EPS-Bulletproof/blob/main/demo/demo_request_header.png)

 

