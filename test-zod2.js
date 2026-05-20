const { z } = require("zod");
const registerSchema = z.object({
    fullName: z.string().min(3, "nameTooShort"),
});

try {
  registerSchema.parse({});
} catch(e) {
  console.log(Object.keys(e));
  console.log(e.name);
  console.log(e.issues);
}
