const path = require('path')
const Products = require('./products')
const autoCatch = require('./lib/auto-catch')

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
*/
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {
  // Extract the query parameters
  const { offset = 0, limit = 25, tag } = req.query
  
  // Pass all parameters to the Products service
  res.json(await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  }))
}

/**
 * Get a single product
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
async function getProduct(req, res, next) {
  const { id } = req.params

  const product = await Products.get(id)
  if (!product) {
    return next()
  }
  
  return res.json(product)
}

/**
 * Create a new product
 * @param {object} req
 * @param {object} res
 */
async function createProduct(req, res) {
  console.log('request body:', req.body)
  res.json(req.body)
}

/**
 * Update a product
 * @param {object} req
 * @param {object} res
 */
async function updateProduct(req, res) {
  const { id } = req.params
  const updateData = req.body
  
  // Call the Products service to update the product
  await Products.update(id, updateData)
  
  // Return a 200 response to indicate the request was successful
  console.log(`Product with id ${id} was updated`)
  res.status(200).json({ message: `Product with id ${id} was updated`, product: updateData })
}

/**
 * Delete a product
 * @param {object} req
 * @param {object} res
 */
async function deleteProduct(req, res) {
  const { id } = req.params
  
  // Call the Products service to delete the product
  await Products.delete(id)
  
  // Return a 202 response to indicate the request was accepted
  console.log(`Product with id ${id} was deleted`)
  res.status(202).json({ message: `Product with id ${id} was deleted` })
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
});