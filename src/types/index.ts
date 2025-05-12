export interface Skip {
    id: number;
    size: number; // The size is a number in the provided data
    hire_period_days: number;
    transport_cost: number | null; // Can be a number or null
    per_tonne_cost: number | null; // Can be a number or null
    price_before_vat: number;
    vat: number; // VAT percentage
    postcode: string;
    area: string; // Seems to be an empty string in the data, but keep as string
    forbidden: boolean; // Indicates if the skip is forbidden
    created_at: string; // Date string
    updated_at: string; // Date string
    allowed_on_road: boolean; // Indicates if allowed on the road
    allows_heavy_waste: boolean; // Crucial property for heavy waste logic
    // Assuming 'name' and 'description' from previous examples are not in this API, remove them
    // imageUrl?: string; // Assuming 'imageUrl' is not in this API, remove it or make it optional if it might appear
}

