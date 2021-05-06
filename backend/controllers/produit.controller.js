const Produit = require('../models/produit.model.js');
const fs = require('fs');
const path=require('path');
const appDir = path.dirname(require.main.filename);
const p=path.join(appDir,'app','data','produit.json');

// Create and Save a new produit
exports.save= (req, res) =>{
    
    var produit = new Produit({
        idProd:req.body.idProd||"Untitled",
        categorie:req.body.categorie||"Untitled",
        refProd :req.body. refProd||"Empty  refProd",
        labelleProd:req.body. labelleProd||"Un labelleProdd",
        numlot :req.body.numlot||"Emptynumlot", 
        mode:req.body.mode||"Unmoded",
        prixUnit :req.body.prixUnit||"Empty Content",
        type :req.body.type||"Empty Content",
 });
    
    fs.readFile(p,(err,fileContent)=>{
        let products=[];
        if (!err){
            products=JSON.parse(fileContent);
        }
        products.push(produit);

        fs.writeFile(p,JSON.stringify(products),err=>{
            ///////////////////////////////////////////////////////  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            if(err) console.log(err);
            

        });
    });
};
exports.findAll=(req,res)=>{
    fs.readFile(p,(err,fileContent) => {
        console.log(JSON.parse(fileContent));
    });
};




exports.creerProduit=  async(req, res) =>{
     try {




        
//note= new Produit(req.body);

   var produit = new Produit({
       idProd:req.body.idProd||"Untitled",
       categorie:req.body.categorie||"Untitled",
       refProd :req.body. refProd||"Empty  refProd",
       labelleProd:req.body. labelleProd||"Un labelleProdd",
       numlot :req.body.numlot||"Emptynumlot", 
       mode:req.body.mode||"Unmoded",
       prixUnit :req.body.prixUnit||"Empty Content",
       type :req.body.type||"Empty Content",
});

        var result = await produit.save();
        res.send(result);
}
catch (error) {   res.status(500).send(error);
};
};
// Retrieve and return all notes from the database.
exports.afficherToutProduit = (req, res) => {
  Note.find()
    .then(produits => {
        res.send(produits);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving produits."
        });
    });
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Update a note identified by the noteId in the request

exports.modifierProduit = async(request, response) => {
    try 
    {
    var n =  await Produit.findById({ _id: request.params.noteId }).exec();
    idProd:req.body.idProd||"Untitled";
    categorie:req.body.categorie||"Untitled";
    refProd :req.body. refProd||"Empty  refProd";
    labelleProd:req.body. labelleProd||"Un labelleProdd";
    numlot :req.body.numlot||"Emptynumlot"; 
    mode:req.body.mode||"Unmoded";
    prixUnit :req.body.prixUnit||"Empty Content";
    type :req.body.type||"Empty Content";
         var result = await n.save();
        response.send(result);
         }
    catch (error){
            response.status(400).send("unable to update the database");
      }
};
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Delete a note with the specified noteId in the request
exports.supprimerProduit= async (request, response) => {
    try {
        
        var result = await Produit.deleteOne({ _id: request.params.produitId }).exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
};