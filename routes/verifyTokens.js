import Jwt  from "jsonwebtoken";

// Verifying if the token is there or valid 
export const verifyToken=(req,res,next)=>{
    const authHeader= req.headers.token
    if(authHeader) {
        const token = authHeader.split(" ")[1];
        Jwt.verify(token, process.env.JWT_SECRET, (err,user)=>{
            if(err) res.status(403).json("Token is not valid!");
            req.user = user;
            next();
        })
    }
    else{
        return res.status(401).json("No token found!");
    }
}

// verify token and if the user is authorized to access
export const verifyTokenAndAuthorization=(req,res,next)=>{
    verifyToken(req, res, ()=>{
        if(req.user.id===req.params.id || req.user.isAdmin){
            next()
        } else{
            res.status(403).json("You are not authorized")
        }
    } )
}

// verifying token and seeing if the user is the ADMIN
export const verifyTokenAndAdmin=(req,res,next)=>{
    verifyToken(req, res, ()=>{
        if(req.user.isAdmin){
            next()
        } else{
            res.status(403).json("You are not authorized")
        }
    } )
}
