'use client'; // This page is a client component to use hooks for data fetching and state

import React, { useEffect, useState } from 'react';
import SkipItem from './SkipItem'; // Import SkipItem from the same directory
import { Skip } from '../../types'; // Import the Skip type
import Link from 'next/link'; // Useful if you need routing

// Define props for this page if needed (e.g., if receiving data via search params)
// interface SkipSelectPageProps {
//   searchParams: { [key: string]: string | string[] | undefined }; // Example for search params in App Router
// }

const SkipSelectPage: React.FC = () => { // Keep as a functional component for the page
    const [skips, setSkips] = useState<Skip[]>([]); // State to store fetched skips, typed as an array of Skip objects
    const [loading, setLoading] = useState<boolean>(true); // State for loading status, typed as boolean
    const [error, setError] = useState<Error | null>(null); // State for error, typed as Error or null
    const [selectedSkip, setSelectedSkip] = useState<Skip | null>(null); // State for the selected skip, typed as Skip or null

    // --- Placeholder for obtaining Postcode and Area ---
    // In a real application, you would get these from a previous step,
    // likely via URL search parameters, a global state management library, or context.
    // For this example, we'll use hardcoded values from the API example.
    const postcode = 'NR32';
    const area = 'Lowestoft';
    // --- End Placeholder ---

    // --- Placeholder for Selected Waste Type Information ---
    // You need to integrate how you get the selected waste type and its details
    // (like heavy waste percentage) from the previous steps/modal interactions.
    // This is a crucial part you need to connect to your actual application state.
    const selectedWasteInfo = {
        type: 'garden waste', // Example: 'garden waste', 'mixed waste', 'heavy waste'
        heavyPercentage: 30, // Example: Percentage of heavy waste (0 if none)
        requiresRoadPermit: false // Example: Does the selected waste type require a road permit?
        // Add other relevant waste type properties you need for suitability checks
    }; // REPLACE THIS WITH YOUR ACTUAL STATE SOURCE
    // --- End Placeholder ---


    useEffect(() => {
        const fetchSkips = async () => {
            try {
                // Construct the API URL (you might adjust parameters based on actual needs if the API supports it)
                const apiUrl = `https://app.wewantwaste.co.uk/api/skips/by-location?postcode=${postcode}&area=${area}`;
                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: Skip[] = await response.json(); // Type the incoming JSON data as an array of Skips
                setSkips(data); // Update the skips state with the fetched data

            } catch (error: any) { // Use 'any' or a more specific error type if known
                setError(error); // Set the error state
                console.error("Error fetching skips:", error);
            } finally {
                setLoading(false); // Set loading to false after fetch
            }
        };

        fetchSkips(); // Call the fetch function when the component mounts or postcode/area changes
    }, [postcode, area]); // Dependency array: effect runs when postcode or area changes


    const handleSkipSelect = (skip: Skip) => { // Function to handle skip selection, parameter is typed as Skip
        setSelectedSkip(skip); // Update the selectedSkip state
        console.log("Selected Skip:", skip); // Log the selected skip (replace with your next action)
        // In a real app, you would typically store this selection in a global state,
        // navigate to the next page (e.g., summary/checkout), or show a next step form.
    };

    // --- Logic to determine if a skip is suitable based on selected waste type and skip properties ---
    const isSkipSuitable = (skip: Skip): boolean => {
        // If the API marks the skip as forbidden, it's definitely not suitable
        if (skip.forbidden) {
            return false;
        }

        const heavyWasteSizeLimit = 8; // The limit mentioned in the heavy waste notice

        // Suitability check based on heavy waste:
        // If the selected waste requires heavy waste handling (heavyPercentage > 0)
        // AND the skip either does NOT allow heavy waste OR the skip size exceeds the heavy waste limit,
        // then the skip is not suitable.
        if (selectedWasteInfo.heavyPercentage > 0) {
            if (!skip.allows_heavy_waste || skip.size > heavyWasteSizeLimit) {
                return false;
            }
        }

        // Suitability check based on road permits (example, assuming you have this info in selectedWasteInfo and skip data)
        // If the selected waste requires a road permit AND the skip is NOT allowed on the road
        // if (selectedWasteInfo.requiresRoadPermit && !skip.allowed_on_road) {
        //     return false;
        // }

        // Add other suitability checks based on different waste types or criteria from your application

        return true; // If none of the unsuitability conditions are met, the skip is suitable
    };
    // --- End Suitability Logic ---

    // Filter skips based on the suitability logic for display (optional, you could just style unsuitable ones)
    const suitableSkips = skips.filter(isSkipSuitable);
    const unsuitableSkips = skips.filter(skip => !isSkipSuitable(skip) && !skip.forbidden); // Filter out forbidden from unsuitable list

    if (loading) {
        return <div className="text-center text-xl mt-8">Loading skips...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 mt-8">Error loading skips: {error.message}</div>;
    }

    return (
        <div className="container mx-auto p-4"> {/* Tailwind classes for container and padding */}
            <h1 className="text-2xl font-bold mb-6 text-center">Select Your Skip</h1> {/* Tailwind classes for heading */}

            {/* --- Display Relevant Notices --- */}
            {/* Conditionally display notices based on the selected waste type (connect to your state) */}
            { selectedWasteInfo.heavyPercentage > 0 /* Example condition: show if heavy waste is selected */ && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
                    <p className="font-bold">Important Notice:</p>
                    <p>Heavy waste types have specific requirements and restrictions. Some skip sizes may not be available for heavy waste disposal.</p>
                    <p className="mt-2 italic">For safety reasons, heavy waste can only be disposed of in skips up to 8 yards. Larger skips will not be available if heavy waste is selected.</p>
                </div>
            )}
            {/* Add other notices based on different waste types or selections */}
            {/* --- End Notices --- */}


            {selectedSkip && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
                    <p>You have selected: <span className="font-semibold">{selectedSkip.size} Yard Skip</span> (£{(selectedSkip.price_before_vat + (selectedSkip.price_before_vat * (selectedSkip.vat / 100))).toFixed(2)})</p>
                    {/* You might want a button to proceed to the next step here if a skip is selected */}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> {/* Responsive grid layout */}
                {/* Render Suitable Skips */}
                {suitableSkips.length > 0 ? (
                    suitableSkips.map(skip => (
                        <SkipItem
                            key={skip.id}
                            skip={skip}
                            onSelect={handleSkipSelect}
                            isSelected={selectedSkip?.id === skip.id} // Check if this skip is the currently selected one
                            isSuitable={true} // It's in the suitable list
                        />
                    ))
                ) : (
                    // Message if no suitable skips are found AND no unsuitable/forbidden ones exist either
                    suitableSkips.length === 0 && skips.length === 0 && (
                        <div className="col-span-full text-center text-gray-600">No skips available for this location.</div>
                    )
                )}

                {/* Optionally display unsuitable skips separately or differently */}
                {unsuitableSkips.length > 0 && (
                    <>
                        {/* Add a separator or heading if there are suitable skips displayed above */}
                        {suitableSkips.length > 0 && <div className="col-span-full text-lg font-semibold mt-6 mb-4">Other Skip Sizes (Not suitable for selected waste)</div>}
                        {/* Map over unsuitable skips and render them, styled differently */}
                        {unsuitableSkips.map(skip => (
                            <SkipItem
                                key={skip.id}
                                skip={skip}
                                onSelect={() => alert("This skip is not suitable for your selected waste type.")} // Handle click differently for unsuitable skips
                                isSelected={selectedSkip?.id === skip.id}
                                isSuitable={false} // Mark as unsuitable
                            />
                        ))}
                    </>
                )}

                {/* Optionally display forbidden skips if the API doesn't filter them and you want to show them */}
                {skips.filter(s => s.forbidden).length > 0 && (
                    <>
                        <div className="col-span-full text-lg font-semibold mt-6 mb-4">Unavailable Skips</div>
                        {skips.filter(s => s.forbidden).map(skip => (
                            <SkipItem
                                key={skip.id}
                                skip={skip}
                                onSelect={() => alert("This skip is currently unavailable.")}
                                isSelected={false} // Cannot be selected if forbidden
                                isSuitable={false} // Not suitable if forbidden
                            />
                        ))}
                    </>
                )}
            </div>

            {/* --- Continue Button --- */}
            {/* Show a continue button only if a skip is successfully selected */}
            {selectedSkip && (
                <div className="text-center mt-8">
                    {/* Replace with your actual navigation or form submission */}
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-xl">
                        Continue with {selectedSkip.size} Yard Skip
                    </button>
                </div>
            )}
            {/* --- End Continue Button --- */}
        </div>
    );
};

export default SkipSelectPage;
