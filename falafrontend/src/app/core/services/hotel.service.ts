// src/app/core/services/hotel.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { Hotel, ApiHotelResponse } from '../models/hotel';
import { SearchCriteria } from '../models/search-criteria';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private readonly apiUrl = environment.apiUrl;
  private readonly hotelsEndpoint = `${this.apiUrl}/hotels`;

  constructor(private http: HttpClient) {}

  getAllHotels(): Observable<Hotel[]> {
    return this.http.get<ApiHotelResponse[]>(this.hotelsEndpoint)
      .pipe(
        map(this.transformHotelsData.bind(this)), //primero transformar
        retry(2),                                 //despues reintentar
        catchError(this.handleError.bind(this))   //finalmente errores
      );
  }

  searchHotels(criteria: SearchCriteria): Observable<Hotel[]> {
    const params = this.buildSearchParams(criteria);
    return this.http.get<ApiHotelResponse[]>(`${this.hotelsEndpoint}/search`, { params })
      .pipe(
        map(this.transformHotelsData.bind(this)),
        retry(2),
        catchError(this.handleError.bind(this))
      );
  }

  getHotelById(id: string): Observable<Hotel> {
    return this.http.get<ApiHotelResponse>(`${this.hotelsEndpoint}/${id}`)
      .pipe(
        map(this.transformSingleHotelData.bind(this)),
        catchError(this.handleError.bind(this))
      );
  }

  private transformHotelsData(hotels: ApiHotelResponse[]): Hotel[] {
    return hotels.map(hotel => this.transformSingleHotelData(hotel));
  }

  private transformSingleHotelData(hotel: ApiHotelResponse): Hotel {
    return {
      id: hotel._id,
      name: hotel.name,
      location: hotel.location,
      description: hotel.description,
      amenities: hotel.amenities || [],
      price: hotel.basePrice || 350000,
      rating: hotel.rating || 4.5,
      totalReviews: hotel.totalReviews || 0,
      imageUrls: hotel.imageUrls || [],
      imageUrl: hotel.imageUrls?.[0],
      capacity: hotel.totalCapacity || 2,
      isActive: hotel.isActive !== false, // true por defecto
      createdAt: hotel.createdAt,
      updatedAt: hotel.updatedAt
    };
  }

  private buildSearchParams(criteria: SearchCriteria): HttpParams {
    let params = new HttpParams();
    
    if (criteria.destination) {
      params = params.set('location', criteria.destination);
    }
    if (criteria.guests) {
      params = params.set('people', criteria.guests.toString());
    }
    if (criteria.minPrice) {
      params = params.set('minPrice', criteria.minPrice.toString());
    }
    if (criteria.maxPrice) {
      params = params.set('maxPrice', criteria.maxPrice.toString());
    }
    
    return params;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido en el servidor';
    
    if (error.error instanceof ErrorEvent) {
      // error del cliente/red
      errorMessage = `Error de red: ${error.error.message}`;
    } else {
      // error del servidor
      switch (error.status) {
        case 0:
          errorMessage = 'no se puede conectar al servidor. Verifica tu conexión.';
          break;
        case 404:
          errorMessage = 'no se encontraron hoteles con esos criterios.';
          break;
        case 500:
          errorMessage = 'error interno del servidor. Inténtalo más tarde.';
          break;
        default:
          errorMessage = `error ${error.status}: ${error.message}`;
      }
    }
    
    console.error('Error en HotelService:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}