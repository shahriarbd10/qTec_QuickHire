import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const CompanySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    location: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    logoUrl: { type: String, default: "" },
    logoPublicId: { type: String, default: "" },
  },
  {
    timestamps: true,
  },
);

export type CompanyDocument = InferSchemaType<typeof CompanySchema> & {
  _id: string;
};

export const CompanyModel =
  (models.Company as Model<CompanyDocument>) || model("Company", CompanySchema);
