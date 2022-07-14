import env from 'dotenv';
env.config();
export default{
    port:process.env.PORT,
    host: 'localhost',
    dbUri: process.env.DB_URI ,
    saltWorkFactor:10
}