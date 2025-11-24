import User from '../models/user.js'; 
import Item from '../models/item.js'; 
import Order from '../models/order.js'; 

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
        const ownerId = req.user._id; // ✅ Use correct field from JWT
        console.log(`🔍 Fetching owner dashboard data for User ID: ${ownerId}`);

        // --- Fetch all items owned by the user (My Listings) ---
        const listingsPromise = Item.find({ owner: ownerId })
            .select('title pricing images status views bookings category')
            .populate('category', 'title'); // ✅ Populate category

        // --- Fetch orders for items owned by this user (Recent Bookings) ---
        const ordersPromise = Order.find({ 'items.owner_id': ownerId })
            .sort({ createdAt: -1 })
            .populate('renter_id', 'name') // Get renter's name
            .populate('items.item_id', 'title pricing'); // Get item details

        // --- Fetch user stats ---
        const userStatsPromise = User.findById(ownerId).select('totalListings totalEarnings totalViews avgRating'); 

        // --- Execute queries concurrently ---
        const [myListings, orders, userStats] = await Promise.all([listingsPromise, ordersPromise, userStatsPromise]);
        
        if (!userStats) {
            return res.status(404).json({ message: 'Owner user profile not found.' });
        }

        // --- Calculate earnings and recent bookings ---
        let totalMonthlyEarnings = 0;
        const recentBookings = [];
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        
        orders.forEach(order => {
            const isRecent = order.createdAt >= thirtyDaysAgo;
            const isCompleted = order.status === 'Returned';
            
            order.items.forEach(orderItem => {
                if (orderItem.owner_id.toString() !== ownerId.toString()) return;

                if (isCompleted && isRecent) {
                    totalMonthlyEarnings += order.totalAmount || 0;
                }
                
                if (recentBookings.length < 5) {
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

        // --- Prepare response ---
        const responseData = {
            myListings: myListings.map(item => ({
                id: item._id,
                title: item.title,
                category: item.category?.title || 'General',
                dailyRate: item.pricing?.per_day || 0,
                weeklyRate: item.pricing?.per_week || 0,
                monthlyRate: item.pricing?.per_month || 0,
                image: item.images?.[0] || 'https://placehold.co/300x200/cccccc/333333?text=No+Image',
                status: item.status,
                views: item.views || 0,
                bookings: item.bookings || 0
            })),
            recentBookings: recentBookings.slice(0, 5),
            stats: {
                totalListings: userStats.totalListings || myListings.length,
                monthlyEarnings: totalMonthlyEarnings,
                totalViews: userStats.totalViews || 0,
                avgRating: userStats.avgRating || 0
            }
        };

        res.status(200).json(responseData);

    } catch (err) {
        console.error(" Error processing owner dashboard data:", err); 
        res.status(500).json({ message: 'Internal Server Error: Failed to process data.', error: err.message });
    }
};