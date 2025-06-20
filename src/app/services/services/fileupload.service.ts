/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { createImage } from '../fn/fileupload/create-image';
import { CreateImage$Params } from '../fn/fileupload/create-image';
import { createImage1 } from '../fn/fileupload/create-image-1';
import { CreateImage1$Params } from '../fn/fileupload/create-image-1';
import { createImageDemandur } from '../fn/fileupload/create-image-demandur';
import { CreateImageDemandur$Params } from '../fn/fileupload/create-image-demandur';
import { deleteImage } from '../fn/fileupload/delete-image';
import { DeleteImage$Params } from '../fn/fileupload/delete-image';
import { downloadFiles } from '../fn/fileupload/download-files';
import { DownloadFiles$Params } from '../fn/fileupload/download-files';
import { FileUpload } from '../models/file-upload';
import { FileUploadResponse } from '../models/file-upload-response';
import { getImageByIdFile } from '../fn/fileupload/get-image-by-id-file';
import { GetImageByIdFile$Params } from '../fn/fileupload/get-image-by-id-file';
import { getImageFs } from '../fn/fileupload/get-image-fs';
import { GetImageFs$Params } from '../fn/fileupload/get-image-fs';
import { getTraitant } from '../fn/fileupload/get-traitant';
import { GetTraitant$Params } from '../fn/fileupload/get-traitant';
import { loadAttestation } from '../fn/fileupload/load-attestation';
import { LoadAttestation$Params } from '../fn/fileupload/load-attestation';
import { loadAttestationByCode } from '../fn/fileupload/load-attestation-by-code';
import { LoadAttestationByCode$Params } from '../fn/fileupload/load-attestation-by-code';
import { uploadFile } from '../fn/fileupload/upload-file';
import { UploadFile$Params } from '../fn/fileupload/upload-file';
import { uploadFileImage } from '../fn/fileupload/upload-file-image';
import { UploadFileImage$Params } from '../fn/fileupload/upload-file-image';
import { uploadFileTraitant } from '../fn/fileupload/upload-file-traitant';
import { UploadFileTraitant$Params } from '../fn/fileupload/upload-file-traitant';

