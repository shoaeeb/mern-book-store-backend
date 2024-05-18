import { auth } from "express-oauth2-jwt-bearer";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/userModel";

declare global {
  namespace Express {
    interface Request {
      auth0Id: string;
      userId: string;
    }
  }
}

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE as string,
  issuerBaseURL: process.env.AUTH0_ISSUE_BASE_URL as string,
  tokenSigningAlg: "RS256",
});

export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.sendStatus(401);
    return;
  }
  const token = authorization.split(" ")[1];

  const decoded = jwt.decode(token) as JwtPayload;
  const auth0Id = decoded.sub;

  const user = await User.findOne({
    auth0Id,
  });
  if (!user) {
    res.sendStatus(401);
    return;
  }
  req.auth0Id = user.auth0Id.toString();
  req.userId = user._id.toString();
  next();
};
