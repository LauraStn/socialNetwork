const validator = require("validator");
const { verifyToken } = require("../Utils/verifyToken");

const verifRegisterData = async (req, res, next) => {
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const email = req.body.email;

  if (!validator.isAlpha(last_name, undefined, { ignore: " -" })) {
    return res.json({ message: "le nom doit contenir que des lettres" });
  }
  if (!validator.isAlpha(first_name, undefined, { ignore: " -" })) {
    return res.json({ message: "le nom doit contenir que des lettres" });
  }
  if (!validator.isEmail(email)) {
    return res.json({ message: "L'email doit avoir un format d'email" });
  }

  req.first_name = first_name;
  req.last_name = last_name;
  req.email = email;

  next();
};

const verifUserUpdate = async (req, res, next) => {
  const verify = await verifyToken(req);
  if (!verify) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const id = verify.user_id;
  const { first_name, last_name, email } = req.body;
  let data = [];
  let values = [];
  if (first_name) {
    data.push("first_name= ?");
    values.push(first_name);
  }
  if (last_name) {
    data.push("last_name= ?");
    values.push(last_name);
  }
  if (email) {
    data.push("email= ?");
    values.push(email);
  }

  console.log(values);
  if (data.length == 0) {
    return res.json({ message: "vous avez modifier aucune donnée" });
  }
  values.push(id);
  data = data.join(",");
  req.data = data;
  req.values = values;
  next();
};

module.exports = { verifRegisterData, verifUserUpdate };
