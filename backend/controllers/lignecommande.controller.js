

const LigneCommande = require('../models/lignecommande.model.js');
const Affectation = require('../models/affectation.model.js');
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
			cart = JSON.parse(fileContent);
		}
		const existingProductIndex = cart.products.findIndex((prod) => prod === 'idProd');
		const existingProduct = cart.products[existingProductIndex];
		if (existingProduct) {
			cart.products[existingProductIndex].qte = cart.products[existingProductIndex].qte + 1;
		} else {
			cart.products.push({ labelleProd: lc.labelleProd, prodPrice: lc.prodPrice, qte: lc.qte });
		}
		//calcul
		cart.totalPrice = cart.totalPrice + lc.prodPrice * lc.qte;
		fs.writeFile(p, JSON.stringify(cart), (err) => {
			///////////////////////////////////////////////////////  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			if (err) console.log(err);
		});
	});
};


exports.saveAff = (req, res) => {
	try{
	var aff = new Affectation({
		chauffeur: req.body.chauffeur || 'chifour',
		commandes: req.body.commandes || [],
		
	});

	fs.readFile(pp, (err, fileContent) => {
	
		let cart = [{ chauffeur: "", commandes:[] }];
		if (!err) {
			if (Object.keys(fileContent).length != 0){
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

}catch (err){
	res.status(500).send(error);
}
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
exports.afficherTout = (req, res) => {
	Depot.find()
		.then((depots) => {
			res.send(depots);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Some error occurred while retrieving depots.',
			});
		});
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Update a note identified by the noteId in the request

exports.modifier = async (request, response) => {
	try {
		var d = await Depot.findById({ _id: request.params.depotId }).exec();

		d.idDepot = req.body.idProd || 'Updated Depot';
		d.qte = req.body.qte || 'Empty Content';

		var result = await d.save();
		response.send(result);
	} catch (error) {
		response.status(400).send('unable to update the database');
	}
};
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Delete a note with the specified noteId in the request
exports.supprimer = async (req, res) => {
	fs.readFile(p, (err, fileContent) => {
		cart = JSON.parse(fileContent);
		let product = cart.products;
		for (let index = 0; index < product.length; index++) {
			let element = product[index];
			if (element != null && element.labelleProd === req.body.labelleProd) {
				delete product[index];
				fs.writeFile(p, JSON.stringify(cart), (err) => {
					if (err) console.log(err);
				});
			}
		}

		//calcul
	});
};
