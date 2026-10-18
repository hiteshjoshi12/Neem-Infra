"use client";

import ImageUploadInput from './ImageUploadInput';

export default function MediaUploadInput(props) {
  return <ImageUploadInput acceptVideo={true} mediaType={props.mediaType || 'all'} {...props} />;
}
