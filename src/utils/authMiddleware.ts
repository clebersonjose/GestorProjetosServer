import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export default async function (request: Request, response: Response) {
  const authHeader = request.headers.authorization;
  const [scheme, token] = String(authHeader).split(' ');
  if (scheme == 'Bearer') {
    const authMiddleware = await jwt.verify(
      token,
      String(process.env.JWT_SECRET),
      (err, decoded) => {
        if (err)
          return response
            .status(401)
            .json({
              message: 'Validation fails',
              errors: {
                token: ['Token inválido'],
              },
            })
            .send();
      }
    );
  } else {
    return response
      .status(401)
      .json({
        message: 'Validation fails',
        errors: {
          token: ['Token inválido'],
        },
      })
      .send();
  }
}
