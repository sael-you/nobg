import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import BlockIcon from '@material-ui/icons/Block'
import BlurOnIcon from '@material-ui/icons/BlurOn'
import ImageButton from '../../shared/components/ImageButton'
import SelectionIconButton from '../../shared/components/SelectionIconButton'
import {
  BackgroundConfig,
  backgroundImageUrls
} from '../helpers/backgroundHelper'

type BackgroundConfigCardProps = {
  config: BackgroundConfig
  onChange: (config: BackgroundConfig) => void
}

function BackgroundConfigCard(props: BackgroundConfigCardProps) {
  const classes = useStyles()

  return (
    <Card className={classes.root}>
      <CardContent>
        {/* <Typography gutterBottom variant="h6" component="h2">
          Background
        </Typography> */}
        <SelectionIconButton
          active={props.config.type === 'none'}
          onClick={() => props.onChange({ type: 'none' })}
        >
          <BlockIcon />
        </SelectionIconButton>
        <SelectionIconButton
          active={props.config.type === 'blur'}
          onClick={() => props.onChange({ type: 'blur' })}
        >
          <BlurOnIcon />
        </SelectionIconButton>
        {backgroundImageUrls.map((imageUrl) => (
          <ImageButton
            key={imageUrl}
            imageUrl={imageUrl}
            active={imageUrl === props.config.url}
            onClick={() => props.onChange({ type: 'image', url: imageUrl })}
          />
        ))}
      </CardContent>
    </Card>
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: 1,
      position: 'absolute',
      top: '80%',
      left: '38%',
      backgroundColor: '#ffffff00',
      boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 0%), 0px 0px 1px 0px rgb(0 0 0 / 0%), 0px 0px 0px 0px rgb(0 0 0 / 0%)',
    },
  })
)

export default BackgroundConfigCard
