<h1 align="center"> :star: GEN-Monitor </h1>
<p align="center">
  <b>A Python Monitor built with requests & BS4</b><br>
  <a href="https://profile.intra.42.fr/users/amonteli"><b>Intra Profile</b> | Discord: seith#0001</a>
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
$ pip install requests bs4 discord_webhook
```

## Run

Replace in monitor.py:
```
USERNAME_GEN par votre identifiant
PASSWORD_GEN par votre mot de passes
webhooks=["VOS WEBHOOKS"] une liste rempli de vos webhooks
```
```bash
$ python monitor.py
```

## Create CronTab (Running all day at 10:42)
/!\ You need to be **root**
```bash
echo "42 10 * * * cd $PWD && python monitor.py" >> /etc/crontab
```
