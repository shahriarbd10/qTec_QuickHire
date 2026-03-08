import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "admin" },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", default: null },
    company: { type: String, default: "", trim: true },
    avatarUrl: { type: String, default: "" },
    avatarPublicId: { type: String, default: "" },
    emailVerifiedAt: { type: Date, default: null },
    emailVerificationOtpHash: { type: String, default: null },
    emailVerificationOtpExpiresAt: { type: Date, default: null },
    emailVerificationSentAt: { type: Date, default: null },
    emailVerificationSendAttempts: { type: [Date], default: [] },
    passwordResetOtpHash: { type: String, default: null },
    passwordResetOtpExpiresAt: { type: Date, default: null },
    passwordResetSentAt: { type: Date, default: null },
    passwordResetSendAttempts: { type: [Date], default: [] },
  },
  {
    timestamps: true,
  },
);

export type UserDocument = InferSchemaType<typeof UserSchema> & {
  _id: string;
};

export const UserModel = (models.User as Model<UserDocument>) || model("User", UserSchema);
