/*
 * GET home page.
 */

function renderIndex(req, res) {
  res.render('index', { title: 'Express' })
}

exports.index = renderIndex;
