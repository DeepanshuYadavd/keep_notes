import app from "./app.js";
import { db } from "./config/db.js";

//  database:
db();

//  localhost:
app.listen(process.env.PORT, () => {
  console.log(`localhost running at port ${process.env.PORT}`);
});
