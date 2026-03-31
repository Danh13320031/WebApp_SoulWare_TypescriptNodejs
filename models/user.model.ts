import mongoose from "mongoose";
import slugify from "slugify";
const Schema = mongoose.Schema;

const objSchema = {
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  refreshToken: { type: String, required: false },
  avatar: { type: String, required: true },
  description: { type: String, required: false },
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive"],
    default: "active",
  },
  slug: { type: String, index: true, unique: true },
  position: { type: Number, required: true, default: 1 },
  address: { type: String },
  birthday: { type: Date },
  deleted: { type: Boolean, required: true, default: false },
  deletedAt: { type: Date, default: null },
  roleId: {
    type: Schema.Types.ObjectId,
    ref: "UserRole",
    required: false,
    default: null,
  },
};

const UserSchema = new Schema(objSchema, { timestamps: true });

UserSchema.pre("save", async function () {
  if (!this.isModified("fullName")) return;

  const User = this.constructor as any;

  const baseSlug = slugify(this.fullName, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  while (await User.findOne({ slug })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  this.slug = slug;
});

const UserModel = mongoose.model("User", UserSchema, "User");

export default UserModel;
