const express = require('express');
const DistributionHub = require('../models/DistributionHub');

const router = express.Router();

router.post('/seed-hubs', async (req, res) => {
  try {
    const existingCount = await DistributionHub.countDocuments();
    if (existingCount > 0) {
      const hubs = await DistributionHub.find().lean();
      return res.status(200).json({ message: 'Hubs already seeded.', hubs });
    }

    const hubsToCreate = [
      {
        name: 'North Logistics Hub',
        address: '12 Northway Ave, Melbourne VIC',
        contactNumber: '+61 3 9000 1111',
      },
      {
        name: 'East Fulfillment Center',
        address: '88 Easton Rd, Melbourne VIC',
        contactNumber: '+61 3 9000 2222',
      },
      {
        name: 'West Distribution Depot',
        address: '34 Westport St, Melbourne VIC',
        contactNumber: '+61 3 9000 3333',
      },
    ];

    const created = await DistributionHub.insertMany(hubsToCreate);
    return res.status(201).json({ message: 'Distribution hubs seeded.', hubs: created });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to seed hubs.', error: error.message });
  }
});

module.exports = router;
