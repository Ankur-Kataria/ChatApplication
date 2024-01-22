const Group = require("../models/group.model");
const User = require("../models/user.model");

const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;

    // Check if the group name already exists
    const existingGroup = await Group.findOne({ name });
    if (existingGroup) {
      return res.status(400).json({ message: "Group name already exists" });
    }

    // Check if members exist
    const existingMembers = await User.find({ _id: { $in: members } });
    if (existingMembers.length !== members.length) {
      return res.status(400).json({ message: "Invalid member(s)" });
    }

    // Create a new group
    const newGroup = new Group({
      name,
      members: existingMembers.map((member) => member._id),
    });
    await newGroup.save();

    res.status(201).json({ message: "Group created successfully", result: newGroup });
  } catch (error) {
    console.error("Error creating group:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.query;

    // Check if the group exists
    const group = await Group.findById({ _id: groupId });
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Remove the group
    await group.deleteOne({ _id: groupId });

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error("Error deleting group:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const getAllGroups  = async (req, res) => {
    try {
      // Implement group search logic here
      const groups = await Group.find();
  
      res.status(200).json(groups);
    } catch (error) {
      console.error("Error searching groups:", error.message);
      res.status(500).json({ message: "Server Error" });
    }
  };

const searchGroups = async (req, res) => {
  try {
    const name = req.query;
    // Implement group search logic by name
    const groups = await Group.find({ name: { $regex: new RegExp(name), $options: 'i' } });

    res.status(200).json(groups);
  } catch (error) {
    console.error("Error searching groups:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const addMembersToGroup = async (req, res) => {
  try {
    const { members, groupId } = req.body;

    if (!groupId) {
      return res.status(400).json({ message: "groupId missing, Please pass valid group ID" });
    }

    // Check if the group exists
    const group = await Group.findById({ _id: groupId });
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if members exist
    const existingMembers = await User.find({ _id: { $in: members } });
    if (existingMembers.length !== members.length) {
      return res.status(400).json({ message: "Invalid member(s)" });
    }

    // Add members to the group
    group.members.push(...existingMembers.map((member) => member._id));
    await group.save();

    res
      .status(200)
      .json({ message: "Members added to the group successfully" });
  } catch (error) {
    console.error("Error adding members to group:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createGroup,
  deleteGroup,
  getAllGroups,
  searchGroups,
  addMembersToGroup,
};
