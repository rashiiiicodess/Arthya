import {connect} from "mongoose"; 
export const dbConnect=async()=>{ 
        try{    
                 const mongoDbConnection=await connect(process.env.CONNECTION_STRING)        
                  console.log(`Database connected ${mongoDbConnection.connection.host}` )  
                   }    
        catch(err){
                     console.log(`Database connection failed ${err}`)       
                       process.exit(1);   
          } }