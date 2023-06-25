

export interface Datos {
    origin: string;
    destination: string;
  }
interface Flight {
    transport: {
      flightCarrier: string;
      flightNumber: string;
    };
    origin: string;
    destination: string;
    price: number;
  }
  
  export interface FlightInfo {
    flights: Flight[];
    origin: string;
    destination: string;
    price: number;
  }