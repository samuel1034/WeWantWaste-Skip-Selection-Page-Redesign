'use client'; // This page is a client component to use hooks for data fetching and state

import React, { useEffect, useState } from 'react';
import SkipItem from './SkipItem'; // Import SkipItem from the same directory
import { Skip } from '@/types'; // Import the Skip type

const SkipSelectPage: React.FC = () => {
    const [skips, setSkips] = useState<Skip[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [selectedSkip, setSelectedSkip] = useState<Skip | null>(null);

    // Placeholder for obtaining Postcode and Area
    const postcode = 'NR32';
    const area = 'Lowestoft';

    // Placeholder for Selected Waste Type Information
    const selectedWasteInfo = {
        type: 'garden waste',
        heavyPercentage: 30,
        requiresRoadPermit: false
    };

    useEffect(() => {
        const fetchSkips = async () => {
            try {
                const apiUrl = `https://app.wewantwaste.co.uk/api/skips/by-location?postcode=${postcode}&area=${area}`;
    const response = await fetch(apiUrl);

if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
}

const data: Skip[] = await response.json();
setSkips(data);
} catch (error) {
    setError(error as Error);
    console.error("Error fetching skips:", error);
} finally {
    setLoading(false);
}
};

fetchSkips();
}, [postcode, area]);

const handleSkipSelect = (skip: Skip) => {
    setSelectedSkip(skip);
    console.log("Selected Skip:", skip);
};

const isSkipSuitable = (skip: Skip): boolean => {
    if (skip.forbidden) {
        return false;
    }

    const heavyWasteSizeLimit = 8;

    if (selectedWasteInfo.heavyPercentage > 0) {
        if (!skip.allows_heavy_waste || skip.size > heavyWasteSizeLimit) {
            return false;
        }
    }

    return true;
};

const suitableSkips = skips.filter(isSkipSuitable);
const unsuitableSkips = skips.filter(skip => !isSkipSuitable(skip) && !skip.forbidden);

if (loading) {
    return <div className="text-center text-xl mt-8">Loading skips...</div>;
}

if (error) {
    return <div className="text-center text-red-500 mt-8">Error loading skips: {error.message}</div>;
}

return (
    <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Select Your Skip</h1>

        {selectedWasteInfo.heavyPercentage > 0 && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
                <p className="font-bold">Important Notice:</p>
                <p>Heavy waste types have specific requirements and restrictions. Some skip sizes may not be available for heavy waste disposal.</p>
                <p className="mt-2 italic">For safety reasons, heavy waste can only be disposed of in skips up to 8 yards. Larger skips will not be available if heavy waste is selected.</p>
            </div>
        )}

        {selectedSkip && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
                <p>You have selected: <span className="font-semibold">{selectedSkip.size} Yard Skip</span> (£{(selectedSkip.price_before_vat + (selectedSkip.price_before_vat * (selectedSkip.vat / 100))).toFixed(2)})</p>
            </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {suitableSkips.length > 0 ? (
                suitableSkips.map(skip => (
                    <SkipItem
                        key={skip.id}
                        skip={skip}
                        onSelect={handleSkipSelect}
                        isSelected={selectedSkip?.id === skip.id}
                        isSuitable={true}
                    />
                ))
            ) : (
                suitableSkips.length === 0 && skips.length === 0 && (
                    <div className="col-span-full text-center text-gray-600">No skips available for this location.</div>
                )
            )}

            {unsuitableSkips.length > 0 && (
                <>
                    {suitableSkips.length > 0 && <div className="col-span-full text-lg font-semibold mt-6 mb-4">Other Skip Sizes (Not suitable for selected waste)</div>}
                    {unsuitableSkips.map(skip => (
                        <SkipItem
                            key={skip.id}
                            skip={skip}
                            onSelect={() => alert("This skip is not suitable for your selected waste type.")}
                            isSelected={selectedSkip?.id === skip.id}
                            isSuitable={false}
                        />
                    ))}
                </>
            )}

            {skips.filter(s => s.forbidden).length > 0 && (
                <>
                    <div className="col-span-full text-lg font-semibold mt-6 mb-4">Unavailable Skips</div>
                    {skips.filter(s => s.forbidden).map(skip => (
                        <SkipItem
                            key={skip.id}
                            skip={skip}
                            onSelect={() => alert("This skip is currently unavailable.")}
                            isSelected={false}
                            isSuitable={false}
                        />
                    ))}
                </>
            )}
        </div>

        {selectedSkip && (
            <div className="text-center mt-8">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-xl">
                    Continue with {selectedSkip.size} Yard Skip
                </button>
            </div>
        )}
    </div>
);
};

export default SkipSelectPage;