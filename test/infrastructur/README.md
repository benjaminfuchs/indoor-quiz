### setup

```
$ sudo apt install openjdk-11-jre-headless
$ wget https://selenium-release.storage.googleapis.com/3.141/selenium-server-standalone-3.141.59.jar
$ sudo apt install firefox
$ sudo apt install firefox-geckodriver
```

### start hub

`$ java -jar selenium-server-standalone-3.141.59.jar -role hub -hubConfig hubConfig.json`

### start node

`$ java -Dwebdriver.chrome.driver=chromedriver.exe -jar selenium-server-standalone-3.141.59.jar -role node -nodeConfig nodeConfig.json`
