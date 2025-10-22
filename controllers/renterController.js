import User from '../models/user.js'; 
import Item from '../models/item.js'; 
import Wishlist from '../models/wishlist.js'; 
import Order from '../models/order.js'; 
import mongoose from 'mongoose';

// Helper function to format ISO dates to YYYY-MM-DD for consistency
const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
        const dateObj = new Date(date);
        if (isNaN(dateObj)) return 'N/A';

        // 🔑 FIX: Use toLocaleDateString with a fixed format and UTC time zone
        // This ensures the date parts are pulled from the date object itself 
        // without introducing local machine time zone offsets, which was causing the shift.
        return dateObj.toLocaleDateString('en-CA', { // 'en-CA' gives YYYY-MM-DD format
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: 'UTC' // Critical: Ensures consistent output regardless of server location
        });
    } catch (e) {
        console.error("Date formatting error:", e);
        return 'N/A';
    }
};

export const getRenterDashboardData = async (req, res) => {
    try {
        const userId = req.user.id; 
        console.log(`🔍 Fetching dashboard data for User ID: ${userId}`);

        // --- 1. Define Concurrent Queries ---
        const userPromise = User.findById(userId).select('totalSpent itemsRented avgRating'); 
        
        // Find ALL orders related to the user and populate item details AND owner name
        const ordersPromise = Order.find({ renter_id: userId })
                                .populate({
                                    path: 'items.item_id',
                                    model: 'Item',
                                    select: 'title pricing images location owner_id', // Select owner_id here
                                    populate: {
                                        path: 'owner_id', // Populate the owner's name from the User model
                                        model: 'User',
                                        select: 'name'
                                    }
                                });
                                        
        // Fetch the separate wishlist document and populate the items array
        const wishlistPromise = Wishlist.findOne({ userId })
                                        .populate('items', 'title pricing location images');


        // --- 2. Execute Queries ---
        const [user, orders, userWishlistDoc] = await Promise.all([userPromise, ordersPromise, wishlistPromise]);
        
        if (!user) {
             return res.status(404).json({ message: 'User not found.' });
        }


        // --- 3. Process Orders into Active & History ---
        let totalLifetimeSpent = user.totalSpent || 0;
        const activeRentals = [];
        const rentalHistory = [];
        
        orders.forEach(order => {
            const isActive = ['Approved', 'Delivered'].includes(order.status);

            order.items.forEach(orderItem => {
                const itemDetails = orderItem.item_id; 
                
                // Get Owner Name (populated from Item model)
                const ownerName = itemDetails?.owner_id?.name || 'Unknown Owner';

                // Check for null item_id (deleted item) before processing
                if (!itemDetails) return; 

                if (isActive) {
                    activeRentals.push({
                        id: orderItem._id, 
                        orderId: order._id,
                        item: itemDetails.title || 'Item N/A',
                        owner: ownerName, 
                        startDate: formatDate(orderItem.startDate), // ✅ New formatting logic applied
                        endDate: formatDate(orderItem.endDate),     // ✅ New formatting logic applied
                        dailyRate: itemDetails.pricing?.per_day || 0,
                        image: itemDetails.images?.[0] || 'https://placehold.co/300x200/cccccc/333333?text=No+Image',
                        status: order.status, 
                        location: itemDetails.location || 'Unknown'
                    });
                } else if (['Returned', 'Cancelled'].includes(order.status)) {
                    rentalHistory.push({
                        id: orderItem._id,
                        orderId: order._id,
                        item: itemDetails.title || 'Item N/A',
                        dates: `${formatDate(orderItem.startDate)} to ${formatDate(orderItem.endDate)}`, // ✅ New formatting logic applied
                        totalAmount: order.totalAmount || 0, 
                        rating: 4, // Placeholder: Integrate Review data later
                        image: itemDetails.images?.[0] || 'https://placehold.co/300x200/cccccc/333333?text=No+Image',
                        status: order.status
                    });
                }
            });
        });

        // --- 4. Structure the Response ---
        const responseData = {
            activeRentals: activeRentals,
            rentalHistory: rentalHistory,
            
            wishlist: (userWishlistDoc?.items || []).map(w => {
                const price = w.pricing?.per_day || 0; 
                
                return {
                    id: w._id,
                    item: w.title || 'N/A', 
                    location: w.location || 'Unknown',
                    dailyRate: price, 
                    image: w.images?.[0] || 'https://placehold.co/300x200/cccccc/333333?text=No+Image'
                };
            }),
            stats: {
                activeRentalsCount: activeRentals.length,
                totalSpent: totalLifetimeSpent,
                itemsRentedCount: user.itemsRented || 0,
                avgRating: user.avgRating || 0
            }
        };

        res.status(200).json(responseData);

    } catch (err) {
        console.error("❌ Fatal Error processing dashboard data:", err); 
        res.status(500).json({ message: 'Internal Server Error: Failed to process data.', error: err.message });
    }
};
