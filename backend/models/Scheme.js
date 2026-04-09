import mongoose from "mongoose";

const schemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
      index: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Healthcare",
        "Insurance",
        "Financial Aid",
        "Education",
        "Women",
        "Senior",
        "Disability",
        "Other",
      ],
      index: true,
    },

    incomeLimit: {
      type: Number,
      default: 0,
      index: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "all"],
      default: "all",
      index: true,
    },

    ageMin: {
      type: Number,
      default: 0,
    },

    ageMax: {
      type: Number,
      default: 120,
    },

    occupation: {
      type: [String],
      default: [],
      index: true,
    },

    disability: {
      type: Boolean,
      default: false,
      index: true,
    },

    bplRequired: {
      type: Boolean,
      default: false,
      index: true,
    },

    benefits: {
      type: String,
      required: true,
    },

    coverageAmount: {
      type: Number,
      default: 0,
    },

    tags: {
      type: [String],
      default: [],
      index: true,
    },

    applicationLink: {
      type: String,
      default: "",
    },

    popularityScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// 🔥 TEXT INDEX
schemeSchema.index({
  name: "text",
  description: "text",
  benefits: "text",
  tags: "text",
});

// 🔥 COMPOUND INDEXES
schemeSchema.index({ state: 1, category: 1 });
schemeSchema.index({ incomeLimit: 1, gender: 1 });

// ✅ CREATE MODEL ONCE
const Scheme = mongoose.model("Scheme", schemeSchema);

// ✅ EXPORT PROPERLY
export default Scheme;