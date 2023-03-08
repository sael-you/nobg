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
  const [sourceConfig, setSourceConfig] = useState<SourceConfig>({
    type: 'camera',
    url: sourceImageUrls[0],
  })
  const [backgroundConfig, setBackgroundConfig] = useState<BackgroundConfig>({
    type: 'blur',
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
    <div className={classes.root}>
      <ViewerCard
        sourceConfig={sourceConfig}
        backgroundConfig={backgroundConfig}
        segmentationConfig={segmentationConfig}
        postProcessingConfig={postProcessingConfig}
        bodyPix={bodyPix}
        tflite={tflite}
      />
      {/* <SourceConfigCard config={sourceConfig} onChange={setSourceConfig} /> */}
      <BackgroundConfigCard
        config={backgroundConfig}
        onChange={setBackgroundConfig}
      />
      {/* <SegmentationConfigCard
        config={segmentationConfig}
        isSIMDSupported={isSIMDSupported}
        onChange={setSegmentationConfig}
      />
      <PostProcessingConfigCard
        config={postProcessingConfig}
        pipeline={segmentationConfig.pipeline}
        onChange={setPostProcessingConfig}
      />  */}
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
    // resourceSelectionCards: {
    //   display: 'flex',
    //   flexDirection: 'column',
    // },
  })
)

export default App
