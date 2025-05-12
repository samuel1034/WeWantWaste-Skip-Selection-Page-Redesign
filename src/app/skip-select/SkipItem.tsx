// src/app/skip-select/SkipItem.tsx
import React from 'react';
import { Skip } from '@/types'; // Import the updated Skip type

// Define the types for the component's props
interface SkipItemProps {
    skip: Skip;
    onSelect: (skip: Skip) => void;
    isSelected: boolean;
    isSuitable: boolean; // Still needed for your custom logic
}

const SkipItem: React.FC<SkipItemProps> = ({ skip, onSelect, isSelected, isSuitable }) => {
    // Destructure properties from the updated Skip interface - Removed 'id'
    const {
        size,
        hire_period_days,
        price_before_vat,
        vat,
        allowed_on_road,
        allows_heavy_waste,
        forbidden // We might want to visually indicate forbidden skips too
    } = skip; // 'id' is no longer destructured here

    // Calculate price including VAT
    const totalPrice = price_before_vat + (price_before_vat * (vat / 100));

    const handleSelectClick = () => {
        // Only allow selection if suitable (based on your custom logic) AND not forbidden by the API
        if (isSuitable && !forbidden) {
            onSelect(skip);
        } else if (forbidden) {
            console.log("This skip is forbidden by the API."); // Or show a message
        } else {
            console.log("Cannot select this skip for the chosen waste type."); // Message based on your suitability logic
        }
    };

    // Determine if the item should be clickable/selectable
    const isSelectable = isSuitable && !forbidden;

    return (
        <div
            // Apply different styling based on isSelected, isSuitable, and forbidden status
            className={`border rounded-lg p-4 transition-colors duration-300 ease-in-out
        ${isSelectable ? 'cursor-pointer hover:border-blue-500' : 'cursor-not-allowed opacity-70'}
        ${isSelected ? 'border-green-500 ring ring-green-200' : ''}
        ${!isSuitable && !forbidden ? 'border-red-300 bg-red-50' : ''}
        ${forbidden ? 'border-gray-400 bg-gray-200' : ''}
      `}
            onClick={handleSelectClick}
        >

            <h3 className={`text-lg font-semibold mb-1 ${!isSelectable ? 'line-through text-gray-500' : ''}`}>
                {size} Yard Skip {/* Assuming size is in yards based on the 8-yard limit */}
            </h3>

            <p className={`text-gray-700 ${!isSelectable ? 'text-gray-500' : ''}`}>Hire Period: {hire_period_days} days</p>

            <p className={`font-bold ${isSelectable ? 'text-green-600' : 'text-gray-500 line-through'}`}>
                Price (inc. VAT): £{totalPrice.toFixed(2)} {/* Display calculated total price */}
            </p>

            {/* Display additional relevant info */}
            <p className={`text-sm mt-2 ${!isSelectable ? 'text-gray-500' : ''}`}>
                Allowed on Road: {allowed_on_road ? 'Yes' : 'No'}
            </p>
            <p className={`text-sm ${!isSelectable ? 'text-gray-500' : ''}`}>
                Allows Heavy Waste: {allows_heavy_waste ? 'Yes' : 'No'}
            </p>
            {forbidden && (
                <p className="text-red-600 font-semibold text-sm mt-2">This skip is currently unavailable.</p>
            )}
            {!isSuitable && !forbidden && (
                <p className="text-red-600 font-semibold text-sm mt-2">Not suitable for selected waste type</p>
            )}

            {/* Optional Select Button - only show if selectable */}
            {/* {isSelectable && (
           <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Select</button>
       )} */}
        </div>
    );
};

export default SkipItem;