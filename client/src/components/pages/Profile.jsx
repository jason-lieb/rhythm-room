import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { QUERY_USER } from '../../utils/queries'
import { CREATE_ABOUT_ME } from '../../utils/mutations'
import { useSpotifyApi } from '../../utils/SpotifyApiContext'
import Auth from '../../utils/auth'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import DisconnectSpotify from '../DisconnectSpotify'
import Loading from '../Loading'

const css = `
  .container-box {
    display: flex;
    justify-content: center;
    align-items: center;
    // height: 100vh;
    background-color: #242038;
  }
  .card {
    background-color: #8d86c9;
    color: white;
    display: flex;
    flex-direction: column;
    margin: 30px 0;
  }
  .card-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .username {
    margin-left: 10px;
  }
  .text{
    color: white;
    width: 35vh;
  }
  .button {
    color: white;
  }
  text-field {
    color: white;
  }
  .name-header {
    display: flex;
    align-items: center;
    flex: space-between;
    margin: 10px;
  }
  .user-name {
    padding-left: 20px;
  }
  .liked-playlist {
    // width: 35vh;
    // height: 35vh;
    margin: 15px;
  }
  .created-playlist {
    // width: 35vh;
    // height: 35vh;
    margin: 15px;
  }
`

export default function Profile() {
  const navigate = useNavigate()
  const { profileId } = useParams()
  const [addAbout] = useMutation(CREATE_ABOUT_ME)
  const [aboutText, setAboutText] = useState('')
  const [aboutTextDisplay, setAboutTextDisplay] = useState('')
  const [spotifyApi] = useSpotifyApi()
  const spotifyLoggedIn = spotifyApi.getAccessToken()
  const [disconnected, setDisconnected] = useState(true)
  useEffect(() => {
    if (spotifyLoggedIn) setDisconnected(false)
  }, [spotifyLoggedIn])

  const { loading, data } = useQuery(QUERY_USER, {
    variables: { userId: profileId },
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const user = data?.user || {}

  useEffect(() => {
    setAboutTextDisplay(user.about)
  }, [user])

  const generateLikedPlaylists = () => {
    return user.likedplaylist.map((playlist, index) => (
      <Card
        key={index}
        sx={{
          display: 'flex',
          minHeight: '151px',
          backgroundColor: '#8d86c9',
          color: 'white',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <CardContent>
          <Typography variant="h5">{playlist.name}</Typography>
        </CardContent>
        <CardMedia
          component="img"
          sx={{ width: 151, maxHeight: 151 }}
          image={playlist.images[0].url}
          alt="Live from space album cover"
        />
      </Card>
    ))
  }
  const generateCreatedPlaylists = () => {
    return user.createdplaylist.map((playlist, index) => (
      <Card
        key={index}
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          backgroundColor: '#8d86c9',
          color: 'white',
        }}
      >
        <CardContent>
          <Typography variant="h5">{playlist.name}</Typography>
        </CardContent>
        <CardMedia
          component="img"
          sx={{ width: 151, maxHeight: 151 }}
          image={playlist.images[0].url}
          alt="Live from space album cover"
        />
      </Card>
    ))
  }

  //functions for About Me section
  const [openEditBox, setOpenEditBox] = useState(false)
  const handleAboutTextChange = (event) => {
    const { value } = event.target
    setAboutText(value)
  }
  const submitAbout = async (e) => {
    e.preventDefault()
    const { data } = await addAbout({
      variables: { about: aboutText, id: profileId },
    })
    setAboutTextDisplay(data.addAbout.about)
    setOpenEditBox(false)
  }

  const editAboutMe = () => {
    if (!openEditBox) {
      return (
        <Button
          sx={{
            fontSize: '1.2em',
            color: '#595381',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          variant="text"
          onClick={() => setOpenEditBox(true)}
        >
          <span>Edit</span>
          <span>&#9997;</span>
        </Button>
      )
    } else if (openEditBox) {
      return (
        <div className="edit-div">
          <TextField
            id="outlined-multiline-static"
            label="About Me"
            multiline
            rows={4}
            defaultValue="Tell us about yourself..."
            onChange={handleAboutTextChange}
          ></TextField>
          <Button
            label="About Me"
            sx={{ backgroundColor: '#595381', marginTop: 1 }}
            variant="contained"
            onClick={submitAbout}
          >
            Submit
          </Button>
        </div>
      )
    }
  }

  if (loading) {
    return <Loading />
  }

  if (!Auth.loggedIn()) navigate('/login')

  return (
    <div className="container-box" style={{ minHeight: 'calc(100vh - 8rem)' }}>
      <style type="text/css">{css}</style>
      <Card className="card" sx={{ maxWidth: '860px', width: '85%' }}>
        <div className="left-content">
          {/* Avatar and username */}
          <div className="name-header">
            {/* Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. */}
            <svg
              style={{ width: '4rem', height: '4rem', fill: '#595381' }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z" />
            </svg>
            <Typography
              sx={{ fontSize: '1.5em', fontWeight: 'bold' }}
              className="user-name"
            >
              {user.username}
            </Typography>
            {!disconnected && (
              <DisconnectSpotify setDisconnected={setDisconnected} />
            )}
          </div>

          {/* About me section */}
          <CardContent className="about-me">
            <Typography
              className="text"
              gutterBottom
              variant="h5"
              component="div"
            >
              About Me:
            </Typography>
            <Typography
              className="text"
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: '1.2em', marginBottom: '1rem' }}
            >
              {aboutTextDisplay}
            </Typography>
            {editAboutMe()}
          </CardContent>
        </div>

        {/* Liked and created playlists */}
        <div className="right-content">
          <div className="liked-playlist playlist">
            <div className="typ">Liked Playlists</div>
            {generateLikedPlaylists()}
          </div>
          <div className="created-playlist playlist">
            <div className="typ">Created Playlists</div>
            {generateCreatedPlaylists()}
          </div>
        </div>
      </Card>
    </div>
  )
}
