import { Injectable } from '@angular/core';

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
  public calculateFileEnding(mimetype: string) {
    switch (mimetype) {
      case 'image/jpeg':
        return 'jpg';
      case 'image/png':
        return 'png';
      default:
        return 'txt';
    }
  }

  imageLoad() {}

  getImagesFromGenericAttachments() {}
}
