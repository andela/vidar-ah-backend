import slug from 'slug';

export default validString => slug(validString, { lower: true });
