import Class from "../Models/Class.js";



// Get all classes
export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate(
      "trainer",
      "name email"
    );

    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get single class
export const getClassById = async (req, res) => {
  try {
    const fitnessClass = await Class.findById(req.params.id).populate(
      "trainer",
      "name email"
    );

    if (!fitnessClass) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    res.status(200).json(fitnessClass);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create Class
export const createClass = async (req, res) => {
  // Category Images
const categoryImages = {
  
  yoga: "yoga.jpg",
  zumba: "zumba.jpg",
  cardio: "cardio.jpg",
  strength: "strength.jpg",
  
};
  try {

    // Convert category to lowercase
    const category = req.body.category.trim().toLowerCase();

const image = categoryImages[category] || "fit.jpg";

const newClass = await Class.create({
  ...req.body,
  category, // lowercase save ஆகும்
  image,
});

    res.status(201).json({
      message: "Class created successfully",
      data: newClass,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update class
export const updateClass = async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      message: "Class updated successfully",
      data: updatedClass,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete class
export const deleteClass = async (req, res) => {
  try {

    await Class.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Class deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};