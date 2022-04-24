from signal import raise_signal
from io import StringIO
from functools import partial
import string
from unittest import result
import requests
from bs4 import BeautifulSoup
import webbrowser
import csv



import re

myheaders = {
  "user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0", 
  "authority": "www.similarweb.com"
}

webRankSites = {
  "HTMLSTRIP": {
    "url": "https://www.htmlstrip.com/alexa-top-1000-most-visited-websites",
    "selector": "div.col-6"
  }
}
web_list = []
name_list = []
for site in webRankSites:  
  #print("site: " + site)
  resp = requests.get(webRankSites[site]["url"], headers = myheaders)
  soup = BeautifulSoup(resp.text, 'html.parser')  
  items = soup.select(webRankSites[site]["selector"])
  for i in range(2,2002,2):
      item = items[i+1]
      rank_row = item.text.strip()
      #print(str(int(i/2)) + ": "+rank_row)
      #webbrowser.get('C:/Program Files (x86)/Google/Chrome/Application/chrome.exe %s').open_new_tab(rank_row)
      name_list.append(rank_row)
      rank_row = 'https://'+rank_row
      web_list.append(rank_row)

#print(web_list)

word_1 = 'privacy'
word_2 = 'privacy_policy'
word_3 = 'California'
word_4 = 'CCPA'

total_words = []
urls = []
result_list = []

out_list = []

i=0
f = open("all_privacy_links.txt", "w")

i=1

with open('web_list.csv','w') as file:
    for line in web_list:
        file.write(line)
        file.write('\n')


for url in web_list:
    print(str(i)+': '+url)
    privacy_links = " "

    try:
        reqs = requests.get(url,timeout=3)
    except:
       print("Coult not open url")
    
    soup = BeautifulSoup(reqs.text, 'html.parser')
    for link in soup.find_all('a'):
        possible_link = link.get('href')
        possible_link = str(possible_link)
        #print(possible_link.lower())
        if possible_link is not None:
            if (word_1 or word_2) in possible_link.lower() and len(possible_link) < 48:
                if 'https' not in possible_link:
                  privacy_links = url+possible_link
                  
                  #f.write(url+possible_link)
                  #f.write("\n")
                elif 'https' in possible_link:
                  privacy_links = possible_link
                  
                  #f.write(possible_link)
                  #f.write("\n") 
    
    
    print(privacy_links)
    try:
        reqs = requests.get(privacy_links,timeout=3)
    except:
       print("Coult not open url") 
    soup = BeautifulSoup(reqs.content, "html5lib")
    els = soup.find_all("p", string = [word_3, word_4])

    if els is not None:
      result_list = [url, True]
    else:
      result_list = [url, False]
    out_list.append(result_list)


    i+=1
print(out_list)
#f.close()


        