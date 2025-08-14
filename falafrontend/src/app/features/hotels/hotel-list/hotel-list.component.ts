// src/app/features/hotels/hotel-list/hotel-list.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelCardComponent } from '../hotel-card/hotel-card.component';
import { Hotel } from '../../../core/models/hotel';
import { SearchCriteria } from '../../../core/models/search-criteria';
import { HotelService } from '../../../core/services/hotel.service';

export type ViewMode = 'grid' | 'list';
export type SortOption = 'price-asc' | 'price-desc' | 'rating-desc' | 'name-asc';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [CommonModule, HotelCardComponent],
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.scss']
})
export class HotelListComponent implements OnInit, OnChanges {
  
  // Inputs para recibir datos del componente padre
  @Input() hotels: Hotel[] = [];
  @Input() loading: boolean = false;
  @Input() error: string = '';
  @Input() searchCriteria?: SearchCriteria;
  @Input() showFilters: boolean = true;
  @Input() showSorting: boolean = true;
  @Input() viewMode: ViewMode = 'grid';
  
  // Outputs para comunicar eventos al padre
  @Output() hotelSelected = new EventEmitter<Hotel>();
  @Output() reserveHotel = new EventEmitter<Hotel>();
  @Output() retryLoad = new EventEmitter<void>();
  @Output() sortChanged = new EventEmitter<SortOption>();
  @Output() viewModeChanged = new EventEmitter<ViewMode>();

  // Estados internos del componente
  filteredHotels: Hotel[] = [];
  currentSort: SortOption = 'rating-desc';
  isFiltering: boolean = false;
  skeletonItems: number[] = [1, 2, 3, 4, 5, 6];

  // Opciones de ordenamiento
  sortOptions = [
    { value: 'rating-desc', label: 'Mejor calificación' },
    { value: 'price-asc', label: 'Precio: menor a mayor' },
    { value: 'price-desc', label: 'Precio: mayor a menor' },
    { value: 'name-asc', label: 'Nombre A-Z' }
  ];

  constructor(private hotelService: HotelService) {}

  ngOnInit(): void {
    console.log('🏨 HotelList component iniciado');
    this.processHotels();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['hotels'] || changes['searchCriteria']) {
      this.processHotels();
    }
  }

  // Procesar y filtrar hoteles
  private processHotels(): void {
    if (!this.hotels || this.hotels.length === 0) {
      this.filteredHotels = [];
      return;
    }

    this.isFiltering = true;
    
    // Aplicar filtros si hay criterios de búsqueda
    let filtered = [...this.hotels];
    
    if (this.searchCriteria) {
      filtered = this.applySearchFilters(filtered);
    }
    
    // Aplicar ordenamiento
    filtered = this.applySorting(filtered);
    
    this.filteredHotels = filtered;
    this.isFiltering = false;
    
    console.log(`📊 Hoteles procesados: ${filtered.length} de ${this.hotels.length}`);
  }

  private applySearchFilters(hotels: Hotel[]): Hotel[] {
    if (!this.searchCriteria) return hotels;

    return hotels.filter(hotel => {
      // Filtrar por destino
      if (this.searchCriteria!.destination) {
        const matchesDestination = hotel.location
          .toLowerCase()
          .includes(this.searchCriteria!.destination.toLowerCase());
        if (!matchesDestination) return false;
      }

      // Filtrar por capacidad (huéspedes)
      if (this.searchCriteria!.guests) {
        if (hotel.capacity && hotel.capacity < this.searchCriteria!.guests) {
          return false;
        }
      }

      // Filtrar por precio mínimo
      if (this.searchCriteria!.minPrice) {
        if (hotel.price < this.searchCriteria!.minPrice) {
          return false;
        }
      }

      // Filtrar por precio máximo
      if (this.searchCriteria!.maxPrice) {
        if (hotel.price > this.searchCriteria!.maxPrice) {
          return false;
        }
      }

      return true;
    });
  }

  private applySorting(hotels: Hotel[]): Hotel[] {
    return hotels.sort((a, b) => {
      switch (this.currentSort) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating-desc':
          return b.rating - a.rating;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }

  // Eventos del UI
  onSortChange(sortOption: SortOption): void {
    console.log('🔄 Cambiando ordenamiento a:', sortOption);
    this.currentSort = sortOption;
    this.processHotels();
    this.sortChanged.emit(sortOption);
  }

  onViewModeChange(mode: ViewMode): void {
    console.log('👁️ Cambiando vista a:', mode);
    this.viewMode = mode;
    this.viewModeChanged.emit(mode);
  }

  onHotelCardClick(hotel: Hotel): void {
    console.log('🏨 Hotel seleccionado:', hotel.name);
    this.hotelSelected.emit(hotel);
  }

  onReserveClick(hotel: Hotel): void {
    console.log('🎯 Reserva solicitada para:', hotel.name);
    this.reserveHotel.emit(hotel);
  }

  onRetryClick(): void {
    console.log('🔄 Reintentando carga de hoteles');
    this.retryLoad.emit();
  }

  // Métodos utilitarios
  hasResults(): boolean {
    return this.filteredHotels.length > 0;
  }

  isLoading(): boolean {
    return this.loading || this.isFiltering;
  }

  hasError(): boolean {
    return !!this.error && !this.loading;
  }

  isEmpty(): boolean {
    return !this.loading && !this.error && this.filteredHotels.length === 0;
  }

  getResultsText(): string {
    const total = this.filteredHotels.length;
    if (total === 0) return 'No se encontraron hoteles';
    if (total === 1) return '1 hotel encontrado';
    return `${total} hoteles encontrados`;
  }

  getErrorIcon(): string {
    if (this.error.includes('conexión') || this.error.includes('red')) {
      return '🌐';
    }
    if (this.error.includes('servidor')) {
      return '🔧';
    }
    return '❌';
  }

  // Métodos para tracking de ngFor (optimización de rendimiento)
  trackByHotelId(index: number, hotel: Hotel): string {
    return hotel.id;
  }

  trackByIndex(index: number): number {
    return index;
  }
}