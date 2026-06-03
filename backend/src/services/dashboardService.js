const InsuranceApplication = require('../models/InsuranceApplication');
const Document = require('../models/Document');
const Notification = require('../models/Notification');
const { APPROVED, REJECTED, PENDING_VERIFICATION, SUBMITTED } = require('../constants/applicationStatus');

const dashboardService = {
  customerDashboard: async (customerId) => {
    const [applications] = await InsuranceApplication.aggregate([
      { $match: { customer: customerId } },
      {
        $facet: {
          total: [{ $count: 'count' }],
          latest: [{ $sort: { createdAt: -1 } }, { $limit: 1 }],
          pending: [{ $match: { status: { $in: [SUBMITTED, PENDING_VERIFICATION] } } }, { $count: 'count' }]
        }
      }
    ]);

    const [docsCount, notifications, unreadNotifications] = await Promise.all([
      Document.countDocuments({ customer: customerId }),
      Notification.find({ user: customerId }).sort({ createdAt: -1 }).limit(5),
      Notification.countDocuments({ user: customerId, read: false })
    ]);

    return {
      totalApplications: applications?.total?.[0]?.count || 0,
      currentStatus: applications?.latest?.[0]?.status || null,
      uploadedDocuments: docsCount,
      notifications,
      unreadNotifications
    };
  },
  adminDashboard: async () => {
    const data = await InsuranceApplication.aggregate([
      {
        $group: {
          _id: null,
          totalApplications: { $sum: 1 },
          pendingApplications: {
            $sum: {
              $cond: [{ $in: ['$status', [SUBMITTED, PENDING_VERIFICATION]] }, 1, 0]
            }
          },
          approvedApplications: {
            $sum: { $cond: [{ $eq: ['$status', APPROVED] }, 1, 0] }
          },
          rejectedApplications: {
            $sum: { $cond: [{ $eq: ['$status', REJECTED] }, 1, 0] }
          },
          pendingVerifications: {
            $sum: { $cond: [{ $eq: ['$status', PENDING_VERIFICATION] }, 1, 0] }
          }
        }
      }
    ]);

    return data[0] || {
      totalApplications: 0,
      pendingApplications: 0,
      approvedApplications: 0,
      rejectedApplications: 0,
      pendingVerifications: 0
    };
  }
};

module.exports = dashboardService;
