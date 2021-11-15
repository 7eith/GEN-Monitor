"""********************************************************************"""
"""                                                                    """
"""   [Gen_Monitor] monitor.py                                         """
"""                                                                    """
"""   Author: seith <seith@synezia.com>                                """
"""                                                                    """
"""   Created: 15/11/2021 17:14:21                                     """
"""   Updated: 15/11/2021 18:18:18                                     """
"""                                                                    """
"""   Synezia Soft. (c) 2021                                           """
"""                                                                    """
"""********************************************************************"""

import requests

from datetime import datetime
from bs4 import BeautifulSoup
from discord_webhook import DiscordWebhook, DiscordEmbed

def log(message):
	time = datetime.now().strftime("%H:%M:%S:%f")[:-3]

	print(f"[{time}] {message}")
	
class Monitor():

	def __init__(self, webhooks):

		self.webhooks = webhooks
		self.session = requests.Session()
		self.payments = -1

		authStatus = self.auth("USERNAME_GEN", "PASSWORD_GEN")

		if (authStatus is True):
			log("Successfully authentificated! ")
			log("Scrapping payments...")
			
			self.scrape()
		else:
			log("Authentification failed! Check your login. ")

	def auth(self, username, password):
		log("Starting authentificating... ")
		
		data = {
			'identifiant': username,
			'codeConnexion': password,
			'action': 'Envoyer'
		}

		response = self.session.post('https://dse.phm.education.gouv.fr/suiviGEN/accueil', data=data)

		if (username in response.text):
			return (True)
		else:
			return (False)

	def scrape(self):

		params = (
			('rqRang', '0'),
		)

		response = self.session.get('https://dse.phm.education.gouv.fr/suiviGEN/notif', params=params)

		soup = BeautifulSoup(response.text, "html.parser")
		tablesLine = soup.find_all("tr")
		payments = len(tablesLine) - 1
		
		if (self.payments == -1):
			self.payments = payments
			log("Successfully initializated Monitor, next time i see a change i will ping.")
		else:
			changes = payments - self.payments
			log(f"Change Detected! Found {changes} payments incomming!")
			self.notify(changes)
			
	def notify(self, newPayments):

		for webhookURL in self.webhooks:

			try:
				if (webhookURL):
					webhook = DiscordWebhook(
						url=webhookURL,
						username=f'GEN Monitor',
						avatar_url='https://github.com/SyneziaSoft/Public/blob/main/images/synezia.gif?raw=true'
					)

					embed = DiscordEmbed(
						timestamp="now",
						color=7484927,
						title="Detected new payment(s) incoming!"
					)

					embed.set_thumbnail(
						url="https://www.grandeecolenumerique.fr/themes/custom/gen/images/logo-blanc-HD.png"
					)

					embed.set_author(
						name="Detected new payment(s)",
						url="https://dse.phm.education.gouv.fr/suiviGEN/accueil",
						icon_url="https://github.com/SyneziaSoft/Public/blob/main/images/success.gif?raw=true",
					)

					embed.add_embed_field(name="New payment(s)", value=f"{newPayments} new payment(s)!", inline=False)

					embed.set_footer(text=f"GEN Monitor - Powered by seith#0001", icon_url='https://github.com/SyneziaSoft/Public/blob/main/images/synezia.gif?raw=true')
					embed.set_timestamp()

					webhook.add_embed(embed)
					webhook.execute()

			except Exception as error:
				log("Error while sending webhooks!")
				log(error)
				
Monitor(
	webhooks=["DISCORD_URL", "ANOTHER_DISCORD_URL_YOU_WANT"]
)