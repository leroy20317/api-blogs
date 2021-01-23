/**
 *
 * @param {集合} db
 * @param {页码} page
 * @param {数量} size
 */

async function getPage(db, page, size) {
  const result = await Promise.all([
    db.countDocuments(),
    db.find().sort({time: -1}).limit(Number(size)).skip(Number(size) * (page - 1))
  ])

  return {
    total: result[0],
    data: result[1],
    page: Number(page)
  }
}

module.exports = getPage