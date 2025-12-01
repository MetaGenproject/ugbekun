import School from '../models/schoolModel.js';
import User from '../models/userModel.js';
import mongoose from 'mongoose';

// @desc    Onboard a new school and create its admin user
// @route   POST /api/onboarding/school
// @access  Public (for now, should be SuperAdmin later)
export const onboardSchool = async (req, res) => {
  const {
    schoolName,
    schoolEmail, // Assuming school email is the same as admin email for now
    plan,
    adminName,
    adminEmail,
    adminPassword,
    // other fields from your form
    schoolLevels,
    motto,
    country,
    state,
    lga,
    address,
    adminRole,
    adminPhone,
    curriculum,
    system,
  } = req.body;

  // Basic validation
  if (!schoolName || !plan || !adminEmail || !adminPassword || !adminName) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields: schoolName, plan, adminName, adminEmail, and adminPassword.'
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email: adminEmail }).session(session);
    if (existingUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ success: false, message: 'An administrator with this email already exists.' });
    }

    // Create the school admin user
    const schoolAdmin = await User.create([{
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin', // Assign 'admin' role
      // You can add other user fields here if your User model supports them
    }], { session });

    // Create the school
    const school = await School.create([{
      name: schoolName,
      email: schoolEmail || adminEmail, // Use admin email if school email not provided
      plan: plan,
      admin: schoolAdmin[0]._id, // Link to the created admin user
      status: 'Active',
      // Add other school details from the form
      details: { schoolLevels, motto, country, state, lga, address, adminRole, adminPhone, curriculum, system }
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ success: true, message: 'School and admin onboarded successfully', data: { school: school[0], schoolAdmin: schoolAdmin[0] } });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error during school onboarding:', error);
    res.status(500).json({ success: false, message: 'An error occurred during onboarding.', error: error.message });
  }
};