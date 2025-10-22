import User from '../models/user.js'; 
import Item from '../models/item.js'; 
import Order from '../models/order.js'; 
import mongoose from 'mongoose';

// Helper function to format ISO dates to YYYY-MM-DD
const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
        const dateObj = new Date(date);
        if (isNaN(dateObj)) return 'N/A';
        return dateObj.toLocaleDateString('en-CA', { 
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: 'UTC'
        });
    } catch (e) {
        console.error("Date formatting error:", e);
        return 'N/A';
    }
};

export const getOwnerDashboardData = async (req, res) => {
    try {
        const ownerId = req.user.id; 
        console.log(`🔍 Fetching owner dashboard data for User ID: ${ownerId}`);

        // --- 1. Define Concurrent Queries ---
        
        // A. Fetch all items owned by the user (My Listings)
        const listingsPromise = Item.find({ owner_id: ownerId }).select('title pricing images status views bookings category');
        
        // B. Fetch all orders that include an item owned by the user (Recent Bookings & Stats)
        const ordersPromise = Order.find({ 'items.owner_id': ownerId })
                                   .sort({ createdAt: -1 })
                                   .populate('renter_id', 'name') // To get the renter's name
                                   .populate('items.item_id', 'title pricing'); // To get basic item details
        
        // C. Fetch high-level owner stats (Assuming these exist on the User model)
        const userStatsPromise = User.findById(ownerId).select('totalListings totalEarnings totalViews avgRating'); 

        // --- 2. Execute Queries ---
        const [myListings, orders, userStats] = await Promise.all([listingsPromise, ordersPromise, userStatsPromise]);
        
        if (!userStats) {
             return res.status(404).json({ message: 'Owner user profile not found.' });
        }

        // --- 3. Calculate Stats & Process Orders ---
        let totalMonthlyEarnings = 0;
        const recentBookings = [];
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        
        orders.forEach(order => {
            const isRecent = order.createdAt >= thirtyDaysAgo;
            const isCompleted = order.status === 'Returned';
            
            order.items.forEach(orderItem => {
                // Filter only items owned by the current user within this order
                if (orderItem.owner_id.toString() !== ownerId) return; 

                // We calculate earnings from completed orders in the last 30 days
                if (isCompleted && isRecent) {
                    // NOTE: This assumes totalAmount covers only the items in this order. 
                    // For a multi-owner order, complex logic is needed here (out of scope for this dashboard)
                    totalMonthlyEarnings += order.totalAmount || 0; 
                }
                
                // Collect recent bookings regardless of completion status
                if (recentBookings.length < 5) { // Limit to 5 recent bookings for the dashboard
                    recentBookings.push({
                        id: orderItem._id,
                        orderId: order._id,
                        item: orderItem.item_id?.title || 'Item N/A',
                        renter: order.renter_id?.name || 'Anonymous Renter',
                        startDate: formatDate(orderItem.startDate),
                        endDate: formatDate(orderItem.endDate),
                        amount: order.totalAmount || 0,
                        status: order.status.toLowerCase()
                    });
                }
            });
        });

        // --- 4. Structure the Response ---
        const responseData = {
            myListings: myListings.map(item => ({
                id: item._id,
                title: item.title,
                category: item.category?.title || 'General', // Assuming category is populated or a fixed string
                dailyRate: item.pricing?.per_day || 0,
                weeklyRate: item.pricing?.per_week || 0,
                monthlyRate: item.pricing?.per_month || 0,
                image: item.images?.[0] || 'https://placehold.co/300x200/cccccc/333333?text=No+Image',
                status: item.status,
                views: item.views || 0,
                bookings: item.bookings || 0
            })),
            
            recentBookings: recentBookings.slice(0, 5), // Ensure max 5
            
            stats: {
                totalListings: userStats.totalListings || myListings.length, // Use calculated length if static field is missing
                monthlyEarnings: totalMonthlyEarnings, // Calculated value
                totalViews: userStats.totalViews || 0,
                avgRating: userStats.avgRating || 0
            }
        };

        res.status(200).json(responseData);

    } catch (err) {
        console.error("❌ Fatal Error processing owner dashboard data:", err); 
        res.status(500).json({ message: 'Internal Server Error: Failed to process data.', error: err.message });
    }
};
