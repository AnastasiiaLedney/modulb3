import {
    MongoClient,
    ObjectID
} from 'mongodb';

const url = 'mongodb+srv://student:i295Anz59j94lTIE@cluster0.n9t74.gcp.mongodb.net/bookMongooseDB?retryWrites=true&w=majority'; // адреса сервера

const dbName = 'PhotoDB'; 

const collectiionName = "photos"; 

function makeQueryObject(query) {
    let result = {};
    console.log(query);
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
 
    console.log(result);
    return result;
};


const photoControler = {
    get_async: async (req, res) => { 
        try {
            const client = new MongoClient(url, {
                useUnifiedTopology: true
            });
            const connection = await client.connect(); 
            const photos = connection.db(dbName).collection(collectiionName);         
            const result = await books
                .find(
                  
                    makeQueryObject(req.query)
                )
                .toArray();          
            res.send(result); 
            client.close();
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    get_promise: (req, res) => {    
        const client = new MongoClient(url, {
            useUnifiedTopology: true
        }); 
        client.connect() 
            .then(connection => {
                const photos = connection.db(dbName).collection(collectiionName); 
                books.find(makeQueryObject(req.query)).toArray()
                    .then(result => {
                        client.close();
                        res.send(result);
                    })
                    .catch(error => { 
                        throw error;
                    });
            })
            .catch(error => {
                console.log(error);
                res.status(500).send(error);
            });
    },
    get_callback: (req, res) => {  
        function logError(error){ 
            console.log(error);
            res.status(500).send(error);
        }   

        const client = new MongoClient(url, {
            useUnifiedTopology: true
        });
        client.connect(
            (error, connection) => { 
                if (error) { 
                    logError(error);
                } else {
                    const photos = connection.db(dbName).collection(collectiionName);
                   
                    books.find(makeQueryObject(req.query),
                        (error, result) => {
                            if (error) {
                                logError(error);
                            } else {
                                result.toArray(
                                    (error, result) => {
                                        if (error) {
                                            logError(error);
                                        } else {
                                            connection.close();
                                            res.send(result);
                                        }
                                    }
                                );
                            }
                        }
                    );

                }
            }
        );
    },
    getById: async (req, res) => {
        try {
            const client = new MongoClient(url, {
                useUnifiedTopology: true
            });

            const connection = await client.connect();
            const photos = connection.db(dbName).collection(collectiionName);
            const result = await books.findOne({
                _id: ObjectID(req.params.id)
            }); 
            if (result) 
                res.send(result);
            else
                res.status(404).send("Not Found");
            client.close();
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    post: async (req, res) => {
        try {
            const client = new MongoClient(url, {
                useUnifiedTopology: true
            });

            const connection = await client.connect();
            const photos = connection.db(dbName).collection(collectiionName);
            const result = await photos.insertOne(req.body);
            res.send(result.ops);
            client.close();
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
   
    patch: async (req, res) => {
        try {
            const client = new MongoClient(url, {
                useUnifiedTopology: true
            });

            const connection = await client.connect();
            const photos = connection.db(dbName).collection(collectiionName);
            const result = await photos.findOneAndUpdate({
                    _id: ObjectID(req.params.id)
                },
                {
                    $set: req.body
                }, );
            if (result.value)
                res.send(result.value);
            else
                res.status(404).send("Not Found");
            client.close();
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
}

export default bookControler;