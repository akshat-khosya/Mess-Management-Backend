import env from 'dotenv';
env.config();
export default{
    port:process.env.PORT,
    host: 'localhost',
    dbUri: process.env.DB_URI ,
    saltWorkFactor:10,
    accessTokenTtl:"15m",
    refreshTokenTtl:"30d",
    privateKey:process.env.PRIVATE_KEY,
    
}