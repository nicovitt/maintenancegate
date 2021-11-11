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

  imageLoad() {
    // return new Promise((resolve, reject) => {
    //   this.imageCompress
    //     .uploadFile()
    //     .then(({ image, orientation }) => {
    //       let smallimage = new GenericAttachment();
    //       let mediumimage = new GenericAttachment();
    //       let bigimage = new GenericAttachment();
    //       let filebasename = Math.floor(Math.random() * 1000000 + 1);
    //       const base64string = 'base64,';
    //       let _galleryImages = new Array<NgxGalleryImage>();
    //       //Make a small image for the thumbnail
    //       let smallimagepromise = new Promise<void>((resolve) => {
    //         this.imageCompress
    //           .compressFile(image, orientation, 20, 40)
    //           .then((result: string) => {
    //             smallimage.Content = result.substring(
    //               result.indexOf(base64string) + base64string.length,
    //               result.length
    //             ); //Base64 of the image
    //             smallimage.ContentType =
    //               this.ticketService.calculateBase64MimeType(result); //Type of the image
    //             smallimage.Filename =
    //               filebasename +
    //               '-small' +
    //               '.' +
    //               smallimage.ContentType.substring(
    //                 smallimage.ContentType.indexOf('/') + 1,
    //                 smallimage.ContentType.length
    //               ); //Name of the image
    //             resolve();
    //           })
    //           .catch((error: any) => {
    //             console.log('Konnte kein kleines Bild erstellen.');
    //             console.log(error);
    //           });
    //       });
    //       //Make a medium image as preview
    //       let mediumimagepromise = new Promise<void>((resolve) => {
    //         this.imageCompress
    //           .compressFile(image, orientation, 34, 55)
    //           .then((result: string) => {
    //             mediumimage.Content = result.substring(
    //               result.indexOf(base64string) + base64string.length,
    //               result.length
    //             ); //Base64 of the image
    //             mediumimage.ContentType =
    //               this.ticketService.calculateBase64MimeType(result); //Type of the image
    //             mediumimage.Filename =
    //               filebasename +
    //               '-medium' +
    //               '.' +
    //               mediumimage.ContentType.substring(
    //                 mediumimage.ContentType.indexOf('/') + 1,
    //                 mediumimage.ContentType.length
    //               ); //Name of the image
    //             resolve();
    //           })
    //           .catch((error: any) => {
    //             console.log('Konnte kein mittleres Bild erstellen.');
    //             console.log(error);
    //           });
    //       });
    //       //Make a big image for full resolution
    //       let bigimagepromise = new Promise<void>((resolve) => {
    //         this.imageCompress
    //           .compressFile(image, orientation, 50, 70)
    //           .then((result: string) => {
    //             bigimage.Content = result.substring(
    //               result.indexOf(base64string) + base64string.length,
    //               result.length
    //             ); //Base64 of the image
    //             bigimage.ContentType =
    //               this.ticketService.calculateBase64MimeType(result); //Type of the image
    //             bigimage.Filename =
    //               filebasename +
    //               '-big' +
    //               '.' +
    //               bigimage.ContentType.substring(
    //                 bigimage.ContentType.indexOf('/') + 1,
    //                 bigimage.ContentType.length
    //               ); //Name of the image
    //             resolve();
    //           })
    //           .catch((error: any) => {
    //             console.log('Konnte kein großes Bild erstellen.');
    //             console.log(error);
    //           });
    //       });
    //       Promise.all([smallimagepromise, mediumimagepromise, bigimagepromise])
    //         .then(() => {
    //           let genericAttachments = new Array<GenericAttachment>();
    //           genericAttachments.push(smallimage, mediumimage, bigimage);
    //           resolve(genericAttachments);
    //         })
    //         .catch((error) => {
    //           console.log('Zusammenfügen der Bilder hat nicht funktioniert.');
    //           console.log(error);
    //         });
    //     })
    //     .catch((error: any) => {
    //       console.log('imageCompress.uploadFile() ist fehlgeschlagen!');
    //       throw error;
    //     });
    // });
  }

  getImagesFromGenericAttachments() {
    // let ngxGalleryImages: NgxGalleryImage[] = new Array<NgxGalleryImage>();
    // let tmpimg: GalleryImageObjects = new GalleryImageObjects();
    // genericAttachments.forEach((photo) => {
    //   // in case of big picture
    //   if (photo.Filename.includes('-big')) {
    //     tmpimg.big =
    //       'data:' +
    //       photo.ContentType +
    //       ';base64,' +
    //       photo.Content.replace(/[\n\r]/g, '');
    //   } else {
    //     // in case of medium picture
    //     if (photo.Filename.includes('-medium')) {
    //       tmpimg.medium =
    //         'data:' +
    //         photo.ContentType +
    //         ';base64,' +
    //         photo.Content.replace(/[\n\r]/g, '');
    //     } else {
    //       // in case of small picture
    //       if (photo.Filename.includes('-small')) {
    //         tmpimg.small =
    //           'data:' +
    //           photo.ContentType +
    //           ';base64,' +
    //           photo.Content.replace(/[\n\r]/g, '');
    //       }
    //       // in case of an old picture that was not created with the ngx-gallery
    //       else {
    //         //This is a temporary solution for the old image implementation.
    //         let oldtmpimage = new GalleryImageObjects(
    //           'data:' +
    //             photo.ContentType +
    //             ';base64,' +
    //             photo.Content.replace(/[\n\r]/g, ''),
    //           'data:' +
    //             photo.ContentType +
    //             ';base64,' +
    //             photo.Content.replace(/[\n\r]/g, ''),
    //           'data:' +
    //             photo.ContentType +
    //             ';base64,' +
    //             photo.Content.replace(/[\n\r]/g, '')
    //         );
    //         ngxGalleryImages.push(oldtmpimage);
    //       }
    //     }
    //   }
    //   //When all 'new' images (big, medium, small) are loaded, push the object to the array. The pictures have to be in consecutive order in the attachment (big,medium,small,big,medium,small, ...)
    //   if (tmpimg.big && tmpimg.medium && tmpimg.small) {
    //     ngxGalleryImages.push({
    //       small: tmpimg.small,
    //       medium: tmpimg.medium,
    //       big: tmpimg.big,
    //       description: photo.TimeStamp,
    //     });
    //     // reset tmpimg
    //     tmpimg = new GalleryImageObjects();
    //   }
    // });
    // return ngxGalleryImages;
  }
}
