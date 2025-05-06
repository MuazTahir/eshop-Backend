
const User = require('../../models/User');

const showUsers = async (req, res) => {
  try {


    const users = await User.find({});

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json({ users });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
};

const getUserCount = async (req, res) => {

  try {
    const userPerDay = await User.aggregate([
      {
        $project: {
          day: { $dayOfMonth: "$createdAt" },
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" }
        }
      },
      {
        $group: {
          _id: {
            year: '$year',
            month: '$month',
            day: '$day'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ])
    res.status(200).json({

      success: true,
      data: userPerDay
    })
  } catch (error) {
    res.status(500).json({
      message: 'daily user data is not fetch',
      success: false
    })
  }
}


module.exports = { showUsers, getUserCount };
