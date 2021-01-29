import { Injectable } from '@angular/core';

import { HttpClient, HttpRequest, HttpEvent, HttpResponse, HttpEventType } from '@angular/common/http';

import { Observable ,  forkJoin ,  Subject ,  of } from 'rxjs';

import { CompanyService } from '../_services/company.service';

import { VinDecoder } from '../_core/vin-decoder';
import { WindowRef } from '../_core/window-ref';

import { environment } from '../../environments/environment';

@Injectable()
export class OcrService {
  constructor(
    private http: HttpClient,
    private win: WindowRef,
    private companyService: CompanyService
  ) { }

  recogniseVin(file: File): Observable<string|number> {

    const subject = new Subject<string|number>();
    console.debug('Start upload file', Date.now());
    this.prepareImgForOcr(file)
      .then(fileForPrepare => this.reduceImgFile(fileForPrepare))
      .then(blob => {
        const req = this.prepareReq(blob);
        forkJoin([
          this.http.request(req),
          this.companyService.getAsync(),
        ])
          .subscribe(([event, company]) => {
            if (event.type === HttpEventType.UploadProgress) {
              const percentDone = Math.round(100 * event.loaded / event.total);
              subject.next(percentDone);
            } else if (event instanceof HttpResponse) {
              try {
                const result = this.prepareText(event);
                const preparedText = result
                  .toUpperCase()
                  .replace(/I/g, '1')
                  .replace(/\[/g, '1')
                  .replace(/\]/g, '1')
                  .replace(/\|/g, '1')
                  .replace(/O/g, '0')
                  .replace(/Q/g, '0')
                  .replace(/\\\//g, 'V')
                  .replace(/\)/g, 'J')
                  .replace(/[^A-Z0-9\s]/g, '')
                  .replace(/\n/g, ' ');

                const rawParts = preparedText.split(/\s/).filter(part => part.length > 0);
                const parts = [];
                console.debug(rawParts);
                let i;
                for (i = 0; i < rawParts.length - 1; i++) {
                  if (rawParts[i].length + rawParts[i + 1].length === 17) {
                    parts.push(rawParts[i] + rawParts[i + 1]);
                    i++;
                  } else {
                    parts.push(rawParts[i]);
                  }
                }
                if (i < rawParts.length) {
                  parts.push(rawParts[i]);
                }

                console.debug(parts);

                let resultVin = null;
                const checkVin = (vin) => {
                  if (VinDecoder.isValid(vin) && VinDecoder.getCompany(vin) === company.name) {
                    resultVin = vin;
                    return true;
                  }
                  return false;
                };

                for (let j = 0; j < parts.length; j++) {
                  const possibleVin = parts[j];
                  if (possibleVin.length === 17) {
                    tryAllVariants(possibleVin, ['5', '8', '0'], ['S', 'B', 'D'], checkVin);
                  }
                }
                subject.next(resultVin);
                subject.complete();
              } catch (e) {
                subject.next(e);
                subject.complete();
              }
            }
          });
      });
    return subject.asObservable();
  }

  private prepareReq(blob: any): HttpRequest<FormData> {
    const formdata: FormData = new FormData();

    formdata.append('apikey', 'b364f313f988957');
    formdata.append('file', <Blob>blob);
    formdata.append('detectOrientation', 'true');
    formdata.append('scale', 'true');

    const req = new HttpRequest<FormData>('POST', 'https://api.ocr.space/parse/image', formdata, {
      reportProgress: true,
      responseType: 'json'
    });
    return req;
  }

  private prepareText(event: HttpResponse<any>): string {
    if (event.body.IsErroredOnProcessing) {
      throw(new Error(event.body.ErrorMessage[0]));
    }
    return event.body.ParsedResults[0].ParsedText;
  }

  private reduceImgFile(file: File, img: any = null, width: number = null, height: number = null): Promise<File> {
    const document = this.win.nativeWindow.document;
    console.debug(`File: '${file.name}', size: ${file.size}`);
    if (file.size < environment.ocrFileSizeLimit) {
      return Promise.resolve(file);
    }
    let imgPromise;
    if (img) {
      imgPromise = Promise.resolve(img);
    } else {
      imgPromise = new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          img = document.createElement('img');
          img.onload = (imageEvent) => {
            resolve(img);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });
    }
    return imgPromise
      .then(image => {
        return new Promise((resolve, reject) => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!width && !height) {
            width = image.width;
            height = image.height;
            console.debug(`Original size ${width}x${height}`);
          }
          width *= 0.75;
          height *= 0.75;
          console.debug(`Reduced to ${width}x${height}`);

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(image, 0, 0, width, height);
          canvas.toBlob((blob) => {
            resolve(this.reduceImgFile(new File([blob], 'Image.jpg'), image, width, height));
          }, 'image/jpeg', 0.8);
        });
      });
  }

  private prepareImgForOcr(file: File): Promise<File> {
    const document = this.win.nativeWindow.document;
    return new Promise<any>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = document.createElement('img');
        img.onload = (imageEvent) => {
          resolve(img);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    })
      .then(img => {
        return new Promise<File>((resolve, reject) => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const pixels = ctx.getImageData(0, 0, img.width, img.height);

          const d = pixels.data;
          console.debug(`pixels length ${d.length}`);
          let count = 0, summ = 0;

          for (let i = 0; i < d.length; i += 4) {
            const r = d[i];
            const g = d[i + 1];
            const b = d[i + 2];
            const v = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
            summ += v;
            count++;
          }
          const threshold = summ / count;

          console.debug(`threshold ${threshold}`);
          if (threshold > 128) {
            const bgColor = 255;
            for (let i = 0; i < d.length; i += 4) {
              const r = d[i];
              const g = d[i + 1];
              const b = d[i + 2];
              let v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= threshold) ? 255 : 0;
              const d1 = (g - r) / g * 100;
              const d2 = (g - b) / g * 100;
              if (d1 > 5 && d2 > 5) {
                v = bgColor;
              }
              if (v === bgColor) {
                d[i] = d[i + 1] = d[i + 2] = v;
              }
            }
          }

          ctx.putImageData(pixels, 0, 0);
          canvas.toBlob((blob) => {
              resolve(new File([blob], 'Image.jpg'));
          }, 'image/jpeg', 0.8);
        });
      });
  }
}

function replaceAt(str, index, replacement) {
  return str.substr(0, index) + replacement + str.substr(index + replacement.length);
}

function change(str, changes, cb) {
  if (!cb(str)) {
    let needContinue = false;
    changes.forEach((changing) => {
      if (!needContinue) {
        needContinue = change(
          replaceAt(str, changing.pos, changing.to),
          changes.filter(c => c !== changing),
          cb
        );
      }
    });
    return needContinue;
  }
  return true;
}

function tryAllVariants(str, from, to, cb) {
  const allFrom = from.concat(to);
  const allTo = to.concat(from);
  const changes = [];
  allFrom.forEach((fromSymbol, i) => {
    let pos = str.indexOf(fromSymbol);
    while (pos !== -1) {
      changes.push({ pos, to: allTo[i] });
      pos = str.indexOf(fromSymbol, pos + 1);
    }
  });
  change(str, changes, cb);
}

