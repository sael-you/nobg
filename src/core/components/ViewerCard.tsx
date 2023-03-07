import { IconButton, Modal } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { BodyPix } from '@tensorflow-models/body-pix'
import { useEffect, useState } from 'react'
import { BackgroundConfig } from '../helpers/backgroundHelper'
import { PostProcessingConfig } from '../helpers/postProcessingHelper'
import { SegmentationConfig } from '../helpers/segmentationHelper'
import { SourceConfig, SourcePlayback } from '../helpers/sourceHelper'
import { TFLite } from '../hooks/useTFLite'
import OutputViewer from './OutputViewer'
import SourceViewer from './SourceViewer'
import { CloseOutlined, CloudDownloadOutlined, FontDownloadOutlined, ShareOutlined } from '@material-ui/icons'

type ViewerCardProps = {
  sourceConfig: SourceConfig
  backgroundConfig: BackgroundConfig
  segmentationConfig: SegmentationConfig
  postProcessingConfig: PostProcessingConfig
  bodyPix?: BodyPix
  tflite?: TFLite
}

function ViewerCard(props: ViewerCardProps) {
  const classes = useStyles()
  const [sourcePlayback, setSourcePlayback] = useState<SourcePlayback>()
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [ImageSource, setImageSource] = useState('')
  useEffect(() => {
    setSourcePlayback(undefined)
  }, [props.sourceConfig])

  return (
    <Paper className={classes.root}>
      <div style={{ display: 'hidden' }}>
        <SourceViewer
          sourceConfig={props.sourceConfig}
          onLoad={setSourcePlayback}
        />
      </div>
      {sourcePlayback && props.bodyPix && props.tflite ? (
        <>
          <Modal
            open={open}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
            }}
            // onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div className={classes.modal}>
              <IconButton
                className={classes.iconButtonClose}
                onClick={handleClose}
              >
                <CloseOutlined style={{ fontSize: 40 }} />
              </IconButton>
              <IconButton
                className={classes.iconButtonShare}
                onClick={() => {}}
              >
                <ShareOutlined style={{ fontSize: 40 }} />
              </IconButton>
              <IconButton
                className={classes.iconButtonSave}
                onClick={handleClose}
              >
                <CloudDownloadOutlined style={{ fontSize: 40 }} />
              </IconButton>
              <img src={ImageSource} className={classes.imageShot} alt="shot" />
            </div>
          </Modal>
          <OutputViewer
            handleOpen={handleOpen}
            setImageSource={setImageSource}
            sourcePlayback={sourcePlayback}
            backgroundConfig={props.backgroundConfig}
            segmentationConfig={props.segmentationConfig}
            postProcessingConfig={props.postProcessingConfig}
            bodyPix={props.bodyPix}
            tflite={props.tflite}
          />
        </>
      ) : (
        <div className={classes.noOutput}>
          <Avatar className={classes.avatar} />
        </div>
      )}
    </Paper>
  )
}

const useStyles = makeStyles((theme: Theme) => {
  // const minHeight = [`${theme.spacing(52)}px`, `100vh - ${theme.spacing(2)}px`]

  return createStyles({
    root: {
      // minHeight: `calc(min(${minHeight.join(', ')}))`,
      height: '100%',
      display: 'flex',
      overflow: 'hidden',

      // [theme.breakpoints.up('md')]: {
      //   gridColumnStart: 1,
      //   gridColumnEnd: 3,
      // },

      // [theme.breakpoints.up('lg')]: {
      //   gridRowStart: 1,
      //   gridRowEnd: 3,
      // },
    },
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '0.5rem',
      padding: theme.spacing(1),
      backgroundColor: theme.palette.background.paper,
      position: 'relative',
    },
    iconButtonClose: {
      position: 'absolute',
      // width : w
      fontSize: 40,
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[100],
      zIndex: 1,
    },
    iconButtonShare: {
      position: 'absolute',
      // width : w
      fontSize: 40,
      right: theme.spacing(1),
      bottom: theme.spacing(10),
      color: theme.palette.grey[100],
      zIndex: 1,
    },
    iconButtonSave: {
      position: 'absolute',
      // width : w
      fontSize: 40,
      right: theme.spacing(1),
      bottom: theme.spacing(1),
      color: theme.palette.grey[100],
      zIndex: 1,
    },
    imageShot: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transform: 'scaleX(-1)',
    },
    noOutput: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatar: {
      width: theme.spacing(20),
      height: theme.spacing(20),
    },
  })
})

export default ViewerCard
