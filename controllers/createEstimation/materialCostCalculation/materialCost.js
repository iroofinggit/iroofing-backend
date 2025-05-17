import Items from "../../../models/itemModel.js";
import mongoose from "mongoose";

export const calculateMaterialCharge = async (materialItems) => {
    console.log("✅ Material Items Received:", materialItems);

    try {
        let totalCharge = 0;
        let processedItems = [];

        // Check if materialItems is empty
        if (!Array.isArray(materialItems) || materialItems.length === 0) {
            console.log("❌ No material items provided");
            return { totalCharge: 0, materials: [] };
        }

        // ✅ Loop through each material and calculate cost
        for (const material of materialItems) {
            const { itemId, unit } = material;

            // Validate if itemId is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(itemId)) {
                console.log(`❌ Invalid item ID: ${itemId}`);
                continue;
            }

            // ✅ Fetch the item from the database
            const item = await Items.findById(itemId);

            // If the item does not exist, skip it
            if (!item) {
                console.log(`❌ Item with ID ${itemId} not found`);
                continue;
            }

            // ✅ Calculate the cost per material
            const cost = item.finalPerMeter * unit;
            totalCharge += cost;

            // ✅ Push material details to response
            processedItems.push({
                itemId: item._id,
                itemName: item.item,   // ✅ Correct Field Name
                unit,
                ratePerMeter: item.finalPerMeter,
                cost,
            });
        }

        // ✅ Return the material charge
        console.log("✅ Processed Items:", processedItems);

        return { 
            totalCharge: parseFloat(totalCharge.toFixed(2)), 
            materials: processedItems 
        };
    } catch (error) {
        console.error("🚨 Error calculating material charge:", error);
        return { totalCharge: 0, materials: [] };
    }
};
