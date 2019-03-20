export default ({ count, limit, offset }) => ({
  totalPages: Math.ceil(count / limit),
  currentPage: Math.ceil(offset / limit)
});
