export type Transporter = {
    id: number;
    name: string;
    email: string;
    phone: string;
    company: string;
    vehicle_type: string; // e.g., "truck", "van"
    vehicle_capacity: number; // in cubic meters or tons
    license_plate: string;
    status: string; // e.g., "active", "inactive"
    createdAt: string; // ISO date string
    };