import slug from 'slug';
import shortId from 'shortid';

export default title => (`${slug(title, { lower: true })}-${shortId.generate()}`).toLowerCase();
