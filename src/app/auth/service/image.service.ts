import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {FileUploadResponse} from "../../services/models/file-upload-response";
import {ApiConfiguration} from "../../services/api-configuration";
import { FileUpload } from 'src/app/services/models';
import { IntercoDto } from '../model/interco-dto';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  intercoDto!: IntercoDto;
  
  constructor(private http: HttpClient, private apiConfig: ApiConfiguration) { }

  uploadImageFS(file: File, idDemandeur : number): Observable<FileUploadResponse>{
    const imageFormData = new FormData();
    imageFormData.append('file', file);
    const url = `${this.apiConfig.rootUrl + '/api/uploads'}/${idDemandeur}`;
    return this.http.post<FileUploadResponse>(url, imageFormData);
  }

  uploadImageFST(file: File, idUtilisateur : number): Observable<FileUploadResponse>{
    const imageFormData = new FormData();
    imageFormData.append('file', file);
    const url = `${this.apiConfig.rootUrl + '/api/uploads/traitant'}/${idUtilisateur}`;
    return this.http.post<FileUploadResponse>(url, imageFormData);
  }


  uploadImage(file: File): Observable<FileUpload>{
    const imageFormData = new FormData();
    imageFormData.append('file', file);
    const url = `${this.apiConfig.rootUrl + '/api/uploads/create'}`;
    return this.http.post<FileUpload>(url, imageFormData);
  }

  uploadImages(file: File): Observable<FileUpload>{
    const imageFormData = new FormData();
    imageFormData.append('file', file);
    const url = `${this.apiConfig.rootUrl + '/api/uploads/create/imagemultiple'}`;
    return this.http.post<FileUpload>(url, imageFormData);
  }

  // uploadImageDemandeur(file: File, idDemandeur : number): Observable<FileUpload>{
  //   const imageFormData = new FormData();
  //   imageFormData.append('file', file);
  //   const url = `${this.apiConfig.rootUrl + '/api/uploads/create'}/${idDemandeur}`;
  //   return this.http.post<FileUpload>(url, imageFormData);
  // }
  uploadImageDemandeur(file: File, base64Image: string, idDemandeur: number): Observable<FileUpload> {
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    if (base64Image) {
      formData.append("base64Image", base64Image);
    }
  
    const url = `${this.apiConfig.rootUrl}/api/uploads/create/${idDemandeur}`;
    return this.http.post<FileUpload>(url, formData);
  }
  
  
  
  // uploadImageDemandeur(file: File, base64Image: string , idDemandeur: number): Observable<FileUpload> {
  //   const imageFormData = new FormData();
    
  //   if (file) {
  //     imageFormData.append('file', file);
  //   }
  //   if (base64Image) {
  //     imageFormData.append('base64Image', base64Image);
  //   }
    
  
  //   const url = `${this.apiConfig.rootUrl + '/api/uploads/create'}/${idDemandeur}`;
  //   return this.http.post<FileUpload>(url, imageFormData);
  // }
  

  // uploadImageInterco(file: File, base64Image: string , idDemandeur: number): Observable<FileUpload> {
  //   const imageFormData = new FormData();

  //   if (file) {
  //     imageFormData.append('file', file);
  //   }
  //   if (base64Image) {
  //     imageFormData.append('base64Image', base64Image);
  
  //   }
  //   const url = `${this.apiConfig.rootUrl + '/api/uploads/create1'}/${idDemandeur}`;
  //   return this.http.post<FileUpload>(url, imageFormData);
  // }

  uploadImageInterco(file: File, base64Image: string, idDemandeur: number, intercoDto: any): Observable<FileUpload> {
    const imageFormData = new FormData();
  
    if (file) {
      imageFormData.append('file', file);
    }
    if (base64Image) {
      imageFormData.append('base64Image', base64Image);
    }
    if (intercoDto) {
      // console.log("JSON.stringify(intercoDto)" , JSON.stringify(intercoDto));
      imageFormData.append('intercoDto', JSON.stringify(intercoDto));
    }
  
    const url = `${this.apiConfig.rootUrl}/api/uploads/create1/${idDemandeur}`;
    return this.http.post<FileUpload>(url, imageFormData);
  }
  
  

}
