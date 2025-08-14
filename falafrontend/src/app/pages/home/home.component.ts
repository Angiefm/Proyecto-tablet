// src/app/pages/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HotelCardComponent } from '../../features/hotels/hotel-card/hotel-card.component';
import { Hotel } from '../../core/models/hotel';
import { SearchCriteria } from '../../core/models/search-criteria';
import { HotelService } from '../../core/services/hotel.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HotelCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  searchCriteria: SearchCriteria = {
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 2
  };

  featuredHotels: Hotel[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(
    private hotelService: HotelService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('🏠 Componente Home iniciado');
    this.loadFeaturedHotels();
  }

  onSearch(): void {
    this.loading = true;
    this.error = '';
    
    console.log('🔍 Búsqueda iniciada con criterios:', this.searchCriteria);
    
    // Validar criterios básicos
    if (!this.searchCriteria.destination) {
      this.error = 'Por favor selecciona un destino';
      this.loading = false;
      return;
    }

    if (this.searchCriteria.guests < 1) {
      this.error = 'Debe haber al menos 1 huésped';
      this.loading = false;
      return;
    }
    
    this.hotelService.searchHotels(this.searchCriteria).subscribe({
      next: (hotels) => {
        console.log('búsqueda completada:', hotels);
        this.featuredHotels = hotels;
        this.loading = false;
        
        if (hotels.length === 0) {
          this.error = 'No se encontraron hoteles con esos criterios. Intenta con otros filtros.';
        }
      },
      error: (error) => {
        console.error('error en búsqueda:', error);
        this.error = error.message || 'Error al buscar hoteles. Inténtalo de nuevo.';
        this.loading = false;
      }
    });
  }

  onReserveHotel(hotel: Hotel): void {
    console.log('🏨 Iniciando reserva para hotel:', hotel.name);
    
    // TODO: Implementar navegación a página de reserva
    // this.router.navigate(['/reserva', hotel.id]);
    
    // Por ahora, mostrar alert
    alert(`Iniciando reserva para ${hotel.name}\n\nPróximamente: navegación a página de reserva`);
  }

  onViewHotelDetails(hotel: Hotel): void {
    console.log('👀 Viendo detalles del hotel:', hotel.name);
    
    // Navegar a página de detalles
    this.router.navigate(['/hotel', hotel.id]);
  }

  // Método para limpiar búsqueda
  onClearSearch(): void {
    this.searchCriteria = {
      destination: '',
      checkIn: '',
      checkOut: '',
      guests: 2
    };
    this.error = '';
    this.loadFeaturedHotels();
  }

  // Método para recargar hoteles
  onReloadHotels(): void {
    this.error = '';
    this.loadFeaturedHotels();
  }

  private loadFeaturedHotels(): void {
    this.loading = true;
    this.error = '';
    console.log('📡 Iniciando carga de hoteles desde el API...');
    
    this.hotelService.getAllHotels().subscribe({
      next: (hotels) => {
        console.log('hoteles cargados desde API:', hotels);
        this.featuredHotels = hotels;
        this.loading = false;
        
        if (hotels.length === 0) {
          console.log('ℹ️ No hay hoteles en la base de datos');
          this.error = 'No hay hoteles disponibles en este momento.';
          // Cargar datos mock como fallback
          this.loadMockHotels();
        }
      },
      error: (error) => {
        console.error('error cargando hoteles desde API:', error);
        this.error = `Error de conexión: ${error.message}`;
        this.loading = false;
        
        // Fallback con datos mock mientras no tengas datos en el backend
        console.log('🔄 Usando datos de prueba como fallback...');
        this.loadMockHotels();
      }
    });
  }

  private loadMockHotels(): void {
    console.log('🎭 Cargando datos de prueba...');
    
    // Datos de prueba temporales
    this.featuredHotels = [
      {
        id: 'mock-1',
        name: 'fala refugio cartagena',
        location: 'cartagena, colombia',
        price: 350000,
        rating: 4.8,
        totalReviews: 127,
        amenities: ['wifi', 'estacionamiento', 'restaurant', 'café'],
        description: 'refugio elegante en el corazón de cartagena con vista al mar caribe',
        capacity: 4,
        imageUrls: ['/assets/images/hotel-cartagena.jpg'],
        imageUrl: '/assets/images/hotel-cartagena.jpg',
        isActive: true
      },
      {
        id: 'mock-2',
        name: 'fala costa dorada',
        location: 'santa marta, colombia',
        price: 280000,
        rating: 4.6,
        totalReviews: 89,
        amenities: ['wifi', 'restaurant', 'café', 'piscina'],
        description: 'experiencia única frente al mar caribe con acceso directo a la playa',
        capacity: 3,
        imageUrls: ['/assets/images/hotel-santa-marta.jpg'],
        imageUrl: '/assets/images/hotel-santa-marta.jpg',
        isActive: true
      },
      {
        id: 'mock-3',
        name: 'fala isla paraíso',
        location: 'san andrés, colombia',
        price: 420000,
        rating: 4.9,
        totalReviews: 203,
        amenities: ['wifi', 'estacionamiento', 'restaurant', 'spa', 'piscina'],
        description: 'lujo tropical en el archipiélago con experiencias únicas de buceo',
        capacity: 5,
        imageUrls: ['/assets/images/hotel-san-andres.jpg'],
        imageUrl: '/assets/images/hotel-san-andres.jpg',
        isActive: true
      }
    ];
    
    this.loading = false;
    this.error = 'Mostrando datos de prueba. Conecta tu backend para ver datos reales.';
    
    console.log('datos de prueba cargados:', this.featuredHotels);
  }

  // Método utilitario para formatear precios
  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }

  // Método para verificar si hay errores de conexión
  isConnectionError(): boolean {
    return this.error.includes('conexión') || this.error.includes('servidor');
  }

  // Método para verificar si se están mostrando datos de prueba
  isShowingMockData(): boolean {
    return this.error.includes('datos de prueba') || this.featuredHotels.some(hotel => hotel.id.startsWith('mock-'));
  }
}