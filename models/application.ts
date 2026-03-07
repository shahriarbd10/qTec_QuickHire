import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const ApplicationSchema = new Schema(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    resumeLink: { type: String, required: true },
    coverNote: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export type ApplicationDocument = InferSchemaType<typeof ApplicationSchema> & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};

export const ApplicationModel =
  (models.Application as Model<ApplicationDocument>) ||
  model("Application", ApplicationSchema);
