import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormService } from '../../services/form.service';
import { HttpClient } from '@angular/common/http';
import { FileModel } from '../../models/file.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { codCIU,tipodepersona,tipodecliente } from './datos';
import { MatInput, MatInputModule } from '@angular/material/input'
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';





@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormComponent,MatInputModule, 
    MatAutocomplete,MatInput,MatAutocompleteModule ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})

export class FormComponent implements OnInit  {

  departamentotext: string[] = ["ALICANTE","ALCOY","S. P. ALCOY","SES VALENCIA","TORREVIEJA","VINAROZ","XATIVA"]
  Items:  string[];
  autoFilter: Observable<string[]>;
  formControl = new FormControl();
  
  

  constructor(private formBuilder: FormBuilder,private formService: FormService, private http: HttpClient,
    private router: Router
  ) { 
        this.Items = this.datosciu
    this.autoFilter = this.formControl.valueChanges.pipe(
      startWith(''),
      map(value => this.mat_filter(value))
    );}

    
    private mat_filter(value: string): string[] {
      const filterValue = value.toLowerCase();
      return this.Items.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    
    
  }

  

  
  showProgress: boolean = false;
  companyName = '';
  typeDocuments: any[] = [
   
    {
      "id": "NIT",
      "description": "NIT - Número de Identificación Tributaria"
    },
    {
      "id": "CC",
      "description": "CC - Cédula de Ciudadanía"
    },
    {
      "id": "CE",
      "description": "CE - Cédula de Extranjería"
    },
    {
      "id": "PP",
      "description": "PP -Pasaporte"
    },
    {
      "id": "RN",
      "description": "Registro Nacional de Identificación (RN)"
    }
  ];
 
  
 
 
  
  

     person:any[]=tipodecliente 
  
      tipoperson: any[]= tipodepersona;


       datosciu: string[] =codCIU;
    
       
       

      
   
  inicio:boolean=true
  personalDetails: boolean = false;
  pepSection: boolean = false;
  dataConsent: boolean = false;
  clientDetails: boolean = false;
  filesToUpload: Map<string, File> = new Map();
  datoscliente= true;
 
  selectedTipoPersona: string = '';
  


  

  onFileSelected(event: any, fileName: string) {
    const file: File = event.target.files[0];
    this.filesToUpload.set(fileName, file);
  }

  async convertFileToBase64(archivo: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(archivo);
    });
  }

  async sendAttachment() {
    const archivosBase64: FileModel[] = [];

    for (const [key, archivo] of this.filesToUpload.entries()) {
      console.log(key)
      const dataURL = await this.convertFileToBase64(archivo);
      archivosBase64.push({ fileName: key, fileData: dataURL });
    }

    this.formService.upload(archivosBase64,this.datosiniciales.value,this.datosprincipales.value).subscribe(res => {
      console.log(res)
    })
  }


  
  showInicio() {
    this.showProgress=false;
    this.inicio=true;
    this.personalDetails = false;
    this.pepSection = false;
    this.dataConsent = false;
    this.clientDetails = false;
  }

  showPersonalDetails() {
    this.inicio=false;
    this.personalDetails = true;
    this.pepSection = false;
    this.dataConsent = false;
    this.clientDetails = false;
  }

  showPepSection() {
    this.inicio=false;
    this.personalDetails = false;
    this.pepSection = true;
    this.dataConsent = false;
    this.clientDetails = false;
  }

  showDataConsent() {
    this.inicio=false;
    this.personalDetails = false;
    this.pepSection = false;
    this.dataConsent = true;
    this.clientDetails = false;
  }

  showClientDetails() {
    this.inicio=false;
    this.personalDetails = false;
    this.pepSection = false;
    this.dataConsent = false;
    this.clientDetails = true;
  }



 


 
  
  datosiniciales: FormGroup = new FormGroup({}); 
  datosprincipales: FormGroup = new FormGroup({});

  /*-------------------------------datos iniciales ----------------------*/
  ngOnInit(): void {
    this.datosiniciales = this.formBuilder.group({
      selectedPerson: ['', Validators.required],
      tipopersona:['', Validators.required],
      tipoDocumentoCliente:[''],
      numerodoccliente:['']
    });

    /*-------------------------------datos principales ----------------------*/

    this.datosprincipales = this.formBuilder.group({
      razonsocial: ['', Validators.required],
      tipodoc:['', Validators.required],
      numerodoc:['', Validators.required],
      correo:['', Validators.required,Validators.email],
      codCIIU:['', Validators.required],
      descripcionCIIU:['', Validators.required],
      direccion:['', Validators.required],
      municipio:['', Validators.required],
      departamento:['', Validators.required],
      telefono:['', Validators.required],
      operacionesvirt:['', Validators.required],
      operacual:['', Validators.required],
      opcionSeleccionada: ['']

    });

    this.datosiniciales.get('selectedPerson')?.valueChanges.subscribe(value => {
      this.setDocumentValidators(value);
    });

   
  }

  

    
  



  
  


// Método para establecer los validadores de los campos de datos iniciales
private setDocumentValidators(selectedPersonValue: string): void {
  const tipoDocumentoClienteControl = this.datosiniciales.get('tipoDocumentoCliente');
  const numerodocclienteControl = this.datosiniciales.get('numerodoccliente');

  if (selectedPersonValue === 'codeudor') {
    tipoDocumentoClienteControl?.setValidators([Validators.required]);
    numerodocclienteControl?.setValidators([Validators.required]);
  } else {
    tipoDocumentoClienteControl?.clearValidators();
    numerodocclienteControl?.clearValidators();
  }

  // Actualizar los validadores
  tipoDocumentoClienteControl?.updateValueAndValidity();
  numerodocclienteControl?.updateValueAndValidity();
}

  

  resetFields() {
    
    this.datosiniciales.get('tipopersona')?.reset();
    this.datosiniciales.get('tipoDocumentoCliente')?.reset();
    this.datosiniciales.get('numerodoccliente')?.reset();
    
  }
   


  // evento siguiente del los datos iniciales
  
  submitForm1() {
    if (this.datosiniciales.valid) {
      console.log('Formulario valido');
      this.showProgress=true;
      if(this.selectedTipoPersona==='Codeudor'){
      this.showPepSection()}
      else{
        this.showPersonalDetails()}
    } else {
      this.datosiniciales.markAllAsTouched();
       alert("Diligenciar todos los campos")
    }
  }

    
    



 
}

