const applicationRepository = require('../repositories/applicationRepository');
const { APPROVED, REJECTED, SUBMITTED, PENDING_VERIFICATION } = require('../constants/applicationStatus');

const reportService = {
  summary: async () => {
    const [total, approved, rejected, pendingVerification, submitted] = await Promise.all([
      applicationRepository.countDocuments({}),
      applicationRepository.countDocuments({ status: APPROVED }),
      applicationRepository.countDocuments({ status: REJECTED }),
      applicationRepository.countDocuments({ status: PENDING_VERIFICATION }),
      applicationRepository.countDocuments({ status: SUBMITTED })
    ]);

    return {
      totalApplications: total,
      approvedApplications: approved,
      rejectedApplications: rejected,
      pendingApplications: pendingVerification + submitted
    };
  }
};

module.exports = reportService;