@Injectable({ providedIn: 'root' })
export class FileuploadService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `uploadFile()` */
  static readonly UploadFilePath = '/api/uploads/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `uploadFile()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  uploadFile$Response(params: UploadFile$Params, context?: HttpContext): Observable<StrictHttpResponse<FileUploadResponse>> {
    return uploadFile(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `uploadFile$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  uploadFile(params: UploadFile$Params, context?: HttpContext): Observable<FileUploadResponse> {
    return this.uploadFile$Response(params, context).pipe(
      map((r: StrictHttpResponse<FileUploadResponse>): FileUploadResponse => r.body)
    );
  }

  /** Path part for operation `deleteImage()` */
  static readonly DeleteImagePath = '/api/uploads/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteImage()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteImage$Response(params: DeleteImage$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return deleteImage(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deleteImage$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteImage(params: DeleteImage$Params, context?: HttpContext): Observable<void> {
    return this.deleteImage$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `uploadFileImage()` */
  static readonly UploadFileImagePath = '/api/uploads/uploadImageDemandeur/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `uploadFileImage()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  uploadFileImage$Response(params: UploadFileImage$Params, context?: HttpContext): Observable<StrictHttpResponse<FileUpload>> {
    return uploadFileImage(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `uploadFileImage$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  uploadFileImage(params: UploadFileImage$Params, context?: HttpContext): Observable<FileUpload> {
    return this.uploadFileImage$Response(params, context).pipe(
      map((r: StrictHttpResponse<FileUpload>): FileUpload => r.body)
    );
  }

  /** Path part for operation `uploadFileTraitant()` */
  static readonly UploadFileTraitantPath = '/api/uploads/traitant/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `uploadFileTraitant()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  uploadFileTraitant$Response(params: UploadFileTraitant$Params, context?: HttpContext): Observable<StrictHttpResponse<FileUploadResponse>> {
    return uploadFileTraitant(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `uploadFileTraitant$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  uploadFileTraitant(params: UploadFileTraitant$Params, context?: HttpContext): Observable<FileUploadResponse> {
    return this.uploadFileTraitant$Response(params, context).pipe(
      map((r: StrictHttpResponse<FileUploadResponse>): FileUploadResponse => r.body)
    );
  }

  /** Path part for operation `createImage()` */
  static readonly CreateImagePath = '/api/uploads/create';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createImage()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createImage$Response(params?: CreateImage$Params, context?: HttpContext): Observable<StrictHttpResponse<FileUpload>> {
    return createImage(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `createImage$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createImage(params?: CreateImage$Params, context?: HttpContext): Observable<FileUpload> {
    return this.createImage$Response(params, context).pipe(
      map((r: StrictHttpResponse<FileUpload>): FileUpload => r.body)
    );
  }

  /** Path part for operation `createImageDemandur()` */
  static readonly CreateImageDemandurPath = '/api/uploads/create/{idDemandeur}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createImageDemandur()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createImageDemandur$Response(params: CreateImageDemandur$Params, context?: HttpContext): Observable<StrictHttpResponse<FileUpload>> {
    return createImageDemandur(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `createImageDemandur$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createImageDemandur(params: CreateImageDemandur$Params, context?: HttpContext): Observable<FileUpload> {
    return this.createImageDemandur$Response(params, context).pipe(
      map((r: StrictHttpResponse<FileUpload>): FileUpload => r.body)
    );
  }

  /** Path part for operation `createImage1()` */
  static readonly CreateImage1Path = '/api/uploads/create/imagemultiple';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createImage1()` instead.
   *
   * This method doesn't expect any request body.
   */
  createImage1$Response(params: CreateImage1$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return createImage1(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `createImage1$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  createImage1(params: CreateImage1$Params, context?: HttpContext): Observable<string> {
    return this.createImage1$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  /** Path part for operation `getImageFs()` */
  static readonly GetImageFsPath = '/api/uploads/loadfromFS/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getImageFs()` instead.
   *
   * This method doesn't expect any request body.
   */
  getImageFs$Response(params: GetImageFs$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<string>>> {
    return getImageFs(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getImageFs$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getImageFs(params: GetImageFs$Params, context?: HttpContext): Observable<Array<string>> {
    return this.getImageFs$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<string>>): Array<string> => r.body)
    );
  }

  /** Path part for operation `getTraitant()` */
  static readonly GetTraitantPath = '/api/uploads/loadImageTraitant/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getTraitant()` instead.
   *
   * This method doesn't expect any request body.
   */
  getTraitant$Response(params: GetTraitant$Params, context?: HttpContext): Observable<StrictHttpResponse<{
}>> {
    return getTraitant(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getTraitant$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getTraitant(params: GetTraitant$Params, context?: HttpContext): Observable<{
}> {
    return this.getTraitant$Response(params, context).pipe(
      map((r: StrictHttpResponse<{
}>): {
} => r.body)
    );
  }

  /** Path part for operation `loadAttestationByCode()` */
  static readonly LoadAttestationByCodePath = '/api/uploads/loadAttestationByCode/{code}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `loadAttestationByCode()` instead.
   *
   * This method doesn't expect any request body.
   */
  loadAttestationByCode$Response(params: LoadAttestationByCode$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<string>>> {
    return loadAttestationByCode(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `loadAttestationByCode$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  loadAttestationByCode(params: LoadAttestationByCode$Params, context?: HttpContext): Observable<Array<string>> {
    return this.loadAttestationByCode$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<string>>): Array<string> => r.body)
    );
  }

  /** Path part for operation `loadAttestation()` */
  static readonly LoadAttestationPath = '/api/uploads/loadAttestation/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `loadAttestation()` instead.
   *
   * This method doesn't expect any request body.
   */
  loadAttestation$Response(params: LoadAttestation$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<string>>> {
    return loadAttestation(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `loadAttestation$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  loadAttestation(params: LoadAttestation$Params, context?: HttpContext): Observable<Array<string>> {
    return this.loadAttestation$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<string>>): Array<string> => r.body)
    );
  }

  /** Path part for operation `getImageByIdFile()` */
  static readonly GetImageByIdFilePath = '/api/uploads/getImageByIdFile/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getImageByIdFile()` instead.
   *
   * This method doesn't expect any request body.
   */
  getImageByIdFile$Response(params: GetImageByIdFile$Params, context?: HttpContext): Observable<StrictHttpResponse<{
}>> {
    return getImageByIdFile(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getImageByIdFile$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getImageByIdFile(params: GetImageByIdFile$Params, context?: HttpContext): Observable<{
}> {
    return this.getImageByIdFile$Response(params, context).pipe(
      map((r: StrictHttpResponse<{
}>): {
} => r.body)
    );
  }

  /** Path part for operation `downloadFiles()` */
  static readonly DownloadFilesPath = '/api/uploads/download/{filename}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `downloadFiles()` instead.
   *
   * This method doesn't expect any request body.
   */
  downloadFiles$Response(params: DownloadFiles$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
    return downloadFiles(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `downloadFiles$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  downloadFiles(params: DownloadFiles$Params, context?: HttpContext): Observable<Blob> {
    return this.downloadFiles$Response(params, context).pipe(
      map((r: StrictHttpResponse<Blob>): Blob => r.body)
    );
  }
  getImagesByDemandeurId(idDemandeur: number) {
    return this.http.get<any[]>(`${this.rootUrl}/getImagesByIdDemandeur/${idDemandeur}`);
  }

}
