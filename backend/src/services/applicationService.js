const ApiError = require('../utils/ApiError');
const { getPagination } = require('../utils/pagination');
const { createApplicationNumber } = require('../utils/applicationNumber');
const applicationRepository = require('../repositories/applicationRepository');
const documentRepository = require('../repositories/documentRepository');
const planRepository = require('../repositories/planRepository');
const notificationService = require('./notificationService');
const { SUBMITTED, PENDING_VERIFICATION, APPROVED, REJECTED } = require('../constants/applicationStatus');
const { VERIFIED, REJECTED: DOC_REJECTED } = require('../constants/documentStatus');
const InsuranceApplication = require('../models/InsuranceApplication');

async function ensureApplicationOwner(application, userId) {
  if (!application) {
    throw new ApiError(404, 'Application not found');
  }
  if (application.customer.toString() !== userId.toString()) {
    throw new ApiError(403, 'Forbidden');
  }
}

function buildApplicationQuery(query = {}) {
  const filter = {};
  if (query.status) {
    filter.status = query.status;
  }
  if (query.startDate || query.endDate) {
    filter.createdAt = {};
    if (query.startDate) filter.createdAt.$gte = new Date(query.startDate);
    if (query.endDate) filter.createdAt.$lte = new Date(query.endDate);
  }
  return filter;
}

const applicationService = {
  submit: async (customerId, data) => {
    const plan = await planRepository.findById(data.selectedPlan);
    if (!plan) {
      throw new ApiError(404, 'Plan not found');
    }

    const application = await applicationRepository.create({
      applicationNumber: createApplicationNumber(),
      customer: customerId,
      selectedPlan: data.selectedPlan,
      personalInformation: data.personalInformation,
      addressInformation: data.addressInformation,
      nomineeInformation: data.nomineeInformation,
      status: SUBMITTED
    });

    await notificationService.createNotification(
      customerId,
      `Your application ${application.applicationNumber} has been submitted.`,
      'APPLICATION',
      { applicationId: application._id }
    );

    return applicationRepository.findById(application._id);
  },
  getMine: async (customerId) => applicationRepository.findByCustomer(customerId),
  getById: async (id, user) => {
    const application = await applicationRepository.findById(id);
    if (!application) {
      throw new ApiError(404, 'Application not found');
    }

    if (user.role !== 'ADMIN' && application.customer._id.toString() !== user._id.toString()) {
      throw new ApiError(403, 'Forbidden');
    }

    return application;
  },
  listForAdmin: async (query) => {
    const { page, limit, skip } = getPagination(query);
    const filter = buildApplicationQuery(query);
    const search = query.search?.trim();

    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: 'users',
          localField: 'customer',
          foreignField: '_id',
          as: 'customer'
        }
      },
      { $unwind: '$customer' },
      {
        $lookup: {
          from: 'insuranceplans',
          localField: 'selectedPlan',
          foreignField: '_id',
          as: 'selectedPlan'
        }
      },
      { $unwind: '$selectedPlan' }
    ];

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { applicationNumber: { $regex: search, $options: 'i' } },
            { 'customer.name': { $regex: search, $options: 'i' } }
          ]
        }
      });
    }

    pipeline.push(
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          meta: [{ $count: 'total' }]
        }
      }
    );

    const aggregated = await InsuranceApplication.aggregate(pipeline);
    const data = aggregated[0]?.data || [];
    const total = aggregated[0]?.meta?.[0]?.total || 0;

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  },
  review: async ({ applicationId, status, approvalComments, rejectionReason, adminId }) => {
    const application = await applicationRepository.findByIdRaw(applicationId);
    if (!application) {
      throw new ApiError(404, 'Application not found');
    }

    if (![APPROVED, REJECTED].includes(status)) {
      throw new ApiError(400, 'Invalid application status');
    }

    const updated = await applicationRepository.updateById(applicationId, {
      status,
      approvalComments: approvalComments || '',
      rejectionReason: rejectionReason || '',
      reviewedBy: adminId
    });

    const message = status === APPROVED
      ? `Your application ${updated.applicationNumber} has been approved.`
      : `Your application ${updated.applicationNumber} has been rejected.`;

    await notificationService.createNotification(updated.customer, message, 'APPLICATION', { applicationId: updated._id });

    return updated;
  },
  updateStatusToPendingIfDocumentsVerified: async (applicationId) => {
    const docs = await documentRepository.findByApplication(applicationId);
    if (!docs.length) return null;
    const allVerified = docs.every((doc) => doc.status === VERIFIED);
    const anyRejected = docs.some((doc) => doc.status === DOC_REJECTED);

    if (allVerified && !anyRejected) {
      const application = await applicationRepository.updateById(applicationId, { status: PENDING_VERIFICATION });
      await notificationService.createNotification(
        application.customer,
        `Application ${application.applicationNumber} moved to pending verification.`,
        'APPLICATION',
        { applicationId: application._id }
      );
      return application;
    }
    return null;
  },
  countByCustomer: (customerId) => applicationRepository.countDocuments({ customer: customerId }),
  countByStatus: (status) => applicationRepository.countDocuments({ status }),
  countAll: () => applicationRepository.countDocuments({})
};

module.exports = applicationService;
