import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HotelListComponent, ViewMode, SortOption } from '../../features/hotels/hotel-list/hotel-list.component';
import { Hotel } from '../../core/models/hotel';
import { SearchCriteria } from '../../core/models/search-criteria';
import { HotelService } from '../../core/services/hotel.service';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [CommonModule, FormsModule, HotelListComponent],
  templateUrl: './hotels.component.html',
  styleUrl: './hotels.component.scss'
})
export class HotelsComponent implements OnInit {
  
  // estados principales
  hotels: Hotel[] = [];
  loading: boolean = false;
  error: string = '';

  // filtros y búsqueda
  searchCriteria: SearchCriteria = {
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    minPrice: undefined,
    maxPrice: undefined
  };

  // estados de ui
  showAdvancedFilters: boolean = false;
  currentViewMode: ViewMode = 'grid';

  constructor(
    private hotelService: HotelService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('🏨 inicializo página de hoteles');
    
    // verifico si hay parámetros de búsqueda en la url
    this.route.queryParams.subscribe(params => {
      if (params['destination']) {
        this.searchCriteria.destination = params['destination'];
        this.showAdvancedFilters = true;
      }
      if (params['guests']) {
        this.searchCriteria.guests = parseInt(params['guests']);
      }
      
      this.loadHotels();
    });
  }

  // cargo hoteles
  loadHotels(): void {
    this.loading = true;
    this.error = '';
    
    console.log('📡 cargando todos los hoteles...');
    
    this.hotelService.getAllHotels().subscribe({
      next: (hotels) => {
        console.log('hoteles cargados:', hotels);
        this.hotels = hotels;
        this.loading = false;
      },
      error: (error) => {
        console.error('error cargando hoteles:', error);
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  // aplico filtros
  onApplyFilters(): void {
    console.log('🔍 aplicando filtros:', this.searchCriteria);
    
    if (this.hasActiveFilters()) {
      this.loading = true;
      this.error = '';
      
      this.hotelService.searchHotels(this.searchCriteria).subscribe({
        next: (hotels) => {
          console.log('búsqueda completada:', hotels);
          this.hotels = hotels;
          this.loading = false;
        },
        error: (error) => {
          console.error('error en búsqueda:', error);
          this.error = error.message;
          this.loading = false;
        }
      });
    } else {
      this.loadHotels();
    }
  }

  // limpio filtros
  onClearFilters(): void {
    console.log('🔄 limpiando filtros');
    this.searchCriteria = {
      destination: '',
      checkIn: '',
      checkOut: '',
      guests: 2,
      minPrice: undefined,
      maxPrice: undefined
    };
    this.loadHotels();
  }

  // alterno filtros avanzados
  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
    console.log('🎛️ filtros avanzados:', this.showAdvancedFilters ? 'mostrados' : 'ocultos');
  }

  // eventos del hotel-list
  onHotelSelected(hotel: Hotel): void {
    console.log('🏨 hotel seleccionado:', hotel.name);
    this.router.navigate(['/hotel', hotel.id]);
  }

  onReserveHotel(hotel: Hotel): void {
    console.log('🎯 reserva solicitada:', hotel.name);
    // todo: implementar navegación a reserva
    alert(`Iniciando reserva para ${hotel.name}`);
  }

  onRetryLoad(): void {
    console.log('🔄 reintentando carga');
    this.loadHotels();
  }

  onSortChanged(sortOption: SortOption): void {
    console.log('📊 ordenamiento cambiado:', sortOption);
  }

  onViewModeChanged(viewMode: ViewMode): void {
    console.log('👁️ vista cambiada:', viewMode);
    this.currentViewMode = viewMode;
  }

  // método para contacto
  onContactUs(): void {
    console.log('📞 contactando asesor');
    alert('función de contacto próximamente implementada');
  }

  // utilidades
  hasActiveFilters(): boolean {
    return !!(
      this.searchCriteria.destination ||
      this.searchCriteria.minPrice ||
      this.searchCriteria.maxPrice ||
      (this.searchCriteria.guests && this.searchCriteria.guests !== 2)
    );
  }
}