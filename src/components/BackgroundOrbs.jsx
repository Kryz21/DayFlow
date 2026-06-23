import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Ferrofluid from './reactbits/Ferrofluid'

export default function BackgroundOrbs() {
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()

  const layerOneY = useTransform(scrollY, [0, 1200], [0, 90])
  const layerTwoY = useTransform(scrollY, [0, 1200], [0, -70])

  return (
    <div className="background-scene" aria-hidden="true">
      {!reduceMotion && (
        <div className="ferro-layer optimized-ferro">
          <Ferrofluid
            colors={['#ffffff', '#d7dbe4', '#9da3ae']}
            speed={0.18}
            scale={2.2}
            turbulence={0.45}
            fluidity={0.08}
            rimWidth={0.12}
            sharpness={3}
            shimmer={0.35}
            glow={0.95}
            flowDirection="down"
            opacity={0.8}
            mouseInteraction={false}
            dpr={0.65}
            mixBlendMode="screen"
          />
        </div>
      )}

      <motion.div style={{ y: layerOneY }} className="parallax-blob parallax-blob-one" />
      <motion.div style={{ y: layerTwoY }} className="parallax-blob parallax-blob-two" />

      <div className="background-vignette" />
      <div className="background-fade" />
    </div>
  )
}