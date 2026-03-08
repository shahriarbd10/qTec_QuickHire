import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const JobSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    summary: { type: String, required: true },
    logoText: { type: String, required: true },
    logoUrl: { type: String, default: "" },
    logoPublicId: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    latest: { type: Boolean, default: false },
    color: { type: String, required: true },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: true,
  },
);

export type JobDocument = InferSchemaType<typeof JobSchema> & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};

export const JobModel = (models.Job as Model<JobDocument>) || model("Job", JobSchema);
