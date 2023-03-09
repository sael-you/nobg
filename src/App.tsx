import { Grid, useMediaQuery } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useEffect, useState } from 'react'
import BackgroundConfigCard from './core/components/BackgroundConfigCard'
import ViewerCard from './core/components/ViewerCard'
import {
  BackgroundConfig
} from './core/helpers/backgroundHelper'
import { PostProcessingConfig } from './core/helpers/postProcessingHelper'
import { SegmentationConfig } from './core/helpers/segmentationHelper'
import { SourceConfig, sourceImageUrls } from './core/helpers/sourceHelper'
import useBodyPix from './core/hooks/useBodyPix'
import useTFLite from './core/hooks/useTFLite'

function App() {
  const classes = useStyles()
  const isDesktop = useMediaQuery('(min-width:960px)');

  const [sourceConfig, setSourceConfig] = useState<SourceConfig>({
    type: isDesktop ? 'image' : 'camera',
    url: sourceImageUrls[0],
  })
  const [backgroundConfig, setBackgroundConfig] = useState<BackgroundConfig>({
    type: 'none',
  })
  const [segmentationConfig, setSegmentationConfig] =
    useState<SegmentationConfig>({
      model: 'mlkit',
      backend: 'wasm',
      inputResolution: '256x256',
      pipeline: 'webgl2',
      targetFps: 65, // 60 introduces fps drop and unstable fps on Chrome
      deferInputResizing: true,
    })
  const [postProcessingConfig, setPostProcessingConfig] =
    useState<PostProcessingConfig>({
      smoothSegmentationMask: true,
      jointBilateralFilter: { sigmaSpace: 1, sigmaColor: 0.1 },
      coverage: [0.5, 0.75],
      lightWrapping: 0.3,
      blendMode: 'screen',
    })
  const bodyPix = useBodyPix()
  const { tflite, isSIMDSupported } = useTFLite(segmentationConfig)

  useEffect(() => {
    setSegmentationConfig((previousSegmentationConfig) => {
      if (previousSegmentationConfig.backend === 'wasm' && isSIMDSupported) {
        return { ...previousSegmentationConfig, backend: 'wasmSimd' }
      } else {
        return previousSegmentationConfig
      }
    })
  }, [isSIMDSupported])

  return (

    <div className={classes.root} >
      {!isDesktop ? (
        <>
          <ViewerCard
            sourceConfig={sourceConfig}
            backgroundConfig={backgroundConfig}
            segmentationConfig={segmentationConfig}
            postProcessingConfig={postProcessingConfig}
            bodyPix={bodyPix}
            tflite={tflite}
          />
          <BackgroundConfigCard
            config={backgroundConfig}
            onChange={setBackgroundConfig}
          />
        </>
      ) : (
        <>
          <div className={classes.desktopRoot}>
            <h1 className={classes.title}>My QR Code Page</h1>
            <Grid container justify="center" alignItems="center" className={classes.content} style={{ height: '100%' }}>
              <Grid item xs={12} sm={6} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <object type="image/svg+xml" data={`${process.env.PUBLIC_URL}/qr_code.svg`} className={classes.qrCodeImage} style={{ maxWidth: '20vw' }}>
                  Your browser does not support SVG
                </object>
                <p className={classes.description}>Scan the QR Code to learn more!</p>
              </Grid>
            </Grid>
          </div>
        </>
      )}
    </div>
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'block',
      width: '100vw',
      height: '100%',
      overflow: 'hidden',

      // [theme.breakpoints.up('xs')]: {
      //   margin: theme.spacing(1),
      //   gap: theme.spacing(1),
      //   gridTemplateColumns: '1fr',
      // },

      // [theme.breakpoints.up('md')]: {
      //   margin: theme.spacing(2),
      //   gap: theme.spacing(2),
      //   gridTemplateColumns: 'repeat(2, 1fr)',
      // },

      // [theme.breakpoints.up('lg')]: {
      //   gridTemplateColumns: 'repeat(3, 1fr)',
      // },
    },

    desktopRoot: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    },
    title: {
      position: 'absolute',
      fontSize: '3rem',
      textAlign: 'center',
      fontWeight: 'bold',
      top: '10%',
      marginBottom: theme.spacing(4),
    },
    content: {
      flexGrow: 1,
    },
    qrCodeImage: {
      display: 'block',
      maxWidth: '20vw',
      height: 'auto',
      marginBottom: theme.spacing(2),
    },
    description: {
      textAlign: 'center',
      margin: 0,
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    // resourceSelectionCards: {
    //   display: 'flex',
    //   flexDirection: 'column',
    // },
  })
)

export default App
