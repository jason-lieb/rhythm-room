import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { QUERY_USER } from '../../utils/queries'
import { CREATE_ABOUT_ME } from '../../utils/mutations'
import Auth from '../../utils/auth'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import DisconnectSpotify from '../DisconnectSpotify'
import { useSpotifyApi } from '../../utils/SpotifyApiContext'
import { width } from '@mui/system'

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
      <Card key={index} sx={{ display: 'flex', minHeight: '151px', backgroundColor: '#8d86c9', color: 'white', width:'100%', justifyContent:'space-between' }}>
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
      <Card key={index} sx={{ display: 'flex', width:'100%', justifyContent:'space-between', backgroundColor: '#8d86c9', color: 'white' }}>
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
        <Button sx={{ fontSize: '1.2em', color: '#595381', display: 'flex', justifyContent: 'center', alignItems: 'center'}} variant="text" onClick={() => setOpenEditBox(true)}>
          <span>Edit</span><span>&#9997;</span>
        </Button>
      )
    } else if (openEditBox) {
      return (
        <div className='edit-div'>
          <TextField
            id="outlined-multiline-static"
            label="About Me"
            multiline
            rows={4}
            defaultValue="Tell us about yourself..."
            onChange={handleAboutTextChange}
          ></TextField>
          <Button label="About Me" sx={{ backgroundColor: '#595381', marginTop: 1 }} variant="contained" onClick={submitAbout}>
            Submit
          </Button>
        </div>
      )
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!Auth.loggedIn()) navigate('/login')

  return (
    <div className="container-box" style={{ minHeight: 'calc(100vh - 8rem)' }}>
      <style type="text/css">{css}</style>
      <Card className="card" sx={{ maxWidth: '860px', width: '85%' }}>
        <div className="left-content">
          {/* Avatar and username */}
          <div className="name-header">
            <Avatar
              alt="Remy Sharp"
              src="/static/images/avatar/1.jpg"
              sx={{ width: 70, height: 70 }}
            />
            <Typography sx={{ fontSize: '1.5em', fontWeight: 'bold'}} className="user-name">{user.username}</Typography>
            {!disconnected && (
              <DisconnectSpotify setDisconnected={setDisconnected} />
            )}
          </div>

          {/* About me section */}
          <CardContent className='about-me'>
            <Typography
              className="text"
              gutterBottom
              variant="h5"
              component="div"
            >
              About Me:
            </Typography>
            <Typography className="text" variant="body2" color="text.secondary" sx={{ fontSize: '1.2em', marginBottom: '1rem'}}>
              {aboutTextDisplay}
            </Typography>
            {editAboutMe()}
          </CardContent>
        </div>

        {/* Liked and created playlists */}
        <div className="right-content">
          <div className="liked-playlist playlist">
            <div className='typ'>Liked Playlists</div>
            {generateLikedPlaylists()}
          </div>
          <div className="created-playlist playlist">
            <div className='typ'>Created Playlists</div>
            {generateCreatedPlaylists()}
          </div>
        </div>
      </Card>
    </div>
  )
}
