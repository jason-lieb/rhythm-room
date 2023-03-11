const router = require('express').Router()
const request = require('request')

require('dotenv').config()

let SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
let SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

router.post('/login', async (req, res) => {
  const code = req.body.code

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token/',
    form: {
      code: code,
      redirect_uri: 'http://localhost:3000/',
      grant_type: 'authorization_code',
    },
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString(
          'base64'
        ),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    json: true,
  }

  request.post(authOptions, (err, response, body) => {
    if (!err && !body.error && res.statusCode === 200) {
      res.json({
        accessToken: body.access_token,
        refreshToken: body.refresh_token,
        expiresIn: body.expires_in,
      })
    } else {
      console.log('error')
      console.log('body', body)
      console.error(err)
      res.sendStatus(500)
    }
  })
})

router.post('/refresh', async (req, res) => {
  const refresh_token = req.body.refreshToken
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token/',
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    },
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString(
          'base64'
        ),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    json: true,
  }
  request.post(authOptions, (err, response, body) => {
    if (!err && !body.error && res.statusCode === 200) {
      res.json({
        accessToken: body.access_token,
        expiresIn: body.expires_in,
      })
    } else {
      console.log('error')
      console.log('body', body)
      console.error(err)
      res.sendStatus(500)
    }
  })
})

module.exports = router

// const redirectUri = req.body.redirectUri
// const spotifyApi = new SpotifyWebApi({
//   redirectUri: 'http://localhost:3000/',
//   clientId: process.env.SPOTIFY_CLIENT_ID,
//   clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
// })
// console.log('spotifyAPI', spotifyApi)
// spotifyApi
//   .authorizationCodeGrant(code)
//   .then((data) => {
//     res.json({
//       accessToken: data.body.access_token,
//       refreshToken: data.body.refresh_token,
//       expiresIn: data.body.expires_in,
//     })
//   })
//   .catch((err) => {
//     console.error(err)
//     res.sendStatus(400)
//   })
