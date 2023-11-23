'use client'

import { useId } from 'react'
import Image from 'next/image'
import clsx from 'clsx'

interface ContactImageProps{
  imageUrl: string;
  index: number;
}

function ImageClipPaths({
  id,
  ...props
}: React.ComponentPropsWithoutRef<'svg'> & { id: string }) {
  return (
    <svg aria-hidden="true" width={0} height={0} {...props}>
      <defs>
        <clipPath id={`${id}-0`} clipPathUnits="objectBoundingBox">
          <path d="M0,0 h0.729 v0.129 h0.121 l-0.016,0.032 C0.815,0.198,0.843,0.243,0.885,0.243 H1 v0.757 H0.271 v-0.086 l-0.121,0.057 v-0.214 c0,-0.032,-0.026,-0.057,-0.057,-0.057 H0 V0" />
        </clipPath>
        <clipPath id={`${id}-1`} clipPathUnits="objectBoundingBox">
          <path d="M1,1 H0.271 v-0.129 H0.15 l0.016,-0.032 C0.185,0.802,0.157,0.757,0.115,0.757 H0 V0 h0.729 v0.086 l0.121,-0.057 v0.214 c0,0.032,0.026,0.057,0.057,0.057 h0.093 v0.7" />
        </clipPath>
        <clipPath id={`${id}-2`} clipPathUnits="objectBoundingBox">
          <path d="M1,0 H0.271 v0.129 H0.15 l0.016,0.032 C0.185,0.198,0.157,0.243,0.115,0.243 H0 v0.757 h0.729 v-0.086 l0.121,0.057 v-0.214 c0,-0.032,0.026,-0.057,0.057,-0.057 h0.093 V0" />
        </clipPath>
      </defs>
    </svg>
  )
}

export function ContactImage({imageUrl, index}: ContactImageProps):JSX.Element {
  let id = useId()

  return (
    <>
      <ImageClipPaths id={id} />
          <div className="group relative h-[4rem] w-[4rem] transform overflow-hidden rounded-xl">
            <div
              className={clsx(
                'absolute bottom-6 left-0 right-4 top-0 rounded-4xl border transition duration-300 group-hover:scale-95 xl:right-6',
                [
                  'border-blue-300',
                  'border-indigo-300',
                  'border-sky-300',
                ][index % 3],
              )}
            />
            <div
              className="absolute inset-0 bg-indigo-50"
              style={{ clipPath: `url(#${id}-${index % 3})` }}
            >
              <Image
                className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-110"
                src={imageUrl}
                alt=""
                priority
                unoptimized
                height={100}
                width={100}
              />
            </div>
          </div>
    </>
  )
}
