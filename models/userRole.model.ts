import mongoose from "mongoose";
import slugify from "slugify";
const Schema = mongoose.Schema;

const objSchema = {
  name: { type: String, required: true },
  slug: { type: String, index: true, unique: true },
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive"],
    default: "active",
  },
  permissions: { type: [String], required: true, default: [] },
  description: { type: String },
  position: { type: Number, required: true, default: 1 },
  deleted: { type: Boolean, required: true, default: false },
  deletedAt: { type: Date, default: null },
};

const UserRoleSchema = new Schema(objSchema, { timestamps: true });

UserRoleSchema.pre("save", async function () {
  if (!this.isModified("name")) return;

  const UserRole = this.constructor as any;

  let slug = slugify(this.name, { lower: true, strict: true });
  let newSlug = slug;
  let count = 1;

  while (await UserRole.findOne({ slug })) {
    slug = `${newSlug}-${count}`;
    count++;
  }

  this.slug = slug;
});

const UserRoleModel = mongoose.model("UserRole", UserRoleSchema, "UserRole");

export default UserRoleModel;
