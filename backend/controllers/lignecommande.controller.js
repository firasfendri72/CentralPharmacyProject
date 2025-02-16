const LigneCommande = require('../models/lignecommande.model.js');
const Affectation = require('../models/affectation.model.js');
const Commande = require('../models/commande.model.js');
const Produit = require('../models/produit.model.js');
const fs = require('fs');
const path = require('path');
const appDir = path.dirname(require.main.filename);
const p = path.join(appDir, '../', 'data', 'produit.json');
const pp = path.join(appDir, '../', 'data', 'transport.json');

exports.save = (req, res) => {
	var lc = new LigneCommande({
		labelleProd: req.body.labelleProd || 'Un labelleProdd',
		prodPrice: req.body.prodPrice || 0,
		qte: req.body.qte || 0,
	});

	fs.readFile(p, (err, fileContent) => {
		let cart = { products: [], totalPrice: 0 };
		if (!err) {
			if (Object.keys(fileContent).length != 0) {
				cart = JSON.parse(fileContent);

				const existingProductIndex = cart.products.findIndex((x) => x.labelleProd === lc.labelleProd);

				console.log(existingProductIndex);
				//const existingProduct = cart.products[existingProductIndex];
				if (existingProductIndex != -1) {
					cart.products[existingProductIndex].qte = cart.products[existingProductIndex].qte + lc.qte;
				} else {
					cart.products.push({ labelleProd: lc.labelleProd, prodPrice: lc.prodPrice, qte: lc.qte });
				}

				//calcul
				cart.totalPrice = cart.totalPrice + lc.prodPrice * lc.qte;
			}
		}
		fs.writeFile(p, JSON.stringify(cart), (err) => {
			///////////////////////////////////////////////////////  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			if (err) console.log(err);
		});
	});
};

exports.saveAff = async (req, res) => {
	try {
		var aff = new Affectation({
			chauffeur: req.body.chauffeur || 'chifour',
			commandes: req.body.commandes || [],
		});

		/////////////////////////////////////////////////////::

		try {
			var c = await Commande.findById({ _id: aff.commandes }).exec();

			c.etatCom = 'En cours';

			var result = await c.save();
			res.send(result);
		} catch (error) {
			res.status(400).send('Unable to update the database');
		}

		////////////////////////////////////////////////////////
		fs.readFile(pp, (err, fileContent) => {
			let cart = [];
			if (!err) {
				if (Object.keys(fileContent).length != 0) {
					cart = JSON.parse(fileContent);
				}
			}
			//const existingCommandIndex = cart.commandes.findIndex((com) => com === '_id');
			//const existingCommand = cart.commandes[existingCommandIndex];
			//if (existingCommand) {
			//cart.commandes[existingCommandIndex].qte = cart.products[existingCommandIndex].qte + 1;
			//} else {s

			cart.push({ chauffeur: aff.chauffeur, commandes: aff.commandes });

			//}
			fs.writeFile(pp, JSON.stringify(cart), (err) => {
				///////////////////////////////////////////////////////  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				if (err) console.log(err);
			});
		});
	} catch (err) {
		res.status(500).send(error);
	}
};

exports.livree = async (req, res) => {
	/////////////////////////////////////////////////////::

	try {
		var c = await Commande.findById({ _id: req.body.id }).exec();

		c.etatCom = 'livreé';
		c.etatPayCom = 'payée';
		var result = await c.save();
		res.send(result);
	} catch (error) {
		res.status(400).send('Unable to update the database');
	}

	//calcul

	////////////////////////////////////////////////////////
};

// Create and Save a new Note
exports.creerL = async (req, res) => {
	try {
		var lc = new LigneCommande({
			qte: req.body.qte || 0,
		});

		var result = await depot.save();
		res.send(result);
	} catch (error) {
		res.status(500).send(error);
	}
};
// Retrieve and return all depots from the database.
exports.afficherTout = async (req, res) => {
	fs.readFile(pp, (err, fileContent) => {
		let cart = [];
		if (!err) {
			if (Object.keys(fileContent).length != 0) {
				res.send(JSON.parse(fileContent));
			}
		}
	});
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Update a note identified by the noteId in the request

exports.modifier = async (request, response) => {
	try {
		Commande.findById(ObjectId(request.body.id)).then((commande) => {
			commande.etatCom = 'Livrée';
			commande.etatPayCom = 'Payée';
			commande.save();
		});
	} catch (error) {
		response.status(400).send('unable to update the database');
	}
};
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Delete a note with the specified noteId in the request
exports.supprimer = async (req, res) => {
	let cart = [];
	fs.readFile(p, (err, fileContent) => {
		if (Object.keys(fileContent).length != 0) {
			cart = JSON.parse(fileContent);
		}
		let product = cart.products;
		for (let index = 0; index < product.length; index++) {
			let element = product[index];
			if (element != null && element.labelleProd === req.body.labelleProd) {
				console.log(product[index].qte);
				//

				cart.totalPrice = cart.totalPrice - product[index].prodPrice * product[index].qte;

				product.splice(index, 1);
				fs.writeFile(p, JSON.stringify(cart), (err) => {
					if (err) console.log(err);
				});
			}
		}

		//calcul
	});
};
