import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DemandeurService } from "../../services/services/demandeur.service";
import { DemandeurDto } from "../../services/models/demandeur-dto";
import { Router } from "@angular/router";
import { UtilisateurService } from "../../services/services/utilisateur.service";
import { UtilisateurDto } from "../../services/models/utilisateur-dto";
import Swal from "sweetalert2";
import { FileuploadService } from "../../services/services/fileupload.service";
import { ImageService } from "../../auth/service/image.service";
import { FileUpload } from 'src/app/services/models';
import { DomSanitizer } from '@angular/platform-browser';
import { RegionDepartementService } from 'src/app/services/services/region-departement.service';
import { Departement } from 'src/app/services/models/departement';
import { Region } from 'src/app/services/models/region';
import { last } from 'rxjs';

@Component({
  selector: 'app-add-demandeur',
  templateUrl: './add-demandeur.component.html',
  styleUrls: ['./add-demandeur.component.css']
})
export class AddDemandeurComponent implements OnInit {
  
[x: string]: any;

  demandeurDto: DemandeurDto = { adresse: "", lieudenaissance: "", sexe: "", telephone: "" };
  demandeurForm!: FormGroup;
  user: UtilisateurDto = {};
  myImage!: string;
  uploadedImage!: File;
  uploadedImages!: File[];
  loading: boolean = false;
  nbm: any;
  minDate: string = new Date().toISOString().split('T')[0];
  maxDate = "2024-08-15";
  selectedFiles: File[] = [];
  filePreview: any = null;

  
  regions: Region[] = [];
  departements: Departement[] = [];
  regionId?: number;

  isSelect : boolean = false;


  isCaptureAllowed: boolean = true;



  constructor(
    private formBuilder: FormBuilder,
    private demandeurService: DemandeurService,
    private router: Router,
    private utilisateur: UtilisateurService,
    private fileService: FileuploadService,
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
    private regionDepartementService: RegionDepartementService
  ) { }

  ngOnInit(): void {
    let d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    this.minDate = `${year}-${month}-${day}`;

    this.getDemandeur(localStorage.getItem("nin") as string);
    this.getUtilsateut(Number(localStorage.getItem("userId")));

    this.demandeurForm = this.formBuilder.group({
      prenom: ['', [Validators.required]],
      nom: ['', [Validators.required]],
      nin: ['', [Validators.required]],
      datedenaissance: ['', [Validators.required]],
      sexe: ['', [Validators.required]],
      lieudenaissance: ['', [Validators.required]],
      adresse: ['', [Validators.required]],
      fonction: ['', [Validators.required]],
      region: ['', [Validators.required]],
      departement: ['', [Validators.required]],
      telephone: ['', [Validators.required, Validators.pattern('^(\\+ ?\\(?221\\)? ?)?7[0678][0-9]{7}$|^(\\+ ?\\(?221\\)? ?)?7[0678] [0-9]{3} [0-9]{2} [0-9]{2}$')]],
      file: ['', [Validators.required]],
    });

    this.nbm = this.demandeurDto.fieluploads?.length;
    this.loadRegions();
  }

  loadRegions(): void {
    this.regionDepartementService.getAllRegions().subscribe(data => {
      this.regions = data;
    });
  }
  
  onRegionSelected(event: Event | number): void {
    let regionId: number;
  
    if (typeof event === 'number') {
      regionId = event;
    } else {
      const target = event.target as HTMLSelectElement;
      regionId = Number(target.value);
    }
  
    console.log('Région sélectionnée ID:', regionId);
      this.isSelect = false;
    this.regionDepartementService.getDepartementsByRegionId(regionId).subscribe(deps => {
      this.departements = deps;
      this.isSelect = true;
    });
  }
  




getDemandeur(nin: string) {
    this.demandeurService.getByNin1({ nin: nin }).subscribe({
      next: (data) => {
        this.router.navigate(['mes-demandes', data.id]);
      },
      error: (err: any) => {
        this.router.navigate(['demandeur']);
      }
    });
  }

getUtilsateut(id: number) {
    this.utilisateur.getById({ id: id }).subscribe({
      next: (data) => {
        this.user = data;
      }
    });
  }
 

  



async onCreate() {
  if (this.demandeurForm.invalid) {
    this.demandeurForm.markAllAsTouched();
    return;
  }

  if (!this.uploadedImages || this.uploadedImages.length === 0) {
    Swal.fire({ icon: "error", title: "Veuillez ajouter un fichier." });
    return;
  }

  const firstFile = this.uploadedImages[0];
  if (firstFile.size > 4000000) {
    Swal.fire({ icon: "error", title: "Fichier trop volumineux (max 4Mo)." });
    return;
  }

  if (!firstFile.type.includes("application/pdf") && !firstFile.type.includes("image/")) {
    Swal.fire({ icon: "error", title: "Fichier non supporté." });
    return;
  }

  this.demandeurDto.nin = localStorage.getItem("nin")!;
  this.loading = true;

  this.demandeurService.incription({ body: this.demandeurDto }).subscribe({
    next: (data) => {
      this.loading = false;

      for (let i = 0; i < this.uploadedImages.length; i++) {
        const file = this.uploadedImages[i];
        this.imageService.uploadImageDemandeur(file, '', Number(data)).subscribe();
      }

      Swal.fire({ icon: "success", title: "Informations enregistrées." }).then(() => {
        this.router.navigate(['mes-demandes', data]);
      });
    },
    error: () => {
      this.loading = false;
      Swal.fire({ icon: "error", title: "Échec lors de l'enregistrement." });
    }
  });
}


convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}


isCapture(file: File): boolean {
  const captureExtensions = ['jpg', 'jpeg', 'png'];
  const name = file.name.toLowerCase();
  const extension = name.split('.').pop() || '';

  const isGenericName = name.startsWith('image') && name.length <= 15;
  const isRecent = (Date.now() - file.lastModified) < 100000; // 10 secondes

  return captureExtensions.includes(extension) && (isGenericName || isRecent);
}

convertToPng(base64Image: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Redimensionnement si trop grand
      const maxWidth = 1024;
      const maxHeight = 1024;
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject('Canvas context null');
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const pngDataUrl = canvas.toDataURL('image/png');
      resolve(pngDataUrl);
    };

    img.onerror = (err) => {
      reject('Erreur chargement image pour PNG: ' + err);
    };

    img.src = base64Image;
  });
}


async onImageUploads(event: Event) {
  if (!this.isCaptureAllowed) {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "La capture directe n'est pas autorisée, veuillez choisir dans votre appareil !",
      showConfirmButton: true,
      timer: 6000
    });
    return;
  }

  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const files = Array.from(input.files);
    this.uploadedImages = files;
    this.filePreview = [];

    for (const file of files) {
      if (this.isCapture(file)) {
        try {
          const base64Original = await this.convertToBase64(file);
          const base64Png = await this.convertToPng(base64Original);
          this.filePreview.push(this.sanitizer.bypassSecurityTrustResourceUrl(base64Png));
        } catch (error) {
          console.error('Erreur conversion PNG:', error);
        }
      } else {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const base64File = e.target!.result as string;
          if (file.type.includes("image/") || file.type.includes("pdf")) {
            this.filePreview.push(this.sanitizer.bypassSecurityTrustResourceUrl(base64File));
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }
}











  
}
