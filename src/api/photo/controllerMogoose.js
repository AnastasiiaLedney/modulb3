import Photo from "./model";

function makeQueryObject(query) {
    let result = {};
    if (query.maxlikes && query.minlikes) {
        result.pages = {
            $and: [{
                $lte: parseInt(query.maxlikes)
            }, {
                $gte: parseInt(query.minlikes)
            }]
        };
    }
    if (query.author) {
        result.authors = {
            $elemMatch: {
                $eq: query.author
            }
        }
    }
   
    return result;
};

const photoControler = {
 
    get: async (req, res) =>{
        try {
            const photos = await Photo.find(makeQueryObject(req.query));
            setTimeout( ()=> res.send(photos), 2000);
        }
        catch (error){
            console.error(error);
            res.status(500).send(error);
        }
    },
    getById: async (req, res) =>{
        try {
            const photo = await Photo.findById(req.params.id);
            if (photo) 
                res.send(photo);
            else
                res.status(404).send("Not Found");             
        }
        catch (error){
            console.error(error);
            res.status(500).send(error);
        }
    },
   
    patch: async (req, res) =>{
        try {
            const photo = await Photo.findOneAndUpdate(req.params.id, req.body, {
                returnOriginal: false
            } );
            if (photo) 
                res.send(photo);
            else
                res.status(404).send("Not Found");             
        }
        catch (error){
            console.error(error);
            res.status(500).send(error);
        }
    },
    put: async (req,res)=>{
        try{
            let arr = req.body;
            if (arr && arr.length)
            {
                const photos = await Book.insertMany(arr);
                res.send(photos);
            }
        } catch (e){
            res.status(500).send(e);
        }
    }
}


export default photoControler;