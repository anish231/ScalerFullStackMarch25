const mongoose = require("mongoose");

const MovieModel = require("../Model/movie.model");
const ShowModel = require("../Model/show.model");
const TheatreModel = require("../Model/theatre.model");


const createNewShow = async (req,res)=>{

    const {theatre,movie} = req.body;

       try{

        const theatreObj = await TheatreModel.findById(theatre);

        if(theatreObj==null){
            return res.status(400).send({
                success:false,
                message:"TheatreId passed is invalid"
            })
        }

        const movieObj = await MovieModel.findById(movie);

        if(movieObj==null){

            return res.status(400).send({
                success:false,
                message:"MovieId passed is invalid"
            })

        }


            const newShow = new ShowModel(req.body);

            const dbResponse = await newShow.save();

            if(dbResponse!=null){
                return res.status(201).send({success:true,message:"New Show Created Sucessfully", 
                    data:dbResponse
                })
            }
        
    }catch(err){

        return res.status(500).send({success:false,message:"Internal Server Error",err});

    }


}


const getAllShows = async (req,res)=>{

       try{

            const allShows = await ShowModel.find({}).populate("theatre").populate("movie");

            return res.status(200).send({
                success:true,
                message:"Shows fetched successfully",
                data:allShows
            })


    }catch(err){
       return res.status(500).send({message:"Internal Server Error",err});
    }



}

const getShowById = async (req,res)=>{

    try{

        const showId = req.params.id;


        if(!mongoose.Types.ObjectId.isValid(showId)){

            return res.status(400).send({
                success:false,
                message:"Show Id format is invalid"
            })
        }
                


        const showDetails = await ShowModel.findById(showId).populate("theatre").populate("movie");;


        if(!showDetails){

            return res.status(400).send({
                success:false,
                message:`ShowId ${showId} doesnot exists in our systems`
            })
        }

           return res.status(200).send({
                success:true,
                message:"Show Data Fetched Successfully",
                data:showDetails
            })


    }catch(err){
        
        return res.status(500).send({success:false,message:"Internal Server Error",err});

    }




}


const getTheatesAndShowsByMovieId = async (req,res)=>{

    try{

        const movieId = req.params.movieId;
        const showDate1 = req.query.showDate;

        console.log(movieId);
        console.log(showDate1);


        if(!mongoose.Types.ObjectId.isValid(movieId)){

            return res.status(400).send({
                success:false,
                message:"movie Id format is invalid"
            })
        }

        const movieObj = await MovieModel.findById(movieId);


        if(movieObj==null){

            return res.status(400).send({
                success:false,
                message:"movie Id is invalid"
            })

        };

        // const allShows2 = await ShowModel.find({movie:movieId})
        // console.log(allShows2);

        const targetdate= new Date(showDate1);

        //const start = new Date(`${showDate1}T00:00:00.000Z`)
        const startDate= new Date(showDate1);
        startDate.setUTCHours(0,0,0,0);
        //const end = new Date(`${showDate1}T23:59:59.999Z`)
        const endDate=new Date(showDate1);
        endDate.setUTCHours(23,59,59,999);



        // console.log(startDate);
        // console.log(endDate);

        const allShows = await ShowModel.find({
        movie: movieId,
        showDate: {
        $gte: startDate,
        $lte: endDate
        }
        }).populate('theatre').populate('movie');
        // console.log(allShows);

        let showsByTheatreId = {};

        allShows.forEach((show)=>{

            console.log(show.showTime+" "+show.theatre._id);

            const theatreId= show.theatre._id;

            if(showsByTheatreId[theatreId]==null){
                showsByTheatreId[theatreId] = [];
                //showsByTheatreId[theatreId].push(show);
                //console.log(showsByTheatreId);
                console.log("1");
            }

          
            console.log("2");
            showsByTheatreId[theatreId].push(show);
            console.log("3");
            

        })

        console.log(showsByTheatreId);


        return res.status(200).send({
            success:true,
            data:showsByTheatreId
        })


     


    }catch(err){
        console.log(err);
        return res.status(500).send({success:false,message:"Internal Server Error",err:err.message});

    }




}




module.exports = {createNewShow, getAllShows, getShowById, getTheatesAndShowsByMovieId};