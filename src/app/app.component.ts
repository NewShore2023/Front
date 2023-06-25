import { Component } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Datos, FlightInfo } from './datos';
import {
  checkITextIsValid,
  checkIsValidEqualsOriginAndDestination,
} from '../utils';
import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'flight';
  loading: boolean = false;
  vueloExite: boolean = false;
  origin: string = '';
  destination: string = '';
  flightInfo: FlightInfo = {
    flights: [],
    origin: '',
    destination: '',
    price: 0,
  };
  formulario: FormGroup;
  fieldsEquals: boolean = false;
  fiedsIsNumber: boolean = false;
  selectedOption: string = '';
  conversionRate: number = 1;
  options = [
    { label: 'USD', value: 'USD' },
    { label: 'COP', value: 'COP' },
    { label: 'EUR', value: 'EUR' },
  ];
  constructor(private http: HttpClient, private formBuilder: FormBuilder) {
    this.formulario = this.formBuilder.group({
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      selectedOption: ['', Validators.required],
    });
  }

  onSubmit() {
    this.loading = true;
    const url = 'https://localhost:7257/PostFlight';
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    if (checkITextIsValid(this.origin) && checkITextIsValid(this.destination)) {
      const body: Datos = {
        origin: this.origin.toUpperCase(),
        destination: this.destination.toUpperCase(),
      };

      if (
        !checkIsValidEqualsOriginAndDestination(body.origin, body.destination)
      ) {
        this.http
          .post(url, body, { headers })
          .pipe(catchError(this.handleError))
          .subscribe(
            (response) => {
              this.flightInfo = response as FlightInfo;
              this.loading = false;
              this.fiedsIsNumber = false;
              this.fieldsEquals = false;
              this.vueloExite = true;
              console.log('Respuesta exitosa:', response);
            },
            (error) => {
              this.loading = false;
              this.fieldsEquals = false;
              this.fiedsIsNumber = false;
              console.error('Error:', error);
            }
          );
      } else {
        this.loading = false;
        this.fieldsEquals = true;
        this.fiedsIsNumber = false;
      }
    } else {
      this.loading = false;
      this.fiedsIsNumber = true;
      this.fieldsEquals = false;
    }
    this.onChangeMoney();
  }
  public onChangeMoney() {
    if (
      this.selectedOption !== '' &&
      checkITextIsValid(this.origin) &&
      checkITextIsValid(this.destination) &&
      !checkIsValidEqualsOriginAndDestination(this.origin, this.destination)
    ) {
      console.log('option', this.selectedOption);
      let moneda = '';
      moneda = this.selectedOption === 'COP' ? 'USD' :this.selectedOption === 'USD' ? 'COP': this.selectedOption;
      const apiUrl = `https://api.exchangerate-api.com/v4/latest/${moneda}`;
      axios
        .get(apiUrl)
        .then((response) => {
          const conversionRate = response.data.rates.COP;
          console.log('rate', conversionRate);
          this.conversionRate = conversionRate;
        })
        .catch((error) => {
          console.error('Error al obtener la tasa de cambio:', error);
        });
    }
  }
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Ocurrió un error:', error.error.message);
    } else {
      console.error(`Código de respuesta del servidor: ${error.status}`);
      console.error('Cuerpo de respuesta:', error.error);
    }
    return throwError(
      'Algo salió mal. Por favor, inténtalo de nuevo más tarde.'
    );
  }
}
