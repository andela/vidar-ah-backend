import dotenv from 'dotenv';
import { Article } from '../models';
import newArticles from './articles';

dotenv.config();

export default async () => {
  try {
    await Article.bulkCreate(newArticles);
  } catch (err) {
    throw new Error('Error creating articles');
  }
};
