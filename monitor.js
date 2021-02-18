/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   monitor.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: amonteli <amonteli@student.42lyon.fr>      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2020/10/14 06:27:20 by amonteli          #+#    #+#             */
/*   Updated: 2020/10/21 08:10:59 by amonteli         ###   ########lyon.fr   */
/*                                                                            */
/* ************************************************************************** */

const webhook = require("webhook-discord")
const puppeteer = require('puppeteer');
const fs = require('fs');

require('dotenv').config();

async function fetchCache()
{
	return new Promise((resolve) => {
		fs.readFile('cache.json', (err, data) => {
			if (err)
				return (resolve(null));
			resolve(JSON.parse(data));
		});
	});
}

async function start()
{
	let cache = await fetchCache();

	const browser = await puppeteer.launch();

	const page = await browser.newPage();

	await page.goto('https://dse.orion.education.fr/suiviGEN/accueil');

	const usernameSelector = '#identifiant';
	await page.waitForSelector(usernameSelector);
	await page.type(usernameSelector, process.env.IDENTIFIANT);

	const passwordSelector = '#codeConnexion';
	await page.waitForSelector(passwordSelector);
	await page.type(passwordSelector, process.env.PASSWORD);

	await page.click('input[value=Envoyer]');

	await page.goto('https://dse.orion.education.fr/suiviGEN/notif?rqRang=0');
	await page.content();
	await page.waitForSelector('tr');

	const paiementsLength = await page.evaluate(() => {
		return document.querySelectorAll('tr').length - 1;
	});

	await browser.close();

	if (cache)
	{
		if (cache.paiements != paiementsLength)
		{
			const notifications = new webhook.MessageBuilder()
				.setName("GEN Monitor")
				.setAuthor('Nouveaux paiement(s) en cours!', 'https://images-ext-1.discordapp.net/external/CFYl9Pr-nSc5bI5f2daTRaCcdX5QPlYuou8swvjvpTY/%3Fv%3D1/https/cdn.discordapp.com/emojis/652474820788748318.gif')
				.setColor("#19A74A")
				.setThumbnail('https://www.grandeecolenumerique.fr/themes/custom/gen/images/logo-blanc-HD.png')
				.addField('Paiement(s) en cours: ', paiementsLength - cache.paiements)
				.addField('Dernier paiement(s):', cache.last_paiement)
				.setFooter("GEN Monitor")
				.setTime();

			new webhook.Webhook(process.env.WEBHOOK_URL).send(notifications);

			cache = {
				paiements: paiementsLength,
				last_paiement: new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
			}

			console.log(`${paiementsLength - cache.paiements} nouveaux paiement(s) en cours!`)
		}
		else
			console.log(`Aucun paiement en cours...`)
	}
	else
	{
		cache = {
			paiements: paiementsLength,
			last_paiement: new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
		}
	}
	fs.writeFileSync('cache.json', JSON.stringify(cache));
}

setInterval(function(){
	const date = new Date().getDate();
	if (date == pareseInt(process.env.REFRESH_DAY))
		start();
},86400000)
