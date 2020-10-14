<h1 align="center"> :star: GEN-Monitor </h1>
<p align="center">
  <b>A NodeJS Monitor built with Puppeteer</b><br>
  <a href="https://profile.intra.42.fr/users/amonteli"><b>Intra Profile</b> | Discord: Snkh#8559</a>
  <br>
  <br><br>
  <img src="https://www.grandeecolenumerique.fr/themes/custom/gen/images/logo-blanc-HD.png">
  <br><br>
  <i>Marre de ne pas savoir quand la bourse risque de tomber? (si elle tombe). Ce script est parfait.</i>
</p>

## Installation


``` bash
$ git clone https://github.com/iSnkh/GEN-Monitor
$ cd GEN-Monitor
$ npm install
```

## Run

Copy .env.example to .env and fill it
```bash
$ node monitor.js
```

## Create CronTab (Running all day at 10:42)
/!\ You need to be **root**
```bash
echo "42 10 * * * cd $PWD && node monitor.js" >> /etc/crontab
```
