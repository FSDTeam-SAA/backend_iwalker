import app from "./src/app";
import { port } from "./src/config/config";
import configDb from "./src/dbConfig/configDb";

// connect db
configDb();

app.listen(port, () => console.log(`http://localhost:${port}`));
