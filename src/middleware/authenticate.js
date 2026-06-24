import createHttpError from 'http-errors';
import { Session } from '../models/session.js';

export const authenticate = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      throw createHttpError(401, 'Missing access token');
    }

    const session = await Session.findOne({ accessToken });

    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    if (new Date() > session.accessTokenValidUntil) {
      throw createHttpError(401, 'Access token expired');
    }

    req.user = { _id: session.userId };

    next();
  } catch (error) {
    next(error);
  }
};