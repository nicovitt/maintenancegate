import { Injectable } from '@angular/core';
import { Attachment } from '../classes/attachment';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor() {}

  public calculateBase64MimeType(encoded: string) {
    var result = null;
    if (typeof encoded !== 'string') {
      return result;
    }
    var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    if (mime && mime.length) {
      result = mime[1];
    }
    return result;
  }

  /**
   * @description Returns a string usable for the filename as ending.
   * @var mimetype Should be the Mime-Type of the file like image/jpeg or image/png
   */
  public calculateFileEndingFromMimeType(mimetype: string) {
    switch (mimetype) {
      case 'image/jpeg':
        return 'jpg';
      case 'image/png':
        return 'png';
      default:
        return 'txt';
    }
  }

  /**
   * @description Returns a string usable for the mime-type.
   * @var filename Should be the filename of the file
   */
  public calculateMimeTypeFromFileName(filename: string) {
    let fileending = filename.slice(filename.lastIndexOf('.'), filename.length);
    switch (fileending) {
      case '.jpg':
        return 'image/jpeg';
      case '.png':
        return 'image/png';
      default:
        return 'txt';
    }
  }

  /**
   *
   * @description Resizes any image based on a base64 string. For more information: https://gist.github.com/ORESoftware/ba5d03f3e1826dc15d5ad2bcec37f7bf#gistcomment-3518821
   * @param base64Str Has to be the image as a base64 string.
   * @param maxWidth The decided maximal width (suggestion: 1920)
   * @param maxHeight The decided maximal height (suggestion: 1280)
   * @returns The base64 string of the resized image.
   */
  public resizeImage(base64Str: string, maxWidth = 400, maxHeight = 350) {
    return new Promise<string>((resolve) => {
      let img = new Image();
      img.src = base64Str;
      img.onload = () => {
        let canvas = document.createElement('canvas');
        const MAX_WIDTH = maxWidth;
        const MAX_HEIGHT = maxHeight;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL());
      };
    });
  }
}
