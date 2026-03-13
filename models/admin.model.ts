import mongoose from "mongoose";
import slugify from "slugify";
const Schema = mongoose.Schema;

const objSchema = {
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  slug: { type: String, index: true, unique: true },
  avatar: { type: String, required: true },
  fullName: { type: String, required: true },
  birthday: { type: Date },
  address: { type: String },
  description: { type: String },
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive"],
    default: "active",
  },
  position: { type: Number, required: true, default: 1 },
  deleted: { type: Boolean, required: true, default: false },
  deletedAt: { type: Date, default: null },
  roleId: { type: Schema.Types.ObjectId, ref: "AdminRole", required: false },
};

const AdminSchema = new Schema(objSchema, { timestamps: true });

AdminSchema.pre("save", async function () {
  if (!this.isModified("fullName")) return;

  const Song = this.constructor as any;

  const baseSlug = slugify(this.fullName, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  while (await Song.findOne({ slug })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  this.slug = slug;
});

const AdminModel = mongoose.model("Admin", AdminSchema, "Admin");

export default AdminModel;
