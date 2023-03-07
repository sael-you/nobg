import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import BlockIcon from '@material-ui/icons/Block'
import BlurOnIcon from '@material-ui/icons/BlurOn'
import { Swiper, SwiperSlide } from 'swiper/react'
import ImageButton from '../../shared/components/ImageButton'
import SelectionIconButton from '../../shared/components/SelectionIconButton'
import {
  BackgroundConfig,
  backgroundImageUrls,
} from '../helpers/backgroundHelper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination } from 'swiper'
import { useCallback, useEffect, useRef } from 'react'

type BackgroundConfigCardProps = {
  config: BackgroundConfig
  onChange: (config: BackgroundConfig) => void
}

function BackgroundConfigCard(props: BackgroundConfigCardProps) {
  const classes = useStyles()
  const swiperRef = useRef<any>()

  // Center the clicked slide
  const handleClick = useCallback((swiper: any) => {
    const clickedSlideIndex = swiper.clickedIndex
    swiper.slideTo(clickedSlideIndex)
  }, [])

  useEffect(() => {
    // Update the swiper instance when the component mounts
    swiperRef.current?.update()
  }, [])
  return (
    <div className={classes.root}>
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        slidesPerView={1}
        spaceBetween={10}
        ref={swiperRef}
        breakpoints={{
          320: {
            slidesPerView: 4,
            spaceBetween: 10,
          },
          375: {
            slidesPerView: 5,
            spaceBetween: 10,
          },
          414: {
            slidesPerView: 6,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 11,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 14,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 18,
            spaceBetween: 50,
          },
        }}
        centeredSlides={true}
        initialSlide={2}
        onSwiper={(swiper) => {
          // Save the swiper instance to the ref
          swiperRef.current = swiper
        }}
        onClick={(swiper) => handleClick(swiper)}
        className={classes.slider}
      >
        <SwiperSlide>
          <SelectionIconButton
            active={props.config.type === 'none'}
            onClick={() => props.onChange({ type: 'none' })}
          >
            <BlockIcon />
          </SelectionIconButton>
        </SwiperSlide>
        <SwiperSlide>
          <SelectionIconButton
            active={props.config.type === 'blur'}
            onClick={() => props.onChange({ type: 'blur' })}
          >
            <BlurOnIcon />
          </SelectionIconButton>
        </SwiperSlide>
        {backgroundImageUrls.map((imageUrl) => (
          <SwiperSlide key={imageUrl}>
            <ImageButton
              imageUrl={imageUrl}
              active={imageUrl === props.config.url}
              onClick={() => props.onChange({ type: 'image', url: imageUrl })}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // flex: 1,
      width: '100%',
      position: 'absolute',
      top: '80%',
      // left: '38%',
      display: 'flex',
      jusifyContent: 'center',
      backgroundColor: '#ffffff00',
      boxShadow:
        '0px 2px 1px -1px rgb(0 0 0 / 0%), 0px 0px 1px 0px rgb(0 0 0 / 0%), 0px 0px 0px 0px rgb(0 0 0 / 0%)',
    },
    slider: {
      // flex: 1,
      width: '100%',
    },
  })
)

export default BackgroundConfigCard
