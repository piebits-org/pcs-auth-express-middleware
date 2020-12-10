const axios = require('axios').default

function validateAndGetUser(accessToken, pcsapp) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:4000/fetch/user', {
      headers: {
        'Authorization': accessToken,
        'x-pcs-app': pcsapp,
        'x-usesrn': true
      }
    })
      .then(({ data }) => {
         resolve({
          id: data._id,
          provider: data.provider,
          status: data.status,
          ...data.data
        })
      })
      .catch((err) => {
        reject(err)
      })
  })
}

module.exports = (req, res, next) => {
  var accessToken = req.headers['authorization']
  var pcsapp = req.headers['x-pcs-app']
  if (accessToken) {
    if (pcsapp) {
      validateAndGetUser(accessToken, pcsapp)
        .then((val) => {
          req.user = val;
          next()
        })
        .catch((err) => {
          res.status(401).send('Unauthorized Access')
        })
    } else {
      res.send(401).send('[x-pcs-app] header missing from request')
    }
  } else {
    res.status(401).send('[authorization] header missing from request')
  }
}