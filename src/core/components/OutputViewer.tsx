import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { BodyPix } from '@tensorflow-models/body-pix'
import { useEffect } from 'react'
import { BackgroundConfig } from '../helpers/backgroundHelper'
import { PostProcessingConfig } from '../helpers/postProcessingHelper'
import { SegmentationConfig } from '../helpers/segmentationHelper'
import { SourcePlayback } from '../helpers/sourceHelper'
import useRenderingPipeline from '../hooks/useRenderingPipeline'
import { TFLite } from '../hooks/useTFLite'

type OutputViewerProps = {
  sourcePlayback: SourcePlayback
  backgroundConfig: BackgroundConfig
  segmentationConfig: SegmentationConfig
  postProcessingConfig: PostProcessingConfig
  bodyPix: BodyPix
  tflite: TFLite
}

function OutputViewer(props: OutputViewerProps) {
  const classes = useStyles()
  const {
    pipeline,
    backgroundImageRef,
    canvasRef,
    fps,
    durations: [resizingDuration, inferenceDuration, postProcessingDuration],
  } = useRenderingPipeline(
    props.sourcePlayback,
    props.backgroundConfig,
    props.segmentationConfig,
    props.bodyPix,
    props.tflite
  )

  useEffect(() => {
    const button = document.getElementById('screenshot')!;
    const canvas = document.getElementById('testCanvas') as HTMLCanvasElement;
    
    button.addEventListener('mouseup', () => {
      const gl = canvas.getContext('webgl2')!;
      const pixels = new Uint8Array(canvas.width * canvas.height * 4);
      gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      const flippedPixels = new Uint8ClampedArray(canvas.width * canvas.height * 4);
      for (let y = 0; y < canvas.height; y++) {
        const i = y * canvas.width * 4;
        const flip_i = (canvas.height - y - 1) * canvas.width * 4;
        for (let x = 0; x < canvas.width; x++) {
          flippedPixels[flip_i + x * 4] = pixels[i + x * 4];
          flippedPixels[flip_i + x * 4 + 1] = pixels[i + x * 4 + 1];
          flippedPixels[flip_i + x * 4 + 2] = pixels[i + x * 4 + 2];
          flippedPixels[flip_i + x * 4 + 3] = pixels[i + x * 4 + 3];
        }
      }
      const imageData = new ImageData(flippedPixels, canvas.width, canvas.height);
      const tmpCanvas = document.createElement('canvas');
      tmpCanvas.width = canvas.width;
      tmpCanvas.height = canvas.height;
      const tmpContext = tmpCanvas.getContext('2d')!;
      tmpContext.putImageData(imageData, 0, 0);
      const dataURL = tmpCanvas.toDataURL();
      
      const hdCanvas = document.createElement('canvas');
      hdCanvas.width = canvas.width * window.devicePixelRatio;
      hdCanvas.height = canvas.height * window.devicePixelRatio;
      const hdContext = hdCanvas.getContext('2d')!;
      // hdContext.scale(window.devicePixelRatio, window.devicePixelRatio);
      hdContext.drawImage(tmpCanvas, 0, 0, hdCanvas.width, hdCanvas.height);
      const hdDataURL = hdCanvas.toDataURL();
      
      console.log('Screenshot taken:', hdDataURL);
    });
    
    if (pipeline) {
      pipeline.updatePostProcessingConfig(props.postProcessingConfig)
    }
  }, [pipeline, props.postProcessingConfig])

  const statDetails = [
    `resizing ${resizingDuration}ms`,
    `inference ${inferenceDuration}ms`,
    `post-processing ${postProcessingDuration}ms`,
  ]
  const stats = `${Math.round(fps)} fps (${statDetails.join(', ')})`

  return (
    <div className={classes.root}>
      {props.backgroundConfig.type === 'image' && (
        <img
          ref={backgroundImageRef}
          className={classes.render}
          src={props.backgroundConfig.url}
          alt=""
          hidden={props.segmentationConfig.pipeline === 'webgl2'}
        />
      )}
      <canvas
        id = "testCanvas"
        // The key attribute is required to create a new canvas when switching
        // context mode
        key={props.segmentationConfig.pipeline}
        ref={canvasRef}
        className={classes.render}
        width={props.sourcePlayback.width}
        height={props.sourcePlayback.height}
      />
      <button className = {classes.button} id = "screenshot"></button>
      {/* <Typography className={classes.stats} variant="caption">
        {stats}
      </Typography> */}
    </div>
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button:{
      position: 'absolute',
      top: '83%',
      left: '38%',
      width: '10vw',
      height: '5vh',
    },
    root: {
      flex: 1,
      position: 'relative',
      transform: 'scaleX(-1)',
    },
    render: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    stats: {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      textAlign: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.48)',
      color: theme.palette.common.white,
    },
  })
)

export default OutputViewer
