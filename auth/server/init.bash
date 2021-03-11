# sequelize model:generate --name user \
#   --attributes email:string,password:string
sequelize model:generate --name auth --attributes userID:integer,token:string,refresh_token:string,scope:string,token_type:string,expiry_date:stringg